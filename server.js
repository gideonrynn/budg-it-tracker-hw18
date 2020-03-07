const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.port || 3000;

const app = express();

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://budgitdbscd2:NUpassword1!@ds137220.mlab.com:37220/heroku_hpwqqnpt";

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//access all files within the public folder
app.use(express.static("public"));

mongoose.Promise = global.Promise;

mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});