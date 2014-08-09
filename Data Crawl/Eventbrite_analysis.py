import pickle,json

with open('event_data', 'r') as infile:
  EventsData = pickle.load(infile)

with open('event.json', 'w') as outfile:
	outfile.writelines(json.dumps(EventsData))
