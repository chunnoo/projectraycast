function Ball(px, py, vx, vy, radius) {
  
  this.pos = new Vec2(px, py);
  this.vel = new Vec2(vx, vy);
  this.radius = radius;
  
  this.movementRay = new Ray(this.pos.x, this.pos.y, this.vel.x, this.vel.y);
  
}

Ball.prototype = {
  update: function(edgeArray) {
  
    this.collision(edgeArray);
    
    this.updateMovement();
  
  },
  collision: function(edgeArray) {
  
    this.movementRay.updateP(this.pos.x, this.pos.y);
    this.movementRay.updateV(this.vel.x, this.vel.y);
  
    var collisionNormal = this.movementRay.nearestEdgeArrayCollision(edgeArray, this.radius);
    
    if (collisionNormal) {
    
      var normalVeldot = collisionNormal.dot(this.movementRay.v);
      
      this.vel.x -= 2.0*normalVeldot*collisionNormal.x;
      this.vel.y -= 2.0*normalVeldot*collisionNormal.y;
    }
  },
  updateMovement: function() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
}