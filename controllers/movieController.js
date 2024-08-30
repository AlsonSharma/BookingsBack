import jwt from "jsonwebtoken";
import Movie from "../models/Movies.js";
import Admin from "../models/Admin.js";
import mongoose from "mongoose";
export const addMovie = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1]; // Bearer Token
  if (!extractedToken && extractedToken.trim() === "") {
    return res.status(400).json({ message: "Token not found" });
  }
  let adminId;

  // Verify Token
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` });
    } else {
      adminId = decrypted.id;
      return;
    }
  });

  // Create a new movie
  const { title, description, releaseDate, posterUrl, featured, actors } = req.body;
  if (
    !title &&
    title.trim() === "" &&
    !description &&
    description.trim() === "" &&
    !posterUrl &&
    posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  let movie;
  try {
    movie = new Movie({
      title,
      description,
      releaseDate: new Date(`${releaseDate}`),
      featured,
      actors,
      admin: adminId,
      posterUrl,
    });

    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(adminId);
    //transaction
    session.startTransaction();
    await movie.save({session});
    adminUser.addedMovies.push(movie);
    await adminUser.save({session});
    await session.commitTransaction();
  } catch (e) {
    return console.log(e);
  }

  if(!movie) {
    return res.status(500).json({message: "Request Failed"})
  }

  return res.status(201).json({movie});

};

export const getAllMovies = async(req, res, next) => {
  let movies;

  try {
    movies = await Movie.find();
  } catch(e) {
    return console.log(e);
  }

  if(!movies) {
    return res.status(500).json({message: "Request Failed"});
  }

  return res.status(200).json({movies});
}
export const getMoviesById = async(req, res, next) => {
  const id = req.params.id;
  let movie;

  try{
   movie = await Movie.findById(id); 
  }catch(e) {
    return console.log(e);
  }

  if(!movie) {
    return res.status(404).json({message: "Invalid Movie ID"});
  }
  return res.status(200).json({movie});
}

export const updateMovies = async(req, res, next) => {
  const id = req.params.id;
  const {title, description, actors, releaseDate, posterUrl, featured} = req.body;
  let movie;

  try{
   movie = await Movie.findByIdAndUpdate(id, {
    title, 
    description,
    actors,
    releaseDate,
    posterUrl,
    featured,
   }); 
  }catch(e) {
    return console.log(e);
  }

  if(!movie) {
    return res.status(404).json({message: "Invalid Movie ID"});
  }
  return res.status(200).json({message: "updated Successfully"});
}

//Delete
export const deleteMovies = async(req, res, next) => {

  const id = req.params.id;
  let movie;

  try{
    movie = await Movie.findByIdAndDelete(id);
  }catch(e) {
    console.log(e);
  }
  if(!movie) {
    return res.status(404).json({message: "Invalid Movie ID"});
  }
  return res.status(200).json({message: "Deleted Successfully"});
}