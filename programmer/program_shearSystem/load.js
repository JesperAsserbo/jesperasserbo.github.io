class Load {
  constructor(posX, posY, row, col) {
    this.pos = new p5.Vector(posX, posY);

    this.Px = 0;
    this.Py = 0;

    this.loadExist_Py = false;
    this.loadExist_Px = false;

    this.loadOverlap_Py = false;
    this.loadOverlap_Px = false;

    this.fixPointTableOverlap_Py = false;
    this.fixPointTableOverlap_Px = false;

    this.row = row;
    this.col = col;

    //** fixPoint
    this.fixPoint_Py = new p5.Vector(0, -50);
    this.fixPoint_Px = new p5.Vector(-50, 0);

    //** fixPointTable
    this.fixPointTable_Py = new p5.Vector(0, 0);
    this.fixPointTable_Px = new p5.Vector(0, 0);

    this.fixPointDiameter = 15;
    this.fixPointDiameterTable = 20;

    this.startLoad_Py = 10;
    this.startLoad_Px = 10;

    this.buttonRollor_Py = new ButtonRollor(
      -20, //** pos1x - textPro BR
      -240, //** pos1y - textPro BR
      20, //** pos2x - "=" BR
      155, //** pos3x - ciffers BL
      165, //** pos4x - unit BR
      3, // prefix
      1, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "Py", // textPro
      "=", // textMid
      "kN", // textPre
      10, // startValue
      -999, // minValue
      999 // maxValue
    );

    this.buttonRollorTable_Py = new ButtonRollor(
      0, //** pos1x - textPro BR
      0, //** pos1y - textPro BR
      0, //** pos2x - "=" BR
      0, //** pos3x - ciffers BL
      0, //** pos4x - unit BR
      3, // prefix
      1, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "", // textPro
      "", // textMid
      "", // textPre
      10, // startValue
      -999, // minValue
      999 // maxValue
    );

    this.buttonRollor_Px = new ButtonRollor(
      -90, //** pos1x - textPro BR
      -180, //** pos1y - textPro BR
      -50, //** pos2x - "=" BR
      85, //** pos3x - ciffers BL
      95, //** pos4x - unit BR
      3, // prefix
      1, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "Px", // textPro
      "=", // textMid
      "kN", // textPre
      10, // startValue
      -999, // minValue
      999 // maxValue
    );
    
        this.buttonRollorTable_Px = new ButtonRollor(
      0, //** pos1x - textPro BR
      0, //** pos1y - textPro BR
      0, //** pos2x - "=" BR
      0, //** pos3x - ciffers BL
      0, //** pos4x - unit BR
      3, // prefix
      1, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "", // textPro
      "", // textMid
      "", // textPre
      10, // startValue
      -999, // minValue
      999 // maxValue
    );

    this.graphPosNoScale_Py;
    this.graphPosNoScale_Px;

    this.graphPosNoScaleTable_Px;
    this.graphPosNoScaleTable_Py;
  }

  Display() {
    this.Update();

    //** Px
    if (this.loadExist_Px) {
      push();

      translate(this.pos.x, this.pos.y);
      let len = 50;
      let offSet = -25;
      fill(0, 0, 0);

      if (this.Px > 0) {
        strokeWeight(6);
        line(0 + offSet, 0, 0 + offSet - len, 0);
        strokeWeight(2);
        triangle(10 + offSet, 0, -10 + offSet, 10, -10 + offSet, -10);
      }
      if (this.Px == 0) {
        strokeWeight(4);
        line(0 + offSet, 0, 0 + offSet - len, 0);
      }
      if (this.Px < 0) {
        strokeWeight(6);
        line(0 + offSet, 0, 0 + offSet - len, 0);
        strokeWeight(2);
        triangle(
          -10 + offSet - len,
          0,
          10 + offSet - len,
          10,
          10 + offSet - len,
          -10
        );
      }

      //** Fixpoint
      strokeWeight(1);
      noFill();
      circle(this.fixPoint_Px.x, this.fixPoint_Px.y, this.fixPointDiameter);
      pop();
    }

    //** Py
    if (this.loadExist_Py) {
      push();

      translate(this.pos.x, this.pos.y);
      let len = 50;
      let offSet = -25;
      fill(0, 0, 0);

      if (this.Py > 0) {
        strokeWeight(6);
        line(0, 0 + offSet, 0, 0 + offSet - len);
        strokeWeight(2);
        triangle(0, 10 + offSet, -10, -10 + offSet, 10, -10 + offSet);
      }
      if (this.Py == 0) {
        strokeWeight(4);
        line(0, 0 + offSet, 0, 0 + offSet - len);
      }
      if (this.Py < 0) {
        strokeWeight(6);
        line(0, 0 + offSet, 0, 0 + offSet - len);
        strokeWeight(2);
        triangle(
          0,
          0 + offSet - len - 10,
          -10,
          10 + offSet - len,
          10,
          10 + offSet - len
        );
      }

      //** Fixpoint
      strokeWeight(1);
      noFill();

      // if (this.Py >= 0)
      circle(this.fixPoint_Py.x, this.fixPoint_Py.y, this.fixPointDiameter);

      pop();
    }
  }

  //** Called from matrixLoad.DisplayMatrixLoad()
  DisplayLoadValue() {
    push();
    textSize(30);
    textAlign(CENTER, CENTER);
    let value_Px = nf(abs(this.Px) / 1000, 0, 2);
    if (this.loadExist_Px) {
      fill(100, 100, 100, 100);
      rect(this.pos.x - 120, this.pos.y - 67.5, 100, 40);
      fill(0);
      text(value_Px, this.pos.x - 70, this.pos.y - 45);
    }
    pop();

    push();
    textSize(30);
    textAlign(CENTER, CENTER);
    let value_Py = nf(abs(this.Py) / 1000, 0, 2);
    if (this.loadExist_Py) {
      fill(100, 100, 100, 100);
      rect(this.pos.x - 50, this.pos.y - 127.5, 100, 40);
      fill(0);
      text(value_Py, this.pos.x, this.pos.y - 105);
    }
    pop();
  }

  Update() {
    this.pos.x = grid.gridNodes[this.row][this.col][0];
    this.pos.y = grid.gridNodes[this.row][this.col][1];
  }

  OverlapFixPoint_Py() {
    //**If overlap fixpoint variable true ** Checked in matrixLoad.DisplayMatrixLoad()
    //**True while in boxLimits otherwise false
    let distLoad = dist(
      mousePosWorld.x,
      mousePosWorld.y,
      this.pos.x + this.fixPoint_Py.x,
      this.pos.y + this.fixPoint_Py.y
    );

    if (distLoad < this.fixPointDiameter) {
      this.loadOverlap_Py = true;
    }

    if (this.loadOverlap_Py && this.loadExist_Py) {
      //console.log("overlap " + this.loadOverlap)
      push();
      fill(0, 250, 0, 100);
      circle(
        this.pos.x + this.fixPoint_Py.x,
        this.pos.y + this.fixPoint_Py.y,
        this.fixPointDiameter
      );
      pop();

      let limit_x = this.pos.x + this.fixPoint_Py.x;
      let limit_y = this.pos.y + this.fixPoint_Py.y;

      let left = limit_x - 70;
      let right = limit_x + 50;
      let top = limit_y - 85;
      let bottom = limit_y + 25;
      let w = right - left;
      let h = bottom - top;

      //** Limits for mouse => buttonRollor displayed
      //rect(left, top, w, h);

      //** Limits
      push();
      fill(250, 250, 250, 255);
      rect(limit_x - 135, limit_y - 85, 230, 50);
      pop();

      //** Display
      this.DisplayButtonRollor_Py();

      if (
        left > mousePosWorld.x ||
        mousePosWorld.x > right ||
        top > mousePosWorld.y ||
        mousePosWorld.y > bottom
      ) {
        this.loadOverlap_Py = false;
        //**Set to false otherwise sometimes stuck in trueMode
        this.buttonRollor_Py.overlapCiffer = false;
      } else {
        //** set to undefined when not overlap => load can be deleted when skin deleted
        //** so that buttonRoller are not called in sketch
        matrixLoad.overlapRow = undefined;
        matrixLoad.overlapCol = undefined;
      }
      //console.log("load.OverlapFixPoint: " + this.loadOverlap);
    }
  }

  //** Check Overlap //** Tested for FixPointTable overlap in result.TabelResultLoad()
  //** Display buttonRollor
  OverlapFixPointTable_Py() {
    //**If overlap fixpoint variable true ** Checked in matrixSupport.DisplayMatrixSupport()
    //**True while in boxLimits otherwise false
    let distFixpointTable_Py = dist(
      mousePosWorld.x,
      mousePosWorld.y,
      this.fixPointTable_Py.x,
      this.fixPointTable_Py.y
    );

    if (distFixpointTable_Py < this.fixPointDiameterTable) {
      this.fixPointTableOverlap_Py = true;
      //console.log("Overlap load line 295");
    }

    if (this.fixPointTableOverlap_Py && this.loadExist_Py) {
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

      let limit_x = this.fixPointTable_Py.x;
      let limit_y = this.fixPointTable_Py.y;

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
      this.DisplayButtonRollorTable_Py();

      if (
        //** Buttonrollor not displayed if...
        left > mousePosWorld.x ||
        mousePosWorld.x > right ||
        top > mousePosWorld.y ||
        mousePosWorld.y > bottom
      ) {
        this.fixPointTableOverlap_Py = false;
        //**Set to false otherwise sometimes stuck in trueMode
        this.buttonRollorTable_Py.overlapCiffer = false;
      } else {
        //** set to undefined when not overlap => support can be deleted when skin deleted
        //** so that buttonRoller are not called in sketch
        matrixSupport.overlapRow = undefined;
        matrixSupport.overlapCol = undefined;
      }
      //console.log("Support.OverlapFixPoint: " + this.supportOverlap);
    }
  }

  OverlapFixPoint_Px() {
    //**If overlap fixpoint variable true ** Checked in matrixLoad.DisplayMatrixLoad()
    //**True while in boxLimits otherwise false
    let distLoad = dist(
      mousePosWorld.x,
      mousePosWorld.y,
      this.pos.x + this.fixPoint_Px.x,
      this.pos.y + this.fixPoint_Px.y
    );

    if (distLoad < this.fixPointDiameter) {
      this.loadOverlap_Px = true;
    }

    if (this.loadOverlap_Px && this.loadExist_Px) {
      //console.log("overlap " + this.loadOverlap_Px)
      push();
      fill(0, 250, 0, 100);
      circle(
        this.pos.x + this.fixPoint_Px.x,
        this.pos.y + this.fixPoint_Px.y,
        this.fixPointDiameter
      );
      pop();

      let limit_x = this.pos.x + this.fixPoint_Px.x;
      let limit_y = this.pos.y + this.fixPoint_Px.y;

      let left = limit_x - 90;
      let right = limit_x + 30;
      let top = limit_y - 75;
      let bottom = limit_y + 25;
      let w = right - left;
      let h = bottom - top;

      //** Limits for mouse => buttonRollor displayed
      //rect(left, top, w, h);

      //** Limits
      push();
      fill(250, 250, 250, 255);

      rect(limit_x - 155, limit_y - 75, 230, 50);
      pop();

      //** Display
      this.DisplayButtonRollor_Px();

      //console.log("overlapCiffer: " + this.buttonRollor_Px.overlapCiffer)
      if (
        left > mousePosWorld.x ||
        mousePosWorld.x > right ||
        top > mousePosWorld.y ||
        mousePosWorld.y > bottom
      ) {
        this.loadOverlap_Px = false;
        //**Set to false otherwise sometimes stuck in trueMode
        this.buttonRollor_Px.overlapCiffer = false;
      } else {
        //** set to undefined when not overlap => load can be deleted when skin deleted
        //** so that buttonRoller are not called in sketch
        matrixLoad.overlapRow = undefined;
        matrixLoad.overlapCol = undefined;
      }
      //console.log("load.OverlapFixPoint: " + this.loadOverlap_Px);
    }
  }
  
    //** Check Overlap //** Tested for FixPointTable overlap in result.TabelResultLoad()
  //** Display buttonRollor
  OverlapFixPointTable_Px() {
    //**If overlap fixpoint variable true ** Checked in matrixSupport.DisplayMatrixSupport()
    //**True while in boxLimits otherwise false
    let distFixpointTable_Px = dist(
      mousePosWorld.x,
      mousePosWorld.y,
      this.fixPointTable_Px.x,
      this.fixPointTable_Px.y
    );

    if (distFixpointTable_Px < this.fixPointDiameterTable) {
      this.fixPointTableOverlap_Px = true;
      //console.log("Overlap load line 295");
    }

    if (this.fixPointTableOverlap_Px && this.loadExist_Px) {
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

      let limit_x = this.fixPointTable_Px.x;
      let limit_y = this.fixPointTable_Px.y;

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
      this.DisplayButtonRollorTable_Px();

      if (
        //** Buttonrollor not displayed if...
        left > mousePosWorld.x ||
        mousePosWorld.x > right ||
        top > mousePosWorld.y ||
        mousePosWorld.y > bottom
      ) {
        this.fixPointTableOverlap_Px = false;
        //**Set to false otherwise sometimes stuck in trueMode
        this.buttonRollorTable_Px.overlapCiffer = false;
      } else {
        //** set to undefined when not overlap => support can be deleted when skin deleted
        //** so that buttonRoller are not called in sketch
        matrixSupport.overlapRow = undefined;
        matrixSupport.overlapCol = undefined;
      }
      //console.log("Support.OverlapFixPoint: " + this.supportOverlap);
    }
  }

  DisplayButtonRollor_Py() {
    push();
    //console.log(graph.insertGeo.x)
    let translatePoint = new p5.Vector();
    translatePoint.x = this.pos.x - 110;
    translatePoint.y = this.pos.y + 150;
    translate(translatePoint.x, translatePoint.y);

    this.graphPosNoScale_Py = new p5.Vector.sub(mousePosWorld, translatePoint);

    //**Display ButtonRollor and Read Value
    this.Py = this.buttonRollor_Py.ReadValue() * 1000;

    //console.log(this.Cy)
    this.buttonRollor_Py.DisplayButonRollor(this.graphPosNoScale_Py);

    //line(0, 0, this.buttonRollor_Cy.pos1.x, this.buttonRollor_Cy.pos1.y);
    line(0, 0, this.graphPosNoScale_Py.x,this.graphPosNoScale_Py.y);
    pop();
  }

  DisplayButtonRollorTable_Py() {
    push();
    //console.log(graph.insertGeo.x)
    let translatePoint = new p5.Vector();
    translatePoint.x = this.fixPointTable_Py.x + 55;
    translatePoint.y = this.fixPointTable_Py.y + 17.5;
    translate(translatePoint.x, translatePoint.y);

    this.graphPosNoScaleTable_Py = new p5.Vector.sub(
      mousePosWorld,
      translatePoint
    );

    //**Display ButtonRollor and Read Value
    this.Py = this.buttonRollorTable_Py.ReadValue() * 1000;

    //console.log(this.Cy)
    this.buttonRollorTable_Py.DisplayButonRollor(this.graphPosNoScaleTable_Py);

    //line(0, 0, this.buttonRollor_Cy.pos1.x, this.buttonRollor_Cy.pos1.y);
    //line(0, 0, this.graphPosNoScale.x,this.graphPosNoScale.y);
    pop();
  }

  DisplayButtonRollor_Px() {
    push();
    //console.log(graph.insertGeo.x)
    let translatePoint = new p5.Vector();
    translatePoint.x = this.pos.x - 110;
    translatePoint.y = this.pos.y + 150;
    translate(translatePoint.x, translatePoint.y);

    this.graphPosNoScale_Px = new p5.Vector.sub(mousePosWorld, translatePoint);

    //**Display ButtonRollor and Read Value
    this.Px = this.buttonRollor_Px.ReadValue() * 1000;

    //console.log(this.Px)
    this.buttonRollor_Px.DisplayButonRollor(this.graphPosNoScale_Px);

    //line(0, 0, this.buttonRollor_Cy.pos1.x, this.buttonRollor_Cy.pos1.y);
    //console.log("load - DisplayButtonRollor_Px line 581")
    //line(0, 0, this.graphPosNoScale_Px.x,this.graphPosNoScale_Px.y);
    //circle(this.fixPointTable_Px.x,this.fixPointTable_Px.y,550)
    pop();
    
  }

  DisplayButtonRollorTable_Px() {
    push();
    //console.log(graph.insertGeo.x)
    let translatePoint = new p5.Vector();
    translatePoint.x = this.fixPointTable_Px.x + 55;
    translatePoint.y = this.fixPointTable_Px.y + 17.5;
    translate(translatePoint.x, translatePoint.y);

    this.graphPosNoScaleTable_Px = new p5.Vector.sub(mousePosWorld, translatePoint);

    //**Display ButtonRollor and Read Value
    this.Px = this.buttonRollorTable_Px.ReadValue() * 1000;

    //console.log(this.Py)
    this.buttonRollorTable_Px.DisplayButonRollor(this.graphPosNoScaleTable_Px);

    //line(0, 0, this.buttonRollor_Cy.pos1.x, this.buttonRollor_Cy.pos1.y);
    //line(0, 0, this.graphPosNoScale.x,this.graphPosNoScale.y);
    pop();
  }
}
