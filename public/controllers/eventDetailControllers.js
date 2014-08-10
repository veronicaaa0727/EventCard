eventCards
	.constant('userEventUrl', "/api/users/event/join")
	.controller("eventDetailCtrl", function($scope, auth, $http, $location, eventBox, userEventUrl) {
		$scope.selectedEvent = eventBox.getEvent();
		$scope.myHTML = eventBox.getEvent().description.html;
		$scope.login = function() {
			if(auth.isAuthenticated){
				$http.post(userEventUrl, {'user_id': auth.profile.user_id, 'event_id': $scope.selectedEvent._id})
					.success(function(users){
						eventBox.setAttendees(users);
						$location.path('/joinEvent');
					})
					.error(function(error){
						$scope.error = error
					})
			}
			else{
				auth.signin({
  					connections: ['linkedin'],
  					connection_scopes: { 'linkedin': ['r_emailaddress', 'r_contactinfo', 'r_network', 'r_basicprofile', 'r_fullprofile']}
  				});				
			}		
		}
	});