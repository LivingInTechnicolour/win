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
	    
	    this.now.receiveMessage("SERVER", "Your nickname is now " + name);
	    
	    if (typeof(success) == 'function') {
		success();
	    }
	} else {
	    this.now.receiveMessage("SERVER ERROR", "This nickname is taken. Type /nick <new name> to choose anytoher one");
	    fail();
	}
    };
    
    everyone.now.joinRoom = function(name, room){
	//get data
	var cid = this.user.clientId;
	var user = users.by_cid[cid];
	
	//leave the old one if there is one
	if (user.room !== undefined) {
	    nowjs.getGroup(user.room.name).removeUser(cid);
	}
	
	nowjs.getGroup(room).addUser(cid);
	rooms.join_by_name(room, user);
	

	var state = user.room.getState();
	console.log("State before " + JSON.stringify(state));

	this.now.receiveMessage("SERVER", "You are now in " + user.room.name);
	
	var grp = nowjs.getGroup('currentUser');
	grp.addUser(this.user.clientId);

	var state = user.room.getState();
	console.log("State after " + JSON.stringify(state));

	grp.now.receiveState(room, user.name, state);
	nowjs.getGroup(room).now.receiveStateUpdate(user.name, user.getState());
    };
    
    // TODO: Kill polling mechanism
    everyone.now.fetch = function(cb){
	//get data
	var cid = this.user.clientId;
	var user = users.by_cid[cid];
	
	var ulist = user.room.users;
	var dirty_users = [];
	for (var i=0, length = ulist.length; i < length; i++){
	    if(ulist[i].dirty){
		dirty_users.push(ulist[i].data);
	    }
	}
	cb(dirty_users);
    };

    everyone.now.updateState = function(name, state) {
	var cid = this.user.clientId;
	var user = users.by_cid[cid];

	if(user && user.room) {
	    if(user.equals(state)) {
		return;
	    }
	   
	    user.room.updateState(user.clientId, state);
	    nowjs.getGroup(user.room.name).now.receiveStateUpdate(user.name, state);
	}
    };
    
    nowjs.on('connect', function () {
	this.now.receiveMessage('SERVER', 'Welcome to Node-room.');
    });
    
    nowjs.on('disconnect', function() {
	//get data
	var cid = this.user.clientId;
	var user = users.by_cid[cid];
	//kill user
	if(user)
	    users.remove(user);
    });
    
    everyone.now.distributeMessage = function(msg){
	//get data
	var cid = this.user.clientId;
	var user = users.by_cid[cid];
	if(user.room)
	    nowjs.getGroup(user.room.name).now.receiveMessage(user.name, msg);
    }
}
