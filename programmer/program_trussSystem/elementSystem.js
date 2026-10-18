//** create nodesystem where each node contain rods that have node
//** for each node fill in stiffnessMatrix global

class ElementSystem {
  constructor() {
    this.elementArray = [];
    this.overlapElement = false;
    this.elementCenterOverlap = null; //** elementNumber to delete

    this.tempElementArray = [];
  }

  //** Display Element
  DisplayElement() {
    for (let i = 0; i < this.elementArray.length; i++) {
      this.elementArray[i].DisplayElement();
    }
  }

  //** Display ElementDef
  DisplayElementDef() {
    for (let i = 0; i < this.elementArray.length; i++) {
      this.elementArray[i].DisplayElementDef();
    }
  }

  //** UpdateElementID
  UpdateID() {
    //** ElementID
    for (let i = 0; i < this.elementArray.length; i++) {
      this.elementArray[i].id = i;
    }
  }

  //** Display
  DisplayElementID() {
    for (let i = 0; i < this.elementArray.length; i++) {
      this.elementArray[i].DisplayElementID();
    }
  }

  DataUpdate() {
    for (let i = 0; i < this.elementArray.length; i++) {
      this.elementArray[i].DataUpdate();
    }
  }

  //** used in changeSystem.DeleteElement(pos)
  OverlapElement(pos) {
    for (let i = 0; i < this.elementArray.length; i++) {
      if (this.elementArray[i].OverlapElement(pos) != null && mouseIsPressed) {
        this.elementCenterOverlap = this.elementArray[i].OverlapElement(pos);     
      }
      this.elementArray[i].HighLigthElement();
    }
  }

  UpdateNormalForce() {
    for (let i = 0; i < this.elementArray.length; i++) {
      let u11 = this.elementArray[i].startNode.posDef.x;
      let u12 = this.elementArray[i].startNode.posDef.y;
      let u21 = this.elementArray[i].endNode.posDef.x;
      let u22 = this.elementArray[i].endNode.posDef.y;
      let k = this.elementArray[i].springStiffness;
      let c = this.elementArray[i].cos;
      let s = this.elementArray[i].sin;
      this.elementArray[i].N = k * (-u11 * c - u12 * s + u21 * c + u22 * s);
      //console.log("element " + i + " Force " + this.elementArray[i].N )
    }
  }

  DisplayElementColor() {
    let forceMax = 0;
    let forceMin = 0;
    let recordMaxElementForce = 0;
    for (let i = 0, length = this.elementArray.length; i < length; i++) {
      if (this.elementArray[i].N > 0 && this.elementArray[i].N > forceMax)
        forceMax = this.elementArray[i].N;
      if (this.elementArray[i].N < 0 && this.elementArray[i].N < forceMin)
        forceMin = this.elementArray[i].N;
    }

    recordMaxElementForce = max(forceMax, abs(forceMin));

    //Color
    let R = 0;
    let G = 0;
    let B = 0;
    push();
    for (let i = 0, length = this.elementArray.length; i < length; i++) {
      let elementForceColor = abs(this.elementArray[i].N);
      let temp = elementForceColor / recordMaxElementForce;

      //springColer
      if (this.elementArray[i].N < 0) {
        R = 255 * (1 - 0.1 * temp);
        G = 255 * (1 - temp);
        B = 255 * (1 - temp);
        //console.log("compression called: R " + R + " G " + G + " B " + B);
        //console.log("comperssion " + temp);
      }

      if (this.elementArray[i].N > 0) {
        R = 255 * (1 - temp);
        G = 255 * (1 - temp);
        B = 255 * (1 - 0.1 * temp);
        //console.log("tension " + this.elementArray[i].N);
      }

      //StrokeWeight mellem 1 og 10
      let strokeWeightDisplay =
        (10 / recordMaxElementForce) * elementForceColor * 1 + 3; //minimum 3 pixels

      //Når Force < 2% er farve grå
      if (temp < 0.02) {
        stroke(255, 100);
        strokeWeight(1);
      } else {
        strokeWeight(strokeWeightDisplay);
        stroke(color(R, G, B, 150));
      }

      line(
        this.elementArray[i].startNode.pos.x,
        this.elementArray[i].startNode.pos.y,
        this.elementArray[i].endNode.pos.x,
        this.elementArray[i].endNode.pos.y
      );
    }
    pop();
  }
  DisplayElementForceOnGraph() {
    push();
    textAlign(CENTER, CENTER);
    textSize(20);
    for (let i = 0, length = this.elementArray.length; i < length; i++) {
      //**Background
      noStroke();
      fill(255);
      rect(
        this.elementArray[i].centerPos.x - 25,
        this.elementArray[i].centerPos.y - 36.5,
        50,
        20
      );

      let force = 0;
      force = this.elementArray[i].N / 1000;

      if (Number.isNaN(force)) {
        force = nf(0.0, 0, 1);
        fill(0, 0, 0);
      } else if (abs(force) < 0.05) {
        force = nf(0.0, 0, 1);
        fill(0, 0, 0);
      } else if (this.elementArray[i].N < 0) fill(255, 0, 0);
      else if (this.elementArray[i].N > 0) fill(0, 0, 255);
      else fill(0);
      stroke(0);
      text(
        nf(round(force, 1), 0, 1),
        this.elementArray[i].centerPos.x,
        this.elementArray[i].centerPos.y - 25
      );
    }
    pop();
  }
}

/*
  OverlapNodeTest(pos) {
    //console.log(this.nodeArray[0].pos.x)
    for (let i = 0; i < this.nodeArray.length; i++) {
      let distFromMousePosToNode = dist(
        pos.x,
        pos.y,
        this.nodeArray[i].pos.x,
        this.nodeArray[i].pos.y
      );
  
      if (distFromMousePosToNode < 20) {
        this.overlapNode = true;
        this.overlapNodeID = this.nodeArray[i].ID;
        this.overlappedNodePosInArray = i;
        if (mouseIsPressed) {
          logNode = true;
          logNodePosInArray = i;
        } // only set to false if in mouseReleased
        break;
      } else {
        this.overlapNode = false;
        this.overlapNodeID = null;
        this.overlappedNodePosInArray = null;
      }
    }
  }
  */
