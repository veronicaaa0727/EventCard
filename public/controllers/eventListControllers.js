eventCards
	.constant("eventListActiveClass", "active")
	.constant("eventListPagecount", 10)
	.controller("eventListCtrl", function($scope, $filter, $location,$anchorScroll, $http, auth,
		eventListActiveClass, eventListPagecount, eventBox, userEventUrl){

		var selectedCategory = null;

		$scope.selectedPage = 1;
		$scope.pageSize = eventListPagecount;
		$scope.selectedEvent = null;
		$scope.auth = auth;

		$scope.selectedCategory = function (newCategory) {
			selectedCategory = newCategory;
			$scope.selectedPage = 1;
		}

		$scope.selectPage = function(newPage) {
			$scope.selectedPage = newPage;
			$anchorScroll();
		}

		$scope.categoryFilterFn = function(event) {
			var category = (event.category === '') ? 'Other': event.category;
			return selectedCategory == null ||
				category == selectedCategory;
		}

		$scope.getCategoryClass = function(category) {
			return selectedCategory == category ? eventListActiveClass : "";
		}

		$scope.getPageClass = function(page) {
			return $scope.selectedPage == page ? eventListActiveClass : "";
		}

		$scope.viewDetails = function(event) {
			eventBox.setEvent(event);
			$anchorScroll();
			$location.path("/eventDetail");
		}

		$scope.joinEvents = function(event) {
			eventBox.setEvent(event);
			$anchorScroll();
			$http.post(userEventUrl, {'user_id': auth.profile.user_id, 'event_id': event._id})
				.success(function(users){
					eventBox.setAttendees(users);
					$location.path('/joinEvent');
				})
				.error(function(error){
					$scope.error = error
				})
		}

		$scope.login = function() {
			auth.signin({
  				connections: ['linkedin'],
  				connection_scopes: { 'linkedin': ['r_emailaddress', 'r_contactinfo', 'r_network', 'r_basicprofile', 'r_fullprofile']},
  				offline_mode: true
  			});					
		}

	});