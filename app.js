let express    = require("express");
let app = express();
let bodyParser = require("body-parser");
let mongoose   = require("mongoose");
// let	expressSanitizer = require('sanitizer');

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(sanitizer());
let campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description : String
});

let Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{
// 	name: "Test1",
// 	image:""
// 	}, function(err, campground){
// 		console.log(err);
// 	} else {
// 		console.log("New camp");
// 		console.log(campground);
// 	});
let campgrounds = [
		{name: "Test1", image:""},
		{name: "Test2", image:""},
		{name: "Test3", image:""},
	]
app.get("/", function(req, res){
	res.render("page!");
});


app.get("/campgrounds", function(req, res){
	//Get all campgrounds from db
	Campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("index",{campgrounds: allcampgrounds});
		}
	});
	
});

app.post("/campgrounds", function(req, res){
	res.send("POST ROUTE!")
	// get data from form and add campground array 
	let name = req.body.name;
	let image = req.body.image;
	let desc = req.body.description;
	let newCampground = {name: name, image: image, description: desc}
	campgrounds.push(newCampground);
	// Create new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
	// redirect to campground page 
	res.redirect("/campgrounds");
});

//Show form to create new campground
app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});

// SHOW = Shows more info about one campground
app.get("campgrounds/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//render show template with tha campground
			res.render("show", {campground: foundCampground});
		}
	});
	req.params.id
	//render show template with that campground
	res.send("Show Page");
	res.redirect("show.ejs")
});

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("THE YELP PROJECT HAS STARTED!");
});