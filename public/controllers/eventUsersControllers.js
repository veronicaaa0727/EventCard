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
				
        		for(var i = 0; i < results[1].data.length; i++){
        			if(results[1].data[i].user_id == $scope.userinfo.user_id)
        				continue;  			

        			results[1].data[i].schoolList = '';
        			results[1].data[i].sharedIndustry = null;
        			
           			if(results[1].data[i].industry == $scope.userinfo.industry)
        				results[1].data[i].sharedIndustry = $scope.userinfo.industry;
        			for(var j = 0; j < results[1].data[i].educations.length; j++){
        				if(j == 0)
        					results[1].data[i].schoolList += results[1].data[i].educations[j].schoolName;
        				else
        					results[1].data[i].schoolList += ', ' + results[1].data[i].educations[j].schoolName;
        			}
        			results[1].data[i].sharedSkills = _.intersection(results[1].data[i].skills, $scope.userinfo.skills).join(', ');
        			results[1].data[i].sharedCompany = 
        				_.intersection(_.map(results[1].data[i].positions, function(position) {return position.company.name}), 
        					_.map($scope.userinfo.positions, function(position) {return position.company.name})).join(', ');
        			results[1].data[i].sharedEducation = 
        				_.intersection(_.map(results[1].data[i].educations, function(school) {return school.schoolName}), 
        					_.map($scope.userinfo.educations, function(school) {return school.schoolName})).join(', ');
        			$scope.isCollapsed.push(true);
        		}
        		console.log(results[1].data);
        		$scope.attendees = results[1].data;
        		console.log($scope.attendees);
        		//To-do add affinity story
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