/// server.js

// set up ================================
var express  = require("express");
var cors = require('cors');
var app      = express();
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

//app.use(cors());

// configuration =========================

mongoose.connect("mongodb://admin:admin2014@ds059908.mongolab.com:59908/eventcard");

app.configure(function(){
	/*
	app.use();
*/
	app.use(cors());
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.session({ secret: 'keyboard cat'}));
	app.use(passport.initialize());
	app.use(passport.session());
});
// define model ==========================

var schema_products = new mongoose.Schema({
	name		: {type: String, required: true},
	description	: {type: String, required: true},
	category	: {type: String, required: true},
	price		: {type: Number, required: true}
})
var Products = mongoose.model('Products', schema_products);

var schema_orders = new mongoose.Schema({
	name		: {type: String, required: true},
	street		: {type: String, required: true},
	city		: {type: String, required: true},
	state		: {type: String, required: true},
	zip			: {type: String, required: true},
	country		: {type: String, required: true},
	giftwrap	: {type: Boolean},
	products 	: {type: Array,  required: true}
})
var Orders = mongoose.model('Orders', schema_orders);

var schema_users = new mongoose.Schema({
	username	: {type: String, required: true},
	password	: {type: String, required: true}
})
schema_users.methods.validPassword = function (pass) {
	return (this.password === pass);
}
var Users = mongoose.model('Users', schema_users);

// define passport methods
passport.use(new LocalStrategy(
	function(username, password, done) {
		Users.findOne({username: username}, function(err, user) {
			if(err) {return done(err); }
			if(!user) {
				return done(null, false, {message: 'Incorrect username.'});
			}
			if(!user.validPassword(password)) {
				return done(null, false, {message: 'Incorrect password.'});
			}
			return done(null, user);
		});
	}
));

passport.use(new LinkedInStrategy({
		clientID: "77crxrrywpmw0n",
		clientSecret: "DUcI8vefNDvE57Pg",
		callbackURL: "http://127.0.0.1:8080/auth/linkedin/callback",
		scope: ['r_emailaddress', 'r_basicprofile', 'r_contactinfo', 'r_network', 'r_fullprofile'],
	}, function(accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
			process.nextTick(function () {
              // To keep the example simple, the user's Google profile is returned to
              // represent the logged-in user.  In a typical application, you would want
              // to associate the Google account with a user record in your database,
              // and return that user instead.
				console.log(profile);
              	return done(null, profile);
			});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	Users.findById(id, function(err, user) {
		done(err, user);
	});
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.send([]);
}

app.get('/auth/linkedin', cors(), passport.authenticate('linkedin', { state: 'SOME STATE'  }), 
    function(req, res){

	});

app.get('/auth/linkedin/callback', cors(), passport.authenticate('linkedin', {
	successRedirect: '/',
	failureRedirect: '/admin'
}));

// routes
app.get('/', function(req, res) {
	res.sendfile('./public/app.html');
});

app.get('/admin', function(req, res) {
	res.sendfile('./public/auth.html');
});

app.get('/api/products/view', function(req, res) {
	Products.find(function(err, products) {
		if(err)
			res.send(err);
		res.json(products);
	})
});

app.get('/api/products', ensureAuthenticated, function(req, res) {
	Products.find(function(err, products) {
		if(err)
			res.send(err);
		res.json(products);
	})
});

app.get('/api/products:id', ensureAuthenticated, function(req, res) {
	Products.findById(req.params.id, function(err, product) {
		if(err)
			res.send(err);
		res.json(product);
	});
});

app.post('/api/products', ensureAuthenticated, function(req, res) {
	Products.create(req.body, function(err, product) {
		if(err)
			res.send(err);
		res.json(product);
	});
});

app.post('/api/products/:id', ensureAuthenticated, function(req, res) {
	Products.findById(req.params.id, function(err, product, numberAffected) {
		if(err)
			res.send(err);
		product.name = req.body.name;
		product.description = req.body.description;
		product.category = req.body.category;
		product.price = req.body.price;
		product.save(function(err, product, numberAffected) {
			if(err)
				res.send(err);
			res.json(product);
		})
	});
});

app.delete('/api/products/:id', ensureAuthenticated, function(req, res) {
	Products.findByIdAndRemove(req.params.id, function(err, product) {
		if(err)
			res.send(err);
		res.json(product);
	});
});

app.post('/api/orders/submit', function(req, res) {
	Orders.create(req.body, function(err, order){
		if(err)
			res.send(err);
		res.json(order);
	});
});

app.get('/api/orders/view', ensureAuthenticated, function(req, res) {
	Orders.find(function(err, orders) {
		if(err)
			res.send(err);
		res.json(orders);
	})
})

app.post('/users/login', 
	passport.authenticate('local'),
	function(req, res) {
		res.json(req.body);
	}
);
// listen
app.listen(8080);
console.log("App listening on port 8080");