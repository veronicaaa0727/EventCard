angular.module("eventBox", [])
.factory("eventBox", function() {
	var eventDetail = 'eventDetail';
	var attendees = 'attendees';

	return {
		setEvent: function (event) {
			localStorage.setItem(eventDetail, JSON.stringify(event));
		},

		setAttendees: function (users) {
			localStorage.setItem(attendees, JSON.stringify(users));
		},

		getEvent: function() {
			return JSON.parse(localStorage.getItem(eventDetail) || 'null');
		},

		getAttendees: function() {
			return JSON.parse(localStorage.getItem(attendees) || 'null');
		}
	}
})