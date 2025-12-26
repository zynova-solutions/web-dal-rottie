# Sandbox Order Creation Fix

## Problem
When testing payments in **sandbox mode**, orders are not being created in the system. This is because:

1. **Production Flow**: Payment initiated → SumUp redirect → User pays → SumUp webhook → Order created
2. **Sandbox Flow**: Payment initiated → Immediate success → **NO WEBHOOK** → **NO ORDER**

## Solution Required (Backend)

The backend needs to implement a new endpoint to simulate webhook completion in sandbox mode:

### Endpoint: `POST /api/payments/complete-sandbox/:paymentId`

**Purpose**: Simulate SumUp webhook to create order after successful sandbox payment

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer <token> (optional - for logged-in users)
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Sandbox payment completed and order created",
  "data": {
    "orderId": "ord_123456",
    "paymentId": "pay_sandbox_123",
    "status": "pending",
    "totalAmount": 25.50,
    "currency": "EUR"
  }
}
```

**Implementation Requirements**:

1. **Verify Payment Exists**:
   - Check that payment with given `paymentId` exists
   - Verify payment is in `SANDBOX` mode
   - Ensure payment hasn't already been completed

2. **Create Order**:
   - Extract all order details from the payment record:
     - Order items (dishes and quantities)
     - Customer information (name, email, phone)
     - Delivery address and method
     - Total amount and currency
     - Notes and special instructions
   - Create order with status `pending`
   - Link order to payment via `paymentId`

3. **Update Payment Status**:
   - Mark payment as `completed`
   - Store order ID in payment record

4. **Error Handling**:
   - Return 404 if payment not found
   - Return 400 if payment is not in sandbox mode
   - Return 409 if order already exists for this payment

### Alternative Solution (Simpler)

Modify the existing `/api/payments/initiate` endpoint to **immediately create the order** when in sandbox mode:

```javascript
// In /api/payments/initiate endpoint
if (mode === 'SANDBOX') {
  // Create payment
  const payment = await createPayment(paymentData);
  
  // ALSO CREATE ORDER IMMEDIATELY (don't wait for webhook)
  const order = await createOrder({
    userId: user?.id || null, // null for guests
    paymentId: payment.id,
    items: paymentData.orderItems,
    totalAmount: paymentData.totalAmount,
    customerName: paymentData.name,
    customerEmail: paymentData.email,
    customerPhone: paymentData.phoneNo,
    deliveryAddress: paymentData.deliveryAddress,
    status: 'pending',
    notes: paymentData.notes,
  });
  
  return {
    mode: 'SANDBOX',
    paymentId: payment.id,
    orderId: order.id, // Return order ID immediately
    checkoutUrl: null,
  };
}
```

## Frontend Changes (Already Implemented)

The frontend now calls the new endpoint after sandbox payment:

```typescript
// In checkout page
if (responseData.mode === 'SANDBOX') {
  // Complete sandbox payment and create order
  const completionResult = await completeSandboxPayment(
    responseData.paymentId, 
    token || undefined
  );
  
  // Redirect with both IDs
  router.push(
    `/user/payment-success?paymentId=${responseData.paymentId}&orderId=${completionResult.orderId}`
  );
}
```

## Testing

After backend implements the fix:

1. Add items to cart
2. Go to checkout
3. Fill in delivery details
4. Click "Pay Now"
5. **Verify**: Order appears in admin panel (`/admin/orders`)
6. **Verify**: Order contains correct items, customer info, and delivery address
7. **Verify**: Payment success page shows both payment ID and order ID

## Current Status

- ✅ Frontend updated to call completion endpoint
- ❌ Backend endpoint `/api/payments/complete-sandbox/:paymentId` **NOT YET IMPLEMENTED**
- ⏳ Orders not showing up in admin panel until backend fix is deployed

## Recommended Approach

**Option 1 (Preferred)**: Modify `/api/payments/initiate` to create order immediately in sandbox mode
- Simpler implementation
- No additional endpoint needed
- Matches production flow more closely

**Option 2**: Implement new `/api/payments/complete-sandbox/:paymentId` endpoint
- More explicit separation of concerns
- Frontend can control when order is created
- Useful for testing different scenarios
