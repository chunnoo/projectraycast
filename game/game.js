function Game() {

  this.updateRate = 0;
  this.gameTime = 0;
  
  this.player = {
    pos: new Vec2(0, 0),
    vel: new Vec2(0, 0),
    acc: new Vec2(0, 0)};
  
  this.playerDestination = false;
  
  this.keyboardMovement = false;
  
  this.movementS = 2.0;
  
  this.movementK = 0.01;
  this.movementD = 0.1;
  
}

Game.prototype = {
  update: function() {
  
    this.gameTime += this.updateRate;
  
    this.player.pos.x += this.player.vel.x*this.updateRate;
    this.player.pos.y += this.player.vel.y*this.updateRate;
    this.player.vel.x += this.player.acc.x*this.updateRate;
    this.player.vel.y += this.player.acc.y*this.updateRate;
    
    if (this.playerDestination) {
    
      var distToDest = Math.sqrt(Math.pow(this.playerDestination.x - this.player.pos.x, 2) + Math.pow(this.playerDestination.y - this.player.pos.y, 2));
      
      this.player.acc.x = this.movementK*(this.playerDestination.x - this.player.pos.x) - this.movementD*this.player.vel.x*Math.abs(this.player.vel.x);
      this.player.acc.y = this.movementK*(this.playerDestination.y - this.player.pos.y) - this.movementD*this.player.vel.y*Math.abs(this.player.vel.y);
      
    } else if (this.keyboardMovement) {
    
      this.player.acc.x = this.movementS*(this.keyboardMovement.x) - this.movementD*this.player.vel.x*Math.abs(this.player.vel.x);
      this.player.acc.y = this.movementS*(this.keyboardMovement.y) - this.movementD*this.player.vel.y*Math.abs(this.player.vel.y);
      
    } else {
    
      this.player.acc.x = -this.movementD*this.player.vel.x*Math.abs(this.player.vel.x);
      this.player.acc.y = -this.movementD*this.player.vel.y*Math.abs(this.player.vel.y);
    
    }
    
  },
  leftMouseDown: function(paramX, paramY) {
    this.playerDestination = new Vec2(paramX, paramY);
  },
  keypress: function(x, y) {
  
    this.playerDestination = false;
    
    if (this.keyboardMovement) {
    
      if (this.keyboardMovement.x != 0) {
        this.keyboardMovement.x = this.keyboardMovement.x/Math.abs(this.keyboardMovement.x) + x;
      } else {
        this.keyboardMovement.x = x;
      }
      
      if (this.keyboardMovement.y != 0) {
        this.keyboardMovement.y = this.keyboardMovement.y/Math.abs(this.keyboardMovement.y) + y;
      } else {
        this.keyboardMovement.y = y;
      }
      
      if (this.keyboardMovement.x != 0 && this.keyboardMovement.y != 0) {
        this.keyboardMovement = this.keyboardMovement.unit();
      }
      
    } else {
      this.keyboardMovement = new Vec2(x, y);
    }
  },
  keyup: function(x, y) {
    if (this.keyboardMovement) {
    
      if (this.keyboardMovement.x != 0) {
        this.keyboardMovement.x = this.keyboardMovement.x/Math.abs(this.keyboardMovement.x) - x;
      }
      if (this.keyboardMovement.y != 0) {
        this.keyboardMovement.y = this.keyboardMovement.y/Math.abs(this.keyboardMovement.y) - y;
      }
      
      if (this.keyboardMovement.x == 0 && this.keyboardMovement.y == 0) {
        this.keyboardMovement = false;
      } else {
        this.keyboardMovement = this.keyboardMovement.unit();
      }
      
    }
    
  }
}



