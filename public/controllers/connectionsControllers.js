eventCards
	.controller("connectionsCtrl", function($scope, $location, $http, $filter, $q, $anchorScroll, auth, eventListActiveClass, eventListPagecount,
        eventUserUrl, userProfileUrl, connectUrl, acceptUrl, mySocket) {

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

		for(var i = 0; i < $scope.data.connections.length; i++){
			$scope.connections[$scope.data.connections[i].receiver] = $scope.data.connections[i].status;
		}

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
				$http.post(eventUserUrl, Object.keys($scope.connections))
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

        $scope.friends = function(user){
            if($scope.connections[user.user_id] == 3){
                return 1
            }
            else
                return 0;
        }

        $scope.approval = function(user){
            if($scope.connections[user.user_id] == 1){
                return 1
            }
            else
                return 0;
        }

        $scope.accept = function(user){
            if($scope.connections[user.user_id] == 2){
                return 1
            }
            else
                return 0;
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


