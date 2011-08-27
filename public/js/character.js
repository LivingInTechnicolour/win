function Character(args) {
    this.x = args.x;
    this.y = args.y;
    this.dx = 0;
    this.dy = 0;
    this.isMoving;
    this.avatarIndex = args.avatarIndex;
    this.facing = args.facing || 2;
    this.image = new Image();
    this.image.src = '/img/chara.png';
    
    this.animAccumulator = 0;
    this.currentAnimIndex = 0;

    // A giant kludge... because js isn't a language for writing games
    this.keyState = {
	'UP': 0,
	'DOWN': 0,
	'LEFT': 0,
	'RIGHT': 0
    };
}

Character.prototype = {
    move: function() {
	this.x += this.dx;
	this.y += this.dy;
    },

    setDirection: function(direction) {
	switch(direction) {
	case 'UP':
	    this.facing = 0;
	    break;
	case 'RIGHT':
	    this.facing = 1;
	    break;
	case 'DOWN':
	    this.facing = 2;
	    break;
	case 'LEFT':
	    this.facing = 3;
	    break;
	}
    },
    
    update: function(time) {
	this.animAccumulator += time;
	console.log("ACC " + this.animAccumulator);
	if(this.isMoving && this.animAccumulator > 150) {
	    this.currentAnimIndex = !this.currentAnimIndex;
	    this.animAccumulator = 0;
	}

	if(this.keyState.UP == this.keyState.DOWN && 
	   this.keyState.LEFT == this.keyState.RIGHT) {
	    this.isMoving = false;
	}

	this.dx = this.keyState.RIGHT*4 - this.keyState.LEFT*4;
	this.dy = this.keyState.DOWN*4 - this.keyState.UP*4;
	
	if(this.dy < 0) {
	    this.setDirection('UP');
	    this.isMoving = true;
	}
	if(this.dy > 0) {
	    this.setDirection('DOWN');
	    this.isMoving = true;
	}
	if(this.dx > 0) {
	    this.setDirection('RIGHT');
	    this.isMoving = true;
	}
	if(this.dx < 0) {
	    this.setDirection('LEFT');
	    this.isMoving = true;
	}

	this.move();
    },
    
    draw: function(context) {
	context.drawImage(this.image, 
			  this.avatarIndex*32 + this.currentAnimIndex*32, 
			  this.facing*32,
			  32, 32, 
			  this.x, 
			  this.y, 
			  32, 32);
    },

    keyDown: function(evt) {
	switch(evt.keyCode) {
	case 38:
	    this.keyState.UP = 1;
	    break;
	case 40:
	    this.keyState.DOWN = 1;
	    break;
	case 37:
	    this.keyState.LEFT = 1;
	    break;
	case 39:
	    this.keyState.RIGHT = 1;
	    break;
	}
    },

    keyUp: function(evt) {
	switch(evt.keyCode) {
	case 38:
	    this.keyState.UP = 0;
	    break;
	case 40:
	    this.keyState.DOWN = 0;
	    break;
	case 37:
	    this.keyState.LEFT = 0;
	    break;
	case 39:
	    this.keyState.RIGHT = 0;
	    break;
	}
    }

}

