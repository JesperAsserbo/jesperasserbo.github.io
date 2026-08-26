class Graph {
  constructor(array) {
    this.posOrigo = new p5.Vector(500, 1200);
    this.fixPointsDiameter = 20;

    this.walls; //**Array of wallObjects
    this.load; //**Object

    this.xMax = 0;
    this.yMax = 0;

    this.xMin = Infinity;
    this.yMin = Infinity;

    //**Adjust Axis when addWall
    this.xMaxAddWall = 0;
    this.yMaxAddWall = 0;
    this.readPosX = this.xMax;
    this.readPosY = this.yMax;

    this.scaleMesure = 100; //** 100 => meters
    this.scaleForce = 100;

    this.forceDiagramInsertPoint = new p5.Vector(1750, 1800);
    this.forceDiagramFixPointsDiameter = 20;

    //**Used in DisplayAxis()
    this.countDamping = 0;

    //** Bouncy effect on Axis
    this.delayed_x = 0;
    this.velocity_x = 0;
    this.delayed_y = 0;
    this.velocity_y = 0;

    //** Display stiffness model
    this.insertPoint_Model = new p5.Vector(1400, 600);
  }

  UploadData(load, walls) {
    this.load = load;
    this.walls = walls;
  }

  DisplayForceDiagram() {
    //**ForceDiagramFixPoint
    push();
    strokeWeight(1);
    noFill();
    stroke(100, 100, 100);

    circle(
      this.forceDiagramInsertPoint.x,
      this.forceDiagramInsertPoint.y,
      this.forceDiagramFixPointsDiameter
    );

    pop();
    //**ForceDiagram
    push();
    translate(this.forceDiagramInsertPoint.x, this.forceDiagramInsertPoint.y);
    stroke(0, 0, 0, 100);
    fill(0, 0, 0, 100);
    if (load.Py.mag() != 0) this.Arrow(load.Py);
    translate(0, load.Py.y / scaleForce);
    if (load.Px.mag() != 0) this.Arrow(load.Px);
    translate(load.Px.x / scaleForce, 0);

    for (let i = 0; i < this.walls.length; i++) {
      stroke(255, 0, 0, 100);
      fill(255, 0, 0, 100);
      this.Arrow(this.walls[i].forceXY.mult(-1));
      translate(
        this.walls[i].forceXY.x / scaleForce,
        this.walls[i].forceXY.y / scaleForce
      );
    }
    pop();
  }
  MoveForceDiagram(pos) {
    let distForceDiagram = dist(
      this.forceDiagramInsertPoint.x,
      this.forceDiagramInsertPoint.y,
      pos.x,
      pos.y
    );
    //this.MoveInSteps(pos);

    push();
    noStroke();
    if (distForceDiagram < this.forceDiagramFixPointsDiameter) {
      fill(100, 100, 100, 100);
      circle(
        this.forceDiagramInsertPoint.x,
        this.forceDiagramInsertPoint.y,
        this.forceDiagramFixPointsDiameter
      );
    }
    pop();

    //** logFixpoint only if overlap and mouseIsPressed... Set to false in sketch.MouseRelease();
    if (
      distForceDiagram < this.forceDiagramFixPointsDiameter &&
      mouseIsPressed
    ) {
      if (countLoggedInsertPoints == 0) {
        countLoggedInsertPoints++;
        logFixpoint = true;
      }
    }
    if (logFixpoint == false) return;

    push();
    if (mouseIsPressed) fill(0, 255, 0, 100);
    circle(
      this.forceDiagramInsertPoint.x,
      this.forceDiagramInsertPoint.y,
      this.forceDiagramFixPointsDiameter
    );
    pop();
    this.forceDiagramInsertPoint = new p5.Vector(pos.x, pos.y);
  }
  DisplayForceWalls(array) {
    for (let i = 0; i < array.length; i++) {
      push();
      applyMatrix(
        1,
        0,
        0,
        1,
        array[i].centerPos_o.x, //**100/this.scaleMesure
        array[i].centerPos_o.y //**100/this.scaleMesure
      );
      strokeWeight(4);
      stroke(255, 0, 0);
      fill(255, 0, 0, 255);

      translate(
        (-array[i].forceXY.x * 0.5) / scaleForce,
        (-array[i].forceXY.y * 0.5) / scaleForce
      );
      line(
        0,
        0,
        array[i].forceXY.x / scaleForce,
        array[i].forceXY.y / scaleForce
      );
      rotate(array[i].forceXY.heading() + PI);
      strokeWeight(2);
      stroke(0);
      if (array[i].forceXY.mag() > 0.1) triangle(10, 0, -20, 12, -20, -12);
      pop();
    }
  }
  MoveGraph(pos) {
    if (mouseIsPressed && logFixpointGraphOrigo == true) {
      //this.MoveInSteps(pos);
      this.posOrigo.x = pos.x;
      this.posOrigo.y = pos.y;
      //console.log("###");
    }

    if (!this.OverlapInsertPoint(pos)) return;
    //this.MoveInSteps(pos);

    //** MoveWalls
    for (let i = 0; i < wallSystem.array.length; i++) {
      //**WallPos_o coordinates in paperSpace
      wallSystem.array[i].startPos_o = new p5.Vector(
        wallSystem.array[i].startPos.x / scaleGeo + 1 * graph.posOrigo.x,
        wallSystem.array[i].startPos.y / scaleGeo + 1 * graph.posOrigo.y
      );
      wallSystem.array[i].endPos_o = new p5.Vector(
        wallSystem.array[i].endPos.x / scaleGeo + 1 * graph.posOrigo.x,
        wallSystem.array[i].endPos.y / scaleGeo + 1 * graph.posOrigo.y
      );

      wallSystem.array[i].centerPos_o.x =
        wallSystem.array[i].startPos_o.x +
        0.5 *
          (wallSystem.array[i].endPos_o.x - wallSystem.array[i].startPos_o.x);
      wallSystem.array[i].centerPos_o.y =
        wallSystem.array[i].startPos_o.y +
        0.5 *
          (wallSystem.array[i].endPos_o.y - wallSystem.array[i].startPos_o.y);
    }
  }

  OverlapInsertPoint(pos) {
    this.distToOrigo = dist(this.posOrigo.x, this.posOrigo.y, pos.x, pos.y);

    push();
    noStroke();
    if (this.distToOrigo < this.fixPointsDiameter) {
      fill(100, 100, 100, 100);
      circle(this.posOrigo.x, this.posOrigo.y, this.fixPointsDiameter);
    }
    pop();

    //** logFixpoint only if overlap and mouseIsPressed... Set to false in sketch.MouseRelease();
    if (this.distToOrigo < 1 * this.fixPointsDiameter && mouseIsPressed) {
      if (countLoggedInsertPoints == 0) {
        countLoggedInsertPoints++;
        logFixpointGraphOrigo = true;
      }
      return true;
    }
    if (logFixpointGraphOrigo == false) return;

    push();
    fill(100, 100, 100, 100);
    if (mouseIsPressed) fill(0, 255, 0, 100);
    circle(this.posOrigo.x, this.posOrigo.y, this.fixPointsDiameter);
    pop();
  }
  DisplayForceScale(pos) {
    //**ForceMesure
    push();
    fill(0);
    strokeWeight(1);
    translate(pos.x + 100, pos.y - 15);
    line(-5, -20, 105, -20);
    line(0, -25, 0, -5); //**Left
    line(100, -25, 100, -5); //**Right

    //translate(pos.x+100,pos.y-15);
    let scaleArrow = new p5.Vector(100 * scaleForce, 0);
    this.Arrow(scaleArrow);
    pop();
  }
  DisplayMesureScale(pos) {
    //**ForceMesure
    push();
    fill(0);
    strokeWeight(1);
    translate(pos.x + 100, pos.y - 15);
    line(-5, -20, 105, -20);
    line(0, -25, 0, -5); //**Left
    line(100, -25, 100, -5); //**Right
    strokeWeight(5);
    line(0, 0, 100, 0);

    //translate(pos.x+100,pos.y-15);
    //let scaleArrow = new p5.Vector(95 * this.scaleMesure, 0);
    //this.Arrow(scaleArrow);
    pop();
  }

  Arrow(vector) {
    if (vector.mag() > 0.1) {
      //**Kun tegne pilespids hvis reaktion
      push();
      strokeWeight(4);
      line(0, 0, vector.x / scaleForce, vector.y / scaleForce);
      let end = new p5.Vector(vector.x / scaleForce, vector.y / scaleForce);
      translate(end.x, end.y);
      rotate(vector.heading());
      triangle(0, 0, -20, -8, -20, 8);
      stroke(0);
      fill(0);
      circle(0, 0, 3);
      pop();
    }
  }

  DisplayWalls(array) {
    push();
    for (let i = 0, length = array.length; i < length; i++) {
      array[i].Display();
    }
    pop();
  }
  //** (coordinates, pos, color, textInput)
  DisplayPoints(point_X, point_Y, posX, posY, color, textInput) {
    push();
    //scale(100 / this.scaleMesure); //**100/this.scaleMesure
    translate(graph.posOrigo);

    fill(color);
    stroke(color);
    strokeWeight(3);
    line(posX - 10, posY, posX + 10, posY); //** from [mm] to pos on screen
    line(posX, posY - 10, posX, posY + 10);
    //circle(point_X, point_Y, 15);
    textSize(22);
    noStroke();
    if (textInput) {
      text(textInput, posX + 20, posY + 20);
      let x = nf(round(point_X / 1000, 2), 0, 2);
      let y = nf(round(point_Y / 1000, 2), 0, 2);
      textSize(22);
      text("(" + x + " , " + y + ")", posX + 20, posY + 50);
    }

    pop();
  }
  DisplayAxis(wallSystem) {
    this.FindMinMax(wallSystem.array);

    if (button_WallAdd.state == 1) {
      //** Start ** Bouncy effect on Axis when adjust addWall
      // spring physics
      let spring = 0.05;
      let damping = 0.8;

      let force_x = (mousePosWorld.x - this.delayed_x) * spring;
      this.velocity_x += force_x;
      this.velocity_x *= damping;
      this.delayed_x += this.velocity_x;

      let force_y = (mousePosWorld.y - this.delayed_y) * spring;
      this.velocity_y += force_y;
      this.velocity_y *= damping;
      this.delayed_y += this.velocity_y;

      this.xMax = this.delayed_x;
      this.yMax = this.delayed_y;
    } else {
      this.xMax = 0;
      this.yMax = 0;

      this.xMin = Infinity;
      this.yMin = Infinity;
    }

    push(); //** Push coordinateSystem
    circle(this.posOrigo.x, this.posOrigo.y, 20);
    translate(this.posOrigo.x, this.posOrigo.y);

    push();
    textSize(30);
    stroke(0);
    textAlign(CENTER, CENTER);
    text("X", this.xMax_o + 230, 0);
    text("Y", 0, this.yMax_o + 230);
    textSize(20);
    text("[m]", this.xMax_o + 260, 0);
    text("[m]", 30, this.yMax_o + 230);
    stroke(0);
    strokeWeight(4);
    line(-25, 0, this.xMax_o + 200, 0);
    line(0, -25, 0, this.yMax_o + 200);
    pop();

    //**Arrow
    push();
    fill(0);
    translate(200, 0);
    triangle(this.xMax_o, 0, this.xMax_o - 20, 5, this.xMax_o - 20, -5);
    translate(-200, 200);
    triangle(0, this.yMax_o, 5, this.yMax_o - 20, -5, this.yMax_o - 20);
    pop();

    //**Lines
    let rowMax = round(this.yMax_o / 100, 0);
    let colMax = round(this.xMax_o / 100, 0);
    strokeWeight(2);
    stroke(0, 0, 0, 100);

    for (let row = 1; row <= rowMax + 1; row++) {
      line(-5, 100 * row, this.xMax_o + 160, 100 * row);
      push();
      textSize(22);
      noStroke();
      text(nf(row * scaleGeo, 0, 1), this.xMax_o + 180, 100 * row + 7);
      pop();
    }

    for (let col = 1; col <= colMax + 1; col++) {
      line(100 * col, -5, 100 * col, this.yMax_o + 160);
      push();
      translate(100 * col, this.yMax_o + 200);
      textAlign(RIGHT, CENTER);
      rotate(-PI / 2);
      textSize(22);

      noStroke();
      text(nf(col * scaleGeo, 0, 1), 25, 2);
      pop();
    }

    pop(); //** Pop coordinateSystem
  }

  DisplayText() {
    push(); //** Push coordinateSystem
    translate(this.posOrigo.x, this.posOrigo.y);

    textSize(30);
    noStroke();
    textAlign(LEFT, CENTER);
    let CzCF = calculation.CzCF_sum / 1e6; //** [kNm/rad]

    //** Px
    text("P", this.xMax_o + 350, 225);
    text("=", this.xMax_o + 450, 225);
    text("kN", this.xMax_o + 570, 225);

    //** Py
    text("P", this.xMax_o + 350, 275);
    text("=", this.xMax_o + 450, 275);
    text("kN", this.xMax_o + 570, 275);

    //** M_CR
    text("M", this.xMax_o + 350, 325);
    text("=", this.xMax_o + 450, 325);
    text("kNm", this.xMax_o + 570, 325);

    //** Cz_CF Torsion stiffness
    text("C", this.xMax_o + 350, 475);
    text("=", this.xMax_o + 450, 475);
    text("kNm/rad", this.xMax_o + 650, 475);
    text("x 10", this.xMax_o + 570, 475);
    text("Torsional stiffness", this.xMax_o + 350, 425);

    textAlign(RIGHT, CENTER);

    //** Px
    text(nf(load.Px.x / 1000, 0, 1), this.xMax_o + 560, 225);

    //** Py
    text(nf(load.Py.y / 1000, 0, 1), this.xMax_o + 560, 275);

    //** M_CR
    text(nf(round(load.M_FC, 1) / 1e6, 0, 1), this.xMax_o + 560, 325);

    //** Cz_CF Torsion stiffness
    //console.log(CzCF)
    let n_stifness = this.FindSciNotation_aboweOne(CzCF);
    let front_stifness = CzCF / pow(10, n_stifness);
    if (n_stifness == 0) front_stifness = 0;
    text(nf(front_stifness, 0, 2), this.xMax_o + 560, 475);

    textSize(20);
    textAlign(LEFT, CENTER);

    //** Px
    text("X_CR", this.xMax_o + 370, 235);

    //** Py
    text("Y_CR", this.xMax_o + 370, 285);

    //** M_CR
    text("Z_CR", this.xMax_o + 380, 335);

    //** Cz_CF Torsion stiffness
    text("Z_CR", this.xMax_o + 380, 485);

    textAlign(RIGHT, CENTER);
    text(n_stifness * 1, this.xMax_o + 640, 460);

    pop();
  }
  FindMinMax(array) {
    //this.xMax = 0;
    //this.yMax = 0;

    //**WallCoordinates min/max
    for (let i = 0; i < array.length; i++) {
      //** Max
      if (array[i].endPos_o.x > this.xMax) this.xMax = array[i].endPos_o.x;
      if (array[i].startPos_o.x > this.xMax) this.xMax = array[i].startPos_o.x;
      if (array[i].endPos_o.y > this.yMax) this.yMax = array[i].endPos_o.y;
      if (array[i].startPos_o.y > this.yMax) this.yMax = array[i].startPos_o.y;

      //** Min
      if (array[i].endPos_o.x < this.xMin) this.xMin = array[i].endPos_o.x;
      if (array[i].startPos_o.x < this.xMin) this.xMin = array[i].startPos_o.x;
      if (array[i].endPos_o.y < this.yMin) this.yMin = array[i].endPos_o.y;
      if (array[i].startPos_o.y < this.yMin) this.yMin = array[i].startPos_o.y;
    }

    this.xMax_o = this.xMax - graph.posOrigo.x;
    this.yMax_o = this.yMax - graph.posOrigo.y;

    //this.xMin_o = this.xMin - graph.posOrigo.x;
    //this.yMin_o = this.yMin - graph.posOrigo.y;
  }

  DisplayStiffnesModel_Bending() {
    if (button_Bending.state == -1) return;

    //** Model drawing
    this.DisplayModelTemplate();

    //** Arrow from button
    push();
    fill(0);
    noStroke();
    translate(1070, 675);
    circle(0, 0, 8);
    stroke(0);
    line(0, 0, 180, 0);
    line(180, 0, 180, -200);
    line(180, -200, 210, -200);
    line(210, -200, 210 - 15, -200 - 10); //** Arrow
    line(210, -200, 210 - 15, -200 + 10); //** Arrow
    pop();

    //** Model specific for Bending
    push();
    //** InsertPoint TopLeft wall
    translate(this.insertPoint_Model.x, this.insertPoint_Model.y);

    //** Text
    textAlign(LEFT, CENTER);
    noStroke();
    fill(0);
    strokeWeight(1);
    textSize(24);

    //** Text on Wall
    text("EI", 62, 52);

    //** Text u
    text("u = P", 200, 25);
    text("H", 280, -15 + 25);
    text("3 EI", 270, 15 + 25);

    //** Text I
    text("EI", 200, -50);
    text("=", 230, -50);
    text("E", 250, -50);
    text("1", 280, -60);
    text("12", 275, -35);
    text("t L", 310, -50);

    text("1", 540, -60 + 125);
    text("4", 540, -35 + 125);
    text("t L", 560, -50 + 125);

    text("E", 610, -60 + 125);
    text("H", 610, -35 + 125);

    //** Value
    const value = wallSystem.array[0].Cns_n;
    const scaled = value >= 1000 ? value / 1000 : value;
    const unit = value >= 1000 ? "kN/mm" : "N/mm";

    //** `${1. text string} ${2. text string}`
    text(`${nf(round(scaled, 1), 0, 1)} ${unit}`, 540, 125);

    //** exp
    textSize(16);
    text("3", 335, -60);
    text("3", 300, -60 + 60);
    text("3", 585, -60 + 125);
    text("3", 628, -60 + 145);

    stroke(0);
    line(275, -50, 305, -50);
    line(265, 25, 315, 25);
    line(540, -50 + 125, 555, -50 + 125);
    line(605, -50 + 125, 640, -50 + 125);

    pop();
  }
  DisplayStiffnesModel_Shear() {
    if (button_Shear.state == -1) return;
    //** Model drawing
    this.DisplayModelTemplate();

    //** Arrow from button
    push();
    fill(0);
    noStroke();
    translate(1070, 675 );
    circle(0, -50, 8);
    stroke(0);
    line(0, -50, 180, -50);
    line(180, -50, 180, -200);
    line(180, -200, 210, -200);
    line(210, -200, 210 - 15, -200 - 10); //** Arrow
    line(210, -200, 210 - 15, -200 + 10); //** Arrow
    pop();

    //** Model specific for Bending
    push();
    //** InsertPoint TopLeft wall
    translate(this.insertPoint_Model.x, this.insertPoint_Model.y);

    //** Text
    textAlign(LEFT, CENTER);
    noStroke();
    fill(0);
    strokeWeight(1);
    textSize(24);

    //** Text on Wall
    text("GA", 60, 52);

    //** Text GA
    text("GA", 200, -50);
    text("=", 250, -50);
    text("G", 270, -50);
    text("t L", 295, -50);

    //** Text u
    text("u = P", 200, 0);
    text("H", 278, -15);
    text("GA", 270, 15);

    text("G t L", 545, -60 + 125);
    text("H", 560, -35 + 125);

    //** Value
    const value = wallSystem.array[0].Cns_n;
    const scaled = value >= 1000 ? value / 1000 : value;
    const unit = value >= 1000 ? "kN/mm" : "N/mm";

    //** `${1. text string} ${2. text string}`
    text(`${nf(round(scaled, 1), 0, 1)} ${unit}`, 540, 125);
    
    //** exp
    textSize(16);
    text("k", 98, 58);

    text("k", 238, -40);
    text("k", 308, 25);

    stroke(0);

    line(265, 0, 305, 0);
    line(540, -50 + 125, 605, -50 + 125);

    pop();
  }
  DisplayModelTemplate() {
    push();
    //** InsertPoint TopLeft wall
    translate(this.insertPoint_Model.x, this.insertPoint_Model.y);

    //** Headline
    push();
    textSize(28);
    textAlign(LEFT, CENTER);
    text("Stiffness Model:", -100, -122.5);
    pop();

    //** Wall **
    fill(100, 100, 100, 100);
    rect(0, 0, 150, 100);
    rect(0, -55, 150, 10);

    //** Support
    strokeWeight(2);
    line(-50, 100, 200, 100);
    strokeWeight(1);
    for (let i = 0; i < 25; i++) {
      line(-40 + i * 10, 100, -50 + i * 10, 110);
    }

    //** MesureLine L
    let Ly = 130;
    line(-5, Ly, 60, Ly); //** Horisontal
    line(90, Ly, 155, Ly); //** Horisontal
    line(0, Ly + 5, 0, 115); //** Vertical
    line(150, Ly + 5, 150, 115); //** Vertical

    //** MesureLine H
    let Hx = -100;
    line(Hx, -5, Hx, 30); //** Vertical
    line(Hx, 70, Hx, 105); //** Vertical
    line(Hx - 5, 0, -80, 0); //** Horisontal
    line(Hx - 5, 100, -60, 100); //** Horisontal

    //** arrow
    fill(0);
    triangle(-10, 0, -25, -8, -25, 8);
    strokeWeight(4);
    line(-70, 0, -20, 0);

    //** Text
    textAlign(CENTER, CENTER);
    stroke(0);
    fill(0);
    strokeWeight(1);

    textSize(22);
    text("t", 0, -75);
    text("L", 75, Ly);
    text("H", Hx, 50);
    text("P", -65, -15);

    //** U+21D2
    textSize(40);
    text("\u21D2", 350, 75); //** doubleArrow
    text("\u21D2", 350, 250); //** doubleArrow
    
    //** Result on dominant Stiffness Model
    
    
        //**Stiffness Cf = GLt/H equivalent to C [N/mm]
 let StiffnessShear = wallSystem.array[0].G * wallSystem.array[0].t * wallSystem.array[0].wallLength/wallSystem.array[0].H;


    //**Stiffness Cb = 3EI/H^3, (I=1/12*t*L^3) equivalent to C //**(1) [N/mm]
    let StiffnessBending = (1 / 4) * wallSystem.array[0].t * pow(wallSystem.array[0].wallLength, 3)*wallSystem.array[0].E  /pow(wallSystem.array[0].H,3)
    
  
    let DomStiffness = "Shear Deformation"
  
    if (StiffnessShear > StiffnessBending) DomStiffness =  "Bending deformation"
  
      
    textSize(28);
    textAlign(LEFT, CENTER);
    noStroke();
    text(DomStiffness, 400, 225); //** doubleArrow
    text("Dominates", 400, 275); //** doubleArrow
    
    
    
    pop();

    //** Spring **
    push();
    translate(this.insertPoint_Model.x + 400, this.insertPoint_Model.y);
    strokeWeight(2);
    fill(0);
    circle(0, 0, 8);
    line(0, 0, 25, 0);
    line(25, 0, 35, -20);
    line(35, -20, 50, 20);
    line(50, 20, 65, -20);
    line(65, -20, 75, 0);

    line(75, 0, 100, 0);
    circle(100, 0, 8);

    noFill();
    triangle(100, 0, 120, -20, 120, 20);

    //** Text
    textAlign(LEFT, CENTER);
    noStroke();
    fill(0);
    strokeWeight(1);
    textSize(24);
    text("C", 0, 75);
    text("=", 50, 75);
    text("C", 70, 75);
    text("=", 115, 75);
    text("=", 115, 125);

    textSize(20);
    text("ref", 20, 85);
    let wall = wallSystem.array[0].id;
    text(wall, 90, 85);

    pop();
  }

  MoveInSteps(pos) {
    //**pos.y in multioplum of stepChange
    //let stepChange = 10; //*scaleGeo;
    pos.x = round(pos.x / stepSize) * stepSize;
    pos.y = round(pos.y / stepSize) * stepSize;
    return pos;
  }

  FindSciNotation_belowOne(number) {
    let test = 0;
    for (let i = 0; i < 10; i++) {
      test = number * pow(10, i);
      //console.log(test)
      if (abs(test) >= 1) {
        return i;
      }
    }
    return 0;
  }
  FindSciNotation_aboweOne(number) {
    let test = 0;
    for (let i = 0; i < 20; i++) {
      test = number / pow(10, i);
      //console.log(test)
      if (abs(test) <= 1) {
        return i;
      }
    }
    return 0;
  }
}
