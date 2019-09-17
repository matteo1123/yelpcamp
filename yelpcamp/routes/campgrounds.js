var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware");

// index route
router.get("/", function(req, res){
	Campground.find({}, function(err,allCampgrounds){
		if (err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});

		}
	});

});



// new route
router.get("/new", middleware.isLoggedIn, function(req, res){
	
	res.render("campgrounds/new");
});
// create route
router.post("/",middleware.isLoggedIn, function(req, res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price:price, image: image, description: desc, author: author};
	//create a new campground and save to the database
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			//redirect back to campgrounds 
			res.redirect("/campgrounds");
		}
	});
});
// show route
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
				res.render("campgrounds/show", {campground:foundCampground});
		}
	});

});
//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
	res.render("campgrounds/edit", {campground: foundCampground});
			
	});
});
//update campground route
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campground
	
	Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});
// destroy campground route
router.delete("/:id/", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/camgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
	
});




module.exports = router;