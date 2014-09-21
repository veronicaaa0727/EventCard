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
        $scope.filterCollapsed = true;
        $scope.events = [];
        $scope.searchedEvents = [];
        $scope.searchText = null;
        $scope.changeCollapsed = function(){
            $scope.filterCollapsed = !$scope.filterCollapsed;
        }

        $scope.ratingStates = [
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
        ];

        //Filter Data
        $scope.filter = {};
        $scope.filter.categories = [
        	"All",
        	"Business & Professional",
        	"Music",
        	"Food & Drink",
        	"Community & Culture",
        	"Performing & Visual Arts",
        	"Film, Media & Entertainment",
        	"Sports & Fitness",
        	"Health & Wellness",
        	"Science & Technology",
        	"Travel & Outdoor",
        	"Charity & Causes",
        	"Religion & Spirituality",
        	"Family & Education",
        	"Seasonal & Holiday",
        	"Government & Politics",
        	"Fashion & Beauty",
        	"Home & Lifestyle",
        	"Auto, Boat & Air",
        	"Hobbies & Special Interest",
        	"Other"
        ];
        var distances = {
        	'1 mile': 1,
        	'5 miles': 5,
        	'10 miles': 10,
        	'20 miles': 20,
        	'50 miles': 50
        }
        var cities = {  	
        	'Berkeley': {lat: 37.871593, lon: -122.272747},
        	'Cupertino': {lat: 37.322998, lon: -122.032182},
        	'Fremont': {lat: 37.548270, lon: -121.988572},       	
        	'Redwood City': {lat: 37.485215, lon: -122.236355},
        	'Menlo Park': {lat: 37.452960, lon: -122.181725},
        	'Milbrea': {lat: 37.598547, lon: -122.387194},
        	'Milpitas': {lat: 37.432334, lon: -121.899574},
        	'Mountain View': {lat: 37.386052, lon: -122.083851},
        	'Oakland': {lat: 37.804364, lon: -122.271114},
        	'Palo Alto': {lat: 37.441883, lon: -122.143019},
        	'San Francisco': {lat: 37.774929, lon: -122.419416},
        	'San Mateo': {lat: 37.562992, lon: -122.325525},
        	'San Jose': {lat: 37.339386, lon: -121.894955},
        	'Santa Clara': {lat: 37.354108, lon: -121.955236},
        	'South San Francisco': {lat: 37.654656, lon: -122.407750},
        	'Sunnyvale': {lat: 37.368830, lon: -122.036350},	
        }
        var date = {
        	'1 Week': 7,
        	'2 Weeks': 14,
        	'1 Month': 30
        }
        $scope.filter.dist = Object.keys(distances);
        $scope.filter.cities = Object.keys(cities);
        $scope.filter.date = Object.keys(date);

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

		$scope.searchEvent = function() {
			$http.post(eventSearch, {'searchText': $scope.searchText})
				.success(function(events){
					$scope.events = JSON.parse(JSON.stringify($scope.data.events));
					$scope.data.events = JSON.parse(JSON.stringify(events))
					$scope.searchedEvents = JSON.parse(JSON.stringify(events));
				})
				.error(function(error){
					$scope.error = error
				})
		}

		$scope.restore = function() {
			$scope.searchText = null;
			$scope.data.events = JSON.parse(JSON.stringify($scope.events));
			$scope.events = [];
			$scope.searchedEvents = [];
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
			var data = {};
			data.location = {lat: 37.4225, lon: -122.1653};
			data.distance = 0.05;
			data.categories = JSON.parse(JSON.stringify($scope.filter.categories));
			data.datespan = 7;
			if($scope.filter.selectedCity)
				data.location = cities[$scope.filter.selectedCity];
			if($scope.filter.selectedDistance)
				data.distance = 0.01 * distances[$scope.filter.selectedDistance];
			if($scope.filter.selectedCategory && $scope.filter.selectedCategory != 'All')
				data.categories = [$scope.filter.selectedCategory];
			if($scope.filter.selectedDate)
				data.datespan = date[$scope.filter.selectedDate];
			if($scope.searchText){
				var events = [];
				var future = new Date();
				future.setDate(future.getDate() + data.datespan);
				for (var i = 0; i < $scope.searchedEvents.length; ++i){
					if($scope.searchedEvents[i].lat < data.location.lat - data.distance || 
						$scope.searchedEvents[i].lat > data.location.lat + data.distance)
						continue;
					if($scope.searchedEvents[i].lon < data.location.lon - data.distance || 
						$scope.searchedEvents[i].lon > data.location.lon + data.distance)
						continue;
					if(data.categories.indexOf($scope.searchedEvents[i].category) < 0)
						continue;
					if(new Date($scope.searchedEvents[i].start) < new Date() || new Date($scope.searchedEvents[i].start) > future)
						continue;
					events.push($scope.searchedEvents[i]);
				}
				$scope.data.events = events;
			}
			else{
				$http.post(eventFilter,data)
					.success(function(data) {
						$scope.data.events = data;
						//$location.path('/');
					})
					.error(function(error) {
						$scope.data.error = error;
					});
			}
		}

	});