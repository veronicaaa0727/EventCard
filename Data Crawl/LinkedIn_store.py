import json
import urllib2
import pymongo
from pymongo import MongoClient

url = 'https://api.linkedin.com/v1/people/~/connections:(id,first-name,last-name,headline,location,industry,num-connections,summary,specialties,positions,picture-url,public-profile-url)?format=json&oauth2_access_token=AQXSmhWqjhy33FvRfcB28HRAQMy36Q31wtKuibjSLG1n3mg5McERnF0YicWKBLpaX7Scyh_BZpnE6J0dQCCKoZtf5pQyA2LZqo47BFa5MMAptBgsZUMmYfOxJKeyZVvbvFerZHjk1mzgoBO2eExkx03VW1lCk4JnxPY98-cKDBFSnNSt8_E'
ConnectionData = []
data = json.load(urllib2.urlopen(url))
print data['values'][0]

connection = MongoClient("ds059908.mongolab.com", 59908)
db = connection["eventcard"]
# MongoLab has user authentication
db.authenticate("pengqil", "MIsa-901357")

users = db.userlinkedins

for item in data['values']:
	document = {}
	#print type(item)
	#print item['name']

	document["given_name"] = item[u'firstName']
	document["family_name"] = item[u'lastName']
	document["picture"] = item[u'pictureUrl']
	document["name"] = item[u'firstName'] + ' ' + item[u'lastName']
	document["headline"] = item[u'headline']
	document["industry"] = item[u'industry']
	document["numConnections"] = item[u'numConnections']
	document["positions"] = item[u'positions']
	document["location"] = item[u'location']
	document["publicProfileUrl"] = item[u'publicProfileUrl']
	document["summary"] = item[u'url']
	document["user_id"] = item[u'id']

	users.insert(document)


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