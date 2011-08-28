function CollisionRect(args) {
    this.x = args.x;
    this.y = args.y;
    this.width = args.width;
    this.height = args.height;
    this.visible = args.visible;
    this.texture = args.texture || null;
    this.topLeft = {'x': this.x, 'y': this.y};
    this.topRight = {'x': (this.x + this.width), 'y': this.y};
    this.bottomLeft = {'x': this.x, 'y': (this.y + this.height)};
    this.bottomRight = {'x': (this.x + this.width), 'y': (this.y + this.height)};
}

CollisionRect.prototype = {
    isColliding: function(rect) {
	if(rect.x >= this.x && rect.x <= (this.x + this.width)) {
	    if(rect.y >= this.y && rect.y <= (this.y + this.height)) {
		return true;
	    }
	}
	if(rect.bottomRight.x >= this.x && rect.bottomRight.x <= (this.x + this.width)) {
	    if(rect.bottomRight.y >= this.y && rect.bottomRight.y <= (this.y + this.height)) {
		return true;
	    }
	}
	if(rect.topRight.x >= this.x && rect.topRight.x <= (this.x + this.width)) {
	    if(rect.topRight.y >= this.y && rect.topRight.y <= (this.y + this.height)) {
		return true;
	    }
	}
	if(rect.bottomLeft.x >= this.x && rect.bottomLeft.x <= (this.x + this.width)) {
	    if(rect.bottomLeft.y >= this.y && rect.bottomLeft.y <= (this.y + this.height)) {
		return true;
	    }
	}
	return false;
    },

    draw: function(context) {
	if(this.visible) {
	    if(this.texture) {
		context.drawImage(this.texture, this.x, this.y);
	    } else {
		context.fillStyle = "rgb(0,0,255)";
		context.fillRect(this.x, this.y, this.width, this.height);
	    }
	}
    }
};