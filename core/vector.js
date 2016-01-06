function Vec2(paramX, paramY) {
  
  this.x = paramX;
  this.y = paramY;
  
}

Vec2.prototype = {
  length: function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  },
  normalize: function() {
    var l = this.length();
    if (l <= 0) {
      return new Vec2(0, 0);
    }
    return new Vec2(this.x / l, this.y / l);
  },
  normal: function() {
    var u = this.normalize();
    return new Vec2(-u.y, u.x);
  },
  diff: function(paramVec) {
    return new Vec2(paramVec.x - this.x, paramVec.y - this.y);
  },
  dot: function(v) {
    return this.x*v.x + this.y*v.y;
  }
};