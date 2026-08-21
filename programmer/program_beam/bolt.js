class Bolt {
  constructor(nodeId,pos) {
    this.nodeId = nodeId;
    this.startPos = pos; //** p5.Vector
    this.endPos = new p5.Vector(0, 0);
    this.exist = 1;
    this.C = 10000; //** C=10kN/mm
    this.force = 0; //** Calculatet in  
  }

  Update() {
    //console.log("bolt line 11: "+ elements.length)

    if (this.exist == 1)  this.C = 1000*buttonRollor_ConnectionC.ReadValue(); //this.C = 10000;
    else this.C = 0;

    //** elements.length equal last node number
    if (this.nodeId < elements.length) {
      this.startPos = elements[this.nodeId].startPos;
    

      this.endPos.x = this.startPos.x;
      this.endPos.y = this.startPos.y + 50;
    } else {
      this.startPos = elements[this.nodeId - 1].endPos;
      

      this.endPos.x = this.startPos.x;
      this.endPos.y = this.startPos.y + 50;

    }
  }

  DisplayBolt() {
    if (this.exist == -1) return;
    push();
    strokeWeight(3);
    line(this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y);
    pop();
  }
}
