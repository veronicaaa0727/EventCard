var eventCards = angular.module("eventCards", ["customFilters", "eventBox", "ngRoute", "auth0"]);

eventCards
	.constant("dataUrl", "/api/products/view")
	.constant("userUrl", "/api/users/login")
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
			loginUrl: '/eventDetail'
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
	.controller("eventCardsCtrl", function ($scope, $http, $location, auth, dataUrl, userUrl) {
		$scope.data = {
		};

		$scope.data.selectedEvent = null;

		$http.get(dataUrl)
			.success(function(data) {
				$scope.data.events = data;
			})
			.error(function(error) {
				$scope.data.error = error;
			});
		
		$scope.auth = auth;
		
		$scope.$watch('auth.profile', function (newVal, oldVal, $scope) {
    		if(newVal) { 
    			console.log(newVal);
      			$http.post(userUrl, newVal)
					.success(function() {

					})
					.error(function(error) {
				
					});
   			}
  		});

		
		
	});