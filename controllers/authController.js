import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};
//register function
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        console.log("❌ Registration error: Email already in use");
      return res.status(400).json({ message: "Email already in use" });
      
    }
    const user = new User({ username, email, password });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
//login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        console.log("❌ Login error: Invalid credentials");
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("❌ Login error: Invalid credentials");   
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const registerUser = async (req, res) => {
  console.log("📥 register req.body:", req.body);
    return register(req, res);
};

export const loginUser = async (req, res) => {
  console.log("📥 login req.body:", req.body);
    return login(req, res);
}