const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../db/connection");
const util = require("util");
const adminAuth = require('../middleware/admin');

// Admin PUT request
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const query = util.promisify(connection.query).bind(connection);
    const idApps = await query("SELECT appointment_id FROM travelerappointment WHERE id = ?", [id]);
    const idApp = idApps[0].appointment_id;
    const travelersResults = await query("SELECT travelers FROM appointment WHERE id = ?", [idApp]);
    let traveler = travelersResults[0].travelers;

    if (traveler == 0) {
      await query("UPDATE travelerappointment SET request = ? WHERE appointment_id = ?", ["declined", idApp]);
      return res.status(404).json({ msg: "No seats left" });
    }

    if (status == "accepted" || status == "declined") {
      if (status == "accepted") {
        traveler = traveler - 1;
        await query("UPDATE appointment SET travelers = ? WHERE id = ?", [traveler, idApp]);
      }
      await query("UPDATE travelerappointment SET request = ? WHERE id = ?", [status, id]);
      if (traveler == 0) {
        await query("UPDATE travelerappointment SET request = ? WHERE appointment_id = ?", ["declined", idApp]);
      }
      res.status(200).json({ msg: "Appointment request updated successfully" });
    } else {
      res.status(500).json({ msg: "Enter a valid status" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin GET all pending requests
router.get("/", adminAuth, async (req, res) => {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const requests = await query("SELECT * FROM travelerappointment WHERE request = ?", ["pending"]);
    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin GET specific request by ID
router.get("/specific/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const query = util.promisify(connection.query).bind(connection);
    const request = await query("SELECT * FROM travelerappointment WHERE id = ?", [id]);
    res.status(200).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin GET requests by user email
router.get("/user/:email", adminAuth, async (req, res) => {
  try {
    const { email } = req.params;
    const query = util.promisify(connection.query).bind(connection);
    const requests = await query("SELECT * FROM travelerappointment WHERE traveler_id = ?", [email]);
    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
