import json
import urllib2
import pickle

url = 'https://api.linkedin.com/v1/people/~/connections:(id,first-name,last-name,headline,location,industry,num-connections,summary,specialties,positions,picture-url,public-profile-url)?format=json&oauth2_access_token=AQX-O0u9affr77J3cvOPpJSP2dsLc4ngAggYnCDeoW0oWT9F5YnYRVXnPjrkZmfGpU-LI1a2imwjxK2ObSExX6QGxaaSnf7rTiJ93mFXD4zIFj0AleEHNz9vnOAwrfkptgIgMQF-6A_L9Igoo8DYgcuXoQIA-Wb---pFaEZI56ryrCceWqE'
#url = 'https://api.meetup.com/2/open_events.json?key=4512d433e573e5e216f51f287b55&lat=37.4225&lon=-122.1653&radius=50&time=2w,6w'
MeetupData = []
data = json.load(urllib2.urlopen(url))
'''
next = data['meta']['next']
MeetupData.extend(data['results'])
while next != "":
	data = json.load(urllib2.urlopen(next))
	MeetupData.extend(data['results'])
	next = data['meta']['next']

with open('meetup_data', 'w') as outfile:
  pickle.dump(MeetupData, outfile)
'''
