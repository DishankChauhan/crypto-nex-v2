# CryptoNex Merchant Integration Guide

## Quick Start

1. Register as a merchant:
```bash
curl -X POST https://api.cryptonex.com/v1/merchants/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Your Business", "website": "https://yourdomain.com"}'
```

2. Get your API key from the dashboard.

3. Add the payment button to your website:

```html
<script src="https://cdn.cryptonex.com/v1/payment-button.js"></script>

<button
  class="cryptonex-pay"
  data-amount="0.1"
  data-currency="ETH"
  data-merchant-id="your-merchant-id"
  data-description="Product purchase"
>
  Pay with Crypto
</button>
```

4. Handle payment callbacks:

```javascript
window.addEventListener('cryptonexPayment', function(e) {
  if (e.detail.status === 'completed') {
    // Payment successful
    console.log('Transaction hash:', e.detail.transactionHash);
  }
});
```

## Integration Methods

### 1. Payment Button

Easiest way to accept crypto payments. Just add our script and button to your page.

### 2. Payment Links

Generate payment links programmatically:

```javascript
const response = await fetch('https://api.cryptonex.com/v1/payment-links', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    amount: '0.1',
    currency: 'ETH',
    description: 'Product purchase'
  })
});

const { paymentUrl } = await response.json();
```

### 3. API Integration

For full control, use our REST API:

```javascript
// Initialize payment
const payment = await cryptonex.createPayment({
  amount: '0.1',
  currency: 'ETH',
  description: 'Product purchase',
  redirectUrl: 'https://yourdomain.com/thank-you'
});

// Check payment status
const status = await cryptonex.getPaymentStatus(payment.id);
```

## Webhooks

Set up webhooks to receive payment notifications:

1. Add your webhook URL in the dashboard
2. We'll send POST requests with payment updates
3. Verify webhook signatures using your secret key

Example webhook payload:
```json
{
  "event": "payment.completed",
  "data": {
    "paymentId": "pay_123",
    "amount": "0.1",
    "currency": "ETH",
    "transactionHash": "0x...",
    "timestamp": 1678901234
  },
  "signature": "..."
}
```

## Security Considerations

1. Always verify payment amounts on your server
2. Use webhook signatures to validate callbacks
3. Implement idempotency to prevent double-processing
4. Monitor for suspicious activity

## Rate Limits

- API: 100 requests/minute
- Webhooks: 10 concurrent connections
- Payment creation: 1000/day per merchant

## Support

- Documentation: https://docs.cryptonex.com
- Email: support@cryptonex.com
- Discord: https://discord.gg/cryptonex