var eventCards = angular.module("eventCards", ["customFilters", "eventBox", "ngRoute", "ngSanitize", "auth0"]);

eventCards
	.constant("dataUrl", "/api/events/view")
	.constant("userUrl", "/api/users/login")
	.constant("connectionUrl", "https://api.linkedin.com/v1/people/~/connections:(id,first-name,last-name,headline,location,industry,num-connections,summary,specialties,positions,picture-url,public-profile-url)?format=json&oauth2_access_token=")
	.constant("profileUrl", "https://api.linkedin.com/v1/people/~:(interests,publications,patents,honors-awards,following,educations,courses,skills,certifications,languages,id,first-name,last-name,headline,location,industry,num-connections,summary,specialties,positions,picture-url,public-profile-url,email-address)?format=json&oauth2_access_token=")
	.config(function ($routeProvider, authProvider, $httpProvider, $locationProvider) {
		$routeProvider.when("/checkout", {
			templateUrl: "/views/checkoutSummary.html"
		});

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

		$routeProvider.otherwise({
			templateUrl: "/views/eventList.html"
		});

		authProvider.init({
			domain: 'eventcard.auth0.com',
			clientID: '8Zd1eXfjw0Ykbwk8AHkp7bdpeD0A1lBA',
			callbackURL: location.href,
			loginUrl: '/'
		});

		authProvider.on('loginSuccess', function($location, $http, auth, userUrl) {
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
	.controller("eventCardsCtrl", function ($scope, $http, $location, auth, dataUrl, userUrl, eventBox, profileUrl) {
		$scope.data = {
		};

		$scope.auth = auth;

		$scope.$watch('auth.profile', function (newVal, oldVal, $scope) {
    		if(newVal) {
    			console.log(newVal);
    			/*
    			$http.get(profileUrl + auth.profile.identities[0].access_token)
					.success(function(data) {
						console.log(data);
					})
					.error(function(error) {
				
					});
				*/
      			$http.post(userUrl, newVal)
					.success(function() {

					})
					.error(function(error) {
				
					});
   			}
  		});

		if(eventBox.getEvent().length != 0){
			$location.path('/eventDetail');
		}

		$http.post(dataUrl,{'lat': 37.4225, 'lon': -122.1653})
			.success(function(data) {
				$scope.data.events = data;
			})
			.error(function(error) {
				$scope.data.error = error;
			});
	});