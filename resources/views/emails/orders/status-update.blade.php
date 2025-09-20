<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #000000;
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.8;
        }
        .content {
            padding: 30px;
        }
        .status-update {
            background-color: #e3f2fd;
            border: 1px solid #bbdefb;
            color: #1976d2;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 30px;
            text-align: center;
        }
        .status-update h2 {
            margin: 0 0 10px 0;
            font-size: 24px;
        }
        .status-update p {
            margin: 0;
            font-size: 16px;
        }
        .order-summary {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .order-summary h2 {
            margin-top: 0;
            color: #333;
            border-bottom: 2px solid #65644A;
            padding-bottom: 10px;
        }
        .order-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }
        .order-detail {
            display: flex;
            justify-content: space-between;
        }
        .order-detail strong {
            color: #65644A;
        }
        .order-items {
            margin-top: 20px;
        }
        .order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #dee2e6;
        }
        .order-item:last-child {
            border-bottom: none;
        }
        .item-details {
            flex: 1;
        }
        .item-name {
            font-weight: bold;
            color: #333;
        }
        .item-quantity {
            color: #666;
            font-size: 14px;
        }
        .item-price {
            font-weight: bold;
            color: #65644A;
        }
        .total-section {
            border-top: 2px solid #65644A;
            margin-top: 20px;
            padding-top: 20px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .total-row.final {
            font-size: 18px;
            font-weight: bold;
            color: #65644A;
            border-top: 1px solid #dee2e6;
            padding-top: 10px;
        }
        .shipping-info {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .shipping-info h3 {
            margin-top: 0;
            color: #333;
            border-bottom: 2px solid #65644A;
            padding-bottom: 10px;
        }
        .next-steps {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .next-steps h3 {
            margin-top: 0;
            color: #856404;
        }
        .step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
        }
        .step-number {
            background-color: #856404;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            margin-right: 15px;
            flex-shrink: 0;
        }
        .step-content h4 {
            margin: 0 0 5px 0;
            color: #856404;
        }
        .step-content p {
            margin: 0;
            color: #666;
            font-size: 14px;
        }
        .footer {
            background-color: #000000;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .footer p {
            margin: 5px 0;
            font-size: 14px;
        }
        .footer a {
            color: #65644A;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        .cta-button {
            display: inline-block;
            background-color: #65644A;
            color: #ffffff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
        }
        .cta-button:hover {
            background-color: #5a5940;
        }
        @media (max-width: 600px) {
            .order-details {
                grid-template-columns: 1fr;
            }
            .content {
                padding: 20px;
            }
            .header {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>PaperView Online</h1>
            <p>Your Fashion Destination</p>
        </div>

        <div class="content">
            <div class="status-update">
                <h2>Order Status Updated</h2>
                <p>Your order #{{ $order->order_number }} has been updated to <strong>{{ ucfirst($newStatus) }}</strong></p>
            </div>

            <div class="order-summary">
                <h2>Order Summary</h2>
                <div class="order-details">
                    <div class="order-detail">
                        <span>Order Number:</span>
                        <strong>{{ $order->order_number }}</strong>
                    </div>
                    <div class="order-detail">
                        <span>Order Date:</span>
                        <strong>{{ $order->created_at->format('M d, Y') }}</strong>
                    </div>
                    <div class="order-detail">
                        <span>Current Status:</span>
                        <strong>{{ ucfirst($newStatus) }}</strong>
                    </div>
                    <div class="order-detail">
                        <span>Total Amount:</span>
                        <strong>{{ $order->formatted_total }}</strong>
                    </div>
                </div>

                <div class="order-items">
                    <h3>Order Items</h3>
                    @foreach($order->orderItems as $item)
                        <div class="order-item">
                            <div class="item-details">
                                <div class="item-name">{{ $item->product_name }}</div>
                                <div class="item-quantity">Quantity: {{ $item->quantity }}</div>
                            </div>
                            <div class="item-price">₦{{ number_format($item->total_price, 2) }}</div>
                        </div>
                    @endforeach
                </div>

                <div class="total-section">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>{{ $order->formatted_subtotal }}</span>
                    </div>
                    <div class="total-row">
                        <span>Shipping:</span>
                        <span>{{ $order->formatted_shipping_cost }}</span>
                    </div>
                    <div class="total-row">
                        <span>Tax:</span>
                        <span>{{ $order->formatted_tax }}</span>
                    </div>
                    @if($order->discount > 0)
                        <div class="total-row">
                            <span>Discount:</span>
                            <span style="color: #28a745;">-{{ $order->formatted_discount }}</span>
                        </div>
                    @endif
                    <div class="total-row final">
                        <span>Total:</span>
                        <span>{{ $order->formatted_total }}</span>
                    </div>
                </div>
            </div>

            <div class="shipping-info">
                <h3>Shipping Information</h3>
                <p><strong>{{ $order->shipping_name }}</strong></p>
                <p>{{ $order->shipping_email }}</p>
                @if($order->shipping_phone)
                    <p>{{ $order->shipping_phone }}</p>
                @endif
                <p>{{ $order->shipping_address }}</p>
                <p>{{ $order->shipping_city }}, {{ $order->shipping_state }}</p>
                <p>{{ $order->shipping_country }} {{ $order->shipping_zip_code }}</p>
            </div>

            @if($newStatus === 'shipped')
                <div class="next-steps">
                    <h3>What's Next?</h3>
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Package in Transit</h4>
                            <p>Your order is now on its way to you. You'll receive tracking information soon.</p>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Delivery</h4>
                            <p>Your order will be delivered within 3-7 business days.</p>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Enjoy Your Purchase</h4>
                            <p>Once delivered, enjoy your new items from PaperView Online!</p>
                        </div>
                    </div>
                </div>
            @elseif($newStatus === 'delivered')
                <div class="next-steps">
                    <h3>Order Delivered!</h3>
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Check Your Items</h4>
                            <p>Please inspect your items to ensure everything is as expected.</p>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Leave a Review</h4>
                            <p>We'd love to hear about your experience with our products.</p>
                        </div>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Shop Again</h4>
                            <p>Discover more amazing fashion items in our collection.</p>
                        </div>
                    </div>
                </div>
            @endif

            <div style="text-align: center;">
                <a href="{{ route('index') }}" class="cta-button">Continue Shopping</a>
            </div>
        </div>

        <div class="footer">
            <p>Thank you for choosing PaperView Online!</p>
            <p>If you have any questions, please contact us at <a href="mailto:support@paperviewonline.com">support@paperviewonline.com</a></p>
            <p>&copy; {{ date('Y') }} PaperView Online. All rights reserved.</p>
        </div>
    </div>
</body>
</html> 