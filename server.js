const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.listen(4000, () => console.log("app is running on 4000"));

const mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "test",
  password: "newpassword",
  database: "mytestdb",
  port: "3306",
});
connection.connect();
// 'SELECT * from tutorials_tbl tutorial_author = ${'John Poul'}'
connection.query("SELECT * FROM user", function (err, rows, fields) {
  console.log("The solution is: ", rows);
});

const database = {
  user: [
    {
      id: "123",
      name: "john",
      email: "john",
      password: "cookies",
      entries: 0,
      joinde: new Date(),
    },
    {
      id: "124",
      name: "sally",
      email: "sally",
      password: "sally",
      entries: 0,
      joinde: new Date(),
    },
  ],
};

app.get("/", (req, res) => res.send(database.user));

app.post("/signin", async (req, res) => {
  let found = false;
  const { email, password } = req.body;
  //"SELECT * FROM user WHERE userEmail='+email' && userPassword='+password'  "
  const sql = `SELECT * FROM user WHERE userEmail='${email}' && userPassword='${password}'`;
  console.log(connection);
  console.log("The solution is: ", sql);
  // console.log()
  // const c = await connection.query(sql)
  // console.log(c)
  await connection.query("SELECT * FROM user", function (err, rows, fields) {
    console.log(err);
    // if (rows.length > 0) {
    found = true;
    // return res.json(rows);
    // }
    // console.log("The solution is: ", err);
    // console.log("The solution is: ", fields);
  });
  // database.user.forEach((user) => {
  //   if (req.body.email === user.email && req.body.password === user.password) {
  //     found = true;
  //     return res.json(user);
  //   }
  // });
  if (!found) {
    res.status(400).json("invalid password");
  }
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    console.log(hash);
  });
  database.user.push({
    id: Math.random(),
    name: name,
    email: email,
    password: password,
    entries: 0,
    joinde: new Date(),
  });
  res.json(database.user[database.user.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  console.log(database.user);
  let found = false;
  database.user.forEach((user) => {
    if (user.id == id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("no user found");
  }
});

app.post("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.user.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json("no user found");
  }
});

connection.end();

//cors
//https://naspers.udemy.com/course/the-complete-web-developer-zero-to-mastery/learn/lecture/8820898#notes

//bcypt for password encryption
//https://naspers.udemy.com/course/the-complete-web-developer-zero-to-mastery/learn/lecture/8767508#notes
// bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
//   // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
//   // result == true
// });
// bcrypt.compare(someOtherPlaintextPassword, hash, function (err, result) {
//   // result == false
// });
/* 
/ -->res this is working
/signin --> POST = successfull/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT -->user
*/

// mysql -u harish-p
// C:\cd MySQL installed path\MySQL -uharish -pharish@123

// mysql -u harish -p

// mysql --user=harish --password=harish@123
