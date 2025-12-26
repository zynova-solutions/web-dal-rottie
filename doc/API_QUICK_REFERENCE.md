# API Integration Quick Reference

## 🔧 New Service Functions

### Dish Operations (`src/services/dishApi.ts`)

```typescript
// Update a dish with optional photo
await updateDish(dishId, formData);

// Delete a dish
await deleteDish(dishId);

// Quick status toggle
await updateDishStatus(dishId, { 
  isAvailable: true,
  isSoldOut: false 
});
```

### Category Operations (`src/services/categoryApi.ts`)

```typescript
// Delete a category
await deleteCategory(categoryId);
```

### Coupon Operations (`src/services/couponApi.ts`)

```typescript
// Delete a coupon
await deleteCoupon(couponId);
```

### Order Operations (Kanban) (`src/services/apiService.ts`)

```typescript
// Fetch orders optimized for Kanban
const orders = await fetchKanbanOrders();

// Update order status (Kanban)
await updateOrderStatusKanban(orderId, 'Accepted');
```

---

## 📡 Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PUT` | `/api/dishes/dishes/:id` | Update dish (multipart/form-data) |
| `DELETE` | `/api/dishes/delete/:id` | Delete dish |
| `PATCH` | `/api/dishes/status/:id` | Update dish status |
| `DELETE` | `/api/categories/delete/:id` | Delete category |
| `DELETE` | `/api/coupons/delete/:id` | Delete coupon |
| `GET` | `/api/orders/getall-kanban` | Fetch Kanban orders |
| `PATCH` | `/api/orders/status-kanban` | Update order status |

---

## 🎯 Usage Examples

### Update Dish with Photo

```typescript
const formData = new FormData();
formData.append('name', 'Butter Chicken');
formData.append('price', '12.50');
formData.append('photo', fileInput.files[0]);

try {
  const result = await updateDish(dishId, formData);
  console.log('Dish updated:', result.data);
} catch (error) {
  console.error('Failed to update dish:', error);
}
```

### Delete Dish with Confirmation

```typescript
if (confirm('Are you sure you want to delete this dish?')) {
  try {
    await deleteDish(dishId);
    // Remove from UI state
    setDishes(prev => prev.filter(d => d.id !== dishId));
  } catch (error) {
    alert('Failed to delete dish');
  }
}
```

### Toggle Sold-Out Status

```typescript
try {
  await updateDishStatus(dishId, { isSoldOut: true });
  // Update UI state
  setDishes(prev => 
    prev.map(d => d.id === dishId ? { ...d, soldOut: true } : d)
  );
} catch (error) {
  console.error('Failed to update status:', error);
}
```

### Kanban Order Status Update

```typescript
try {
  await updateOrderStatusKanban(orderId, 'Ready');
  // Update UI optimistically
  setOrders(prev => 
    prev.map(o => o.id === orderId ? { ...o, status: 'Ready' } : o)
  );
} catch (error) {
  // Rollback on error
  console.error('Failed to update order:', error);
}
```

---

## 🔐 Authentication

All API calls automatically include the Bearer token:

```typescript
// Token is retrieved from sessionStorage
const token = sessionStorage.getItem('dalrotti_admin_token');

// Automatically included in headers
headers['Authorization'] = `Bearer ${token}`;
```

---

## ⚠️ Error Handling Pattern

```typescript
try {
  const result = await apiFunction();
  // Success: Update UI
  updateUIState(result.data);
} catch (error) {
  // Error: Show message and rollback if needed
  console.error('API Error:', error);
  alert('Operation failed. Please try again.');
  rollbackUIState();
}
```

---

## 🔄 Optimistic UI Updates

```typescript
// 1. Update UI immediately (optimistic)
setData(newState);

// 2. Call API
try {
  await apiCall();
  // Success - no action needed
} catch (error) {
  // 3. Rollback on failure
  setData(previousState);
  alert('Failed to save changes');
}
```

---

## 📋 TypeScript Types

```typescript
interface DishResponse {
  statusCode: number;
  message: string;
  data: {
    id: number;
    name: string;
    categoryId: number;
    // ... other dish properties
  };
}

interface DishStatusPayload {
  isAvailable?: boolean;
  isSoldOut?: boolean;
}
```

---

## 🌐 Environment Configuration

```bash
# .env.local
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:4000

# .env.production
NEXT_PUBLIC_BACKEND_API_URL=https://api.dalrotti.com
```

---

## 🧪 Testing Checklist

- [ ] Update dish without photo
- [ ] Update dish with photo upload
- [ ] Delete dish
- [ ] Toggle sold-out status
- [ ] Delete category (empty)
- [ ] Delete category (with dishes - should fail)
- [ ] Delete coupon
- [ ] Drag order in Kanban
- [ ] Update order status with buttons
- [ ] Check error handling
- [ ] Verify token authentication

---

## 📞 Support

For issues or questions:
1. Check browser console for error logs
2. Verify backend API is running on correct port
3. Ensure admin token is valid
4. Check network tab for API response details
