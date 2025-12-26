# Payment Retry Flow - Implementation Guide

## Current Status: ✅ READY

Users can now retry failed payments. Here's what has been implemented:

## Frontend Changes Made

### 1. Payment Failed Page Created ✅
**File**: `/src/app/user/payment-failed/page.tsx`

**Features**:
- Shows error message and reason for failure
- Displays payment reference ID
- Lists common reasons for payment failure
- Reassures user that cart items are still saved
- Auto-redirects to checkout after 10 seconds
- Manual buttons: "Try Again", "Back to Menu", "View Cart"

**URL Parameters**:
- `paymentId` - Reference ID for failed payment
- `reason` - Failure reason (e.g., "insufficient_funds", "card_declined")
- `message` - Detailed error message

### 2. Cart Preservation Fixed ✅
**File**: `/src/app/user/checkout/page.tsx`

**Changes**:
- **Before**: Cart was cleared immediately when "Pay Now" was clicked
- **After**: Cart is kept until payment is confirmed successful
- This allows users to retry if payment fails

### 3. Cart Clearing on Success ✅
**File**: `/src/app/user/payment-success/page.tsx`

**Changes**:
- Cart is now cleared only when user reaches success page
- Uses `useCart()` hook to clear cart state
- Removes cart from localStorage

## Payment Flow Comparison

### ❌ OLD FLOW (Broken)
```
User clicks "Pay Now"
  ↓
Cart cleared immediately ⚠️
  ↓
Redirect to SumUp
  ↓
Payment fails
  ↓
User returns to site
  ↓
Cart is empty - can't retry! ❌
```

### ✅ NEW FLOW (Fixed)
```
User clicks "Pay Now"
  ↓
Cart preserved ✅
  ↓
Redirect to SumUp
  ↓
Payment succeeds → Success page → Cart cleared ✅
  OR
Payment fails → Failure page → Cart still has items ✅
  ↓
User can retry with same items
```

## Backend Requirements

The backend needs to configure SumUp with proper return URLs:

### When Creating Payment
```javascript
// In /api/payments/initiate endpoint
const sumupPayment = {
  amount: totalAmount,
  currency: 'EUR',
  checkout_reference: orderId,
  merchant_code: SUMUP_MERCHANT_CODE,
  return_url: `${FRONTEND_URL}/user/payment-success?paymentId={payment_id}`,
  redirect_url: `${FRONTEND_URL}/user/payment-failed?paymentId={payment_id}&reason={decline_code}&message={message}`,
  // ... other fields
};
```

### Return URL Configuration

**Success URL**: `https://yoursite.com/user/payment-success?paymentId={payment_id}`
- SumUp replaces `{payment_id}` with actual ID
- Frontend clears cart and shows success message

**Failure URL**: `https://yoursite.com/user/payment-failed?paymentId={payment_id}&reason={decline_code}&message={message}`
- SumUp replaces placeholders with actual failure details
- Frontend keeps cart and allows retry

## Testing Scenarios

### Test 1: Successful Payment
1. Add items to cart
2. Go to checkout
3. Click "Pay Now"
4. Complete payment on SumUp
5. **Expected**: Redirected to success page, cart is cleared

### Test 2: Failed Payment - Insufficient Funds
1. Add items to cart
2. Go to checkout
3. Click "Pay Now"
4. Use test card that simulates insufficient funds
5. **Expected**: Redirected to failure page, cart still has items
6. Click "Try Again"
7. **Expected**: Back to checkout with same items

### Test 3: Failed Payment - User Cancels
1. Add items to cart
2. Go to checkout
3. Click "Pay Now"
4. Cancel payment on SumUp page
5. **Expected**: Redirected to failure page, cart still has items
6. Click "Back to Menu"
7. **Expected**: Can continue shopping, cart preserved

### Test 4: Failed Payment - Card Declined
1. Add items to cart
2. Go to checkout
3. Click "Pay Now"
4. Use test card that simulates decline
5. **Expected**: Redirected to failure page with decline reason
6. Click "Try Again"
7. **Expected**: Can retry with different payment method

## Error Messages to Handle

Common SumUp decline codes:
- `insufficient_funds` - Not enough money in account
- `card_declined` - Bank declined the card
- `expired_card` - Card has expired
- `invalid_card` - Invalid card details
- `fraud_suspected` - Suspected fraud
- `user_cancelled` - User cancelled payment
- `processing_error` - Generic processing error

## Implementation Checklist

### Frontend ✅
- [x] Create payment-failed page
- [x] Preserve cart until payment success
- [x] Clear cart only on success page
- [x] Add retry button to failure page
- [x] Show helpful error messages
- [x] Auto-redirect with countdown

### Backend ⏳
- [ ] Configure SumUp return URLs
- [ ] Add failure URL to payment initiation
- [ ] Map SumUp decline codes to user-friendly messages
- [ ] Test with SumUp sandbox
- [ ] Handle webhook for failed payments
- [ ] Log payment failures for debugging

## Code Examples

### How User Retries Payment

**Scenario**: Payment failed, user wants to retry

1. User is on `/user/payment-failed?paymentId=pay_123&reason=card_declined`
2. User clicks "Try Again" button
3. Redirected to `/user/checkout`
4. Checkout page loads with cart items still intact (preserved from before)
5. User can update payment method or delivery details
6. User clicks "Pay Now" again
7. New payment attempt is made

### Cart State During Process

```javascript
// Before clicking "Pay Now"
cart.items = [{id: "1", name: "Butter Chicken", quantity: 2, price: 12.50}]

// After clicking "Pay Now" (cart NOT cleared)
cart.items = [{id: "1", name: "Butter Chicken", quantity: 2, price: 12.50}]

// If payment fails (cart STILL intact)
cart.items = [{id: "1", name: "Butter Chicken", quantity: 2, price: 12.50}]

// Only after payment SUCCESS (cart cleared)
cart.items = []
```

## Next Steps

1. **Deploy frontend changes** - Already complete, just needs deployment
2. **Backend team**: Implement return URL configuration in SumUp integration
3. **Test in staging** with SumUp sandbox environment
4. **Monitor** failed payments in production to improve error messages

## Additional Improvements (Future)

- Add payment retry counter (limit retries to prevent abuse)
- Store failed payment attempts for user history
- Offer alternative payment methods on failure
- Email notification about failed payment
- Save cart to database for logged-in users (survive browser close)
