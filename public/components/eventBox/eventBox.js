angular.module("eventBox", [])
.factory("eventBox", function($http) {
	var eventDetail;
	var attendees = [];
	var errorMsg = null;

	return {
		setEvent: function (event) {
			eventDetail = event;
		},

		setAttendees: function (users) {
			attendees = users;
		},

		getEvent: function() {
			return eventDetail;
		},

		getAttendees: function() {
			return attendees;
		}
	}
})