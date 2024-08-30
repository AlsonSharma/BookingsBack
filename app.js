import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import movieRouter from "./routes/MovieRoutes.js";
import bookingsRouter from "./routes/bookingRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173' 
}));



app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter)

mongoose
  .connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.ryqr0la.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() =>
    app.listen(process.env.PORT || 4080, () =>
      console.log("Connected to database and server is running")
    )
  )
  .catch((e) => console.log(e));
