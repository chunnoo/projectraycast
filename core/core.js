function include(file) {
  document.write("<script type='text/javascript' src='" + file + "'></script>");
}

function Core(canvasName, fullscreen) {
  
  include("object.js");
  include("matrix.js");
  include("vector.js");
  include("edge.js");
  include("ray.js");
  include("light.js");
  
  this.canvas = document.getElementById(canvasName);
  this.context = this.canvas.getContext("2d");
  
  this.mouse = {
    x: 0,
    y: 0,
    leftButton: false,
    rightButton: false
  };
  
  this.framecount = 0;
  this.focus = true;
  
  this.edges = [];
  this.edgeStyle = "#fff";
  this.showEdges = false;
  
  this.objects = {};
  
  this.canvas.onmousemove = function(e) {
    e.preventDefault;
    this.mouse.x = e.clientX - (this.canvas.width/2);
    this.mouse.y = e.clientY - (this.canvas.height/2);
  }.bind(this);
  this.canvas.ontouchmove = function(e) {
    e.preventDefault();
    this.mouse.x = e.targetTouches[0].pageX - (this.canvas.width/2);
    this.mouse.y = e.targetTouches[0].pageY - (this.canvas.height/2);
  }.bind(this);
  //mouse release
  this.canvas.onmouseup = function(e) {
    this.mouse.x = e.clientX - (this.canvas.width/2);
    this.mouse.y = e.clientY - (this.canvas.height/2);
    this.mouse.leftButton = false;
    if (this.leftMouseUp) {
      this.leftMouseUp();
    }
  }.bind(this);
  this.canvas.onmouseleave = function(e) {
    this.mouse.x = e.clientX - (this.canvas.width/2);
    this.mouse.y = e.clientY - (this.canvas.height/2);
    this.mouse.leftButton = false;
    if (this.leftMouseUp) {
      this.leftMouseUp();
    }
  }.bind(this);
  this.canvas.ontouchend = function(e) {
    e.preventDefault();
    this.mouse.x = e.targetTouches[0].pageX - (this.canvas.width/2);
    this.mouse.y = e.targetTouches[0].pageY - (this.canvas.height/2);
    this.mouse.leftButton = false;
    if (this.leftMouseUp) {
      this.leftMouseUp();
    }
  }.bind(this);
  this.canvas.ontouchleave = function(e) {
    e.preventDefault();
    this.mouse.x = e.targetTouches[0].pageX - (this.canvas.width/2);
    this.mouse.y = e.targetTouches[0].pageY - (this.canvas.height/2);
    this.mouse.leftButton = false;
    if (this.leftMouseUp) {
      this.leftMouseUp();
    }
  }.bind(this);
  this.canvas.ontouchcancel = function(e) {
    e.preventDefault();
    this.mouse.x = e.targetTouches[0].pageX - (this.canvas.width/2);
    this.mouse.y = e.targetTouches[0].pageY - (this.canvas.height/2);
    this.mouse.leftButton = false;
    if (this.leftMouseUp) {
      this.leftMouseUp();
    }
  }.bind(this);
  //mouse press
  this.canvas.onmousedown = function(e) {
    this.mouse.x = e.clientX - (this.canvas.width/2);
    this.mouse.y = e.clientY - (this.canvas.height/2);
    this.mouse.leftButton = true;
    if (this.leftMouseDown) {
      this.leftMouseDown();
    }
  }.bind(this);
  this.canvas.onmouseenter = function(e) {
    this.mouse.x = e.clientX - (this.canvas.width/2);
    this.mouse.y = e.clientY - (this.canvas.height/2);
  }.bind(this);
  this.canvas.ontouchstart = function(e) {
    e.preventDefault();
    this.mouse.x = e.targetTouches[0].pageX - (this.canvas.width/2);
    this.mouse.y = e.targetTouches[0].pageY - (this.canvas.height/2);
    this.mouse.leftButton = true;
    if (this.leftMouseDown) {
      this.leftMouseDown();
    }
  }.bind(this);
  this.canvas.ontouchenter = function(e) {
    e.preventDefault();
    this.mouse.x = e.targetTouches[0].pageX - (this.canvas.width/2);
    this.mouse.y = e.targetTouches[0].pageY - (this.canvas.height/2);
  }.bind(this)
  
  window.addEventListener("keypress", function(e) {
    if (this.keypress) {
      if (e.keyCode) {
        this.keypress(e.keyCode);
      } else {
        this.keypress(e.charCode);
      }
    }
  }.bind(this));
  window.addEventListener("load", function() {
    this.resize();
    this.begin();
  }.bind(this));
  window.addEventListener("blur", function() {
    this.focus = false;
  }.bind(this));
  window.addEventListener("focus", function() {
    this.focus = true;
    requestAnimationFrame(this.coreDraw.bind(this));
  }.bind(this));
  window.addEventListener("resize", function() {
    this.resize();
  }.bind(this));
}

Core.prototype = {
  begin: function() {
    this.init();
    this.sortEdges();
    this.coreDraw();
  },
  drawEdges: function(drawNormals) {
    this.context.beginPath();
    for (var i=0; i<this.edges.length; i++) {
      this.context.moveTo(this.edges[i].p.x, this.edges[i].p.y)
      this.context.lineTo(this.edges[i].q.x, this.edges[i].q.y);
    }
    this.context.strokeStyle = this.edgeStyle;
    this.context.stroke();
    
    if (drawNormals) {
      this.context.beginPath();
      for (var i=0; i<this.edges.length; i++) {
        this.context.moveTo(this.edges[i].p.x + this.edges[i].v.x/2, this.edges[i].p.y + this.edges[i].v.y/2)
        this.context.lineTo(this.edges[i].p.x + this.edges[i].v.x/2 + this.edges[i].n.x*10, this.edges[i].p.y + this.edges[i].v.y/2 + this.edges[i].n.y*10);
      }
      this.context.strokeStyle = this.edgeStyle;
      this.context.stroke();
    }
    
  },
  sortEdges: function() {
    this.edges.sort(function(a,b) {
      return Math.atan2(a.n.x,a.n.y) - Math.atan2(b.n.x,b.n.y);
    });
  },
  coreDraw: function() {
    if (this.focus) {
      if (this.clearFrame) {
        this.clearFrame();
      } else {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      this.context.save();
      this.context.translate(this.canvas.width/2, this.canvas.height/2);
    
      if (this.showEdges) {
        this.drawEdges(true);
      }
      this.draw();
    
      this.context.restore();
      this.framecount += 1;
    
      requestAnimationFrame(this.coreDraw.bind(this));
    }
  },
  resize: function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
};
