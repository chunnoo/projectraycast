function CoreGame(core) {
  core.init = function() {

  var tempRand = Math.random();

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
      ballOne: new Ball(256, -256, 3*Math.cos(tempRand), 3*Math.sin(tempRand), 10),
      ballTwo: new Ball(-256, 256, -3*Math.cos(tempRand), -3*Math.sin(tempRand), 10)
    };
    
    moveEdges(-100, -100, this.edges, 0, 4);
    connectEdges(this.edges, 0, 4);
    connectEdges(this.edges, 5, 8);
    connectEdges(this.edges, 9, 12);
    
  };

  core.draw = function() {
    
    this.objects.ballOne.update(this.edges);
    this.objects.ballTwo.update(this.edges);
    
    this.lights[1].update(this.objects.ballOne.pos.x, this.objects.ballOne.pos.y, this.edges);
    
    this.lights[2].update(this.objects.ballTwo.pos.x, this.objects.ballTwo.pos.y, this.edges);

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
    
  };

  core.clearFrame = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  core.leftMouseDown = function() {
    this.game.leftMouseDown(this.mouse.x, this.mouse.y);
  }

  core.keydown = function(charCode) {
    
    if (charCode == 116 || charCode == 84) {
      //T is pressed
      this.showEdges = !this.showEdges;
    } else if (charCode == 97 || charCode == 65 || charCode == 37) {
      //A is pressed
      this.game.keydown(0);
    } else if (charCode == 119 || charCode == 87 || charCode == 38) {
      //W is pressed
      this.game.keydown(1);
    } else if (charCode == 100 || charCode == 68 || charCode == 39) {
      //D is pressed
      this.game.keydown(2);
    } else if (charCode == 115 || charCode == 83 || charCode == 40) {
      //S is pressed
      this.game.keydown(3);
    }
  }
  
  core.keyup = function(charCode) {
    if (charCode == 97 || charCode == 65 || charCode == 37) {
      //A is released
      this.game.keyup(0);
    } else if (charCode == 119 || charCode == 87 || charCode == 38) {
      //W is released
      this.game.keyup(1);
    } else if (charCode == 100 || charCode == 68 || charCode == 39) {
      //D is released
      this.game.keyup(2);
    } else if (charCode == 115 || charCode == 83 || charCode == 40) {
      //S is released
      this.game.keyup(3);
    }
  }
  
}
