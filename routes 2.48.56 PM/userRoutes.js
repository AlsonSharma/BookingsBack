import express from "express";

import { getAllUsers, updateUser, deleteUser, login, getUserById } from "../controllers/userController.js";
import { signup } from "../controllers/userController.js";
import { getAllBooking } from "../controllers/bookingController.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/bookings/:id", getAllBooking);
userRouter.get("/:id", getUserById);
userRouter.post("/signup", signup);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.post("/login", login);
export default userRouter;

