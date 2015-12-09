function Object(pathArray) {
  
  this.numPoints = pathArray.length / 2;
  this.path = [{}];
  
  this.transformMatrix = new Matrix();
  this.posX = 0;
  this.posY = 0;
  this.velX = 0;
  this.velY = 0;
  this.accX = 0;
  this.accY = 0;
  this.angle = 0;
  this.angleVel = 0;
  this.angleAcc = 0;
  this.skewX = 0;
  this.skewY = 0;
  this.scaleX = 1;
  this.scaleY = 1;
  
  this.stroke = "#fff";
  this.fill = false;
  
  
  for (i=0; i<this.numPoints; i++) {
    this.path[i] = {x: pathArray[i*2], y: pathArray[i*2 + 1]};
  }
  
}

Object.prototype = {
  transform: function() {
    this.transformMatrix.reset();
    this.transformMatrix.translate(this.posX, this.posY);
    this.transformMatrix.scale(this.scaleX, this.scaleY);
    this.transformMatrix.skew(this.skewX, this.skewY);
    this.transformMatrix.rotate(this.angle);
  },
  update: function(fc) {
    this.velX += this.accX;
    this.velY += this.accY;
    this.posX += this.velX;
    this.posY += this.velY;
    this.angleVel += this.angleAcc;
    this.angle += this.angleVel;
    
    this.transform();
    this.draw(fc);
  },
  draw: function(fc) {
  
    fc.context.save();
    fc.context.transform(
      this.transformMatrix.m[0][0], this.transformMatrix.m[0][1],
      this.transformMatrix.m[1][0], this.transformMatrix.m[1][1],
      this.transformMatrix.m[2][0], this.transformMatrix.m[2][1]);
    
    fc.context.beginPath();
    fc.context.moveTo(this.path[0].x, this.path[0].y);
    for (var i=1; i<this.numPoints; i++) {
      fc.context.lineTo(this.path[i].x, this.path[i].y);
    }
    fc.context.closePath();
    if (this.fill) {
      fc.context.fillStyle = this.fill;
      fc.context.fill();
    } else if (this.stroke) {
      fc.context.strokeStyle = this.stroke;
      fc.context.stroke();
    } else {
      fc.context.stroke();
    }
    
    fc.context.restore();
    
  },
  setPos: function(x, y) {
    this.posX = x;
    this.posY = y;
  },
  setVel: function(x, y) {
    this.velX = x;
    this.velY = y;
  },
  setAcc: function(x, y) {
    this.accX = x;
    this.accY = y;
  },
  setAngle: function(a) {
    this.angle = a;
  },
  setAngleVel: function(a) {
    this.angleVel = a;
  },
  setAngleAcc: function(a) {
    this.angleAcc = a;
  },
  setSkew: function(x, y) {
    this.skewX = x;
    this.skewY = y;
  },
  setScale: function(x, y) {
    this.scaleX = x;
    this.scaleY = y;
  }
};

function generatePolygon(sides, radius) {
  var points = [];
  
  for (var i=0; i<sides; i++) {
    points[i*2] = Math.cos(Math.PI*2*(i/sides))*radius;
    points[i*2 + 1] = Math.sin(Math.PI*2*(i/sides))*radius;
  }

  return new Object(points);
  
}