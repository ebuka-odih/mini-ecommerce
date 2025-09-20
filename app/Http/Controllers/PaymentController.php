<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\PaystackService;
use App\Mail\OrderConfirmation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{
    protected $paystackService;

    public function __construct(PaystackService $paystackService)
    {
        $this->paystackService = $paystackService;
    }

    /**
     * Show payment page
     */
    public function show(Order $order)
    {
        // Debug logging
        Log::info('Payment page access attempt', [
            'order_id' => $order->id,
            'order_user_id' => $order->user_id,
            'auth_user_id' => auth()->id(),
            'is_authenticated' => auth()->check(),
            'payment_status' => $order->payment_status
        ]);

        // Check if order belongs to current user (if authenticated)
        // Allow access if user is not authenticated (guest checkout) or if order belongs to authenticated user
        if (auth()->check() && $order->user_id && (string)$order->user_id !== (string)auth()->id()) {
            Log::warning('Unauthorized payment access attempt', [
                'order_id' => $order->id,
                'order_user_id' => $order->user_id,
                'auth_user_id' => auth()->id(),
                'order_user_id_type' => gettype($order->user_id),
                'auth_user_id_type' => gettype(auth()->id())
            ]);
            abort(403, 'Unauthorized access to order.');
        }

        // Check if order is already paid
        if ($order->payment_status === 'paid') {
            return redirect()->route('order.success', $order)
                ->with('info', 'This order has already been paid.');
        }

        // Check if order is pending payment
        if ($order->payment_status !== 'pending') {
            return redirect()->route('order.failed', $order)
                ->with('error', 'This order cannot be paid.');
        }

        return view('pages.payment', compact('order'));
    }

    /**
     * Initialize payment
     */
    public function initialize(Request $request, Order $order)
    {
        Log::info('Payment initialization request', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'is_ajax' => $request->ajax(),
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'headers' => $request->headers->all(),
            'x_requested_with' => $request->header('X-Requested-With'),
            'accept' => $request->header('Accept')
        ]);

        // Check if order belongs to current user (if authenticated)
        // Allow access if user is not authenticated (guest checkout) or if order belongs to authenticated user
        if (auth()->check() && $order->user_id && (string)$order->user_id !== (string)auth()->id()) {
            abort(403, 'Unauthorized access to order.');
        }

        // Check if order is already paid
        if ($order->payment_status === 'paid') {
            if ($request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order has already been paid.'
                ]);
            }
            return back()->with('error', 'Order has already been paid.');
        }

        try {
            Log::info('Calling PaystackService initializeTransaction', [
                'order_id' => $order->id,
                'order_total' => $order->total,
                'order_currency' => $order->currency
            ]);

            $result = $this->paystackService->initializeTransaction($order);

            Log::info('PaystackService result', [
                'order_id' => $order->id,
                'result' => $result
            ]);

            if ($result['success']) {
                // Check if it's an AJAX request or if we should return JSON
                $isAjax = $request->ajax() || 
                          $request->header('X-Requested-With') === 'XMLHttpRequest' ||
                          $request->header('Accept') === 'application/json';
                
                if ($isAjax) {
                    return response()->json([
                        'success' => true,
                        'authorization_url' => $result['authorization_url'],
                        'reference' => $result['reference']
                    ]);
                }
                // For form submissions, redirect directly to Paystack
                return redirect()->away($result['authorization_url']);
            } else {
                // Check if it's an AJAX request or if we should return JSON
                $isAjax = $request->ajax() || 
                          $request->header('X-Requested-With') === 'XMLHttpRequest' ||
                          $request->header('Accept') === 'application/json';
                
                if ($isAjax) {
                    return response()->json([
                        'success' => false,
                        'message' => $result['message']
                    ]);
                }
                return back()->with('error', $result['message']);
            }

        } catch (\Exception $e) {
            Log::error('Payment initialization error', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            // Show detailed error in development, generic message in production
            $errorMessage = config('app.debug') 
                ? 'Payment Error: ' . $e->getMessage() . ' (Line: ' . $e->getLine() . ' in ' . basename($e->getFile()) . ')'
                : 'An error occurred while initializing payment.';

            if ($request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => $errorMessage
                ]);
            }
            return back()->with('error', $errorMessage);
        }
    }

    /**
     * Handle payment callback
     */
    public function callback(Request $request)
    {
        $reference = $request->query('reference');
        
        Log::info('Payment callback received', [
            'reference' => $reference,
            'all_params' => $request->all(),
            'url' => $request->fullUrl()
        ]);
        
        if (!$reference) {
            return redirect()->route('order.failed')
                ->with('error', 'Invalid payment reference.');
        }

        try {
            $result = $this->paystackService->verifyTransaction($reference);

            if ($result['success']) {
                $transaction = $result['data'];
                
                // Find order by reference (try both transaction_id and order_number)
                $order = Order::where('transaction_id', $reference)
                    ->orWhere('order_number', $reference)
                    ->first();
                
                if (!$order) {
                    Log::error('Order not found for payment callback', ['reference' => $reference]);
                    return redirect()->route('order.failed')
                        ->with('error', 'Order not found.');
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
                    Log::info('Order confirmation email sent', [
                        'order_id' => $order->id,
                        'email' => $order->shipping_email
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to send order confirmation email', [
                        'order_id' => $order->id,
                        'email' => $order->shipping_email,
                        'error' => $e->getMessage()
                    ]);
                }

                return redirect()->route('order.success', $order)
                    ->with('success', 'Payment successful! Your order has been confirmed.');

            } else {
                return redirect()->route('order.failed')
                    ->with('error', 'Payment verification failed.');
            }

        } catch (\Exception $e) {
            Log::error('Payment callback error', [
                'reference' => $reference,
                'error' => $e->getMessage()
            ]);

            // Show detailed error in development, generic message in production
            $errorMessage = config('app.debug') 
                ? 'Payment Callback Error: ' . $e->getMessage() . ' (Line: ' . $e->getLine() . ' in ' . basename($e->getFile()) . ')'
                : 'An error occurred while processing payment.';

            return redirect()->route('order.failed')
                ->with('error', $errorMessage);
        }
    }

    /**
     * Handle Paystack webhook
     */
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $signature = $request->header('X-Paystack-Signature');

        if (!$signature) {
            Log::error('Missing Paystack webhook signature');
            return response('Unauthorized', 401);
        }

        $result = $this->paystackService->handleWebhook($payload, $signature);

        if ($result) {
            return response('OK', 200);
        } else {
            return response('Error processing webhook', 400);
        }
    }

    /**
     * Show payment success page
     */
    public function success(Order $order)
    {
        // Check if order belongs to current user (if authenticated)
        // Allow access if user is not authenticated (guest checkout) or if order belongs to authenticated user
        if (auth()->check() && $order->user_id && (string)$order->user_id !== (string)auth()->id()) {
            abort(403, 'Unauthorized access to order.');
        }

        return view('pages.payment-success', compact('order'));
    }

    /**
     * Show payment failed page
     */
    public function failed(Order $order = null)
    {
        return view('pages.payment-failed', compact('order'));
    }
} 