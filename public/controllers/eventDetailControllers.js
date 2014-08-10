eventCards
	.controller("eventDetailCtrl", function($scope, auth, $location, eventBox) {
		$scope.selectedEvent = eventBox.getEvent();
		$scope.login = function() {
			if(auth.isAuthenticated){
				$location.path('/joinEvent');
			}
			else{
				auth.signin({
  					connections: ['linkedin'],
  					connection_scopes: { 'linkedin': ['r_emailaddress', 'r_contactinfo', 'r_network', 'r_basicprofile', 'r_fullprofile']}
  				});				
			}		
		}
	});