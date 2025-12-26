# Frontend Payment Retry Implementation - Complete ✅

## Summary

All frontend changes have been implemented to integrate with the backend payment retry system. Users can now retry failed payments with proper tracking, limits, and user-friendly messaging.

## Files Modified

### 1. `/src/services/orderApi.ts` ✅

**Changes:**
- Added `retryPaymentId?` field to `InitiatePaymentData` interface
- Added `getRetryStatus(paymentId)` function to check retry eligibility

**New Functions:**
```typescript
export async function getRetryStatus(paymentId: string) {
  // Calls: GET /api/payments/retry-status/:paymentId
  // Returns: { canRetry: boolean, remainingAttempts: number, reason?: string }
}
```

### 2. `/src/app/user/payment-failed/page.tsx` ✅

**Changes:**
- Added retry eligibility check on page load
- Shows remaining retry attempts
- User-friendly error message mapping
- Conditional rendering based on retry status
- Auto-redirect disabled when max retries exceeded

**New Features:**
- **Friendly Error Messages**: Maps backend decline codes to user-friendly text
  - `card_declined` → "Your card was declined. Please try a different card."
  - `insufficient_funds` → "Insufficient funds. Please use a card with sufficient balance."
  - etc.

- **Retry Counter Display**: Shows "Try Again (2 attempts left)"

- **Max Retries Warning**: Red banner when limit exceeded

- **Conditional Buttons**:
  - Can retry: "Try Again" button with retry count
  - Cannot retry: "Contact Support" button instead

### 3. `/src/app/user/checkout/page.tsx` ✅

**Changes:**
- Reads `retryPaymentId` from URL query params
- Passes `retryPaymentId` to payment initiation
- Handles retry limit exceeded error
- Logs retry attempts for debugging

**New Logic:**
```typescript
// Check if this is a retry
const urlParams = new URLSearchParams(window.location.search);
const retryPaymentId = urlParams.get('retryPaymentId');

// Add to payment data if retrying
const paymentData = {
  ...orderData,
  ...(retryPaymentId && { retryPaymentId })
};

// Handle retry limit exceeded
if (error.message.includes('retry limit exceeded')) {
  alert('Maximum retry attempts exceeded. Please contact support.');
  router.push('/user/contact?reason=payment-retry-limit');
}
```

## User Flow

### Scenario 1: First Payment Failure (Can Retry)

```
1. User completes checkout, clicks "Pay Now"
   ↓
2. Redirected to SumUp payment page
   ↓
3. Payment fails (card declined)
   ↓
4. Redirected to /user/payment-failed?paymentId=123&reason=card_declined
   ↓
5. Page shows:
   - "Your card was declined. Please try a different card."
   - "Try Again (3 attempts left)" button
   - Auto-redirect in 10 seconds
   ↓
6. User clicks "Try Again" or waits
   ↓
7. Redirected to /user/checkout?retryPaymentId=123
   ↓
8. Cart items still intact
   ↓
9. User can update payment details and retry
```

### Scenario 2: Max Retries Exceeded (Cannot Retry)

```
1. User has failed payment 3 times already
   ↓
2. Redirected to /user/payment-failed?paymentId=123
   ↓
3. Page calls getRetryStatus(123)
   ↓
4. Backend returns: { canRetry: false, remainingAttempts: 0 }
   ↓
5. Page shows:
   - Red warning: "Maximum Retry Limit Reached"
   - "Contact Support" button (not "Try Again")
   - No auto-redirect
   ↓
6. User clicks "Contact Support"
   ↓
7. Redirected to /user/contact?reason=payment-retry-limit
```

### Scenario 3: Retry Limit During Checkout

```
1. User at /user/checkout?retryPaymentId=123
   ↓
2. Clicks "Pay Now"
   ↓
3. Backend checks: retryCount (3) >= maxRetries (3)
   ↓
4. Backend returns: 400 "Payment retry limit exceeded"
   ↓
5. Frontend catches error
   ↓
6. Shows alert: "Maximum retry attempts exceeded"
   ↓
7. Redirects to /user/contact?reason=payment-retry-limit
```

## Error Message Mapping

Frontend maps backend decline codes to user-friendly messages:

| Backend Code | Frontend Message |
|-------------|------------------|
| `card_declined` | Your card was declined. Please try a different card or payment method. |
| `insufficient_funds` | Insufficient funds in your account. Please use a card with sufficient balance. |
| `expired_card` | Your card has expired. Please use a valid card. |
| `invalid_card` | Invalid card details. Please check your card information and try again. |
| `user_cancelled` | Payment was cancelled. You can try again when you're ready. |
| `fraud_suspected` | Transaction flagged for security review. Please contact your bank. |
| `processing_error` | Payment processing error occurred. Please try again in a few moments. |
| `network_error` | Network error occurred. Please check your internet connection. |
| (default) | Payment failed. Please try again. |

## API Endpoints Used

### 1. Get Retry Status
```http
GET /api/payments/retry-status/:paymentId
```

**Frontend Call:**
```typescript
const status = await getRetryStatus(paymentId);
// status = { canRetry: true, remainingAttempts: 2 }
```

### 2. Initiate Payment with Retry
```http
POST /api/payments/initiate
Content-Type: application/json

{
  "orderItems": [...],
  "totalAmount": 2999,
  "retryPaymentId": "uuid-here"  // Optional
}
```

