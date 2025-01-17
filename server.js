const express = require("express");
const cors = require("cors");
// const sqldb = require('./utiles/database');
// const { dbConnect } = require('./utiles/dbConnect');
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();

// dbConnect();
// function getPerson(){
//   sqldb.execute("SELECT * FROM user").then(([row, fileData]) => {
//     console.log(row);
//   });
// }
// function insertPerson(){
//   const query = 'INSERT INTO user (first_name, last_name, email, city) VALUES(?,?,?,?)';
//   const values = ['kona','Barua','kona@gmail.com','Chattogram'];
//   sqldb.execute(query, values).then((result) => {
//     console.log(result);
//   });
// }
// insertPerson();
// getPerson();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use("/api/v1/user", require("./routes/authRoutes"));
app.use("/api/v1/product", require("./routes/productRoute"));
app.use("/api/v1/shop", require("./routes/shopRoutes"));
app.use("/api/v1/category", require("./routes/categoryRoutes"));
app.use("/api/v1/sub-category", require("./routes/subCategoryRoutes"));
app.use("/api/v1/brand", require("./routes/brandRoutes"));

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
