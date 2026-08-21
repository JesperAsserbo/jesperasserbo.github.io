let logElement = -1;

let logNode = 0;
let flagLoadLine = false;

class LoadLine {
  constructor(element, loadCaseNumber) {
    this.loadCaseNumber = loadCaseNumber;
    this.elevation = new p5.Vector(0, -55 - this.loadCaseNumber * 50);

    this.posLoadLineStart = element.startPos.copy();
    this.posLoadLineEnd = element.endPos.copy();

    //**LogNode
    this.logStartNode = false;
    this.logEndNode = false;

    this.lengthLoadLine;
    this.lastElementLength;
    this.firstElementLength;

    this.nodeIdStart = element.startNodeId;
    this.nodeIdEnd = element.endNodeId;

    this.Px = 0;

    this.PyDisplay = 40;

    this.PyStart = 1; //1kN/m
    this.PyEnd = 1; //1kN//m
    this.Pz = 0;

    this.fixPointLeft = new p5.Vector(0, 0);
    this.fixPointRight = new p5.Vector(0, 0);

    this.insertPoint = p5.Vector.add(this.posLoadLineStart, this.elevation);

    this.fixPointsDiameter = 20;

    this.elementStart;
    this.elementEnd;
    this.elementTotal;

    this.buttonRollor_loadLine = new ButtonRollor(
      (pos1x = 50), //** textPro BR
      (pos1y = 15), //** textPro BR
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
      (textPre = "kN/m"),
      (startValue = 1),
      (minValue = -200),
      (maxValue = 200)
    );

    this.graphPosNoScale = new p5.Vector();
  }

  Update(elements) {
    this.insertPoint = p5.Vector.add(this.posLoadLineStart, this.elevation);
    this.elevation = new p5.Vector(0, -55 - this.loadCaseNumber * 50);

    //**Update LoadLines
    for (let i = 0, length = elements.length; i < length; i++) {
      if (elements[i].startNodeId == this.nodeIdStart) {
        // if(elements[i].startPos.x == this.posLoadLineStart.x){
        this.posLoadLineStart = elements[i].startPos.copy();
        this.nodeIdStart = elements[i].startNodeId;
        this.firstElementLength = elements[i].elementLength; //**Used in AdjustLoadLines()
        //this.fixPointLeft.x = this.posLoadLineStart.x;
        //**ElementStart in lineLoads
        this.elementStart = i;
      }
      if (elements[i].endNodeId == this.nodeIdEnd) {
        //if(elements[i].endPos.x == this.posLoadLineEnd.x){
        this.posLoadLineEnd = elements[i].endPos.copy();
        this.nodeIdEnd = elements[i].endNodeId;
        this.lastElementLength = elements[i].elementLength; //**Used in AdjustLoadLines()
        //this.fixPointRight.x = this.posLoadLineEnd.x;
        //**ElementEnd in lineLoads
        this.elementEnd = i;
      }
    }

    this.elementTotal = this.elementEnd - this.elementStart + 1;

    this.lengthLoadLine = this.posLoadLineEnd.x - this.posLoadLineStart.x;

    //Update lineLoads if element changed
    //Update fixpoints if node Deleted or Added
    //this.posLoadLineStart
    //this.insertPoint = this.posLoadLineStart
  }

  DisplayButtonRollor(pos, elements) {
    //**ButtonRollor
    push();
    let translatePointLoadLine = new p5.Vector();
    translatePointLoadLine.x = elements[elements.length - 1].endPos.x;
    translatePointLoadLine.y = this.insertPoint.y - 15;
    translate(translatePointLoadLine.x, translatePointLoadLine.y);

    this.graphPosNoScale = new p5.Vector.sub(pos, translatePointLoadLine);

    //***************
    this.buttonRollor_loadLine.DisplayButonRollor(this.graphPosNoScale);

    //**ButtonRollor ReadValue
    this.PyStart = this.buttonRollor_loadLine.ReadValue(); //**ScaleMoment
    pop();
  }

