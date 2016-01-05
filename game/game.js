function Game() {

  this.updateRate = 0;
  this.gameTime = 0;
  
  this.player = {
    pos: new Vec2(0, 0),
    vel: new Vec2(0, 0),
    acc: new Vec2(0, 0),
    radius: 25};
  
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
    
    this.movementDrag();
    this.accToDest();
    this.keyboardAcc();
    
    this.playerCollision(edgeArray);
    
    this.updateMovement();
    
    this.player.acc.x = 0;
    this.player.acc.y = 0;
  },
  playerCollision: function(edgeArray) {
  
    this.movementRay.updateP(this.player.pos.x, this.player.pos.y);
    this.movementRay.updateV(this.player.vel.x + this.player.acc.x, this.player.vel.y + this.player.acc.y);
  
    var collisionNormal = this.movementRay.nearestEdgeArrayCollision(edgeArray, this.player.radius);
    
    if (collisionNormal) {
    
      this.playerDestination = false;
    
      var normalVeldot = collisionNormal.dot(this.movementRay.v);
      
      this.player.acc.x -= 1.0*normalVeldot*collisionNormal.x;
      this.player.acc.y -= 1.0*normalVeldot*collisionNormal.y;
    }
    
    //if (this.player.pos.x + this.)
    
  },
  movementDrag: function() {
    var drag = this.movementD*Math.pow(this.player.vel.length(), 2);
    this.player.acc.x -= drag*this.player.vel.unit().x;
    this.player.acc.y -= drag*this.player.vel.unit().y;
  },
  accToDest: function() {
    if (this.playerDestination) {
      
      var toDest = new Vec2(this.playerDestination.x - this.player.pos.x, this.playerDestination.y - this.player.pos.y);
      
      this.player.acc.x += this.movementK*toDest.length()*toDest.unit().x;
      this.player.acc.y += this.movementK*toDest.length()*toDest.unit().y;
      
    }
  },
  keyboardAcc: function () {
    this.player.acc.x += this.movementS*this.keyboardMovement.unit().x;
    this.player.acc.y += this.movementS*this.keyboardMovement.unit().y;
  },
  updateMovement: function() {
    this.player.vel.x += this.player.acc.x;
    this.player.vel.y += this.player.acc.y;
    
    this.player.pos.x += this.player.vel.x;
    this.player.pos.y += this.player.vel.y;
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



