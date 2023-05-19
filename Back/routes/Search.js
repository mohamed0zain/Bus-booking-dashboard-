const express =  require('express')
const router = express.Router()
const connection= require('../db/connection');
const authorized = require('../middleware/authorize');
const util = require("util");

router.get("/", authorized, async (req, res) => {
    try {
      const token = req.headers.token;
      const query = util.promisify(connection.query).bind(connection);
      const emailResult = await query("SELECT email FROM user WHERE token = ?", [token]);
      const email = emailResult[0].email;
      const results = await query("select * from search where user_email = ?", [email]);
      const searchTerms = results.map((item) => item.search);
      res.status(200).json(searchTerms);   
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  module.exports = router;