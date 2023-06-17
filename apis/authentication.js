import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import account from "../models/account.js";

import validateInput from "./validations/authentication.js";

const router = Router();

// @route     POST  /register
// @desc      POST  create account
// @access    Public
// Body       email and password
// Response   json web token
router.post("/register", async (req, res) => {
  const { message, isValid } = validateInput(req.body);
  if (!isValid) return res.status(400).json({message: message});

  try {
    const { email, password } = req.body;
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

// @route     POST  /login
// @desc      login
// @access    Public
// Body       email and password
// Response   json web token
router.post("/login", async (req, res) => {
  const { message, isValid } = validateInput(req.body);
  if (!isValid) return res.status(400).json({message: message});

  try {
    const { email, password } = req.body;

    const user = await account.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Account does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN_KEY, {
      expiresIn: 7200, // 2 hours in seconds
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error during login", error: err });
  }
});

export default router;
