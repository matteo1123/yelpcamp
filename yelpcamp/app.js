var express = require('express'),
app = express(),
bodyParser = require("body-parser"),
mongoose = require('mongoose'),
seedDB = require("./seeds"),
Campground = require("./models/campground"),
LocalStrategy = require("passport-local"),
passport = require("passport"),
User = require('./models/user'),
Comment = require('./models/comment');
methodOverride = require("method-override");
var commentRoutes = require('./routes/comments'),
campgroundRoutes = require('./routes/campgrounds'),
flash = require("connect-flash"),
indexRoutes = require('./routes/index');


//seedDB();
mongoose.connect("mongodb+srv://Matt:Locococo1@cluster0-pxrwp.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(flash());

//Passport Configuration
app.use(require("express-session")({
	secret: "there once was a dude from a place",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//pass current user status to html files
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.get("/", function(req, res){
	res.render('landing');
});
app.listen(3000, process.env.IP, function(){
	console.log("the YelpCamp Server has started");
});
	
	
	