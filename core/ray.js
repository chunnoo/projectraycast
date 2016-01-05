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
  circularNearestCollisionDist: function(point, radius) {
    
    var a = this.v.x*this.v.x + this.v.y*this.v.y;
    
    var b = 2*(this.v.x*(this.p.x - point.x) + this.v.y*(this.p.y - point.y));
    
    var c = this.p.x*this.p.x + this.p.y*this.p.y + point.x*point.x + point.y*point.y - radius*radius - 2*(this.p.x*point.x + this.p.y*point.y);
    
    if (4*a*c > b*b) {
      return false;
    } else {
      var t1 = (-b + Math.sqrt(b*b - 4*a*c))/(2*a);
      var t2 = (-b - Math.sqrt(b*b - 4*a*c))/(2*a);
    }
    
    if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
      return Math.min(t1, t2);
    } else if (t1 >= 0 && t1 <= 1) {
      return t1;
    } else if (t2 >= 0 && t2 <= 1) {
      return t2;
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
    
      //check for colisions within radius of edgeArray[i].p
      
      for (var i = 0; i < edgeArray.length; i++) {
        if (!edgeArray[i].inverted) {
        
          var currentCollisionDist = this.circularNearestCollisionDist(edgeArray[i].p, radius);
          
          if (currentCollisionDist && (currentCollisionDist < nearest || !nearest)) {
            nearest = currentCollisionDist;
            nearestIndex = i;
          }
          
        }
      }
      
      if (nearest) {
        var tempReturnVec2 = new Vec2(this.p.x + this.v.x*nearest - edgeArray[nearestIndex].p.x, this.p.y + this.v.y*nearest - edgeArray[nearestIndex].p.y);
        return tempReturnVec2.unit();
      } else {
        return false;
      }
      
    }
  }
};








