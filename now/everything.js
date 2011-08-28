//problems: we need to keep track of users so the same nickname can't be logged in more than once
//problem!!! we should be storing user data somewhere in an array and not in
// the now object because the user can change that without any checks AFAIK

var nowjs = require('now');

var nowstuff = module.exports;

//get classes
var RoomList = require(__dirname+'/roomlist.js');
var UserList = require(__dirname+'/userlist.js');

//all users
var users = new UserList();
//we only really have one RoomList
var rooms = new RoomList;

//define all the server side functions we would need to call from the client
nowstuff.setup = function(everyone){
  
  everyone.now.authenticate = function(name, success, fail){
    //get data
    var cid = this.user.clientId;
    var user = users.by_cid[cid];
    
    //set name to the same value it was before? done.
    if (user !== undefined && user.name == name){
      return;
    }
    
    //add the user only if they are new (name not taken) and not trying to be SERVER
    if ( name != 'SERVER' && name != 'SERVER ERROR' 
        && users.by_name[name] === undefined){
      //new user!
      if (user == undefined){
        users.create(cid, name);
      }
      //old user!
      else {
        user.rename(name);
      }
      
      this.now.receiveMessage("SERVER", "Your nickname is now " + name
                            + ". To change it, press n.");
      
      if (typeof(success) == 'function') {
        success();
      }
    } else {
      this.now.receiveMessage("SERVER ERROR", "This nickname is taken. Type /nick <new name> to choose anytoher one");
      fail();
    }
  }
  
  everyone.now.joinRoom = function(room){
    //get data
    var cid = this.user.clientId;
    var user = users.by_cid[cid];
    
    //leave the old one if there is one
    if (user.room !== undefined) {
      nowjs.getGroup(user.room.name).removeUser(cid);
    }
    
    nowjs.getGroup(room).addUser(cid);
    rooms.join_by_name(room, user);
    this.now.receiveMessage("SERVER", "You are now in " + user.room.name
                          + ". Press j to join another room.");
    
    //TODO: Francis, you would want to change the room on the screen here!
    //maybe add a callback; we have to pass it all the user objects in that room
  };
  
  everyone.now.fetch = function(cb){
    //get data
    var cid = this.user.clientId;
    var user = users.by_cid[cid];
    
    cb(user.room);
  };
  
  everyone.now.moveTo = function(x,y){
    //get data
    var cid = this.user.clientId;
    var user = users.by_cid[cid];
    
    user.x = x;
    user.y = y;
    //TODO: notify everyone in the room about the movement
  }
  
  /*groups.home.on('join', function(){
    this.now.receiveMessage('SERVER', 'Welcome to the home room!');
  });*/
  
  nowjs.on('connect', function () {
    this.now.receiveMessage('SERVER', 'Welcome to Node-room.');
  });
  
  nowjs.on('disconnect', function() {
    //get data
    var cid = this.user.clientId;
    var user = users.by_cid[cid];
    //kill user
    users.remove(user);
  });
  
  everyone.now.distributeMessage = function(msg){
    //get data
    var cid = this.user.clientId;
    var user = users.by_cid[cid];
    nowjs.getGroup(user.room.name).now.receiveMessage(user.name, msg);
  }
}
