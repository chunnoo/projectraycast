var game = new Core("canvas", true);

game.init = function() {
  this.edges = [
    new Edge(0, 100, 100*Math.cos(Math.PI/10), 100*Math.sin(Math.PI/10)),
    new Edge(100*Math.cos(Math.PI/10), 100*Math.sin(Math.PI/10), 100*Math.cos(-3*Math.PI/10), 100*Math.sin(-3*Math.PI/10)),
    new Edge(100*Math.cos(-3*Math.PI/10), 100*Math.sin(-3*Math.PI/10), 100*Math.cos(-7*Math.PI/10), 100*Math.sin(-7*Math.PI/10)),
    new Edge(100*Math.cos(-7*Math.PI/10), 100*Math.sin(-7*Math.PI/10), 100*Math.cos(-11*Math.PI/10), 100*Math.sin(-11*Math.PI/10)),
    new Edge(100*Math.cos(-11*Math.PI/10), 100*Math.sin(-11*Math.PI/10), 0, 100),
    new Edge(100, 100, 100, 200),
    new Edge(100, 200, 200, 200),
    new Edge(200, 200, 200, 100),
    new Edge(200, 100, 100, 100),
    new Edge(-256, -256, 256, -256),
    new Edge(256, -256, 256, 256),
    new Edge(256, 256, -256, 256),
    new Edge(-256, 256, -256, -256)];
  
  this.objects = {
    testRay: new Ray(0, 0, 0, 0),
    testLight: new Light(0, 0, 0, 0)
  };
  
  connectEdges(this.edges, 0, 4);
  connectEdges(this.edges, 5, 8);
  connectEdges(this.edges, 9, 12);
  
};

game.draw = function() {
  
  this.context.strokeStyle = "#fff";
  
  this.objects.testRay.updateV(this.mouse.x - this.objects.testRay.p.x, this.mouse.y - this.objects.testRay.p.y);
  
  this.context.beginPath();
  this.context.moveTo(this.objects.testRay.p.x, this.objects.testRay.p.y);
  this.context.lineTo(this.objects.testRay.p.x + this.objects.testRay.v.x, this.objects.testRay.p.y + this.objects.testRay.v.y);
  this.context.stroke();
  
  var collisionPoints = this.objects.testRay.edgeArrayCollision(this.edges);
  
  for (var i = 0; i < collisionPoints.length; i++) {
    this.context.beginPath();
    this.context.arc(collisionPoints[i].x, collisionPoints[i].y, 10, 0, Math.PI*2, false);
    this.context.stroke();
  }
  
  this.objects.testLight.updateP(this.mouse.x, this.mouse.y);
  this.objects.testLight.edgeArrayCollision(this.edges);
  
  if (this.objects.testLight.points.length > 0) {
    this.context.beginPath();
      this.context.moveTo(this.objects.testLight.points[0].x, this.objects.testLight.points[0].y);
    for (var i = 1; i < this.objects.testLight.points.length; i++) {
      this.context.lineTo(this.objects.testLight.points[i].x, this.objects.testLight.points[i].y);
    }
    this.context.fillStyle = "rgba(64,64,64, 0.5)"
    this.context.fill();
  }
  
  if (this.showEdges) {
    for (var i = 0; i < this.objects.testLight.points.length; i++) {
      this.context.beginPath();
      this.context.arc(this.objects.testLight.points[i].x, this.objects.testLight.points[i].y, 5, 0, Math.PI*2, false);
      this.context.stroke();
    }
  }

};

game.clearFrame = function() {
  this.context.fillStyle = "rgba(32,32,32,1)";
  this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  this.context.fillStyle = "#000";
};

game.leftMouseDown = function() {
  this.objects.testRay.updateP(this.mouse.x, this.mouse.y);
}

game.keypress = function(charCode) {
  if (charCode == 116 || charCode == 84) {
    this.showEdges = !this.showEdges;
  }
}