**Frontend Call:**
```typescript
const paymentData = {
  ...orderData,
  retryPaymentId: urlParams.get('retryPaymentId')
};
const result = await initiatePayment(paymentData, token);
```

## Testing Checklist

### ✅ Test 1: First Failure & Retry
- [ ] Add items to cart
- [ ] Checkout and simulate payment failure
- [ ] Verify redirected to /user/payment-failed
- [ ] Verify shows "3 attempts left"
- [ ] Verify user-friendly error message displayed
- [ ] Click "Try Again"
- [ ] Verify redirected to /user/checkout?retryPaymentId=...
- [ ] Verify cart items still present
- [ ] Complete payment successfully
- [ ] Verify cart cleared after success

### ✅ Test 2: Multiple Retries
- [ ] Fail payment 3 times
- [ ] On 3rd failure, verify shows "0 attempts left"
- [ ] Verify "Try Again" button replaced with "Contact Support"
- [ ] Verify no auto-redirect countdown
- [ ] Click "Contact Support"
- [ ] Verify redirected to /user/contact

### ✅ Test 3: Retry Limit During Checkout
- [ ] Open checkout with retryPaymentId that has maxed retries
- [ ] Click "Pay Now"
- [ ] Verify error alert shown
- [ ] Verify redirected to /user/contact
- [ ] Verify URL has ?reason=payment-retry-limit

### ✅ Test 4: Error Message Mapping
- [ ] Test each decline code:
  - card_declined
  - insufficient_funds
  - expired_card
  - invalid_card
  - user_cancelled
- [ ] Verify correct friendly message displayed for each

### ✅ Test 5: Cart Preservation
- [ ] Add items to cart
- [ ] Start checkout
- [ ] Simulate payment failure
- [ ] Go back to menu
- [ ] Verify cart icon still shows items
- [ ] Open cart sidebar
- [ ] Verify all items still present

## Backend Integration Points

### Required Backend Endpoints

1. **Retry Status Check** (NEW)
   ```
   GET /api/payments/retry-status/:paymentId
   Response: { canRetry: boolean, remainingAttempts: number, reason?: string }
   ```

2. **Payment Initiation** (UPDATED)
   ```
   POST /api/payments/initiate
   Request: { ...paymentData, retryPaymentId?: string }
   Response: { checkoutUrl, paymentId } OR { error: "retry limit exceeded" }
   ```

3. **SumUp Return URLs** (MUST BE CONFIGURED)
   ```
   Success: {FRONTEND_URL}/user/payment-success?paymentId={payment_id}
   Failure: {FRONTEND_URL}/user/payment-failed?paymentId={payment_id}&reason={decline_code}&message={message}
   ```

## Environment Variables

Ensure `.env` has:
```bash
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:4000
```

Backend needs:
```bash
FRONTEND_URL=http://localhost:3000
```

## Next Steps

### For Development
1. ✅ All frontend code complete
2. ⏳ Backend needs to implement `/api/payments/retry-status/:paymentId`
3. ⏳ Backend needs to configure SumUp return URLs
4. ⏳ Test integration end-to-end

### For Production
1. Update FRONTEND_URL to production domain
2. Configure email notifications (backend)
3. Set up monitoring for high retry rates
4. Add analytics tracking for retry conversion

### Future Enhancements
1. **Save Failed Payment Reason to Local Storage**
   - Remember last failure to pre-fill different card prompt

2. **Show Alternative Payment Methods**
   - If card fails 2+ times, suggest PayPal/Apple Pay

3. **Retry Delay Timer**
   - Implement "Please wait X seconds before retrying"
   - Prevent rapid retry spam

4. **Email Receipt of Failure**
   - Backend already sends, add "Check your email" message

5. **Support Chat Integration**
   - Add live chat button on max retries page

## Deployment Notes

### No Database Migrations Needed
Frontend changes are purely UI/logic - no schema changes.

### No New Dependencies
All functionality uses existing libraries.

### Backward Compatible
- Existing payments (without retryPaymentId) work as before
- New retry functionality is opt-in via URL param

### Cache Clearing
After deployment, clear Next.js cache:
```bash
rm -rf .next
npm run build
```

## Support

### Common Issues

**Issue**: "retryPaymentId not being passed"
- Check URL params in checkout page
- Verify payment-failed page link includes paymentId

**Issue**: "Always shows 3 attempts left"
- Backend might not be returning retry status
- Check network tab for /retry-status call
- Verify backend endpoint exists

**Issue**: "Cart cleared on failure"
- Should be fixed - cart only clears on success page
- Check CartContext logic

**Issue**: "No friendly error message"
- Check decline_code from SumUp
- Add new mapping to friendlyMessages object

---

## Summary

**Status**: ✅ Frontend Implementation Complete

**What's Done**:
- ✅ Retry payment ID support
- ✅ Retry status checking
- ✅ User-friendly error messages
- ✅ Conditional retry button
- ✅ Max retries warning
- ✅ Cart preservation
- ✅ Error handling for retry limits

**What Backend Needs**:
- ⏳ Implement `/api/payments/retry-status/:paymentId`
- ⏳ Configure SumUp return URLs with decline_code
- ⏳ Test retry flow end-to-end

**Ready for Testing**: Yes, once backend endpoints are deployed.
