import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import account from "../models/account.js";

const router = Router();

// @route     POST  /register
// @desc      POST  create account
// @access    Public
// Body       email and password
// Response   json web token
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await account.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newAccount = new account({
      email: email,
      password: hash,
    });

    const savedUser = await newAccount.save();

    jwt.sign(
      { id: savedUser.id },
      process.env.JWT_TOKEN_KEY,
      { expiresIn: 7200 },
      (err, token) => {
        if (err) {
          return res.status(500).json({
            message: "Error during token generation",
            error: err,
          });
        }
        res.json({ token: token });
      }
    );
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving account information",
      error: err,
    });
  }
});

export default router;
