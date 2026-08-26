//** Methods **
//**  ApplyScale(scaleForce, scaleMesure)
//**  Display()
//**  DisplayWallId()
//**  DisplaywallNormal()
//**  Calculate(FC)
//**  OverlapID(pos)
//**  Overlap(pos)
//**  OverlapCenter(pos)
//**  OverlapHighlight(pos)
//**  CreateTempButtonRollor_ID(pos)
//**  ChangePos(pos)

class Wall {
  constructor(startX, startY, endX, endY, id) {
    this.id = id;
    //this.testOverlapID = false;
    
    this.E = 30000;//*30000; //** Beton
    this.G = this.E/(2*(1-0.2)); //** Beton
    this.H = 50000; //**[mm]

    this.fixPointsDiameter = 20;

    //**ID point
    this.fixPointWall_ID_pos = new p5.Vector(0, 0);
    this.fixPointWall_ID_radius = 30;

    //**WallPos
    this.startPos = new p5.Vector(startX, startY);
    this.endPos = new p5.Vector(endX, endY);

    //**WallPos_o
    this.startPos_o = new p5.Vector(
      startX + 1 * graph.posOrigo.x,
      startY + 1 * graph.posOrigo.y
    );
    this.endPos_o = new p5.Vector(
      endX + 1 * graph.posOrigo.x,
      endY + 1 * graph.posOrigo.y
    );

    this.wallVector = new p5.Vector.sub(this.endPos, this.startPos);
    this.wallVectorUnit = this.wallVector.copy().normalize();
    this.wallAngleRadians = this.wallVector.heading();
    this.wallAngleDegrees = (this.wallAngleRadians * 180) / PI;

    this.wallVectorNormal = this.wallVector.copy().rotate(-PI / 2);
    this.wallVectorNormalUnit = this.wallVectorNormal.copy().normalize();

    this.wallLength = this.wallVector.mag();

    this.centerPos = p5.Vector.add(
      this.startPos,
      p5.Vector.mult(this.wallVectorUnit, 0.5 * this.wallLength)
    );

    this.centerPos_o = p5.Vector.add(
      this.startPos_o,
      p5.Vector.mult(this.wallVectorUnit, 0.5 * this.wallLength)
    );

    this.scaleMesure = 1;

    //this.stepChange = 5;
    //this.wallPosArray = [];

    //**For calculation
    this.Sxy = new p5.Vector(0, 0); //**Calculated in object calculation

    //this.Cxy_x; //**Stiffness x (1)
    //this.Cxy_y; //**Stiffness y (2)

    this.Cns_n; //**Stiffness n (1)
    this.Cns_s; //**Stiffness s (2)

    //this.Cxy_xy;//**Cxy_x * y
    //this.Cxy_yx;//**Cxy_y * x

    this.A1;
    this.A2;
    this.A3;

    this.B1;
    this.B2;

    this.t = 100; //**100 mm
    this.area = this.wallLength * this.t;

    this.cos = cos(this.wallAngleRadians);
    this.sin = sin(this.wallAngleRadians);

    this.cos2 = pow(this.cos, 2);
    this.sin2 = pow(this.sin, 2);

    this.sincos = this.sin * this.cos;
    
    //** Static moment Sx calculatet in calculation.
    this.Sxy = new p5.Vector (0,0)

    //**(4.23) Calculated in module calculation
    this.n_nFC = 0; //** n-n_FC
    this.s_sFC = 0; //** s-s_FC

    //**(4.24) Calculated in module calculation
    this.un_FC = 0; //** un_FC
    this.us_FC = 0; //** us_FC

    //**(4.28) Forces Calculated in module calculation
    this.Qn = 0;
    this.Qs = 0;
    
    this.forceXY = new p5.Vector(0, 0);

    //**Dist wallCenter to FC
    this.dist_x_FC = 0;
    this.dist_y_FC = 0;

    //**Moment FC - Calculated in module calculation
    this.M_FC = 0;

    //** ButtonRollor_wall_t
    this.buttonRollor_wall_t = new ButtonRollor(
      0, //** pos1x - textPro BR
      0, //** pos1y - textPro BR
      20, //** pos2x - "=" BR
      155, //** pos3x - ciffers BL
      165, //** pos4x - unit BR
      3, // prefix
      0, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "", // textPro
      "", // textMid
      "", // textPre
      100, // startValue
      5, // minValue
      999 // maxValue
    );
    this.graphPosNoScale_t = new p5.Vector();

    this.buttonRollor_ID = new ButtonRollor(
      0, //** pos1x - textPro BR
      this.fixPointWall_ID_pos.y + 15, //** pos1y - textPro BR
      0, //** pos2x - "=" BR
      this.fixPointWall_ID_pos.x + 15, //** pos3x - ciffers BL
      0, //** pos4x - unit BR
      2, // prefix
      0, //sufix
      15, // buttonWidth
      30, // buttonHeight
      20, // letterSize
      "", // textPro
      "", // textMid
      "", // textPre
      this.id, // startValue
      0, // minValue
      99 // maxValue
    );
    this.insertPointButtonRollor_ID = new p5.Vector();
    this.graphPosNoScale_ID = new p5.Vector();
  }

