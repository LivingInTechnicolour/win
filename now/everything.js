//problems: we need to keep track of users so the same nickname can't be logged in more than once
//problem!!! we should be storing user data somewhere in an array and not in
// the now object because the user can change that without any checks AFAIK

//clientWrite is off! the user can't directly modify any state veriables.

var nowjs = require('now');

//we don't create all the groups because we don't care what groups the user joins
//we might need to do this when we create the layouts of the rooms
/*var group_names = ['home'], groups = [];
for(var n = 0, len = group_names.length; n < len; n++){
  groups[group_names[n]] = nowjs.getGroup(groups);
}*/

//call as:
//
// for_all_groups(this, function(group, group_name){
//   //do stuff with group
// });
function for_all_groups(that, cb){
  that.getGroups(function (groups) {
    for (var i = groups.length; i--;) {
      if (groups[i] !== 'everyone') {
        cb(nowjs.getGroup(groups[i]), groups[i]);
      }
    }
  });
}

//define all the server side functions we would need to call from the client
module.exports = function(everyone){
  
  everyone.now.authenticate = function(name){
    this.now.name = name;
    this.now.receiveMessage("SERVER", "Your nickname is now " + name
                          + ". To change it, type /nick <new name>");
  }
  
  everyone.now.joinRoom = function(room){
    //leave the old one
    nowjs.getGroup(this.now.room).removeUser(this.user.clientId);
    //security: we shouldn't be allowing them to enter ANY group
    nowjs.getGroup(room).addUser(this.user.clientId);
    this.now.room = room;
    this.now.receiveMessage("SERVER", "You're now in " + this.now.room
                          + ". Type /j <room> to join another room.");
    //TODO: Francis, you would want to change the room on the screen here!
  };
  
  everyone.now.moveTo = function(x,y){
    this.now.x = x;
    this.now.y = y;
  }
  
  /*groups.home.on('join', function(){
    this.now.receiveMessage('SERVER', 'Welcome to the home room!');
  });*/
  
  nowjs.on('connect', function () {
    this.now.room = "home";
    nowjs.getGroup(this.now.room).addUser(this.user.clientId);
    this.now.receiveMessage('SERVER', 'Welcome to Node-room.');
  });
  
  everyone.now.distributeMessage = function(msg){
    nowjs.getGroup(this.now.room).now.receiveMessage(this.now.name, msg);
  }
}
