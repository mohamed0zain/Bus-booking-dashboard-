const { v4 } = require('uuid');
const express = require('express')
const router = express.Router()
const adminAuth =require('../middleware/admin')
const connection= require('../db/connection')
const util = require("util"); //helper
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

 

// API requests
// get request --> retrive data from server
// post request --> saving data
// put request --> updata data
// delete --> delete data from server

//get request--> get all travellers
router.get("/", adminAuth ,(req, res)=> {
    connection.query("select * from user ",(err,results,fields)=>{
        res.json(results);
    });
});
//post request --> create  User
router.post("/",
body("email").isEmail().withMessage("enter valid email"),
body("password")  
  .isLength({ min: 5, max: 12 })
  .withMessage("password should be between (5,12)character"),
body("phone")
  .isLength({ min: 11, max: 11 })
  .withMessage("This phone number isn't valid"),adminAuth,async(req,res)=>{
    try{
        const data = req.body;
        const query = util.promisify(connection.query).bind(connection); //query to promise to use await and async
        const checkEmailExist = await query(
          "select * from user where email = ?",
          [req.body.email]
        );
        if (checkEmailExist.length > 0) {
          return res.status(400).json({ message: "Email already exists" });
        }
      await query("insert into user set ? ",{ email:data.email ,phone: data.phone, status:"inactive", type:"traveler" ,password : await bcrypt.hash(req.body.password, 10), token: crypto.randomBytes(16).toString("hex"), })
      res.status(200).json({message:"Traveler created"})
    }catch(err){
        console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
   
   
});
// get spasific user
router.get("/:email", async (req, res)=> {
    const {email} = req.params;
 await  connection.query("select * from user where email = ?",email,(err,results,fields)=>{
    if (results[0] ) {
        res.status(200).json(results[0]);

    } else {

        res.statusCode=404;
        res.send([{
            "message":"no Users found"
       
        }]);    }
   } );

  });

//pUT request --> UPDATE User
router.put("/:email",
body("email").isEmail().withMessage("enter valid email"),
body("password")  
  .isLength({ min: 5, max: 12 })
  .withMessage("password should be between (5,12)character"),
body("phone")
  .isLength({ min: 11, max: 11 })
  .withMessage("This phone number isn't valid"),adminAuth,async (req, res) => {
  try{
      const { email } = req.params;
    const { phone, password } = req.body;
    const encPassword = await bcrypt.hash(req.body.password, 10);
   const query = util.promisify(connection.query).bind(connection);
  await query("UPDATE user SET phone = ?, password = ? WHERE email = ?",[phone, encPassword,email])
    res.status(200).json({msg:"user updated successfully"})
  }catch(err){
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//delete request --> remove spasific User
router.delete("/:email",(req,res)=>{
    const {email} = req.params;
   connection.query("delete from user where email = ?",email,(err,results)=>{
    if (err) {
        res.statusCode=500;
        res.json({
            "message":"field to delete"
        })
    } else {
        res.json({
            "message":"User deleted"
        })
    }
   })
});

module.exports = router;
