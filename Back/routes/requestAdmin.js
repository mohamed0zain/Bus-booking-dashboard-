const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../db/connection");
const util = require("util"); //helper
const adminAuth =require('../middleware/admin')
//Admin put request
router.put("/:id", adminAuth, async (req, res) => {
    try {
      const { status } = req.body;
      const {id} = req.params;
      const query = util.promisify(connection.query).bind(connection);
      const idApps = await query("select appointment_id from travelerappointment where id =?",[id]);
      const  idApp =  idApps[0].appointment_id;
      const travelersResults=  await  query("select travelers from appointment where id =?", [idApp]);
      let traveler = travelersResults[0].travelers;
      if (traveler == 0) { 
        const query = util.promisify(connection.query).bind(connection);
        await query("UPDATE travelerappointment SET request = ? WHERE appointment_id = ?", ["declined", idApp]);
        res.status(404).json({msg:"no sets left"});
       
      }
      else{
      
      if (status == "accepted" || status == "declined") {
         if (status == "accepted") {
            const query = util.promisify(connection.query).bind(connection);
            traveler = traveler-1;
            await  query("update appointment set travelers = ? where id = ? ", [traveler,idApp])
            
        }
      const query = util.promisify(connection.query).bind(connection);
      await query("UPDATE travelerappointment SET request = ? WHERE id = ?", [status, id]);
      if (traveler == 0) { 
        const query = util.promisify(connection.query).bind(connection);
        await query("UPDATE travelerappointment SET request = ? WHERE appointment_id = ?", ["declined", idApp]);
       
      }
      res.status(200).json({ msg: "Appointment request updated successfully" }); } 
      else {
        res.status(500).json({msg : "enter a valid status"});
      }
  
    }
     
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.get("/",adminAuth, async (req, res) => {
    try{
    const query = util.promisify(connection.query).bind(connection);
    const requests = await query("SELECT * FROM travelerappointment where request =? ",["pending"]);
    res.status(202).json(requests);
    }
    catch(err){
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
//get spacific Request
router.get("/spasific/:id",adminAuth, async (req, res) => {
  try{
    const { id } = req.params;
  const query = util.promisify(connection.query).bind(connection);
  const requests = await query("SELECT * FROM travelerappointment where id =? ",[id]);
  res.status(200).json(requests);
  }
  catch(err){
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//get Users Requests
router.get("/user/:email",adminAuth, async (req, res) => {
  try{
    const { email } = req.params;
      const query = util.promisify(connection.query).bind(connection);
  const requests = await query("SELECT * FROM travelerappointment where traveler_id =? ",[email]);
  res.status(200).json(requests);
  }
  catch(err){
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
  module.exports = router;