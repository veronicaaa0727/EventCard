eventCards
	.constant("eventUserUrl", "/api/events/users")
	.constant('userProfileUrl', "/api/users/profile")
	.controller("eventUsersCtrl", function($scope, $location, $http, $q, auth, eventBox, eventUserUrl, userProfileUrl) {
		$scope.attendees = [];
        $scope.results = []
		$scope.auth = auth;
		$scope.userinfo = {};
		$scope.isCollapsed = [];
        $scope.similarityScore = 'similarityScore';
        $scope.reverse = true;

        var calSimilarityScore = function (user1, user2){
            if(!user1.keywords || !user2.keywords)
                return 0;
            var score = 0;
            for (token in user1.keywords){
                if (_.has(user2.keywords, token)){
                    score += user1.keywords[token] * user2.keywords[token];
                }
            }
            score /= (user1.keywordsLength * user2.keywordsLength);
            return score;
        }

        var calQueryScore = function (query, user){
            if(!user.keywords)
                return 0;
            var score = 0;
            var queryTokens = query.split(' ');
            var length = Math.sqrt(queryTokens.length);
            for(var i = 0; i < queryTokens.length; i++){
                if (_.has(user.keywords, queryTokens[i])){
                    score += user.keywords[queryTokens[i]];
                }
            }
            score /= (length * user.keywordsLength);
            return score;
        }

		$q.all([
				$http.post(userProfileUrl, {'user_id': auth.profile.user_id}), 
				$http.post(eventUserUrl, eventBox.getAttendees())
			]).then(function(results) { 
        		$scope.userinfo = results[0].data;
				
        		for(var i = 0; i < results[1].data.length; i++){
        			if(results[1].data[i].user_id == $scope.userinfo.user_id){
                        continue;   
                    }  						

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
                    results[1].data[i].similarityScore = calSimilarityScore(results[0].data, results[1].data[i]);
        			$scope.isCollapsed.push(true);
                    $scope.attendees.push(results[1].data[i]);
        		}
                $scope.results = $scope.attendees;
    	});

		$scope.filterAttendees = function(item){
			if(item.user_id === auth.profile.user_id)
				return false;
			else
				return true;
		}

		$scope.addFriend = function(user){

		}

        $scope.search = function(searchText){
            var results = [];
            var attendee;
            for (var i = 0; i < $scope.attendees.length; i++){
                attendee = angular.copy($scope.attendees[i]);
                attendee.similarityScore = calQueryScore(searchText.toLowerCase(), attendee);
                if(attendee.similarityScore > 0.00001){
                    console.log(attendee)
                    results.push(attendee);
                }
            }
            $scope.results = results;
        }

        $scope.restore = function(){
            $scope.results = $scope.attendees;
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