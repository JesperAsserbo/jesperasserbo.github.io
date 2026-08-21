let logElementPointLoad;
let logNodePointLoad = 0;
let logPointLoadCaseNumber;

class LoadPoint {
  constructor(pos, loadCaseNumber) {
    this.loadCaseNumber = loadCaseNumber;
    this.elevation = new p5.Vector(0, -this.loadCaseNumber * 50);

    this.posLoadPoint = new p5.Vector(pos.x, pos.y);
    this.nodeId; // = 0;
    this.Px = 0;
    this.Py = 1e3; //** 1kN
    this.Pz = 0;

    this.fixPoint = new p5.Vector(0, 0);
    this.fixPointsDiameter = 20;

    this.PyDisplay = 35;

    this.logNode = false;

    this.buttonRollor_loadPoint = new ButtonRollor(
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
      (textPro = "Py," + loadCaseNumber),
      (textMid = "="),
      (textPre = "kN"),
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

  //**Adjust when node deleted.
  AdjustLoadPos(pos, elements, loadLinesLength) {
    for (let i = 0; i < elements.length; i++) {
      //**element_Start FixPoint
      let distToStart = dist(
        elements[i].startPos.x,
        elements[i].startPos.y,
        this.posLoadPoint.x,
        this.posLoadPoint.y
      );
      if (distToStart < 1 * elements[i].fixPointsDiameter) {
        this.nodeId = elements[i].startNodeId;
        this.posLoadPoint = elements[i].startPos;
        //console.log(this.node);
        break;
      }

      //**element_End FixPoint
      let distToEnd = dist(
        elements[i].endPos.x,
        elements[i].endPos.y,
        this.posLoadPoint.x,
        this.posLoadPoint.y
      );
      if (distToEnd < 1 * elements[i].fixPointsDiameter) {
        this.nodeId = elements[i].endNodeId;
        this.posLoadPoint = elements[i].endPos;
        //console.log(this.node);
        break;
      }
    }
 //console.log("**** loadPoint Line 80 - pos " + this.posLoadPoint)
    this.MoveLoad(pos, elements, loadLinesLength);
  }

  MoveLoad(pos, elements, loadLinesLength) {
    if (this.Overlap(pos)) {
      //**Store loadCaseNumber (Reset to undefined when mouseIsReleased in changesystem.ChangeLoadPointPos(pos) )
      if (mouseIsPressed) logPointLoadCaseNumber = this.loadCaseNumber;
    }
    //console.log(logPointLoadCaseNumber)
    if (mouseIsPressed && this.loadCaseNumber == logPointLoadCaseNumber) {
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

  MoveLoadDisplay(pos, loadLinesLength) {
    push();
    let top = pos;
    stroke(50);
    strokeWeight(2);

    //**Arrow
    translate(
      1 * top.x,
      this.posLoadPoint.y -
        50 * logPointLoadCaseNumber -
        60 -
        loadLinesLength * 50
    ); // 1*top.y + 0*this.elevation.y - 0*60 - 0*loadLinesLength * 50);
    line(0, 5, 0, -this.PyDisplay);
    fill(50);
    strokeWeight(2);
    if (this.Py > 0) triangle(0, 5, -5, -8, 5, -8);
    if (this.Py < 0)
      triangle(
        0,
        -this.PyDisplay,
        -5,
        14 - this.PyDisplay,
        5,
        14 - this.PyDisplay
      );

    pop();
  }

  DisplayLoad(loadLinesLength) {
    push();
    let top = this.posLoadPoint;
    stroke(50);

    strokeWeight(4);

    //**Arrow
    translate(top.x, top.y + this.elevation.y - 60 - loadLinesLength * 50);
    line(0, 5, 0, -this.PyDisplay);
    fill(50);
    strokeWeight(2);
    if (this.Py > 0) triangle(0, 7, -8, -8, 8, -8);
    if (this.Py < 0)
      triangle(
        0,
        -this.PyDisplay-2,
        -8,
        14 - this.PyDisplay,
        8,
        14 - this.PyDisplay
      );

    pop();

    //this.DisplayFixPoint(loadLinesLength);
  }

  DisplayFixPoint(loadLinesLengt) {
    //**Call from AdjustLoadLines(pos, elements)
    push();
    noFill();
    strokeWeight(1);
    stroke(50);

    let adjust = 0.9;
    if (this.Py < 0) adjust = 0.5;

    //**fixPoint
    this.fixPoint = new p5.Vector(
      this.posLoadPoint.x,
      this.posLoadPoint.y -
        50 -
        loadLinesLengt * 50 -
        adjust * this.PyDisplay +
        this.elevation.y
    );
    circle(this.fixPoint.x, this.fixPoint.y, this.fixPointsDiameter);
    pop();
  }

  DisplayButtonRollor(pos, elements, loadLinesLength) {
    //**ButtonRollor
    push();
    let translatePointLoad = new p5.Vector();
    translatePointLoad.x = elements[elements.length - 1].endPos.x;
    translatePointLoad.y =
      this.posLoadPoint.y + this.elevation.y - 60 - loadLinesLength * 50;
    translate(translatePointLoad.x, translatePointLoad.y);

    this.graphPosNoScale = new p5.Vector.sub(pos, translatePointLoad);

    //***************
    this.buttonRollor_loadPoint.DisplayButonRollor(this.graphPosNoScale);

    //**ButtonRollor ReadValue
    this.Py = this.buttonRollor_loadPoint.ReadValue() * 1000;
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
