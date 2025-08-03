import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  const { mobileNumber, password } = req.body;

  try {
    const user = await User.findOne({ mobileNumber });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("jwt", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Login successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Check admin route
router.get("/check-admin", async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ isAdmin: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    res.json({ isAdmin: user?.role === "admin" });
  } catch (err) {
    res.status(403).json({ isAdmin: false });
  }
});

// auth.routes.js
router.post("/logout", (req, res) => {
  res.clearCookie("jwt", { httpOnly: true, sameSite: "Lax", secure: false });
  res.json({ message: "Logged out successfully" });
});


export default router;
