//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');


console.log(process.env.API_KEY);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const dbpath = "mongodb://localhost:27017/userDB";

const mongo = mongoose.connect(dbpath, {
  useNewUrlParser: true
});
mongo.then(() => {
  console.log('connected to server');
}).catch((err) => {
  console.log('err', err);
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});



userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});


const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("Home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err){
      console.log(err);
    } else{
      res.render("secrets");
    }
  });
})

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
if (err){
  console.log(err);
} else{
  if(foundUser){
    if(foundUser.password === password){
      res.render("secrets")
    }
  }
}
  })
})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
