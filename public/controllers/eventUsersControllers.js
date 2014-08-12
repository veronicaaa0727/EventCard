eventCards
	.constant("eventUserUrl", "/api/events/users")
	.controller("eventUsersCtrl", function($scope, $location, $http, auth, eventBox, eventUserUrl) {
		$scope.attendees = [];
		$scope.auth = auth;

		$http.post(eventUserUrl, eventBox.getAttendees())
			.success(function(data) {
				$scope.attendees = data;
			})
			.error(function(error) {
				$scope.attendees = [];
			});

		$scope.filterAttendees = function(item){
			if(item.user_id === auth.profile.user_id)
				return false;
			else
				return true;
		}

		$scope.addFriend = function(user){

		}

		$scope.logout = function() {
    		auth.signout();
    		eventBox.setEvent({});
    		$location.path('/events');
  		}

  		$scope.quitEvent = function() {
			eventBox.setEvent({});
			$location.path('/events');

		}

	});