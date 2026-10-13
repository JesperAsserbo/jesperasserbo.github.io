class Support {
  constructor(posX, posY, row, col) {
    this.pos = new p5.Vector(posX, posY);
    this.Cx = 0;
    this.Cy = 0;
    this.supportExist_Cy = false;
    this.supportExist_Cx = false;

    //** fixPoint
    this.supportOverlap_Cy = false;
    this.supportOverlap_Cx = false;

    //** fixPointTable
    this.fixPointTableOverlap_Cy = false;
    this.fixPointTableOverlap_Cx = false;

    this.row = row;
    this.col = col;

    this.fixPoint_Cy = new p5.Vector(0, 70);
    this.fixPoint_Cx = new p5.Vector(-70, 0);

    this.fixPointTable_Cy = new p5.Vector(0, 0);
    this.fixPointTable_Cx = new p5.Vector(0, 0);

    this.fixPointDiameter = 15;
    this.fixPointDiameterTable = 20;

    this.buttonRollor_Cy = new ButtonRollor(
      -20, //** pos1x - textPro BR
      0, //** pos1y - textPro BR
      20, //** pos2x - "=" BR
      155, //** pos3x - ciffers BL
      165, //** pos4x - unit BR
      4, // prefix
      1, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "Cy", // textPro
      "=", // textMid
      "kN/mm", // textPre
      10, // startValue
      0.1, // minValue
      9999 // maxValue
    );

    this.buttonRollorTable_Cy = new ButtonRollor(
      0, //** pos1x - textPro BR
      0, //** pos1y - textPro BR
      0, //** pos2x - "=" BR
      0, //** pos3x - ciffers BL
      0, //** pos4x - unit BR
      4, // prefix
      1, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "", // textPro
      "", // textMid
      "", // textPre
      10, // startValue
      0.1, // minValue
      9999 // maxValue
    );

    this.buttonRollor_Cx = new ButtonRollor(
      -20, //** pos1x - textPro BR
      0, //** pos1y - textPro BR
      20, //** pos2x - "=" BR
      155, //** pos3x - ciffers BL
      165, //** pos4x - unit BR
      4, // prefix
      1, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "Cx", // textPro
      "=", // textMid
      "kN/mm", // textPre
      10, // startValue
      0.1, // minValue
      9999 // maxValue
    );

    this.buttonRollorTable_Cx = new ButtonRollor(
      0, //** pos1x - textPro BR
      0, //** pos1y - textPro BR
      0, //** pos2x - "=" BR
      0, //** pos3x - ciffers BL
      0, //** pos4x - unit BR
      4, // prefix
      1, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "", // textPro
      "", // textMid
      "", // textPre
      10, // startValue
      0.1, // minValue
      9999 // maxValue
    );

    this.graphPosNoScale_Cx;
    this.graphPosNoScale_Cy;

    this.graphPosNoScaleTable_Cx;
    this.graphPosNoScaleTable_Cy;
  }

  Display() {
    this.Update();

    if (this.supportExist_Cy || this.supportExist_Cx) {
      push();
      strokeWeight(3);
      translate(this.pos.x, this.pos.y);

      if (this.Cx > 0 && this.Cy > 0) {
        fill(255);
        triangle(-20, 20, 20, 20, -20, -20);
        fill(0);
        circle(0, 0, 12);
      } else if (this.Cx > 0) {
        fill(255);
        triangle(0, 0, -20, 20, -20, -20);
        fill(0);
        circle(0, 0, 12);
        circle(-26, 10, 8);
        circle(-26, -10, 8);
      } else if (this.Cy > 0) {
        fill(255);
        triangle(0, 0, -20, 20, 20, 20);
        fill(0);
        circle(0, 0, 12);
        circle(-10, 26, 8);
        circle(10, 26, 8);
      }

      //** Fixpoint
      strokeWeight(1);
      noFill();

      if (this.Cy > 0)
        circle(this.fixPoint_Cy.x, this.fixPoint_Cy.y, this.fixPointDiameter);
      if (this.Cx > 0)
        circle(this.fixPoint_Cx.x, this.fixPoint_Cx.y, this.fixPointDiameter);
      pop();
    }
  }

  Update() {
    this.pos.x = grid.gridNodes[this.row][this.col][0];
    this.pos.y = grid.gridNodes[this.row][this.col][1];
  }

  OverlapFixPoint_Cy() {
    //**If overlap fixpoint variable true ** Checked in matrixSupport.DisplayMatrixSupport()
    //**True while in boxLimits otherwise false
    let distSupport_Cy = dist(
      mousePosWorld.x,
      mousePosWorld.y,
      this.pos.x + this.fixPoint_Cy.x,
      this.pos.y + this.fixPoint_Cy.y
    );

    if (distSupport_Cy < this.fixPointDiameter) {
      this.supportOverlap_Cy = true;
    }

    if (this.supportOverlap_Cy && this.supportExist_Cy) {
      push();
      fill(0, 250, 0, 100);
      circle(
        this.pos.x + this.fixPoint_Cy.x,
        this.pos.y + this.fixPoint_Cy.y,
        this.fixPointDiameter
      );
      pop();

      let limit_x = this.pos.x + this.fixPoint_Cy.x;
      let limit_y = this.pos.y + this.fixPoint_Cy.y;

      let left = limit_x - 70;
      let right = limit_x + 50;
      let top = limit_y - 25;
      let bottom = limit_y + 95;
      let w = right - left;
      let h = bottom - top;

      //** Limits for mouse => buttonRollor displayed
      //rect(left, top, w, h);

      //** Frame
      push();
      fill(255);
      rect(limit_x - 135, limit_y + 45, 290, 50);
      pop();

      //** Display
      this.DisplayButtonRollor_Cy();

      if (
        //** Buttonrollor not displayed if...
        left > mousePosWorld.x ||
        mousePosWorld.x > right ||
        top > mousePosWorld.y ||
        mousePosWorld.y > bottom
      ) {
        this.supportOverlap_Cy = false;
        //**Set to false otherwise sometimes stuck in trueMode
        this.buttonRollor_Cy.overlapCiffer = false;
      } else {
        //** set to undefined when not overlap => support can be deleted when skin deleted
        //** so that buttonRoller are not called in sketch
        matrixSupport.overlapRow = undefined;
        matrixSupport.overlapCol = undefined;
      }
      //console.log("Support.OverlapFixPoint: " + this.supportOverlap);
    }
  }

  //** Check Overlap //** Tested for FixPointTable overlap in result.TabelResultNodes()
  //** Display buttonRollor
  OverlapFixPointTable_Cy() {
    //**If overlap fixpoint variable true ** Checked in matrixSupport.DisplayMatrixSupport()
    //**True while in boxLimits otherwise false
    let distFixpointTable_Cy = dist(
      mousePosWorld.x,
      mousePosWorld.y,
      this.fixPointTable_Cy.x,
      this.fixPointTable_Cy.y
    );

    if (distFixpointTable_Cy < this.fixPointDiameterTable) {
      this.fixPointTableOverlap_Cy = true;
      //console.log("Overlap support line 262");
    }

    if (this.fixPointTableOverlap_Cy && this.supportExist_Cy) {
      push();
      fill(0, 250, 0, 100);
      /*
      circle(
        this.fixPointTable_Cy.x,
        this.fixPointTable_Cy.y,
        this.fixPointDiameterTable
      );
      */
      pop();

      let limit_x = this.fixPointTable_Cy.x;
      let limit_y = this.fixPointTable_Cy.y;

      let left = limit_x - 70;
      let right = limit_x + 70;
      let top = limit_y - 25;
      let bottom = limit_y + 20;
      let w = right - left;
      let h = bottom - top;

      //** Limits for mouse => buttonRollor displayed
      //** background in buttonRoller (=> hide value in table)
      fill(255);
      rect(left, top, w, h);
      fill(0);

      //** frame
      push();
      fill(255);
      //rect(limit_x - 135, limit_y - 75, 290, 50);
      pop();

      fill(0);
      //** Display
      this.DisplayButtonRollorTable_Cy();

      if (
        //** Buttonrollor not displayed if...
        left > mousePosWorld.x ||
        mousePosWorld.x > right ||
        top > mousePosWorld.y ||
        mousePosWorld.y > bottom
      ) {
        this.fixPointTableOverlap_Cy = false;
        //**Set to false otherwise sometimes stuck in trueMode
        this.buttonRollorTable_Cy.overlapCiffer = false;
      } else {
        //** set to undefined when not overlap => support can be deleted when skin deleted
        //** so that buttonRoller are not called in sketch
        //matrixSupport.overlapRow = undefined;
        //matrixSupport.overlapCol = undefined;
      }
      //console.log("Support.OverlapFixPoint: " + this.supportOverlap);
    }
  }

  //** Check Overlap //** Tested for FixPointTable overlap in result.TabelResultNodes()
  //** Display buttonRollor
  OverlapFixPoint_Cx() {
    //**If overlap fixpoint variable true ** Checked in matrixSupport.DisplayMatrixSupport()
    //**True while in boxLimits otherwise false
    let distSupport_Cx = dist(
      mousePosWorld.x,
      mousePosWorld.y,
      this.pos.x + this.fixPoint_Cx.x,
      this.pos.y + this.fixPoint_Cx.y
    );

    if (distSupport_Cx < this.fixPointDiameter) {
      this.supportOverlap_Cx = true;
    }

    if (this.supportOverlap_Cx && this.supportExist_Cx) {
      push();
      fill(0, 250, 0, 100);
      circle(
        this.pos.x + this.fixPoint_Cx.x,
        this.pos.y + this.fixPoint_Cx.y,
        this.fixPointDiameter
      );
      pop();

      let limit_x = this.pos.x + this.fixPoint_Cx.x;
      let limit_y = this.pos.y + this.fixPoint_Cx.y;

      let left = limit_x - 70;
      let right = limit_x + 50;
      let top = limit_y - 75;
      let bottom = limit_y + 25;
      let w = right - left;
      let h = bottom - top;

      //** Limits for mouse => buttonRollor displayed
      //rect(left, top, w, h);

      //** frame
      push();
      fill(255);
      rect(limit_x - 135, limit_y - 75, 290, 50);
      pop();

      //** Display
      this.DisplayButtonRollor_Cx();

      if (
        //** Buttonrollor not displayed if...
        left > mousePosWorld.x ||
        mousePosWorld.x > right ||
        top > mousePosWorld.y ||
        mousePosWorld.y > bottom
      ) {
        this.supportOverlap_Cx = false;
        //**Set to false otherwise sometimes stuck in trueMode
        this.buttonRollor_Cx.overlapCiffer = false;
      } else {
        //** set to undefined when not overlap => support can be deleted when skin deleted
        //** so that buttonRoller are not called in sketch
        matrixSupport.overlapRow = undefined;
        matrixSupport.overlapCol = undefined;
      }
      //console.log("Support.OverlapFixPoint: " + this.supportOverlap);
    }
  }

  //** Check Overlap //** Tested for FixPointTable overlap in result.TabelResultNodes()
  //** Display buttonRollor
  OverlapFixPointTable_Cx() {
    //**If overlap fixpoint variable true ** Checked in matrixSupport.DisplayMatrixSupport()
    //**True while in boxLimits otherwise false
    let distFixpointTable_Cx = dist(
      mousePosWorld.x,
      mousePosWorld.y,
      this.fixPointTable_Cx.x,
      this.fixPointTable_Cx.y
    );

    if (distFixpointTable_Cx < this.fixPointDiameterTable ) {
      this.fixPointTableOverlap_Cx = true;
      //console.log("Overlap support line 262");
    }

    if (this.fixPointTableOverlap_Cx && this.supportExist_Cx) {
      push();
      fill(0, 250, 0, 100);
      /*
      circle(
        this.fixPointTable_Cx.x,
        this.fixPointTable_Cx.y,
        this.fixPointDiameterTable
      );
      */
      pop();

      let limit_x = this.fixPointTable_Cx.x;
      let limit_y = this.fixPointTable_Cx.y;

      let left = limit_x - 70;
      let right = limit_x + 70;
      let top = limit_y - 25;
      let bottom = limit_y + 20;
      let w = right - left;
      let h = bottom - top;

      //** Limits for mouse => buttonRollor displayed
      //** background in buttonRoller (=> hide value in table)
      fill(255);
      rect(left, top, w, h);
      fill(0);

      //** frame
      push();
      fill(255);
      //rect(limit_x - 135, limit_y - 75, 290, 50);
      pop();

      fill(0);
      //** Display
      this.DisplayButtonRollorTable_Cx();

      if (
        //** Buttonrollor not displayed if...
        left > mousePosWorld.x ||
        mousePosWorld.x > right ||
        top > mousePosWorld.y ||
        mousePosWorld.y > bottom
      ) {
        this.fixPointTableOverlap_Cx = false;
        //**Set to false otherwise sometimes stuck in trueMode
        this.buttonRollorTable_Cx.overlapCiffer = false;
      } else {
        //** set to undefined when not overlap => support can be deleted when skin deleted
        //** so that buttonRoller are not called in sketch
        //matrixSupport.overlapRow = undefined;
        //matrixSupport.overlapCol = undefined;
      }
      //console.log("Support.OverlapFixPoint: " + this.supportOverlap);
    }
  }

  DisplayButtonRollor_Cy() {
    // if (this.Cy > 0) {
    push();
    //console.log(graph.insertGeo.x)
    let translatePoint = new p5.Vector();
    translatePoint.x = this.pos.x - 110;
    translatePoint.y = this.pos.y + 160;
    translate(translatePoint.x, translatePoint.y);

    this.graphPosNoScale_Cy = new p5.Vector.sub(mousePosWorld, translatePoint);

    //**Display ButtonRollor and Read Value
    this.Cy = this.buttonRollor_Cy.ReadValue() * 1000;

    //console.log(this.Cy)
    this.buttonRollor_Cy.DisplayButonRollor(this.graphPosNoScale_Cy);

    //line(0, 0, this.buttonRollor_Cy.pos1.x, this.buttonRollor_Cy.pos1.y);
    //line(0, 0, this.graphPosNoScale_Cy.x, this.graphPosNoScale_Cy.y);
    pop();
    // }
  }

  DisplayButtonRollorTable_Cy() {
    push();
    //console.log(graph.insertGeo.x)
    let translatePoint = new p5.Vector();
    translatePoint.x = this.fixPointTable_Cy.x + 55;
    translatePoint.y = this.fixPointTable_Cy.y + 17.5;
    translate(translatePoint.x, translatePoint.y);

    this.graphPosNoScaleTable_Cy = new p5.Vector.sub(
      mousePosWorld,
      translatePoint
    );

    //**Display ButtonRollor and Read Value
    this.Cy = this.buttonRollorTable_Cy.ReadValue() * 1000;

    //console.log(this.Cx)
    this.buttonRollorTable_Cy.DisplayButonRollor(this.graphPosNoScaleTable_Cy);

    //line(0, 0, this.buttonRollorTable_Cy.pos1.x, this.buttonRollorTable_Cy.pos1.y);
    //line(0, 0, this.graphPosNoScale_Cy.x, this.graphPosNoScale_Cy.y);
    pop();
  }

  DisplayButtonRollor_Cx() {
    push();
    //console.log(graph.insertGeo.x)
    let translatePoint = new p5.Vector();
    translatePoint.x = this.pos.x - 180;
    translatePoint.y = this.pos.y - 30;
    translate(translatePoint.x, translatePoint.y);

    this.graphPosNoScale_Cx = new p5.Vector.sub(mousePosWorld, translatePoint);

    //**Display ButtonRollor and Read Value
    this.Cx = this.buttonRollor_Cx.ReadValue() * 1000;

    //console.log(this.Cx)
    this.buttonRollor_Cx.DisplayButonRollor(this.graphPosNoScale_Cx);

    //line(0, 0, this.buttonRollor_Cx.pos1.x, this.buttonRollor_Cx.pos1.y);
    //line(0, 0, this.graphPosNoScale_Cx.x, this.graphPosNoScale_Cx.y);
    pop();
  }

  DisplayButtonRollorTable_Cx() {
    push();
    //console.log(graph.insertGeo.x)
    let translatePoint = new p5.Vector();
    translatePoint.x = this.fixPointTable_Cx.x + 55;
    translatePoint.y = this.fixPointTable_Cx.y + 17.5;
    translate(translatePoint.x, translatePoint.y);

    this.graphPosNoScaleTable_Cx = new p5.Vector.sub(
      mousePosWorld,
      translatePoint
    );

    //**Display ButtonRollor and Read Value
    this.Cx = this.buttonRollorTable_Cx.ReadValue() * 1000;

    //console.log(this.Cx)
    this.buttonRollorTable_Cx.DisplayButonRollor(this.graphPosNoScaleTable_Cx);

    //line(0, 0, this.buttonRollor_Cx.pos1.x, this.buttonRollor_Cx.pos1.y);
    //line(0, 0, this.graphPosNoScale_Cx.x, this.graphPosNoScale_Cx.y);
    pop();
  }
}
