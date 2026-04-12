const orderDba = require("../../dba/orderDba");
const cartDba = require("../../dba/cartDba");
const inventoryDba = require("../../dba/inventoryDba");

const createOrderFromCart = async (userId, orderId, paymentIntent, customerInfo) => {
  try {
    // Fetch user's cart
    const cart = await cartDba.getCartByUserId(userId);

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // Validate inventory and decrement quantities
    for (const item of cart.items) {
      const available = await inventoryDba.checkAvailability(item.id, item.qty);
      if (!available) {
        throw new Error(`Insufficient inventory for ${item.name}`);
      }
      await inventoryDba.decrementInventory(item.id, item.qty);
    }

    // Calculate charges
    const subtotal = cart.total_amount || cart.totalAmount;
    const taxRate = 0.05; // 5% tax
    const tax = subtotal * taxRate;
    const roundedTax = Math.floor(tax);
    const platformFee = 4 + Math.ceil(tax - roundedTax);
    const deliveryFee = subtotal > 500 ? 0 : 50; // Free delivery if > ₹500
    const totalAmount = subtotal + roundedTax + platformFee + deliveryFee;
 

  
    // Create order from cart
    const orderData = {
      orderId,
      userId,
      items: cart.items,
      subtotal,
      tax: roundedTax,
      deliveryFee,
      platformFee,
      totalAmount,
      paymentIntent,
      customerEmail: customerInfo.userEmail || customerInfo.email,
      customerName: customerInfo.userName || customerInfo.name,
      shippingAddress: customerInfo.address?.[0] || {},
    };

    const order = await orderDba.createOrder(orderData);

    // Clear cart after successful order creation
    await cartDba.clearCart(userId);

    return order;
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};

const completeOrder = async (orderId) => {
  try {
    const order = await orderDba.updateOrderStatus(orderId, "completed");
    return order;
  } catch (error) {
    throw new Error(`Error completing order: ${error.message}`);
  }
};

const failOrder = async (orderId) => {
  try {
    const order = await orderDba.getOrderById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Return inventory items to stock
    for (const item of order.items) {
      await inventoryDba.incrementInventory(item.id, item.qty);
    }

    const updatedOrder = await orderDba.updateOrderStatus(orderId, "failed");
    return updatedOrder;
  } catch (error) {
    throw new Error(`Error failing order: ${error.message}`);
  }
};

const getOrderStatus = async (orderId) => {
  try {
    const order = await orderDba.getOrderById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const id = order.order_id || order.orderId;
    const status = order.status;
    const amount = order.total_amount || order.totalAmount;

    return { id, status, amount };
  } catch (error) {
    throw new Error(`Error fetching order status: ${error.message}`);
  }
};

const getUserOrders = async (userId) => {
  try {
    const orders = await orderDba.getUserOrders(userId);
    return orders;
  } catch (error) {
    throw new Error(`Error fetching user orders: ${error.message}`);
  }
};

module.exports = {
  createOrderFromCart,
  completeOrder,
  failOrder,
  getOrderStatus,
  getUserOrders,
  // Keep legacy functions for backward compatibility
  fetchOrderStatus: getOrderStatus,
};