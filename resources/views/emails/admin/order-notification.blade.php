<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Notification</title>
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
            background-color: #1f2937;
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
        .alert-message {
            background-color: #dbeafe;
            border: 1px solid #93c5fd;
            color: #1e40af;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 30px;
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
            border-bottom: 2px solid #1f2937;
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
            color: #1f2937;
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
            color: #1f2937;
        }
        .total-section {
            border-top: 2px solid #1f2937;
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
            color: #1f2937;
            border-top: 1px solid #dee2e6;
            padding-top: 10px;
        }
        .customer-info {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .customer-info h3 {
            margin-top: 0;
            color: #333;
            border-bottom: 2px solid #1f2937;
            padding-bottom: 10px;
        }
        .action-buttons {
            background-color: #e0f2fe;
            border: 1px solid #81d4fa;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .action-buttons h3 {
            margin-top: 0;
            color: #0277bd;
        }
        .cta-button {
            display: inline-block;
            background-color: #1f2937;
            color: #ffffff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 10px 10px 10px 0;
        }
        .cta-button:hover {
            background-color: #374151;
        }
        .cta-button.secondary {
            background-color: #6b7280;
        }
        .cta-button.secondary:hover {
            background-color: #4b5563;
        }
        .footer {
            background-color: #1f2937;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .footer p {
            margin: 5px 0;
            font-size: 14px;
        }
        .footer a {
            color: #9ca3af;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
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
            <h1>PaperView Admin</h1>
            <p>New Order Notification</p>
        </div>

        <div class="content">
            <div class="alert-message">
                <h2>🛍️ New Order Received!</h2>
                <p>A new order has been placed and requires your attention.</p>
            </div>

            <div class="order-summary">
                <h2>Order Details</h2>
                <div class="order-details">
                    <div class="order-detail">
                        <span>Order Number:</span>
                        <strong>{{ $order->order_number }}</strong>
                    </div>
                    <div class="order-detail">
                        <span>Order Date:</span>
                        <strong>{{ $order->created_at->format('M d, Y H:i') }}</strong>
                    </div>
                    <div class="order-detail">
                        <span>Payment Status:</span>
                        <strong style="color: #28a745;">{{ ucfirst($order->payment_status) }}</strong>
                    </div>
                    <div class="order-detail">
                        <span>Order Status:</span>
                        <strong>{{ ucfirst($order->status) }}</strong>
                    </div>
                </div>

                <div class="order-items">
                    <h3>Order Items</h3>
                    @foreach($orderItems as $item)
                        <div class="order-item">
                            <div class="item-details">
                                <div class="item-name">{{ $item->product_name }}</div>
                                <div class="item-quantity">Quantity: {{ $item->quantity }} | SKU: {{ $item->product_sku }}</div>
                            </div>
                            <div class="item-price">₦{{ number_format($item->total_price, 2) }}</div>
                        </div>
                    @endforeach
                </div>

                <div class="total-section">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>₦{{ number_format($order->subtotal, 2) }}</span>
                    </div>
                    <div class="total-row">
                        <span>Shipping:</span>
                        <span>₦{{ number_format($order->shipping_cost, 2) }}</span>
                    </div>
                    <div class="total-row">
                        <span>Tax:</span>
                        <span>₦{{ number_format($order->tax, 2) }}</span>
                    </div>
                    @if($order->discount > 0)
                        <div class="total-row">
                            <span>Discount:</span>
                            <span style="color: #28a745;">-₦{{ number_format($order->discount, 2) }}</span>
                        </div>
                    @endif
                    <div class="total-row final">
                        <span>Total:</span>
                        <span>₦{{ number_format($order->total, 2) }}</span>
                    </div>
                </div>
            </div>

            <div class="customer-info">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {{ $order->shipping_name }}</p>
                <p><strong>Email:</strong> {{ $order->shipping_email }}</p>
                @if($order->shipping_phone)
                    <p><strong>Phone:</strong> {{ $order->shipping_phone }}</p>
                @endif
                <p><strong>Address:</strong> {{ $order->shipping_address }}</p>
                <p><strong>City:</strong> {{ $order->shipping_city }}, {{ $order->shipping_state }}</p>
                <p><strong>Country:</strong> {{ $order->shipping_country }} {{ $order->shipping_zip_code }}</p>
            </div>

            <div class="action-buttons">
                <h3>Quick Actions</h3>
                <p>Use these links to manage the order:</p>
                <a href="{{ route('admin.orders.show', $order->id) }}" class="cta-button">View Order Details</a>
                <a href="{{ route('admin.orders.index') }}" class="cta-button secondary">View All Orders</a>
            </div>
        </div>

        <div class="footer">
            <p>This is an automated notification from PaperView Online</p>
            <p>Please log in to your admin panel to manage this order</p>
            <p>&copy; {{ date('Y') }} PaperView Online. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
