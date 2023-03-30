import app from "./app.js";
import Razorpay from "razorpay";
import { connectDb } from "./config/database.js";
connectDb();
app.get("/", (req, res, next) => {
  res.send("<h1>Working</h1>");
});
app.listen(process.env.PORT, () => {
  console.log(
    `Server is connected on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

export const instance = new Razorpay({
  key_id: process.env.RAZOR_KEY,
  key_secret: process.env.RAZOR_SECRET,
});
