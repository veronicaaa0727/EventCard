import json
import urllib2
import pickle

url = 'https://www.eventbriteapi.com/v3/events/search/?sort_by=date&location.within=50mi&location.latitude=37.4225&location.longitude=-122.1653&start_date.range_start=2014-08-01T07%3A00%3A00Z&start_date.range_end=2014-09-01T07%3A00%3A00Z&token=FZCUAV5H2K26VGXTQJ7F'
EventsData = []
data = json.load(urllib2.urlopen(url))
pages = data['pagination']['page_count']
EventsData.extend(data['events'])
for i in range(2, pages + 1):
	page = '&page=' + str(i)
	url_page = url + page
	data = json.load(urllib2.urlopen(url_page))
	EventsData.extend(data['events'])

with open('event_data', 'w') as outfile:
  pickle.dump(EventsData, outfile)

