var eventCards = angular.module("eventCards", ["customFilters", "eventBox", "ngRoute", "ngSanitize", "auth0", "ngCookies", "ui.bootstrap", "ui.bootstrap.datetimepicker", "btford.socket-io", "ngTagsInput", "cgNotify"]);

eventCards
	.constant("dataUrl", "/api/events/view")
	.constant("userUrl", "/api/users/login")
	.constant("myeventsUrl", "/api/users/myevents")
	.constant("statusUrl", "/api/users/connectstatus")
	.config(function ($routeProvider, authProvider, $httpProvider, $locationProvider) {

		$routeProvider.when("/events", {
			templateUrl: "/views/eventList.html"
		});

		$routeProvider.when("/eventDetail", {
			templateUrl: "/views/eventDetail.html"
		});

		$routeProvider.when("/joinEvent", {
			templateUrl: "/views/eventUsers.html",
			requiresLogin: true
		});

		$routeProvider.when("/connections", {
			templateUrl: "/views/connections.html",
			requiresLogin: true
		});

		$routeProvider.otherwise({
			templateUrl: "/views/eventList.html"
		});

		authProvider.init({
			domain: 'eventcard.auth0.com',
			clientID: '8Zd1eXfjw0Ykbwk8AHkp7bdpeD0A1lBA',
			callbackURL: location.href,
			loginUrl: '/'
		});

		authProvider.on('loginSuccess', function($location, $http, userUrl, $anchorScroll) {
			$anchorScroll();
			$location.path($location.href);
		});

		authProvider.on('loginFailure', function($log, error) {
			log('Error logging in', error);
		});

		$httpProvider.interceptors.push('authInterceptor');

	})
	.run(function(auth) {
  		auth.hookEvents();
	})
	.controller("eventCardsCtrl", function ($scope, $http, $location, $anchorScroll, $window, auth, 
		dataUrl, userUrl, eventBox, myeventsUrl, statusUrl, mySocket, notify) {

		$scope.template = '';
		$scope.data = {};
		$scope.connections = {};
		$scope.events = {};
		$scope.online = []
		console.log(auth);

		$scope.init = function () {
		    var interval = eventBox.getInterval();
			eventBox.setTime();
			if(interval > 10000000)
				eventBox.setEvent({});
			if(!jQuery.isEmptyObject(eventBox.getEvent())){
				$anchorScroll();
				$location.path('/eventDetail');
			}
		};

		$scope.home = function() {
			eventBox.setEvent({});
			if(auth.profile){
				$http.post(myeventsUrl, {'user_id': auth.profile.user_id})
					.success(function(events) {
						$scope.data.myevents = events;
					})
					.error(function(error) {
						$scope.data.error = error;
					});
				$http.post(statusUrl, {'user_id': auth.profile.user_id})
					.success(function(connections) {
						$scope.data.connections = connections;
						console.log
					})
					.error(function(error) {
						$scope.data.error = error;
					});
			}
			$anchorScroll();
			$location.path('/events');

		}

		$scope.auth = auth;

		$scope.$watch('auth.profile', function (newVal, oldVal, $scope) {
    		if(newVal) {
    			mySocket.emit('join', {user_id: auth.profile.user_id, name: auth.profile.nickname});

      			$http.post(userUrl, newVal)
					.success(function() {
					})
					.error(function(error) {
				
					});
				$http.post(myeventsUrl, {'user_id': newVal.user_id})
					.success(function(events) {
						$scope.data.myevents = events;
					})
					.error(function(error) {
						$scope.data.error = error;
					});
				$http.post(statusUrl, {'user_id': auth.profile.user_id})
					.success(function(connections) {
						$scope.data.connections = connections;
					})
					.error(function(error) {
						$scope.data.error = error;
					});
   			}
  		});		

		$http.post(dataUrl,{'lat': 37.4225, 'lon': -122.1653})
			.success(function(data) {
				$scope.data.events = data;
			})
			.error(function(error) {
				$scope.data.error = error;
			});

		$scope.login = function() {
			auth.signin({
  				connections: ['linkedin'],
  				connection_scopes: { 'linkedin': ['r_emailaddress', 'r_contactinfo', 'r_network', 'r_basicprofile', 'r_fullprofile']},
  				offline_mode: true
  			});					
		}

		$scope.logout = function() {
            auth.signout();
            eventBox.setEvent({});
            $scope.data.myevents = {};
            $location.path('/events');
        }

        mySocket.on('join', function (data) {
            $scope.online = data; // data will be 'woot'
        });
        mySocket.on('add', function (data) {
            notify({ message: data.user.name +' add you as a connection!', templateUrl:'/views/angular-notify.html'} );
            $scope.connections[data.user.user_id] = 2; // data will be 'woot'
            $scope.events[data.user.user_id] = data.event_id;
        });
        mySocket.on('accept', function (data) {
        	notify({ message: data.name +' accept your invitation!', templateUrl:'/views/angular-notify.html'} );
            $scope.connections[data.user_id] = 3; // data will be 'woot'
        });

	})
	.factory('mySocket', function (socketFactory) {
  		var socket = socketFactory();
      	socket.forward('broadcast');
      	return socket;
	});









