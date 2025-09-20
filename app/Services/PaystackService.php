<?php

namespace App\Services;

use App\Models\Order;
use App\Mail\OrderConfirmation;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PaystackService
{
    protected $secretKey;
    protected $publicKey;
    protected $baseUrl = 'https://api.paystack.co';

    public function __construct()
    {
        $this->secretKey = config('services.paystack.secret_key');
        $this->publicKey = config('services.paystack.public_key');
    }

    /**
     * Initialize a Paystack transaction
     */
    public function initializeTransaction(Order $order, $callbackUrl = null)
    {
        try {
            Log::info('PaystackService: Starting transaction initialization', [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'total' => $order->total,
                'currency' => $order->currency,
                'email' => $order->shipping_email
            ]);

            $amount = $order->total * 100; // Convert to kobo (smallest currency unit)
            
            $data = [
                'amount' => $amount,
                'email' => $order->shipping_email,
                'reference' => $order->order_number,
                'callback_url' => $callbackUrl ?? route('payment.callback'),
                'currency' => $order->currency,
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->shipping_name,
                    'custom_fields' => [
                        [
                            'display_name' => 'Order Number',
                            'variable_name' => 'order_number',
                            'value' => $order->order_number
                        ],
                        [
                            'display_name' => 'Customer Name',
                            'variable_name' => 'customer_name',
                            'value' => $order->shipping_name
                        ]
                    ]
                ]
            ];

            Log::info('PaystackService: Request data prepared', [
                'data' => $data,
                'secret_key_length' => strlen($this->secretKey),
                'public_key_length' => strlen($this->publicKey)
            ]);

            Log::info('PaystackService: Making HTTP request to Paystack', [
                'url' => $this->baseUrl . '/transaction/initialize',
                'headers' => [
                    'Authorization' => 'Bearer ' . substr($this->secretKey, 0, 10) . '...',
                    'Content-Type' => 'application/json'
                ]
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/transaction/initialize', $data);

            Log::info('PaystackService: HTTP response received', [
                'status_code' => $response->status(),
                'response_body' => $response->body(),
                'is_successful' => $response->successful()
            ]);

            if ($response->successful()) {
                $result = $response->json();
                
                Log::info('PaystackService: Response parsed', [
                    'result' => $result
                ]);
                
                if ($result['status']) {
                    // Update order with payment reference
                    $order->update([
                        'transaction_id' => $result['data']['reference']
                    ]);
                    
                    Log::info('PaystackService: Order updated with transaction_id', [
                        'order_id' => $order->id,
                        'transaction_id' => $result['data']['reference']
                    ]);
                    
                    return [
                        'success' => true,
                        'authorization_url' => $result['data']['authorization_url'],
                        'reference' => $result['data']['reference'],
                        'access_code' => $result['data']['access_code']
                    ];
                }
            }

            Log::error('Paystack initialization failed', [
                'order_id' => $order->id,
                'status_code' => $response->status(),
                'response_body' => $response->body(),
                'response_json' => $response->json()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to initialize payment: ' . $response->status() . ' - ' . $response->body()
            ];

        } catch (\Exception $e) {
            Log::error('Paystack initialization error', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Payment initialization error'
            ];
        }
    }

    /**
     * Verify a Paystack transaction
     */
    public function verifyTransaction($reference)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->get($this->baseUrl . '/transaction/verify/' . $reference);

            if ($response->successful()) {
                $result = $response->json();
                
                if ($result['status'] && $result['data']['status'] === 'success') {
                    return [
                        'success' => true,
                        'data' => $result['data']
                    ];
                }
            }

            Log::error('Paystack verification failed', [
                'reference' => $reference,
                'response' => $response->json()
            ]);

            return [
                'success' => false,
                'message' => 'Transaction verification failed'
            ];

        } catch (\Exception $e) {
            Log::error('Paystack verification error', [
                'reference' => $reference,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Transaction verification error'
            ];
        }
    }

    /**
     * Handle Paystack webhook
     */
    public function handleWebhook($payload, $signature)
    {
        try {
            // Verify webhook signature
            if (!$this->verifyWebhookSignature($payload, $signature)) {
                Log::error('Invalid webhook signature');
                return false;
            }

            $event = json_decode($payload, true);
            
            if ($event['event'] === 'charge.success') {
                $transaction = $event['data'];
                $reference = $transaction['reference'];
                
                // Find order by reference
                $order = Order::where('transaction_id', $reference)->first();
                
                if (!$order) {
                    Log::error('Order not found for webhook', ['reference' => $reference]);
                    return false;
                }

                // Update order payment status
                $order->update([
                    'payment_status' => 'paid',
                    'paid_at' => now(),
                    'status' => 'processing'
                ]);

                // Send order confirmation email
                try {
                    Mail::to($order->shipping_email)->send(new OrderConfirmation($order));
                    Log::info('Order confirmation email sent via webhook', [
                        'order_id' => $order->id,
                        'email' => $order->shipping_email
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to send order confirmation email via webhook', [
                        'order_id' => $order->id,
                        'email' => $order->shipping_email,
                        'error' => $e->getMessage()
                    ]);
                }
                
                Log::info('Payment successful via webhook', [
                    'order_id' => $order->id,
                    'reference' => $reference
                ]);

                return true;
            }

            return false;

        } catch (\Exception $e) {
            Log::error('Webhook processing error', [
                'error' => $e->getMessage(),
                'payload' => $payload
            ]);

            return false;
        }
    }

    /**
     * Verify webhook signature
     */
    protected function verifyWebhookSignature($payload, $signature)
    {
        $computedSignature = hash_hmac('sha512', $payload, $this->secretKey);
        return hash_equals($computedSignature, $signature);
    }

    /**
     * Get Paystack public key
     */
    public function getPublicKey()
    {
        return $this->publicKey;
    }

    /**
     * Format amount for display
     */
    public function formatAmount($amount)
    {
        return number_format($amount / 100, 2); // Convert from kobo to naira
    }
} 