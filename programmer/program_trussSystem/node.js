class Node {
  constructor(ID, pos) {
    this.ID = ID;
    this.pos = pos;
    this.posDef = new p5.Vector(0, 0);

    this.connectingTrusses = [];

    //** Supports
    this.nodeSupportArray = [];
  }

  DisplayTempNode() {
    push();
    strokeWeight(4);
    stroke(150);
    circle(this.pos.x, this.pos.y, 20);
    pop();
  }

  DisplayNodeID() {
    push();
    circle(this.pos.x, this.pos.y, 17);
    textSize(25);
    textAlign(CENTER, CENTER);
    text(this.ID, this.pos.x, this.pos.y - 30);
    pop();
  }

  OverlapNodeSupportFixpoint(pos) {
    //** Called fron changeSystem.DeleteSupport

    for (let i = 0; i < this.nodeSupportArray.length; i++) {
      let distTofixPointSupport = dist(
        pos.x,
        pos.y,
        this.nodeSupportArray[i].fixPointSupport.x,
        this.nodeSupportArray[i].fixPointSupport.y
      );
      if (distTofixPointSupport < 20) {
        //console.log("Node " + this.ID + " * support number * " + i)

        //** Highligth
        //** HighLigth when overlap
        this.HighLigthFixPoint(i);
        return [true, this.ID, i];
      }
    }
    return [false, 0, 0];
  }

  //** called from this.OverlapNodeSupportFixpoint(pos)
  HighLigthFixPoint(supportNumber) {
    push();
    noStroke();
    fill(100, 100, 100, 100);
    if (mouseIsPressed) fill(0, 255, 0, 100);
    circle(
      this.nodeSupportArray[supportNumber].fixPointSupport.x,
      this.nodeSupportArray[supportNumber].fixPointSupport.y,
      20
    );
    pop();
  }

  //** called from nodeSystem.HighLigthElementAdd()
  HighLigthElementAdd(){
        push();
    noStroke();
    fill(0, 255, 0, 100);

    circle(this.pos.x, this.pos.y, 30);

    pop();
  }

  HighLigthNodeDelete() {
    push();
    noStroke();
    fill(255, 0, 0, 100);

    circle(this.pos.x, this.pos.y, 30);
    pop();
  }

  HighLigthNodeAddSupport() {
    if (this.nodeSupportArray.length == 2) return;

    push();
    noStroke();
    fill(0, 255, 0, 100);

    circle(this.pos.x, this.pos.y, 30);

    pop();
  }

  DisplayNodeSupport() {
    push();
    for (let i = 0; i < this.nodeSupportArray.length; i++) {
      this.nodeSupportArray[i].Update(this.pos);
      this.nodeSupportArray[i].Display();
      this.nodeSupportArray[i].DisplayFixpoint();
      //text(this.ID, this.pos.x, this.pos.y - 30);
    }
    pop();
  }

  DisplaySupportReaction() {  
  push();
    for (let i = 0; i < this.nodeSupportArray.length; i++) {
      this.nodeSupportArray[i].DisplayReaction();
    }
    pop();
  }

  AdjustNodeSupport() {}
}
