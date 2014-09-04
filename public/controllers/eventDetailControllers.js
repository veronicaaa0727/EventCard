eventCards
	.constant('userEventUrl', "/api/users/event/join")
	.controller("eventDetailCtrl", function($scope, auth, $http, $location, eventBox, userEventUrl, userProfileUrl) {
		$scope.selectedEvent = eventBox.getEvent();
		console.log($scope.selectedEvent);
		$scope.myHTML = eventBox.getEvent().description_html;
		$scope.valid = true;

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
						console.log(users);
						$location.path('/joinEvent');
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