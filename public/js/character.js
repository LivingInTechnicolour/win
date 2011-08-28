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

    this.keyState = {
	'UP': 0,
	'DOWN': 0,
	'LEFT': 0,
	'RIGHT': 0
    };
    this.name = undefined;
    this.rect = new CollisionRect({'x': this.x, 'y': this.y, 'width': 32, 'height': 32, 'visible': true}); 
    this.collideables = args.collideables || [];
    this.teleporters = args.teleporters || [];
    this.drawCollideables = false;
}

Character.prototype = {
    move: function() {
	if(this.collideables.length != 0) {
	    for(object in this.collideables) {
		var x = this.x + this.dx;
		var y = this.y + this.dy;
		var obj = this.collideables[object];
		if(obj.isColliding(new CollisionRect({'x': x, 'y': this.y, 'width': 32, 'height': 32, 'visible': false}))) {
		    this.dx = 0;
		}
		if(obj.isColliding(new CollisionRect({'x': this.x, 'y': y, 'width': 32, 'height': 32, 'visible': false}))) {
		    this.dy = 0;
		}
	    }
	}
	this.x += this.dx;
	this.y += this.dy;
	this.rect.x += this.dx;
	this.rect.y += this.dy;
    },

    getState: function() {
	return {
	    'x': this.x,
	    'y': this.y,
	    'avatarIndex': this.avatarIndex,
	    'facing': this.facing,
	    'currentAnimIndex': this.currentAnimIndex
	};
    },

    setName: function(name) {
	this.name = name;
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
	
	for(t in this.teleporters) {
	    if(!this.teleporters[t].action) {
		if(this.rect.isColliding(this.teleporters[t].rect)) {
		    this.teleporters[t].teleport();
		}
	    }
	}
    },
    
    draw: function(context) {
	if(this.drawCollideables) {
	    for(i in this.collideables) {
		this.collideables[i].draw(context);
	    }
	}
	//for(i in this.teleporters) {
	    //this.teleporters[i].draw(context);
	//}
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
      return false;
	    break;
	case 40:
	    this.keyState.DOWN = 1;
      return false;
	    break;
	case 37:
	    this.keyState.LEFT = 1;
      return false;
	    break;
	case 39:
	    this.keyState.RIGHT = 1;
      return false;
	    break;
	}
      return true;
    },

    keyUp: function(evt) {
      switch(evt.keyCode) {
      case 38:
          this.keyState.UP = 0;
          return false;
          break;
      case 40:
          this.keyState.DOWN = 0;
          return false;
          break;
      case 37:
          this.keyState.LEFT = 0;
          return false;
          break;
      case 39:
          this.keyState.RIGHT = 0;
          return false;
          break;
      }
      return true;
    }

}

