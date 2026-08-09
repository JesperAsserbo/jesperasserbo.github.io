class Graph {
  constructor(insertX, insertY) {
    this.insertPoint = new p5.Vector(insertX, insertY);
    //this.scaleGeo = 5; //** = X => Xcm på papir er 100 mm

    //** Graph axis intervals
    this.intervals = [500, 200, 50, 10, 5];
  }

  DisplayBoltCoor() {
    //** if statements
    if (system.logBoltId == null) return;
    if (button_BoltDelete.state == 1) return; //** If delete active => dont display

    push();
    translate(this.insertPoint.x, this.insertPoint.y);
    let x = boltGroup[system.logBoltId].pos_o_scaled.x;
    let y = boltGroup[system.logBoltId].pos_o_scaled.y;
    line(x, -10, x, y);
    circle(x, 0, 10);
    line(-10, y, x, y);
    circle(0, y, 10);

    textSize(25);

    let xVal = x / scaleGeo;
    let yVal = y / scaleGeo;

    textAlign(RIGHT, CENTER);
    text(nf(yVal, 0, 0), 0 - 65, y);
    textAlign(CENTER, CENTER);
    text(nf(xVal, 0, 0), x, -70);
    pop();
  }

  //** 9 **
  DisplayAxis() {
    //** Name
    push();

    translate(this.insertPoint.x, this.insertPoint.y);
    textSize(40);
    text("Graph", -100, -260);
    pop();
    //** Axis
    this.axisMax_X = this.insertPoint.x;
    this.axisMax_Y = this.insertPoint.y;

    for (let i = 0, length = boltGroup.length; i < length; i++) {
      if (this.axisMax_X < boltGroup[i].pos_o_scaledGraph.x)
        this.axisMax_X = boltGroup[i].pos_o_scaledGraph.x;
      if (this.axisMax_Y < boltGroup[i].pos_o_scaledGraph.y)
        this.axisMax_Y = boltGroup[i].pos_o_scaledGraph.y;
    }

    if (load.pos_Load_scaledGraph.x > this.axisMax_X)
      this.axisMax_X = load.pos_Load_scaledGraph.x;
    if (load.pos_Load_scaledGraph.y> this.axisMax_Y)
      this.axisMax_Y = load.pos_Load_scaledGraph.y;

        if (plate.xMax > this.axisMax_X)
      this.axisMax_X = plate.xMax;
    if (plate.yMax > this.axisMax_Y)
      this.axisMax_Y = plate.yMax;

    push();
    stroke(0);
    strokeWeight(3);

    this.axisMax_X = this.axisMax_X - this.insertPoint.x + 200;
    this.axisMax_Y = this.axisMax_Y - this.insertPoint.y + 200;

    translate(this.insertPoint.x, this.insertPoint.y);
    line(-10, 0, this.axisMax_X, 0);
    line(0, -10, 0, this.axisMax_Y);

    strokeWeight(1);
    fill(0);
    triangle(this.axisMax_X + 30, 0, this.axisMax_X, -8, this.axisMax_X, 8); //** X-axis
    triangle(0, this.axisMax_Y + 30, -8, this.axisMax_Y, 8, this.axisMax_Y); //** Y-axis
    pop();

    //** Mesure on Axis
    push();
    translate(this.insertPoint.x, this.insertPoint.y);
    textSize(25);
    textAlign(CENTER, CENTER);

    let Limit = 100 / scaleGeo;
    //** Find interval
    let index = 0;
    while (
      index < this.intervals.length - 1 &&
      Limit <= this.intervals[index]
    ) {
      index++;
    }

    let i1 = max(0, index); //** Low
    let i2 = index - 1; //** High

    let p1 = this.intervals[i1];
    let p2 = this.intervals[i2];

    // Fade mellem dem
    let alpha2 = constrain(map(Limit, p1, p2, 0, 255), 0, 255);
    let alpha1 = 255 - alpha2;

    this.DrawAxis(this.intervals[i2], alpha2);
    this.DrawAxis(this.intervals[i1], alpha1);

    //** Drav mesure
    let subValue = 1;
    if (Limit > 200) subValue = 50;
    else if (Limit > 100) subValue = 25;
    else if (Limit > 50) subValue = 10;
    else if (Limit > 20) subValue = 5;
    else if (Limit > 10) subValue = 2;

    let count_x = (this.axisMax_X * Limit) / 100 / subValue;
    for (let i = 0; i < count_x; i++) {
      line(i * subValue * scaleGeo, -5, i * subValue * scaleGeo, 5);
    }

    let count_y = (this.axisMax_Y * Limit) / 100 / subValue;
    for (let i = 0; i < count_y; i++) {
      line(-5, i * subValue * scaleGeo, 5, i * subValue * scaleGeo);
    }

    text("x, [mm]", this.axisMax_X + 60, -22);
    text("y, [mm]", -15, this.axisMax_Y + 50);

    pop();
  }

  //** 10 **
  DrawAxis(step, alpha) {
    push();
    textSize(25);
    fill(0, alpha);

    //** X-axis
    let max = int(this.axisMax_X / step / scaleGeo);
    //console.log(max)
    for (let i = 1; i < max - 1; i++) {
      let value = i * step;
      push();
      textAlign(LEFT, CENTER);
      translate(value * scaleGeo, 0);
      rotate(-PI / 2);
      translate(-value * scaleGeo, 0);
      text(value, value * scaleGeo + 15, 2);
      pop();

      line(value * scaleGeo, -8, value * scaleGeo, 5);
    }

    //** Y-axis
    let max_Y = this.axisMax_Y / step / scaleGeo;
    for (let i = 1; i < max_Y - 1; i++) {
      let value = i * step;
      push();
      textAlign(RIGHT, CENTER);
      text(value, -15, value * scaleGeo);
      pop();

      line(-8, value * scaleGeo, 5, value * scaleGeo);
    }
    pop();
  }

  //** 11 **
  ScaleMesureGeo() {
    push();
    let pos = buttonRollor_scaleGeo.pos1;
    translate(pos.x + 200, pos.y + 15);

    ///** MesureLine
    fill(0);
    strokeWeight(1);

    line(-5, 20, 105, 20);
    line(0, 25, 0, 5); //**Left
    line(100, 25, 100, 5); //**Right
    strokeWeight(3);
    line(0, 0, 100, 0);
    pop();
  }
}
