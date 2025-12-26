"use client";

import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

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

interface InvoiceGeneratorProps {
  invoiceData: InvoiceData;
  buttonText?: string;
  buttonClassName?: string;
  onBeforeGenerate?: (data: InvoiceData) => Promise<InvoiceData> | InvoiceData;
  isPOS?: boolean; // POS mode: black & white only
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  invoiceData,
  buttonText = 'Download Invoice',
  buttonClassName = 'text-xs text-[#7a1313] font-semibold underline underline-offset-2 hover:text-[#a31e1e] transition',
  onBeforeGenerate,
  isPOS = false
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [currentInvoiceData, setCurrentInvoiceData] = React.useState(invoiceData);

  const generatePDF = async () => {
    if (!invoiceRef.current) return;

    try {
      // Allow modification of invoice data before generation
      let dataToUse = invoiceData;
      if (onBeforeGenerate) {
        dataToUse = await onBeforeGenerate({ ...invoiceData });
        setCurrentInvoiceData(dataToUse);
      }

      // Show the invoice temporarily for rendering
      invoiceRef.current.style.display = 'block';
      
      const canvas = await html2canvas(invoiceRef.current, {
        useCORS: true,
        logging: false,
        background: '#ffffff'
      });

      // Hide it again
      invoiceRef.current.style.display = 'none';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice_${dataToUse.orderNo}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate invoice. Please try again.');
    }
  };

