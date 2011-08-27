var Room = require('room.js');

//keeps track of all the rooms
var RoomList = function() {
  this.by_name = {}; //a map of name: Room
};

RoomList.prototype.join_by_name = function(name, user){
  var room;
  
  //create room if it doesn't eixst
  if(this.by_name[name] === undefined){
    room = new Room(name);
    this.by_name[name] = room;
  } else {
    room = this.by_name[name];
  }
  
  this.join(room, user);
};
  
//remember to quite the old one before joining the new one
RoomList.prototype.join = function(room, user){
  room.users.add(user);
  user.room = room;
}

//remove both connections
RoomList.prototype.quit = function(user){
  var room = user.room;
  delete user.room;
  room.users.remove(user);
  //TODO: check if the room is emptry and destroy it
};

module.exports = RoomList;
