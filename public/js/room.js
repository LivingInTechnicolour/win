function GameCanvas(args) {
    this.width = args.width || 1000;
    this.height = args.height || 500;
    this.refreshRate = args.refreshRate || 300;

    var canvas = document.getElementById(args.canvasId);
    console.log(canvas);
    this.context = canvas.getContext('2d');
    //this.$canvas.height = this.height;
    //this.$canvas.width = this.width;

    this.tileSetImg = new Image();
    this.tileSetImg.src = '/img/chara.png';
    this.currentImg = 0;
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

	if(this.currentImg == 1) {
	    this.currentImg = 0;
	} else {
	    this.currentImg = 1;
	}
	this.update();
    },

    update: function() {
	
	this.context.drawImage(this.tileSetImg, 640+32*this.currentImg, 96, 32, 32, 500, 250, 32, 32);
	// Fetch game state from the server here
	// Update state based on input
	// Send updated state back to server
    },
    
    keyDown: function(evt) {
	switch(evt.keyCode) {
	case 38:
	    console.log('UP');
	    break;
	case 40:
	    console.log('DOWN');
	    break;
	case 37:
	    console.log('LEFT');
	    break;
	case 39:
	    console.log('RIGHT');
	    break;
	}
    }
}
