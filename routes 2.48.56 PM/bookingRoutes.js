import express from "express";
import { deleteBooking, getAllBooking, getBookingById, newBooking } from "../controllers/bookingController.js";

const bookingsRouter = express.Router();




bookingsRouter.get("/:id", getBookingById);
bookingsRouter.post("/", newBooking);
bookingsRouter.delete("/:id", deleteBooking);

export default bookingsRouter;