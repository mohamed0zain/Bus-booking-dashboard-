//INTIALIZE EXORESS APP
const express = require("express");
const app = express();
//ALOW HTTP TO COMMUNICATE WITH LOCAL HOST
const cors = require("cors");
app.use(express.static("Uploads"));
app.use(cors());
//GLPAL MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended:true})); //TO ACCESS URL FORM ENCODED
app.use(express.static('Upload'))
// RRQUIRE MODULES
const Admin = require('./routes/Travellers')
const appointments = require('./routes/Appointments');
const auth = require('./routes/Auth');
const history = require('./routes/Search');
const requestUser = require('./routes/requestsUsers');
const requestAdmin = require('./routes/requestAdmin');

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
//API ROUTS
app.use("/adminPage",Admin);
app.use("/ManageAppointments",appointments);
app.use("/auth",auth);
app.use("/history",history);
app.use("/requestUsers",requestUser);
app.use("/requestAdmin",requestAdmin);
//RUN THE APP
app.listen(4000, "localhost", () => {
  console.log("Server Running");
});
