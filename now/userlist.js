//keep track of all users in a few different maps for fast access
//these are just references, so we can modify the user in one map and it'll
//affect every reference to them

var User = require('user.js');

var UserList = function(){
  this.by_cid = {};
  this.by_name = {};
};

UserList.prototype.remove = function(user){
  delete this.by_cid[user.clientId];
  delete this.by_name[user.name];
  user.remove_list(this);
  return user;
};
UserList.prototype.add = function(user){
  this.by_cid[user.clientId] = user;
  this.by_name[user.name] = user;
  user.lists.push(this);
};
UserList.prototype.create = function(cid, name){
  var user = new User(cid, name);
  this.add(user);
  return user;
};

module.exports = UserList;
