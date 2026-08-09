class Layout {
  constructor(insertPointX, insertPointY) {
    this.insertPoint_Bolt = new p5.Vector(insertPointX, insertPointY);
    this.insertPoint_Plate = new p5.Vector(insertPointX, insertPointY);
    //this.insertPointSketch = new p5.Vector(1000, 1000);
  }

  DisplayBoltLayout() {
    //** Bolt **********************************
    push();
    translate(this.insertPoint_Bolt.x + 200, this.insertPoint_Bolt.y + 200);
    //circle(0, 0, 10);

    textSize(40);
    text("Bolt", 0, 42.5);

    textSize(30);
    textAlign(LEFT, CENTER);
    text("Bolt Add / Delete", 160, 475+2.5);
    //text("Display", 450, 885);
    if(boltGroup.length > 1) text("Limit Bolt", 110, 225+2.5);
    text("Limit Edge", 110, 375+2.5);

    //** Additional text ButtonRollor
    //push();
    textSize(30);
    textAlign(CENTER, CENTER);
    text("\u21D2", 475, 75 + 2.5);
    textAlign(LEFT, CENTER);
    text("d   =", 525, 75 + 2.5);
    text(boltGroup[0].do + " mm", 600, 80);
    textSize(22);
    text("o", 545, 90);
    //pop();

    textAlign(LEFT, CENTER);
    textSize(30);
    text("Diameter (d)", 25, 75 + 2.5);
    text("Quality", 25, 125 + 2.5);

    //** After buttonChoice
    text("\u21D2", 2440, -125 + 2.5);
    text("\u03B1", 2500, -125 + 2.5);
    text("=", 2540, -125 + 2.5);
    textAlign(RIGHT, CENTER);
    text(nf(boltGroup[0].av, 0, 3), 2650, -125 + 2.5);

    textAlign(LEFT, CENTER);
    textSize(20);
    text("v", 2522, -115 + 2.5);

    
    textSize(30);
    let deltaX = 100;
    text("A", 650 + deltaX, 75 + 2.5);
    text("A", 950 + deltaX, 75 + 2.5);
    text("=", 700 + deltaX, 75 + 2.5);
    text("=", 980 + deltaX, 75 + 2.5);
    text("mm", 835 + deltaX, 75 + 2.5);
    text("mm", 1105 + deltaX, 75 + 2.5);

    text("f", 650 + deltaX, 125 + 2.5);
    text("=", 700 + deltaX, 125 + 2.5);
    text("MPa", 835 + deltaX, 125 + 2.5);

    textAlign(RIGHT, CENTER);
    text(nf(buttonChoiceLibBoltSize.GetValue(1), 0, 1), 820 + deltaX, 75 + 2.5);
    text(nf(buttonChoiceLibBoltSize.GetValue(2), 0, 1), 1090 + deltaX, 75 + 2.5);
    text(
      nf(buttonChoiceLibBoltStrength.GetValue(1), 0, 1),
      820 + deltaX,
      125 + 2.5
    );

    textSize(20);
    text("s", 685 + deltaX, 75 + 15);
    text("2", 900 + deltaX, 75 - 10);
    text("2", 1170 + deltaX, 75 - 10);
    text("ub", 685 + deltaX, 125 + 15);
    pop();

    /*

 
    //** Geometri **********************************
    let geometri_y = 400;
    push();
    translate(this.insertPoint.x, this.insertPoint.y + geometri_y);
    textSize(50);
    text("Geometri", 0, 0);
    textAlign(LEFT, CENTER);
    textSize(40);
    text("Plade:", 50, 75 + 2.5);
    text("Tykkelse", 250, 75 + 2.5);
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
    text("Beregning", 0, 0);

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
    textSize(40);
    text("Plade:", 50, 75 + 2.5);

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
    */
  }

  DisplayPlateLayout() {
    //** Plade **********************************

    push();
    translate(this.insertPoint_Plate.x, this.insertPoint_Plate.y + 125);
    textAlign(LEFT, CENTER);
    textSize(40);
    text("Plate", 200, 2.5 - 100);
    textSize(30);
    text("Thickness (t)", 225, 2.5-50);
    text("Quality", 225, 2.5);

    textSize(30);
    text("f", 650, 2.5);
    text("=", 700, 2.5);
    text("MPa", 875, 2.5);

    textAlign(RIGHT, CENTER);
    text(nf(plate.fu, 0, 1), 850, 2.5);

    textSize(20);
    text("u", 675, 15);
    pop();
  }
}
