const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'project',
  port:"3306",//defult port
});
 
connection.connect((err)=>{
    if (err) {     
        console.error("connection error");
        return;
    }
    console.log("connected to my sql");
});
 
 
module.exports =connection;