/// server.js

// set up ================================
var express  = require("express");
var app      = express();
var request = require("request");

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


app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  next();
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
	accessToken 	: String,
	certifications	: [String],
	courses			: [String],
	educations		: [mongoose.Schema.Types.Mixed],
	emailAddress 	: String,
	firstName 		: String,
	following		: [String],
	headline		: String,
	honorsAwards    : [String],
	user_id			: String,
	industry 		: String,
	interests 		: String,
	languages  		: [String],
	lastName 		: String,
	location		: mongoose.Schema.Types.Mixed,
	numConnections	: Number,
	numRecommenders : Number,
	recommendationsReceived 	:[mongoose.Schema.Types.Mixed],
	patents			: [mongoose.Schema.Types.Mixed],
	pictureUrl 		: String,
	positions		: [mongoose.Schema.Types.Mixed],
	publicProfileUrl: String,
	publications	: [mongoose.Schema.Types.Mixed],
	skills			: [String],
	specialties		: [mongoose.Schema.Types.Mixed],
	summary			: String
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
		var accessToken = req.body.identities[0].access_token;
		var selectField = function(values){
			var results = [];
			for(value in values){
				if(values[value].language) results.push(values[value].language.name);
				else if (values[value].skill) results.push(values[value].skill.name);
				else results.push(values[value].name);
			}
			return results;
		}
		var connectionURL = 'https://api.linkedin.com/v1/people/~/connections:(id,first-name,last-name,headline,location,industry,num-connections,summary,specialties,positions,picture-url,public-profile-url)?format=json&oauth2_access_token='
		var profileURL = 'https://api.linkedin.com/v1/people/~:(interests,publications,patents,honors-awards,following,educations,courses,skills,certifications,languages,id,first-name,last-name,headline,location,industry,num-connections,summary,positions,picture-url,public-profile-url,email-address,num-recommenders,recommendations-received)?format=json&oauth2_access_token=';
		request({
    		url: profileURL + accessToken,
    		json: true
		}, function (error, response, body) {
    		if (!error && response.statusCode === 200) {
        		userinfo = body; // Print the json response
        		userinfo.accessToken = req.body.identities[0].access_token;
				if(userinfo.certifications) userinfo.certifications = selectField(userinfo.certifications.values);
				if(userinfo.courses) userinfo.courses = selectField(userinfo.courses.values);
				if(userinfo.educations) userinfo.educations = userinfo.educations.values;
				//emailAddress
				//firstName
				if(userinfo.following && userinfo.following.companies) userinfo.following = selectField(userinfo.following.companies.values);
				//headline
				if(userinfo.honorsAwards) userinfo.honorsAwards = selectField(userinfo.honorsAwards.values);
				userinfo.user_id = req.body.user_id;
				//industry
				//interests
				if(userinfo.languages) userinfo.languages = selectField(userinfo.languages.values);
				//lastName
				//location
				//numConnections
				//numRecommenders
				if(userinfo.numRecommenders > 0) userinfo.recommendationsReceived = userinfo.recommendationsReceived.values;
				if(userinfo.patents) userinfo.patents = userinfo.patents.values;
				//pictureUrl
				if(userinfo.positions) userinfo.positions = userinfo.positions.values;
				//publicProfileUrl
				if(userinfo.publications) userinfo.publications = userinfo.publications.values;
				if(userinfo.skills) userinfo.skills = selectField(userinfo.skills.values);
				//summary

				if(users.length == 0){		
					console.log(userinfo);	
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
    		}
		})
	})
});

app.post("/api/users/myevents", function(req, res) {
	UserEvents.find({user_id: req.body.user_id}, function(err, users) {
		if(err)
			res.send(err);
		if(users.length == 0){	
			res.send([]);
		}
		else{
			eventlist = users[0].events;
			Events.find({_id: {$in : eventlist}}, function(err, events) {
				if(err)
					res.send(err);
				res.json(events);
			})
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
				res.json(attendees.users);
			}			
		}
	})
});
// listen
app.listen(8080);
console.log("App listening on port 8080");