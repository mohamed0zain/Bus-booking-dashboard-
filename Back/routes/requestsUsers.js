const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../db/connection");
const util = require("util");
const authorized = require("../middleware/authorize");

// User POST request to request appointment
router.post("/", authorized, async (req, res) => {
  try {
    const { appointment_id } = req.body;
    const token = req.headers.token;
    const query = util.promisify(connection.query).bind(connection);
    const emailResult = await query("SELECT email FROM user WHERE token = ?", [token]);
    const email = emailResult[0].email;

    const prevRequests = await query("SELECT * FROM travelerappointment WHERE traveler_id = ? AND appointment_id = ?", [email, appointment_id]);
    if (prevRequests.length > 0) {
      return res.status(200).json([{ msg: "You have sent a request before!" }]);
    }

    const request = {
      appointment_id: appointment_id,
      request: "pending",
      traveler_id: email
    };

    await query("INSERT INTO travelerappointment SET ?", [request]);
    res.status(200).json([{ msg: "Appointment requested successfully." }]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// User GET requests by user email
router.get("/", authorized, async (req, res) => {
  try {
    const token = req.headers.token;
    const query = util.promisify(connection.query).bind(connection);
    const emailResult = await query("SELECT email FROM user WHERE token = ?", [token]);
    const email = emailResult[0].email;
    const requests = await query("SELECT * FROM travelerappointment WHERE traveler_id = ?", [email]);
    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