  return (
    <>
      <button onClick={generatePDF} className={buttonClassName}>
        {buttonText}
      </button>

      {/* Hidden invoice template for PDF generation */}
      <div ref={invoiceRef} style={{ display: 'none' }}>
        <div style={{
          width: isPOS ? '80mm' : '210mm',
          padding: isPOS ? '5mm' : '20mm',
          fontFamily: 'Arial, sans-serif',
          color: '#000',
          backgroundColor: '#fff',
          fontSize: isPOS ? '11px' : '14px'
        }}>
          {/* Header */}
          <div style={{ 
            borderBottom: isPOS ? '2px solid #000' : '3px solid #7a1313', 
            paddingBottom: isPOS ? '8px' : '15px', 
            marginBottom: isPOS ? '10px' : '20px',
            textAlign: 'center'
          }}>
            <h1 style={{ 
              color: '#000', 
              fontSize: isPOS ? '18px' : '32px', 
              margin: '0 0 5px 0',
              fontWeight: 'bold'
            }}>Dal Rotti</h1>
            <p style={{ 
              margin: '0', 
              fontSize: isPOS ? '9px' : '14px', 
              color: '#000',
              lineHeight: isPOS ? '1.3' : '1.6'
            }}>
              Mainzer Landstraße 681<br />
              60329 Frankfurt am Main<br />
              Tel: +49 69 30036126
            </p>
          </div>

          {/* Invoice Title */}
          <div style={{ 
            textAlign: 'center', 
            margin: isPOS ? '8px 0' : '20px 0' 
          }}>
            <h2 style={{ 
              fontSize: isPOS ? '14px' : '28px', 
              color: '#000',
              margin: '0',
              fontWeight: 'bold'
            }}>INVOICE</h2>
          </div>

          {/* Order Details */}
          <div style={{ 
            display: isPOS ? 'block' : 'flex', 
            justifyContent: 'space-between', 
            marginBottom: isPOS ? '10px' : '30px',
            fontSize: isPOS ? '10px' : '14px'
          }}>
            <div style={{ marginBottom: isPOS ? '8px' : '0' }}>
              <h3 style={{ 
                fontSize: isPOS ? '10px' : '16px', 
                marginBottom: isPOS ? '3px' : '10px', 
                color: '#000',
                fontWeight: 'bold',
                margin: '0 0 3px 0'
              }}>Order:</h3>
              <p style={{ 
                margin: '2px 0', 
                lineHeight: '1.4',
                fontWeight: 'bold'
              }}>
                {currentInvoiceData.customerName}
              </p>
            </div>
            <div style={{ 
              textAlign: isPOS ? 'left' : 'right',
              marginTop: isPOS ? '5px' : '0'
            }}>
              <p style={{ margin: '2px 0', fontSize: isPOS ? '9px' : '14px', fontWeight: 'bold' }}>
                Order No: {currentInvoiceData.orderNo}
              </p>
              <p style={{ margin: '2px 0', fontSize: isPOS ? '9px' : '14px' }}>
                Date: {new Date(currentInvoiceData.orderDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginBottom: isPOS ? '8px' : '30px',
            fontSize: isPOS ? '10px' : '13px'
          }}>
            <thead>
              <tr style={{ 
                backgroundColor: '#000', 
                color: '#fff',
                borderBottom: '2px solid #000'
              }}>
                <th style={{ 
                  padding: isPOS ? '4px 2px' : '12px', 
                  textAlign: 'left', 
                  fontSize: isPOS ? '9px' : '14px',
                  fontWeight: 'bold',
                  borderRight: isPOS ? '1px solid #fff' : 'none'
                }}>Item</th>
                <th style={{ 
                  padding: isPOS ? '4px 2px' : '12px', 
                  textAlign: 'center', 
                  fontSize: isPOS ? '9px' : '14px',
                  fontWeight: 'bold',
                  width: isPOS ? '30px' : 'auto',
                  borderRight: isPOS ? '1px solid #fff' : 'none'
                }}>Qty</th>
                <th style={{ 
                  padding: isPOS ? '4px 2px' : '12px', 
                  textAlign: 'right', 
                  fontSize: isPOS ? '9px' : '14px',
                  fontWeight: 'bold',
                  borderRight: isPOS ? '1px solid #fff' : 'none'
                }}>Price</th>
                <th style={{ 
                  padding: isPOS ? '4px 2px' : '12px', 
                  textAlign: 'right', 
                  fontSize: isPOS ? '9px' : '14px',
                  fontWeight: 'bold'
                }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoiceData.items.map((item, index) => (
                <tr key={index} style={{ 
                  borderBottom: '1px solid #ccc',
                  height: isPOS ? '20px' : 'auto'
                }}>
                  <td style={{ 
                    padding: isPOS ? '2px' : '12px', 
                    fontSize: isPOS ? '9px' : '13px',
                    maxWidth: isPOS ? '45mm' : 'auto',
                    wordWrap: 'break-word'
                  }}>{item.name}</td>
                  <td style={{ 
                    padding: isPOS ? '2px' : '12px', 
                    textAlign: 'center', 
                    fontSize: isPOS ? '9px' : '13px',
                    fontWeight: 'bold'
                  }}>{item.quantity}</td>
                  <td style={{ 
                    padding: isPOS ? '2px' : '12px', 
                    textAlign: 'right', 
                    fontSize: isPOS ? '9px' : '13px'
                  }}>
                    {currentInvoiceData.currency || '€'}{item.price.toFixed(2)}
                  </td>
                  <td style={{ 
                    padding: isPOS ? '2px' : '12px', 
                    textAlign: 'right', 
                    fontSize: isPOS ? '9px' : '13px',
                    fontWeight: 'bold'
                  }}>
                    {currentInvoiceData.currency || '€'}{item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ marginLeft: 'auto', width: isPOS ? '100%' : '250px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: isPOS ? '3px 0' : '8px 0', 
              borderBottom: '1px solid #000',
              fontSize: isPOS ? '10px' : '14px'
            }}>
              <span style={{ fontWeight: 'normal' }}>Subtotal:</span>
              <span>{currentInvoiceData.currency || '€'}{currentInvoiceData.subtotal.toFixed(2)}</span>
            </div>
            {currentInvoiceData.deliveryFee !== undefined && currentInvoiceData.deliveryFee > 0 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: isPOS ? '3px 0' : '8px 0', 
                borderBottom: '1px solid #000',
                fontSize: isPOS ? '10px' : '14px'
              }}>
                <span>Delivery:</span>
                <span>{currentInvoiceData.currency || '€'}{currentInvoiceData.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: isPOS ? '5px 2px' : '12px', 
              backgroundColor: '#000',
              color: '#fff',
              marginTop: isPOS ? '3px' : '10px',
              fontSize: isPOS ? '11px' : '18px',
              fontWeight: 'bold'
            }}>
              <span>TOTAL:</span>
              <span>
                {currentInvoiceData.currency || '€'}{currentInvoiceData.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            marginTop: isPOS ? '5px' : '50px', 
            paddingTop: isPOS ? '5px' : '20px', 
            borderTop: '1px solid #000', 
            textAlign: 'center' 
          }}>
            <p style={{ 
              fontSize: isPOS ? '8px' : '12px', 
              color: '#000', 
              margin: '2px 0',
              fontWeight: isPOS ? 'normal' : 'normal'
            }}>
              {isPOS ? 'Thank you!' : 'Thank you for your order!'}
            </p>
            {!isPOS && (
              <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>
                For any queries, please contact us at info@dalrotti.com or +49 69 30036126
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceGenerator;
