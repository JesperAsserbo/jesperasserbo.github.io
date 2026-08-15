class Formular {
  constructor() {
    this.insertPos_N = new p5.Vector(400, 1550);
    this.insertPos_M = new p5.Vector(400, 1700);
    this.insertPos_Res = new p5.Vector(400, 1850);
    this.insertPos_Tau = new p5.Vector(400, 2000);

    //** Result
    this.insertPos_Formular = new p5.Vector(400, 2300);
    this.insertPos_Sigma_eff = new p5.Vector(400, 2450);
    this.insertPos_Sigma_90 = new p5.Vector(400, 2650);
  }

  Formular() {
    push();

    translate(this.insertPos_Formular.x, this.insertPos_Formular.y);
    //circle(0, 0, 20);

    //** Text
    textSize(30);
    textAlign(LEFT, CENTER);
    text("\u03c3", 0, 50);
    text("=", 100, 53);
    text("\u03c3", 180, 50);
    text("+", 235, 54);
    text("3", 265, 55);
    text("\u00B7", 288, 54.5); //** *
    text("(", 305, 50);
    text("\u03c4", 320, 50);
    text("+", 365, 54);
    text("\u03c4", 400, 50);
    text(")", 455, 50);
    text("\u2264", 520, 50); //** <=
    text("f", 625, 30);
    text("\u03b2", 585, 75); //** beta
    text("\u00B7", 640, 82); //** *
    text("\u03b3", 715 - 50, 75); //** gamma

    //** Text lower
    textSize(25);
    text("eff,s", 20, 70);
    text("w", 610, 90);
    text("u", 635, 37);

    textSize(22);
    text("M2", 680, 95);

    //** Text Upper
    textSize(25);
    text("2", 210, 35);
    text("2", 345, 35);
    text("2", 430, 35);

    //** sqr/Lines
    strokeWeight(2);
    line(140, 50, 150, 50);
    line(150, 50, 160, 90);
    line(160, 90, 170, 10);
    line(170, 10, 480, 10);
    line(575, 50, 720, 50);

    //** sigma perpendicular
    line(200, 70, 200 + 16, 70); //** 16
    line(200 + 8, 70, 200 + 8, 58); //** 12

    line(335, 70, 335 + 16, 70); //** 16
    line(335 + 8, 70, 335 + 8, 58); //** 12

    line(425, 75, 425, 60);
    line(435, 75, 435, 60);
    pop();
  }

  Sigma_N() {
    push();

    translate(this.insertPos_N.x, this.insertPos_N.y);
    //circle(0, 0, 20);

    //** Text
    textSize(30);
    textAlign(LEFT, CENTER);
    text("\u03c3", 0, 50);
    text("=", 65, 53);
    text("N", 140, 30);
    text("2 aL", 110, 80);

    //** Text Lower
    textSize(25);
    text("N", 20, 70);
    text("eff", 175, 90);

    //** sqr/Lines
    strokeWeight(2);
    line(100, 50, 210, 50);

    //************
    //** calc **
    //************

    let adjust_T = -75;
    let adjust_N = -125;

    //** Text TÆLLER
    textSize(30);

    text("=", 265, 53);
    textAlign(RIGHT, CENTER);
    text(calc.N, adjust_T + 480, 30);
    text("\u00B7", adjust_T + 495, 30); //** *
    text("10", adjust_T + 530, 30);
    text("N", adjust_T + 570, 30);

    //** Text NÆVNER
    text("2", adjust_N + 450, 80);
    text("\u00B7", adjust_N + 462, 80); //** *
    text(calc.a, adjust_N + 494, 80);
    text("mm", adjust_N + 550, 80);

    text("\u00B7", adjust_N + 565, 80); //** *
    text(calc.L_eff, adjust_N + 615, 80);
    text("mm", adjust_N + 670, 80);

    //** Text Upper TÆLLER
    textSize(20);
    text("3", adjust_T + 542, 15);

    //** sqr/Lines
    strokeWeight(2);
    line(300, 50, 560, 50);

    //************
    //** Result **
    //************
    textSize(30);

    text(nf(calc.sigma_N, 0, 1), 780, 50 + 2);
    textAlign(LEFT, CENTER);
    text("=", 650, 53);
    text("MPa", 800, 50 + 2);

    pop();
  }
  Sigma_M() {
    push();

    translate(this.insertPos_M.x, this.insertPos_M.y);
    //circle(0, 0, 20);

    //** Text
    textSize(30);
    textAlign(LEFT, CENTER);
    text("\u03c3", 0, 50);
    text("=", 65, 53);
    let factor = 6;
    if (button_Plastic.state == 1) factor = 4;
    text(factor, 140, 30);
    text("M", 170, 30);
    text("2 a(", 110, 80);
    text("L", 165, 80);
    text(")", 220, 80);

    //** Text lower
    textSize(25);
    text("eff", 185, 90);

    //** Text lower
    textSize(25);
    text("M", 20, 70);

    //** Text Upper
    textSize(25);
    text("2", 235, 70);


    //** sqr/Lines
    strokeWeight(2);
    line(100, 50, 250, 50);

    //************
    //** calc **
    //************

    let adjust_T = 0;
    let adjust_N = -20;

    //** Text TÆLLER
    textSize(30);

    text("=", 265, 53);
    textAlign(RIGHT, CENTER);

    text(factor, adjust_T + 330, 30);
    text("\u00B7", adjust_T + 342, 30); //** *

    if (calc.M < 0) {
      adjust_T += 30;
      text("(", adjust_T + 330, 30);
      text(")", adjust_T + 565, 30);
    }
    text(calc.M, adjust_T + 420, 30);
    text("\u00B7", adjust_T + 435, 30); //** *
    text("10", adjust_T + 470, 30);
    text("Nmm", adjust_T + 560, 30);

    //** Text NÆVNER
    text("2", adjust_N + 350, 80);
    text("\u00B7", adjust_N + 362, 80); //** *
    text(calc.a, adjust_N + 394, 80);
    text("mm", adjust_N + 450, 80);

    text("\u00B7", adjust_N + 465, 80); //** *
    text("(", adjust_N + 480, 80);
    text(calc.L_eff, adjust_N + 535, 80);
    text("mm", adjust_N + 590, 80);
    text(")", adjust_N + 605, 80);

    //** Text Upper TÆLLER
    textSize(20);
    text("6", 482, 15);

    // text(factor, adjust_T + 482, 15);

    //** Text Upper NÆVNER
    textSize(25);
    text("2", adjust_N + 620, 70);

    //** sqr/Lines
    strokeWeight(2);
    line(300, 50, 610, 50);

    //************
    //** Result **
    //************
    textSize(30);

    text(nf(calc.sigma_M, 0, 1), 780, 50 + 2);
    textAlign(LEFT, CENTER);
    text("=", 650, 53);
    text("MPa", 800, 50 + 2);

    pop();
  }
  Tau_prallel() {
    push();

    translate(this.insertPos_Tau.x, this.insertPos_Tau.y);
    //circle(0, 0, 20);

    //** Text
    textSize(30);
    textAlign(LEFT, CENTER);
    text("\u03c4", 0, 50);
    text("=", 65, 53);

    let factor_nævner = 4;
    if (button_Plastic.state == 1) factor_nævner = 2;
    text("V", 140, 30);

    text(factor_nævner + " aL", 100, 80);

    //** Text Lower
    textSize(25);
    text("eff", 165, 90);

    //** tau parallel
    strokeWeight(2);
    line(20, 70, 20, 56); //**
    line(30, 70, 30, 56);

    //** sqr/Lines
    strokeWeight(2);
    line(100, 50, 200, 50);

    //************
    //** calc **
    //************

    let adjust_T = -75;
    let adjust_N = -125;

    //** Text TÆLLER
    textSize(30);

    text("=", 265, 53);
    textAlign(RIGHT, CENTER);
    text(calc.V, adjust_T + 480, 30);
    text("\u00B7", adjust_T + 495, 30); //** *
    text("10", adjust_T + 530, 30);
    text("N", adjust_T + 570, 30);

    //** Text NÆVNER

    if (button_Elastic.state == 1) {
      text("\u00B7", adjust_T + 412.5, 30); //** *
      text("3", adjust_N + 255, 80 - 50);
      text("3", adjust_N + 450, 80 - 50);
    }
    text(factor_nævner, adjust_N + 450, 80);
    text("\u00B7", adjust_N + 462, 80); //** *
    text(calc.a, adjust_N + 494, 80);
    text("mm", adjust_N + 550, 80);

    text("\u00B7", adjust_N + 565, 80); //** *
    text(calc.L_eff, adjust_N + 615, 80);
    text("mm", adjust_N + 670, 80);

    //** Text Upper TÆLLER
    textSize(20);
    text("3", adjust_T + 542, 15);

    //** sqr/Lines
    strokeWeight(2);
    line(300, 50, 560, 50);

    //************
    //** Result **
    //************
    textSize(30);

    text(nf(calc.tau_parallel, 0, 1), 780, 50 + 2);
    textAlign(LEFT, CENTER);
    text("=", 650, 53);
    text("MPa", 800, 50 + 2);

    pop();
  }
  Sigma_Res() {
    push();

    translate(this.insertPos_Res.x, this.insertPos_Res.y);
    //circle(0, 0, 20);

    //** Text
    textSize(30);
    textAlign(LEFT, CENTER);
    text("\u03c3", 0, 50);
    text("=", 50, 53);
    text("\u03c4", 90, 50);
    text("=", 140, 53);
    text("1", 210, 30);
    text("2", 215, 80);
    text("( |      |    |       | )", 260, 50);
    text("\u03c3", 290, 50);
    text("+", 350, 54);
    text("\u03c3", 395, 50);

    //** Text lower
    textSize(25);
    text("N", 310, 70);
    text("M", 415, 70);

    //** sigma perpendicular
    strokeWeight(2);
    line(20, 70, 36, 70);
    line(28, 70, 28, 58);

    line(110, 70, 126, 70);
    line(118, 70, 118, 58);

    line(185, 50, 250, 50); //** Division
    line(190, 75, 195, 75);
    line(195, 75, 200, 95);
    line(200, 95, 205, 58);
    line(205, 58, 240, 58);

    //************
    //** Result **
    //************
    textSize(30);

    textAlign(RIGHT, CENTER);
    text(nf(calc.sigma_Res, 0, 1), 780, 50 + 2);
    textAlign(LEFT, CENTER);
    text("=", 650, 53);
    text("MPa", 800, 50 + 2);

    pop();
  }
  Sigma_Eff() {
    push();
    let adjust = 0;
    let adjust_1 = 0;
    let sigma_res = calc.sigma_Res;
    let tau_res = calc.sigma_Res;

    translate(this.insertPos_Sigma_eff.x, this.insertPos_Sigma_eff.y);
    //circle(0, 0, 20);

    if (10 <= sigma_res && sigma_res < 100) adjust += 20;
    if (100 <= sigma_res) adjust += 40;

    //** Text
    textSize(30);
    textAlign(LEFT, CENTER);
    text("\u03c3", 0, 50);
    text("=", 100, 53);
    text(nf(calc.sigma_Res, 0, 1), 190, 55);
    textSize(25);
    text("2", 235 + adjust, 35);
    textSize(30);
    text("+", 260 + adjust, 54);
    text("3", 295 + adjust, 55);
    text("\u00B7", 295 + 23 + adjust, 54.5); //** *
    text("(", 295 + 23 + 17 + adjust, 53);

    text(nf(tau_res, 0, 1), 350 + adjust, 55);
    textSize(25);
    text("2", 395 + 2 * adjust, 35);
    textSize(30);
    text("+", 420 + 2 * adjust, 54);

    if (10 <= calc.tau_parallel && calc.tau_parallel < 100) adjust_1 += 20;
    if (100 <= calc.tau_parallel) adjust_1 += 40;

    text(nf(calc.tau_parallel, 0, 1), 450 + 2 * adjust, 55);
    textSize(25);
    text("2", 495 + 2 * adjust + adjust_1, 35);
    textSize(30);

    text(")", 515 + 2 * adjust + adjust_1, 53);

    //** Text lower
    textSize(25);
    text("eff,s", 20, 70);

    //** sqr/Lines
    strokeWeight(2);
    line(140, 50, 150, 50);
    line(150, 50, 160, 90);
    line(160, 90, 170, 10);
    line(170, 10, 550 + 2 * adjust + adjust_1, 10);

    //************
    //** Result **
    //************
    textSize(30);
    let adjust_3 = 2 * adjust + adjust_1;
    textAlign(RIGHT, CENTER);
    text(nf(calc.sigma_eff, 0, 1), 700 + adjust_3, 50 + 2);
    textAlign(LEFT, CENTER);
    text("=", 575 + adjust_3, 53);
    text("MPa", 720 + adjust_3, 50 + 2);

    let sign = "\u2264";
    if (calc.sigma_eff > calc.sigma_eff_Limit) sign = "\u2265";
    text(sign, 820 + adjust_3, 50); //** <=
    text(nf(calc.sigma_eff_Limit, 0, 1), 870 + adjust_3, 50 + 2);
    text("MPa", 960 + adjust_3, 50 + 2);
    text("\u21D2", 1100 + adjust_3, 50 + 2); //** =>

    let result = "OK";
    if (calc.sigma_eff > calc.sigma_eff_Limit) {
      fill(255, 0, 0, 100);
      noStroke();
      rect(1075 + adjust_3, 25, 250, 50);
      //stroke(0)
      fill(0);
      result = "IKKE OK";
      text("\u21D2", 1100 + adjust_3, 50 + 2); //** =>
    }
    text(result, 1160 + adjust_3, 50 + 2);
    pop();
  }
  Sigma_90() {
    push();
    let adjust = 0;
    let adjust_1 = 0;
    let sigma_res = calc.sigma_Res;
    let tau_res = calc.sigma_Res;

    let sign = "\u2264";

    translate(this.insertPos_Sigma_90.x, this.insertPos_Sigma_90.y);
    //circle(0, 0, 20);

    if (10 <= sigma_res && sigma_res < 100) adjust += 20;
    if (100 <= sigma_res) adjust += 40;

    //** Text
    textSize(30);
    textAlign(LEFT, CENTER);
    text("\u03c3", 0, 50);
    text("=", 100, 50 + 2.5);
    textAlign(RIGHT, CENTER);
    text(nf(calc.sigma_Res, 0, 1), 200, 53);
    textAlign(LEFT, CENTER);
    text("MPa", 210, 53);

    text("0.9", 335, 53);
    text("\u00B7", 385, 53);
    text("f", 425, 30);
    text("\u03b3", 425, 75); //** gamma
    text(sign, 300, 53);

    //** Text lower
    textSize(25);
    text("u", 435, 37);

    textSize(22);
    text("M2", 440, 95);

    textSize(30);
    text("=", 500, 50 + 2.5);
    let limit = (0.9 * calc.fu) / 1.35;

    let result = "OK";
    if (calc.sigma_Res > limit) {
      fill(255, 0, 0, 100);
      noStroke();
      rect(775, 25, 250, 50);
      //stroke(0)
      fill(0);
      result = "IKKE OK";
    }
    text("\u21D2", 800, 50 + 2); //** =>
    textAlign(RIGHT, CENTER);
    text(nf(limit, 0, 1), 620, 53);
    textAlign(LEFT, CENTER);
    text("MPa", 630, 53);
    text(result, 860, 50 + 2);

    //** sigma perpendicular
    stroke(0);
    strokeWeight(2);
    line(20, 70, 36, 70);
    line(28, 70, 28, 58);

    //** divisionLine
    line(410, 50, 480, 50);
    pop();
  }
}
