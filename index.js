const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.createOrder = functions.https.onCall(async (data, context) => {
  // 1. Check if user is logged in
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be logged in to place an order.",
    );
  }

  const {items, shippingDetails, paymentMethod} = data;
  const userId = context.auth.uid;

  if (!items || items.length === 0) {
    throw new functions.https.HttpsError("invalid-argument", "Cart is empty");
  }

  let totalAmount = 0;
  const orderItems = [];

  // 2. Validate Prices & Stock from Database
  for (const item of items) {
    const productRef = admin.firestore().collection("products").doc(item.id);
    const productSnap = await productRef.get();

    if (!productSnap.exists) {
      throw new functions.https.HttpsError(
          "not-found",
          `Product ${item.name} not found`,
      );
    }

    const productData = productSnap.data();

    const price = productData.price;
    const itemTotal = price * item.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      productId: item.id,
      name: productData.name,
      price: price,
      quantity: item.quantity,
      image: productData.featuredImageUrl || "",
      selectedOptions: item.selectedOptions || {},
    });
  }

  // 3. Create the Order Object
  const orderData = {
    userId: userId,
    items: orderItems,
    totalAmount: totalAmount,
    shippingDetails: shippingDetails,
    paymentMethod: paymentMethod,
    status: "Pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // 4. Handle Payment Logic
  if (paymentMethod === "online") {
    // Placeholder for Razorpay integration
  }

  // 5. Save to Firestore
  const orderRef = await admin.firestore().collection("orders").add(orderData);

  // 6. Return Order ID to Frontend
  return {orderId: orderRef.id, success: true};
});
