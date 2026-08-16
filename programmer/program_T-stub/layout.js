class Layout {
  constructor(insertPointX, insertPointY) {
    this.insertPoint = new p5.Vector(insertPointX, insertPointY);
    this.insertPointSketch = new p5.Vector(1000, 1000);
  }

  Display() {
    //** Bolt **********************************
    push();
    translate(this.insertPoint.x, this.insertPoint.y);
    textSize(50);

    text("Input Data", 0, 0);

    textAlign(LEFT, CENTER);
    textSize(35);
    text("Bolt:", 50, 75 + 2.5);
    text("Diameter", 250, 75 + 2.5);
    text("Quality", 250, 125 + 2.5);
    //text("Antal", 250, 175 + 2.5);

    textSize(30);
    text("A", 650, 75 + 2.5);
    text("=", 700, 75 + 2.5);
    text("mm", 875, 75 + 2.5);

    text("f", 650, 125 + 2.5);
    text("=", 700, 125 + 2.5);
    text("MPa", 875, 125 + 2.5);

    textAlign(RIGHT, CENTER);
    text(nf(buttonChoiceLibBoltSize.GetValue(1), 0, 1), 850, 75 + 2.5);
    text(nf(buttonChoiceLibBoltStrength.GetValue(1), 0, 1), 850, 125 + 2.5);

    textSize(20);
    text("s", 685, 75 + 15);
    text("2", 940, 75 - 10);
    text("ub", 685, 125 + 15);
    pop();

    //** Plade **********************************
    let plade_y = 225;
    push();
    translate(this.insertPoint.x, this.insertPoint.y + plade_y);
    textAlign(LEFT, CENTER);
    textSize(35);
    text("Plate:", 50, 2.5);
    text("Quality", 250, 2.5);

    textSize(30);
    text("f", 650, 2.5);
    text("=", 700, 2.5);
    text("MPa", 875, 2.5);

    textAlign(RIGHT, CENTER);
    text(nf(calc.fyk, 0, 1), 850, 2.5);

    textSize(20);
    text("yk", 685, 15);
    pop();

    //** Geometri **********************************
    let geometri_y = 400;
    push();
    translate(this.insertPoint.x, this.insertPoint.y + geometri_y);
    textSize(50);
    text("Geometry", 0, 0);
    textAlign(LEFT, CENTER);
    textSize(35);
    text("Plate:", 50, 75 + 2.5);
    text("Thickness", 250, 75 + 2.5);
    text("L", 250, 125 + 2.5);

    text("b", 250, 175 + 2.5);
    text("a", 250, 225 + 2.5);
    text("a", 250, 275 + 2.5);

    textSize(30);

    if (calc.a2 >= 1.25 * buttonRollor_a1.value) {
      text("a      1.25 a ", 650, 275 + 2.5);
      text("\u2264", 690, 275 + 2.5);

      textSize(20);
      text("1", 802, 275 + 10 + 2.5);
      text("2", 670, 275 + 10 + 2.5);
    }

    textSize(30);
    textAlign(RIGHT, CENTER);
    text(nf(calc.a2, 0, 1), 550, 275 + 2.5);
    textAlign(LEFT, CENTER);
    text("mm", 560, 275 + 2.5);

    textSize(25);
    textAlign(LEFT, CENTER);
    text("f", 275, 175 + 20);
    text("1", 275, 225 + 20);
    text("2", 275, 275 + 20);
    pop();

    //** Beregning  BOLT **********************************
    let beregningBolt_y = 800;
    push();
    translate(this.insertPoint.x, this.insertPoint.y + beregningBolt_y);
    textSize(50);
    text("Calculation", 0, 0);

    textAlign(LEFT, CENTER);
    textSize(40);
    text("Bolt:", 50, 75 + 2.5);

    textSize(30);
    text("F", 250, 75 + 2.5);
    text("=", 400, 75 + 2.5);
    text("kN", 575, 75 + 2.5);

    text("F", 250, 125 + 2.5);
    text("=", 400, 125 + 2.5);
    text("kN", 575, 125 + 2.5);
    textAlign(RIGHT, CENTER);
    text(nf(calc.FtRd_single / 1000, 0, 1), 550, 75 + 2.5);
    text(nf(calc.FtRd_sum / 1000, 0, 1), 550, 125 + 2.5);

    textSize(20);
    textAlign(LEFT, CENTER);
    text("t,Rd - ", 270, 75 + 15);
    text(buttonChoiceLibBoltSize.GetValue(0), 325, 75 + 15);

    text("t,Rd - ", 270, 125 + 15);
    text(buttonChoiceLibBoltCount.GetValue(0) + "x", 325, 125 + 15);
    text(buttonChoiceLibBoltSize.GetValue(0), 350, 125 + 15);

    pop();

    //** Beregning  PLADE **********************************
    let beregningPlade_y = 950;
    push();
    translate(this.insertPoint.x, this.insertPoint.y + beregningPlade_y);
    textAlign(LEFT, CENTER);
    textSize(35);
    text("Plate:", 50, 75 + 2.5);

    textSize(30);
    text("m", 250, 75 + 2.5);
    text("=", 400, 75 + 2.5);
    text("kNm/m", 575, 75 + 2.5);

    text("M", 250, 125 + 2.5);
    text("=", 400, 125 + 2.5);
    text("kNm", 575, 125 + 2.5);

    textAlign(RIGHT, CENTER);
    text(nf(calc.mplud / 1000, 0, 1), 550, 75 + 2.5);
    text(nf(calc.Mplud / 1000, 0, 1), 550, 125 + 2.5);

    textSize(20);
    textAlign(LEFT, CENTER);
    text("pl,ud", 280, 75 + 15);
    text("pl,ud", 280, 125 + 15);
    pop();
  }

  /*
  DisplaySketch() {
    push();
    this.scale = 2;
    this.a1 = buttonRollor_a1.ReadValue();
    this.bf = buttonRollor_bf.ReadValue();
    translate(this.insertPointSketch.x, this.insertPointSketch.y);
    line(0, 0, this.a1, 0);
    line(this.a1, 0, this.a1 + this.a2, 0);
    pop();
  }
  */
}
