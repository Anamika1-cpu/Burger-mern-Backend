import app from "./app.js";
import { connectDb } from "./config/database.js";
connectDb();
app.get("/", (req, res, next) => {
  res.send("<h1>Working</h1>");
});
app.listen(process.env.PORT, () => {
  console.log(`Server is connected on port ${process.env.PORT}`);
});
