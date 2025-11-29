import { formatPrice } from '@/lib/utils';

export const printInvoice = (order) => {
  const printWindow = window.open('', '_blank');
  
  const date = order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString();
  
  const itemsHtml = order.items.map(item => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px; text-align: left;">
        <div style="font-weight: bold;">${item.name}</div>
        <div style="font-size: 12px; color: #666;">${item.subCategory || 'Ethnic Wear'}</div>
        ${item.selectedOptions?.fallPico ? '<span style="font-size: 10px; background: #eee; padding: 2px 4px; border-radius: 2px;">+ Fall/Pico</span>' : ''}
        ${item.selectedOptions?.blouseStitching ? '<span style="font-size: 10px; background: #eee; padding: 2px 4px; border-radius: 2px;">+ Stitching</span>' : ''}
      </td>
      <td style="padding: 10px; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; text-align: right;">₹${(item.price || 0).toLocaleString('en-IN')}</td>
      <td style="padding: 10px; text-align: right;"><strong>₹${((item.price || 0) * item.quantity).toLocaleString('en-IN')}</strong></td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #${order.id.slice(0, 8)}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #B08D55; padding-bottom: 20px; }
        .logo { font-size: 32px; font-weight: bold; color: #B08D55; font-family: serif; }
        .invoice-details { text-align: right; }
        .columns { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .col { width: 45%; }
        .col h3 { font-size: 14px; text-transform: uppercase; color: #888; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; }
        .col p { margin: 5px 0; font-size: 14px; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f9f9f9; text-align: left; padding: 10px; font-size: 12px; text-transform: uppercase; color: #666; }
        .total-section { text-align: right; margin-top: 20px; }
        .total-row { display: flex; justify-content: flex-end; margin-bottom: 5px; font-size: 14px; }
        .grand-total { font-size: 20px; font-weight: bold; margin-top: 10px; color: #B08D55; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #eee; padding-top: 20px; }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Pahnawa Banaras</div>
        <div class="invoice-details">
          <h2>INVOICE</h2>
          <p><strong>Order ID:</strong> #${order.id.slice(0, 8)}</p>
          <p><strong>Date:</strong> ${date}</p>
        </div>
      </div>

      <div class="columns">
        <div class="col">
          <h3>Billed To</h3>
          <p><strong>${order.shippingDetails?.firstName} ${order.shippingDetails?.lastName}</strong></p>
          <p>${order.shippingDetails?.address}</p>
          <p>${order.shippingDetails?.city}, ${order.shippingDetails?.state} - ${order.shippingDetails?.pincode}</p>
          <p>Phone: ${order.shippingDetails?.phone}</p>
          <p>Email: ${order.shippingDetails?.email}</p>
        </div>
        <div class="col">
          <h3>Shipped From</h3>
          <p><strong>Pahnawa Banaras</strong></p>
          <p>B-21/128, Kamachha</p>
          <p>Varanasi, Uttar Pradesh, 221005</p>
          <p>India</p>
          <p>support@pahnawa.com</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item Description</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Price</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="total-section">
        <div class="total-row">
          <span style="width: 150px;">Subtotal:</span>
          <span style="width: 100px;">₹${order.totalAmount?.toLocaleString('en-IN')}</span>
        </div>
        <div class="total-row">
          <span style="width: 150px;">Shipping:</span>
          <span style="width: 100px; color: green;">FREE</span>
        </div>
        <div class="total-row grand-total">
          <span style="width: 150px;">Total:</span>
          <span style="width: 100px;">₹${order.totalAmount?.toLocaleString('en-IN')}</span>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 10px;">Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid'}</p>
      </div>

      <div class="footer">
        <p>Thank you for shopping with Pahnawa Banaras. For any queries, contact +91 98765 43210.</p>
        <p>This is a computer-generated invoice.</p>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};