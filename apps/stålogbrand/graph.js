class Graph {
  constructor(insertPointX, insertPointY) {
    this.posOrigo = new p5.Vector(insertPointX, insertPointY);
    this.fixPointsDiameter = 20;
  }

  DisplayGraphUtilisation() {
    push();
    translate(this.posOrigo.x + 1000, this.posOrigo.y);
    strokeWeight(3);

    //** Background
    fill(245);
    noStroke();
    rect(0, -530, 510, 530);

    stroke(0);
    fill(0);

    //** Axis
    line(-10, 0, 520, 0); //** X-axis
    triangle(540, 0, 520, 5, 520, -5);
    line(0, 10, 0, -550); //** Y-axis
    triangle(0, -570, 5, -550, -5, -550);

    //** Text Axis
    textSize(30);
    noStroke();
    textAlign(LEFT, CENTER);
    //text("Tid ", 800, 0);
    //text("[min]", 800, 35);
    text("Critical Temperature (4.22)", 0, -650);

    text("\u03B8", 370, -647.5);
    textSize(22);
    text("a,cr", 390, -640);

    textSize(30);
    text("[  C]", 0, -615);
    textSize(22);
    text("o", 12, -625);

    textSize(30);
    text("\u03BC", 560, 0);
    textSize(22);
    text("o", 580, 15);

    //** Lines and values
    textSize(26);
    stroke(0);
    strokeWeight(0.5);
    for (let i = 1; i < 11; i++) {
      if (i % 2 == 0) strokeWeight(1);
      else strokeWeight(0.5);
      line(0, -50 * i, 510, -50 * i); //** Horisontal

      textAlign(RIGHT, CENTER);

      if (i % 2 == 0) {
        noStroke();
        text(i * 100, -10, -50 * i);
        stroke(0);
      }
    }

    textSize(26);
    stroke(0);
    strokeWeight(0.5);
    for (let i = 1; i < 11; i++) {
      if (i % 2 == 0) strokeWeight(1);
      else strokeWeight(0.5);
      line(50 * i, 0, 50 * i, -530); //** Vertical

      textAlign(CENTER, CENTER);

      if (i % 2 == 0) {
        noStroke();
        text(nf(round(i * 0.1, 1), 0, 1), 50 * i, 25);
        stroke(0);
      }
    }
    pop();
  }
  DisplayUtilizationOnGraph() {
    //** Only show connection if critTime < 120 min
    if (calc.critTime < 120) {
      //** Temp/utilazation graph
      push();
      strokeWeight(2);
      noFill();
      translate(this.posOrigo.x + 1000, this.posOrigo.y);
      let x1 = calc.utilizationValue * 500;
      let y1 = -calc.critTemp / 2;
      line(x1, 10, x1, y1);
      fill(0);
      circle(x1, 0, 8);
      circle(x1, y1, 8);
      triangle(x1, 0.5 * y1, x1 - 5, 0.5 * y1 + 20, x1 + 5, 0.5 * y1 + 20);

      textSize(26);
      textAlign(CENTER, CENTER);
      text(nf(calc.utilizationValue, 0, 3), x1, 60);

      pop();

      //** Temp/time graph
      push();
      strokeWeight(2);
      noFill();
      translate(this.posOrigo.x, this.posOrigo.y);

      //** Temp/time Graph
      let x = calc.critTimeNotRounded * 6;
      let y = -calc.critTemp / 2;
      line(x, 10, x, y);
      fill(0);
      circle(x, 0, 8);
      circle(x, y, 8);

      triangle(x, 0.5 * y, x - 5, 0.5 * y - 20, x + 5, 0.5 * y - 20);
      textSize(26);
      textAlign(CENTER, CENTER);
      text(calc.critTime + " min.", x, 60);
      pop();

      //** conection between graphs
      push();
      strokeWeight(2);
      noFill();
      translate(this.posOrigo.x, this.posOrigo.y);
      line(x, y, 1000 + calc.utilizationValue * 500, y);

      fill(0);
      if (calc.critTime < 120)
        triangle(840, y, 840 + 20, y + 5, 840 + 20, y - 5);

      textSize(26);
      textAlign(CENTER, CENTER);
      text("\u03B8", 830, y - 60); //** theta
      text(nf(round(calc.critTemp, 1), 0, 1) + "   C", 850, y - 25);

      textSize(22);
      text("a,cr", 860, y - 55);
      text("o", 878, y - 35);
      pop();
    }
  }
  DisplayGraphUtilisationValues() {
    push();
    translate(this.posOrigo.x + 1000, this.posOrigo.y);

    for (let i = 2; i < calc.utilization.length - 1; i++) {
      //** utilization

      let x3 = calc.utilization[i][0] * 5;
      let y3 = -calc.utilization[i][1] / 2;
      let x4 = calc.utilization[i + 1][0] * 5;
      let y4 = -calc.utilization[i + 1][1] / 2;

      strokeWeight(2);
      stroke(0);
      line(x3, y3, x4, y4);
    }
    pop();
  }

  DisplayGraphReductionFactors() {
    push();
    translate(this.posOrigo.x + 1000, this.posOrigo.y);

    //** Ky
    for (let i = 2; i < calc.ky.length - 1; i++) {
      //** utilization
      let x3 = calc.ky[i][0] * 500;
      let y3 = -calc.ky[i][1] / 2;
      let x4 = calc.ky[i + 1][0] * 500;
      let y4 = -calc.ky[i + 1][1] / 2;

      strokeWeight(2);
      stroke(255, 0, 0);
      line(x3, y3, x4, y4);
    }

    //** Text ky
    push();
    textSize(30);
    fill(255, 0, 0);
    noStroke();
    textAlign(LEFT, CENTER);
    text("k", 560, -150);
    textSize(22);
    text("y,\u03B8", 580, -140);
    pop();

    //** Kp
    for (let i = 2; i < calc.kp.length - 1; i++) {
      //** utilization
      let x3 = calc.kp[i][0] * 500;
      let y3 = -calc.kp[i][1] / 2;
      let x4 = calc.kp[i + 1][0] * 500;
      let y4 = -calc.kp[i + 1][1] / 2;

      strokeWeight(2);
      stroke(0, 255, 0);
      line(x3, y3, x4, y4);
    }

    //** Text kp
    push();
    textSize(30);
    fill(0, 255, 0);
    noStroke();
    textAlign(LEFT, CENTER);
    text("k", 560, -50);
    textSize(22);
    text("p,\u03B8", 580, -40);

    pop();

    //** KE
    for (let i = 2; i < calc.kE.length - 1; i++) {
      //** utilization
      let x3 = calc.kE[i][0] * 500;
      let y3 = -calc.kE[i][1] / 2;
      let x4 = calc.kE[i + 1][0] * 500;
      let y4 = -calc.kE[i + 1][1] / 2;

      strokeWeight(2);
      stroke(0, 0, 255);
      line(x3, y3, x4, y4);
    }

    //** Text kE
    push();
    textSize(30);
    fill(0, 0, 255);
    noStroke();
    textAlign(LEFT, CENTER);
    text("k", 560, -100);
    textSize(22);
    text("E,\u03B8", 580, -90);
    pop();

    pop();
  }

  DisplayGraphTemp() {
    push();
    translate(this.posOrigo.x, this.posOrigo.y);
    strokeWeight(3);

    //** Background
    fill(245);
    noStroke();
    rect(0, -530, 730, 530);

    stroke(0);
    fill(0);

    //** Axis
    line(-10, 0, 760, 0); //** X-axis
    triangle(770, 0, 750, 5, 750, -5);
    line(0, 10, 0, -550); //** Y-axis
    triangle(0, -570, 5, -550, -5, -550);

    //** Text Axis
    textSize(30);
    noStroke();
    textAlign(LEFT, CENTER);
    text("Tid ", 800, 0);
    text("[min]", 800, 35);
    text("Temperature", 0, -650);
    text("[  C]", 0, -615);
    textSize(22);
    text("o", 12, -625);

    //** Text signature explanation
    push();
    strokeWeight(3);
    stroke(0, 0, 255);
    line(250, -650, 300, -650);
    stroke(255, 0, 0);
    line(250, -600, 300, -600);

    noStroke();
    textSize(26);
    text("Fire/gas temp. - ISO 834 standard fire", 325, -650);
    text("Steel temp - (4.27)", 325, -600);
    pop();

    //** Lines and values
    textSize(26);
    stroke(0);
    strokeWeight(0.5);
    for (let i = 1; i < 11; i++) {
      if (i % 2 == 0) strokeWeight(1);
      else strokeWeight(0.5);
      line(0, -50 * i, 730, -50 * i); //** Horisontal

      textAlign(RIGHT, CENTER);

      if (i % 2 == 0) {
        noStroke();
        text(i * 100, -10, -50 * i);
        stroke(0);
      }
    }

    stroke(0);
    strokeWeight(0.5);
    for (let i = 1; i < 25; i++) {
      if (i % 3 == 0) strokeWeight(1);
      else strokeWeight(0.5);
      line(30 * i, 0, 30 * i, -530); //** Vertical

      textAlign(CENTER, CENTER);

      if (i % 3 == 0) {
        noStroke();
        text(i * 5, 30 * i, 25);
        stroke(0);
      }
    }
    pop();
  }

  Result() {
    push();
    translate(350, 1900);
    textSize(40);
    noStroke();
    text("Result", 0, -5);

    textSize(30);
    text("Section factor ", 50, 45);
    text("Critical Temperature ", 50, 95);
    text("Protected time ", 50, 145);

    textAlign(RIGHT);
    text(nf(round(ins.sectionFactor, 1), 0, 1), 550, 45);
    text(nf(round(calc.critTemp, 1), 0, 1), 550, 95);
    if (calc.critTime <= 120) {
      text(nf(round(calc.critTime, 0), 0, 0), 550, 145);
    } else {
      text("> 120", 550, 145);
    }

    textAlign(LEFT);
    text("m", 560, 45);
    text(" C", 560, 95);
    text("min. ", 560, 145);

    textSize(22);
    text("-1", 585, 30);
    text("o", 560, 75);

    pop();
  }

  Check() {
    push();
    translate(350, 2200);
    textSize(40);
    noStroke();
    text("Check", 0, -5);

    //** Critical Temp
    textSize(30);
    text("Critical Temperature ", 50, 45);

    textAlign(RIGHT);
    text(nf(round(calc.critTemp, 1), 0, 1), 550, 45);

    textAlign(LEFT);
    text(" C", 560, 45);

    textSize(22);
    text("o", 560, 25);

    //** Reduction Factors
    textSize(30);
    text("\u27F9 ", 50, 145); //** Double Arrow
    text("Reduction factors ", 100, 145);
    text("DS/EN 1993-1-2 Tabel 3.1 ", 650, 145);

    text("k", 365, 95);
    text("k", 365, 145);
    text("k", 365, 195);

    textSize(22);
    text("y,\u03B8", 385, 100);

    text("E,\u03B8", 385, 150);
    text("p,\u03B8", 385, 200);

    textSize(30);
    textAlign(RIGHT);
    text("=", 450, 95);
    text("=", 450, 145);
    text("=", 450, 195);

    let ky = nf(round(calc.YieldTemp(calc.critTemp), 3), 0, 3);
    let kp = nf(round(calc.ProportionalLimitTemp(calc.critTemp), 3), 0, 3);
    let E = nf(round(calc.ElasticLimitTemp(calc.critTemp), 3), 0, 3);

    text(ky, 550, 95);
    text(E, 550, 145);
    text(kp, 550, 195);

    //** Color
    if (button_ReductionFactors.state == 1) {
      fill(255, 0, 0);
      rect(565, 77.5, 15, 15);
      fill(0, 0, 255);
      rect(565, 77.5 + 50, 15, 15);
      fill(0, 255, 0);
      rect(565, 77.5 + 100, 15, 15);
    }

    pop();
  }
}
