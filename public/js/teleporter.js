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
}

Teleporter.prototype = {
    teleport: function() {
	this.action = true;
	var cb = function() {
	    game.changeRoom(this.room, this.map, this.img);
	    game.player.x = this.location.x;
	    game.player.y = this.location.y;
	    game.player.rect.x = this.location.x;
	    game.player.rect.y = this.location.y;
	    this.action = false;
	}
	
	chooseroom(this.room, $.proxy(cb, this));
    },

    draw: function(context) {
	this.rect.draw(context);
    }
}