  DisplayLoad() {
    push();
    //let top = this.posLoadLineStart;

    if (this.PyStart == 0) fill(100, 100, 100, 0);
    else fill(100, 100, 100, 50);

    //translate(0, -25);
    strokeWeight(1);
    let top0x = this.posLoadLineStart.x;
    let top0y = this.insertPoint.y;

    let top1x = this.posLoadLineStart.x;
    let top1y = this.insertPoint.y - this.PyDisplay;

    let top2x = this.posLoadLineEnd.x;
    let top2y = this.insertPoint.y - this.PyDisplay;

    let top3x = this.posLoadLineEnd.x;
    let top3y = this.insertPoint.y;
    //console.log(top1x )
    //fill(50)
    strokeWeight(4);
    quad(top0x, top0y, top1x, top1y, top2x, top2y, top3x, top3y);

    //**Arrow
    fill(0);
    if (this.PyStart > 0) {
      push();
      translate(top0x, top0y);
      triangle(0, -1, -6, -12, 6, -12);
      pop();
      push();
      translate(top3x, top3y);
      triangle(0, -1, -6, -12, 6, -12);
      pop();
    }

    if (this.PyStart < 0) {
      push();
      translate(top1x, top1y);
      triangle(0, 1, -6, 12, 6, 12);
      pop();
      push();
      translate(top2x, top2y);
      triangle(0, 1, -6, 12, 6, 12);
      pop();
    }

    pop();
  }

  
  AdjustLoadLines(pos, elements) {
   
    //**Find shortes distance to node
    let distNearest = Infinity;
    let scaleGeo = elements[0].scaleGeo;

    for (let i = 0, length = elements.length; i < length; i++) {
      if (elements[i].startPos.x < pos.x && pos.x < elements[i].endPos.x) {
        logElement = i;

        let distNodeStart = dist(pos.x, pos.y, elements[i].startPos.x, pos.y);
        let distNodeEnd = dist(pos.x, pos.y, elements[i].endPos.x, pos.y);
        if (distNodeStart < distNodeEnd) {
          logNode = -1;
          i = length; //** Stop loop when overlap
        } else {
          logNode = 1; //"endNode";
           i = length; //** Stop loop when overlap
        }
      }
 
    //**Display Adjust LoadLineStart to nodes
    if (this.OverlapStart(pos) || this.logStartNode) {
      if (mouseIsPressed) {
        //**OnlyMoveLeft of fixPontRight
        //this.posLoadLineStart.x
        flagLoadLine = true;
        if (
          pos.x <=
          10 + this.fixPointRight.x - this.lastElementLength / scaleGeo / 10
        ) {
         
          this.posLoadLineStart.x = pos.x;
          this.DisplayLoad();
        } else this.logStartNode = false;
      }

      if (mouseButtonIsReleased && logElement >= 0) {
        //**Set posLoadLineEnd
        if (logNode == -1)
          this.posLoadLineStart.x = elements[logElement].startPos.x;
        if (logNode == 1)
          this.posLoadLineStart.x = elements[logElement].endPos.x;
        //**Set nodeId
        if (logNode == -1) this.nodeIdStart = elements[logElement].startNodeId;
        if (logNode == 1) this.nodeIdStart = elements[logElement].endNodeId;
        // console.log("XX logelement: " + logElement);
        //console.log("LoadLine Line 244 - ***** " + logElement);
      }
      mouseButtonIsReleased = false;
    }

    //**Display Adjust LoadLineEnd to nodes
    if (this.OverlapEnd(pos) || this.logEndNode) {
      if (mouseIsPressed) {
        flagLoadLine = true;
        //**OnlyMoveRight of fixPointLeft
        if (
          pos.x >=
          -10 + this.fixPointLeft.x + this.firstElementLength / scaleGeo / 10
        ) {
    
          this.posLoadLineEnd.x = pos.x;
          //this.posLoadLineEnd.x = elements[logElement].endPos.x
          this.DisplayLoad();
        } else this.logEndNode = false;

        //if(logNode ==1) line(this.posLoadLineEnd.x,this.fixPointLeft.y,elements[logElement].endPos.x , elements[logElement].endPos.y-10)
      }

      if (mouseButtonIsReleased && logElement >= 0) {
        //**Set posLoadLineEnd
        if (logNode == -1)
          this.posLoadLineEnd.x = elements[logElement].startPos.x;
        if (logNode == 1) this.posLoadLineEnd.x = elements[logElement].endPos.x;
        //**Set nodeId
        if (logNode == -1) this.nodeIdEnd = elements[logElement].startNodeId;
        if (logNode == 1) this.nodeIdEnd = elements[logElement].endNodeId;
        //console.log("LoadLine Line 273 - ***** " + logElement);
      }
      mouseButtonIsReleased = false;
    }


    this.DisplayFixPoints();
    this.OverlapHighlight(pos);
  }
  }

