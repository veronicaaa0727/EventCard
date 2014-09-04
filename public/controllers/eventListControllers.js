eventCards
	.constant("eventListActiveClass", "active")
	.constant("eventListPagecount", 10)
	.constant('eventSearch', "/api/events/search")
	.constant('createEvent', "/api/events/create")
	.controller("eventListCtrl", function($scope, $filter, $location,$anchorScroll, $http, auth,
		eventListActiveClass, eventListPagecount, eventBox, userEventUrl, eventSearch, createEvent, userEventUrl){

		var selectedCategory = null;

		$scope.selectedPage = [1,1,1];
		$scope.pageSize = eventListPagecount;
		$scope.selectedEvent = null;
		$scope.auth = auth;
		$scope.searchEvents = null;
		$scope.confirmation = false;

		$scope.selectedCategory = function (number, newCategory) {
			selectedCategory = newCategory;
			$scope.selectedPage = 1;
		}

		$scope.selectPage = function(number, newPage) {
			$scope.selectedPage[number] = newPage;
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

		$scope.getPageClass = function(number, page) {
			return $scope.selectedPage[number] == page ? eventListActiveClass : "";
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

		$scope.searchEvent = function(text) {
			$http.post(eventSearch, {'searchText': text})
				.success(function(events){
					console.log(events);
					$scope.searchEvents = events;
				})
				.error(function(error){
					$scope.error = error
				})
		}

		$scope.confirm = function(){
			$scope.confirmation = true;
		}

		$scope.unconfirm = function(){
			$scope.confirmation = false;
		}

		$scope.createEvent = function(event) {
			event.name_html = "<p>" + event.name_text + "</p>";
			event.description_html = "<p>" + event.description_text + "</p>";
			event.lat = 37.4225;
			event.lon = -122.1653;
			$http.post(createEvent, {'event': event})
				.success(function(eventDetail){
					console.log(eventDetail);
					$scope.data.events.push(eventDetail);
					$scope.data.myevents.push(eventDetail);
					$http.post(userEventUrl, {'user_id': auth.profile.user_id, 'event_id': eventDetail._id})
						.success(function(users){
						})
						.error(function(error){
							$scope.error = error
						});
					$location.path('/');
				})
				.error(function(error){
					$scope.error = error
				})
		}

	});