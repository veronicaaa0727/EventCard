eventCards
	.constant("eventUserUrl", "/api/events/users")
	.constant('userProfileUrl', "/api/users/profile")
	.controller("eventUsersCtrl", function($scope, $location, $http, $q, auth, eventBox, eventUserUrl, userProfileUrl) {
		$scope.attendees = [];
		$scope.auth = auth;
		$scope.userinfo = {};

		$q.all([
				$http.post(userProfileUrl, {'user_id': auth.profile.user_id}), 
				$http.post(eventUserUrl, eventBox.getAttendees())
			]).then(function(results) { 
        		$scope.userinfo = results[0].data;
        		$scope.attendees = results[1].data;
        		//To-do add affinity story here
    	});

		$http.post(userProfileUrl, {'user_id': auth.profile.user_id})
			.success(function(userinfo){
				$scope.userinfo = userinfo;
			})
			.error(function(error){
				$scope.error = error
			});

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
    		$scope.data.myevents = {};
    		$location.path('/events');
  		}

  		$scope.quitEvent = function() {
			eventBox.setEvent({});
			$location.path('/events');

		}

	});