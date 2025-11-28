const functions = require('firebase-functions/v1'); // <--- FIXED IMPORT
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

/**
 * Configure the email transport using Nodemailer.
 * For Gmail, you must use an "App Password".
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // REPLACE THIS
    pass: 'your-gmail-app-password', // REPLACE THIS
  },
});

/**
 * Helper function to generate the HTML email template.
 * @param {Object} order - The order object.
 * @return {string} The HTML string.
 */
const createEmailTemplate = (order) => {
  const itemsHtml = order.items.map((item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">
        ${item.name} (x${item.quantity})
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
        ₹${item.price}
      </td>
    </tr>
  `).join('');

  /* eslint-disable max-len */
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #B08D55; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Order Confirmed</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #eee;">
        <p>Namaste <strong>${order.shippingDetails.firstName}</strong>,</p>
        <p>Thank you for shopping with Pahnawa Banaras. We have received your order!</p>
        
        <h3>Order Summary (ID: #${order.orderId})</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
          <tr>
            <td style="padding: 8px; font-weight: bold;">Total</td>
            <td style="padding: 8px; font-weight: bold; text-align: right;">₹${order.totalAmount}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; background: #f9f9f9; padding: 10px;">
          <strong>Shipping To:</strong><br/>
          ${order.shippingDetails.address}<br/>
          ${order.shippingDetails.city}, ${order.shippingDetails.state} - ${order.shippingDetails.pincode}
        </div>

        <p style="margin-top: 20px; font-size: 12px; color: #666;">
          We will notify you once your order is shipped.
        </p>
      </div>
    </div>
  `;
  /* eslint-enable max-len */
};

// --- CREATE ORDER FUNCTION ---
exports.createOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Login required.');
  }

  const {items, shippingDetails, paymentMethod} = data;
  const userId = context.auth.uid;
  let totalAmount = 0;
  const orderItems = [];

  // Validate prices from DB
  for (const item of items) {
    const productRef = admin.firestore().collection('products').doc(item.id);
    // eslint-disable-next-line no-await-in-loop
    const productSnap = await productRef.get();
    if (!productSnap.exists) continue;
    const productData = productSnap.data();

    const price = productData.price;
    totalAmount += price * item.quantity;

    orderItems.push({
      productId: item.id,
      name: productData.name,
      price: price,
      quantity: item.quantity,
      image: productData.featuredImageUrl || '',
      selectedOptions: item.selectedOptions || {},
    });
  }

  const orderData = {
    userId: userId,
    userEmail: context.auth.token.email || shippingDetails.email,
    items: orderItems,
    totalAmount: totalAmount,
    shippingDetails: shippingDetails,
    paymentMethod: paymentMethod,
    status: 'Pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const orderRef = await admin.firestore().collection('orders').add(orderData);
  return {orderId: orderRef.id, success: true};
});

// --- EMAIL TRIGGER ---
exports.sendOrderConfirmation = functions.firestore
    .document('orders/{orderId}')
    .onCreate(async (snap, context) => {
      const order = snap.data();
      const orderId = context.params.orderId;

      order.orderId = orderId;

      const mailOptions = {
        from: '"Pahnawa Banaras" <your-email@gmail.com>',
        to: order.userEmail || order.shippingDetails.email,
        subject: `Order Confirmed #${orderId.slice(0, 6)}`,
        html: createEmailTemplate(order),
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent to:', mailOptions.to);
        return snap.ref.update({emailSent: true});
      } catch (error) {
        console.error('Error sending email:', error);
        return null;
      }
    });