const express = require("express");
const router = express.Router();
const adminAuth = require('../middleware/admin');
const connection = require("../db/connection");
const util = require("util");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// GET all travelers (admin only)
router.get("/", adminAuth, (req, res) => {
  connection.query("SELECT * FROM user", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch travelers" });
    } else {
      res.json(results);
    }
  });
});

// POST request to create traveler (admin only)
router.post("/", adminAuth, [
  body("email").isEmail().withMessage("Enter valid email"),
  body("password").isLength({ min: 5, max: 12 }).withMessage("Password should be between 5-12 characters"),
  body("phone").isLength({ min: 11, max: 11 }).withMessage("Enter a valid 11-digit phone number")
], async (req, res) => {
  try {
    const data = req.body;
    const query = util.promisify(connection.query).bind(connection);

    const checkEmailExist = await query("SELECT * FROM user WHERE email = ?", [req.body.email]);
    if (checkEmailExist.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const traveler = {
      email: data.email,
      password: await bcrypt.hash(req.body.password, 10),
      phone: data.phone,
      type: "traveler",
      status: "inactive",
      token: crypto.randomBytes(16).toString("hex")
    };

    await query("INSERT INTO user SET ?", [traveler]);
    delete traveler.password;
    res.status(200).json(traveler);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET specific traveler by email
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  connection.query("SELECT * FROM user WHERE email = ?", email, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch traveler" });
    } else {
      if (results[0]) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ message: "No user found" });
      }
    }
  });
});

// PUT request to update traveler by email (admin only)
router.put("/:email", adminAuth, [
  body("email").isEmail().withMessage("Enter valid email"),
  body("password").isLength({ min: 5, max: 12 }).withMessage("Password should be between 5-12 characters"),
  body("phone").isLength({ min: 11, max: 11 }).withMessage("Enter a valid 11-digit phone number")
], async (req, res) => {
  try {
    const { email } = req.params;
    const { password, phone } = req.body;
    const query = util.promisify(connection.query).bind(connection);
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await query("UPDATE user SET password = ?, phone = ? WHERE email = ?", [hashedPassword, phone, email]);
    
    res.status(200).json({ message: "Traveler updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE request to delete traveler by email (admin only)
router.delete("/:email", adminAuth, async (req, res) => {
  try {
    const { email } = req.params;
    const query = util.promisify(connection.query).bind(connection);
    
    await query("DELETE FROM user WHERE email = ?", [email]);
    
    res.status(200).json({ message: "Traveler deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
