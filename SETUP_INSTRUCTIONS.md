# 🚀 GNOSIS Checkout Setup Instructions

## ✅ Your Payment System is Already Complete!

The checkout button is **already functional** and connected to Paystack! You just need to configure your API keys.

## 🔑 Step 1: Get Paystack API Keys

1. Go to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Sign up/Login to your account
3. Go to **Settings > API Keys & Webhooks**
4. Copy your **Test Public Key** (starts with `pk_test_`)
5. Copy your **Test Secret Key** (starts with `sk_test_`)

## ⚙️ Step 2: Configure Environment Variables

Create a `.env` file in your project root and add these variables:

```env
# Paystack Configuration
PAYSTACK_PUBLIC_KEY=pk_test_your_actual_test_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_actual_test_secret_key_here
PAYSTACK_MERCHANT_EMAIL=your-email@example.com

# Email Configuration (for order confirmations)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="GNOSIS"

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Application Configuration
APP_NAME="GNOSIS"
APP_ENV=local
APP_KEY=base64:your_app_key_here
APP_DEBUG=true
APP_URL=http://localhost
```

## 🧪 Step 3: Test the Payment Flow

### Test Card Numbers (for testing):
- **Successful Payment:**
  - Card: `4084084084084081`
  - CVV: `408`
  - Expiry: Any future date
  - PIN: `1234`

- **Failed Payment:**
  - Card: `4084084084084085`
  - CVV: `408`
  - Expiry: Any future date
  - PIN: `1234`

### Testing Steps:
1. Add items to your cart
2. Go to `/checkout`
3. Fill in shipping information
4. Click "Complete Order - ₦55,000" (or your actual total)
5. You'll be redirected to Paystack payment page
6. Use test card numbers to complete payment
7. Check your email for order confirmation

## 🎯 What Happens When You Click "Complete Order":

1. **Form Validation**: Checks all required fields
2. **Order Creation**: Creates order in database with unique order number
3. **Payment Initialization**: Calls Paystack API to create payment session
4. **Redirect to Paystack**: User is taken to secure Paystack payment page
5. **Payment Processing**: User enters card details on Paystack
6. **Callback Handling**: Paystack sends payment result back to your site
7. **Order Confirmation**: Updates order status and sends confirmation emails

## 📧 Email Notifications

The system automatically sends:
- **Order confirmation email** to customer
- **Admin notification email** to store owner

## 🔒 Security Features

- ✅ CSRF protection
- ✅ Secure API key storage
- ✅ Webhook signature verification
- ✅ Payment status tracking
- ✅ Order validation and stock management

## 🚀 Production Setup

When ready for live payments:
1. Replace test keys with live keys in Paystack dashboard
2. Set up webhook URL: `https://yourdomain.com/payment/webhook`
3. Configure production email settings
4. Test with small real transactions

## 🆘 Need Help?

If you encounter any issues:
1. Check the Laravel logs in `storage/logs/laravel.log`
2. Verify your API keys are correct
3. Ensure your database is properly configured
4. Check that your email settings work

Your checkout system is production-ready! 🎉





