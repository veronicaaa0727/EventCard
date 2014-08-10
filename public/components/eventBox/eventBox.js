angular.module("eventBox", [])
.constant("eventUserUrl", "/api/events/users")
.factory("eventBox", function($http, eventUserUrl) {
	var eventDetail;
	var attendees = [];
	var errorMsg = null;

	return {
		setEvent: function (event) {
			eventDetail = event;
			$http.post(eventUserUrl, {event_id: event._id})
				.success(function(data) {
					attendees = data.attendees;
				})
				.error(function(error) {
					errorMsg = error;
				});
		},

		getEvent: function() {
			return eventDetail;
		},

		getAttendees: function() {
			return attendees;
		}
	}
})