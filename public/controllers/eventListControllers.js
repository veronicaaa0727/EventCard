eventCards
	.constant("eventListActiveClass", "active")
	.constant("eventListPagecount", 10)
	.controller("eventListCtrl", function($scope, $filter, $location,$anchorScroll,
		eventListActiveClass, eventListPagecount, eventBox){

		var selectedCategory = null;

		$scope.selectedPage = 1;
		$scope.pageSize = eventListPagecount;
		$scope.selectedEvent = null;

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

	});