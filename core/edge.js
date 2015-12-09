function Edge(paramXOne, paramYOne, paramXTwo, paramYTwo) {
  
  this.p = new Vec2(paramXOne, paramYOne);
  this.q = new Vec2(paramXTwo, paramYTwo);
  this.v = this.p.diff(this.q);
  this.n = this.v.normalize();
  
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
  }
};

function connectEdges(edgeArray, first, last) {
  edgeArray[first].connect(edgeArray[last], edgeArray[first + 1]);
  for (var i = first + 1; i < last; i++) {
    edgeArray[i].connect(edgeArray[i - 1], edgeArray[i + 1]);
  }
  edgeArray[last].connect(edgeArray[last - 1], edgeArray[first]);
}