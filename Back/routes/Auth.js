const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../db/connection");
const util = require("util"); //helper
const { hash } = require("bcrypt");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
//LOGIN
router.post(
  "/login",
  body("email").isEmail().withMessage("enter valid email"),
 /* body("password")
    .isLength({ min: 10, max: 20 })
    .withMessage("password should be between 10 and 20 characters"),*/
  async (req, res) => {
    try {
      //VALIDATION REQUEST {EXPRESS VALIDATOR}
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //CHECK IF EMAIL EXISTS
      //AWAIT/ASYNC
      const query = util.promisify(connection.query).bind(connection); //query to promise to use await and async
      const user = await query(
        "select * from user where email = ?",
        [req.body.email]
      );
      if (user.length == 0) {
          res.status(404).json({
          msg: "email or password not found",
        });
      }
      //COMPARE PASSWORD
      const checkPassword=await bcrypt.compare(req.body.password,user[0].password);
      if (checkPassword) {
       
     //   delete user[0].password;
        res.status(200).json(user[0]);
      }else{
        res.status(404).json({
            msg: "email or password not found",
          });
      }
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err });
    }
  }
);
// REGISTERATION
router.post(
  "/register",
  body("email").isEmail().withMessage("enter valid email"),
  body("password")  
    .isLength({ min: 5, max: 12 })
    .withMessage("password should be between (5,12)character"),
  body("phone")
    .isLength({ min: 11, max: 11 })
    .withMessage("This phone number isn't valid"),
  async (req, res) => {
    try {
      //VALIDATION REQUEST {EXPRESS VALIDATOR}
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //CHECK IF EMAIL EXISTS
      //AWAIT/ASYNC
      const query = util.promisify(connection.query).bind(connection); //query to promise to use await and async
      const checkEmailExist = await query(
        "select * from user where email = ?",
        [req.body.email]
      );
      if (checkEmailExist.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      //PREPARE OBJECT TRAVELLER TP SAVE
      const traveler = {
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        phone: req.body.phone,
        type: "traveler",
        status: "active",
        token: crypto.randomBytes(16).toString("hex"), //CRYPTO => RANDOM ENCRYPTION STANDARD
      };
      //INSERT USER OBJECT INTO DB
      await query("insert into user set ?", traveler);
      delete traveler.password;
      res.status(200).json(traveler);
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err });
    }
  }
);

module.exports = router;




