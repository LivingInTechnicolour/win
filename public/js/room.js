function GameCanvas(args) {
    this.width = args.width || 1000;
    this.height = args.height || 500;
    this.refreshRate = args.refreshRate || 50;

    var canvas = document.getElementById(args.canvasId);

    this.context = canvas.getContext('2d');

    this.player = new Character({'x':500, 'y':250, 'avatarIndex':20});

    this.lastUpdate = new Date().getTime();
    
    this.state = undefined;

    this.room_name = undefined;
    
    this.avImg = new Image();
    this.avImg.src = '/img/chara.png';

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
    
    setRoomState: function(room_name, char_name, state) {
	this.room_name = room_name;
	if(this.player.name == undefined) {
	    this.player.setName(char_name);
	}
	this.state = state;
    },
    
    gameLoop: function() {
	setTimeout(jQuery.proxy(this.gameLoop, this), this.refreshRate);
	var time = new Date().getTime() - this.lastUpdate;
	this.update(time);

	if(this.player.name) {
	    now.updateState(this.player.name, this.player.getState());
	}

	this.clear();
	this.draw();
    },

    update: function(time) {
	this.player.update(time);
	this.lastUpdate = new Date().getTime();
	console.log(this.player.name);
    },
    
    draw: function() {
	if(this.state) {
	    for(user in this.state) {
		var state = this.state[user];
		if(user != this.player.name) {
		    this.context.drawImage(this.avImg,
					   state.avatarIndex*32 + state.currentAnimIndex*32, 
					   state.facing*32,
					   32, 32, 
					   state.x, 
					   state.y, 
					   32, 32);
		}
	    }
	}
	this.player.draw(this.context);
    },

    keyDown: function(evt) {
	return this.player.keyDown(evt);
    },

    keyUp: function(evt) {
	return this.player.keyUp(evt);
    }
}
