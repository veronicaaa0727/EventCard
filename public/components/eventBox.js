angular.module("eventBox", [])
.factory("eventBox", function() {
	var eventDetail = 'eventDetail';
	var attendees = 'attendees';
	var userinfo = 'userinfo';
	var time = 'time';

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

		setTime: function () {
			localStorage.setItem(time, JSON.stringify(new Date()));
		},

		getEvent: function() {
			return JSON.parse(localStorage.getItem(eventDetail) || 'null');
		},

		getAttendees: function() {
			return JSON.parse(localStorage.getItem(attendees) || 'null');
		},

		getUserInfo: function() {
			return JSON.parse(localStorage.getItem(userinfo) || 'null');
		},

		getInterval: function() {
			var now = new Date();
			var lastDate = new Date(JSON.parse(localStorage.getItem(time)));
			return now.getTime() - lastDate.getTime();
		}
	}
})