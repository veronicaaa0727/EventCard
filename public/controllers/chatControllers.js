eventCards
	.controller("chatCtrl", function($scope, $location, $http, $filter, $q, auth, eventListActiveClass, chatUserService, mySocket){
		$scope.selectedUser = null;
		$scope.auth = auth;

		$scope.data.chatUsers = chatUserService.getUsers();

		mySocket.on('message', function(message){
			for(var i = 0; i < $scope.data.chatUsers.length; ++i){
				if($scope.data.chatUsers[i].active == true){
					$scope.selectedUser = $scope.data.chatUsers[i];
					break;
				}
			}
		});

		for(var i = 0; i < $scope.data.chatUsers.length; ++i){
			if($scope.data.chatUsers[i].active == true){
				$scope.selectedUser = $scope.data.chatUsers[i];
				break;
			}
		}

		$scope.selectUser = function(user){
			$scope.selectedUser = user;
			chatUserService.addUser(user);
		}

		$scope.getUserClass = function(user) {
			if(!$scope.selectedUser) return "";
			return $scope.selectedUser.user_id == user.user_id ? eventListActiveClass : "";
		}

		$scope.getMessageClass = function(message) {
			if(message.sender == auth.profile.nickName){
				return ('right', 'pull-right', 'pull-left');
			}else{
				return ('left', 'pull-left', 'pull-right');
			}
		}

		$scope.sendMessage = function(data) {
			var message = {};
			message.receiver = $scope.selectedUser;
			message.sender = $scope.userinfo;
			message.content = data;
			message.updated = new Date();
			console.log(message);
			mySocket.emit('message', message);

			if(!$scope.data.messages[message.receiver.user_id] || $scope.data.messages[message.receiver.user_id].length == 0)
				$scope.data.messages[message.receiver.user_id] = [message];
			else
				$scope.data.messages[message.receiver.user_id].push(message);

			$scope.message = "";

		}

	});