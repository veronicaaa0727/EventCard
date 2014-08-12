/// server.js

// set up ================================
var express  = require("express");
var cors     = require("cors");
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
	app.use(cors());
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.session({ secret: 'keyboard cat'}));
});
// define model ==========================
/*
var schema_events = new mongoose.Schema({
	name		: {type: String, required: true},
	description	: {type: String, required: true},
	category	: {type: String, required: true},
	number		: {type: Number, required: true},
	detail		: {type: String, required: true}
})
var Products = mongoose.model('Products', schema_events);
*/
var schema_vanue = new mongoose.Schema({lat: Number, lon: Number, name: String});
var schema_events = new mongoose.Schema({
	name		: {type: mongoose.Schema.Types.Mixed, required: true},
	description	: {type: mongoose.Schema.Types.Mixed, required: true},
	category	: {type: String, required: true},
	id 			: {type: String, required: true},
	url		    : {type: String, required: true},
	start		: {type: Date, required: true},
	end			: {type: Date, required: true},
	venue		: {type: String, required: true},
	lat			: {type: Number, required: true},
	lon			: {type: Number, required: true}
})

var Events = mongoose.model('Events', schema_events);

var schema_eventusers = new mongoose.Schema({
	event_id	: {type: String, required: true},
	users 	 	: {type: Array,  required: true}
})
var EventUsers = mongoose.model('Eventusers', schema_eventusers);

var schema_userevents = new mongoose.Schema({
	user_id		: {type: String, required: true},
	events 	 	: {type: Array,  required: true}
})
var UserEvents = mongoose.model('Userevents', schema_userevents);

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

app.post('/api/events/view', function(req, res) {
	
	Events.find(
			{lat: {$gte: (req.body.lat - 0.1), $lte: (req.body.lat + 0.1)},
        	lon: {$gte: (req.body.lon - 0.1), $lte: (req.body.lon + 0.1)},
        	start: {$gte: new Date()}}, function(err, events) {
		if(err)
			res.send(err);
		res.json(events);
	})
});

app.get('/api/products/view', function(req, res) {
	Products.find(function(err, products) {
		if(err)
			res.send(err);
		res.json(products);
	})
});

app.post('/api/events/users', function(req, res) {
	console.log(req.body);
	UserLinkedIn.find({user_id: {$in : req.body}}, function(err, users) {
		if(err)
			res.send(err);
		res.json(users);
	})
});

app.post('/api/users/login', function(req, res) {
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
		if(users.length == 0){			
			UserLinkedIn.create(userinfo, function (err, userinfo) {
  				if (err) 
  					res.send(err);
			});
		}
		else{
			users[0].update(userinfo, function (err, userinfo) {
				if (err) 
  					res.send(err);
			});
		}
	})
});

app.post("/api/users/event/join", function(req, res) {
	UserEvents.find({user_id: req.body.user_id}, function(err, users) {
		if(err)
			res.send(err);
		if(users.length == 0){	
			var userevent = {};
			userevent.user_id = req.body.user_id;
			userevent.events = [req.body.event_id];
			UserEvents.create(userevent, function (err, item) {
  				if (err) 
  					res.send(err);
			});
		}
		else{
			var events_attend = {};
			events_attend.user_id = users[0].user_id;
			events_attend.events = users[0].events;
			if(events_attend.events.indexOf(req.body.event_id) === -1) {
				events_attend.events.push(req.body.event_id);
				users[0].update(events_attend, function (err, item) {
					if (err) 
  						res.send(err);
				});
			}
		}
	})
	EventUsers.find({event_id: req.body.event_id}, function(err, events) {
		if(err)
			res.send(err);
		if(events.length == 0){	
			var eventuser = {};
			eventuser.event_id = req.body.event_id;
			eventuser.users = [req.body.user_id];
			EventUsers.create(eventuser, function (err, item) {
  				if (err) 
  					res.send(err);
  				else
  					res.json(item.users);

			});
		}
		else{
			var attendees = {};
			attendees.event_id = events[0].event_id;
			attendees.users = events[0].users;

			if(attendees.users.indexOf(req.body.user_id) === -1) {
				attendees.users.push(req.body.user_id);
				events[0].update(attendees, function (err, item) {
					if (err){
						console.log("Error");
						res.send(err);
					}
  					else{
  						console.log("Success");
  						res.json(item.users);
  					}
  						
				});
			}else{
				console.log(attendees.users);
				res.json(attendees.users);
			}			
		}
	})
});
// listen
app.listen(8080);
console.log("App listening on port 8080");