  //************************************************************

  /*
  ApplyScale(scaleForce, scaleMesure) {
    //**Change in values are stored in objectProporties
    this.scaleMesure = scaleMesure; //** 100 => meters
    this.scaleForce = scaleForce;
  }
  */

  //************************************************************

  Display() {
    push();
    //scale(100 / this.scaleMesure); //**100/this.scaleMesure

    //**Wall
    let w = max(this.t, 70);
    strokeWeight(w / 10);
    stroke(50, 50, 50, 150);
    line(
      this.startPos_o.x,
      this.startPos_o.y,
      this.endPos_o.x,
      this.endPos_o.y
    );

    //**Wall_Start, wall_Center and wall_End fixPoint
    strokeWeight(1);
    noFill();
    stroke(0);
    circle(this.startPos_o.x, this.startPos_o.y, this.fixPointsDiameter);
    circle(this.centerPos_o.x, this.centerPos_o.y, this.fixPointsDiameter);
    circle(this.endPos_o.x, this.endPos_o.y, this.fixPointsDiameter);
    pop();
  }

  //************************************************************
  DisplayWallId() {
    push();
    this.scaleMesure = 100;

    let normalPoint = p5.Vector.add(
      this.centerPos_o,
      p5.Vector.mult(this.wallVectorNormalUnit, (40 * this.scaleMesure) / 100)
    );
    textSize(20);
    //stroke(0);
    textAlign(CENTER, CENTER);
    text(
      this.id,
      (normalPoint.x * 100) / this.scaleMesure,
      (normalPoint.y * 100) / this.scaleMesure
    );
    noFill();
    circle(
      (normalPoint.x * 100) / this.scaleMesure,
      (normalPoint.y * 100) / this.scaleMesure,
      30
    );
    //scale(100/this.scaleMesure); //**100/this.scaleMesure

    this.fixPointWall_ID_pos = new p5.Vector(
      (normalPoint.x * 100) / this.scaleMesure,
      (normalPoint.y * 100) / this.scaleMesure
    );

    pop();

    this.DisplaywallNormal();
  }
  //************************************************************

  DisplaywallNormal() {
    //circle(this.centerPos.x, this.centerPos.y, 5);
    push();
    this.scaleMesure = 100;
    scale(100 / this.scaleMesure); //**100/this.scaleMesure

    let normalPoint = p5.Vector.add(
      this.centerPos_o,
      p5.Vector.mult(this.wallVectorNormalUnit, (25 * this.scaleMesure) / 100)
    );
    //normalPoint.mult(this.scaleMesure/100)

    stroke(0);
    strokeWeight(1);
    line(this.centerPos_o.x, this.centerPos_o.y, normalPoint.x, normalPoint.y);

    pop();
  }
  DisplayWallLoad() {
    let force = nf(round(p5.Vector.mag(this.forceXY) / 1000, 2), 0, 2);

    push();
    textSize(20);
    textAlign(CENTER, CENTER);

    let x = 65;
    let y = 0;

    if (this.wallAngleRadians < 0) x = -65;
    //console.log(x)
    translate(x, y);
    text(force + " kN", this.fixPointWall_ID_pos.x, this.fixPointWall_ID_pos.y);
    pop();
  }

