const express = require("express");
const cors = require("cors");
const dataRoute = require("../routes/dataRoute");

const app = express();
app.use(cors());
app.use(express.json());


// Allow both standard and stripped paths for local and Netlify
app.use(["/api/data", "/data"], dataRoute);

module.exports = app;