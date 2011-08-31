function Teleporter(args) {
    this.map = args.map;
    this.room = args.room;
    this.rect = args.rect;
    this.game = args.game;
    this.img = new Image();
    this.img.src = args.img;
    this.location = {};
    this.location.x = args.location.x;
    this.location.y = args.location.y;
    this.action = false;
    this.showDialog = args.showDialog || true;
}

Teleporter.prototype = {
    teleport: function() {
	this.action = true;
	var cb = function() {
	    this.game.changeRoom(this.room, this.map, this.img);
	    this.game.player.x = this.location.x;
	    this.game.player.y = this.location.y;
	    this.game.player.rect.x = this.location.x;
	    this.game.player.rect.y = this.location.y;
	    this.action = false;
	}
	if(this.showDialog) {
	    chooseroom(this.room, $.proxy(cb, this));
	} else {
	    cb();
	}
    },

    draw: function(context) {
	this.rect.draw(context);
    }
}