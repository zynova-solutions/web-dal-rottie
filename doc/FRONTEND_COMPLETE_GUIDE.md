# 📱 Dal Rotti Frontend Integration Guide

**Complete Reference for Frontend Developers**  
**Last Updated**: October 28, 2025  
**Backend API Version**: v1.0  
**Payment Provider**: SumUp (Static URLs)  
**Delivery Provider**: Wolt Drive

---

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Authentication](#authentication)
3. [Menu & Products](#menu--products)
4. [Cart Management](#cart-management)
5. [Payment Integration (SumUp)](#payment-integration-sumup)
6. [Order Management](#order-management)
7. [Delivery Tracking (Wolt)](#delivery-tracking-wolt)
8. [User Profile](#user-profile)
9. [Admin Features](#admin-features)
10. [Error Handling](#error-handling)
11. [Testing Checklist](#testing-checklist)

---

## 🚀 Quick Start

### Base Configuration

```javascript
// config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const api = {
  baseURL: API_BASE_URL,
  
  // Helper to get auth headers
  getHeaders: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`,
  }),
  
  // Helper for authenticated requests
  fetch: async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...api.getHeaders(),
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    
    return response.json();
  },
};
```

---

## 🔐 Authentication

### Using Supabase Auth

Your backend uses **Supabase Authentication**. Frontend should use Supabase client.

### Setup

```bash
npm install @supabase/supabase-js
```

```javascript
// utils/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Sign Up

```javascript
const handleSignUp = async (email, password, name, phoneNo) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        phoneNo,
        role: 'customer', // Default role
      },
    },
  });
  
  if (error) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, user: data.user };
};
```

### Sign In

```javascript
const handleSignIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  // Store token for API requests
  localStorage.setItem('supabase_token', data.session.access_token);
  
  return { success: true, user: data.user };
};
```

### Sign Out

```javascript
const handleSignOut = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('supabase_token');
  localStorage.removeItem('currentPaymentId');
  sessionStorage.clear();
};
```

### Get Current User

```javascript
const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
```

### Auth State Listener

```javascript
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'SIGNED_IN') {
        localStorage.setItem('supabase_token', session.access_token);
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('supabase_token');
        setUser(null);
      }
    }
  );
  
  return () => subscription.unsubscribe();
}, []);
```

---

## 🍽️ Menu & Products

### Get All Categories

```javascript
// GET /api/categories
const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/api/categories`);
  const data = await response.json();
  return data.data; // Array of categories
};

// Response structure:
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Starters",
      "description": "Appetizers and starters",
      "imageUrl": "https://...",
      "isActive": true
    }
  ]
}
```

### Get Dishes by Category

```javascript
// GET /api/dishes?categoryId=uuid
const getDishesByCategory = async (categoryId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/dishes?categoryId=${categoryId}`
  );
  const data = await response.json();
  return data.data;
};

// Response structure:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Paneer Tikka",
      "description": "Grilled cottage cheese",
      "price": 12.99,
      "mrp": 14.99,
      "discount": 13.34,
      "imageUrl": "https://...",
      "isVeg": true,
      "isAvailable": true,
      "spiceLevel": "Medium",
      "prepTime": 15,
      "allergens": ["dairy", "nuts"],
      "categoryId": "uuid",
      "category": {
        "name": "Starters"
      }
    }
  ]
}
```

### Get All Dishes

```javascript
// GET /api/dishes
const getAllDishes = async () => {
  const response = await fetch(`${API_BASE_URL}/api/dishes`);
  const data = await response.json();
  return data.data;
};
```

### Get Single Dish

```javascript
// GET /api/dishes/:id
const getDishById = async (dishId) => {
  const response = await fetch(`${API_BASE_URL}/api/dishes/${dishId}`);
  const data = await response.json();
  return data.data;
};
```

---

## 🛒 Cart Management

### Add to Cart

```javascript
// POST /api/cart/add
const addToCart = async (dishId, quantity = 1) => {
  const response = await api.fetch('/api/cart/add', {
    method: 'POST',
    body: JSON.stringify({ dishId, quantity }),
  });
  return response.data;
};

// Request body:
{
  "dishId": "uuid",
  "quantity": 1
}

// Response:
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "dishId": "uuid",
    "quantity": 1
  }
}
```

### Get Cart Items

```javascript
// GET /api/cart
const getCartItems = async () => {
  const response = await api.fetch('/api/cart');
  return response.data;
};

// Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "dishId": "uuid",
      "quantity": 2,
      "dish": {
        "name": "Paneer Tikka",
        "price": 12.99,
        "imageUrl": "https://..."
      },
      "subtotal": 25.98
    }
  ],
  "cartTotal": 25.98,
  "itemCount": 2
}
```

### Update Cart Item

```javascript
// PUT /api/cart/update
const updateCartItem = async (dishId, quantity) => {
  const response = await api.fetch('/api/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ dishId, quantity }),
  });
  return response.data;
};
```

### Remove from Cart

```javascript
// DELETE /api/cart/remove/:dishId
const removeFromCart = async (dishId) => {
  const response = await api.fetch(`/api/cart/remove/${dishId}`, {
    method: 'DELETE',
  });
  return response;
};
```

### Clear Cart

```javascript
// DELETE /api/cart/clear
const clearCart = async () => {
  const response = await api.fetch('/api/cart/clear', {
    method: 'DELETE',
  });
  return response;
};
```

---

## 💳 Payment Integration (SumUp)

### ⚠️ IMPORTANT: Static URL Implementation

Your backend uses **static URLs** (not dynamic placeholders). You **MUST** use localStorage to track payments.

### Payment Flow Overview

```
1. Store payment context → 2. Redirect to SumUp → 3. Poll for status → 4. Show result
```

### Step 1: Initiate Payment

```javascript
// POST /api/payments/initiate
const initiatePayment = async (orderData) => {
  const response = await api.fetch('/api/payments/initiate', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
  
  if (response.success) {
    // CRITICAL: Store payment ID before redirecting
    localStorage.setItem('currentPaymentId', response.paymentId);
    
    // Store order context for retry functionality
    sessionStorage.setItem('orderContext', JSON.stringify(orderData));
    
    // Redirect to SumUp
    window.location.href = response.checkout_url;
  }
  
  return response;
};

// Request body:
{
  "dishes": [
    {
      "dishId": "uuid",
      "quantity": 2,
      "price": 12.99
    }
  ],
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNo": "+4912345678"
  },
  "deliveryAddress": {
    "address": "Street 123, Berlin",
    "latitude": 52.5200,
    "longitude": 13.4050,
    "area": "Berlin",
    "postalCode": "10115"
  },
  "couponCode": "SAVE10", // Optional
  "notes": "Ring doorbell twice" // Optional
}

// Response:
{
  "success": true,
  "paymentId": "uuid",
  "checkout_url": "https://api.sumup.com/v0.1/checkouts/uuid",
  "orderId": "uuid",
  "totalAmount": 25.98
}
```

### Step 2: Payment Success Page

```javascript
// Component: /user/payment-success
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const confirmPayment = async () => {
      // Get payment ID from localStorage
      const paymentId = localStorage.getItem('currentPaymentId');
      
      if (!paymentId) {
        console.error('No payment ID found');
        navigate('/');
        return;
      }
      
      try {
        // Poll payment status
        const response = await fetch(
          `${API_BASE_URL}/api/payments/${paymentId}/status`
        );
        const data = await response.json();
        
        if (data.payment.status === 'Paid' && data.order) {
          // ✅ Payment confirmed
          setOrder(data.order);
          setLoading(false);
          
          // Cleanup
          localStorage.removeItem('currentPaymentId');
          sessionStorage.removeItem('orderContext');
        } else if (data.payment.status === 'Failed') {
          // Redirect to failure page
          navigate('/user/payment-failed');
        } else {
          // Still processing - poll again
          setTimeout(confirmPayment, 2000);
        }
      } catch (err) {
        console.error('Error confirming payment:', err);
        setError('Failed to confirm payment');
        setLoading(false);
      }
    };
    
    confirmPayment();
  }, [navigate]);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Confirming your payment...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }
  
  return (
    <div className="success-container">
      <div className="success-icon">✅</div>
      <h1>Payment Successful!</h1>
      <div className="order-details">
        <p><strong>Order Number:</strong> {order.orderNo}</p>
        <p><strong>Total:</strong> €{order.totalAmount}</p>
        <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
        
        {order.deliveryTrackingUrl && (
          <a 
            href={order.deliveryTrackingUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="track-button"
          >
            Track Your Delivery
          </a>
        )}
      </div>
      
      <button onClick={() => navigate('/orders')}>
        View My Orders
      </button>
    </div>
  );
};

export default PaymentSuccessPage;
```

### Step 3: Payment Failure Page

```javascript
// Component: /user/payment-failed
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailedPage = () => {
  const [canRetry, setCanRetry] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleFailure = async () => {
      const paymentId = localStorage.getItem('currentPaymentId');
      
      if (!paymentId) {
        navigate('/');
        return;
      }
      
      try {
        // Get payment status
        const statusRes = await fetch(
          `${API_BASE_URL}/api/payments/${paymentId}/status`
        );
        const statusData = await statusRes.json();
        
        setErrorMessage(
          statusData.payment.lastFailureMessage || 'Payment failed'
        );
        
        // Check retry eligibility
        const retryRes = await fetch(
          `${API_BASE_URL}/api/payments/retry-status/${paymentId}`
        );
        const retryData = await retryRes.json();
        
        if (retryData.canRetry) {
          setCanRetry(true);
          setRemainingAttempts(retryData.remainingAttempts);
        } else {
          setShowSupport(true);
        }
      } catch (error) {
        console.error('Error handling failure:', error);
        setErrorMessage('An error occurred. Please contact support.');
      }
    };
    
    handleFailure();
  }, [navigate]);
  
  const handleRetry = async () => {
    const failedPaymentId = localStorage.getItem('currentPaymentId');
    const orderContext = JSON.parse(
      sessionStorage.getItem('orderContext')
    );
    
    if (!orderContext) {
      console.error('No order context found');
      navigate('/cart');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.fetch('/api/payments/initiate', {
        method: 'POST',
        body: JSON.stringify({
          ...orderContext,
          retryPaymentId: failedPaymentId,
        }),
      });
      
      if (response.success) {
        localStorage.setItem('currentPaymentId', response.paymentId);
        window.location.href = response.checkout_url;
      }
    } catch (error) {
      console.error('Retry error:', error);
      alert('Failed to retry payment. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <div className="failure-container">
      <div className="failure-icon">❌</div>
      <h1>Payment Failed</h1>
      <p className="error-message">{errorMessage}</p>
      
      {canRetry ? (
        <div className="retry-section">
          <p>
            You have <strong>{remainingAttempts}</strong> retry attempt(s) remaining.
          </p>
          <button 
            onClick={handleRetry} 
            disabled={loading}
            className="retry-button"
          >
            {loading ? 'Processing...' : 'Try Again'}
          </button>
          <button 
            onClick={() => navigate('/cart')}
            className="back-button"
          >
            Back to Cart
          </button>
        </div>
      ) : showSupport ? (
        <div className="support-section">
          <p>Maximum retry attempts exceeded.</p>
          <p>Please contact our support team for assistance.</p>
          <a href="mailto:support@dalrotti.com" className="support-link">
            Contact Support
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default PaymentFailedPage;
```

### Helper: Payment Status Polling

```javascript
// utils/paymentHelpers.js

/**
 * Poll payment status with automatic retry and timeout
 */
export const pollPaymentStatus = async (
  paymentId, 
  maxAttempts = 15,
  intervalMs = 2000
) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/payments/${paymentId}/status`
      );
      const data = await response.json();
      
      // Check for final states
      if (data.payment.status === 'Paid') {
        return { success: true, payment: data.payment, order: data.order };
      }
      
      if (data.payment.status === 'Failed') {
        return { success: false, payment: data.payment };
      }
      
      // Still pending - wait before next attempt
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      
    } catch (error) {
      console.error(`Polling attempt ${attempt + 1} failed:`, error);
      
      // On last attempt, return error
      if (attempt === maxAttempts - 1) {
        return { success: false, error: error.message, timeout: true };
      }
      
      // Otherwise, continue polling
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }
  
  // Timeout - max attempts reached
  return { success: false, timeout: true };
};

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};
```

---

## 📦 Order Management

### Get My Orders

```javascript
// GET /api/orders/my-orders
const getMyOrders = async () => {
  const response = await api.fetch('/api/orders/my-orders');
  return response.data;
};

