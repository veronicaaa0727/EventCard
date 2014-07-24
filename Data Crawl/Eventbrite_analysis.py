import pickle

with open('event_data', 'r') as infile:
  EventsData = pickle.load(infile)

print len(EventsData)