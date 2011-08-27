//problems: we need to keep track of users so the same nickname can't be logged in more than once
//problem!!! we should be storing user data somewhere in an array and not in
// the now object because the user can change that without any checks AFAIK

var nowjs = require('now');

var nowstuff = module.exports;


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

//WARNING: one user can appear in multiple user lists - we have to remove
//him from all of them!!!

//user object - we would have to let this be shared on the client side
var User = function(clientId, name){
  this.clientId = clientId;
  this.name = name;
  
  this.room = undefined;//a reference to the room object
  this.lists = [];//this includes the user list for room the user is in
  
  //remove all links to this user
  this.destroy = function(){
    lists.forEach(function(list){
      list.remove(this);
    }, this);
    //quit the room so it can be destroyed if needed
    if(this.room !== undefined){
      room.quit(user);
    }
  };
  
  this.rename = function(name){
    this.lists.forEach(function(list){
      delete list.by_name[this.name];
      list.by_name[name] = this;
    }, this);
    this.name = name; //make sure this is done last
  };
  
  //use lists.push to add and use this for remove
  this.remove_list = function(list_to_remove){
    var index;
    this.lists.forEach(function(list, i){
      if(list_to_remove == list){
        index = i;
      }
    }, this);
    if(index !== undefined){
      this.lists.slice(index,1);
    }
  }
};


//keep track of all users in a few different maps for fast access
//these are just references, so we can modify the user in one map and it'll
//affect every reference to them
var UserList = function(){
  this.by_cid = {};
  this.by_name = {};
  
  this.remove = function(user){
    delete this.by_cid[user.clientId];
    delete this.by_name[user.name];
    user.remove_list(this);
    return user;
  }
  this.add = function(user){
    this.by_cid[user.clientId] = user;
    this.by_name[user.name] = user;
    user.lists.push(this);
  }
  this.create = function(cid, name){
    var user = new User(cid, name);
    this.add(user);
    return user;
  }
};

//all users
var users = new UserList();

//keeps data about a room
var Room = function(name){
  this.name = name;
  this.users = new UserList();//just add and remove users directly
};

//keeps track of all the rooms
var RoomList = function(){
  this.by_name = {};//a map of name: Room
  
  this.join_by_name = function(name, user){
    var room;
    
    //create room if it doesn't eixst
    if(this.by_name[name] === undefined){
      room = new Room(name);
      this.by_name[name] = room;
    } else {
      room = this.by_name[name];
    }
    
    this.join(room, user);
  }
  
  //remember to quite the old one before joining the new one
  this.join = function(room, user){
    room.users.add(user);
    user.room = room;
  }
  
  //remove both connections
  this.quit = function(user){
    var room = user.room;
    delete user.room;
    room.users.remove(user);
    //TODO: check if the room is emptry and destroy it
  }
};

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
                            + ". To change it, type /nick <new name>");
      
      if (typeof(success) == 'function') {
        success();
      }
    } else {
      this.now.receiveMessage("SERVER ERROR", "Your nickname is taken. Type /nick <new name> to change it");
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
    this.now.receiveMessage("SERVER", "You're now in " + user.room.name
                          + ". Type /j <room> to join another room.");
    
    //TODO: Francis, you would want to change the room on the screen here!
    //maybe add a callback
  };
  
  everyone.now.moveTo = function(x,y){
    //get data
    var cid = this.user.clientId;
    var user = users.by_cid[cid];
    
    user.x = x;
    user.y = y;
  }
  
  /*groups.home.on('join', function(){
    this.now.receiveMessage('SERVER', 'Welcome to the home room!');
  });*/
  
  nowjs.on('connect', function () {
    this.now.receiveMessage('SERVER', 'Welcome to Node-room.');
    this.now.receiveMessage('SERVER', 'Hotkeys: [tab] [j] [n] [left] [right] [up] [down]');
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
