var UserList = require(__dirname+'/room.js');

//user object - we would have to let this be shared on the client side
var User = function(args){
    this.clientId = args.clientId;
    this.name = args.name;
    this.x = args.x;
    this.y = args.y;
    this.avatarIndex = args.avatarIndex;
    this.facing = args.facing || 2;
    this.currentAnimIndex = 0;
    this.room = undefined;//a reference to the room object
    this.lists = [];//this includes the user list for room the user is in
};

//remove all links to this user
User.prototype.destroy = function(){
    lists.forEach(function(list) {
	list.remove(this);
    }, this);
    //quit the room so it can be destroyed if needed
    if (this.room !== undefined) {
	room.quit(user);
    }
};

User.prototype.rename = function(name){
    this.lists.forEach(function(list){
	delete list.by_name[this.name];
	list.by_name[name] = this;
    }, this);
    this.name = name; //make sure this is done last
};

//use lists.push to add and use this for remove
User.prototype.remove_list = function(list_to_remove){
    var index;
    this.lists.forEach(function(list, i) {
	if (list_to_remove == list) {
	    index = i;
	}
    }, this);
    if (index !== undefined) {
	this.lists.slice(index,1);
    }
};

User.prototype.equals = function(user) {
    if(this.x == user.x &&
       this.y == user.y &&
       this.avatarIndex == user.avatarIndex &&
       this.facing == user.facing &&
       this.currentAnimIndex == user.currentAnimIndex) {
	return true;
    }
    return false;
};

User.prototype.update = function(state) {
    if(state.x !== undefined) {
	this.x = state.x;
    }
    if(state.y !== undefined) {
	this.y = state.y;
    }
    if(state.avatarIndex !== undefined) {
	this.avatarIndex = state.avatarIndex;
    }
    if(state.facing !== undefined) {
	this.facing = state.facing;
    }
    if(state.currentAnimIndex !== undefined) {
	this.currentAnimIndex = state.currentAnimIndex;
    }
};

User.prototype.getState = function() {
    return {
	'x': this.x,
	'y': this.y,
	'avatarIndex': this.avatarIndex,
	'facing': this.facing,
	'currentAnimIndex': this.currentAnimIndex
    };
}
module.exports = User;
