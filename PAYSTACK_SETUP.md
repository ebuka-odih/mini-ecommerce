# Paystack Integration Setup Guide

## Environment Variables

Add these to your `.env` file:

```env
# Paystack Configuration
PAYSTACK_PUBLIC_KEY=pk_test_your_test_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_test_secret_key_here
PAYSTACK_MERCHANT_EMAIL=your-email@example.com

# Email Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="PaperView Online"
```

## Paystack Test Keys

### Getting Test Keys:
1. Go to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Sign up/Login to your account
3. Go to Settings > API Keys & Webhooks
4. Copy your Test Public Key (starts with `pk_test_`)
5. Copy your Test Secret Key (starts with `sk_test_`)

### Test Card Numbers:
- **Successful Payment:**
  - Card: 4084084084084081
  - CVV: 408
  - Expiry: Any future date
  - PIN: 1234

- **Failed Payment:**
  - Card: 4084084084084085
  - CVV: 408
  - Expiry: Any future date
  - PIN: 1234

## Features Implemented:

### Backend:
- ✅ PaystackService for transaction handling
- ✅ PaymentController for payment flow
- ✅ CheckoutController for order creation
- ✅ Order confirmation emails
- ✅ Webhook handling for payment verification

### Frontend:
- ✅ Checkout page with form validation
- ✅ Payment integration with Paystack
- ✅ Order success/failure pages
- ✅ Email templates for order confirmation

### Email System:
- ✅ Order confirmation emails for customers
- ✅ Order status update emails
- ✅ Professional email templates
- ✅ Admin notification system

## Testing the Integration:

1. **Set up environment variables** with your Paystack test keys
2. **Test the checkout flow:**
   - Add items to cart
   - Go to checkout
   - Fill in shipping information
   - Click "Complete Order"
   - You'll be redirected to Paystack payment page
   - Use test card numbers to complete payment
3. **Check email notifications:**
   - Customer receives order confirmation email
   - Admin receives order notification email

## Production Setup:

1. **Replace test keys with live keys** in production
2. **Set up webhook URL** in Paystack dashboard:
   - URL: `https://yourdomain.com/payment/webhook`
   - Events: `charge.success`
3. **Configure email settings** for production
4. **Test with real payment methods** (small amounts)

## Security Notes:

- Never commit secret keys to version control
- Use environment variables for all sensitive data
- Enable webhook signature verification
- Use HTTPS in production
- Regularly rotate API keys