// Response:
{
  "success": true,
  "data": {
    "summaryCounts": {
      "orderedCount": 5,
      "cancelledCount": 1,
      "returnedCount": 0
    },
    "summary": {
      "ordered": [...],
      "cancelled": [...],
      "returned": [...]
    },
    "allOrders": [
      {
        "id": "uuid",
        "orderNo": "ORD-1234567890",
        "deliveryStatus": "Delivered",
        "totalAmount": 45.99,
        "deliveryAddress": "Street 123, Berlin",
        "deliveryTrackingUrl": "https://...",
        "createdAt": "2025-10-28T10:30:00Z",
        "orderItems": [...]
      }
    ]
  }
}
```

### Get Order by ID

```javascript
// GET /api/orders/:id
const getOrderById = async (orderId) => {
  const response = await api.fetch(`/api/orders/${orderId}`);
  return response.data;
};

// Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNo": "ORD-1234567890",
    "deliveryStatus": "Out for Delivery",
    "deliveryAddress": "Street 123",
    "latitude": 52.5200,
    "longitude": 13.4050,
    "totalAmount": 45.99,
    "deliveryTrackingUrl": "https://wolt.com/track/...",
    "woltDeliveryId": "wolt-delivery-id",
    "orderItems": [
      {
        "dishId": "uuid",
        "quantity": 2,
        "price": 12.99
      }
    ],
    "payment": {
      "paymentMethod": "SumUp",
      "status": "Paid",
      "amount": 45.99
    }
  }
}
```

### Cancel Order

```javascript
// PUT /api/orders/:id/cancel
const cancelOrder = async (orderId, cancelReason) => {
  const response = await api.fetch(`/api/orders/${orderId}/cancel`, {
    method: 'PUT',
    body: JSON.stringify({ cancelReason }),
  });
  return response.data;
};

