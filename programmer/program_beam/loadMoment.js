let logElementMomentLoad;
let logNodeMoment = 0;
let logMomentCaseNumber;

class LoadMoment {
  constructor(pos, loadCaseNumber) {
    this.loadCaseNumber = loadCaseNumber;
    this.elevation = new p5.Vector(0, -this.loadCaseNumber * 50);

    this.posLoadMoment = new p5.Vector(pos.x, pos.y);
    this.nodeId; // = 0;
    this.Px = 0;
    this.Py = 0;
    this.My = 1e6; //** 1kNm

    this.fixPoint = new p5.Vector(0, 0);
    this.fixPointsDiameter = 20;

    this.MyDisplay = 15;

    this.logNode = false;

    this.buttonRollor_loadMoment = new ButtonRollor(
      (pos1x = 50), //** textPro BR
      (pos1y = 5), //** textPro BR
      (pos2x = 112), //** "=" BR
      (pos3x = 245), //** ciffers BL
      (pos4x = 255), //** unit BR
      (prefix = 3),
      (sufix = 1),
      (buttonWidth = 20),
      (buttonHeight = 40),
      (letterSize = 30),
      (textPro = "My," + loadCaseNumber),
      (textMid = "="),
      (textPre = "kNm"),
      (startValue = 1),
      (minValue = -200),
      (maxValue = 200)
    );
  }

  Update() {
    //**LoadCase is BubbleSorted in changesystem
    this.elevation = new p5.Vector(0, -this.loadCaseNumber * 50);
    //this.lastElementLength = elements[i].elementLength; //**Used in AdjustLoadLines()
  }

  //** Adjust when node deleted.
  //** Called from Sketch
  AdjustLoadMomentPos(pos, elements, loadLinesLength) {
    for (let i = 0; i < elements.length; i++) {
      //**element_Start FixPoint
      let distToStart = dist(
        elements[i].startPos.x,
        elements[i].startPos.y,
        this.posLoadMoment.x,
        this.posLoadMoment.y
      );
      if (distToStart < 1 * elements[i].fixPointsDiameter) {
        this.nodeId = elements[i].startNodeId;
        this.posLoadMoment = elements[i].startPos;
        //console.log("loadMoment Line 63 - this.nodeId: " + this.nodeId);
        break;
      }

      //**element_End FixPoint
      let distToEnd = dist(
        elements[i].endPos.x,
        elements[i].endPos.y,
        this.posLoadMoment.x,
        this.posLoadMoment.y
      );
      if (distToEnd < 1 * elements[i].fixPointsDiameter) {
        this.nodeId = elements[i].endNodeId;
        this.posLoadMoment = elements[i].endPos;
        //console.log("loadMoment Line 77 - this.nodeId: " + this.nodeId);
        //console.log(this.nodeId);
        break;
      }
    }

    //console.log("**** loadMoment Line 83 - pos " + this.posLoadMoment)
    this.MoveLoad(pos, elements, loadLinesLength);
  }

  //** Called from this.AdjustLoadMomentPos()
  MoveLoad(pos, elements, loadLinesLength) {
    if (this.Overlap(pos)) {
      //**Store loadCaseNumber (Reset to undefined when mouseIsReleased in changesystem.ChangeLoadMomentPos(pos) )
      if (mouseIsPressed) logMomentCaseNumber = this.loadCaseNumber;
    }
    //console.log("LoadMoment Line 89 - LoadCaseNumber: " + this.loadCaseNumber)
    if (mouseIsPressed && this.loadCaseNumber == logMomentCaseNumber) {
      push();
      fill(0, 255, 0, 100);
      circle(pos.x, this.fixPoint.y, 20);
      this.MoveLoadDisplay(pos, loadLinesLength);
      pop();
    } else {
      if (this.Overlap(pos)) this.OverlapHighlight(pos);
      this.DisplayFixPoint(loadLinesLength);
    }
    //console.log(this.logNode)
  }

