var express = require("express");
var router = express.Router();
var User = require("../models/user");
var mid = require("../middleware/index");

// GET /
router.get("/", function(req, res, next) {
  return res.render("index", { title: "Home" });
});

//Get /login
router.get("/login", mid.loggedOut, function(req, res, next) {
  return res.render("login", { title: "Log In" });
});

//POST /login
router.post("/login", function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error || !user) {
        var err = new Error("Incorrect Login Details");
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect("/profile");
      }
    });
  } else {
    var err = new Error("Both forms are mandatory");
    err.status = 400;
    return next(err);
  }
});

// GET /about
router.get("/about", function(req, res, next) {
  return res.render("about", { title: "About" });
});

router.get("/books", mid.requiresLogin, function(req, res, next) {
  return res.render("books", { title: "Your Books" });
});

// GET /contact
router.get("/contact", function(req, res, next) {
  return res.render("contact", { title: "Contact" });
});

router.get("/register", mid.loggedOut, function(req, res, next) {
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
        req.session.userId = user._id;
        return res.redirect("/profile");
      }
    });
  } else {
    const err = new Error("All fields are mandatory.");
    err.status = 400;
    return next(err);
  }
});

//GET /profile
router.get("/profile", mid.requiresLogin, function(req, res, next) {
  User.findById(req.session.userId).exec(function(error, user) {
    if (error) {
      return next(error);
    } else {
      return res.render("profile", {
        title: "Your Profile",
        name: user.name,
        favorite: user.favoriteBook
      });
    }
  });
});

router.get("/logout", function(req, res, next) {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/login");
      }
    });
  }
});

module.exports = router;
