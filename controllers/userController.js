import User from "../models/User.js";
import bcrypt from "bcryptjs";
export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (e) {
    return res.status(500).json({message: "Internal Server Error"});
  }
  if (!users) {
    return res.status(500).json({ message: "No users found" });
  }
  return res.status(200).json({ users });
};

//Signup
export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (
    !name ||
    name.trim() === "" ||
    !email ||
    email.trim() === "" ||
    !password ||
    password.trim() === ""
  ) {
    return res.status(422).json({ Message: "Invalid Inputs" });
  }

  const hashedPassword = bcrypt.hashSync(password);
  let user;
  try {
    user = new User({ name, email, password: hashedPassword });
    user = await user.save();
  } catch (e) {
    return res.status(500).json({message: "Internal Server Error"});
  }

  if (!user) {
    return res.status(500).json({ message: "Unexpected error occured" });
  }
  return res.status(201).json({ id: user._id });
};

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  if (
    !name ||
    name.trim() === "" ||
    !email ||
    email.trim() === "" ||
    !password ||
    password.trim() === ""
  ) {
    return res.status(422).json({ Message: "Invalid Inputs" });
  }
  const hashedPassword = bcrypt.hashSync(password);
  let user;
  try {
    user = await User.findByIdAndUpdate(id, {
      name,
      email,
      password: hashedPassword,
    });
  } catch (e) {
    res.status(500).json({message: "Internal Server Error"});
  }
  if(!user) {
    return res.status(500).json({message: "Something went wrong"})
  }
  res.status(200).json({message: "Updated Successfully"});
};
export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;

  try {
    user = await User.findByIdAndDelete(id);
  } catch (e) {
    return res.status(500).json({message: "Internal Server Error"});
  }
  if(!user) {
    return res.status(500).json({message: "Something went wrong"})
  }
  res.status(200).json({message: "deleted Successfully"});
};

//Login
export const login = async(req, res, next) => {
  
  const { email, password } = req.body;
  if (
    !email ||
    email.trim() === "" ||
    !password ||
    password.trim() === ""
  ) {
    return res.status(422).json({ Message: "Invalid Inputs" });
  }
let existingUser;
  try{
    existingUser = await User.findOne({email});
  }catch(e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  if(!existingUser) {
    return res.status(400).json({message: "Unable to find user"});
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  if(!isPasswordCorrect) {
    return res.status(400).json({message: "Incorrect Password"});
  }

  return res.status(200).json({message: "Login Successfull", id: existingUser._id});
}

// Get User By ID
export const getUserById = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findById(id);
    
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected error occured" });
  }
  return res.status(200).json({ user });
};