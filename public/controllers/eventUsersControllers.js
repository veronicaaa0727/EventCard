eventCards
	.constant("eventUserUrl", "/api/events/users")
	.constant('userProfileUrl', "/api/users/profile")
	.controller("eventUsersCtrl", function($scope, $location, $http, $q, auth, eventBox, eventUserUrl, userProfileUrl) {
		$scope.attendees = [];
		$scope.auth = auth;
		$scope.userinfo = {};
		$scope.isCollapsed = [];

		$q.all([
				$http.post(userProfileUrl, {'user_id': auth.profile.user_id}), 
				$http.post(eventUserUrl, eventBox.getAttendees())
			]).then(function(results) { 
        		$scope.userinfo = results[0].data;
				$scope.attendees = results[1].data;
        		for(var i = 0; i < results[1].data.length; i++){
        			if($scope.attendees[i].user_id == $scope.userinfo.user_id)
        				continue;
        			$scope.isCollapsed.push(true);

        			$scope.attendees[i].schoolList = '';
        			$scope.attendees[i].sharedIndustry = null;
        			
           			if($scope.attendees[i].industry == $scope.userinfo.industry)
        				$scope.attendees[i].sharedIndustry = $scope.userinfo.industry;
        			for(var j = 0; j < $scope.attendees[i].educations.length; j++){
        				if(j == 0)
        					$scope.attendees[i].schoolList += $scope.attendees[i].educations[j].schoolName;
        				else
        					$scope.attendees[i].schoolList += ', ' + $scope.attendees[i].educations[j].schoolName;
        			}
        			$scope.attendees[i].sharedSkills = _.intersection($scope.attendees[i].skills, $scope.userinfo.skills).join(', ');
        			$scope.attendees[i].sharedCompany = 
        				_.intersection(_.map($scope.attendees[i].positions, function(position) {return position.company.name}), 
        					_.map($scope.userinfo.positions, function(position) {return position.company.name})).join(', ');
        			$scope.attendees[i].sharedEducation = 
        				_.intersection(_.map($scope.attendees[i].educations, function(school) {return school.schoolName}), 
        					_.map($scope.userinfo.educations, function(school) {return school.schoolName})).join(', ');


        		}
        		//To-do add affinity story
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