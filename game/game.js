function Game() {

  this.updateRate = 0;
  this.gameTime = 0;
  
  this.player = {
    pos: new Vec2(0, 0),
    vel: new Vec2(0, 0),
    acc: new Vec2(0, 0)};
  
  this.movementRay = new Ray(this.player.pos.x, this.player.pos.y, this.player.vel.x, this.player.vel.y, false);
  
  this.playerDestination = false;
  
  this.keyboardMovement = new Vec2(0, 0);
  this.movementS = 2.0;
  this.keyDir = [
    new Vec2(-1, 0),
    new Vec2(0, -1),
    new Vec2(1, 0),
    new Vec2(0, 1)];
  this.keyStates = [
    false,
    false,
    false,
    false];
  
  this.movementK = 0.02;
  
  this.movementD = 0.1;
  
}

Game.prototype = {
  update: function(edgeArray) {
  
    this.gameTime += this.updateRate;
    
    this.playerCollision(edgeArray);
    
    this.player.vel.x += this.player.acc.x*this.updateRate;
    this.player.vel.y += this.player.acc.y*this.updateRate;
    
    this.player.pos.x += this.player.vel.x*this.updateRate;
    this.player.pos.y += this.player.vel.y*this.updateRate;
    
    this.player.acc.x = 0;
    this.player.acc.y = 0;
    
    var movementDrag = this.movementD*Math.pow(this.player.vel.length(), 2);
    this.player.acc.x -= movementDrag*this.player.vel.unit().x;
    this.player.acc.y -= movementDrag*this.player.vel.unit().y;
    
    if (this.playerDestination) {
      
      var toDest = new Vec2(this.playerDestination.x - this.player.pos.x, this.playerDestination.y - this.player.pos.y);
      
      this.player.acc.x += this.movementK*toDest.length()*toDest.unit().x;
      this.player.acc.y += this.movementK*toDest.length()*toDest.unit().y;
      
    }
    
    this.player.acc.x += this.movementS*this.keyboardMovement.unit().x;
    this.player.acc.y += this.movementS*this.keyboardMovement.unit().y;
    
  },
  playerCollision: function(edgeArray) {
  
    this.movementRay.updateP(this.player.pos.x, this.player.pos.y);
    this.movementRay.updateV(this.player.vel.x*this.updateRate + this.player.acc.x*this.updateRate, this.player.vel.y*this.updateRate + this.player.acc.y*this.updateRate);
    
    var collisionNormal = this.movementRay.nearestEdgeArrayCollision(edgeArray);
    
    if (collisionNormal) {
    
      this.playerDestination = false;
    
      var normalVeldot = collisionNormal.dot(this.movementRay.v);
      this.player.acc.x -= 2*normalVeldot*collisionNormal.x;// + (this.player.vel.x*this.updateRate + this.player.acc.x*this.updateRate);
      this.player.acc.y -= 2*normalVeldot*collisionNormal.y;// + (this.player.vel.y*this.updateRate + this.player.acc.y*this.updateRate);
    }
    
  },
  leftMouseDown: function(paramX, paramY) {
    this.playerDestination = new Vec2(paramX, paramY);
  },
  keydown: function(key) {
  
    this.playerDestination = false;
    
    if (!this.keyStates[key]) {
      this.keyStates[key] = true;
      this.keyboardMovement.x += this.keyDir[key].x;
      this.keyboardMovement.y += this.keyDir[key].y;
    }
    
  },
  keyup: function(key) {
    
    this.keyStates[key] = false;
    this.keyboardMovement.x -= this.keyDir[key].x;
    this.keyboardMovement.y -= this.keyDir[key].y;
    
  }
}



