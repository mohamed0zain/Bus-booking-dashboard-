const express = require("express");
const router = express.Router();
const util = require("util"); //helper
const connection= require('../db/connection')
const authoried =async (req,res,next)=>{
    const query = util.promisify(connection.query).bind(connection); 
    const {token} = req.headers;
    const user =await query("select * from user where token = ?",[token]);
    if(user[0]){
        next();
    }
    else{
        res.status(403).json({
            msg : "you are not aythorized to acess this rout !"
        });
        return  
    }
}   
module.exports= authoried;

