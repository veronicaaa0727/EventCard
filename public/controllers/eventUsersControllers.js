eventCards
	.controller("eventUsersCtrl", function($scope, $location, auth, eventBox) {
		$scope.attendees = eventBox.getAttendees();
		$scope.auth = auth;
		$scope.addFriend = function(user){

		}

		$scope.logout = function() {
    		auth.signout();
    		$location.path('/events');
  		}

	});