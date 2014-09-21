eventCards
	.constant("eventUserUrl", "/api/events/users")
	.constant('userProfileUrl', "/api/users/profile")
    .constant('userEventRatingUrl', '/api/events/users/rating')
    .constant("connectUrl", "/api/users/connect")
    .constant("acceptUrl", "/api/users/accept")
    .constant("eventEvaluate", "/api/events/evaluate")
    .constant("tagsUrl", "/api/tags")
	.controller("eventUsersCtrl", function($scope, $location, $http, $q, $filter, $anchorScroll, $routeParams, auth, eventBox, eventListActiveClass, eventListPagecount,
        eventUserUrl, userProfileUrl, connectUrl, acceptUrl, userEventRatingUrl, eventDetailUrl, eventEvaluate, tagsUrl, mySocket) {

        if(!eventBox.getAttendees() || eventBox.getAttendees().length == 0){
            $location.path('/eventDetail/' + $routeParams.event_id);
        }

        $scope.shareText = "mailto:?subject=I wanted you to checkout this event&body=Check out this event " + $location.absUrl().replace("joinEvent", "eventDetail");
        $scope.event_id = $routeParams.event_id;
		$scope.attendees = [];
        $scope.results = [];
		$scope.auth = auth;
        $scope.selectedEvent = {};
		$scope.isCollapsed = [];
        $scope.similarityScore = 'similarityScore';
        $scope.reverse = true;
        $scope.selectedPage = 1;
        $scope.pageSize = eventListPagecount;
        $scope.rating = 0;
        $scope.evalCollapsed = true;

        $scope.tags = [];


        $scope.rate = 3;
        $scope.max = 5;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
        ];

        $scope.changeCollapsed = function(){
            $scope.evalCollapsed = !$scope.evalCollapsed;
            console.log($scope.evalCollapsed);
        }

        $scope.evaluate = function(evaluation){

            $scope.rating = 0;
            $scope.ratingMessage = "Thanks for the evaluation!"
            data = {}
            data.rating = evaluation.rate;
            data.comments = evaluation.comments;
            data.anonymous = evaluation.anonymous;
            data.event_id = $scope.event_id;
            data.organizer_id = $scope.selectedEvent.organizer_id;
            data.user_id = auth.profile.user_id;
            $http.post(eventEvaluate, data)
                    .success(function(data){
                        
                    })
                    .error(function(error){
                        $scope.error = error
                    });
        }

        //Tag
        $scope.filterTag = function(val) {
            return $http.get(tagsUrl).then(function(res){
                var skills = [];
                angular.forEach(res.data, function(item){
                    if(item.text.toLowerCase().indexOf(val) > -1)
                        skills.push(item);
                });
                return skills;
            });
        };

        $scope.apply = function(tags){
            var searchText = _.map(tags, function(data){return data.text}).join([separator = ' '])
            $scope.search(searchText);
        }

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
				$http.post(eventUserUrl, eventBox.getAttendees()),
                $http.post(userEventRatingUrl, {user_id: auth.profile.user_id, event_id: $scope.event_id}),
                $http.post(eventDetailUrl, {event_id: $scope.event_id})
			]).then(function(results) { 
                $scope.selectedEvent = results[2].data;
                    
				for(var i = 0; i < $scope.data.connections.length; i++){
                    $scope.connections[$scope.data.connections[i].receiver] = $scope.data.connections[i].status;
                }
        		for(var i = 0; i < results[0].data.length; i++){
        			if(results[0].data[i].user_id == $scope.userinfo.user_id){
                        continue;   
                    }  						

        			results[0].data[i].schoolList = '';
        			results[0].data[i].sharedIndustry = null;
        			
           			if(results[0].data[i].industry == $scope.userinfo.industry)
        				results[0].data[i].sharedIndustry = $scope.userinfo.industry;
        			for(var j = 0; j < results[0].data[i].educations.length; j++){
        				if(j == 0)
        					results[0].data[i].schoolList += results[0].data[i].educations[j].schoolName;
        				else
        					results[0].data[i].schoolList += ', ' + results[0].data[i].educations[j].schoolName;
        			}
        			results[0].data[i].sharedSkills = _.intersection(results[0].data[i].skills, $scope.userinfo.skills).join(', ');
        			results[0].data[i].sharedCompany = 
        				_.intersection(_.map(results[0].data[i].positions, function(position) {return position.company.name}), 
        					_.map($scope.userinfo.positions, function(position) {return position.company.name})).join(', ');
        			results[0].data[i].sharedEducation = 
        				_.intersection(_.map(results[0].data[i].educations, function(school) {return school.schoolName}), 
        					_.map($scope.userinfo.educations, function(school) {return school.schoolName})).join(', ');
                    results[0].data[i].similarityScore = calSimilarityScore($scope.userinfo, results[0].data[i]);
        			$scope.isCollapsed.push(true);
                    $scope.attendees.push(results[0].data[i]);
        		}
                $scope.results = $scope.attendees;
                if(!results[1].data){
                    $scope.rating = 1;
                }
                    
    	});

        $scope.selectPage = function(newPage) {
            $scope.selectedPage = newPage;
            $anchorScroll();
        }

        $scope.getPageClass = function(page) {
            return $scope.selectedPage == page ? eventListActiveClass : "";
        }

        $scope.isOnline = function(id){
            if($scope.online.indexOf(id) >= 0){
                return true;
            }
            else
                return false;
        }

		$scope.filterAttendees = function(item){
			if(item.user_id === auth.profile.user_id)
				return false;
			else
				return true;
		}

		$scope.connect = function(user){
            mySocket.emit('add', {user_id: user.user_id, event_id: $scope.event_id});
            $scope.connections[user.user_id] = 1;
            
            var info = {};
            info.sender = $scope.userinfo.user_id;
            info.receiver = user.user_id;
            info.event_id = $scope.event_id;
            $http.post(connectUrl, info)
                    .success(function(data){
                        $scope.connections[info.receiver] = 1;
                    })
                    .error(function(error){
                        $scope.error = error
                    });
            

		}
        $scope.accept = function(user){
            mySocket.emit('accept', user.user_id);
            $scope.connections[user.user_id] = 3;
            
            var info = {};
            info.sender = $scope.userinfo.user_id;
            info.receiver = user.user_id;
            info.event_id = $scope.event_id;
            $http.post(acceptUrl, info)
                    .success(function(data){
                        scope.connections[info.receiver] = 3;
                    })
                    .error(function(error){
                        $scope.error = error
                    });
            
        }
        $scope.connection = function(user){
            if(user.user_id in $scope.connections){
                return $scope.connections[user.user_id];
            }
            else
                return 0;
        }
        $scope.search = function(searchText){
            if(!searchText){
                $scope.restore();
            }
            else{
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
        }

        $scope.restore = function(){
            $scope.results = $scope.attendees;
        }

		$scope.logout = function() {
    		auth.signout();
    		$scope.data.myevents = {};
    		$location.path('/events');
  		}

  		$scope.quitEvent = function() {
			$location.path('/events');

		}

        $scope.message = function(user){
            chatUserService.addUser(user);
            $location.path('/chat');
        }

	});