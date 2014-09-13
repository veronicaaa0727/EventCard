eventCards
	.constant('userEventUrl', "/api/users/event/join")
	.constant('eventDetailUrl', "/api/events/detail")
	.controller("eventDetailCtrl", function($scope, auth, $http, $location, $routeParams, eventBox, userEventUrl, userProfileUrl, eventDetailUrl) {
		$scope.selectedEvent = {};
		$scope.valid = true;
		$scope.event_id = $routeParams.event_id;
		$scope.shareText = "mailto:?subject=I wanted you to checkout this event&body=Check out this event " + $location.absUrl();

		$http.post(eventDetailUrl, {event_id: $scope.event_id})
			.success(function(event){
				$scope.selectedEvent = event;
			})
			.error(function(error){
				$scope.error = error
			});

		$scope.checkPassword = function(password){
			if(password == $scope.selectedEvent.password){
				$scope.login();
			}else{
				$scope.valid = false;
			}
		}
		$scope.login = function() {
			if(auth.isAuthenticated){
				$http.post(userEventUrl, {'user_id': auth.profile.user_id, 'event_id': $scope.selectedEvent._id})
					.success(function(users){
						eventBox.setAttendees(users);
						console.log('users');
						$location.path('/joinEvent/' + $scope.selectedEvent._id);
					})
					.error(function(error){
						$scope.error = error
					});
			}else{
				auth.signin({
  					connections: ['linkedin'],
  					connection_scopes: { 'linkedin': ['r_emailaddress', 'r_contactinfo', 'r_network', 'r_basicprofile', 'r_fullprofile']},
  					offline_mode: true
  				});				
			}		
		}
		$scope.quitEvent = function() {
			eventBox.setEvent({});
			$location.path('/events');

		}
	});