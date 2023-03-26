import mongoose from "mongoose";

const schema = new mongoose.Schema({
  razorpay_order_id: {
    type: "String",
    required: true,
  },
  razorpay_payment_id: {
    type: "String",
    required: true,
  },
  razorpay_signature_id: {
    type: "String",
    required: true,
  },
  created_At: {
    type: "Date",
    default: Date.now,
  },
});

export const payment = mongoose.model("Payment", schema);
