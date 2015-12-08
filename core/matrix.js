function Matrix() {
  this.m = [];
  this.reset();
}

Matrix.prototype = {
  reset: function() {
    this.m = [[1,0,0],[0,1,0],[0,0,1]];
  },
  invert: function() {
    var d = 1 / (this.m[0][0] * this.m[1][1] - this.m[0][1] * this.m[1][0]);
    var m00 = this.m[1][1] * d;
    var m01 = -this.m[0][1] * d;
    var m10 = -this.m[1][0] * d;
    var m11 = this.m[0][0] * d;
    var m20 = d * (this.m[1][0] * this.m[2][1] - this.m[1][1] * this.m[2][0]);
    var m21 = d * (this.m[0][1] * this.m[2][0] - this.m[0][0] * this.m[2][1]);
    this.m[0][0] = m00;
    this.m[0][1] = m01;
    this.m[1][0] = m10;
    this.m[1][1] = m11;
    this.m[2][0] = m20;
    this.m[2][1] = m21;
  },
  rotate: function(radians) {
    var c = Math.cos(radians);
    var s = Math.sin(radians);
    var m00 = this.m[0][0] * c + this.m[1][0] * s;
    var m01 = this.m[0][1] * c + this.m[1][1] * s;
    var m10 = this.m[0][0] * -s + this.m[1][0] * c;
    var m11 = this.m[0][1] * -s + this.m[1][1] * c;
    this.m[0][0] = m00;
    this.m[0][1] = m01;
    this.m[1][0] = m10;
    this.m[1][1] = m11;
  },
  scale: function(x, y) {
    this.m[0][0] *= x;
    this.m[0][1] *= x;
    this.m[1][0] *= y;
    this.m[1][1] *= y;
  },
  translate: function(x, y) {
    this.m[2][0] += this.m[0][0] * x + this.m[1][0] * y;
    this.m[2][1] += this.m[0][1] * x + this.m[1][1] * y;
  },
  skew: function(xa, ya) {
    var xt = Math.tan(xa);
    var yt = Math.tan(ya);
    var m00 = this.m[0][0] + this.m[1][0] * yt;
    var m01 = this.m[0][1] + this.m[1][1] * yt;
    var m10 = this.m[0][0] * xt + this.m[1][0];
    var m11 = this.m[0][1] * xt + this.m[1][1];
    this.m[0][0] = m00;
    this.m[0][1] = m01;
    this.m[1][0] = m10;
    this.m[1][1] = m11;
  },
  mMultiply: function(m) {
    return 0;
  },
  vMyltiply: function(x, y, z) {
    return [
      x * this.m[0][0] + y * this.m[1][0] + this.m[2][0],
      x * this.m[0][1] + y * this.m[1][1] + this.m[2][1]];
  }
};