  UpdateGeometry() {
    this.wallVector = new p5.Vector.sub(this.endPos, this.startPos); //** scaleGeo ** //
    this.wallVectorUnit = this.wallVector.copy().normalize();
    this.wallAngleRadians = this.wallVector.heading();
    this.wallAngleDegrees = (this.wallAngleRadians * 180) / PI;

    this.wallVectorNormal = this.wallVector.copy().rotate(-PI / 2);
    this.wallVectorNormalUnit = this.wallVectorNormal.copy().normalize();

    this.wallLength = this.wallVector.mag() * 10; //** [mm]

    //** this.startPos Set in changesystem.ChangeWallPos() //** scaleGeo ** //
    //** this.centerPos Set in changesystem.ChangeWallPos() //** scaleGeo ** //
    //** this.endPos Set in changesystem.ChangeWallPos() //** scaleGeo ** //

    //** Set coordinates with respect to paper 0,0
    this.startPos.x = (this.startPos_o.x - graph.posOrigo.x) * scaleGeo; //** scaleGeo **//
    this.startPos.y = (this.startPos_o.y - graph.posOrigo.y) * scaleGeo; //** scaleGeo **//

    this.endPos.x = (this.endPos_o.x - graph.posOrigo.x) * scaleGeo; //** scaleGeo **//
    this.endPos.y = (this.endPos_o.y - graph.posOrigo.y) * scaleGeo; //** scaleGeo **//

    //** Not scaleGeo on centerPos because scaleGeo already on startPos and endPos
    this.centerPos.x =
      this.startPos.x + 0.5 * (this.endPos.x - this.startPos.x);
    this.centerPos.y =
      this.startPos.y + 0.5 * (this.endPos.y - this.startPos.y);
    
    //**
    this.H = 1000*buttonRollor_H.ReadValue();
    this.E = 1000*buttonRollor_E.ReadValue();
    this.G = 1000*buttonRollor_G.ReadValue();
    
    //console.log(this.H)

    /*
    this.startPos_o = p5.Vector.add(
      this.startPos_o,
      p5.Vector.mult(this.wallVectorUnit, 0 * this.wallLength)
    );

    this.centerPos_o = p5.Vector.add(
      this.startPos_o,
      p5.Vector.mult(this.wallVectorUnit, 0.5 * this.wallLength)
    );

    this.endPos_o = p5.Vector.add(
      this.endPos_o,
      p5.Vector.mult(this.wallVectorUnit, 0 * this.wallLength)
    );
    */

    this.area = this.wallLength * this.t; //** [mm2]

    this.cos = round(cos(this.wallAngleRadians), 100); //**round otherwise 0 dont show proporly in table
    this.sin = round(sin(this.wallAngleRadians), 100);

    this.cos2 = round(pow(this.cos, 2), 100);
    this.sin2 = round(pow(this.sin, 2), 100);

    this.sincos = round(this.sin * this.cos, 100);
    

    //**Stiffness Cf = GLt/H equivalent to C [N/mm]
    if (button_Shear.state == 1) {
      this.Cns_n = this.G * this.t * this.wallLength/this.H; //**(1) [N/mm]
      this.Cns_s = 0; //**noStiffnessPerpendicular //**(2)
      //console.log(this.wallLength )
    }

    //**Stiffness Cb = 3EI/H^3, (I=1/12*t*L^3) equivalent to C //**(1) [N/mm]
    if (button_Bending.state == 1) {
      this.I =(1 / 12) * this.t * pow(this.wallLength, 3)  //** [mm4]
      this.Cns_n = 3*this.E*this.I/pow(this.H,3); //**(1) [N/mm]
      this.Cns_s = 0; //**noStiffnessPerpendicular //**(2)
    }
    
    //console.log(this.Cns_n)

    //this.Cxy_x = abs(this.Cns_n * this.sin2);
    //this.Cxy_y = abs(this.Cns_s * this.cos2);

    //console.log(this.wallLength)
  }
  Calculate(FC) { //** FC [mm]
    //console.log(this.Cns_n)
    this.A1 = this.Cns_n * this.cos2 + this.Cns_s * this.sin2; //** [N/mm]
    this.A2 = this.Cns_s * this.cos2 + this.Cns_n * this.sin2; //** [N/mm]
    this.A3 = (this.Cns_n - this.Cns_s) * this.sincos; //** [N/mm]

    this.B1 =
      this.centerPos.y * 10 * (this.Cns_n * this.cos2 + this.Cns_s * this.sin2) -
      this.centerPos.x * 10 * (this.Cns_n - this.Cns_s) * this.sincos; //** [N]
    this.B2 =
      this.centerPos.x * 10 * (this.Cns_s * this.cos2 + this.Cns_n * this.sin2) -
      this.centerPos.y * 10 * (this.Cns_n - this.Cns_s) * this.sincos;
    
    //console.log("wall line 363: " + this.B2)
    
    this.D = this.A1*this.A2-pow(this.A3,2); //** [(N/mm)^2]

    this.n_nFC =
      (this.centerPos.x*10 - FC.x) * 1 * this.cos +
      (this.centerPos.y*10 - FC.y) * 1 * this.sin;
    this.s_sFC =
      (this.centerPos.y*10 - FC.y) * 1 * this.cos -
      (this.centerPos.x*10 - FC.x) * 1 * this.sin;
    //this.Cxy_xy = this.Cxy_x * this.centerPos.y;
    //this.Cxy_yx = this.Cxy_y * this.centerPos.x;

    //console.log("wall line 374: " + this.s_sFC)
    //**dist from wallCenter to FC 
    this.dist_x_FC = (this.centerPos.x*10 - FC.x) * 1; //** [mm]
    this.dist_y_FC = (this.centerPos.y*10 - FC.y) * 1; //** [mm]
    
    //console.log(this.dist_x_FC)
  }

