eventCards.service('chatUserService', function() {
  var chatUserList = [];

  var addUser = function(newObj) {
    var flag = true;
    for(var i = 0; i < chatUserList.length; ++i){
      if(chatUserList[i].user_id == newObj.user_id){
        chatUserList[i].active = true;
        chatUserList[i].updated = new Date();
        flag = false;
      }else{
        chatUserList[i].active = false;
      }
    }
    if(flag){
      newObj.active = true;
      newObj.updated = new Date();
      chatUserList.push(newObj);
    }
  }

  var getUsers = function(){
      return chatUserList;
  }

  return {
    addUser: addUser,
    getUsers: getUsers
  };

});