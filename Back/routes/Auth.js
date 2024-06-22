const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const util = require("util");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const connection = require("../db/connection");

// LOGIN
router.post("/login", [
  body("email").isEmail().withMessage("Enter valid email")
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const query = util.promisify(connection.query).bind(connection);
    const user = await query("SELECT * FROM user WHERE email = ?", [req.body.email]);

    if (!user.length || !await bcrypt.compare(req.body.password, user[0].password)) {
      return res.status(404).json({ msg: "Email or password not found" });
    }

    res.status(200).json(user[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
});

// REGISTERATION
router.post("/register", [
  body("email").isEmail().withMessage("Enter valid email"),
  body("password").isLength({ min: 5, max: 12 }).withMessage("Password should be between 5 and 12 characters"),
  body("phone").isLength({ min: 11, max: 11 }).withMessage("This phone number isn't valid")
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const query = util.promisify(connection.query).bind(connection);
    const checkEmailExist = await query("SELECT * FROM user WHERE email = ?", [req.body.email]);

    if (checkEmailExist.length > 0) {
      return res.status(400).json({ msg: "Email already exists!" });
    }

    const checkPhoneExist = await query("SELECT * FROM user WHERE phone = ?", [req.body.phone]);
    if (checkPhoneExist.length > 0) {
      return res.status(400).json({ msg: "Phone number already exists!" });
    }

    const userData = {
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      phone: req.body.phone,
      token: crypto.randomBytes(16).toString("hex")
    };

    await query("INSERT INTO user SET ?", userData);
    delete userData.password;

    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
});

module.exports = router;
