angular.module("eventBox", [])
.factory("eventBox", function() {
	var eventDetail = 'eventDetail';
	var attendees = 'attendees';
	var userinfo = 'userinfo';

	return {
		setEvent: function (event) {
			localStorage.setItem(eventDetail, JSON.stringify(event));
		},

		setAttendees: function (users) {
			localStorage.setItem(attendees, JSON.stringify(users));
		},

		setUserInfo: function (userinfo) {
			localStorage.setItem(userinfo, JSON.stringify(userinfo));
		},

		getEvent: function() {
			return JSON.parse(localStorage.getItem(eventDetail) || 'null');
		},

		getAttendees: function() {
			return JSON.parse(localStorage.getItem(attendees) || 'null');
		},

		getUserInfo: function() {
			return JSON.parse(localStorage.getItem(userinfo) || 'null');
		}
	}
})