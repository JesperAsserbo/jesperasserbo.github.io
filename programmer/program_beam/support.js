class Support {
  constructor(pos, type) {
    //**Type
    //**2 => Cy (fixed vertical)
    //**3 => Cz (fixed rotation)

    this.posSupport = new p5.Vector(pos.x, pos.y);
    this.posSupportDef = new p5.Vector(pos.x, pos.y);
    this.nodeId = 0;
    this.supportFixPointDiameter = 20;
    this.Cx = 0;
    this.Cy = 0;
    this.Cz = 0;

    //** Supports set in changeSystem,AddSupport
    if (type == 2) {
      this.Cy = 1000e3;
      //this.Cz = 0;
    } //** 1.000 kN/mm
    if (type == 3) {
      //this.Cy=0;
      this.Cz = 1000e9;
    } //** 1.000 kNm/rad

    this.reaction = 0;
    this.reactionMoment = 0;

    this.supportButtonOverlap = false;
    this.fixPointDiameter = 20;

    this.fixPoint = new p5.Vector(0, 0);
    this.fixPoint_Cz = new p5.Vector(0, 0);
    this.supportOverlap = false;
    this.supportOverlap_Cz = false;

    this.graphPosNoScale_Cy = new p5.Vector(0, 0);
    this.graphPosNoScale_Cz = new p5.Vector(0, 0);

    this.buttonRollor_Cy = new ButtonRollor(
      (pos1x = -20), //** textPro BR
      (pos1y = 0), //** textPro BR
      (pos2x = 20), //** "=" BR
      (pos3x = 155), //** ciffers BL
      (pos4x = 165), //** unit BR
      (prefix = 4),
      (sufix = 1),
      (buttonWidth = 20),
      (buttonHeight = 40),
      (letterSize = 30),
      (textPro = ""), //** Cy
      (textMid = ""), //** =
      (textPre = ""), //** kN/mm
      (startValue = 1000),
      (minValue = 0.1),
      (maxValue = 9999)
    );

    this.buttonRollor_Cz = new ButtonRollor(
      (pos1x = -40), //** textPro BR
      (pos1y = 0), //** textPro BR
      (pos2x = 0), //** "=" BR
      (pos3x = 155), //** ciffers BL
      (pos4x = 165), //** unit BR
      (prefix = 4),
      (sufix = 2),
      (buttonWidth = 20),
      (buttonHeight = 40),
      (letterSize = 30),
      (textPro = ""), //** Cz
      (textMid = ""), //** =
      (textPre = ""), //** kNm/rad
      (startValue = 1000),
      (minValue = 0.01),
      (maxValue = 9999)
    );
  }

  OverlapFixPoint() {
    //**If overlap fixpoint variable true
    //**True while in boxLimits otherwise false
    let distSupport = dist(
      mousePosWorld.x,
      mousePosWorld.y,
      this.fixPoint.x,
      this.fixPoint.y
    );
    if (distSupport < this.fixPointDiameter) {
      this.supportOverlap = true;
    }

    push();
    fill(0, 250, 0, 100);
    if (this.supportOverlap && this.Cy > 0)
      circle(this.fixPoint.x, this.fixPoint.y, 20);
    pop();

    let left = this.fixPoint.x - 70;
    let right = this.fixPoint.x + 50;
    let top = this.fixPoint.y - 25;
    let bottom = this.fixPoint.y + 125;
    if (
      left > mousePosWorld.x ||
      mousePosWorld.x > right ||
      top > mousePosWorld.y ||
      mousePosWorld.y > bottom
    ) {
      this.supportOverlap = false;
      //**Set to false otherwise sometimes stuck in trueMode
      this.buttonRollor_Cy.overlapCiffer = false; 
      this.buttonRollor_Cz.overlapCiffer = false; 
      //*****************************************************************
    }
    //console.log("Support.OverlapFixPoint: " + this.supportOverlap);
  }

  /*
  //**Overlap support to adjust springConstant Cy
  //**Testvalue this.supportOverlap = true until outside limit
  OverlapSupport(pos) {
    
    this.DisplayButtonRollor();
    //this.OverlapFixPoint();
    /*
    let left = this.fixPoint.x - 50;
    let right = this.fixPoint.x + 50;
    let top = this.fixPoint.y - 25;
    let bottom = this.fixPoint.y + 125;
    if (left < mousePosWorld.x && mousePosWorld.x < right) {
      if (top < mousePosWorld.y && mousePosWorld.y < bottom) {
        push();
        noFill();
        //circle(this.fixPoint.x,this.fixPoint.y,100);
        rect(this.fixPoint.x - 50, this.fixPoint.y - 25, 100, 150);

        pop();
        this.DisplayButtonRollor();
        //this.supportOverlap = true;
        //return true;
      }
    } else {
      //this.supportOverlap = false;


      //**If buttonRoller is not displayed then automatic set
      //**Overlap varible to false
      //this.buttonRollor_Cy.overlapCiffer = false;
      //return false;
    }*/
  //  }

  OverlapFixPoint_Cz() {
    //**If overlap fixpoint variable true
    //**True while in boxLimits otherwise false
    let distSupport = dist(
      mousePosWorld.x,
      mousePosWorld.y,
      this.fixPoint_Cz.x,
      this.fixPoint_Cz.y
    );
    if (distSupport < this.fixPointDiameter) {
      this.supportOverlap_Cz = true;
    }

    push();
    fill(0, 250, 0, 100);
    if (this.supportOverlap_Cz && this.Cz > 0)
      circle(this.fixPoint_Cz.x, this.fixPoint_Cz.y, 20);
    pop();

    let left = this.fixPoint_Cz.x - 10;
    let right = this.fixPoint_Cz.x + 210;
    let top = this.fixPoint_Cz.y - 20;
    let bottom = this.fixPoint_Cz.y + 30;

    let w = right - left;
    let h = bottom - top;

    //******************** Display Area for buttonRollor
    //rect(left, top, w, h);
    if (
      left > mousePosWorld.x ||
      mousePosWorld.x > right ||
      top > mousePosWorld.y ||
      mousePosWorld.y > bottom
    ) {
      this.supportOverlap_Cz = false;

      //**Set to false otherwise sometimes stuck in trueMode
      this.buttonRollor_Cz.overlapCiffer = false;
    }
  }

  DataUpdate() {
    //console.log(this.supportOverlap)
  }

  DisplayButtonRollor() {
    if (this.Cy != 0 && this.supportOverlap) {
      push();
      //console.log("**** Cy *****");
      //console.log(graph.insertGeo.x)
      let translatePoint = new p5.Vector();
      translatePoint.x = this.posSupport.x - 110;
      translatePoint.y = this.posSupport.y + 190;
      translate(translatePoint.x, translatePoint.y);

      this.graphPosNoScale_Cy = new p5.Vector.sub(
        mousePosWorld,
        translatePoint
      );

      //**Display ButtonRollor and Read Value
      this.buttonRollor_Cy.DisplayButonRollor(this.graphPosNoScale_Cy);
      this.Cy = this.buttonRollor_Cy.ReadValue() * 1000;
      //line(0, 0, this.buttonRollor_Cy.pos1.x, this.buttonRollor_Cy.pos1.y);
      //line(0, 0, this.graphPosNoScale.x,this.graphPosNoScale.y);
      pop();
    }

    /*
    if (this.Cz != 0 && this.supportOverlap_Cz) {
      push();
      console.log("**** Cz *****")
      //** Location of buttonRoller respective to supportPos
      let translatePoint_Cz = new p5.Vector();
      translatePoint_Cz.x = this.posSupport.x + 50;
      translatePoint_Cz.y = this.posSupport.y - 5;
      translate(translatePoint_Cz.x, translatePoint_Cz.y);

      this.graphPosNoScale_Cz = new p5.Vector.sub(
        mousePosWorld,
        translatePoint_Cz
      );

      //**Display ButtonRollor and Read Value
      this.buttonRollor_Cz.DisplayButonRollor(this.graphPosNoScale_Cz);
      this.Cz = this.buttonRollor_Cz.ReadValue() * 1000000;
      //line(0, 0, this.buttonRollor_Cy.pos1.x, this.buttonRollor_Cy.pos1.y);
      //line(0, 0, this.graphPosNoScale.x,this.graphPosNoScale.y);
      pop();
    }
    */
  }

  DisplayButtonRollor_Cz() {
    if (this.Cz != 0 && this.supportOverlap_Cz) {
      push();
      //console.log("**** Cz *****");
      //** Location of buttonRoller respective to supportPos
      let translatePoint_Cz = new p5.Vector();
      translatePoint_Cz.x = this.posSupport.x + 50;
      translatePoint_Cz.y = this.posSupport.y - 5;
      translate(translatePoint_Cz.x, translatePoint_Cz.y);

      this.graphPosNoScale_Cz = new p5.Vector.sub(
        mousePosWorld,
        translatePoint_Cz
      );

      //**Display ButtonRollor and Read Value
      this.buttonRollor_Cz.DisplayButonRollor(this.graphPosNoScale_Cz);
      this.Cz = this.buttonRollor_Cz.ReadValue() * 1000000000;
      //line(0, 0, this.buttonRollor_Cy.pos1.x, this.buttonRollor_Cy.pos1.y);
      //line(0, 0, this.graphPosNoScale.x,this.graphPosNoScale.y);
      pop();
    }
  }

  AdjustSupport(elements) {
    this.supportFixPointDiameter = elements[0].fixPointsDiameter;
    //console.log("elementsLength*******: " + elements.length);
    for (let i = 0; i < elements.length; i++) {
      //console.log("endNodeId: " + elements[i].endNodeId);

      let distToStart = dist(
        elements[i].startPos.x,
        elements[i].startPos.y,
        this.posSupport.x,
        this.posSupport.y
      );

      let distToEnd = dist(
        elements[i].endPos.x,
        elements[i].endPos.y,
        this.posSupport.x,
        this.posSupport.y
      );

      //**element_Start FixPoint

      if (distToStart < 1 * elements[i].fixPointsDiameter) {
        this.nodeId = elements[i].startNodeId;
        this.posSupport = elements[i].startPos;
        //console.log("supportNodeId Start: " + this.nodeId);
        break;
      }

      //**element_End FixPoint
      else if (distToEnd < 1 * elements[i].fixPointsDiameter) {
        this.nodeId = elements[i].endNodeId;
        this.posSupport = elements[i].endPos;
        //console.log("supportNodeId End: " + this.nodeId);
        break;
      }
    }
  }

  DisplaySupport(nodeResultDefY) {
    //this.OverlapSupport();

    //console.log("Cy: " + this.Cy)
    //console.log("Cz: " + this.Cz)

    //console.log(this.buttonRollor_Cy.value)

    if (this.Cy > 0) {
      this.posSupportDef.x = this.posSupport.x;
      this.posSupportDef.y = nodeResultDefY[this.nodeId];

      push();
      let top = new p5.Vector(this.posSupport.x, this.posSupport.y); // + nodeResultDefY[this.nodeId]

      //**FixPoint Cy
      stroke(50);
      noFill();

      if (this.reaction > 0) {
        circle(
          this.posSupport.x,
          this.posSupport.y + 90,
          this.fixPointDiameter
        );
        this.fixPoint = new p5.Vector(
          this.posSupport.x,
          this.posSupport.y + 90
        );
      } else {
        circle(
          this.posSupport.x,
          this.posSupport.y + 80,
          this.fixPointDiameter
        );
        this.fixPoint = new p5.Vector(
          this.posSupport.x,
          this.posSupport.y + 80
        );
      }

      //**Fjeder
      translate(top.x, top.y);
      fill(255);
      stroke(0,0,0,150);
      strokeWeight(1);
      noFill()
      triangle(0, 30, 0 - 15, 0 + 45, 0 + 15, 0 + 45);

      line(0, 0, 0, 10);
      line(0, 10, -10, 12.5);
      line(-10, 12.5, 10, 17.5);
      line(10, 17.5, 0, 20);
      line(0, 30, 0, 20);
      fill(0);
      circle(0, 0, 4);
      circle(0, 30, 4);

      pop();
    }

    this.DisplaySupportFixed();
  }

  DisplaySupportFixed() {
    if (this.Cz > 0) {
      let r = 1;
      let angle = 0;
      let posStart = new p5.Vector(this.posSupport.x, this.posSupport.y);
      let pos;
      let spiral = [];
      spiral.push(posStart);

      for (let i = 0; i < 20; i++) {
        angle -= PI / 8;
        r += 0.5;
        pos = new p5.Vector(r * cos(angle), r * sin(angle));
        spiral.push(p5.Vector.add(posStart, pos));
        //circle(spiral[i].x,spiral[i].y,2)
      }
      push();

      //**FixPoint Cz - Draw and set fixpoint
      stroke(100);
      noFill();
      circle(this.posSupport.x, this.posSupport.y - 30, this.fixPointDiameter);

      this.fixPoint_Cz = new p5.Vector(
        this.posSupport.x,
        this.posSupport.y - 30
      );
      pop();

      push();
      strokeWeight(2);

      for (let i = 1; i < spiral.length - 1; i++) {
        line(spiral[i].x, spiral[i].y, spiral[i + 1].x, spiral[i + 1].y);
      }

      //let lineEnd = new p5.Vector(posStart.x - 20, spiral[spiral.length -1].y);
      let lineEnd = new p5.Vector(spiral[spiral.length - 1].x, posStart.y - 30);

      line(
        spiral[spiral.length - 1].x,
        spiral[spiral.length - 1].y,
        lineEnd.x,
        lineEnd.y
      );
      fill(0);
      circle(lineEnd.x, lineEnd.y, 8);
      //rect(lineEnd.x - 15, lineEnd.y - 2, 30, 1);
      //circle(lineEnd.x - 8, lineEnd.y - 8, 5);
      //circle(lineEnd.x + 8, lineEnd.y - 8, 5);
      //line(lineEnd.x,lineEnd.y+15,lineEnd.x,lineEnd.y-15)
      //**Draw

      pop();
    }
  }
}
