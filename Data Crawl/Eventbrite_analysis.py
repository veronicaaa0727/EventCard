import pickle,json
import sys
import pymongo
from pymongo import MongoClient
import re,datetime

with open('event_data', 'r') as infile:
  	EventsData = pickle.load(infile)

connection = MongoClient("ds059519.mongolab.com", 59519)
db = connection["clairvoyant"]
# MongoLab has user authentication
db.authenticate("admin", "admin2014")

events = db.events

i = 0
for item in EventsData:
	document = {}
	#print type(item)
	#print item['name']

	document["category"] = '' if not item['category'] else item['category']['name']
	document["description_html"] = item[u'description']['html']
	document["description_text"] = item[u'description']['text']
	document["id"] = item[u'id']
	document["name_html"] = item[u'name']['html']
	document["name_text"] = item[u'name']['text']
	document["start"] = datetime.datetime(*map(int, re.split('[^\d]', item[u'start']['utc'])[:-1]))
	document["end"] = datetime.datetime(*map(int, re.split('[^\d]', item[u'end']['utc'])[:-1]))
	document["venue"] = item[u'venue'][u'name']
	document["lat"] = float(item[u'venue'][u'latitude'])
	document["lon"] = float(item[u'venue'][u'longitude'])
	document["url"] = item[u'url']

	try:
		events.insert(document)
	except ValueError:
		print "Error Event" + i + ': ' + ValueError

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