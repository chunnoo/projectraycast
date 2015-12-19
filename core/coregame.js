function CoreGame(core) {
  core.init = function() {

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
      new Edge(-512, -512, 512, -512),
      new Edge(512, -512, 512, 512),
      new Edge(512, 512, -512, 512),
      new Edge(-512, 512, -512, -512)];
    
    this.lights = [
      new Light(0, 0),
      new Light(240, 0, "rgba(64, 0, 0, 1)"),
      new Light(240, 0, "rgba(64, 0, 0, 1)")];
    
    this.objects = {
      
    };
    
    moveEdges(-100, -100, this.edges, 0, 4);
    connectEdges(this.edges, 0, 4);
    connectEdges(this.edges, 5, 8);
    connectEdges(this.edges, 9, 12);
    
  };

  core.draw = function() {
    
    this.lights[1].update(320*Math.cbrt(Math.cos(this.game.gameTime/512)), 320*Math.cbrt(Math.sin(this.game.gameTime/512)), this.edges);
    
    this.lights[2].update(320*Math.cbrt(Math.cos(-this.game.gameTime/500)), 320*Math.cbrt(Math.sin(-this.game.gameTime/500)), this.edges);

    this.lights[0].update(this.game.player.pos.x, this.game.player.pos.y, this.edges);
    
    this.context.globalCompositeOperation = "source-atop";
    
    //second light source
    this.context.beginPath();
    this.context.arc(this.lights[1].source.x, this.lights[1].source.y, 10, 0, Math.PI*2, false);
    this.context.fillStyle = "rgba(255, 0, 0, 1)";
    this.context.fill();
    
    //second light source
    this.context.beginPath();
    this.context.arc(this.lights[2].source.x, this.lights[2].source.y, 10, 0, Math.PI*2, false);
    this.context.fillStyle = "rgba(255, 0, 0, 1)";
    this.context.fill();
    
    this.context.globalCompositeOperation = "source-over";
    
    this.context.beginPath();
    this.context.arc(this.game.player.pos.x, this.game.player.pos.y, 25, 0, Math.PI*2, false);
    this.context.lineWidth = 5;
    this.context.fillStyle = "rgba(255, 255, 255, 1)";
    this.context.stroke();
    this.context.lineWidth = 1;
    
  };

  core.clearFrame = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  core.leftMouseDown = function() {
    this.game.leftMouseDown(this.mouse.x, this.mouse.y);
  }

  core.keypress = function(charCode) {
    if (charCode == 116 || charCode == 84) {
      //T is pressed
      this.showEdges = !this.showEdges;
    } else if (charCode == 97 || charCode == 65) {
      //A is pressed
      this.game.keypress(-1, 0);
    } else if (charCode == 119 || charCode == 87) {
      //W is pressed
      this.game.keypress(0, -1);
    } else if (charCode == 100 || charCode == 68) {
      //D is pressed
      this.game.keypress(1, 0);
    } else if (charCode == 115 || charCode == 83) {
      //S is pressed
      this.game.keypress(0, 1);
    }
  }
  
  core.keyup = function(charCode) {
    if (charCode == 97 || charCode == 65) {
      //A is released
      this.game.keyup(-1, 0);
    } else if (charCode == 119 || charCode == 87) {
      //W is released
      this.game.keyup(0, -1);
    } else if (charCode == 100 || charCode == 68) {
      //D is released
      this.game.keyup(1, 0);
    } else if (charCode == 115 || charCode == 83) {
      //S is released
      this.game.keyup(0, 1);
    }
  }
  
}
