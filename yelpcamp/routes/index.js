var express = require('express');
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");
//=================
//    Auth routes
//==================
//show register form
router.get('/register', function(req, res){
	res.render("register");
});
// create new user route
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " +user.username);
			res.redirect("/campgrounds");
		});
	});
});

// show login form
router.get("/login", function(req, res){
	res.render("login");
});
// login route
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),function(req, res){
	
});
//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "you are logged out");
	res.redirect("/campgrounds");
});
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;