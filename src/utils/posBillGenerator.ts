// POS Bill Generator for Admin Panel

interface BillItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface BillData {
  orderNo: string;
  orderDate: string;
  customerName: string;
  customerEmail?: string;
  items: BillItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus?: string;
  deliveryStatus?: string;
  deliveryAddress?: string;
  notes?: string;
  couponCode?: string;
}

export function generatePOSBill(billData: BillData): void {
  // Helper to detect if running inside a webview
  function isInWebView() {
    return (
      (window as unknown as Record<string, unknown>)["flutter_inappwebview"] !== undefined ||
      (window as unknown as Record<string, unknown>)["ReactNativeWebView"] !== undefined ||
      window.navigator.userAgent.includes('wv') // Android WebView
    );
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bill - ${billData.orderNo}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Courier New', monospace;
      padding: 20px;
      background: white;
      // max-width: 80mm;
      margin: 0 auto;
    }
    
    .bill-container {
      background: white;
      padding: 10px;
    }
    
    .header {
      text-align: center;
      border-bottom: 2px dashed #000;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    
    .restaurant-name {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .restaurant-info {
      font-size: 12px;
      line-height: 1.4;
    }
    
    .order-info {
      margin: 10px 0;
      font-size: 12px;
      border-bottom: 1px dashed #000;
      padding-bottom: 10px;
    }
    
    .order-info-row {
      display: flex;
      justify-content: space-between;
      margin: 3px 0;
    }
    
    .customer-info {
      margin: 10px 0;
      font-size: 12px;
      border-bottom: 1px dashed #000;
      padding-bottom: 10px;
    }
    
    .items-table {
      width: 100%;
      margin: 10px 0;
      font-size: 12px;
    }
    
    .items-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      border-bottom: 1px solid #000;
      padding: 5px 0;
      margin-bottom: 5px;
    }
    
    .item-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px dotted #ccc;
    }
    
    .item-name {
      flex: 3;
    }
    
    .item-qty {
      flex: 1;
      text-align: right;
      font-weight: bold;
    }
    
    .totals {
      margin-top: 10px;
      border-top: 1px solid #000;
      padding-top: 10px;
      font-size: 12px;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
    }
    
    .total-row.grand-total {
      font-weight: bold;
      font-size: 14px;
      border-top: 2px solid #000;
      border-bottom: 2px solid #000;
      padding: 8px 0;
      margin-top: 5px;
    }
    
    .payment-info {
      margin: 10px 0;
      padding: 10px 0;
      border-top: 1px dashed #000;
      border-bottom: 1px dashed #000;
      font-size: 12px;
    }
    
    .footer {
      text-align: center;
      margin-top: 15px;
      padding-top: 10px;
      border-top: 2px dashed #000;
      font-size: 11px;
    }
    
    .thank-you {
      font-weight: bold;
      margin: 10px 0;
      font-size: 14px;
    }
    
    .notes {
      margin: 10px 0;
      padding: 10px;
      background: #f9f9f9;
      border: 1px dashed #000;
      font-size: 11px;
    }
    
    @media print {
      body {
        padding: 0;
      }
      
      .no-print {
        display: none;
      }
    }
    
    .print-button {
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 10px 20px;
      background: #7a1313;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-family: Arial, sans-serif;
    }
    
    .print-button:hover {
      background: #a31e1e;
    }

    .close-button {
      position: fixed;
      top: 10px;
      right: 120px;
      padding: 10px 20px;
      background: #FFFF;
      color: #7a1313;
      border: 1px solid #7a1313;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-family: Arial, sans-serif;
    }
    .close-button:hover {
      background: #a31e1e;
      color: white;
    }

  </style>
</head>
<body>
<button class="print-button no-print" onclick="window.print()">Print Bill</button>
<button class="close-button no-print" id="closeBtn" onclick="window.close()">Close</button>
  
  <div class="bill-container">
    <!-- Header -->
    <div class="header">
      <div class="restaurant-name">Dal Rotti</div>
      <div class="restaurant-info">
        Indian Restaurant<br>
        Mainz, Germany<br>
        Tel: +49 XXX XXXXXXX<br>
        www.dalrotti.de
      </div>
    </div>
    
    <!-- Order Information -->
    <div class="order-info">
      <div class="order-info-row">
        <strong>Order No:</strong>
        <span>${billData.orderNo}</span>
      </div>
      <div class="order-info-row">
        <strong>Date:</strong>
        <span>${billData.orderDate}</span>
      </div>
      <div class="order-info-row">
        <strong>Delivery Status:</strong>
        <span>${billData.deliveryStatus || 'N/A'}</span>
      </div>
    </div>
    
    <!-- Customer Information -->
    <div class="customer-info">
      <div class="order-info-row">
        <strong>Customer:</strong>
        <span>${billData.customerName}</span>
      </div>
      ${billData.customerEmail ? `
      <div class="order-info-row">
        <strong>Email:</strong>
        <span>${billData.customerEmail}</span>
      </div>
      ` : ''}
      ${billData.deliveryAddress ? `
      <div class="order-info-row">
        <strong>Address:</strong>
      </div>
      <div style="margin-top: 5px; padding-left: 10px;">
        ${billData.deliveryAddress}
      </div>
      ` : ''}
    </div>
    
    <!-- Items Table -->
    <div class="items-table">
      <div class="items-header">
        <div class="item-name">Item</div>
        <div class="item-qty">Qty</div>
      </div>
      ${billData.items && billData.items.length > 0 ? billData.items.map(item => `
      <div class="item-row">
        <div class="item-name">${item.name || 'Item'}</div>
        <div class="item-qty">${item.quantity || 1}</div>
      </div>
      `).join('') : '<div class="item-row"><div class="item-name">No items found</div><div class="item-qty">-</div></div>'}
    </div>
    
    <!-- Totals -->
    <div class="totals">
      <div class="total-row">
        <span>Subtotal:</span>
        <span>€${billData.subtotal.toFixed(2)}</span>
      </div>
      ${billData.discount > 0 ? `
      <div class="total-row">
        <span>Discount ${billData.couponCode ? '(' + billData.couponCode + ')' : ''}:</span>
        <span>-€${billData.discount.toFixed(2)}</span>
      </div>
      ` : ''}
      ${billData.deliveryCharge > 0 ? `
      <div class="total-row">
        <span>Delivery Charge:</span>
        <span>€${billData.deliveryCharge.toFixed(2)}</span>
      </div>
      ` : ''}
      <div class="total-row grand-total">
        <span>TOTAL:</span>
        <span>€${billData.total.toFixed(2)}</span>
      </div>
      <div class="total-row" style="font-size: 11px; font-style: italic; margin-top: 5px;">
        <span>VAT included</span>
      </div>
    </div>
    
    <!-- Payment Information -->
    <div class="payment-info">
      <div class="order-info-row">
        <strong>Payment Method:</strong>
        <span>${billData.paymentMethod}</span>
      </div>
      ${billData.paymentStatus ? `
      <div class="order-info-row">
        <strong>Payment Status:</strong>
        <span>${billData.paymentStatus}</span>
      </div>
      ` : ''}
    </div>
    
    ${billData.notes ? `
    <div class="notes">
      <strong>Notes:</strong><br>
      ${billData.notes}
    </div>
    ` : ''}
    
    <!-- Footer -->
    <div class="footer">
      <div class="thank-you">Thank You for Your Order!</div>
      <div>Enjoy your meal!</div>
      <div style="margin-top: 10px;">
        Follow us on Instagram: @dalrotti<br>
        Order online: www.dalrotti.de
      </div>
    </div>
  </div>
  
  <script>
    window.onload = function() {
      // Hide close button in webview (window.close won't work)
      var isWebView = (
        (window["flutter_inappwebview"] !== undefined) ||
        (window["ReactNativeWebView"] !== undefined) ||
        window.navigator.userAgent.includes('wv')
      );
      if (isWebView) {
        var closeBtn = document.getElementById('closeBtn');
        if (closeBtn) closeBtn.style.display = 'none';
      }
      // Try Android POS printer bridge first
      if (window.android && typeof window.android.printText === 'function') {
        window.android.printText(document.body.innerText);
      } else {
        window.print();
      }
    };
  </script>
</body>
</html>
  `;

  if (isInWebView()) {
    // In webview, replace current document and print
    document.open();
    document.write(html);
    document.close();
  } else {
    // In browser, open new window as before
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('Please allow pop-ups to download the bill');
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

export function downloadPOSBillAsPDF(billData: BillData): void {
  // For now, this will open print dialog
  // In future, can integrate with libraries like jsPDF for direct PDF download
  generatePOSBill(billData);
}