  OverlapID(pos) {
    //**Wall_ID FixPoint
    let distToID = dist(
      this.fixPointWall_ID_pos.x,
      this.fixPointWall_ID_pos.y,
      pos.x,
      pos.y
    );
    if (distToID < 1 * this.fixPointsDiameter) {
      this.OverlapHighlight(this.fixPointWall_ID_pos);
      this.testOverlapID = true;
      return true;
    } else {
      this.testOverlapID = false;
      return false;
    }
  }
  OverlapStartPos(pos) {
    //**Wall_Start FixPoint
    let distToStart = dist(this.startPos_o.x, this.startPos_o.y, pos.x, pos.y);
    if (distToStart < 1 * this.fixPointsDiameter) {
      this.OverlapHighlight(this.startPos_o);
      return true;
    }
    return false;
  }
  OverlapEndPos(pos) {
    //**Wall_End FixPoint
    let distToEnd = dist(this.endPos_o.x, this.endPos_o.y, pos.x, pos.y);
    if (distToEnd < 1 * this.fixPointsDiameter) {
      this.OverlapHighlight(this.endPos_o);
      return true;
    }
    return false;
  }
  OverlapCenter(pos) {
    //**Wall_Center FixPoint
    let distToCenter = dist(
      this.centerPos_o.x,
      this.centerPos_o.y,
      pos.x,
      pos.y
    );
    if (distToCenter < 1 * this.fixPointsDiameter) {
      this.OverlapHighlight(this.centerPos_o);
      return true;
    }
    return false;
  }
  OverlapHighlight(pos) {
    push();
    if (mouseIsPressed) {
      fill(0, 255, 0, 100);
    } else {
      fill(100, 100, 100, 100);
    }
    noStroke();
    circle(pos.x, pos.y, this.fixPointsDiameter);
    pop();
  }

  DisplayButtonRollor(pos) {
    push();
    let p = this.insertPointButtonRollor_ID;
    
        this.insertPointButtonRollor_ID.x = this.fixPointWall_ID_pos.x
      this.insertPointButtonRollor_ID.y =  this.fixPointWall_ID_pos.y

    if (
     this.OverlapID(pos)
    ) {
      //console.log("wall line 439 - ID " + this.id)
        let translatePoint_ID = new p5.Vector();
        translatePoint_ID.x = p.x ;
        translatePoint_ID.y = p.y ;

        translate(translatePoint_ID.x, translatePoint_ID.y);

        this.graphPosNoScale_ID = new p5.Vector.sub(
          mousePosWorld,
          translatePoint_ID
        );

        //** Show buttonRoller if mouseY is in cell
        let test = pos.y - translatePoint_ID.y;
     
        //if (test > -20 && test < 35) {
          push();
          noStroke();
          fill(255, 255, 255);
          rect(-15, -15, 30, 30);

          pop();
          this.buttonRollor_ID.DisplayButonRollor(
            this.graphPosNoScale_ID
          );
          this.id = this.buttonRollor_ID.ReadValue();
       // } else {
          
         //   this.buttonRollor_ID.overlapCiffer = false;
          
       // }
      }
     else {
      //** Sets all overlapCiffer to false
      this.buttonRollor_ID.overlapCiffer = false;
    }

    pop();
  }
}
