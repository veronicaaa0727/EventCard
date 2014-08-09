import pickle,json


with open('meetup_data', 'r') as infile:
  MeetupData = pickle.load(infile)

with open('meetup.json', 'w') as outfile:
	outfile.writelines(json.dumps(MeetupData[0]))