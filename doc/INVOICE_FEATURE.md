# Invoice Download Feature

## Overview
The invoice download feature has been added to both the admin panel and user orders pages. This allows:
- **Admins** to download invoices for any order (for POS system printing and record-keeping)
- **Users** to download their own order invoices

## Features Implemented

### 1. Invoice Generator Component
**Location:** `src/components/invoice/InvoiceGenerator.tsx`

- Reusable React component that generates professional PDF invoices
- Uses `jsPDF` and `html2canvas` for PDF generation
- Styled invoice template with Dal Rotti branding
- Includes:
  - Restaurant details (name, address, contact)
  - Order information (order number, date, payment method)
  - Customer details
  - Itemized list of ordered items with quantities and prices
  - Subtotal, delivery fee (if applicable), and total
  - Professional layout suitable for POS printing

### 2. Admin Panel Integration

**Location:** `src/app/admin/orders/page.tsx`

Invoice download buttons have been added to:

#### Kanban View
- Each order card has an "Invoice" button
- Located next to "View" and "Track" buttons
- Green color to distinguish from other actions

#### Table View
- "Invoice" button in the Actions column
- Replaces the old "Print" button
- Provides the same functionality as Kanban view

#### Order Details Drawer
- "📥 Invoice" button in the header
- Larger button with icon for better visibility
- Contains full order details including dish information

### 3. User Orders Page Integration

**Location:** `src/app/user/orders\page.tsx`

Invoice download buttons available at:

#### Order List
- Each order card has a "📥 Download Invoice" button
- Located in the bottom action area
- Green color to match the download theme

#### Order Details Modal
- "📥 Download Invoice" button in the modal header
- Provides quick access to invoice from detailed view

## How to Use

### For Admins (POS System)
1. Navigate to Admin Panel → Orders
2. Find the order you want to print
3. Click the "Invoice" button (or "📥 Invoice" in the details drawer)
4. The PDF will automatically download
5. Open the PDF and print it using your POS printer or any printer

### For Users
1. Go to User Orders page
2. Find your order in the list
3. Click "📥 Download Invoice"
4. The invoice PDF will download to your device
5. You can view, print, or save it for your records

## Technical Details

### Dependencies
- `jspdf`: ^2.5.2 - PDF generation library
- `html2canvas`: ^1.4.1 - HTML to canvas conversion
- `@types/html2canvas`: Type definitions for TypeScript

### Invoice Data Structure
```typescript
interface InvoiceData {
  orderNo: string;
  orderDate: string;
  customerName: string;
  customerEmail?: string;
  deliveryAddress?: string;
  paymentMethod?: string;
  items: InvoiceItem[];
  subtotal: number;
  deliveryFee?: number;
  total: number;
  currency?: string;
}
```

### Styling
- Professional A4 format (210mm width)
- Dal Rotti brand colors (#7a1313)
- Print-friendly layout
- Clean typography using Arial font family

## Future Enhancements

Potential improvements:
1. Add tax calculations and display
2. Include order-specific notes or special instructions
3. Add QR code for order tracking
4. Support for multiple languages (EN/DE)
5. Custom invoice numbering system
6. Email invoice directly to customer
7. Bulk invoice generation for multiple orders
8. Invoice templates customization

## Testing Checklist

- [x] Invoice button appears in admin Kanban view
- [x] Invoice button appears in admin Table view
- [x] Invoice button appears in admin order details drawer
- [x] Invoice button appears in user orders list
- [x] Invoice button appears in user order details modal
- [x] PDF downloads successfully
- [x] Invoice contains correct order information
- [x] Invoice is properly formatted for printing
- [x] All item details are displayed correctly
- [x] Totals are calculated accurately

## Support

For any issues or questions about the invoice feature, please contact the development team.
