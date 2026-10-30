class Calculation {
  constructor() {
    this.pos_Tp = new p5.Vector(0, 0);
    this.pos_Tp_scaled = new p5.Vector(0, 0);
    this.pos_Tp_scaledGraph = new p5.Vector(0, 0);

    this.pos_CR = new p5.Vector(0, 0);
    this.pos_CR_scaled = new p5.Vector(0, 0);
    this.pos_CR_scaledGraph = new p5.Vector(0, 0);

    this.Ip = 0;

    //** Calc with respect to 0,0
    this.pos_Tp_calc = new p5.Vector(0, 0);
    this.pos_CR_calc = new p5.Vector(0, 0);
  }

  Display_Fbrd() {
    //** Calc
    //let abk1 = min(distEdgeBolt.edge_abk1, distEdgeBolt.bolt_abk1);
    let abk1_min = distEdgeBolt.ab_min * distEdgeBolt.k1_min;
    let t = plate.plate_t;
    let d = boltGroup[0].d;
    let fu = plate.fu;
    let gm2 = 1.35;

    let result = 0;
    let capacity = (boltGroup[0].d * plate.plate_t * plate.fu) / gm2;
    if (boltGroup.length > 1)
      result = min(distEdgeBolt.ab_min * distEdgeBolt.k1_min, 2.5);
    else result = min(distEdgeBolt.ab_min * distEdgeBolt.k1_min, 1.5);
    this.Fbrd = (result * capacity) / 1000;

    //let factor = 2.5;
    //if (boltGroup.length < 2) factor = 1.5;

    //this.factor_min = min(factor, abk1_min);
    // this.Fbrd = (this.factor_min * d * t * fu) / gm2 / 1000;

    //** text Formular
    push();
    translate(2400, 1125);
    textSize(30);
    textAlign(LEFT, CENTER);
    text("F", 0, 25 + 2.5);
    text("=", 100, 25 + 2.5);;

    textAlign(LEFT, CENTER);
    textSize(22);
    text("b,rd", 20, 35 + 2.5);

    //** 1 **
    //** abk1
    textSize(30);
    textAlign(CENTER, CENTER);
    textAlign(LEFT, CENTER);
    text("  \u03B1   k  ", 130, 0);
    if (boltGroup.length > 1) text(nf(2.5, 0, 2), 150, 50);
    else text(nf(1.5, 0, 2), 150, 50);
    text("         d t", 210, 25);
    text("f", 340, 10);
    strokeWeight(2);
    line(330, 25, 390, 25);
    text("\u03B3", 340, 40);

    //** LINES
    line(130, -15, 130, 65);
    line(130, -15, 140, -15);
    line(130, 65, 140, 65);

    line(230, -15, 230, 65);
    line(220, -15, 230, -15);
    line(220, 65, 230, 65);

    textSize(22);
    text("b", 167.5, 15 + 2.5);
    text("1", 208, 15 + 2.5);
    text("min.", 240, 60);
    text("u", 355, 15);
    text("M2", 355, 55);

    //** 2 **
    //** LINES
    //** Translate
    translate(0, 100);
    line(130, -15, 130, 65);
    line(130, -15, 140, -15);
    line(130, 65, 140, 65);

    line(290, -15, 290, 65);
    line(280, -15, 290, -15);
    line(280, 65, 290, 65);

    textSize(30);
    textAlign(LEFT, CENTER);
    text("=", 100, 25 + 2.5);

    //** Text numbers
    text(nf(round(distEdgeBolt.ab_min, 2), 0, 2), 140, 0 + 2.5);
    text("\u22C5", 205, 0 + 2.5);
    text(nf(round(distEdgeBolt.k1_min, 2), 0, 2), 220, 0 + 2.5);
    if (boltGroup.length > 1) text(nf(2.5, 0, 2), 180, 50);
    else text(nf(1.5, 0, 2), 180, 50);
    text("\u22C5", 300, 25 + 2.5);
    text(boltGroup[0].d + " mm", 310, 25 + 2.5);
    text("\u22C5", 410, 25 + 2.5);
    text(plate.plate_t + " mm", 425, 25 + 2.5);
    strokeWeight(2);
    line(535, 25, 660, 25);
    text(plate.fu + " MPa", 535, 5 + 2.5);
    text("1.35", 565, 45 + 2.5);

    textSize(22);
    text("min.", 300, 60);

    //** 3 **
    //** Text numbers
    textSize(30);
    text("=", 100, 125 + 2.5);

    text(nf(round(capacity / 1000, 1), 0, 1) + " kN", 220, 125 + 2.5);

    text(nf(round(result, 2), 0, 2), 130, 125 + 2.5);
    text("\u22C5", 200, 125 + 2.5);

    //** Text Result
    textAlign(LEFT, CENTER);
    text("=", 100, 200 + 2.5);
    //textAlign(RIGHT, CENTER);
    text(nf(round(this.Fbrd, 1), 0, 1) + " kN / bolt", 130, 200 + 2.5);

    pop();
  }

  Display_Fvrd() {
    //** Calc
    let av = boltGroup[0].av;
    //let As = boltGroup[0].As;
    // let A = boltGroup[0].A;
    let A = boltGroup[0].A_shearPlane;
    let fub = boltGroup[0].fub;
    let gm2 = 1.35;
    this.Fvrd = (av * A * fub) / gm2 / 1000;

    //** text
    push();
    translate(2400, 825);
    textSize(30);
    textAlign(LEFT, CENTER);
    text("F", 0, 25 + 2.5);
    text("=", 100, 25 + 2.5);

    textAlign(LEFT, CENTER);
    textSize(22);
    text("v,rd", 20, 35 + 2.5);

    //** abk1
    textSize(30);
    textAlign(CENTER, CENTER);
    //text("\u21D2", 1000, 50);
    textAlign(LEFT, CENTER);
    text("\u03B1", 145, 25 + 2.5);
    text("A", 185, 25 + 2.5);
    text("f", 240, 10);
    strokeWeight(2);
    line(230, 25, 290, 25);
    text("\u03B3", 240, 40);

    textSize(22);
    if (boltGroup[0].shearPlane != 2) text("s", 208, 35 + 2.5);
    text("v", 165, 35 + 2.5);
    text("ub", 255, 15);
    text("M2", 255, 55);

    //** Text numbers
    textSize(30);
    text("=", 100, 125 + 2.5);
    text(nf(round(boltGroup[0].av, 3), 0, 3), 130, 125 + 2.5);
    text("\u22C5", 220, 125 + 2.5);
    text(nf(boltGroup[0].A_shearPlane, 0, 1) + " mm", 240, 125 + 2.5);

    strokeWeight(2);
    line(405, 125, 530, 125);
    text(boltGroup[0].fub + " MPa", 405, 105 + 2.5);
    text("1.35", 435, 145 + 2.5);

    textSize(22);
    text("2", 375, 110 + 2.5);

    //** Text Result
    textSize(30);
    textAlign(LEFT, CENTER);
    text("=", 100, 200 + 2.5);
    //textAlign(RIGHT, CENTER);
    text(nf(round(this.Fvrd, 1), 0, 1) + " kN / shear plane", 130, 200 + 2.5);

    pop();
  }
  Tp() {
    let x_Tp = 0;
    let y_Tp = 0;

    for (let bolt in boltGroup) {
      x_Tp += boltGroup[bolt].pos_o_calc.x;
      y_Tp += boltGroup[bolt].pos_o_calc.y;
    }
    this.pos_Tp_calc.x = x_Tp / boltGroup.length;
    this.pos_Tp_calc.y = y_Tp / boltGroup.length;

    for (let bolt in boltGroup) {
      boltGroup[bolt].r_Tp_Vector = p5.Vector.sub(
        boltGroup[bolt].pos_o_calc,
        this.pos_Tp_calc
      );
      boltGroup[bolt].r_Tp = boltGroup[bolt].r_Tp_Vector.mag();
      //console.log(boltGroup[bolt].r_Tp)
    }
  }
  CenterRotation() {
    let x_CR = 0;
    let y_CR = 0;

    //** Placering i forhold til Tp
    x_CR = (-load.Py_Tp * this.Ip) / (boltGroup.length * load.Mz_Tp);
    y_CR = (load.Px_Tp * this.Ip) / (boltGroup.length * load.Mz_Tp);

    this.pos_CR_calc.x = x_CR;
    this.pos_CR_calc.y = y_CR;

    //console.log(x_CR + " " + y_CR)

    push();

    pop();
  }
  IpBoltGroup() {
    this.Ip = 0;
    for (let bolt in boltGroup) {
      this.Ip += boltGroup[bolt].r2_Tp;
    }
  }
  Load_Tp() {
    let y_diff = this.pos_Tp_calc.y - load.pos_Load_calc.y;
    let x_diff = load.pos_Load_calc.x - this.pos_Tp_calc.x;
    load.Mz_Tp = load.Mz + load.Px * y_diff + load.Py * x_diff;
    load.Px_Tp = load.Px;
    load.Py_Tp = load.Py;
  }
  ForceBoltOne() {
    if (boltGroup.length > 1) return;

    //** Scalars

    boltGroup[0].F_Px = (load.Px_Tp / 1) * scaleForce;
    boltGroup[0].F_Py = (load.Py_Tp / 1) * scaleForce;

    //** Force value - Not scaled

    boltGroup[0].F_Res = p5.Vector.div(boltGroup[0].F_Res_Vector, scaleForce);
  }
  ForcesBolts() {
    if (boltGroup.length < 2) return;
    if (this.Ip == 0) return;
    let a = (load.Mz_Tp / this.Ip) * scaleForce;
    let bolts = boltGroup.length;

    //** Scalars
    for (let bolt in boltGroup) {
      boltGroup[bolt].F_Mz = a * boltGroup[bolt].r_Tp;
      boltGroup[bolt].F_Px = (load.Px_Tp / bolts) * scaleForce;
      boltGroup[bolt].F_Py = (load.Py_Tp / bolts) * scaleForce;
    }

    //** Force value - Not scaled
    for (let bolt in boltGroup) {
      boltGroup[bolt].F_Res = p5.Vector.div(
        boltGroup[bolt].F_Res_Vector,
        scaleForce
      );
    }
  }
  Display_CR() {
    if (boltGroup.length < 2) return;
    this.insertPoint = graph.insertPoint;

    this.pos_CR_scaled.x = (this.pos_CR_calc.x + this.pos_Tp_calc.x) * scaleGeo;
    this.pos_CR_scaled.y = (this.pos_CR_calc.y + this.pos_Tp_calc.y) * scaleGeo;
    //this.pos_Tp_scaled = p5.Vector.mult(this.pos_Tp_calc, 10);

    this.pos_CR_scaledGraph = p5.Vector.add(
      this.pos_CR_scaled,
      this.insertPoint
    );

    //this.pos_Tp_calc

    push();
    fill(0, 0, 255, 100);
    //let xTp = this.pos_Tp_scaledGraph.x;
    //let yTp = this.pos_Tp_scaledGraph.y;

    let xCR = this.pos_CR_scaledGraph.x;
    let yCR = this.pos_CR_scaledGraph.y;

    let xCRvalue = calc.pos_Tp_calc.x + calc.pos_CR_calc.x;
    let yCRvalue = calc.pos_Tp_calc.y + calc.pos_CR_calc.y;

    //console.log(this.pos_Tp_scaledGraph)
    circle(xCR, yCR, 15);
    line(xCR - 20, yCR, xCR + 20, yCR);
    line(xCR, yCR - 20, xCR, yCR + 20);
    textAlign(LEFT, CENTER);
    textSize(20);
    stroke(0);
    text("CR", xCR + 15, yCR + 20);
    /*
    text(
      "[ " +
        nf(round(xCRvalue,1), 0, 1) +
        " ; " +
        nf(round(yCRvalue,1), 0, 1) +
        " ]",
      xCR + 50,
      yCR + 20
    );
    */

    stroke(0, 0, 255, 200);
    for (let bolt in boltGroup) {
      line(
        this.pos_CR_scaledGraph.x,
        this.pos_CR_scaledGraph.y,
        boltGroup[bolt].pos_o_scaledGraph.x,
        boltGroup[bolt].pos_o_scaledGraph.y
      );
    }

    pop();
  }
  Display_Tp() {
    if (boltGroup.length < 2) return;
    this.insertPoint = graph.insertPoint;

    this.pos_Tp_scaled.x = this.pos_Tp_calc.x * scaleGeo;
    this.pos_Tp_scaled.y = this.pos_Tp_calc.y * scaleGeo;
    //this.pos_Tp_scaled = p5.Vector.mult(this.pos_Tp_calc, 10);

    this.pos_Tp_scaledGraph = p5.Vector.add(
      this.pos_Tp_scaled,
      this.insertPoint
    );

    //this.pos_Tp_calc

    push();
    fill(255, 0, 0, 100);
    //let xTp = this.pos_Tp_scaledGraph.x;
    //let yTp = this.pos_Tp_scaledGraph.y;

    let xTp = this.pos_Tp_scaledGraph.x;
    let yTp = this.pos_Tp_scaledGraph.y;

    //console.log(this.pos_Tp_scaledGraph)
    circle(xTp, yTp, 15);
    line(xTp - 20, yTp, xTp + 20, yTp);
    line(xTp, yTp - 20, xTp, yTp + 20);
    textAlign(LEFT, CENTER);
    textSize(20);
    stroke(0);
    text("CM", xTp + 15, yTp + 20);
    /*
    text(
      "[ " +
        nf(this.pos_Tp_calc.x, 0, 1) +
        " ; " +
        nf(this.pos_Tp_calc.y, 0, 1) +
        " ]",
      xTp + 50,
      yTp + 20
    );
    */
    pop();
  }
}
