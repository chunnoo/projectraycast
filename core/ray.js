function Ray(paramPX, paramPY, paramVX, paramVY, paramUnlimited) {
  
  this.p = new Vec2(paramPX, paramPY);
  
  this.unlimited = paramUnlimited;
  
  this.v = new Vec2(paramVX, paramVY);
  
  if (this.unlimited) {
    this.v = this.v.unit();
  }
  
}

Ray.prototype = {
  edgeCollision: function(edge, directionIndependent) {
  
    var t = this.edgeCollisionDist(edge, directionIndependent);
    
    if (t) {
      
      return new Vec2(this.v.x*t + this.p.x, this.v.y*t + this.p.y);
      
    } else {
      return false;
    }
  },
  edgeCollisionDist: function(edge, directionIndependent) {
  
    if (this.v.x*edge.v.y - this.v.y*edge.v.x == 0 || (!directionIndependent && this.v.dot(edge.n) >= 0)) {
    
      return false;
      
    }
    
    var t = ((edge.p.y - this.p.y)*edge.v.x - (edge.p.x - this.p.x)*edge.v.y)/(edge.v.x*this.v.y - this.v.x*edge.v.y);
    var s = ((edge.p.y - this.p.y)*this.v.x - (edge.p.x - this.p.x)*this.v.y)/(edge.v.x*this.v.y - this.v.x*edge.v.y);
    
    if (!this.unlimited && t >= 0 && t <= 1 && s >= 0 && s <= 1) {
      
      return t;
      
    } else if (this.unlimited && s >= 0 && s <= 1) {
    
      return t;
    
    } else {
      return false;
    }
  },
  updateP: function(paramX, paramY) {
    this.p = new Vec2(paramX, paramY);
  },
  updateV: function(paramX, paramY) {
    this.v = new Vec2(paramX, paramY);
  
    if (this.unlimited) {
      this.v = this.v.unit();
    }
  },
  edgeArrayCollision: function(edgeArray) {
    var vec2Array = [];
    for (var i = 0; i < edgeArray.length; i++) {
      if (!edgeArray[i].inverted) {
        var currentCollision = this.edgeCollision(edgeArray[i], false);
        if (currentCollision) {
          vec2Array.push(currentCollision);
        }
      }
    }
    return vec2Array;
  },
  nearestEdgeArrayCollision: function(edgeArray, radius) {
    var nearest;
    var nearestIndex;
    for (var i = 0; i < edgeArray.length; i++) {
      if (!edgeArray[i].inverted) {
        var tempEdge = new Edge(edgeArray[i].p.x + edgeArray[i].n.x*radius, edgeArray[i].p.y + edgeArray[i].n.y*radius, edgeArray[i].q.x + edgeArray[i].n.x*radius, edgeArray[i].q.y + edgeArray[i].n.y*radius);
        
        var currentCollisionDist = this.edgeCollisionDist(tempEdge, false);
        if (currentCollisionDist && (currentCollisionDist < nearest || !nearest)) {
          nearest = currentCollisionDist;
          nearestIndex = i;
        }
      }
    }
    if (nearest) {
      return edgeArray[nearestIndex].n;
    } else {
      return false;
    }
  }
};








