class Plate {
  constructor() {
    this.plate_t = 10;
    this.fu = 360; //** S235

    this.edge = [
      [5 * 10 + graph.insertPoint.x, 5 * 10 + graph.insertPoint.y],
      [5 * 10 + graph.insertPoint.x, 40 * 10 + graph.insertPoint.y],
      [5 * 10 + graph.insertPoint.x, 80 * 10 + graph.insertPoint.y],
      [40 * 10 + graph.insertPoint.x, 80 * 10 + graph.insertPoint.y],
      [80 * 10 + graph.insertPoint.x, 80 * 10 + graph.insertPoint.y],
      [80 * 10 + graph.insertPoint.x, 40 * 10 + graph.insertPoint.y],
      [80 * 10 + graph.insertPoint.x, 5 * 10 + graph.insertPoint.y],
      [40 * 10 + graph.insertPoint.x, 5 * 10 + graph.insertPoint.y],
      [5 * 10 + graph.insertPoint.x, 5 * 10 + graph.insertPoint.y],
    ];

    this.xMax = 0;
    this.yMax = 0;

    //** set to null in sketch.mouseReleased();
    this.edgePointLocked = null;
  }

  Update() {
    this.plate_t = buttonRollor_plate_t.ReadValue();
    this.fu = buttonChoiceLibPlateStrength.GetValue(4);
    //this.do = this.d + buttonRollor_dt.ReadValue();

    //** Closed Edge
    this.edge[8][0] = this.edge[0][0];
    this.edge[8][1] = this.edge[0][1];
  }

  FindXY_Max() {
    this.xMax = 0;
    this.yMax = 0;
    for (let i = 0; i < this.edge.length - 1; i++) {
      if (this.edge[i][0] > this.xMax) this.xMax = this.edge[i][0];
      if (this.edge[i][1] > this.yMax) this.yMax = this.edge[i][1];
    }

    //console.log("xMax " + this.xMax + " yMax " + this.yMax)
  }

  DrawEdge() {
    push();
    strokeWeight(1);

    //**Edge
    for (let i = 0; i < this.edge.length - 1; i++) {
      let x1 = this.edge[i][0];
      let y1 = this.edge[i][1];

      let x2 = this.edge[i + 1][0];
      let y2 = this.edge[i + 1][1];

      line(x1, y1, x2, y2);
      fill(0);
      circle(x1, y1, 4);

      push();
      noFill();
      stroke(100);
      circle(x1, y1, 20);
      pop();
    }

    //** Plate
    // Start drawing the shape.
    beginShape();
    fill(10, 10, 10, 20);

    // Add vertices.
    for (let i = 0; i < this.edge.length - 1; i++) {
      vertex(this.edge[i][0], this.edge[i][1]);
    }

    // Stop drawing the shape.
    endShape(CLOSE);

    pop();
  }

  OverlapEdgePoint(pos) {
    if (this.edgePointLocked != null) return;
    if (system.logLoad) return;
    if (system.logBoltId != null) return;

    for (let i = 0; i < this.edge.length; i++) {
      let distToPoint = dist(pos.x, pos.y, this.edge[i][0], this.edge[i][1]);

      if (distToPoint < 20) {
        //** Highligth if overlapped
        push();
        noStroke();
        fill(0, 255, 0, 100);
        circle(this.edge[i][0], this.edge[i][1], 50);
        pop();

        //** Lock point
        if (mouseIsPressed) {
          this.edgePointLocked = i;
          movingObject = true; //** Flag Pan
        }

        break;
      } else {
        this.edgePointLocked = null;
      }
    }

    //console.log(this.edgePointLocked);
  }

  //** called from sketch
  HighligthEdgePoint() {
    if (this.edgePointLocked == null) return;
    push();
    noStroke();
    fill(0, 255, 0, 100);
    circle(
      this.edge[this.edgePointLocked][0],
      this.edge[this.edgePointLocked][1],
      50
    );
    pop();
  }

  EdgeAdjust(pos) {
    if (this.edgePointLocked == null) return;
    // if (this.logLoad) return;

    //let xGraph = (pos.x - graph.insertPoint.x) / 10;
    //let yGraph = (pos.y - graph.insertPoint.y) / 10;

    let xGraph = pos.x;
    let yGraph = pos.y;

    //** Move in steps
    xGraph = this.Step(xGraph);
    yGraph = this.Step(yGraph);

    this.edge[this.edgePointLocked][0] = xGraph;
    this.edge[this.edgePointLocked][1] = yGraph;
  }

  Step(pos) {
    pos = round(pos / (stepSize * 10)) * (stepSize * 10);
    return pos;
  }
}
