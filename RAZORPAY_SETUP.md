# Razorpay Integration Setup for RecallIQ

This document provides instructions for setting up the Razorpay payment integration for the RecallIQ credit system.

## Prerequisites

1. A Razorpay account (sign up at [razorpay.com](https://razorpay.com))
2. Razorpay API keys (Key ID and Key Secret)

## Configuration Steps

### 1. Set Environment Variables

Add the following environment variables to your Supabase project:

1. Log in to your Supabase dashboard
2. Go to Project Settings > API
3. Scroll down to "Project Secrets"
4. Add the following secrets:
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret

### 2. Add Frontend Environment Variable

Create or update your `.env` file in the project root with:

```
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Deploy Supabase Edge Functions

Deploy the Razorpay-related Edge Functions to your Supabase project:

```bash
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
```

### 4. Run Database Migrations

Apply the database migration to create the payment_records table:

```bash
supabase db push
```

## Testing the Integration

1. Use Razorpay's test mode for development
2. Test credit purchases with Razorpay's test card numbers:
   - Card Number: 4111 1111 1111 1111
   - Expiry: Any future date
   - CVV: Any 3-digit number
   - Name: Any name

## Troubleshooting

### Common Issues

1. **Payment verification fails**: Check that your Razorpay Key Secret is correctly set in the environment variables.

2. **Order creation fails**: Ensure your Razorpay account is properly set up and the Key ID is correct.

3. **Credits not added after payment**: Check the Supabase logs for the `verify-razorpay-payment` function to see if there are any errors when calling the `add_credits` RPC function.

### Logs

To view logs for the Edge Functions:

```bash
supabase functions logs create-razorpay-order
supabase functions logs verify-razorpay-payment
```

## Production Considerations

1. Ensure you switch to production Razorpay keys when deploying to production
2. Implement proper error handling and retry mechanisms for payment failures
3. Consider adding a webhook endpoint to handle asynchronous payment notifications from Razorpay