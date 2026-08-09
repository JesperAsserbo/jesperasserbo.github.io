class WallElement {
  constructor(insertPointX, insertPointY, wallNumber) {
    //** Geometry
    this.insertPointWall = new p5.Vector(insertPointX, insertPointY);
    this.insertPointWallScaled = new p5.Vector(insertPointX, insertPointY);
    this.insertPointWallOriginal = new p5.Vector(insertPointX, insertPointY);
    this.h = 2.5; //** [m]
    this.b = 4.0; //** [m]
    this.g = 20; //** [kN/m3]
    this.t = 0.1; //** [m]
    this.fcd = 1; //** [Mpa]

    this.G = this.h * this.b * this.t * this.g;
    this.b_scaled = this.b * scaleGeo_Test;

    //** ButtonRollor move
    this.buttonRollor_t = new ButtonRollor(
      (pos1x = 0), //** textPro BR
      (pos1y = 0), //** textPro BR
      (pos2x = 550), //** "=" BR
      (pos3x = 700), //** ciffers BL
      (pos4x = 710), //** unit BR
      (prefix = 1),
      (sufix = 3),
      (buttonWidth = 20),
      (buttonHeight = 40),
      (letterSize = 30),
      (textPro = ""),
      (textMid = ""),
      (textPre = "m"),
      (startValue = 0.1),
      (minValue = 0.001),
      (maxValue = 9.99)
    );

    this.activeButtonRollor_LoadVertical = null; // index på aktuelt aktivt rektangel

    this.insertPoint_t = new p5.Vector(0, 0);

    this.wallNumber = wallNumber;

    //** In ChangeSystem.AdjustWallWidth()
    //** adjust b if lower wall do not support. evalueted in changeSystem
    this.b_adjusted_Right = Infinity;
    this.b_adjusted_Left = Infinity;

    //** b_adjusted is equal to supported section
    //** b_adjusted set in this.UpdateWall()
    this.b_adjusted = 0;

    this.wallSupported_Right = false;

    //** Limit
    this.LimitReaction = this.fcd * this.t * 1000; //** [kN/m]

    //** AdjustPoints
    this.adjustPoint_Left = new p5.Vector(
      insertPointX - (this.b * scaleGeo) / 2,
      insertPointY - this.h * scaleGeo
    );
    this.adjustPoint_Right = new p5.Vector(
      insertPointX + (this.b * scaleGeo) / 2,
      insertPointY - this.h * scaleGeo
    );

    this.logAdjustPoint_Left = false;
    this.logAdjustPoint_Right = false;

    this.adjustPoint_Left_scaled;
    this.adjustPoint_Right_scaled;

    //** Center
    this.center = new p5.Vector(
      insertPointX,
      insertPointY - 0.5 * this.h * scaleGeo
    );

    //** Atributes for calculation
    this.e_local_res = 0;
    this.M_local_res = 0;
    this.N_local_res = 0;
    this.H_local_res = 0;

    this.N_local_sum = 0; //** incl. anchorForce
    this.H_local_sum = 0;
    this.e_local_sum = 0; //** incl. anchorForce

    //** Set in sketch
    this.M_local_res_upper = 0; //** from upper wall
    this.N_local_res_upper = 0; //** from upper wall
    this.H_local_res_upper = 0; //** from upper wall

    //** Set in changeSystem.SetWallMesures()
    this.distToUpperWall_Left = 0;
    this.distToUpperWall_Right = 0;
    this.distToLowerWall_Left = 0;
    this.distToULowerWall_Right = 0;

    this.distCenterCenterLowerWall = 0;
    this.distCenterCenterUpperWall = 0;
    //** Set in changeSystem.SetWallMesures()

    //** Set in this.Calculate();
    this.inStabil_Left = false;
    this.inStabil_Right = false;
    this.stabil = true;
    this.wallFailiure = false; //** Set in this.WallUpdate();
    this.tippingPoint = 0;

    this.anchorForce = 0;

    this.b_eff = 0; //** this.b;

    this.reaction = 0; //*** Distributed -- this.N_local_res / this.b;

    this.anchor_left = new p5.Vector(insertPointX, insertPointY + 25);

    /*
    this.anchor_Right = new p5.Vector(
      insertPointX + (this.b * scaleGeo) / 2 - 50,
      insertPointY + 25
    );
    */

    //** Log Load
    this.log_Load_i;

    this.logAnchorAdjustPoint_Left = false;
    this.anchor_dist = 0; //this.anchor_left.x - this.adjustPoint_Left.x;

    //** LoadArrays
    this.loadHorisontal_Array = [];
    this.loadVertical_Array = [];

    this.logLoadVertical = false;

    //** Load G
    this.loadVertical_Array.push(
      new LoadVertical(
        this.insertPointWall.x,
        this.insertPointWall.y - 0.5 * this.h,
        0 //** this.loadCase
      )
    );

    //** Test Load
    this.loadHorisontal_Array.push(
      new LoadHorisontal(this.adjustPoint_Left.x, this.adjustPoint_Left.y)
    );
    /*
    this.loadVertical_Array.push(
      new LoadVertical(this.insertPointWall.x, this.insertPointWall.y - this.h)
    );*/
  }

  Display_ButtonRollor_t(pos) {
    push();
    let p = this.insertPoint_t;

    let translatePoint_t = new p5.Vector();
    translatePoint_t.x = -310;
    translatePoint_t.y = this.adjustPoint_Left.y + 80;

    /*
        line(
          mousePosWorld.x,
          mousePosWorld.y,
          translatePoint_t.x,
          translatePoint_t.y
        );
        */

    fill(0);
    translate(translatePoint_t.x, translatePoint_t.y);

    this.graphPosNoScale_t = new p5.Vector.sub(mousePosWorld, translatePoint_t);

    this.buttonRollor_t.DisplayButonRollor(this.graphPosNoScale_t);
    pop();
  }

  Calculate() {
    this.M_local_res = 0; //** From extern forces
    this.H_local_res = 0; //** From extern forces
    this.N_local_res = 0; //** From extern forces
    this.e_local_res = 0; //** From extern forces

    this.N_local_sum = 0; //** incl. anchorForce
    this.H_local_sum = 0;
    this.e_local_sum = 0; //** incl. anchorForce

    //console.log(this.H_local_res_upper)

    this.anchorForce = 0;

    //** Moment around bottomLeft
    //** Horisontal
    for (let i = 0; i < this.loadHorisontal_Array.length; i++) {
      let h =
        ((this.insertPointWall.y - this.loadHorisontal_Array[i].ip_Load_H.y) /
          100) *
        scaleGeo_Test; //** [m]

      let H = this.loadHorisontal_Array[i].value_load_H; //** [kN]

      this.H_local_res += H; //** [kN]
      this.M_local_res += h * H; //** [kNm]
    }

    //** Vertical
    for (let i = 0; i < this.loadVertical_Array.length; i++) {
      let x =
        0.5 * this.b_scaled +
        (this.loadVertical_Array[i].distToCenter / 100) * scaleGeo_Test;

      //  (this.loadVertical_Array[i].ip_Load_N.x - this.adjustPoint_Left.x) / scaleGeo; //** [m]
      let N = this.loadVertical_Array[i].value_load_N; //** [kN]

      this.N_local_res += N; //** [kN]
      this.M_local_res += x * N; //** [kNm]
    }

    //** From upper wall
    this.N_local_res += this.N_local_res_upper;
    this.H_local_res += this.H_local_res_upper;

    //** M_local_res_upper is with respect to A (bottom Left cornor)
    this.M_local_res +=
      this.M_local_res_upper +
      this.H_local_res_upper * this.h +
      this.N_local_res_upper * this.distToUpperWall_Left;

    //** Calculation e_res in relation to A (left wall edge)
    this.e_local_res = this.M_local_res / this.N_local_res; //** [m]

    //** ********** STABILITY ************

    //** Right condition (if N_res right of Tp supported section)
    if (
      this.e_local_res >=
      max(this.distToLowerWall_Left * scaleGeo_Test, 0) +
        0.5 * this.b_adjusted * scaleGeo_Test
    ) {
      //this.b_eff = 2 * (this.b_adjusted - this.e_local_res); //** [m]

      if (this.distToLowerWall_Right >= 0) {
        this.b_eff = 2 * (this.b_scaled - this.e_local_res);
        //console.log("line 161 udregn this.b_eff 1: " + this.b_eff);
      } else {
        this.b_eff =
          2 *
          (this.b_scaled -
            this.e_local_res +
            this.distToLowerWall_Right * scaleGeo_Test);
        //console.log("line 161 udregn this.b_eff 2: " + this.b_eff);
      }
    }

    //** Left condition (if N_res left of Tp supported section)
    if (
      this.e_local_res <=
      max(this.distToLowerWall_Left * scaleGeo_Test, 0) +
        0.5 * this.b_adjusted * scaleGeo_Test
    ) {
      if (this.distToLowerWall_Left >= 0) {
        this.b_eff =
          2 * (this.e_local_res - this.distToLowerWall_Left * scaleGeo_Test);
        console.log("line 161 udregn this.b_eff 1: " + this.b_eff);
      } else {
        this.b_eff = 2 * this.e_local_res;
        console.log("line 161 udregn this.b_eff 2: " + this.b_eff);
      }
    }

    this.reaction = this.N_local_res / this.b_eff; //** [kN/m]

    let testValue_Left = 0;
    let testValue_Right = 0;

    //** LEFT Testvalue
    if (this.distToLowerWall_Left >= 0) {
      testValue_Left =
        this.distToLowerWall_Left * scaleGeo_Test +
        (0.5 * this.N_local_res) / this.LimitReaction;
    }

    if (this.distToLowerWall_Left < 0) {
      testValue_Left = (0.5 * this.N_local_res) / this.LimitReaction;
    }

    //** RIGHT Testvalue
    if (this.distToLowerWall_Right < 0) {
      testValue_Right =
        this.b_scaled +
        this.distToLowerWall_Right * scaleGeo_Test -
        (0.5 * this.N_local_res) / this.LimitReaction;
    }

    if (this.distToLowerWall_Right >= 0) {
      testValue_Right =
        this.b_scaled - (0.5 * this.N_local_res) / this.LimitReaction;
    }

    //** DisplayLimits
    let limitStability_Left =
      this.adjustPoint_Left.x + (testValue_Left * 100) / scaleGeo_Test;
    let limitStability_Right =
      this.adjustPoint_Left.x + (testValue_Right * 100) / scaleGeo_Test;

    line(
      limitStability_Left,
      this.insertPointWall.y - 5,
      limitStability_Left,
      this.insertPointWall.y + 5
    );

    line(
      limitStability_Right,
      this.insertPointWall.y - 5,
      limitStability_Right,
      this.insertPointWall.y + 5
    );

    //** TippingPoint
    line(
      this.tippingPoint,
      this.insertPointWall.y - 5,
      this.tippingPoint,
      this.insertPointWall.y + 5
    );

    //** Determing stability
    //** *********** STABILITY ****************
    this.tippingPoint =
      this.adjustPoint_Left.x +
      (max(this.distToLowerWall_Left, 0) + 0.5 * this.b_adjusted) * 100;

    if (
      limitStability_Left <= this.tippingPoint &&
      this.tippingPoint <= limitStability_Right
    ) {
      this.inStabil_Left = false;
      this.inStabil_Right = false;
      this.stabil = true;
    }

    //** ********** NOT STABILITY ************

    //** Instability LEFT
    if (this.e_local_res < testValue_Left) {
      this.inStabil_Left = true;
      this.inStabil_Right = false;
      this.stabil = false;
      this.InstabilityLeft();
    }
    //console.log(testValue_Left)

    //** Instability RIGHT
    if (this.e_local_res > testValue_Right) {
      this.inStabil_Left = false;
      this.inStabil_Right = true;
      this.stabil = false;
      this.InstabilityRight();
    }

    // console.log("wallElement line 382  - Test - this.InstabilityRight() problems" )
  }

  //** Called from this.Calculate();
  InstabilityLeft() {
    this.xt =
      ((this.anchor_left.x - this.adjustPoint_Left.x) / 100) * scaleGeo_Test; //** [m]

    //** this.b_adjusted_Left set in changeSystem.AdjustWallWidth()
    this.A = 0.5;
    this.B = -this.xt + max(this.distToLowerWall_Left * scaleGeo_Test, 0); //** [m]
    //console.log("wallElement line 385 maxB " + max(this.distToLowerWall_Left*scaleGeo_Test, 0))
    this.C =
      (this.N_local_res * (-this.e_local_res + this.xt)) / this.LimitReaction; //**[m^2]
    //console.log("wallElement line 385 this.e_local_res " + this.e_local_res)
    this.D = pow(this.B, 2) - 4 * this.A * this.C;
    this.b_eff = (-this.B - pow(this.D, 0.5)) / (2 * this.A); //** [m]
    this.anchorForce = this.b_eff * this.LimitReaction - this.N_local_res; //** [kN]

    this.N_local_sum = this.N_local_res + this.anchorForce; //** [kN]
    this.e_local_sum = max(this.distToLowerWall_Left, 0) - 0.5 * this.b_eff; //scaleGeo_Test; //** [m]

    this.reaction = this.N_local_res / this.b_eff; //** [kN/m]
  }
  InstabilityRight() {
    this.xt =
      ((this.anchor_left.x - this.adjustPoint_Left.x) / 100) * scaleGeo_Test; //** [m]

    //** this.b_adjusted_Right set in changeSystem.AdjustWallWidth()
    //console.log("wallElement line 385 b_scaled " + this.b_scaled)
    this.A = 0.5;
    this.B = this.xt - min(this.b_scaled, this.b_adjusted_Right); //** [m]
    this.C =
      (this.N_local_res * (this.e_local_res - this.xt)) / this.LimitReaction; //**[m^2]
    this.D = pow(this.B, 2) - 4 * this.A * this.C;
    this.b_eff = (-this.B - pow(this.D, 0.5)) / (2 * this.A); //** [m]
    this.anchorForce = this.b_eff * this.LimitReaction - this.N_local_res; //** [kN]

    //console.log("wallElement line 394 this.b_eff ** " + this.b_eff)

    //console.log("wallElement line 393 b_adjusted_Right " + this.b_adjusted_Right)
    this.N_local_sum = this.N_local_res + this.anchorForce; //** [kN]
    this.e_local_sum =
      min(this.b_scaled, this.b_adjusted_Right) - 0.5 * this.b_eff; ///scaleGeo_Test; //** [m]
    //console.log("wallElement line 397 test e_local_sum " + this.e_local_sum)
    this.reaction = this.N_local_res / this.b_eff; //** [kN/m]
  }

  //** Called from sketch
  DisplayReaction_Instability_Left() {
    if (this.wallFailiure) return;
    if (!this.inStabil_Left) return; //** If true continue
    //** If not stability **
    //if (this.anchorForce > 0) {
    push();

    //** Translate point.
    let leftsupportEdge = 0;

    //console.log("WallElement line 416 ....... this.b_adjusted : " +this.b_adjusted)

    if (this.e_local_res < 0.5 * this.b_adjusted * scaleGeo_Test) {
      if (this.distToLowerWall_Left <= 0)
        leftsupportEdge =
          this.adjustPoint_Left.x + (0.5 * this.b_eff * 100) / scaleGeo_Test;
      //console.log("leftSupport 1: " +leftsupportEdge)
      if (this.distToLowerWall_Left > 0) {
        leftsupportEdge =
          this.adjustPoint_Left.x +
          this.distToLowerWall_Left * 100 +
          (0.5 * this.b_eff * 100) / scaleGeo_Test;
        //console.log("leftSupport 2: " +leftsupportEdge)
      }
    }

    //console.log("distToLoweWall: " + this.distToLowerWall_Left)
    //console.log("leftSupport: " +leftsupportEdge )

    translate(leftsupportEdge, this.insertPointWall.y);

    //** ModuleLine
    fill(0);
    strokeWeight(1);
    line(0, -15, 0, 70);
    circle(0, 0, 5);

    //** Arrow
    strokeWeight(3);
    stroke(0, 0, 255);
    line(0, 50, 0, 20);
    fill(0, 0, 255, 50);
    triangle(0, 10, -6, 20, 6, 20);

    //** Distributed Reaction
    strokeWeight(2);
    stroke(0, 0, 255, 100);
    rect(
      (-0.5 * this.b_eff * 100) / scaleGeo_Test,
      5,
      (this.b_eff * 100) / scaleGeo_Test,
      20
    );
    noStroke();
    fill(0);

    //** Text
    textSize(20);
    fill(0, 0, 255);
    textAlign(LEFT, CENTER);
    text(nf(round(this.N_local_sum / this.b_eff, 3), 0, 2) + " kN/m", 20, 16.5);
    textAlign(LEFT, CENTER);
    text(nf(round(this.N_local_sum, 3), 0, 2) + " kN", 20, 40); //** [kN]
    pop();

    //** Anchor
    push();
    translate(this.anchor_left.x, this.anchor_left.y + 50);

    //** Arrow
    strokeWeight(3);
    stroke(0, 0, 255);
    line(0, 15, 0, -15);
    fill(0, 0, 255, 100);
    triangle(0, 25, -6, 15, 6, 15);

    //** Text
    textSize(20);
    fill(0, 0, 255);
    noStroke();
    textAlign(LEFT, CENTER);
    text(nf(round(this.anchorForce, 3), 0, 2) + " kN", 20, 15); //** [kN]
    pop();
  }
  DisplayReaction_Instability_Left_MesureLines() {
    if (this.wallFailiure) return;
    if (!this.inStabil_Left) return;

    push();
    let dist_xLeft = round(this.distToLowerWall_Left, 3);
    let dist_xRight = round(this.distToLowerWall_Right, 3);

    let dist_xLeft_Value = dist_xLeft * scaleGeo_Test;
    let dist_xRight_Value = dist_xRight * scaleGeo_Test;

    //** MesureLine [mm]
    //*** Actual wall
    let xa = this.adjustPoint_Left.x;
    let xLeft = this.adjustPoint_Left.x + this.distToLowerWall_Left * 100; //*** LowerWall [mm] Left Edge
    let xb = 0;
    let xRight = this.adjustPoint_Right.x + this.distToLowerWall_Right * 100; //*** LowerWall [mm] Right Edge
    let xc = this.adjustPoint_Right.x;
    let y = this.adjustPoint_Left.y + this.h * scaleGeo;
    let xAnchor = this.anchor_left.x;

    //** Set Values xb
    if (xa <= xLeft)
      xb =
        this.adjustPoint_Left.x +
        this.distToLowerWall_Left * scaleGeo +
        (0.5 * this.b_eff * 100) / scaleGeo_Test; //** Reaction pos
    if (xa > xLeft)
      xb = this.adjustPoint_Left.x + (0.5 * this.b_eff * 100) / scaleGeo_Test; //** Reaction pos

    //** Lines and points
    //*** Actual wall
    stroke(0, 0, 255);
    if (xa <= xLeft) line(-5 + xLeft, y + 65, xb, y + 65); //** Horisontal
    if (xa > xLeft) line(-5 + xa, y + 65, xb, y + 65); //** Horisontal

    line(xb, y + 65, xAnchor, y + 65);

    if (xc <= xRight) line(xAnchor, y + 65, xc + 5, y + 65); //** Horisontal
    if (xc > xRight) line(xAnchor, y + 65, xRight, y + 65); //** Horisontal

    if (dist_xLeft != 0) line(xa, y + 15, xa, y + 95);
    //** Vertical Left
    else line(xa, y + 15, xa, y + 65); //** Vertical Left - wall[0]
    if (dist_xRight != 0) line(xc, y + 15, xc, y + 95);
    //** Vertical Right
    else line(xc, y + 15, xc, y + 65); //** Vertical Right - wall[0]

    fill(0, 0, 255);
    if (dist_xLeft != 0) circle(xa, y + 90, 5);
    circle(xa, y, 5);
    circle(xb, y + 65, 5); //** Reaction
    circle(xAnchor, y + 65, 5); //** Anchor
    circle(xAnchor, y, 5); //** Anchor
    circle(xc, y, 5);
    if (dist_xRight != 0) circle(xc, y + 90, 5);
    if (dist_xLeft != 0) circle(xLeft, y + 90, 5);
    if (dist_xRight != 0) circle(xRight, y + 90, 5);

    //** Left
    if (xa <= xLeft) circle(xLeft, y + 65, 5); //** Left
    if (xa > xLeft) circle(xa, y + 65, 5); //** Left

    //** Right
    if (xc <= xRight) circle(xc, y + 65, 5); //** Left
    if (xc > xRight) circle(xRight, y + 65, 5); //** Left

    //** Text
    //*** Actual wall
    noStroke();
    textSize(15);
    textAlign(CENTER, CENTER);

    //** Dist Reaction to Anchor
    let dist_xb_xAnchor = (xAnchor - xb) / scaleGeo;
    let dist_xb_xAnchor_Value = ((xAnchor - xb) / 100) * scaleGeo_Test;

    text(
      nf(round(dist_xb_xAnchor_Value, 3), 0, 3) + " m",
      xb + 0.5 * dist_xb_xAnchor * scaleGeo,
      y + 77.5
    );

    let dist_xa_xLeft = 0;
    let dist_xRight_xc = 0;

    let dist_xa_xLeft_Value = 0;
    let dist_xRight_xc_Value = 0;

    //** Left of Tp
    if (xa <= xLeft) {
      dist_xa_xLeft = (xb - xLeft) / scaleGeo;
      dist_xa_xLeft_Value = ((xb - xLeft) / 100) * scaleGeo_Test;
      textAlign(RIGHT, CENTER);
      text(
        nf(round(dist_xa_xLeft_Value, 3), 0, 3) + " m",
        xLeft - 10,
        y + 77.5
      );
    } //** [m]

    if (xa > xLeft) {
      dist_xa_xLeft = (xb - xa) / scaleGeo;
      dist_xa_xLeft_Value = ((xb - xa) / 100) * scaleGeo_Test;
      textAlign(RIGHT, CENTER);

      text(
        nf(round(dist_xa_xLeft_Value, 3), 0, 3) + " m",
        this.adjustPoint_Left.x - 10,
        y + 77.5
      );
    } //** [m]

    textAlign(CENTER, CENTER);
    //** Right of Tp (dist from Anchor to Edge)
    if (xc <= xRight) {
      dist_xRight_xc = (xc - xAnchor) / scaleGeo;
      dist_xRight_xc_Value = ((xc - xAnchor) / 100) * scaleGeo_Test;
      text(
        nf(round(dist_xRight_xc_Value, 3), 0, 3) + " m",
        xAnchor + 0.5 * dist_xRight_xc * scaleGeo,
        y + 77.5
      );
    } //** [m]
    if (xc > xRight) {
      dist_xRight_xc = (xRight - xAnchor) / scaleGeo;
      dist_xRight_xc_Value = ((xRight - xAnchor) / 100) * scaleGeo_Test;

      text(
        nf(round(dist_xRight_xc_Value, 3), 0, 3) + " m",
        xAnchor + 0.5 * dist_xRight_xc * scaleGeo,
        y + 77.5
      );
    } //** [m]

    //*** LowerWall [mm]
    textAlign(RIGHT, CENTER);
    if (dist_xLeft != 0)
      text(nf(abs(dist_xLeft_Value), 0, 3) + " m", xLeft - 10, y + 105);
    textAlign(LEFT, CENTER);
    if (dist_xRight != 0)
      text(nf(abs(dist_xRight_Value), 0, 3) + " m", xRight + 10, y + 105);

    stroke(0, 0, 255);
    let sign_left = 1;
    let sign_right = 1;
    if (dist_xLeft < 0) sign_left = -1;
    if (dist_xLeft != 0)
      line(-5 * sign_left + xa, y + 90, xLeft + 5 * sign_left, y + 90); //** Horisontal LEFT
    if (dist_xRight < 0) sign_right = -1;
    if (dist_xRight != 0)
      line(-5 * sign_right + xc, y + 90, xRight + 5 * sign_right, y + 90); //** Horisontal RIGHT}
    pop();
  }

  DisplayReaction_Instability_Right() {
    if (this.wallFailiure) return;
    if (!this.inStabil_Right) return; //** If true continue
    //** If not stability **
    //if (this.anchorForce > 0) {
    push();
    //console.log(this.e_local_sum)
    /*
    translate(
      this.adjustPoint_Left.x + this.e_local_sum /scaleGeo_Test* 100 ,
      this.insertPointWall.y
    );
    */
    let x_Trans =
      this.adjustPoint_Left.x +
      this.b_adjusted * 100 -
      ((0.5 * this.b_eff) / scaleGeo_Test) * 100;

    if (this.distToLowerWall_Left > 0)
      x_Trans =
        this.adjustPoint_Left.x +
        this.distToLowerWall_Left * 100 +
        this.b_adjusted * 100 -
        ((0.5 * this.b_eff) / scaleGeo_Test) * 100;
    translate(x_Trans, this.insertPointWall.y);

    // console.log("wallElement line 667 distToLowerWall_Left " + this.distToLowerWall_Left)

    //** ModuleLine
    fill(0);
    strokeWeight(1);
    line(0, -15, 0, 70);
    circle(0, 0, 5);

    //** Arrow
    strokeWeight(3);
    stroke(0, 0, 255);
    line(0, 50, 0, 20);
    fill(0, 0, 255, 50);
    triangle(0, 10, -6, 20, 6, 20);

    //console.log("wallElement line 639 b_eff: " + this.b_eff)
    //** Distributed Reaction
    strokeWeight(2);
    stroke(0, 0, 255, 100);
    rect(
      ((-0.5 * this.b_eff) / scaleGeo_Test) * 100,
      5,
      (this.b_eff / scaleGeo_Test) * 100,
      20
    );
    noStroke();
    fill(0);

    //** Text
    textSize(20);
    fill(0, 0, 255);
    textAlign(LEFT, CENTER);
    text(nf(round(this.N_local_sum / this.b_eff, 3), 0, 2) + " kN/m", 20, 16.5);
    text(nf(round(this.N_local_sum, 3), 0, 2) + " kN", 20, 40); //** [kN]
    pop();

    //** Anchor
    push();
    translate(this.anchor_left.x, this.anchor_left.y + 50);

    //** Arrow
    strokeWeight(3);
    stroke(0, 0, 255);
    line(0, 15, 0, -15);
    fill(0, 0, 255, 100);
    triangle(0, 25, -6, 15, 6, 15);

    //** Text
    textSize(20);
    fill(0, 0, 255);
    noStroke();
    textAlign(LEFT, CENTER);
    text(nf(round(this.anchorForce, 3), 0, 2) + " kN", 20, 15); //** [kN]
    pop();
    // }
  }
  DisplayReaction_Instability_Right_MesureLines() {
    if (this.wallFailiure) return;
    if (!this.inStabil_Right) return;

    push();

    let dist_xLeft = round(this.distToLowerWall_Left, 3);
    let dist_xRight = round(this.distToLowerWall_Right, 3);

    let dist_xLeft_Value = dist_xLeft * scaleGeo_Test;
    let dist_xRight_Value = dist_xRight * scaleGeo_Test;

    //** MesureLine [mm]
    //*** Actual wall
    let xa = this.adjustPoint_Left.x;
    let xLeft = this.adjustPoint_Left.x + this.distToLowerWall_Left * 100; //*** LowerWall [mm] Left Edge
    let xb = 0;
    let xRight = this.adjustPoint_Right.x + this.distToLowerWall_Right * 100; //*** LowerWall [mm] Right Edge
    let xc = this.adjustPoint_Right.x;
    let y = this.adjustPoint_Left.y + this.h * 100;
    let xAnchor = this.anchor_left.x;

    //console.log(this.b_eff)

    //** Lines and points
    //*** Actual wall
    stroke(0, 0, 255);
    if (xa <= xLeft) line(-5 + xLeft, y + 65, xAnchor, y + 65); //** Horisontal
    if (xa > xLeft) line(-5 + xa, y + 65, xAnchor, y + 65); //** Horisontal

    //** Set Values xb
    if (xc <= xRight)
      xb = this.adjustPoint_Right.x + (-0.5 * this.b_eff * 100) / scaleGeo_Test; //** Reaction pos
    if (xc > xRight)
      xb =
        this.adjustPoint_Right.x +
        this.distToLowerWall_Right * 100 -
        (0.5 * this.b_eff * 100) / scaleGeo_Test; //** Reaction pos

    line(xAnchor, y + 65, xb + 5, y + 65); //** Horisontal
    if (xc >= xRight) line(xb, y + 65, xRight + 5, y + 65); //** Horisontal
    if (xc < xRight) line(xb, y + 65, xc, y + 65); //** Horisontal

    if (dist_xLeft != 0) line(xa, y + 15, xa, y + 95);
    //** Vertical Left
    else line(xa, y + 15, xa, y + 65); //** Vertical Left - wall[0]
    if (dist_xRight != 0) line(xc, y + 15, xc, y + 95);
    //** Vertical Right
    else line(xc, y + 15, xc, y + 65); //** Vertical Right - wall[0]

    fill(0, 0, 255);
    if (dist_xLeft != 0) circle(xa, y + 90, 5);
    circle(xa, y, 5);
    circle(xb, y + 65, 5); //** Reaction
    circle(xAnchor, y + 65, 5); //** Anchor
    circle(xAnchor, y, 5); //** Anchor
    circle(xc, y, 5);
    if (dist_xRight != 0) circle(xc, y + 90, 5);
    if (dist_xLeft != 0) circle(xLeft, y + 90, 5);
    if (dist_xRight != 0) circle(xRight, y + 90, 5);

    //** Left
    if (xa <= xLeft) circle(xLeft, y + 65, 5); //** Left
    if (xa > xLeft) circle(xa, y + 65, 5); //** Left

    //** Right
    if (xc <= xRight) circle(xc, y + 65, 5); //** Left
    if (xc > xRight) circle(xRight, y + 65, 5); //** Left

    //** Text
    //*** Actual wall
    noStroke();
    textSize(15);
    textAlign(CENTER, CENTER);

    //** Dist Reaction to Anchor
    let dist_xb_xAnchor = (xAnchor - xb) / scaleGeo;
    let dist_xa_xLeft = 0;
    let dist_xRight_xc = 0;

    let dist_xb_xAnchor_Value = ((xAnchor - xb) / 100) * scaleGeo_Test;
    let dist_xa_xLeft_Value = 0;
    let dist_xRight_xc_Value = 0;

    //** Left of Tp
    if (xa <= xLeft) {
      dist_xa_xLeft = (xAnchor - xLeft) / 100;
      dist_xa_xLeft_Value = ((xAnchor - xLeft) / 100) * scaleGeo_Test;
      text(
        nf(round(dist_xa_xLeft_Value, 3), 0, 3) + " m",
        xLeft + 0.5 * dist_xa_xLeft * 100,
        y + 77.5
      );
    } //** [m]
    if (xa > xLeft) {
      dist_xa_xLeft = (xAnchor - xa) / 100;
      dist_xa_xLeft_Value = ((xAnchor - xa) / 100) * scaleGeo_Test;
      text(
        nf(round(dist_xa_xLeft_Value, 3), 0, 3) + " m",
        this.adjustPoint_Left.x + 0.5 * dist_xa_xLeft * scaleGeo,
        y + 77.5
      );
    } //** [m]

    let dist_xAnchor_xb = (xb - xAnchor) / 100;
    let dist_xAnchor_xb_Value = ((xb - xAnchor) / 100) * scaleGeo_Test;
    text(
      nf(round(dist_xAnchor_xb_Value, 3), 0, 3) + " m",
      xAnchor + 0.5 * dist_xAnchor_xb * scaleGeo,
      y + 77.5
    );

    //** Right of Tp (dist from xb to Edge)
    if (xc <= xRight) {
      dist_xRight_xc = (xc - xb) / 100;
      dist_xRight_xc_Value = ((xc - xb) / 100) * scaleGeo_Test;
      textAlign(LEFT, CENTER);
      text(
        nf(round(dist_xRight_xc_Value, 3), 0, 3) + " m",
        //xb + 0.5 * dist_xRight_xc * scaleGeo,
        xc + 10,
        y + 77.5
      );
    } //** [m]
    else if (xc > xRight) {
      dist_xRight_xc = (xRight - xb) / 100;
      dist_xRight_xc_Value = ((xRight - xb) / 100) * scaleGeo_Test;
      textAlign(LEFT, CENTER);
      text(
        nf(round(dist_xRight_xc_Value, 3), 0, 3) + " m",
        xRight + 10,
        y + 77.5
      );
    } //** [m]

    //*** LowerWall [mm]
    textAlign(RIGHT, CENTER);
    if (dist_xLeft != 0)
      text(nf(abs(dist_xLeft_Value), 0, 3) + " m", xLeft - 10, y + 105);
    textAlign(LEFT, CENTER);
    if (dist_xRight != 0)
      text(nf(abs(dist_xRight_Value), 0, 3) + " m", xRight + 10, y + 105);

    stroke(0, 0, 255);
    let sign_left = 1;
    let sign_right = 1;
    if (dist_xLeft < 0) sign_left = -1;
    if (dist_xLeft != 0)
      line(-5 * sign_left + xa, y + 90, xLeft + 5 * sign_left, y + 90); //** Horisontal LEFT
    if (dist_xRight < 0) sign_right = -1;
    if (dist_xRight != 0)
      line(-5 * sign_right + xc, y + 90, xRight + 5 * sign_right, y + 90); //** Horisontal RIGHT}
    pop();
  }

  //** Called from sketch
  DisplayReaction_Stability() {
    //** Display Reaction Arrow and distributed reaction
    push();
    if (!this.stabil) return;

    //** Center of e_res
    let supportEdge =
      this.adjustPoint_Left.x + (this.e_local_res * 100) / scaleGeo_Test;

    translate(supportEdge, this.insertPointWall.y);

    //** ModuleLine **
    //noFill();
    fill(0);
    strokeWeight(1);
    line(0, -15, 0, 70);
    circle(0, 0, 5);

    //** Arrow
    strokeWeight(3);
    stroke(0, 0, 255);
    line(0, 50, 0, 20);
    fill(0, 0, 255, 50);
    triangle(0, 10, -6, 20, 6, 20);

    //** Distributed Reaction
    strokeWeight(2);
    stroke(0, 0, 255, 50);
    //console.log("wallElement line 844 b_Eff " + this.b_eff)
    rect(
      (-0.5 * this.b_eff * 100) / scaleGeo_Test,
      5,
      (this.b_eff * 100) / scaleGeo_Test,
      20
    );
    noStroke();
    fill(0);

    //** Text
    textSize(20);
    fill(0, 0, 255);
    textAlign(LEFT, CENTER);
    text(nf(round(this.reaction, 3), 0, 2) + " kN/m", 20, 16.5); //** [kN/m]
    textAlign(LEFT, CENTER);
    text(nf(round(this.N_local_res, 3), 0, 2) + " kN", 20, 40); //** [kN/m]

    pop();
  }
  DisplayReaction_Stability_MesureLines() {
    push();
    if (!this.stabil) return;

    let dist_xLeft = round(this.distToLowerWall_Left, 3);
    let dist_xRight = round(this.distToLowerWall_Right, 3);

    let dist_xLeft_Value = dist_xLeft * scaleGeo_Test;
    let dist_xRight_Value = dist_xRight * scaleGeo_Test;

    //** MesureLine [mm]
    //*** Actual wall
    let xa = this.adjustPoint_Left.x;
    let xLeft = this.adjustPoint_Left.x + this.distToLowerWall_Left * 100; //*** LowerWall [mm] Left Edge
    let xb = this.adjustPoint_Left.x + (this.e_local_res * 100) / scaleGeo_Test; //** Reaction pos
    let xRight = this.adjustPoint_Right.x + this.distToLowerWall_Right * 100; //*** LowerWall [mm] Right Edge
    let xc = this.adjustPoint_Right.x;
    let y = this.adjustPoint_Left.y + this.h * 100;

    //console.log(this.e_local_res)

    //** Lines and points
    //*** Actual wall
    stroke(0, 0, 255);
    let offSet = 65;
    let offSet_2 = 65;

    if (xa <= xLeft) line(-5 + xLeft, y + offSet, xb + 5, y + offSet); //** Horisontal
    if (xa > xLeft) line(-5 + xa, y + offSet, xb, y + offSet); //** Horisontal

    if (xc <= xRight) line(xb, y + offSet, xc + 5, y + offSet); //** Horisontal
    if (xc > xRight) line(xb, y + offSet, xRight, y + offSet); //** Horisontal

    if (dist_xLeft != 0) line(xa, y + 15, xa, y + offSet);
    //** Vertical
    //** Vertical Left
    else line(xa, y + 15, xa, y + 65); //** Vertical Left - wall[0]
    if (dist_xRight != 0) line(xc, y + 15, xc, y + offSet);
    //** Vertical
    //** Vertical Right
    else line(xc, y + 15, xc, y + 65); //** Vertical Right - wall[0]

    fill(0, 0, 255);
    if (dist_xLeft != 0) circle(xa, y + offSet_2, 5);
    circle(xa, y, 5);
    circle(xb, y + 65, 5); //** Reaction
    circle(xc, y, 5);
    if (dist_xRight != 0) circle(xc, y + offSet_2, 5);
    if (dist_xLeft != 0) circle(xLeft, y + offSet_2, 5);
    if (dist_xRight != 0) circle(xRight, y + offSet_2, 5);

    //** Left
    if (xa <= xLeft) circle(xLeft, y + 65, 5); //** Left
    if (xa > xLeft) circle(xa, y + 65, 5); //** Left

    //** Right
    if (xc <= xRight) circle(xc, y + 65, 5); //** Left
    if (xc > xRight) circle(xRight, y + 65, 5); //** Left

    //** Text
    //*** Actual wall
    noStroke();
    textSize(15);
    textAlign(CENTER, CENTER);

    let dist_xa_xLeft = 0;
    let dist_xRight_xc = 0;

    let dist_xa_xLeft_Value = 0;
    let dist_xRight_xc_Value = 0;

    //** Left of Tp
    if (xa <= xLeft) {
      dist_xa_xLeft = xb - xLeft;
      dist_xa_xLeft_Value = ((xb - xLeft) * scaleGeo_Test) / 100;

      text(
        nf(round(dist_xa_xLeft_Value, 3), 0, 3) + " m",
        xLeft + 0.5 * dist_xa_xLeft,
        y + 77.5
      );
    } //** [m]

    if (xa > xLeft) {
      dist_xa_xLeft = xb - xa;
      dist_xa_xLeft_Value = ((xb - xa) * scaleGeo_Test) / 100;

      text(
        nf(round(dist_xa_xLeft_Value, 3), 0, 3) + " m",
        this.adjustPoint_Left.x + 0.5 * dist_xa_xLeft,
        y + 77.5
      );
    } //** [m]

    //** Right of Tp
    if (xc <= xRight) {
      dist_xRight_xc = xc - xb;
      dist_xRight_xc_Value = ((xc - xb) * scaleGeo_Test) / 100;

      text(
        nf(round(dist_xRight_xc_Value, 3), 0, 3) + " m",
        xb + 0.5 * dist_xRight_xc,
        y + 77.5
      );
    } //** [m]
    if (xc > xRight) {
      dist_xRight_xc = xRight - xb;
      dist_xRight_xc_Value = ((xRight - xb) * scaleGeo_Test) / 100;

      text(
        nf(round(dist_xRight_xc_Value, 3), 0, 3) + " m",
        xb + 0.5 * dist_xRight_xc,
        y + 77.5
      );
    } //** [m]

    //*** Mesure to LowerWall [mm]
    textAlign(RIGHT, CENTER);
    if (dist_xLeft < 0)
      text(nf(abs(dist_xLeft_Value), 0, 3) + " m", xLeft - 10, y + 77.5);
    if (dist_xLeft > 0)
      text(
        nf(abs(dist_xLeft_Value), 0, 3) + " m",
        this.adjustPoint_Left.x - 10,
        y + 77.5
      );
    textAlign(LEFT, CENTER);
    if (dist_xRight > 0)
      text(nf(abs(dist_xRight_Value), 0, 3) + " m", xRight + 10, y + 77.5);
    if (dist_xRight < 0)
      text(
        nf(abs(dist_xRight_Value), 0, 3) + " m",
        this.adjustPoint_Right.x + 10,
        y + 77.5
      );
    stroke(0, 0, 255);

    let sign_left = 1;
    let sign_right = 1;
    if (dist_xLeft < 0) sign_left = -1;
    if (dist_xLeft != 0)
      line(
        -5 * sign_left + xa,
        y + offSet_2,
        xLeft + 5 * sign_left,
        y + offSet_2
      ); //** Horisontal LEFT
    if (dist_xRight < 0) sign_right = -1;
    if (dist_xRight != 0)
      line(
        -5 * sign_right + xc,
        y + offSet_2,
        xRight + 5 * sign_right,
        y + offSet_2
      ); //** Horisontal RIGHT}
    pop();
  }

  DisplayAndReadLoad_H(pos) {
    if (this.loadHorisontal_Array == 0) return;
    for (let i = 0; i < this.loadHorisontal_Array.length; i++) {
      //** If overlap => Display buttonRollor
      let topLeft_x = graph.leftLimit - 240;
      let topLeft_y = this.loadHorisontal_Array[i].ip_Load_H.y - 45;

      let w = 185;
      let h = 40;

      let bottomRight_x = topLeft_x + w;
      let bottomRight_y = topLeft_y + h;

      //rect(topLeft_x, topLeft_y, w, h);
      if (
        topLeft_x < pos.x &&
        pos.x < bottomRight_x &&
        topLeft_y < pos.y &&
        pos.y < bottomRight_y
      ) {
        this.loadHorisontal_Array[i].Display_ButtonRollor(pos);
        this.loadHorisontal_Array[i].value_load_H = this.loadHorisontal_Array[
          i
        ].buttonRollor_H.ReadValue();
      } else {
        this.loadHorisontal_Array[i].Display_LoadValue();
        this.loadHorisontal_Array[i].buttonRollor_H.UpdateIfNotVisible();
      }

      //** Display load
      this.loadHorisontal_Array[i].Display_Load();
    }
  }

  //** called from sketch **************************************************************************
  DistToCenter() {
    //** distToCenter
    for (let i = 1; i < this.loadVertical_Array.length; i++) {
      this.loadVertical_Array[i].distToCenter =
        this.loadVertical_Array[i].ip_Load_N.x - this.insertPointWall.x;

      this.loadVertical_Array[i].distToCenter_scaled =
        ((this.loadVertical_Array[i].ip_Load_N.x - this.insertPointWall.x) *
          scaleGeo) /
        100;
    }
  }
  UpdateLoadPos() {
    //** Update ButtonRollor LoadVertical
    for (let i = 1; i < this.loadVertical_Array.length; i++) {
      //** Update LoadPos to wall when scale
      this.loadVertical_Array[i].ip_Load_N_scaled.x =
        this.insertPointWall.x + this.loadVertical_Array[i].distToCenter_scaled;
      this.loadVertical_Array[i].ip_Load_N_scaled.y =
        this.insertPointWall.y - this.h * scaleGeo;
    }
  } //*******************************************************************************************************

  DisplayAndReadLoad_N(pos) {
    push();
    this.loadVertical_Array[0].Display_G();

    //** 1. test call function
    this.TestOverlapButtonRollorLoad(pos);

    for (let i = 1; i < this.loadVertical_Array.length; i++) {
      if (this.activeButtonRollor_LoadVertical === i) {
        this.loadVertical_Array[i].Display_ButtonRollor(pos);
        this.loadVertical_Array[i].value_load_N = this.loadVertical_Array[
          i
        ].buttonRollor_N.ReadValue();
      } else {
        this.loadVertical_Array[i].Display_LoadValue();
        this.loadVertical_Array[i].buttonRollor_N.UpdateIfNotVisible();
      }
      //** Display load
      this.loadVertical_Array[i].Display_Load(this.wallNumber);
    }
    pop();
  }
  DisplayLoadMesure_N() {
    if (this.loadVertical_Array.length <= 1) return;

    let pointArray = [];
    pointArray.push(this.adjustPoint_Left.x);
    pointArray.push(this.loadVertical_Array[0].ip_Load_N.x);
    pointArray.push(this.adjustPoint_Right.x);
    for (let i = 1; i < this.loadVertical_Array.length; i++) {
      pointArray.push(this.loadVertical_Array[i].ip_Load_N_scaled.x);
    }
    this.BubbleSortLoad(pointArray);
    //console.log("wallArray line 1015 - " + pointArray);
    //** Sort before mesureLine in changeSystem.Load_Add(pos)

    push();
    textSize(15);
    textAlign(CENTER, BOTTOM);

    let posY = this.adjustPoint_Left.y + 105;

    for (let i = pointArray.length - 1; i >= 0; i--) {
      let a = pointArray[i] - pointArray[i - 1];
      let a_Value = a * scaleGeo_Test;
      text(
        nf(a_Value / scaleGeo, 0, 3) + " m",
        pointArray[i] - 0.5 * a,
        posY - 2.5
      );

      line(pointArray[i], posY + 5, pointArray[i], posY - 50);
      circle(pointArray[i], posY, 5);
    }
    stroke(0.2);
    line(pointArray[0] - 5, posY, pointArray[pointArray.length - 1] + 5, posY);

    pop();
  }

  TestOverlapButtonRollorLoad(pos) {
    // Hvis vi allerede har et aktivt rektangel
    if (this.activeButtonRollor_LoadVertical !== null) {
      //let r = rects[activeRect];
      let rx = this.loadVertical_Array[this.activeButtonRollor_LoadVertical].rx;
      let ry = this.loadVertical_Array[this.activeButtonRollor_LoadVertical].ry;
      let rw = this.loadVertical_Array[this.activeButtonRollor_LoadVertical].rw;
      let rh = this.loadVertical_Array[this.activeButtonRollor_LoadVertical].rh;

      // Tjek om musen stadig er inde i rektanglet
      if (pos.x >= rx && pos.x <= rx + rw && pos.y >= ry && pos.y <= ry + rh) {
        return this.activeButtonRollor_LoadVertical; // stadig aktivt
      }
      // Ellers slip det
      this.activeButtonRollor_LoadVertical = null;
    }

    // Ingen aktiv — tjek alle rektangler
    for (let i = 0; i < this.loadVertical_Array.length; i++) {
      let rx = this.loadVertical_Array[i].rx;
      let ry = this.loadVertical_Array[i].ry;
      let rw = this.loadVertical_Array[i].rw;
      let rh = this.loadVertical_Array[i].rh;

      if (pos.x >= rx && pos.x <= rx + rw && pos.y >= ry && pos.y <= ry + rh) {
        this.activeButtonRollor_LoadVertical = i;
        return i;
      }
    }
    return null;
  }

  UpdateWall() {
    //console.log("wallWlwmwnt line 1133 " + this.adjustPoint_Left)
    //** Update heigth if lower wall are ajusted

    this.adjustPoint_Left = new p5.Vector(
      this.insertPointWall.x - (this.b * scaleGeo) / 2,
      this.insertPointWall.y - this.h * scaleGeo
    );
    this.adjustPoint_Right = new p5.Vector(
      this.insertPointWall.x + (this.b * scaleGeo) / 2,
      this.insertPointWall.y - this.h * scaleGeo
    );

    //** Update AnchorPos to wall
    this.anchor_left.x = this.insertPointWall.x + this.anchor_dist;
    this.anchor_left.y = this.insertPointWall.y - 25;

    //** Center Wall
    this.center.x = this.insertPointWall.x;
    this.center.y = this.insertPointWall.y - 0.5 * this.h * scaleGeo;

    //** g
    this.g = g; //** global ButtonRollor

    //** fcd
    this.fcd = fcd; //** [Mpa]
    this.LimitReaction = this.fcd * this.t * 1000; //** [kN/m]

    this.b_scaled = this.b * scaleGeo_Test;

    //** G
    this.G = this.h * scaleGeo_Test * this.b_scaled * this.t * this.g;
    this.loadVertical_Array[0].value_load_N = this.G;
    this.loadVertical_Array[0].ip_Load_N.x = this.insertPointWall.x;
    this.loadVertical_Array[0].ip_Load_N.y =
      this.insertPointWall.y - 0.25 * this.h * scaleGeo;

    //** Adjust b wall (to minimum supported section)
    this.b_adjusted = this.b;
    if (this.distToLowerWall_Left > 0)
      this.b_adjusted = this.b_adjusted - this.distToLowerWall_Left;
    if (this.distToLowerWall_Right < 0)
      this.b_adjusted = this.b_adjusted + this.distToLowerWall_Right;

    //** Update ButtonRollor LoadVertical
    for (let i = 1; i < this.loadVertical_Array.length; i++) {
      this.loadVertical_Array[i].ButtonRollorRectCircumference();
    }

    //****** SET FALIURE ******* START
    if (
      Number.isNaN(this.reaction) ||
      Number.isNaN(this.b_eff) ||
      this.b_eff < 0 ||
      this.anchorForce < 0 ||
      round(this.reaction, 4) > this.LimitReaction ||
      round(this.reaction, 4) <= 0
    )
      this.wallFailiure = true;
    else this.wallFailiure = false;
    //****** SET FALIURE ******* END
  }

  DisplayAndReadWall_t(pos) {
    //** If overlap => Display buttonRollor
    let topLeft_x = graph.insertPoint.x - 200; //graph.leftLimit - 500;
    let topLeft_y = this.adjustPoint_Left.y + 40;

    let w = 120;
    let h = 40;

    let bottomRight_x = topLeft_x + w;
    let bottomRight_y = topLeft_y + h;

    //rect(topLeft_x, topLeft_y, w, h);
    if (
      topLeft_x < pos.x &&
      pos.x < bottomRight_x &&
      topLeft_y < pos.y &&
      pos.y < bottomRight_y
    ) {
      this.Display_ButtonRollor_t(pos);
      this.t = this.buttonRollor_t.ReadValue();
    } else {
      push();
      //** WallThickness this.t
      textSize(25);
      text(
        nf(this.t, 0, 3) + " m",
        graph.insertPoint.x - 200,
        this.adjustPoint_Left.y + 70
      );
      pop();
      this.buttonRollor_t.UpdateIfNotVisible();
    }
  }
  DisplayWall() {
    push();

    //** Wall
    strokeWeight(2);

    fill(100, 100, 100, 50);
    rect(
      this.insertPointWall.x - (this.b * scaleGeo) / 2,
      this.insertPointWall.y - this.h * scaleGeo,
      this.b * scaleGeo,
      this.h * scaleGeo
    );

    //** AdjustPoints
    noFill();
    strokeWeight(1);
    circle(this.adjustPoint_Left.x, this.adjustPoint_Left.y, 20);
    circle(this.adjustPoint_Right.x, this.adjustPoint_Right.y, 20);

    //** Center
    line(
      this.insertPointWall.x,
      this.insertPointWall.y - 50,
      this.insertPointWall.x,
      this.insertPointWall.y - this.h * scaleGeo + 25
    );

    //** WallNumber
    fill(0);
    textSize(25);
    //text("wall " + this.wallNumber,this.adjustPoint_Left.x+20,this.adjustPoint_Left.y+25)
    text(
      "wall " + this.wallNumber,
      graph.insertPoint.x - 200,
      this.adjustPoint_Left.y + 35
    );

    //** Anchor Left
    push();
    translate(this.anchor_left.x, this.anchor_left.y);

    //** moduleLine
    strokeWeight(2);
    line(0, -20, 0, 35);
    fill(255);
    circle(0, 0, 15);
    fill(255);
    circle(0, 35, 5);

    pop();
  }
  DisplayWallFailiure() {
    if (this.wallFailiure == false) return;
    push();
    //** Wall
    strokeWeight(2);
    fill(255, 0, 0, 100);
    rect(
      this.insertPointWall.x - (this.b * scaleGeo) / 2,
      this.insertPointWall.y - this.h * scaleGeo,
      this.b * scaleGeo,
      this.h * scaleGeo
    );
    //** Text
    textAlign(CENTER, CENTER);
    textSize(40);
    fill(0);
    text(
      "FAIL",
      this.insertPointWall.x,
      this.insertPointWall.y - 0.6 * this.h * scaleGeo
    );
    pop();
  }

  //** Overlap and adjust load
  OverlapWallLoadVertical(pos) {
    //** i=1 so G not moved
    for (let i = 1; i < this.loadVertical_Array.length; i++) {
      let distLoadVertical = dist(
        pos.x,
        pos.y,
        this.loadVertical_Array[i].ip_Load_N_scaled.x,
        this.loadVertical_Array[i].ip_Load_N_scaled.y
      );

      if (distLoadVertical < 10) {
        this.Highlight(this.loadVertical_Array[i].ip_Load_N_scaled);
        if (mouseIsPressed && logGlobal == 0) {
          logGlobal = 1; //** already point logged
          this.logLoadVertical = true;
          this.log_Load_i = i;
        }
      }
    }

    if (mouseIsPressed && this.logLoadVertical) {
      this.OverlapWallLoadVerticalAdjust(
        this.MoveInSteps(pos),
        this.log_Load_i
      );
      //** SORT (so that mesure is ok)
      changeSystem.BubbleSortLoad(this.loadVertical_Array);
      //console.log("wallElement line 1256 - adjust loadVertical");
    }

    //console.log(this.logLoadVertical)
  }
  OverlapWallLoadVerticalAdjust(pos, i) {
    //** use dist to adjust so that scale can be used
    //this.loadVertical_Array[i].distToCenter = (this.loadVertical_Array[i].ip_Load_N.x-this.center.x);
    this.loadVertical_Array[i].distToCenter = pos.x - this.center.x;

    //console.log("wall line 1344 distToCenter" + this.loadVertical_Array[i].distToCenter )

    this.loadVertical_Array[i].ip_Load_N.x =
      this.center.x +
      (this.loadVertical_Array[i].distToCenter * 100) / scaleGeo;
    //let distToCenter = (pos.x-this.center.x)

    //this.loadVertical_Array[i].distToCenter = (this.loadVertical_Array[i].ip_Load_N.x-this.center.x)*scaleGeo/100;

    //this.loadVertical_Array[i].ip_Load_N.x = this.center.x+this.loadVertical_Array[i].distToCenter;
  }

  OverlapWallAdjust(pos) {
    let distPoint_Left = dist(
      pos.x,
      pos.y,
      this.adjustPoint_Left.x,
      this.adjustPoint_Left.y
    );

    let distPoint_Right = dist(
      pos.x,
      pos.y,
      this.adjustPoint_Right.x,
      this.adjustPoint_Right.y
    );

    if (distPoint_Left < 10) {
      this.Highlight(this.adjustPoint_Left);

      //** Logged
      if (mouseIsPressed && logGlobal == 0) {
        logGlobal = 1; //** already point logged
        this.logAdjustPoint_Left = true;
      }
      
      //** Display Width & Height
      push();
      textSize(15)
      text("height: ",pos.x+30,pos.y+20)
      text("width: ",pos.x+30,pos.y+40)
      
      text(nf(this.h*scaleGeo_Test,0,3) + " m",pos.x+90,pos.y+20)
      text(nf(this.b*scaleGeo_Test,0,3) + " m",pos.x+90,pos.y+40)
      pop();
      
    }

    if (mouseIsPressed && this.logAdjustPoint_Left)
      this.AdjustWall_Left(this.MoveInSteps(pos));

    //** Logged
    if (distPoint_Right < 10) {
      this.Highlight(this.adjustPoint_Right);
      if (mouseIsPressed && logGlobal == 0) {
        this.logAdjustPoint_Right = true;
        logGlobal = 1; //** already point logged
      }
      
      
            //** Display Width & Height
      push();
      textSize(15)
      text("height: ",pos.x+30,pos.y+20)
      text("width: ",pos.x+30,pos.y+40)
      
      text(nf(this.h*scaleGeo_Test,0,3) + " m",pos.x+90,pos.y+20)
      text(nf(this.b*scaleGeo_Test,0,3) + " m",pos.x+90,pos.y+40)
      pop();
      
    }

    if (mouseIsPressed && this.logAdjustPoint_Right)
      this.AdjustWall_Right(this.MoveInSteps(pos));
  }

  OverlapAnchorAdjust(pos) {
    let distAnchor_Left = dist(
      pos.x,
      pos.y,
      this.anchor_left.x,
      this.anchor_left.y
    );

    if (distAnchor_Left < 10) {
      this.Highlight(this.anchor_left);
      if (mouseIsPressed && logGlobal == 0) {
        logGlobal = 1; //** already point logged
        this.logAnchorAdjustPoint_Left = true;
      }
    }

    if (mouseIsPressed && this.logAnchorAdjustPoint_Left) {
      //** Limit Anchor move to wall edge
      if (this.adjustPoint_Left.x < pos.x && pos.x < this.adjustPoint_Right.x) {
        //** Move Anchor
        //this.anchor_left.x = this.MoveInSteps(pos).x;
        this.AdjustAnchor_left(this.MoveInSteps(pos));
      }

      /*
      //** MesureLine
      push();
      let xStart = this.adjustPoint_Left.x;
      let xEnd = this.adjustPoint_Right.x;
      let xAnchor = this.anchor_left.x;
      let y = this.insertPointWall.y - 50;
      line(xStart - 5, y, xEnd + 5, y); //** Horisontal
      line(xAnchor, y - 5, xAnchor, y + 15);

      fill(0);
      circle(xStart, y, 5);
      circle(xAnchor, y, 5);
      circle(xEnd, y, 5);

      //** TextMesure
      textSize(15);
      textAlign(CENTER, CENTER);
      let a = (xAnchor - xStart) / scaleGeo;
      let b = (xEnd - xAnchor) / scaleGeo;
      text(nf(a, 0, 3), xStart + 0.5 * a * scaleGeo, y - 10);
      text(nf(b, 0, 3), xAnchor + 0.5 * b * scaleGeo, y - 10);
      pop();
      */
    }
  }
  AdjustAnchor_left(pos) {
    this.anchor_dist = ((pos.x - this.insertPointWall.x) * 100) / scaleGeo;
  }

  WallMesureLines() {
    //** MesureLine Wall
    push();
    let xStart = this.adjustPoint_Left.x;
    let xCenter = this.insertPointWall.x;
    let xCenterUpper =
      this.center.x - this.distCenterCenterUpperWall * scaleGeo;
    let xEnd = this.adjustPoint_Right.x;
    let xAnchor = this.anchor_left.x;
    let y = this.insertPointWall.y - 40;

    fill(0);
    circle(xStart, y, 5);
    circle(xAnchor, y, 5);
    if (this.distCenterCenterUpperWall != 0) circle(xCenter, y - 25, 5);
    if (this.distCenterCenterUpperWall != 0) circle(xCenterUpper, y - 25, 5);
    circle(xCenter, y, 5);
    circle(xEnd, y, 5);

    line(xStart - 5, y, xEnd + 5, y); //** Horisontal
    line(xAnchor, y - 5, xAnchor, y + 15); //** Vertical
    line(xCenter, y - 5, xCenter, y + 5); //** Vertical
    if (this.distCenterCenterUpperWall != 0) {
      let sign = 1;
      if (this.distCenterCenterUpperWall > 0) sign = -1;
      line(xCenter - 5 * sign, y - 25, xCenterUpper + 5 * sign, y - 25); //** Horisontal
      line(xCenterUpper, y - this.h * scaleGeo + 10, xCenterUpper, y - 20);
    } //** Vertical

    //** TextMesure
    textSize(15);
    textAlign(CENTER, CENTER);
    let a = 0;
    let b = 0;
    let c = 0;

    let a_Value = 0;
    let b_Value = 0;
    let c_Value = 0;

    if (this.anchor_left.x < this.insertPointWall.x) {
      a = (xAnchor - xStart) / scaleGeo;
      b = (xCenter - xAnchor) / scaleGeo;
      c = (xEnd - xCenter) / scaleGeo;

      a_Value = ((xAnchor - xStart) / 100) * scaleGeo_Test;
      b_Value = ((xCenter - xAnchor) / 100) * scaleGeo_Test;
      c_Value = ((xEnd - xCenter) / 100) * scaleGeo_Test;

      text(nf(a_Value, 0, 3) + " m", xStart + 0.5 * a * scaleGeo, y - 10);
      text(nf(b_Value, 0, 3) + " m", xAnchor + 0.5 * b * scaleGeo, y - 10);
      text(nf(c_Value, 0, 3) + " m", xCenter + 0.5 * c * scaleGeo, y - 10);
    }

    if (this.anchor_left.x == this.insertPointWall.x) {
      a = (xAnchor - xStart) / scaleGeo;
      c = (xEnd - xCenter) / scaleGeo;

      a_Value = ((xAnchor - xStart) / 100) * scaleGeo_Test;
      c_Value = ((xEnd - xCenter) / 100) * scaleGeo_Test;

      text(nf(a_Value, 0, 3) + " m", xStart + 0.5 * a * scaleGeo, y - 10);
      text(nf(c_Value, 0, 3) + " m", xCenter + 0.5 * c * scaleGeo, y - 10);
    }

    if (this.anchor_left.x > this.insertPointWall.x) {
      a = (xCenter - xStart) / scaleGeo;
      b = (xAnchor - xCenter) / scaleGeo;
      c = (xEnd - xAnchor) / scaleGeo;

      a_Value = ((xCenter - xStart) / 100) * scaleGeo_Test;
      b_Value = ((xAnchor - xCenter) / 100) * scaleGeo_Test;
      c_Value = ((xEnd - xAnchor) / 100) * scaleGeo_Test;

      text(nf(a_Value, 0, 3) + " m", xStart + 0.5 * a * scaleGeo, y - 10);
      text(nf(b_Value, 0, 3) + " m", xCenter + 0.5 * b * scaleGeo, y - 10);
      text(nf(c_Value, 0, 3) + " m", xAnchor + 0.5 * c * scaleGeo, y - 10);
    }

    //** Upper wall
    let e = this.distCenterCenterUpperWall;
    let e_Value = e * scaleGeo_Test;
    if (e != 0)
      text(nf(abs(e_Value), 0, 3) + " m", xCenter - 0.5 * e * scaleGeo, y - 35);

    //** Left Wall
    let left_x = this.adjustPoint_Left.x + this.distToUpperWall_Left * scaleGeo;
    let c1 = abs(this.distToUpperWall_Left);
    let c1_Value = c1 * scaleGeo_Test;
    textAlign(RIGHT, CENTER);
    if (this.distToUpperWall_Left < 0) {
      line(xStart + 5, y, left_x - 5, y); //** Horisontal
      line(left_x, y + 5, left_x, y - this.h * scaleGeo + 65); //** Vertical
      circle(left_x, y, 5);
      text(nf(c1_Value, 0, 3) + " m", this.adjustPoint_Left.x - 10, y + 15);
    }
    if (this.distToUpperWall_Left > 0) {
      line(
        xStart - 5,
        y - 25,
        this.adjustPoint_Left.x + this.distToUpperWall_Left * scaleGeo + 5,
        y - 25
      );
      line(left_x, y - 20, left_x, y - this.h * scaleGeo + 65); //** Vertical
      circle(xStart, y - 25, 5);
      circle(left_x, y - 25, 5);
      text(nf(c1_Value, 0, 3) + " m", this.adjustPoint_Left.x - 10, y - 35);
    }

    //** Right Wall
    let right_x =
      this.adjustPoint_Right.x + this.distToUpperWall_Right * scaleGeo;
    let d = abs(this.distToUpperWall_Right);
    let d_Value = d * scaleGeo_Test;

    textAlign(LEFT, CENTER);

    if (this.distToUpperWall_Right > 0) {
      line(xEnd + 5, y, right_x + 5, y); //** Horisontal
      line(right_x, y + 5, right_x, y - this.h * scaleGeo + 65); //** Vertical
      circle(right_x, y, 5);
      text(nf(d_Value, 0, 3) + " m", this.adjustPoint_Right.x + 10, y + 15);
    }
    if (this.distToUpperWall_Right < 0) {
      line(
        xEnd + 5,
        y - 25,
        this.adjustPoint_Right.x + this.distToUpperWall_Right * scaleGeo - 5,
        y - 25
      );
      line(right_x, y - 20, right_x, y - this.h * scaleGeo + 65); //** Vertical
      circle(xEnd, y - 25, 5);
      circle(right_x, y - 25, 5);
      text(nf(d_Value, 0, 3) + " m", this.adjustPoint_Right.x + 10, y - 35);
    }
    pop();
  }

  AdjustWall_Left(pos) {
    this.adjustPoint_Left.x = pos.x;
    this.adjustPoint_Left.y = pos.y;
    this.adjustPoint_Right.y = pos.y;

    this.insertPointWall.x =
      this.adjustPoint_Left.x +
      0.5 * (this.adjustPoint_Right.x - this.adjustPoint_Left.x);

    this.b =
      (2 * (this.insertPointWall.x - this.adjustPoint_Left.x)) / scaleGeo;
    this.h = (this.insertPointWall.y - this.adjustPoint_Left.y) / scaleGeo;

    //** Anchor Adjust if wall Edge
    this.anchor_dist = this.anchor_left.x - this.insertPointWall.x;

    if (this.anchor_left.x <= this.adjustPoint_Left.x) {
      this.anchor_dist = -0.5 * this.b * scaleGeo;
    }
  }
  AdjustWall_Right(pos) {
    this.adjustPoint_Right.x = pos.x;
    this.adjustPoint_Right.y = pos.y;
    this.adjustPoint_Left.y = pos.y;

    this.insertPointWall.x =
      this.adjustPoint_Left.x +
      0.5 * (this.adjustPoint_Right.x - this.adjustPoint_Left.x);

    this.b =
      (2 * (this.insertPointWall.x - this.adjustPoint_Left.x)) / scaleGeo;
    this.h = (this.insertPointWall.y - this.adjustPoint_Left.y) / scaleGeo;

    //** Anchor Adjust if wall Edge
    this.anchor_dist = this.anchor_left.x - this.insertPointWall.x;

    if (this.anchor_left.x >= this.adjustPoint_Right.x) {
      this.anchor_dist = 0.5 * this.b * scaleGeo;
    }
  }
  //**Sort loadPoints or loadLines if one is deleted
  //**Called from sketch
  BubbleSortLoad(array) {
    //console.log(array)
    for (let i = array.length - 1; i > 1; i--) {
      for (let j = 0; j < i; j++) {
        //console.log("*** " +array[j].loadCase)
        if (array[j] > array[j + 1]) {
          // swap
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
  }

  Highlight(pos) {
    push();
    noStroke();
    fill(100, 100, 100, 100);
    if (mouseIsPressed) fill(0, 255, 0, 100);
    circle(pos.x, pos.y, 20);
    pop();
  }
  MoveInSteps(pos) {
    //**pos in multioplum of stepChange
    //console.log("Before: " + pos)
    pos.x = round(pos.x / stepChange) * stepChange;
    pos.y = round(pos.y / stepChange) * stepChange;
    //console.log("After: " + pos)
    return pos;
  }
}
