function Light(paramSourceX, paramSourceY) {

  this.source = new Vec2(paramSourceX, paramSourceY);
  
  this.points = [];
  
}

Light.prototype = {
  edgeArrayCollision: function(edgeArray) {
  
    var tempEdgePointArray = [];
    
    for (var i = 0; i < edgeArray.length; i++) {
      if (this.source.diff(edgeArray[i].p).dot(edgeArray[i].n) < 0) {
        tempEdgePointArray.push(i);
        tempEdgePointArray.push(-i - 1);
      }
    }
    
    var tempSortingFunction = function(edgeArr) {
      return function(a, b) {
        var aDiff;
        var bDiff;
        if (a < 0) {
          aDiff = Math.atan2(edgeArr[-a - 1].q.x - this.source.x, edgeArr[-a - 1].q.y - this.source.y);
        } else {
          aDiff = Math.atan2(edgeArr[a].p.x - this.source.x, edgeArr[a].p.y - this.source.y);
        }
        if (b < 0) {
          bDiff = Math.atan2(edgeArr[-b - 1].q.x - this.source.x, edgeArr[-b - 1].q.y - this.source.y);
        } else {
          bDiff = Math.atan2(edgeArr[b].p.x - this.source.x, edgeArr[b].p.y - this.source.y);
        }
        return aDiff - bDiff;
      };
    };
    
    tempEdgePointArray.sort(tempSortingFunction(edgeArray).bind(this));
    
    //cast ray away from source, when collision, push this point
    //cast ray towards source, if collision, don't push this point
    var tempRay = new Ray(this.source.x, this.source.y, 1, 0, true);
    var tempPoint;
    var tempDist;
    var currentCollisionDist;
    var shortestDist;
    var shortestDistVec;
    var tempConnected = false;
    
    for (var i = 0; i < tempEdgePointArray.length; i++) {
      
      shortestDist = false;
      tempConnected = false;
    
      //Q case
      if (tempEdgePointArray[i] < 0) {
        tempPoint = edgeArray[-tempEdgePointArray[i] - 1].q;
        tempRay.updateV(this.source.diff(tempPoint).x, this.source.diff(tempPoint).y);
        tempDist = this.source.diff(tempPoint).length();
        
        //Testing if connected normal points toward light source
        tempConnected = (this.source.diff(edgeArray[-tempEdgePointArray[i] - 1].q).dot(edgeArray[-tempEdgePointArray[i] - 1].connectedAtQ) < 0);
      
      //P case
      } else {
        tempPoint = edgeArray[tempEdgePointArray[i]].p;
        tempRay.updateV(this.source.diff(tempPoint).x, this.source.diff(tempPoint).y);
        tempDist = this.source.diff(tempPoint).length();
        
        //Testing if connected normal points towards light source
        tempConnected = (this.source.diff(edgeArray[tempEdgePointArray[i]].p).dot(edgeArray[tempEdgePointArray[i]].connectedAtP) < 0);
      }
      
      for (var j = 0; j < tempEdgePointArray.length; j++) {
      
        if (tempEdgePointArray[j] != tempEdgePointArray[i] && tempEdgePointArray[j] != -tempEdgePointArray[i] - 1) {
        
          //Q case
          if (tempEdgePointArray[j] < 0) {
            currentCollisionDist = tempRay.edgeCollisionDist(edgeArray[-tempEdgePointArray[j] - 1]);
          
          //P case
          } else {
            currentCollisionDist = tempRay.edgeCollisionDist(edgeArray[tempEdgePointArray[j]]);
          }
          
          if (currentCollisionDist < tempDist /*this should instead be checking if the edges are connected*/ - 0.1  && currentCollisionDist > 0) {
            /*tempEdgePointArray.splice(j, 1);
            j--;
            if (i >= j) {
              i--;
            }*/
            shortestDist = -1;
            break;
          } else if (!tempConnected && currentCollisionDist > 0) {
            if (currentCollisionDist < shortestDist || !shortestDist) {
              shortestDist = currentCollisionDist;
              shortestDistVec = new Vec2(tempRay.v.x, tempRay.v.y);
            }
          } else if (tempConnected && currentCollisionDist > 0) {
            shortestDist = tempDist;
            shortestDistVec = new Vec2(tempRay.v.x, tempRay.v.y);
          }
        }
      }
      if (shortestDist > 0) {
        if (tempEdgePointArray[i] < 0) {
          this.points.push(new Vec2(shortestDistVec.x*shortestDist + tempRay.p.x, shortestDistVec.y*shortestDist + tempRay.p.y));
          this.points.push(tempPoint);
        } else {
          this.points.push(tempPoint);
          this.points.push(new Vec2(shortestDistVec.x*shortestDist + tempRay.p.x, shortestDistVec.y*shortestDist + tempRay.p.y));
        }
      }
    }
    
    /*for (var i = 0; i < edgeArray.length; i++) {
      if (this.source.diff(edgeArray[i].p).dot(edgeArray[i].n) < 0) {
        this.points.push(edgeArray[i].p);
        this.points.push(edgeArray[i].q);
      }
    }*/
    
    /*this.points.sort(function(a, b) {
      return Math.atan2(a.x - this.source.x, a.y - this.source.y) - Math.atan2(b.x - this.source.x, b.y - this.source.y);
    }.bind(this));*/
    
  },
  updateP: function(paramX, paramY) {
    this.source = new Vec2(paramX, paramY);
    this.points.length = 0;
  }
  
};
