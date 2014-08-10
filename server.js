/// server.js

// set up ================================
var express  = require("express");
var app      = express();
var jwt = require('express-jwt');
var mongoose = require("mongoose");

var jwtCheck = jwt({
    secret: new Buffer('BxQiHm0-6K0WK4lVIsXHxFUNfcHHyjHPdLLItoSSurH1gRET9N20qHEBeEdP4gv3', 'base64'),
    audience: '8Zd1eXfjw0Ykbwk8AHkp7bdpeD0A1lBA'
  });

// configuration =========================

mongoose.connect("mongodb://admin:admin2014@ds059908.mongolab.com:59908/eventcard");

app.configure(function(){
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.session({ secret: 'keyboard cat'}));
});
// define model ==========================

var schema_events = new mongoose.Schema({
	name		: {type: String, required: true},
	description	: {type: String, required: true},
	category	: {type: String, required: true},
	number		: {type: Number, required: true},
	detail		: {type: String, required: true}
})
var Products = mongoose.model('Products', schema_events);

var schema_eventusers = new mongoose.Schema({
	event_id	: {type: String, required: true},
	users 	 	: {type: Array,  required: true}
})
var EventUsers = mongoose.model('Eventusers', schema_eventusers);

var schema_userlinkedin = new mongoose.Schema({
	given_name		: {type: String, required: true},
	family_name		: {type: String, required: true},
	picture			: String,
	name			: {type: String, required: true},
	headline		: String,
	industry		: String,
	location		: mongoose.Schema.Types.Mixed,
	numConnections	: Number,
	positions		: mongoose.Schema.Types.Mixed,
	publicProfileUrl		: String,
	summary			: String,
	clientID		: String,
	user_id			: String,
	identities		: [mongoose.Schema.Types.Mixed],
	created_at		: String,

})
var UserLinkedIn = mongoose.model('UserLinkedIn', schema_userlinkedin);

var schema_userinfo = new mongoose.Schema({
	name			: {type: String, required: true},
	company			: {type: String, required: true},
})
var UserInfo = mongoose.model('UserInfo', schema_userinfo);

var schema_users = new mongoose.Schema({
	username		: {type: String, required: true},
	password		: {type: String, required: true},
})
schema_users.methods.validPassword = function (pass) {
	return (this.password === pass);
}
var Users = mongoose.model('Users', schema_users);

// routes
app.get('/', function(req, res) {
	res.sendfile('./public/app.html');
});

app.get('/admin', function(req, res) {
	res.sendfile('./public/admin.html');
});

app.get('/api/products/view', function(req, res) {
	Products.find(function(err, products) {
		if(err)
			res.send(err);
		res.json(products);
	})
});

app.post('/api/events/users', function(req, res) {
	EventUsers.find({event_id: req.body.event_id}, function(err, users) {
		if(err)
			res.send(err);
		res.json(users[0]);
	})
});

app.post('/api/users/login', function(req, res) {
	console.log(req.body);
	UserLinkedIn.find({user_id: req.body.user_id}, function(err, users) {
		if(err)
			res.send(err);
		var userinfo = {};
		userinfo.given_name = req.body.given_name;
		userinfo.family_name = req.body.family_name;
		userinfo.picture = req.body.picture;
		userinfo.name = req.body.name;
		userinfo.headline = req.body.headline;
		userinfo.industry = req.body.industry;
		userinfo.location = req.body.location;
		userinfo.numConnections = req.body.numConnections;
		userinfo.positions = req.body.positions;
		userinfo.publicProfileUrl = req.body.publicProfileUrl;
		userinfo.summary = req.body.summary;
		userinfo.clientID = req.body.clientID;
		userinfo.user_id = req.body.user_id;
		userinfo.identities = req.body.identities;
		userinfo.created_at = req.body.created_at;
		console.log(users);
		if(users.length == 0){			
			UserLinkedIn.create(userinfo, function (err, userinfo) {
  				if (err) 
  					return err;
			});
		}
		else{
			users[0].update(userinfo, function (err, userinfo) {
				if (err) 
  					return err;
			});
		}
	})
});
// listen
app.listen(8080);
console.log("App listening on port 8080");