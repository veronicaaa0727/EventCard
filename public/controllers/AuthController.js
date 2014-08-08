var sportsStoreAdmin = angular.module("sportsStoreAdmin", ["ngRoute", "ngResource"]);

sportsStoreAdmin
	.config(function ($routeProvider) {
		$routeProvider.when("/login", {
			templateUrl: "views/authLogin.html"
		});

		$routeProvider.when("/main", {
			templateUrl: "views/authMain.html"
		});

		$routeProvider.otherwise({
			redirectTo: "/login"
		});
	})
	.constant("authUrl", "/users/login")
	.constant("ordersUrl", "/api/orders/view")
	.constant("linkedInUrl", "/auth/linkedin")
	.controller("authCtrl", function($scope, $http, $location, authUrl, linkedInUrl) {
		$scope.authenticate = function (user, pass) {
			$http.post(authUrl, {
				username: user,
				password: pass
			}).success(function (data) {
				$location.path("/main");
			}).error(function (error) {
				$scope.authenticationError = "Invalid username or password.";
			});
		}
		$scope.linkedInAuth = function () {
			$http.get(linkedInUrl)
				.success(function (data) {
					$location.path("/main");
				}).error(function (error) {
					$scope.authenticationError = "Invalid username or password.";
				});
		}
	})
	.controller("mainCtrl", function($scope) {
		$scope.screens = ["Products", "Orders"];
		$scope.current = $scope.screens[0];

		$scope.setScreen = function (index) {
			$scope.current = $scope.screens[index];
		}

		$scope.getScreen = function () {
			return $scope.current == "Products" ? "/views/adminProducts.html" : "/views/adminOrders.html";
		};
	})
	.controller("ordersCtrl", function($scope, $http, ordersUrl) {
		$http.get(ordersUrl) 
			.success(function (data) {
				$scope.orders = data;
			})
			.error(function (error) {
				$scope.error = error;
			});
		$scope.selectedOrder;
		$scope.selectOrder = function(order) {
			$scope.selectedOrder = order;
		};

		$scope.calcTotal = function(order) {
			var total = 0;
			for (var i = 0; i < order.products.length; i++) {
				total += order.products[i].count * order.products[i].price;
			}
			return total;
		}
	});









