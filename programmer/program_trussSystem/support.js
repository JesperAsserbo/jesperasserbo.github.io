class Support {
  //** Pass by ref - Objects and arrays
  //** Pass by value - primitives as int, float, boolean... (NOT objects and arrays)

  constructor(nodePos, angle,nodeID) {
    this.nodeID = nodeID;

    this.posSupport = new p5.Vector(nodePos.x, nodePos.y);

    this.posSupportBase = new p5.Vector();

    //** Set supportLine
    this.supportLineStart = new p5.Vector(nodePos.x, nodePos.y);

    //** Horisontal line
    this.supportLineEnd = p5.Vector.add(
      this.supportLineStart,
      new p5.Vector(100, 0)
    );

    this.supportLine = p5.Vector.sub(
      this.supportLineEnd,
      this.supportLineStart
    );

    this.distParticleToSupportLine = new p5.Vector(0, 0);
    this.dotProduct = 0; //** To determine if tension or compression => see DistToSupport(particle)

    this.C = 1 * 10000; //** this.C = 1 * 1.000 => 1.000N/mm
    this.C_angle = angle; //0; //this.supportLine.angleBetween(new p5.Vector(100, 0));

    //this.C_angleStep = 5;
    this.degreeStepSize = 5;

 
    this.fixPointSupport = new p5.Vector(0, 0);
    this.fixPointSupport.x =
      this.posSupport.x + cos(this.C_angle) * 75;
    this.fixPointSupport.y =
      this.posSupport.y - sin(this.C_angle) * 75;
      

    //this.fixPointSupport = new SupportFixPoint(particle, this.C_angle); //** Pass by Reference

    //this.supportForce = new p5.Vector(0, 0);
    //this.id = this.node.id;

    /*
    //** Object
    this.buttonRollor_support = new ButtonRollor(
      0, //** pos1x - textPro BR
      0, //** pos1y - textPro BR
      0, //** pos2x - "=" BR
      0, //** pos3x - ciffers BL
      0, //** pos4x - unit BR
      3, //** prefix
      3, //** sufix =
      20, //** buttonWidth =
      40, //** buttonHeight =
      30, //** letterSize =
      "", //** textPro =
      "", //** textMid =
      "", //** textPre =
      1, //** startValue =
      0.001, //** minValue =
      100 //** maxValue =
    );
    */
  }

  Update(nodePos) {
    this.posSupport = new p5.Vector(nodePos.x, nodePos.y);

    //************************
    //** Update FixPoint *****
    //************************
    this.fixPointSupport.x =
      this.posSupport.x + cos(this.C_angle) * 75;
    this.fixPointSupport.y =
      this.posSupport.y + sin(this.C_angle) * 75;

    //console.log(this.C_angle)

    /*
    //************************
    //** Update SupportLine **
    //************************

    this.supportLineStart = new p5.Vector(
      this.posSupportStartScaled.x,
      this.posSupportStartScaled.y
    );

    this.supportLineEnd = p5.Vector.add(
      this.supportLineStart,
      new p5.Vector(50 * cos(-this.C_angle), 50 * sin(-this.C_angle))
    );

    this.supportLine = p5.Vector.sub(
      this.supportLineEnd,
      this.supportLineStart
    );

    //**********************
    //** Draw SupportLine **
    //**********************
    */

    /*
    push();
    stroke(255, 0, 0, 100);
    strokeWeight(10);
    line(
      this.supportLineStart.x,
      this.supportLineStart.y,
      this.supportLineEnd.x,
      this.supportLineEnd.y
    );
    pop();
    */

    //*************************
    //** supportForce *********
    //*************************
    //this.supportForce = p5.Vector.mult(this.distParticleToSupportLine, this.C); //** => N & Static
    //console.log(round(this.supportForce.mag(),1));

    //**************************
    //** posSupportBase*********
    //**************************
    //this.posSupportBase.x = this.posSupportScaled.x+80*cos(-this.C_angle+PI/2)
    //this.posSupportBase.y = this.posSupportScaled.y+80*sin(-this.C_angle+PI/2)

    //************************************************************************************
    //** To show point on supportLine (not nessesary)
    //this.springDef = this.DistToSupport();
  }

  //** called from changeSystem
  AdjustSupport(pos, nodeSupport) {
    
    //*************************
    //** Overlap fixpoint ***** START
    //*************************

    if (mouseIsPressed) {
      let angleToMouse = new p5.Vector.sub(pos, nodeSupport.pos);

   // console.log("AdjustSupport - AngleToMouse " + angleToMouse);
      //*************************
      //** Move angle in steps **
      //*************************

      //   console.log("support Line 176 - supportNodeLogged " +  supportNodeLogged);
      // console.log("support Line 177 - supportNumberLogged " +  supportNumberLogged)

      /*
      this.C_angleStep =
        -round(degrees(angleToMouse.heading()) / this.degreeStepSize) *
        this.degreeStepSize;
*/
           this.C_angleStep =radians(round(degrees(angleToMouse.heading()) / this.degreeStepSize) *
        this.degreeStepSize);
     
      //console.log("********** Support Line 160 ************** " + this.C_angleStep);
      /*
      if (
        degrees(angleToMouse.heading()) > 177.5 ||
        degrees(angleToMouse.heading()) < -177.5
      )*/
      //this.C_angle = -(angleToMouse.heading()-PI/2);
   //this.C_angle = -((angleToMouse.heading()-0*PI/2));
      this.C_angle = this.C_angleStep

// console.log("support line 169 " + this.C_angle)
      //console.log(angleToMouse.heading())
      /*
      //** Green ligth
      push();
      fill(0, 255, 0, 150);
      if (mouseIsPressed)
        circle(
          this.fixPointSupport.x,
          this.fixPointSupport.y,
          15
        );
      pop();
      */
    }
    //*************************
    //** Overlap fixpoint ***** END
    //*************************
  }

  DisplayFixpoint() {
    push();
    stroke(0);
    circle(this.fixPointSupport.x, this.fixPointSupport.y, 15);

    //** Delete Highrligth RED
    if (button_Support_Delete.state == 1) {
      fill(255, 0, 0, 100);
      noStroke();
      circle(this.fixPointSupport.x, this.fixPointSupport.y, 25);
    }
    pop();
  }

  Display() {
    push();
    //** FixPointSupport
    //this.fixPointSupport.DisplayFixPoint();
    //this.DisplaySupportLine();

    /*
    line(
      this.posSupport.x,
      this.posSupport.y,
      this.fixPointSupport.posFixPoint.x,
      this.fixPointSupport.posFixPoint.y
    );
    */

    //circle(this.fixPointSupport.x, this.fixPointSupport.y, 15);

    //**Fjeder
    translate(this.posSupport.x, this.posSupport.y);
    rotate(this.C_angle);
    
    //** Support **
    fill(255);
    stroke(0);
    strokeWeight(2);

    triangle(30, 0, 45, -15, 45, 15);
    line(10, 0, 0, 0);
    line(10, 0, 12.5,10);
    line(12.5, 10, 17.5, -10);
    line(17.5, -10, 20, 0);
    line(20, 0, 30, 0);
    fill(0);
    circle(0, 0, 4);
    circle(30, 0, 4);

    //** wheels
    circle(48, -7, 6);
    circle(48, 7, 6);

    //** ground
    line(52, -16, 52, 16);

    

    /* Vertical support when alfa = 0
    triangle(0, 30, 0 - 15, 0 + 45, 0 + 15, 0 + 45);

    line(0, 0, 0, 10);
    line(0, 10, -10, 12.5);
    line(-10, 12.5, 10, 17.5);
    line(10, 17.5, 0, 20);
    line(0, 30, 0, 20);
    fill(0);
    circle(0, 0, 4);
    circle(0, 30, 4);

    //** wheels
    circle(-7, 48, 6);
    circle(7, 48, 6);

    //** ground
    line(-16, 52, 16, 52);
*/

    pop();
  }


  //** ChatGPT
DisplayReaction() {
  let ux = matrixSolve.matrix_x[2 * this.nodeID];
  let uy = matrixSolve.matrix_x[2 * this.nodeID + 1];

  this.R = this.C * (ux * cos(this.C_angle) + uy * sin(this.C_angle)) / 1000;
  if(this.R == 0) return;
  if(abs(this.R) <0.01) return;

  push();
  translate(this.fixPointSupport.x, this.fixPointSupport.y);
  rotate(this.C_angle);

  let L = abs(this.R);
  let a = 10;
  let s = this.R >= 0 ? 1 : -1;

  stroke(this.R <= 0 ? "blue" : "red");
  fill(this.R <= 0 ? "blue" : "red");
  strokeWeight(4);

  //** Arrow shaft always extends away from fixpoint
  line(0, 0, L, 0);

  //** Arrowhead changes position
  let x = this.R >= 0 ? 0 : L;

  triangle(
    x, 0,
    x + s * a, -a / 2,
    x + s * a, a / 2
  );

//** Reaction value at arrow end farthest from fixpoint
push();
translate(L, 0);
rotate(-this.C_angle);
noStroke();
textSize(20);
textAlign(CENTER,CENTER);
  let factor = 1
  if(this.C_angle < 0) factor = -1
text(abs(nf(round(this.R,1), 0, 1)) + " kN", 0, 20*factor);
pop();

  pop();
}


  /*
  DisplayReaction() {
  let ux = matrixSolve.matrix_x[2 * this.nodeID];
  let uy = matrixSolve.matrix_x[2 * this.nodeID + 1];

  //** Reaction in local support direction
  this.R = this.C * (ux * cos(this.C_angle) - uy * sin(this.C_angle)) / 1000;

  //** Display reaction
  push();
  translate(this.fixPointSupport.x, this.fixPointSupport.y);
  rotate(this.C_angle);

  strokeWeight(4);
  line(0, 0, -this.R, 0);

  pop();
}
*/
/*
  DisplayReaction(){
    console.log("support line 278")
    //** calc Reaction Value
    let ux = matrixSolve.matrix_x[2*this.nodeID];
    let uy = matrixSolve.matrix_x[2*this.nodeID +1]
    console.log("Node " + this.nodeID + " supportAngle " + cos(this.C_angle))
    this.R = -this.C * (-ux*cos(this.C_angle) + uy*sin(this.C_angle) )/1000
    console.log(this.R )

    //** DisplayReaction
    push();
    translate(this.fixPointSupport.x,this.fixPointSupport.y)
    rotate(this.C_angle);
    strokeWeight(4);
    let Rx = -this.C * (-ux*cos(this.C_angle) +0* uy*sin(this.C_angle) )/1000
    let Ry = -this.C * (-ux*sin(this.C_angle)*0 + uy*cos(this.C_angle) )/1000
    line(0,0,Rx,Ry)
    pop();
    
  }
  */

}
