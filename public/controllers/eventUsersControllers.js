eventCards
	.constant("eventUserUrl", "/api/events/users")
	.constant('userProfileUrl', "/api/users/profile")
    .constant('userEventRatingUrl', '/api/events/users/rating')
    .constant("connectUrl", "/api/users/connect")
    .constant("acceptUrl", "/api/users/accept")
    .constant("eventEvaluate", "/api/events/evaluate")
	.controller("eventUsersCtrl", function($scope, $location, $http, $q, $filter, $anchorScroll, auth, eventBox, eventListActiveClass, eventListPagecount,
        eventUserUrl, userProfileUrl, connectUrl, acceptUrl, userEventRatingUrl, eventEvaluate, mySocket) {

        $scope.eventName = eventBox.getEvent().name_text;
		$scope.attendees = [];
        $scope.online = [];
        $scope.results = [];
		$scope.auth = auth;
		$scope.userinfo = {};
        $scope.connections = {};
		$scope.isCollapsed = [];
        $scope.similarityScore = 'similarityScore';
        $scope.reverse = true;
        $scope.selectedPage = 1;
        $scope.pageSize = eventListPagecount;
        $scope.rating = 0;

        mySocket.emit('join', auth.profile.user_id);
        mySocket.on('join', function (data) {
            $scope.online = data; // data will be 'woot'
        });
        mySocket.on('add', function (data) {
            console.log('on add');
            $scope.connections[data] = 2; // data will be 'woot'
        });
        mySocket.on('accept', function (data) {
            $scope.connections[data] = 3; // data will be 'woot'
        });


        $scope.rate = 7;
        $scope.max = 10;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
        ];

        $scope.evaluate = function(rating){

            $scope.rating = 0;
            $scope.ratingMessage = "Thanks for the evaluation!"
            data = {}
            data.rating = rating;
            data.event_id = eventBox.getEvent()._id;
            data.user_id = auth.profile.user_id;
            $http.post(eventEvaluate, data)
                    .success(function(data){
                        
                    })
                    .error(function(error){
                        $scope.error = error
                    });
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
                $http.post(userProfileUrl, {'user_id': auth.profile.user_id}), 
				$http.post(eventUserUrl, eventBox.getAttendees()),
                $http.post(userEventRatingUrl, {'user_id': auth.profile.user_id, 'event_id': eventBox.getEvent()._id})
			]).then(function(results) { 
        		$scope.userinfo = results[0].data;
                    
				for(var i = 0; i < $scope.data.connections.length; i++){
                    $scope.connections[$scope.data.connections[i].receiver] = $scope.data.connections[i].status;
                }
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
                if(!results[2].data){
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
            mySocket.emit('add', user.user_id);
            $scope.connections[user.user_id] = 1;
            
            var info = {};
            info.sender = $scope.userinfo.user_id;
            info.receiver = user.user_id;
            info.event_id = eventBox.getEvent()._id;
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
            info.event_id = eventBox.getEvent()._id;
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