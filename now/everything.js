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



// Kicks users who have been inactive for more than 5 minutes. 
// This is a guaranteed fix to the lingering users problem.
checkUserTimeout = function() {
    var rms = rooms.by_name;
    for(r in rms) {
	var usrs = rms[r].users.by_name;
	console.log("Ulist " + usrs.remove);
	for(u in usrs) {
	    var time = new Date().getTime();
	    var user = usrs[u];
	    if((time - user.lastUpdate) > 300000 /*5 minutes in ms*/) {
		console.log("kicking user " + u);
		rms[r].users.remove(user);
		nowjs.getGroup(user.room.name).now.removeUser(user.name);
		nowjs.getGroup(user.room.name).now.receiveMessage("SERVER", user.name + " quit.");
	    }
	}
    }
    setTimeout(checkUserTimeout, 5000);
};

checkUserTimeout();

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
    
    everyone.now.joinRoom = function(room){
	//get data
	var cid = this.user.clientId;
	var user = users.by_cid[cid];
	
	console.log("JOIN " + room);
	//leave the old one if there is one
	if (user.room !== undefined) {
	    nowjs.getGroup(user.room.name).removeUser(cid);
	    nowjs.getGroup(user.room.name).now.removeUser(user.name);
	    nowjs.getGroup(user.room.name).now.receiveMessage("SERVER", user.name + " entered " + room);

	}
	
	nowjs.getGroup(room).addUser(cid);
	rooms.join_by_name(room, user);
	

	var state = user.room.getState();
	console.log("State before " + JSON.stringify(state));

	this.now.receiveMessage("SERVER", "You are now in " + user.room.name);
	
	var grp = nowjs.getGroup(user.clientId);
	grp.addUser(this.user.clientId);

	var state = user.room.getState();
	console.log("State after " + JSON.stringify(state));

	grp.now.receiveState(room, user.name, state);
	nowjs.getGroup(room).now.receiveStateUpdate(user.name, user.getState());
    };

    everyone.now.updateState = function(name, state) {
	var cid = this.user.clientId;
	var user = users.by_cid[cid];
	

	if(user && user.room) {
	    if(user.equals(state)) {
		return;
	    }

	    user.lastUpdate = new Date().getTime();
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
	user.lastUpdate = new Date().getTime();
	if(user.room)
	    nowjs.getGroup(user.room.name).now.receiveMessage(user.name, msg);
    }
}
