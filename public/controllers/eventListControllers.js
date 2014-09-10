eventCards
	.constant("eventListActiveClass", "active")
	.constant("eventListPagecount", 10)
	.constant('eventSearch', "/api/events/search")
	.constant('createEvent', "/api/events/create")
	.constant("eventFilter", "/api/events/filter")
	.controller("eventListCtrl", function($scope, $filter, $location,$anchorScroll, $http, auth,
		eventListActiveClass, eventListPagecount, eventBox, userEventUrl, eventSearch, createEvent, eventFilter, userEventUrl){

		var selectedCategory = null;

		$scope.selectedPage = [1,1,1];
		$scope.order = ['start', 'start', 'start']
		$scope.reverse = [false, false, false]
		$scope.pageSize = eventListPagecount;
		$scope.selectedEvent = null;
		$scope.auth = auth;
		$scope.searchEvents = null;
		$scope.confirmation = false;
        $scope.max = 5;
        $scope.isReadonly = true;

        $scope.ratingStates = [
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
        ];

        //Filter Data
        $scope.filter = {};
        $scope.filter.categories = [
        	"All",
        	"Business",
        	"Science & Tech",
        	"Other",
        	"Health",
        	"Community",
        	"Family & Education",
        	"Food & Drink",
        	"Sports & Fitness",
        	"Charity & Causes",
        	"Spirituality",
        	"Travel & Outdoor",
        	"Film & Media"
        ];
        $scope.filter.distances = {
        	'1 mile': 1,
        	'5 miles': 5,
        	'10 miles': 10,
        	'20 miles': 20,
        	'50 miles': 50,
        	'100 miles': 100
        }
        $scope.filter.dist = Object.keys($scope.filter.distances);

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
			$anchorScroll();
			$location.path("/eventDetail/" + event._id);
		}

		$scope.joinEvents = function(event) {
			$anchorScroll();
			$http.post(userEventUrl, {'user_id': auth.profile.user_id, 'event_id': event._id})
				.success(function(users){
					eventBox.setAttendees(users);
					$location.path('/joinEvent/' + event._id);
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

		$scope.sortBy = function(index, data, rev){
			$scope.order[index] = data;
			$scope.reverse[index] = rev;
		}
		
		$scope.eventFilter = function(){
			distance = 0.05;
			categories = JSON.parse(JSON.stringify($scope.filter.categories));
			categories.push("");
			if($scope.filter.selectedDistance)
				distance = 0.01 * $scope.filter.distances[$scope.filter.selectedDistance];
			if($scope.filter.selectedCategory && $scope.filter.selectedCategory != 'All')
				categories = [$scope.filter.selectedCategory];
			$http.post(eventFilter,{lat: 37.4225, lon: -122.1653, dist: distance, category: categories})
				.success(function(data) {
					$scope.data.events = data;
					console.log(data);
					$location.path('/');
				})
				.error(function(error) {
					$scope.data.error = error;
				});
		}

	});