  DisplayFixPoints() {
    //**Call from AdjustLoadLines(pos, elements)
    push();
    noFill();
    strokeWeight(1);
    stroke(50);

    let adjust = 0.65;
    if (this.PyStart < 0) adjust = 0.35;

    //**fixPointLeft
    this.fixPointLeft = new p5.Vector(
      this.posLoadLineStart.x,
      this.insertPoint.y - adjust * this.PyDisplay
    );
    circle(this.fixPointLeft.x, this.fixPointLeft.y, this.fixPointsDiameter);

    //**fixPointRight
    this.fixPointRight = new p5.Vector(
      this.posLoadLineEnd.x,
      this.insertPoint.y - adjust * this.PyDisplay
    );
    circle(this.fixPointRight.x, this.fixPointRight.y, this.fixPointsDiameter);

    //***************************************************
    textAlign(CENTER, CENTER);
    text(this.nodeIdEnd, this.fixPointRight.x + 15, this.fixPointRight.y);
    text(this.nodeIdStart, this.fixPointLeft.x - 15, this.fixPointLeft.y);
    pop();
  }

  OverlapStart(pos) {
    let distStart = dist(
      pos.x,
      pos.y,
      this.fixPointLeft.x,
      this.fixPointLeft.y
    );

    if (distStart < this.fixPointsDiameter) {
      if (mouseIsPressed) this.logStartNode = true; //** when mouseReleased => false
      return true;
    }
  }

  OverlapEnd(pos) {
    let distEnd = dist(
      pos.x,
      pos.y,
      this.fixPointRight.x,
      this.fixPointRight.y
    );
    if (distEnd < this.fixPointsDiameter) {
      if (mouseIsPressed) this.logEndNode = true; //** when mouseReleased => false
      return true;
    }
  }

  Overlap(pos) {
    let distStart = dist(
      pos.x,
      pos.y,
      this.fixPointLeft.x,
      this.fixPointLeft.y
    );
    if (distStart < this.fixPointsDiameter) return true;

    let distEnd = dist(
      pos.x,
      pos.y,
      this.fixPointRight.x,
      this.fixPointRight.y
    );
    if (distEnd < this.fixPointsDiameter) return true;

    return false;
  }

  OverlapHighlight(pos) {
    //**FixPointLeft
    let distToStart = dist(
      this.fixPointLeft.x,
      this.fixPointLeft.y,
      pos.x,
      pos.y
    );

    if (distToStart < 1 * this.fixPointsDiameter) {
      push();
      //scale(100 / this.scaleMesure); //**100/this.scaleMesure

      if (mouseIsPressed) {
        fill(0, 255, 0, 100);
        circle(
          this.fixPointLeft.x,
          this.fixPointLeft.y,
          this.fixPointsDiameter
        );
      } else {
        fill(100, 100, 100, 100);
        circle(
          this.fixPointLeft.x,
          this.fixPointLeft.y,
          this.fixPointsDiameter
        );
      }
      pop();
    }

    //**FixPointRight
    let distToEnd = dist(
      this.fixPointRight.x,
      this.fixPointRight.y,
      pos.x,
      pos.y
    );

    if (distToEnd < 1 * this.fixPointsDiameter) {
      push();
      //scale(100 / this.scaleMesure); //**100/this.scaleMesure

      if (mouseIsPressed) {
        fill(0, 255, 0, 100);
        circle(
          this.fixPointRight.x,
          this.fixPointRight.y,
          this.fixPointsDiameter
        );
      } else {
        fill(100, 100, 100, 100);
        circle(
          this.fixPointRight.x,
          this.fixPointRight.y,
          this.fixPointsDiameter
        );
      }
      pop();
    }
  }

  //**Define ID of nodes
  DefineLoadLine(pos, elements) {
    let nearest = 0;
    let distToStartTemp = Infinity;

    /*
    for (let i = 0, length = elements.length; i < length; i++) {
      //**element_Start FixPoint
      let distToStart = dist(
        elements[i].startPos.x,
        this.fixPointLeft.y,
        this.fixPointLeft.x,
        this.fixPointLeft.y
      );
      //console.log(distToStart);
      if (distToStart < distToStartTemp) {
        //this.nodeIdStart = elements[i].startNodeId;
        //this.posLoadLineStart = elements[i].startPos;
        nearest = distToStart;
        distToStartTemp = distToStart;
        //console.log("*")

        //break;
      }
    }
    */
    //console.log("nearest: " + nearest);
  }
}
