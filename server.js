const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
// const pwdb = require("./public/pwdb");

const PORT = process.env.PORT || 3000;

const app = express();

// variable set for connection to mLab MongoDB addon
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://budgitdbscd2:NUpassword1!@ds137220.mlab.com:37220/heroku_hpwqqnpt";

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//access all files within the public folder
app.use(express.static("public"));

// routes
app.use(require("./routes/api.js"));

mongoose.Promise = global.Promise;

// needed for connection to mLab MongoDB add-on 
mongoose.connect(MONGODB_URI);

// local connection
mongoose.connect("mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
