//** Methods **
//** CalculateLoad(FC)
//** DisplayLoad()
//** DisplayLoadMesure(FC)
//** Overlap(pos)
//** ChangePos(pos)

class Load {
  constructor(posOrigo) {
    this.insertPoint = new p5.Vector(posOrigo.x, posOrigo.y);
    this.fixPointsDiameter = 20;
    this.distToTopPx = 0;
    this.distToTopPy = 0;

    //this.stepChange = 5;

    this.topPx = new p5.Vector(0, 0);
    this.topPy = new p5.Vector(0, 0);

    this.topPx_o = new p5.Vector(0, 0);
    this.topPy_o = new p5.Vector(0, 0);

    //** Load
    this.Px = new p5.Vector(5000, 0);
    this.Py = new p5.Vector(0, 10000); //**10 kN

    //** LoadPos
    this.y_Px = 200; //**position
    this.x_Py = 200; //**position

    //** Pos in coordinatSystem_o
    this.y_Px_o;
    this.x_Py_o;

    this.M_FC = 0;

    //**Load ex. 5.3 i Bygningsberegninger
    //this.Py = new p5.Vector(0, 10000); //**10 kN
    //this.Px = new p5.Vector(0, 0);
    //this.x_Py = 1550;

    this.scaleForce = 100; //**GlobalVariable
    this.scaleMesure = 100; //** 100 => meters

    this.graphPosNoScale_t = new p5.Vector();
  }

  ApplyScale(scaleForce, scaleMesure) {
    //**Change in values are stored in objectProporties
    this.scaleMesure = scaleMesure; //** 100 => meters
    this.scaleForce = scaleForce;
  }

  CalculateLoad(FC) { //** FC [mm]
    this.M_FC = this.Py.y * (this.x_Py*10 - FC.x)*1- this.Px.x * (this.y_Px*10 - FC.y)*1; //** [Nmm]
    //console.log(FC.x)
  }

  UpdatePosTo_o() {
    //** Graph
    this.topPx.x = -150;
    this.topPx.y = this.y_Px;

    this.topPy.x = this.x_Py;
    this.topPy.y = -150;

    this.y_Px_o = this.y_Px + graph.posOrigo.y;
    this.x_Py_o = this.x_Py + graph.posOrigo.x;

    this.topPx_o.x = this.topPx.x + graph.posOrigo.x;
    this.topPx_o.y = this.topPx.y / scaleGeo + graph.posOrigo.y;

    this.topPy_o.x = this.topPy.x / scaleGeo + graph.posOrigo.x;
    this.topPy_o.y = this.topPy.y + graph.posOrigo.y;
  }

  DisplayLoad() {
    //console.log(this.y_Px)
    //**Px
    this.scaleForce = scaleForce; //**change in value is stored in this.scaleForce

    if (this.Px.mag() != 0) {
      push();

      //**Text
      textSize(30);
      textAlign(CENTER, CENTER);
      let Px = nf(this.Px.mag()/1000,0,1);
      text("Px = " + Px + " kN", this.topPx_o.x, this.topPx_o.y + 40);

      //**FixPoint
      strokeWeight(1);
      noFill();

      circle(this.topPx_o.x, this.topPx_o.y, this.fixPointsDiameter);

      //**Arrow
      applyMatrix(1, 0, 0, 1, this.topPx_o.x + 150, this.topPx_o.y);
      //applyMatrix(1, 0, 0, 1, 0, this.y_Px_o );

      if (this.Px.x > 0)
        applyMatrix(1, 0, 0, 1, -100 - this.Px.x / this.scaleForce, 0);
      if (this.Px.x < 0) applyMatrix(1, 0, 0, 1, -100, 0);
      this.Arrow(this.Px);

      pop();
    }

    //**Py
    if (this.Py.mag() != 0) {
      push();

      //**Text

      textSize(30);
      textAlign(LEFT, CENTER);
      let Py = nf(this.Py.mag()/1000,0,1);
      text("Py = " + Py + " kN", this.topPy_o.x + 30, this.topPy_o.y);

      //**FixPoint
      strokeWeight(1);
      noFill();

      circle(this.topPy_o.x, this.topPy_o.y, this.fixPointsDiameter);

      //**Arrow
      applyMatrix(1, 0, 0, 1, this.topPy_o.x, this.topPy_o.y + 150);

      if (this.Py.y > 0)
        applyMatrix(1, 0, 0, 1, 0, -100 - this.Py.y / this.scaleForce);
      if (this.Py.y < 0) applyMatrix(1, 0, 0, 1, 0, -100);

      this.Arrow(this.Py);

      pop();
    }
    
    //** Pres
    push();
    let intersection = new p5.Vector(this.topPy_o.x,this.topPx_o.y)
    let r = 300;
    this.loadTheta = atan(this.Py.y/this.Px.x) //** Radians
    let x_start = intersection.x+r*cos((PI-this.loadTheta));
    let y_start = intersection.y-r*sin(PI-this.loadTheta);
    let x_end= intersection.x+r*cos((-this.loadTheta));
    let y_end = intersection.y-r*sin(-this.loadTheta);

    fill(0)
    circle(intersection.x,intersection.y,12);
    line(x_start,y_start, x_end,y_end);
   
    this.P_res = new p5.Vector(this.Px.x,this.Py.y);
        
    translate((intersection.x-0.5*this.P_res.x/100/this.scaleForce*100),(intersection.y-0.5*this.P_res.y/100/this.scaleForce*100))
    this.Arrow(this.P_res)
    
    
    pop();
  }

