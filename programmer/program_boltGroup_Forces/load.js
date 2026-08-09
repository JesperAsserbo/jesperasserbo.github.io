class Load {
  constructor(posX, posY) {
    this.insertPoint = graph.insertPoint;
    this.ip_text = new p5.Vector(1000, 500); //** insertPointText
    this.pos_Load = new p5.Vector(posX, posY);
    this.pos_Load_scaled = p5.Vector.add(this.insertPoint, this.pos_Load);
    this.pos_Load_scaledGraph = p5.Vector.add(
      this.pos_Load_scaled,
      this.insertPoint
    );

    this.pos_Load_calc = new p5.Vector(posX, posY);

    this.Mz = 0; //** Nmm
    this.Px = 0; //** N
    this.Py = 10000; //** N

    this.Mz_Tp = 0;
    this.Px_Tp = 0;
    this.Py_Tp = 0;
  }

  Update() {
    this.insertPoint = graph.insertPoint;
    this.pos_Load_scaled = p5.Vector.mult(this.pos_Load, 10);
    this.pos_Load_scaledGraph = p5.Vector.add(
      this.pos_Load_scaled,
      this.insertPoint
    );

    //** Set Load in bolt_CG
    if (boltGroup.length < 2) {
      this.pos_Load.x = boltGroup[0].pos_o.x 
      this.pos_Load.y = boltGroup[0].pos_o.y 
    }

    this.pos_Load_calc.x = this.pos_Load_scaled.x / scaleGeo;
    this.pos_Load_calc.y = this.pos_Load_scaled.y / scaleGeo;
  }

  Display() {
    if (boltGroup.length < 2) return;
    
    push();
    strokeWeight(1);
    fill(0, 0, 255, 100);
    // circle(this.pos_Load_scaledGraph.x, this.pos_Load_scaledGraph.y, 10);

    let xLp = this.pos_Load_scaledGraph.x;
    let yLp = this.pos_Load_scaledGraph.y;
    circle(xLp, yLp, 15);
    line(xLp - 20, yLp, xLp + 20, yLp);
    line(xLp, yLp - 20, xLp, yLp + 20);

    textAlign(LEFT, CENTER);
    textSize(20);
    stroke(0);
    text("Lp", xLp + 15, yLp + 30);
    text(
      "[ " +
        nf(this.pos_Load_calc.x, 0, 0) +
        " ; " +
        nf(this.pos_Load_calc.y, 0, 0) +
        " ]",
      xLp + 50,
      yLp + 30
    );
    pop();
  }

  DisplayLpCoor() {
    //** Display on axis only if logged (mouseIsPressed)
    if (system.logLoad == false) return;
    push();
    let x = this.pos_Load_scaled.x;
    let y = this.pos_Load_scaled.y;
    translate(graph.insertPoint.x, graph.insertPoint.y);
    line(x, -10, x, 30);
    circle(x, 0, 10);
    line(-10, y, 80, y);
    circle(0, y, 10);

    textSize(25);

    //let xVal = x / 10;
    //let yVal = y / 10;

    let xVal = (x / 10) * (10 / scaleGeo);
    let yVal = (y / 10) * (10 / scaleGeo);

    textAlign(RIGHT, CENTER);
    text(nf(yVal, 0, 0), 0 - 65, y);
    textAlign(CENTER, CENTER);
    text(nf(xVal, 0, 0), x, -70);

    pop();
  }

  DisplayDistToTp() {
    if (boltGroup.length < 2) return;

    push();
    let Tp = calc.pos_Tp_scaledGraph;
    let Lp = this.pos_Load_scaledGraph;

    //** Mesureline x-direction
    let xMesure = calc.pos_Tp_calc.x - this.pos_Load_calc.x;
    let textX_y = graph.insertPoint.y + 30;
    let textX_x = Lp.x + 0.5 * xMesure * scaleGeo;

    let adjust_x = 10;
    if (Tp.x > Lp.x) adjust_x = -10;

    circle(Tp.x, textX_y + 20, 10);
    circle(Lp.x, textX_y + 20, 10);
    line(Tp.x, textX_y + 10, Tp.x, Tp.y - 30); //** Vertical
    line(Tp.x - adjust_x, textX_y + 20, Lp.x + adjust_x, textX_y + 20); //** Horisontal
    if (this.Py == 0) line(Lp.x, textX_y + 10, Lp.x, Lp.y - 30); //** Vertical
    if (this.Py > 0) line(Lp.x, textX_y + 10, Lp.x, Lp.y - 170); //** Vertical
    textAlign(CENTER, CENTER);
    textSize(25);
    text(abs(nf(xMesure, 0, 1)), textX_x, textX_y);

    //** Mesureline y-direction
    let yMesure = calc.pos_Tp_calc.y - this.pos_Load_calc.y;
    let textY_y = Lp.y + 0.5 * yMesure * scaleGeo;
    let textY_x = graph.insertPoint.x + 100;

    let adjust_y = 10;
    if (Tp.y > Lp.y) adjust_y = -10;

    circle(textY_x, Tp.y, 10);
    circle(textY_x, Lp.y, 10);
    line(textY_x - 10, Tp.y, Tp.x - 30, Tp.y); //** Horisontal
    line(textY_x, Tp.y - adjust_y, textY_x, Lp.y + adjust_y); //** Vertical
    line(textY_x - 10, Lp.y, Lp.x - 30, Lp.y); //** Horisontal

    textAlign(RIGHT, CENTER);
    textSize(25);
    text(abs(nf(yMesure, 0, 1)), textY_x - 20, textY_y);
    pop();
  }

  LoadText() {
    push();
    textAlign(LEFT, CENTER);

    //** ButtonRoller subText
    textSize(20);
    text("x,Lp", buttonRollor_Px.pos1.x + 20, buttonRollor_Px.pos1.y - 5);
    text("y,Lp", buttonRollor_Py.pos1.x + 20, buttonRollor_Py.pos1.y - 5);
    if(boltGroup.length>1) text("z,Lp", buttonRollor_Mz.pos1.x + 30, buttonRollor_Mz.pos1.y - 5);

    //** Text TyngdePunkt /Tp)
    textSize(30);
    translate(this.ip_text.x, this.ip_text.y);
    text("P", 0, 30);
    text("=", 85, 30);
    text("kN", 210, 30);

    text("P", 0, 80);
    text("=", 85, 80);
    text("kN", 210, 80);

    text("M", 0, 130);
    text("=", 85, 130);
    text("kNm", 210, 130);

    textSize(20);
    text("x,Tp", 20, 40);
    text("y,Tp", 20, 90);
    text("z,Tp", 30, 140);

    textAlign(RIGHT, CENTER);
    textSize(30);
    text(nf(load.Px_Tp / 1e3, 0, 2), 195, 30);
    text(nf(load.Py_Tp / 1e3, 0, 2), 195, 80);
    text(nf(load.Mz_Tp / 1e6, 0, 2), 195, 130);

    pop();
  }

  LoadSymbolInLp() {
    push();
    translate(this.pos_Load_scaledGraph.x, this.pos_Load_scaledGraph.y);

    //** Py - blue
    fill(0, 0, 255);
    stroke(0, 0, 255);
    strokeWeight(5);
    if (load.Py != 0) line(0, -120, 0, -20);
    if (load.Py > 0) triangle(0, -20, -8, -40, 8, -40);
    if (load.Py < 0) triangle(0, -120, -8, -100, 8, -100);

    //** Px - red
    fill(255, 0, 0);
    stroke(255, 0, 0);
    strokeWeight(5);
    if (load.Px != 0) line(120, 0, 20, 0);
    if (load.Px > 0) triangle(120, 0, 100, -8, 100, 8);
    if (load.Px < 0) triangle(20, 0, 40, -8, 40, 8);

    //** Mz - green
    noFill();
    stroke(0, 255, 0);
    strokeWeight(5);
    //arc(x, y, w, h, start, stop, [mode], [detail])
    if (load.Mz != 0) arc(0, 0, 150, 150, (-7 * PI) / 16, -PI / 16);
    fill(0, 255, 0);
    if (load.Mz > 0) {
      push();
      translate(74, -14);
      rotate(-PI / 9);
      triangle(0, 0, -8 + 0, -20, 8 + 0, -20);
      pop();
    }
    if (load.Mz < 0) {
      push();
      translate(14, -74);
      rotate(PI / 2 + PI / 9);
      triangle(0, 0, -8 + 0, -20, 8 + 0, -20);
      pop();
    }
    pop();
  }

  LoadTextInLp() {
    push();
    translate(this.pos_Load_scaledGraph.x, this.pos_Load_scaledGraph.y);

    textSize(25);
    textAlign(CENTER, CENTER);
    if (this.Py > 0) text(nf(this.Py / 1e3, 0, 1) + " kN", 0, -140);
    textAlign(LEFT, CENTER);
    if (this.Px > 0) text(nf(this.Px / 1e3, 0, 1) + " kN", 140, 0);

    if (this.Mz > 0) text(nf(this.Mz / 1e6, 0, 1) + " kNm", 60, -60);
    pop();
  }
}
