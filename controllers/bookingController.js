import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movies.js";
import User from "../models/User.js";

// Create 
export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumber, user } = req.body;

  let existingMovie;
  let existingUser;

  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Fetching movie/user failed" });
  }

  if (!existingMovie) {
    return res.status(404).json({ message: "Movie not found with given id" });
  }

  if (!existingUser) {
    return res.status(404).json({ message: "User not found with given id" });
  }

  let booking;

  try {
    booking = new Bookings({
      movie,
      date: new Date(date),
      seatNumber,
      user,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);
    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });
    await session.commitTransaction();

  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Unable to create a booking" });
  }

  return res.status(201).json({ booking });
};

// Get 
export const getAllBooking = async (req, res, next) => {
  let bookings;

  try {
    bookings = await Bookings.find().populate('movie', 'title description').populate('user', 'name email');
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Request Failed" });
  }

  if (!bookings) {
    return res.status(404).json({ message: "No bookings found" });
  }

  return res.status(200).json({ bookings });
};

// Get booking by ID
export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;

  try {
    booking = await Bookings.findById(id).populate('movie', 'title description').populate('user', 'name email');
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Unexpected error occurred" });
  }

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  return res.status(200).json({ booking });
};

// Delete booking by ID
export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;
  let booking;

  try {
    booking = await Bookings.findByIdAndDelete(id).populate("user").populate("movie");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    await booking.user.bookings.pull(booking);
    await booking.movie.bookings.pull(booking);
    await booking.user.save({ session });
    await booking.movie.save({ session });
    await session.commitTransaction();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Unable to delete" });
  }

  return res.status(200).json({ message: "Deleted successfully" });
};
