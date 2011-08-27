//WARNING: one user can appear in multiple user lists - we have to remove
//him from all of them!!!

var UserList = require('userlist.js');

//keeps data about a room
var Room = function(name){
  this.name = name;
  this.users = new UserList();//just add and remove users directly
};

module.exports = Room;