// Only allowed if:
// - Order status is not "Delivered"
// - User is the order owner or admin
```

---

## 🚚 Delivery Tracking (Wolt)

### Track Delivery

Orders with Wolt delivery will have a `deliveryTrackingUrl`.

```javascript
const TrackDeliveryButton = ({ order }) => {
  if (!order.deliveryTrackingUrl) {
    return <p>Tracking not available</p>;
  }
  
  return (
    <a
      href={order.deliveryTrackingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="track-button"
    >
      Track Your Delivery
    </a>
  );
};
```

### Delivery Status Mapping

Your backend maps Wolt statuses to these user-friendly statuses:

- **Pending** - Order received, waiting for confirmation
- **Accepted** - Restaurant accepted, preparing order
- **In Kitchen** - Being prepared
- **Ready** - Ready for pickup
- **Out for Delivery** - Driver is on the way
- **Delivered** - Order delivered
- **Cancelled** - Order cancelled
- **Refunded** - Payment refunded

### Real-time Status Updates

Wolt sends webhooks to update delivery status. Frontend should poll or use WebSocket (if implemented).

```javascript
// Poll order status
const pollOrderStatus = async (orderId, callback, intervalMs = 5000) => {
  const intervalId = setInterval(async () => {
    try {
      const order = await getOrderById(orderId);
      callback(order);
      
      // Stop polling if delivered or cancelled
      if (['Delivered', 'Cancelled'].includes(order.deliveryStatus)) {
        clearInterval(intervalId);
      }
    } catch (error) {
      console.error('Error polling order status:', error);
    }
  }, intervalMs);
  
  return intervalId; // Return to allow manual clearing
};

// Usage in component:
useEffect(() => {
  const intervalId = pollOrderStatus(orderId, (order) => {
    setOrderStatus(order.deliveryStatus);
  });
  
  return () => clearInterval(intervalId);
}, [orderId]);
```

---

## 👤 User Profile

### Get User Profile

```javascript
// GET /api/users/:id
const getUserProfile = async (userId) => {
  const response = await api.fetch(`/api/users/${userId}`);
  return response.data;
};

// Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "phoneNo": "+4912345678",
    "role": "customer"
  }
}
```

### Update User Profile

User profile updates should be done via Supabase:

```javascript
const updateProfile = async (updates) => {
  const { data, error } = await supabase.auth.updateUser({
    data: updates,
  });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, user: data.user };
};

