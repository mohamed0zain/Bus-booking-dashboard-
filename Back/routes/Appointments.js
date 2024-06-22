const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const util = require("util");
const moment = require('moment');
const fs = require('fs');

const connection = require('../db/connection');
const authorized = require('../middleware/authorize');
const adminAuth = require('../middleware/admin');
const upload = require('../middleware/uploadImages');

const AllApp = "SELECT * FROM appointments";

// Helper function for promisifying queries
const query = util.promisify(connection.query).bind(connection);

// Get all appointments [ADMIN, USER]
router.get("/", async (req, res) => {
  try {
    const results = await query("SELECT * FROM appointment");
    results.map(appointment => {
      appointment.image = "http://" + req.hostname + ":4000/" + appointment.image;
    });
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// Get specific appointments => search function
router.get("/:search", authorized, async (req, res) => {
  const { search } = req.params;
  const token = req.headers.token;

  try {
    const result = await query("SELECT * FROM appointment WHERE from_location = ? OR to_location = ?", [search, search]);
    if (!result.length) {
      res.status(404).json({ msg: "No appointment found" });
    } else {
      const emailResult = await query("SELECT email FROM user WHERE token = ?", [token]);
      const email = emailResult[0].email;
      const searchData = {
        user_email: email,
        search: search
      };
      await query("INSERT INTO search SET ?", searchData);
      res.json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});

// Add Appointment
router.post("/", adminAuth, upload.single("image"), [
  body("from_location").isString().withMessage("Please enter a valid location!").isLength({ min: 4 }).withMessage("Enter valid location"),
  body("to_location").isString().withMessage("Please enter a valid location!").isLength({ min: 4 }).withMessage("Enter valid location"),
  body("ticket_price").isLength({ max: 6 }).withMessage("Please enter a price!"),
  body("max_num_of_travelers").isLength({ max: 6 }).withMessage("Please enter a number of travelers!"),
  body("day").custom(value => {
    if (!moment(value, "YYYY/MM/DD", true).isValid()) {
      throw new Error("Please enter a valid date (YYYY/MM/DD)");
    }
    return true;
  }),
  body("time").custom(value => {
    if (!moment(value, "HH:mm", true).isValid()) {
      throw new Error("Please enter a valid time (HH:mm)");
    }
    return true;
  })
], async (req, res) => {
  try {
    const data = req.body;

    if (!req.file) {
      return res.status(400).json({
        errors: [{ msg: "Image is required!" }]
      });
    }

    const appointment = {
      from_location: data.from_location,
      to_location: data.to_location,
      ticket_price: data.ticket_price,
      day: data.day,
      time: data.time,
      max_num_of_travelers: data.max_num_of_travelers,
      image: req.file.filename,
      travelers: data.max_num_of_travelers
    };

    await query("INSERT INTO appointment SET ?", appointment);
    res.status(200).json([{ msg: "Appointment created!" }]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
});

// Update Appointment

router.put("/:id", adminAuth, upload.single("image"), [
  body("from_location").isString().withMessage("Please enter a valid location!").isLength({ min: 4 }).withMessage("Enter valid location"),
  body("to_location").isString().withMessage("Please enter a valid location!").isLength({ min: 4 }).withMessage("Enter valid location"),
  body("ticket_price").isLength({ max: 6 }).withMessage("Please enter a price!"),
  body("max_num_of_travelers").isLength({ max: 6 }).withMessage("Please enter a number of travelers!"),
  body("day").custom(value => {
    if (!moment(value, "YYYY-MM-DD", true).isValid()) {
      throw new Error("Please enter a valid date (YYYY-MM-DD)");
    }
    return true;
  }),
  body("time").custom(value => {
    if (!moment(value, "HH:mm:ss", true).isValid()) {
      throw new Error("Please enter a valid time (HH:mm:ss)");
    }
    return true;
  })
], async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  // Validation request {Express Validator}
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check appointment exists
    const appointment = await query("SELECT * FROM appointment WHERE id = ?", [id]);
    if (!appointment.length) {
      return res.status(404).json({ msg: "Appointment not found!" });
    }

    // Update the appointment
    const updatedAppointment = {
      from_location: data.from_location,
      to_location: data.to_location,
      ticket_price: data.ticket_price,
      day: data.day,
      time: data.time,
      max_num_of_travelers: data.max_num_of_travelers,
      image: req.file ? req.file.filename : appointment[0].image,
      travelers: data.max_num_of_travelers
    };

    if (req.file) {
      fs.unlinkSync("./Upload/" + appointment[0].image);
    }

    await query("UPDATE appointment SET ? WHERE id = ?", [updatedAppointment, id]);

    res.json({
      message: "Appointment updated",
      updatedAppointment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update appointment" });
  }
});

// Delete specific Appointment
router.delete("/:id", adminAuth, (req, res) => {
  const { id } = req.params;

  connection.query("DELETE FROM appointment WHERE id = ?", id, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete appointment" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: "Appointment not found" });
    } else {
      res.json({ message: "Appointment deleted" });
    }
  });
});

// Get specific appointment by ID
router.get("/id/:id", authorized, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query("SELECT * FROM appointment WHERE id = ?", [id]);
    if (!result.length) {
      res.status(404).json({ msg: "No appointment found" });
    } else {
      res.json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
});

module.exports = router;