  Arrow(vector) {
    push();
    fill(0);
    strokeWeight(5);
    line(0, 0, vector.x / this.scaleForce, vector.y / this.scaleForce);
    let end = new p5.Vector(
      vector.x / this.scaleForce,
      vector.y / this.scaleForce
    );
    // let start = new
    translate(end.x, end.y);
    rotate(vector.heading());
    triangle(0, 0, -20, -8, -20, 8);
    pop();
  }
  DisplayLoadMesure(FC) {
    //**X
    if (this.Py.mag() != 0) {
      push();
      applyMatrix(1, 0, 0, 1, graph.posOrigo.x, graph.posOrigo.y);
      stroke(0);
      line(0, -50, 0, -165);
      line(
        -10,
        -150,
        ((this.x_Py / scaleGeo) * 100) / this.scaleMesure + 10,
        -150
      );

      textSize(24);
      noStroke();
      
      let textPosX = 0.5 * this.topPy.x;
      if (this.x_Py >= 0 && this.x_Py < 50) textPosX = -20;
      if (this.x_Py < 0 && this.x_Py > -50) textPosX = 20;
      rotate(-PI / 2);
      textAlign(LEFT, CENTER);
      text(nf(abs(this.x_Py / 100), 0, 2), 165, textPosX / scaleGeo);
      pop();
    }

    //**Y
    if (this.Px.mag() != 0) {
      push();
      applyMatrix(1, 0, 0, 1, graph.posOrigo.x, graph.posOrigo.y);
      stroke(0);
      line(-160, 0, -50, 0);
      line(
        -150,
        ((this.y_Px / scaleGeo) * 100) / this.scaleMesure + 10,
        -150,
        -10
      );
      textSize(24);
      noStroke();

      textAlign(RIGHT, CENTER);
      let textPosY = 0.5 * this.topPx.y;
      if (this.y_Px >= 0 && this.y_Px < 50) textPosY = -20;
      if (this.y_Px < 0 && this.y_Px > -50) textPosY = 20;
      text(nf(abs(this.y_Px / 100), 0, 2), -165, textPosY / scaleGeo);
      pop();
    }
  }

  OverlapPx(pos) {
    //**Wall_Start FixPoint
    this.distToTopPx = dist(this.topPx_o.x, this.topPx_o.y, pos.x, pos.y);
  
      push();
      if (this.distToTopPx < 1 * this.fixPointsDiameter) fill(100, 100, 100, 100);
      if (logFixpoint_Px ) fill(0, 255, 0, 100); 
      circle(this.topPx_o.x, this.topPx_o.y, this.fixPointsDiameter);     
      pop();
    
    if (this.distToTopPx < 1 * this.fixPointsDiameter) return true;
   
  }
  OverlapPy(pos) {
    //**Wall_Start FixPoint
    this.distToTopPy = dist(this.topPy_o.x, this.topPy_o.y, pos.x, pos.y);

      push();
      if (this.distToTopPy < 1 * this.fixPointsDiameter) fill(100, 100, 100, 100);
      if (logFixpoint_Py ) fill(0, 255, 0, 100); 
      circle(this.topPy_o.x, this.topPy_o.y, this.fixPointsDiameter);     
      pop();
    
    if (this.distToTopPy < 1 * this.fixPointsDiameter) return true;
  }


/*
  MoveInSteps(pos) {
    //**pos.y in multioplum of stepChange
    //let stepChange = 10; //*scaleGeo;
    pos.x = round(pos.x / stepSize) * stepSize;
    pos.y = round(pos.y / stepSize) * stepSize;
    return pos;
  }
  */
  
}
