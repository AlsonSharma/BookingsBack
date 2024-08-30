import express from "express";
import { addMovie, deleteMovies, getAllMovies, getMoviesById, updateMovies } from "../controllers/movieController.js";
const movieRouter = express.Router();

movieRouter.get("/",getAllMovies);
movieRouter.get("/:id",getMoviesById);
movieRouter.post("/", addMovie);
movieRouter.put("/:id", updateMovies);
movieRouter.delete("/:id", deleteMovies);


export default movieRouter;