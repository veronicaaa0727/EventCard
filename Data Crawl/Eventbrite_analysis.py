import pickle,json
import sys
import pymongo
from pymongo import MongoClient
import re,datetime

with open('event_data', 'r') as infile:
  	EventsData = pickle.load(infile)

connection = MongoClient("ds059908.mongolab.com", 59908)
db = connection["eventcard"]
# MongoLab has user authentication
db.authenticate("pengqil", "MIsa-901357")

events = db.events

for item in EventsData:
	document = {}
	#print type(item)
	#print item['name']

	document["category"] = '' if not item['category'] else item['category']['name']
	document["description"] = item[u'description']
	document["id"] = item[u'id']
	document["name"] = item[u'name']
	document["start"] = datetime.datetime(*map(int, re.split('[^\d]', item[u'start']['utc'])[:-1]))
	document["end"] = datetime.datetime(*map(int, re.split('[^\d]', item[u'end']['utc'])[:-1]))
	document["venue"] = item[u'venue'][u'name']
	document["lat"] = float(item[u'venue'][u'latitude'])
	document["lon"] = float(item[u'venue'][u'longitude'])
	document["url"] = item[u'url']

	events.insert(document)

'''
capacity: Number

category: object
category_id: string
=>category: string

description: object (text, html)

format: object
format_id: string
=> format: string

id: string
logo_url: string
name: object

organizer: object
organizer_id: string

start: object
end: object

subcategory: string
subcategory_id: string

venue: object
venue_id: string
=> latitude, longitude, name

url: string
'''