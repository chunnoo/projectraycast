function include(file) {
  document.write("<script type='text/javascript' src='" + file + "'></script>");
}

include("core/object.js");
include("core/matrix.js");
include("core/vector.js");
include("core/edge.js");
include("core/ray.js");
include("core/light.js");
include("core/coregame.js");

function Core(canvasName, paramGame, fullscreen) {
  
  this.canvas = document.getElementById(canvasName);
  this.context = this.canvas.getContext("2d");
  
  this.game = paramGame;
  
  this.screen = new Vec2(0, 0);
  
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
  
  this.lights = [];
  
  this.objects = {};
  
  this.canvas.onmousemove = function(e) {
    e.preventDefault;
    this.mouse.x = e.clientX - (this.canvas.width/2 - this.screen.x);
    this.mouse.y = e.clientY - (this.canvas.height/2 - this.screen.y);
  }.bind(this);
  this.canvas.ontouchmove = function(e) {
    e.preventDefault();
    this.mouse.x = e.targetTouches[0].pageX - (this.canvas.width/2 - this.screen.x);
    this.mouse.y = e.targetTouches[0].pageY - (this.canvas.height/2 - this.screen.y);
  }.bind(this);
  //mouse release
  this.canvas.onmouseup = function(e) {
    this.mouse.x = e.clientX - (this.canvas.width/2 - this.screen.x);
    this.mouse.y = e.clientY - (this.canvas.height/2 - this.screen.y);
    this.mouse.leftButton = false;
    if (this.leftMouseUp) {
      this.leftMouseUp();
    }
  }.bind(this);
  this.canvas.onmouseleave = function(e) {
    this.mouse.x = e.clientX - (this.canvas.width/2 - this.screen.x);
    this.mouse.y = e.clientY - (this.canvas.height/2 - this.screen.y);
    this.mouse.leftButton = false;
    if (this.leftMouseUp) {
      this.leftMouseUp();
    }
  }.bind(this);
  this.canvas.ontouchend = function(e) {
    e.preventDefault();
    this.mouse.x = e.targetTouches[0].pageX - (this.canvas.width/2 - this.screen.x);
    this.mouse.y = e.targetTouches[0].pageY - (this.canvas.height/2 - this.screen.y);
    this.mouse.leftButton = false;
    if (this.leftMouseUp) {
      this.leftMouseUp();
    }
  }.bind(this);
  this.canvas.ontouchleave = function(e) {
    e.preventDefault();
    this.mouse.x = e.targetTouches[0].pageX - (this.canvas.width/2 - this.screen.x);
    this.mouse.y = e.targetTouches[0].pageY - (this.canvas.height/2 - this.screen.y);
    this.mouse.leftButton = false;
    if (this.leftMouseUp) {
      this.leftMouseUp();
    }
  }.bind(this);
  this.canvas.ontouchcancel = function(e) {
    e.preventDefault();
    this.mouse.x = e.targetTouches[0].pageX - (this.canvas.width/2 - this.screen.x);
    this.mouse.y = e.targetTouches[0].pageY - (this.canvas.height/2 - this.screen.y);
    this.mouse.leftButton = false;
    if (this.leftMouseUp) {
      this.leftMouseUp();
    }
  }.bind(this);
  //mouse press
  this.canvas.onmousedown = function(e) {
    this.mouse.x = e.clientX - (this.canvas.width/2 - this.screen.x);
    this.mouse.y = e.clientY - (this.canvas.height/2 - this.screen.y);
    this.mouse.leftButton = true;
    if (this.leftMouseDown) {
      this.leftMouseDown();
    }
  }.bind(this);
  this.canvas.onmouseenter = function(e) {
    this.mouse.x = e.clientX - (this.canvas.width/2 - this.screen.x);
    this.mouse.y = e.clientY - (this.canvas.height/2 - this.screen.y);
  }.bind(this);
  this.canvas.ontouchstart = function(e) {
    e.preventDefault();
    this.mouse.x = e.targetTouches[0].pageX - (this.canvas.width/2 - this.screen.x);
    this.mouse.y = e.targetTouches[0].pageY - (this.canvas.height/2 - this.screen.y);
    this.mouse.leftButton = true;
    if (this.leftMouseDown) {
      this.leftMouseDown();
    }
  }.bind(this);
  this.canvas.ontouchenter = function(e) {
    e.preventDefault();
    this.mouse.x = e.targetTouches[0].pageX - (this.canvas.width/2 - this.screen.x);
    this.mouse.y = e.targetTouches[0].pageY - (this.canvas.height/2 - this.screen.y);
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
  window.addEventListener("keyup", function(e) {
    if (this.keyup) {
      if (e.keyCode) {
        this.keyup(e.keyCode);
      } else {
        this.keyup(e.charCode);
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
  drawLights: function() {
    if (this.lights.length > 0) {
      this.context.fillStyle = this.lights[0].color;
      this.context.fillRect(-this.canvas.width, -this.canvas.height, 2*this.canvas.width, 2*this.canvas.height);
      
      this.context.globalCompositeOperation = "lighter";
      
      for (var i = 1; i < this.lights.length; i++) {
        if (this.lights[i].points.length > 0) {
          this.context.beginPath();
          this.context.moveTo(this.lights[i].points[0].x, this.lights[i].points[0].y);
          for (var j = 1; j < this.lights[i].points.length; j++) {
            this.context.lineTo(this.lights[i].points[j].x, this.lights[i].points[j].y);
          }
          this.context.closePath();
          this.context.fillStyle = this.lights[i].color;
          this.context.fill();
        }
      }
      
      this.context.globalCompositeOperation = "destination-atop";
      
      if (this.lights[0].points.length > 0) {
        this.context.beginPath();
        this.context.moveTo(this.lights[0].points[0].x, this.lights[0].points[0].y);
        for (var i = 1; i < this.lights[0].points.length; i++) {
          this.context.lineTo(this.lights[0].points[i].x, this.lights[0].points[i].y);
        }
        this.context.closePath();
        this.context.fillStyle = this.lights[0].color;
        this.context.fill();
      }
      
      this.context.globalCompositeOperation = "source-over";
      
      this.context.strokeStyle = "#fff";
      
      if (this.showEdges) {
        for (var i = 0; i < this.lights.length; i++) {
          for (var j = 0; j < this.lights[i].points.length; j++) {
            this.context.beginPath();
            this.context.arc(this.lights[i].points[j].x, this.lights[i].points[j].y, 5, 0, Math.PI*2, false);
            this.context.stroke();
          }
        }
      }
      
    }
  },
  drawEdges: function(drawNormals) {
  
    this.context.globalCompositeOperation = "source-over";
  
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
      this.context.translate(this.canvas.width/2 - this.screen.x, this.canvas.height/2 - this.screen.y);
    
      this.game.update();
      this.screen = this.game.player.pos;
    
      this.drawLights();
      this.draw();
      if (this.showEdges) {
        this.drawEdges(true);
      }
    
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
