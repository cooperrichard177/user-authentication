var express = require("express");
var router = express.Router();
var User = require("../models/user");

// GET /
router.get("/", function(req, res, next) {
  return res.render("index", { title: "Home" });
});

// GET /about
router.get("/about", function(req, res, next) {
  return res.render("about", { title: "About" });
});

// GET /contact
router.get("/contact", function(req, res, next) {
  return res.render("contact", { title: "Contact" });
});

router.get("/register", function(req, res, next) {
  return res.render("register", { title: "Register" });
});

router.post("/register", function(req, res, next) {
  if (
    req.body.name &&
    req.body.email &&
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword
  ) {
    //confirm two passwords match
    if (req.body.password !== req.body.confirmPassword) {
      const err = new Error("Passwords do not match");
      err.status = 400;
      return next(err);
    }

    //create object with form input
    var userData = {
      email: req.body.email,
      name: req.body.name,
      favoriteBook: req.body.favoriteBook,
      password: req.body.password
    };

    //user schemas create method to insert doc into mogo
    User.create(userData, function(error, user) {
      if (error) {
        return next(error);
      } else {
        return res.redirect("/profile");
      }
    });
  } else {
    const err = new Error("All fields are mandatory.");
    err.status = 400;
    return next(err);
  }
});

module.exports = router;
