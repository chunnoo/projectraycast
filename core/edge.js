function Edge(paramXOne, paramYOne, paramXTwo, paramYTwo) {
  
  this.p = new Vec2(Math.round(paramXOne), Math.round(paramYOne));
  this.q = new Vec2(Math.round(paramXTwo), Math.round(paramYTwo));
  this.v = this.p.diff(this.q);
  this.n = this.v.normal();
  
  this.inverted = false;
  
  this.connectedAtP = false;
  this.connectedAtQ = false;
  
}

Edge.prototype = {
  invert: function() {
    var tempEdge = new Edge(this.q.x, this.q.y, this.p.x, this.p.y);
    tempEdge.inverted = true;
    return tempEdge;
  },
  connect: function(pEdge, qEdge) {
    this.connectedAtP = new Vec2(pEdge.n.x, pEdge.n.y);
    this.connectedAtQ = new Vec2(qEdge.n.x, qEdge.n.y);
  },
  move: function(paramX, paramY) {
    this.p.x += paramX;
    this.p.y += paramY;
    this.q.x += paramX;
    this.q.y += paramY;
  }
};

function moveEdges(paramX, paramY, edgeArray, first, last) {
  for (var i = first; i <= last; i++) {
    edgeArray[i].move(paramX, paramY);
  }
}

function connectEdges(edgeArray, first, last) {
  edgeArray[first].connect(edgeArray[last], edgeArray[first + 1]);
  for (var i = first + 1; i < last; i++) {
    edgeArray[i].connect(edgeArray[i - 1], edgeArray[i + 1]);
  }
  edgeArray[last].connect(edgeArray[last - 1], edgeArray[first]);
}