// Usage:
await updateProfile({
  name: 'John Updated',
  phoneNo: '+4987654321',
});
```

---

## 👨‍💼 Admin Features

### Get All Orders (Admin Only)

```javascript
// GET /api/orders/admin/all
const getAllOrders = async () => {
  const response = await api.fetch('/api/orders/admin/all');
  return response.data;
};

// Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "orderNo": "ORD-123",
      "customerName": "John Doe",
      "placedAt": "2025-10-28T10:00:00Z",
      "items": 3,
      "amount": 45.99,
      "status": "Delivered",
      "orderItems": [...]
    }
  ]
}
```

### Update Order Status (Admin)

```javascript
// PUT /api/orders/:id/status
const updateOrderStatus = async (orderId, deliveryStatus, paymentStatus) => {
  const response = await api.fetch(`/api/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ deliveryStatus, paymentStatus }),
  });
  return response.data;
};
```

### Kanban Orders (Admin)

```javascript
// GET /api/orders/kanban
const getKanbanOrders = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.fetch(`/api/orders/kanban?${params}`);
  return response.data;
};

// Filters:
{
  startDate: '2025-10-01',
  endDate: '2025-10-31',
  paymentType: 'SumUp',
  search: 'ORD-123'
}

// Response: Orders grouped by status
{
  "Pending": [...],
  "Accepted": [...],
  "In Kitchen": [...],
  "Ready": [...],
  "Out for Delivery": [...],
  "Delivered": [...],
  "Cancelled": [...],
  "Refunded": [...]
}
```

### Manage Dishes (Admin)

```javascript
// POST /api/admin/dishes
const createDish = async (dishData) => {
  const formData = new FormData();
  formData.append('name', dishData.name);
  formData.append('description', dishData.description);
  formData.append('price', dishData.price);
  formData.append('categoryId', dishData.categoryId);
  formData.append('isVeg', dishData.isVeg);
  formData.append('spiceLevel', dishData.spiceLevel);
  formData.append('allergens', JSON.stringify(dishData.allergens));
  
  if (dishData.image) {
    formData.append('image', dishData.image);
  }
  
  const response = await fetch(`${API_BASE_URL}/api/admin/dishes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`,
    },
    body: formData,
  });
  
  return response.json();
};

// PUT /api/admin/dishes/:id - Update dish
// DELETE /api/admin/dishes/:id - Delete dish
```

---

## ⚠️ Error Handling

### Standardized Error Format

All API errors follow this structure:

```javascript
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (development only)"
}
```

### Common HTTP Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (not logged in)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Internal Server Error

### Error Handling Pattern

```javascript
const safeApiCall = async (apiFunction, ...args) => {
  try {
    const result = await apiFunction(...args);
    return { success: true, data: result };
  } catch (error) {
    console.error('API Error:', error);
    
    // Handle specific errors
    if (error.message.includes('401')) {
      // Redirect to login
      window.location.href = '/login';
      return { success: false, error: 'Session expired' };
    }
    
    return { success: false, error: error.message };
  }
};

// Usage:
const { success, data, error } = await safeApiCall(getMyOrders);
if (!success) {
  showErrorToast(error);
}
```

### Network Error Handling

```javascript
const fetchWithRetry = async (url, options, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
};
```

---

## ✅ Testing Checklist

### Authentication Flow
- [ ] User can sign up with email/password
- [ ] User can sign in with email/password
- [ ] User can sign out
- [ ] Auth state persists on page reload
- [ ] Expired tokens redirect to login
- [ ] User metadata (name, phoneNo) stored correctly

### Menu & Cart
- [ ] Categories load correctly
- [ ] Dishes display with images
- [ ] Filters work (veg, spice level)
- [ ] Add to cart works
- [ ] Cart total calculates correctly
- [ ] Update quantity works
- [ ] Remove from cart works
- [ ] Cart persists across pages

### Payment Flow (CRITICAL)
- [ ] ✅ Payment ID stored in localStorage before redirect
- [ ] ✅ Order context stored in sessionStorage
- [ ] ✅ Success page polls for payment status
- [ ] ✅ Success page shows order details when confirmed
- [ ] ✅ Failure page shows error message
- [ ] ✅ Retry button appears when eligible
- [ ] ✅ Max retries (3) blocks further attempts
- [ ] ✅ localStorage cleaned up after success
- [ ] ✅ Works on mobile browsers
- [ ] ✅ Works in private/incognito mode

### Order Management
- [ ] My orders page shows all user orders
- [ ] Order details page loads correctly
- [ ] Order status updates display
- [ ] Delivery tracking link works
- [ ] Order cancellation works (when allowed)

### Delivery Tracking
- [ ] Wolt tracking URL opens in new tab
- [ ] Status polling updates UI
- [ ] Final statuses stop polling

### Admin Features (if applicable)
- [ ] Admin can view all orders
- [ ] Admin can update order status
- [ ] Kanban board displays correctly
- [ ] Admin can manage dishes
- [ ] Admin can manage categories

### Error Handling
- [ ] Network errors show user-friendly messages
- [ ] 401 errors redirect to login
- [ ] Validation errors display correctly
- [ ] Retry logic works for failed requests

### Mobile Compatibility
- [ ] Responsive design works
- [ ] Touch events work correctly
- [ ] localStorage works on iOS Safari
- [ ] Payment flow works on mobile

---

## 🔧 Environment Variables

Create `.env` file:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000

# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📞 Support & Resources

### Backend API Documentation
- Base URL: `http://localhost:8000` (development)
- API Routes: See `routes/` folder in backend
- Postman Collection: Request from backend team

### Common Issues

**Issue**: Payment ID not found after redirect  
**Solution**: Ensure localStorage.setItem called BEFORE window.location.href

**Issue**: Order status not updating  
**Solution**: Implement polling on order details page

**Issue**: Cart empty after page reload  
**Solution**: Fetch cart from backend on app load

**Issue**: 401 Unauthorized errors  
**Solution**: Check Supabase token is valid and included in headers

---

## 🎯 Quick Reference: API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/categories | No | Get all categories |
| GET | /api/dishes | No | Get all dishes |
| GET | /api/dishes/:id | No | Get dish by ID |
| POST | /api/cart/add | Yes | Add to cart |
| GET | /api/cart | Yes | Get cart items |
| PUT | /api/cart/update | Yes | Update cart item |
| DELETE | /api/cart/remove/:id | Yes | Remove from cart |
| POST | /api/payments/initiate | Yes | Start payment |
| GET | /api/payments/:id/status | No | Check payment status |
| GET | /api/payments/retry-status/:id | No | Check retry eligibility |
| GET | /api/orders/my-orders | Yes | Get user orders |
| GET | /api/orders/:id | Yes | Get order details |
| PUT | /api/orders/:id/cancel | Yes | Cancel order |
| GET | /api/orders/admin/all | Admin | Get all orders |
| PUT | /api/orders/:id/status | Admin | Update order status |

---

**Last Updated**: October 28, 2025  
**Frontend Team**: Reference this as your single source of truth  
**Questions?**: Contact backend team or check API endpoint files

---

## 🚀 Ready to Build!

This guide covers everything you need to integrate with the Dal Rotti backend. Start with authentication, then build the menu/cart flow, and finally implement the payment integration carefully following the localStorage pattern.

**Most Critical**: Payment flow with localStorage - test thoroughly on all browsers!
