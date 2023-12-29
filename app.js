const express = require('express');
const dotenv = require('dotenv').config();
const port = 7777 || process.env.port;
const app = express();
app.use(express.json());
const mongoose = require("./connection/mongoose");

const user = require("./routes/userRoutes");
app.use("/user",user)
app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`);
});