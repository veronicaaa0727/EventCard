import pickle

with open('meetup_data', 'r') as infile:
  MeetupData = pickle.load(infile)

print len(MeetupData)