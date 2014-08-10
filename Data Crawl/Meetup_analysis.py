import pickle,json
import sys
import pymongo
from pymongo import MongoClient


with open('meetup_data', 'r') as infile:
 MeetupData = pickle.load(infile)

with open('meetup.json', 'w') as outfile:
	outfile.writelines(json.dumps(MeetupData))


description: string(html)

event_url: string

id: string

name: string

venue => lat, con, name