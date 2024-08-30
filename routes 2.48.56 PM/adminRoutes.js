import express from "express";
import { addAdmin, adminLogin, getAdmins, getAdminsById } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/signup", addAdmin);
adminRouter.post("/login",adminLogin );
adminRouter.get("/",getAdmins );
adminRouter.get("/:id", getAdminsById);

export default adminRouter;
