function GameCanvas(args) {
    this.width = args.width || 1000;
    this.height = args.height || 500;
    this.refreshRate = args.refreshRate || 50;

    var canvas = document.getElementById(args.canvasId);

    this.context = canvas.getContext('2d');

    this.player = new Character({'x':500, 'y':250, 'avatarIndex':20});

    this.lastUpdate = new Date().getTime();

    $(document).keyup($.proxy(this.keyUp, this));
    $(document).keydown($.proxy(this.keyDown, this));
}

GameCanvas.prototype = {
    clear: function() {
	this.context.fillStyle = '#000';
	this.context.beginPath();
	this.context.rect(0, 0, this.width, this.height);
	this.context.closePath();
	this.context.fill();
    },

    gameLoop: function() {
	setTimeout(jQuery.proxy(this.gameLoop, this), this.refreshRate);
	var time = new Date().getTime() - this.lastUpdate;
	this.update(time);
	this.clear();
	this.draw();
    },

    update: function(time) {
	console.log("Time " + time);
	this.player.update(time);
	this.lastUpdate = new Date().getTime();
    },
    
    draw: function() {
	this.player.draw(this.context);
    },

    keyDown: function(evt) {
	return this.player.keyDown(evt);
    },

    keyUp: function(evt) {
	return this.player.keyUp(evt);
    }
}
