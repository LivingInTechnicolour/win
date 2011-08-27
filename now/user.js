var UserList = require('room.js');

//user object - we would have to let this be shared on the client side
var User = function(clientId, name){
  this.clientId = clientId;
  this.name = name;

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

module.exports = User;