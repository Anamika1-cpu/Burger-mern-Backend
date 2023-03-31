import crypto from "crypto";
import { asyncError } from "../middlewares/errorMiddleware.js";
import { Order } from "../models/Order.js";
import { Payment } from "../models/Payment.js";
import { instance } from "../server.js";
import ErrorHandler from "../utils/errorHandler.js";

export const placeOrder = asyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;
  const user = req.user._id;

  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user,
  };
  await Order.create(orderOptions);
  res.status(201).json({
    success: true,
    message: "Order Places successfully via COD",
  });
});

export const placeOrderOnline = asyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;
  const user = req.user._id;
  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user,
  };

  const options = {
    amount: Number(totalAmount) * 100,
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(201).json({
    success: true,
    order,
    orderOptions,
  });
});

export const getMyOrders = asyncError(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
  }).populate("user", "name");
  res.status(200).json({
    success: true,
    orders,
  });
});

export const paymentVerification = asyncError(async (req, res, next) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature_id,
    orderOptions,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expecSignature = crypto
    .createHmac("sha256", process.env.RAZOR_SECRET)
    .update(body)
    .digest("hex");

  const isAuthentic = expecSignature === body;
  if (isAuthentic) {
    const payment = await Payment.create({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature_id,
    });

    await Order.create({
      ...orderOptions,
      paidAt: Date.now(),
      paymentInfo: payment._id,
    });

    res.status(201).json({
      success: true,
      message: `Order Placed successfully, Payment id:${payment._id}`,
    });
  } else {
    return next(new ErrorHandler("Payment failed", 400));
  }
});
export const getOrderDetails = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate("user", "name");
  if (!order) return next(new ErrorHandler("Invalid order id", 404));

  res.status(200).json({
    success: true,
    order,
  });
});

export const getAdminOrders = asyncError(async (req, res, next) => {
  const orders = await Order.find({}).populate("user", "name");
  res.status(200).json({
    success: true,
    orders,
  });
});

export const processOrder = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler("Invalid order id", 404));

  if (order.orderStatus === "Preparing") {
    order.orderStatus = "Shipped";
  } else if (order.orderStatus === "Shipped") {
    order.orderStatus = "Delivered";
    order.deliveredAt = Date.now();
  } else if (order.orderStatus === "Delivered")
    return next(new ErrorHandler("Food already Delivered", 400));

  await order.save();
  res.status(200).json({
    success: true,
    message: "Status updated successfully",
  });
});
