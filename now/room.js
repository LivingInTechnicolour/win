//WARNING: one user can appear in multiple user lists - we have to remove
//him from all of them!!!

var UserList = require(__dirname+'/userlist.js');

//keeps data about a room
var Room = function(name){
  this.name = name;
  this.users = new UserList();//just add and remove users directly
};

Room.prototype = {
  updateState: function(cid, state) {
	  if(this.users.by_cid[cid]) {
	    this.users.by_cid[cid].update(state);
    }
  },

  getState: function() {
	  return this.users.getState();
  },

  quit: function(user) {
    //TODO: destroy this room if it now empty!
  }
};

module.exports = Room;
