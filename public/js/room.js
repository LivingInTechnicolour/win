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

    this.map = args.map;

    this.loadMap(args.map);
    this.background = new Image();
    this.background.src = '/img/map.png';

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
    },
    
    draw: function() {
	this.context.drawImage(this.background, 0, 0);
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
    },

    loadMap: function(map) {
	for(y in map) {
	    for(x in map[y]) {
		var x_pos = x*32;
		var y_pos = y*32;
		var rect = new CollisionRect({'x': x_pos, 'y': y_pos, 'width': 32, 'height': 32, 'visible': true});
		if(map[y][x] == 1) {
		    this.player.collideables.push(rect);
		}
		if(map[y][x] == 2) {
		    var location = {};
		    location.x = 300;
		    location.y = 400;
		    var tele = new Teleporter({'map': in_map, 
					       'room': 'building1', 
					       'rect': rect, 
					       'game': this, 
					       'img':'/img/mapin1.png',
					       'location': location});
		    this.player.teleporters.push(tele);
		}
		if(map[y][x] == 3) {
		    var location = {};
		    location.x = 500;
		    location.y = 250;
		    var tele = new Teleporter({'map': home_map, 
					       'room': 'home', 
					       'rect': rect, 
					       'game': this, 
					       'img':'/img/map.png',
					       'location': location});
		    this.player.teleporters.push(tele);
		}
	    }
	}
    },

    changeRoom: function(name, map, img) {
	this.player.collideables = [];
	this.player.teleporters = [];
	this.map = map;
	this.loadMap(map);
	this.room_name = name;
	this.background = img;
	now.joinRoom(name);
    }
}
