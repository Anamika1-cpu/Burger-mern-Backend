import express from "express";
import {
  getAdminOrders,
  getMyOrders,
  getOrderDetails,
  placeOrder,
  placeOrderOnline,
  processOrder,
} from "../controllers/order.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post(
  "/createOrder",
  //  isAuthenticated,
  placeOrder
);
router.post(
  "/createOrderOnline",
  //  isAuthenticated,
  placeOrderOnline
);
router.get("/myOrders", isAuthenticated, getMyOrders);

router.get("/order/:id", isAuthenticated, getOrderDetails);

//add admin middleware
router.get("/admin/orders", isAuthenticated, authorizeAdmin, getAdminOrders);

router.get("/admin/order/:id", isAuthenticated, authorizeAdmin, processOrder);

export default router;