  //** Called from this.MoveLoad()
  MoveLoadDisplay(pos, loadLinesLength) {
    push();
    let top = pos;
    stroke(50);
    strokeWeight(2);

    //console.log("loadMoment Line 112 - logMomentCaseNumber: " + top)
    //**Arrow
    translate(
      1 * top.x,
      this.posLoadMoment.y -
        50 * logMomentCaseNumber -
        60 -
        loadLinesLength * 50
    ); // 1*top.y + 0*this.elevation.y - 0*60 - 0*loadLinesLength * 50);

    if (this.My > 0) {
      noFill();
      strokeWeight(4);
      arc(0, 0, 50, 50, 1.2 * PI, 1.8 * PI);
      circle(0, -5, 2);
      translate(+23, -12);
      fill(0);
      triangle(0, 0, -2, -12, -12, -2);
    }
    if (this.My < 0) {
      noFill();
      strokeWeight(4);
      arc(0, 0, 50, 50, 1.2 * PI, 1.8 * PI);
      circle(0, 0 - 5, 2);
      translate(-23, -12);
      fill(0);
      triangle(0, 0, 2, -12, 12, -2);
    }

    pop();
  }

  DisplayLoadMoment() {
    push();
    //**ReactionMoment
    textAlign(LEFT, CENTER);
    stroke(0);
    textSize(24);
    //**isNaN(x) return true if x is NaN

    /*
      if (this.My != 0 && isNaN(this.My) == false)
        text(
          nf(abs(this.My), 0, 2) + " kNm",
          this.posLoadMoment.x + 30,
          this.posLoadMoment.y - 25
        );
*/

    let length = loadLines.length + loadPoints.length;

    let x = this.posLoadMoment.x;
    let y = this.posLoadMoment.y + this.elevation.y - 60 - length * 50;

    //console.log(this.My)
    //console.log("loadMoment line 166 - this.posLoadMoment.y: " + this.posLoadMoment.y);
    if (this.My > 0 && isNaN(this.My) == false) {
      
      noFill();
      strokeWeight(4);
      arc(x, y, 50, 50, 1.2 * PI, 1.8 * PI);
      circle(x, y - 5, 2);
      translate(x + 23, y - 12);
      fill(0);
      triangle(0, 0, -2, -12, -12, -2);
    }

    if (this.My < 0 && isNaN(this.My) == false) {
      noFill();
      strokeWeight(4);
      arc(x, y, 50, 50, 1.2 * PI, 1.8 * PI);
      circle(x, y - 5, 2);
      translate(x - 23, y - 12);
      fill(0);
      triangle(0, 0, 2, -12, 12, -2);
    }

    pop();

   // this.DisplayFixPoint(length);
  }

  DisplayFixPoint(loadLength) {
    //**Call from AdjustLoadLines(pos, elements)
    push();
    noFill();
    strokeWeight(1);
    stroke(50);

    //**fixPoint
    this.fixPoint = new p5.Vector(
      this.posLoadMoment.x,
      this.posLoadMoment.y -
        50 -
        loadLength * 50 -
        1 * this.MyDisplay +
        this.elevation.y
    );
    circle(this.fixPoint.x, this.fixPoint.y, this.fixPointsDiameter);
    pop();
  }

  DisplayButtonRollor(pos, elements, loadLinesLength) {
    let length = loadLines.length + loadPoints.length;
    //console.log("loadMoment line 210: " + this.elevation.y);

    //**ButtonRollor
    push();
    let translateLoadMoment = new p5.Vector();
    translateLoadMoment.x = elements[elements.length - 1].endPos.x;
    translateLoadMoment.y =
      this.posLoadMoment.y + this.elevation.y - 60 - length * 50;
    translate(translateLoadMoment.x, translateLoadMoment.y);

    this.graphPosNoScale = new p5.Vector.sub(pos, translateLoadMoment);

    //***************
    this.buttonRollor_loadMoment.DisplayButonRollor(this.graphPosNoScale);

    //**ButtonRollor ReadValue
    this.My = this.buttonRollor_loadMoment.ReadValue() * 1000000;
    pop();
  }

  Overlap(pos) {
    let distLoad = dist(pos.x, pos.y, this.fixPoint.x, this.fixPoint.y);
    if (distLoad < this.fixPointsDiameter) {
      if (mouseIsPressed) this.logNode = true;
      return true;
    }
    return false;
  }

  OverlapHighlight(pos) {
    push();
    fill(100, 100, 100, 100);
    circle(this.fixPoint.x, this.fixPoint.y, this.fixPointsDiameter);

    if (mouseIsPressed) {
      fill(0, 255, 0, 50);
      circle(this.fixPoint.x, this.fixPoint.y, this.fixPointsDiameter);
    }
    pop();
  }
}
