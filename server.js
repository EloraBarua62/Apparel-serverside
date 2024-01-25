const express = require('express');
const cors = require('cors');
const { dbConnect } = require('./utiles/dbConnect');
const cookieParser = require("cookie-parser"); 

const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config()

dbConnect();

app.use(express.json());
app.use(cookieParser()); 

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true
  })
);

app.use('/api' , require('./routes/authRoutes'));
app.use('/api' , require('./routes/dashboard/categoryRoutes'));

app.get('/' , (req,res) => {
    res.send('server is running');
});

app.listen(port , () => {
    console.log(`server is running on port ${port}`)
})