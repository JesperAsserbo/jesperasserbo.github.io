class Skin {
  constructor(startPos, w, h, G, t, id) {
    //** Geometry
    this.startPos = startPos;
    this.w = w;
    this.h = h;
    this.fadeColor = 0;

    this.centerSkin = new p5.Vector(
      this.startPos.x + 0.5 * this.w,
      this.startPos.y + 0.5 * this.h
    );

    this.id = id;

    //** MaterialCharac
    this.G = 500; //N/mm2
    this.t = t;

    //** Angle at Def=1;
    this.a_w = 1 / this.h; //** angle def 1
    this.a_h = 1 / this.w; //** angle def 1

    //** Diagonal
    this.diagonalStart = pow((pow(this.w, 2) + pow(this.h, 2), 0.5));
    this.diagonalDef; //** calculated in result.DisplayDef();

    //** AngleDef determined in result
    this.aDef_w = 0;
    this.aDef_h = 0;

    //** Used in this.StiffnessMatrixLocal()
    this.factorLimitShear = 1;
    this.shear = 0;

    //** connected status checked in SkinSystem.SkinConnectedSet()
    this.connected_11 = false;
    this.connected_12 = false;

    this.connected_21 = false;
    this.connected_22 = false;

    this.connected_31 = false;
    this.connected_32 = false;

    this.connected_41 = false;
    this.connected_42 = false;

    this.skinExist = true;
    this.skinState = 1; //** 1=>On, 0=>Off

    /*
    //** StringerForce
    this.stringer_11 = 0;
    this.stringer_11_sum = 0;

    this.stringer_21 = 0;
    this.stringer_21_sum = 0;

    this.stringer_31 = 0;
    this.stringer_41 = 0;
    */

    this.topRigth_x = this.startPos.x + this.w;
    this.bottom_y = this.startPos.y + this.h;
    
    //** StringerForce - set i result.....
    this.stringer_11=0;
    this.stringer_21=0;

    //** Connect skins through Stringers/Element (when no skin)
    this.stringerTopExist = false;
    this.stringerBottomExist = false;
    this.stringerLeftExist = false;
    this.stringerRigthExist = false;

    this.fixPoint_t = new p5.Vector(0, 0); //** placed in result.TabelResult()
    this.fixPointDiameter = 20;
    this.fixPointOverlap_t = false;

    //** ButtonRollor_skin_t
    this.buttonRollor_skin_t = new ButtonRollor(
      0, //** pos1x - textPro BR
      50-2.5, //** pos1y - textPro BR
      20, //** pos2x - "=" BR
      155, //** pos3x - ciffers BL
      165, //** pos4x - unit BR
      3, // prefix
      1, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "", // textPro
      "", // textMid
      "", // textPre
      5, // startValue
      0.1, // minValue
      999 // maxValue
    );

    this.graphPosNoScale_skin_t;
  }

  UpdateSkin() {
    //**if one is equal to zero => product is equal to zero
    if (this.G * this.t * this.a_w * this.a_h == 0) this.skinExist = false;
    else this.skinExist = true;
    //console.log("*" + this.skinExist);

    //**Update CenterSkin
    this.centerSkin = new p5.Vector(
      this.startPos.x + 0.5 * this.w,
      this.startPos.y + 0.5 * this.h
    );

    //** Update stringer
    this.DisplayStringer();

    //** Delete stringer if skin
    if (this.skinExist) {
      this.stringerTopExist = false;
      this.stringerBottomExist = false;
      this.stringerLeftExist = false;
      this.stringerRigthExist = false;
    }

    this.StiffnessMatrixLocal();
    // this.fadeColor +=1;

    this.topRigth_x = this.startPos.x + this.w;
    this.bottom_y = this.startPos.y + this.h;

    if (this.skinExist == false) {
      this.connected_11 = false;
      this.connected_12 = false;

      this.connected_21 = false;
      this.connected_22 = false;

      this.connected_31 = false;
      this.connected_32 = false;

      this.connected_41 = false;
      this.connected_42 = false;
    }

    //this.stringer_11_sum = 0;
   // this.stringer_21_sum = 0;

    //** Diagonal
    this.diagonalStart = pow(pow(this.w, 2) + pow(this.h, 2), 0.5);

    //** FixPoint
    //this.fixPoint_t.x = this.centerSkin.x;
    //this.fixPoint_t.y = this.bottom_y - 20;

    //** DigonalDeformed
    //this.bottomLeft = new p5.Vector.add(this.startPos,new p5.Vector(this.h,0))
    //this.topRigth = new p5.Vector.add(this.startPos,new p5.Vector(0,this.w))

    //circle(this.bottomLeft.x,this.bottomLeft.y,35)
  }

  //** Check Overlap 
  //** Display buttonRollor
  OverlapFixPoint_skin_t(pos) {
    //**If overlap fixpoint variable true ** Checked in skinSystem.skinMatrix.UpdateSkinSystem()
    //**True while in boxLimits otherwise false
    let distFixPoint_t = dist(
      pos.x,
      pos.y,
      this.fixPoint_t.x,
      this.fixPoint_t.y
    );

    if (distFixPoint_t < this.fixPointDiameter) {
      this.fixPointOverlap_t = true;
    }
    // console.log("Overlap: " + this.fixPointOverlap_t);

    if (this.fixPointOverlap_t) {
      push();
      //fill(0, 250, 0, 50);
      //circle(this.fixPoint_t.x, this.fixPoint_t.y, this.fixPointDiameter);
      pop();

      let limit_x = this.fixPoint_t.x;
      let limit_y = this.fixPoint_t.y;

      let left = limit_x - 50;
      let right = limit_x + 50;
      let top = limit_y - 25;
      let bottom = limit_y + 25;
      let w = right - left;
      let h = bottom - top;

      //** Limits for mouse => buttonRollor displayed
      //rect(left, top, w, h);

      //** Display buttonRollor
      if (this.skinExist) {
        //** frame/Background
        push();
        fill(250, 250, 250, 255);
        noStroke();
        //** Background => hide value while buttonRoller is active
        rect(limit_x - 48, limit_y - 25, 96, 45);
        pop();

        this.DisplayButtonRollor_skin_t();
      }

      if (
        //** Buttonrollor not displayed if...
        left > mousePosWorld.x ||
        mousePosWorld.x > right ||
        top > mousePosWorld.y ||
        mousePosWorld.y > bottom
      ) {
        this.fixPointOverlap_t = false;
        //**Set to false otherwise sometimes stuck in trueMode
        this.buttonRollor_skin_t.overlapCiffer = false;
      } else {
        //** set to undefined when not overlap => support can be deleted when skin deleted
        //** so that buttonRoller are not called in sketch
        //matrixSupport.overlapRow = undefined;
        //matrixSupport.overlapCol = undefined;
      }
      //console.log("Support.OverlapFixPoint: " + this.supportOverlap);
    }
  }

  DisplayButtonRollor_skin_t() {
    // if (this.Cy > 0) {
    push();
    //console.log(graph.insertGeo.x)
    let translatePoint = new p5.Vector();
    translatePoint.x = this.fixPoint_t.x - 110;
    translatePoint.y = this.fixPoint_t.y - 30;
    translate(translatePoint.x, translatePoint.y);

    this.graphPosNoScale_skin_t = new p5.Vector.sub(
      mousePosWorld,
      translatePoint
    );
    

    //**Display ButtonRollor and Read Value
    this.t = this.buttonRollor_skin_t.ReadValue() * 1;
    

    //console.log(this.t)
    this.buttonRollor_skin_t.DisplayButonRollor(this.graphPosNoScale_skin_t);

    //line(0, 0, this.buttonRollor_Cy.pos1.x, this.buttonRollor_Cy.pos1.y);
    //line(0, 0, this.graphPosNoScale_Cy.x, this.graphPosNoScale_Cy.y);
    pop();
    // }
  }

  SkinDeformed() {
    /*
    this.bottomLeft = new p5.Vector.add(this.startPos,new p5.Vector(this.h,0))
    this.topRigth = new p5.Vector.add(this.startPos,new p5.Vector(0,this.w))
     this.diagonalDef = dist()
     */
  }

  DisplayStringer() {
    push();

    strokeWeight(3);
    if (this.stringerTopExist) {
      line(
        this.startPos.x,
        this.startPos.y,
        this.startPos.x + this.w,
        this.startPos.y
      );
    }
    if (this.stringerBottomExist) {
      line(
        this.startPos.x,
        this.startPos.y + this.h,
        this.startPos.x + this.w,
        this.startPos.y + this.h
      );
    }
    if (this.stringerLeftExist) {
      line(
        this.startPos.x,
        this.startPos.y,
        this.startPos.x,
        this.startPos.y + this.h
      );
    }
    if (this.stringerRigthExist) {
      line(
        this.startPos.x + this.w,
        this.startPos.y,
        this.startPos.x + this.w,
        this.startPos.y + this.h
      );
    }
    pop();
  }

  //** Called from SkinSystem
  DisplaySkin() {
    push();

    //** if skin exist => draw skin
    if (this.skinExist) {
      fill(100, 100, 100, 50 + this.fadeColor);
      noStroke();
      //strokeWeight(3)
      rect(this.startPos.x, this.startPos.y, this.w, this.h);

      //**  skin id
      noStroke();
      fill(0);
      textSize(15);
      textAlign(CENTER, CENTER);
      text(
        nf(this.id, 2, 2),
        this.startPos.x + 30, //this.w / 2,
        this.startPos.y + 15 //this.h / 2
      );

      //** FixPoint
      noFill();
      stroke(0);
      //circle(this.fixPoint_t.x, this.fixPoint_t.y, 20);
    } else {
      //console.log(this.id)
      noFill();
    }
    pop();
  }

  //** Called from SkinSystem
  DisplayConnection() {
    push();
    noFill();
    //** ROWS **

    //** if connected exist => draw connection (filled circle)
    if (this.connected_21) fill(100, 100, 100, 250);
    else noFill();
    circle(this.startPos.x + this.w - 10, this.startPos.y, 10);

    if (this.connected_41) fill(100, 100, 100, 250);
    else noFill();
    circle(this.startPos.x + this.w - 10, this.startPos.y + this.h, 10);

    if (this.connected_11) fill(100, 100, 100, 250);
    else noFill();
    circle(this.startPos.x + 10, this.startPos.y, 10);

    if (this.connected_31) fill(100, 100, 100, 250);
    else noFill();
    circle(this.startPos.x + 10, this.startPos.y + this.h, 10);

    //** COLUMNS **
    //** if connected exist => draw connection (filled circle)

    if (this.connected_32) fill(100, 100, 100, 250);
    else noFill();
    circle(this.startPos.x, this.startPos.y + this.h - 10, 10);

    if (this.connected_42) fill(100, 100, 100, 250);
    else noFill();
    circle(this.startPos.x + this.w, this.startPos.y + this.h - 10, 10);

    if (this.connected_12) fill(100, 100, 100, 250);
    else noFill();
    circle(this.startPos.x, this.startPos.y + 10, 10);

    if (this.connected_22) fill(100, 100, 100, 250);
    else noFill();
    circle(this.startPos.x + this.w, this.startPos.y + 10, 10);

    pop();
  }

  StiffnessMatrixLocal() {
    let Gt = this.G * this.t;

    this.v11 = Gt * -this.w * 10 * scaleGeo;
    this.v12 = Gt * -this.h * 10 * scaleGeo;

    this.v21 = this.v11;
    this.v22 = Gt * this.h * 10 * scaleGeo;

    this.v31 = Gt * this.w * 10 * scaleGeo;
    this.v32 = this.v12;

    this.v41 = this.v31;
    this.v42 = this.v22;

    this.a11 = -1 / (this.h * 10 * scaleGeo);
    this.a12 = -1 / (this.w * 10 * scaleGeo);

    this.a21 = this.a11;
    this.a22 = 1 / (this.w * 10 * scaleGeo);

    this.a31 = 1 / (this.h * 10 * scaleGeo);
    this.a32 = this.a12;

    this.a41 = this.a31;
    this.a42 = this.a22;
  }
}
