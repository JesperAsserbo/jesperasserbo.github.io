//let buttonRollor_dg;
//let buttonRollor_c_min;
//let buttonRollor_c_min1;

class Geometry {
  constructor() {
    this.insertPoint = new p5.Vector(600, 1350); //** TopLeft of section

    this.b = 400;
    this.h = 600;
    this.c1_min = 0; //** minimum cover to rebar
    this.c_min = 30; //** minimum cover to stirrup
    this.c_dev = 5;
    this.c_nom = this.c_min + this.c_dev;
    this.a = 40; //** minimum dist between rebar

    this.dg = 32;
    this.stirrup_ø = 10;
    this.stirrup_s = 150;
    this.stirrup_n = 1;
    this.cotTheta = 1;
    this.theta;
    this.rebar_s; //** Calculated in this.DisplayRebar();

    this.b_min = 0;
    this.h_min = 0;
    this.a_min = 0;

    this.adjustPoint = new p5.Vector(
      this.insertPoint.x + this.b,
      this.insertPoint.y + this.h
    ); //** BottomRight of section

    this.stepSize = 5;

    //** setUp for reinforcement
    let rebar_1 = new Rebar(2, 20, 48); //** Rebar(number,size/diameter,h_ef)
    let rebar_2 = new Rebar(4, 20, 552); //** Rebar(number,size/diameter,h_ef)

    this.rebar = [];

    this.rebar.push(rebar_1);
    this.rebar.push(rebar_2);

    this.rebarOverlapped;
    this.rebarNumberLogged;

    //** Display
    this.scaleStress = 1 / 5;
    this.factorForce = 1; //** calculated in this.DisplayForcesConcrete()

    //** Text in input.DisplayGeometryInddata()
    this.buttonRollor_dg = new ButtonRollor(
      (pos1x = 0), //** textPro BR
      (pos1y = 0), //** textPro BR
      (pos2x = 0), //** textMid BR
      (pos3x = 0), //** ciffers BL
      (pos4x = 0), //** unit BR
      (numberPrefix = 2),
      (numberSufix = 0),
      (buttonWidth = 20),
      (buttonHeight = 40),
      (letterSize = 35),
      (textPro = ""),
      (textMid = ""),
      (textPre = ""),
      (startValue = 32),
      8, //** minValue
      64 //** maxValue
    );

    this.buttonRollor_c_min = new ButtonRollor(
      (pos1x = 0), //** textPro BR
      (pos1y = 0), //** textPro BR
      (pos2x = 0), //** textMid BR
      (pos3x = 0), //** ciffers BL
      (pos4x = 0), //** unit BR
      (numberPrefix = 2),
      (numberSufix = 0),
      (buttonWidth = 20),
      (buttonHeight = 40),
      (letterSize = 35),
      (textPro = ""),
      (textMid = ""),
      (textPre = ""),
      (startValue = 30),
      10, //** minValue
      200 //** maxValue
    );

    this.buttonRollor_c_dev = new ButtonRollor(
      (pos1x = 0), //** textPro BR
      (pos1y = 100), //** textPro BR
      (pos2x = 0), //** textMid BR
      (pos3x = 0), //** ciffers BL
      (pos4x = 0), //** unit BR
      (numberPrefix = 2),
      (numberSufix = 0), 
      (buttonWidth = 20),
      (buttonHeight = 40),
      (letterSize = 35),
      (textPro = ""),
      (textMid = ""),
      (textPre = ""),
      (startValue = 5),
      0, //** minValue
      20 //** maxValue
    );

    this.buttonRollor_stirrup_ø = new ButtonRollor(
      (pos1x = 0), //** textPro BR
      (pos1y = 0), //** textPro BR
      (pos2x = 0), //** textMid BR
      (pos3x = 0), //** ciffers BL
      (pos4x = 0), //** unit BR
      (numberPrefix = 2),
      (numberSufix = 0),
      (buttonWidth = 20),
      (buttonHeight = 40),
      (letterSize = 35),
      (textPro = ""),
      (textMid = ""),
      (textPre = ""),
      (startValue = 8),
      6, //** minValue
      16 //** maxValue
    );

    this.buttonRollor_stirrup_s = new ButtonRollor(
      (pos1x = 0), //** textPro BR
      (pos1y = 0), //** textPro BR
      (pos2x = 0), //** textMid BR
      (pos3x = 0), //** ciffers BL
      (pos4x = 0), //** unit BR
      (numberPrefix = 3),
      (numberSufix = 0),
      (buttonWidth = 20),
      (buttonHeight = 40),
      (letterSize = 35),
      (textPro = ""),
      (textMid = ""),
      (textPre = ""),
      (startValue = 150),
      50, //** minValue
      1000 //** maxValue
    );

    this.buttonRollor_stirrup_n = new ButtonRollor(
      (pos1x = 0), //** textPro BR
      (pos1y = 0), //** textPro BR
      (pos2x = 0), //** textMid BR
      (pos3x = 0), //** ciffers BL
      (pos4x = 0), //** unit BR
      (numberPrefix = 1),
      (numberSufix = 0),
      (buttonWidth = 20),
      (buttonHeight = 40),
      (letterSize = 35),
      (textPro = ""),
      (textMid = ""),
      (textPre = ""),
      (startValue = 1),
      1, //** minValue
      2 //** maxValue
    );

    this.buttonRollor_cotTheta = new ButtonRollor(
      (pos1x = 0), //** textPro BR
      (pos1y = 0), //** textPro BR
      (pos2x = 0), //** textMid BR
      (pos3x = 0), //** ciffers BL
      (pos4x = 0), //** unit BR
      (numberPrefix = 1),
      (numberSufix = 1),
      (buttonWidth = 20),
      (buttonHeight = 40),
      (letterSize = 35),
      (textPro = ""),
      (textMid = ""),
      (textPre = ""),
      (startValue = 2.5),
      1, //** minValue
      2.5 //** maxValue
    );
  }

  Update() {
    //** ButtonRollor

    //** ButtonRollor //** Need to update so that can be moved (proporty of proporty)

    this.buttonRollor_c_min.Update();
    this.buttonRollor_c_min.pos3.x =
      inputData.insertPoint.x + inputData.displaceX2 + 275;
    this.buttonRollor_c_min.pos3.y =
      inputData.insertPoint.y + inputData.displaceY2 + 57.5;

    this.buttonRollor_c_dev.Update();
    this.buttonRollor_c_dev.pos3.x =
      inputData.insertPoint.x + inputData.displaceX2 + 275;
    this.buttonRollor_c_dev.pos3.y =
      inputData.insertPoint.y + inputData.displaceY2 + 107.5;

    this.buttonRollor_dg.Update();
    this.buttonRollor_dg.pos3.x =
      inputData.insertPoint.x + inputData.displaceX2 + 775;
    this.buttonRollor_dg.pos3.y =
      inputData.insertPoint.y + inputData.displaceY2 + 57.5;

    this.buttonRollor_stirrup_ø.Update();
    this.buttonRollor_stirrup_ø.pos3.x = 480;
    this.buttonRollor_stirrup_ø.pos3.y = this.insertPoint.y + 407.5 + this.h;

    this.buttonRollor_stirrup_s.Update();
    this.buttonRollor_stirrup_s.pos3.x = 480;
    this.buttonRollor_stirrup_s.pos3.y = this.insertPoint.y + 457.5 + this.h;

    this.buttonRollor_stirrup_n.Update();
    this.buttonRollor_stirrup_n.pos3.x = 480;
    this.buttonRollor_stirrup_n.pos3.y = this.insertPoint.y + 507.5 + this.h;

    this.buttonRollor_cotTheta.Update();
    this.buttonRollor_cotTheta.pos3.x = 750;
    this.buttonRollor_cotTheta.pos3.y = this.insertPoint.y + 257.5 + this.h;

    
    this.buttonRollor_dg.DisplayButonRollor(mousePosWorld);
    this.buttonRollor_c_min.DisplayButonRollor(mousePosWorld);
    
    this.buttonRollor_c_dev.DisplayButonRollor(mousePosWorld);

    this.buttonRollor_stirrup_ø.DisplayButonRollor(mousePosWorld);
    
    this.buttonRollor_stirrup_s.DisplayButonRollor(mousePosWorld);
     
    this.buttonRollor_stirrup_n.DisplayButonRollor(mousePosWorld);
   
    this.buttonRollor_cotTheta.DisplayButonRollor(mousePosWorld);
    

    this.dg = this.buttonRollor_dg.ReadValue();
    this.c_min = this.buttonRollor_c_min.ReadValue();
    this.c_dev = this.buttonRollor_c_dev.ReadValue();
    this.c_nom = this.c_min + this.c_dev;
    this.stirrup_ø = this.buttonRollor_stirrup_ø.ReadValue();
    this.stirrup_s = this.buttonRollor_stirrup_s.ReadValue();
    this.stirrup_n = this.buttonRollor_stirrup_n.ReadValue();
    this.cotTheta = this.buttonRollor_cotTheta.ReadValue();

    //** Display stirrup text
    push();
    textSize(35);
    textAlign(LEFT, BASELINE);
    //text("ø", this.insertPoint.x + 0.5 * this.b - 100, this.insertPoint.y - 50);
    //text("mm", this.insertPoint.x + 0.5 * this.b + 65, this.insertPoint.y - 50);

    text(
      "Stirrup:",
      this.insertPoint.x - 250,
      this.insertPoint.y + this.h + 350
    );
    text("ø", this.insertPoint.x - 240, this.insertPoint.y + this.h + 400);
    text("s", this.insertPoint.x - 240, this.insertPoint.y + this.h + 450);
    text("n", this.insertPoint.x - 240, this.insertPoint.y + this.h + 500);
    text("mm", this.insertPoint.x - 110, this.insertPoint.y + this.h + 400);
    text("mm", this.insertPoint.x - 110, this.insertPoint.y + this.h + 450);
    text("cot ", this.insertPoint.x, this.insertPoint.y + this.h + 250);

    let symbol = String.fromCharCode(0x03b8); //U+03B8
    text(symbol, this.insertPoint.x + 55, this.insertPoint.y + this.h + 250);

    textSize(25);
    text("t", this.insertPoint.x - 215, this.insertPoint.y + this.h + 410);

    pop();

    //** Set min. values
    //** Stirrup min s
    if (this.stirrup_s >= calculation.s_min_res) {
      let value = calculation.s_min_res;
      this.buttonRollor_stirrup_s.SetValue(value);
    }

    /*
        textSize(35);
    //** a_min
    text("a", 1050, 0);
    text("=", 1150, 0);
    text("mm", 1300, 0);

    //** c1_min
    text("c1", 1050, 100);
    text("=", 1150, 100);
    text("mm", 1300, 100);

    textSize(25);
    text("min.", 1080, 5);
    text("min.", 1090, 105);
    */

    //** a_min
    push();
    let ø = this.rebar[this.rebar.length - 1].size;
    this.a_min = max(ø, this.dg + this.c_dev, 20);

    textSize(35);
    textAlign(LEFT, BASELINE);
    text("a ", 2400, 600);
    text("> ", 2450, 604);

    text("ø ", 2550, 550);
    text("d   + 5 mm", 2550, 600);
    text("20 mm ", 2550, 650);

    text("= ", 2750, 550);
    text("= ", 2750, 600);
    text("= ", 2750, 650);

    text("mm ", 2870, 550);
    text("mm ", 2870, 600);
    text("mm ", 2870, 650);

    textSize(25);
    text("g ", 2575, 605);
    // console.log(this.a_min)

    textSize(35);
    textAlign(RIGHT, BASELINE);
    text(ø, 2850, 550);
    let a_Limit_2 = this.dg + 5;
    text(a_Limit_2, 2850, 600);
    let a_Limit_3 = 20;
    text(a_Limit_3, 2850, 650);

    stroke(0);
    strokeWeight(2);
    line(2520, 530, 2520, 660);
    pop();

    //** c1_min
    push();
    let ø1 = this.rebar[this.rebar.length - 1].size;
    let c1 = ø1 + this.c_dev;
    if (this.dg <= 32) {
      textSize(35);
      symbol = String.fromCharCode(0x2264); //U+2264
      c1 = ø1 + this.c_dev + 5;
      text("if d   " + symbol + " 32 mm", 3100, 800);
      text("ø + c      + 5 mm", 2550, 800);
    } else {
      textSize(35);
      c1 = ø1 + this.c_dev + 10;
      text("if d   > 32 mm", 3100, 800);
      text("ø + c      + 10 mm", 2550, 800);
    }
 
    this.c1_min = max(this.c_nom + this.stirrup_ø, c1);

    textSize(35);
    textAlign(LEFT, BASELINE);
    text("c ", 2400, 800);
    text("> ", 2450, 804);

    text("ø + c", 2550, 750);

    text("c       + ø ", 2550, 850);

    //text("if d   > 32 mm", 3100, 800);

    text("= ", 2850, 750);
    text("= ", 2850, 800);
    text("= ", 2850, 850);

    text("mm ", 2970, 750);
    text("mm ", 2970, 800);
    text("mm ", 2970, 850);

    textSize(25);
    text("1 ", 2420, 805);
    text("g ", 3152, 805);
    text("dev ", 2638, 755);
    text("dev ", 2638, 805);
    text("nom ", 2575, 855);
    text("t ", 2690, 860);
    // console.log(this.a_min)

    textSize(35);
    textAlign(RIGHT, BASELINE);

    let c_Limit_1 = ø + this.c_dev;
    text(c_Limit_1, 2950, 750);

    let c_Limit_2 = c1;
    text(c_Limit_2, 2950, 800);

    let c_Limit_3 = this.stirrup_ø + this.c_nom;
    text(c_Limit_3, 2950, 850);

    stroke(0);
    strokeWeight(2);
    line(2520, 730, 2520, 860);

    pop();

    //** text in front in class Input.DisplayGeometryInddata()
    push();
    textSize(35);
    textAlign(RIGHT);
    text(this.c_nom, 1530, 650);
    //text(this.c1_min, 3030, 650);
    pop();

    this.b_min = 0;
    this.h_min = 0;

    //** Set b_min
    for (let i = 0; i < this.rebar.length; i++) {
      let n = this.rebar[i].number;
      let ø = this.rebar[i].size;
      let b_min_test =
        2 * this.stirrup_ø + 2 * this.c_nom + (n - 1) * this.a_min + n * ø;
      if (b_min_test > this.b_min) this.b_min = b_min_test;
    }
    //console.log("Geometry line 309 - b_min: " + this.b_min)

    //** Set h_min
    let ø_sum = 0;
    let n = this.rebar.length;

    for (let i = 0; i < this.rebar.length; i++) {
      let ø = this.rebar[i].size;
      ø_sum += ø;
    }
    this.h_min =
      2 * this.stirrup_ø + 2 * this.c1_min + (n - 1) * this.a_min + ø_sum;

    push();
    textSize(35);
    textAlign(LEFT, BASELINE);
    //** b
    text("b", 500, 1200);
    text("=", 600, 1200);
    text("mm", 770, 1200);

    //** h
    text("h", 500, 1250);
    text("=", 600, 1250);
    text("mm", 770, 1250);
    textAlign(RIGHT, BASELINE);
    text(nf(this.b_min, 0, 0), 750, 1200);
    text(nf(this.h_min, 0, 0), 750, 1250);

    textSize(25);
    textAlign(LEFT, BASELINE);
    text("min", 530, 1205);
    text("min", 530, 1255);
    pop();
    //console.log("Geometry line 322 - h_min: " + this.h_min)

    //** Rebar adjust
    //** [starRebar]
    //** Adjust to concrete
    if (this.rebar[0].h_ef < this.rebar[0].limitUp) {
      //console.log("*" + this.rebar[0].limitUp);
      this.rebar[0].h_ef = this.rebar[0].limitUp;
    }

    //** Adust to concreteBottom
    if (this.rebar.length == 1) {
      if (this.rebar[0].h_ef > this.h - this.rebar[0].limitDown) {
        this.rebar[0].h_ef = this.h - this.rebar[0].limitDown;
      }
    }

    //** Adjust next rebar (if limit to concrete not ok)
    if (this.rebar.length > 1) {
      if (this.rebar[0].h_ef > this.rebar[1].h_ef - this.rebar[1].limitUp) {
        //console.log("*" + this.rebar[0].limitUp);
        this.rebar[1].h_ef = this.rebar[0].h_ef + this.rebar[1].limitUp;
      }

      //** [inBetweenRebar]

      /*
    //** Next to bottom
    
         if(this.rebar[this.rebar.length - 2].h_ef >this.rebar[this.rebar.length - 1].h_ef - this.rebar[this.rebar.length - 1].limitUp ) {
        this.rebar[this.rebar.length - 2].h_ef = this.rebar[this.rebar.length - 1].h_ef - this.rebar[this.rebar.length - 1].limitUp
      }*/

      for (let i = this.rebar.length - 2; i > 0; i--) {
        if (
          this.rebar[i].h_ef >
          this.rebar[i + 1].h_ef - this.rebar[i + 1].limitUp
        ) {
          this.rebar[i].h_ef =
            this.rebar[i + 1].h_ef - this.rebar[i + 1].limitUp;
        }
      }

      for (let i = 1; i < this.rebar.length - 1; i++) {
        if (
          this.rebar[i].h_ef <
          this.rebar[i - 1].h_ef + this.rebar[i - 1].limitDown
        ) {
          this.rebar[i].h_ef =
            this.rebar[i - 1].h_ef + this.rebar[i - 1].limitDown;
        }
      }

      //** [lastRebar]
      let lastRebar = this.rebar.length - 1;
      //** Adjust to upper rebar
      if (
        this.rebar[lastRebar].h_ef <
        this.rebar[lastRebar - 1].h_ef + this.rebar[lastRebar - 1].limitDown
      ) {
        this.rebar[lastRebar].h_ef =
          this.rebar[lastRebar - 1].h_ef + this.rebar[lastRebar - 1].limitDown;
      }

      /*
      //** Adjust concrete to last rebar
      if (
        this.h >
        this.rebar[lastRebar].h_ef + this.c1_min + 0.5 * this.rebar[lastRebar].size
      ) {
        // console.log("line368")
        this.h =
          this.rebar[lastRebar].h_ef +
          this.c1_min +
          0.5 * this.rebar[lastRebar].size;
      }*/

      //** Adjust to concrete
      if (this.rebar[lastRebar].h_ef > this.h - this.rebar[lastRebar].limitDown)
        this.rebar[lastRebar].h_ef = this.h - this.rebar[lastRebar].limitDown;
    }

    //** Adjust ButtonRollors
    for (let i = 0; i < this.rebar.length; i++) {
      this.rebar[i].buttonRollor_stk.pos3.y = this.rebar[i].h_ef + 20;
      this.rebar[i].buttonRollor_stk.Update();

      this.rebar[i].buttonRollor_ø.pos3.y = this.rebar[i].h_ef + 20;
      this.rebar[i].buttonRollor_ø.Update();
    }
  }

  RebarDelete(pos) {
    if (button_RebarDelete.state == -1) return;
    if (this.rebar.length < 2) return;

    if (!mouseIsPressed && oneTime && this.OverlapPointRebar(pos)) {
      reCalc = true;
      this.rebar.splice(this.rebarOverlapped, 1);
    }
  }

  RebarAdd(pos) {
    if (button_RebarAdd.state == -1) return;

    if (this.insertPoint.y < pos.y && pos.y < this.insertPoint.y + this.h) {
      push();
      pos.y = this.Step(pos.y);

      noFill();
      line(
        this.insertPoint.x - 230,
        pos.y,
        this.insertPoint.x + this.b + 60,
        pos.y
      );
      circle(this.insertPoint.x - 250, pos.y, 40);

      //** Display h_ef
      fill(100, 100, 100, 100);
      strokeWeight(1);
      translate(this.insertPoint.x + this.b + 50, pos.y);
      triangle(0, 0, -10, -10, 10, -10);
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(25);
      text(this.Step(pos.y - this.insertPoint.y), 0, -25);
      pop();

      if (!mouseIsPressed && oneTime) {
        reCalc = true;
        this.rebar.push(
          new Rebar(2, 16, this.Step(pos.y - this.insertPoint.y))
        );
        this.BubbleSort(this.rebar);
      }
    }
  }

  Display() {
    push();

    strokeWeight(3);
    fill(150, 150, 150, 100);
    translate(this.insertPoint.x, this.insertPoint.y);
    rect(0, 0, this.b, this.h);

    //** Stirrup
    noFill();
    let x = this.c_nom + this.stirrup_ø / 2;
    let y = this.c_nom + this.stirrup_ø / 2;
    let b = this.b - (2 * this.c_nom + this.stirrup_ø);
    let h = this.h - (2 * this.c_nom + this.stirrup_ø);

    //** set stirrup_n=1 if rebar.number <=3
    if (this.stirrup_n == 2 && this.rebar[this.rebar.length - 1].number <= 3) {
      this.stirrup_n = this.buttonRollor_stirrup_n.SetValue(1);
    }

    //** Stirrup Outer
    stroke(100);
    strokeWeight(this.stirrup_ø - 2);
    rect(x, y, b, h, 10);

    //** Stirrup Inner
    //** Stirrup n=2 & rebar.number >=4
    if (this.stirrup_n == 2 && this.rebar[this.rebar.length - 1].number >= 4) {
      let x2 = this.c_nom + this.stirrup_ø / 2 + this.rebar_s;
      if (this.rebar[this.rebar.length - 1].number >= 7) {
        x2 = this.c_nom + this.stirrup_ø / 2 + 2 * this.rebar_s;
      }
      if (this.rebar[this.rebar.length - 1].number >= 10) {
        x2 = this.c_nom + this.stirrup_ø / 2 + 3 * this.rebar_s;
      }

      let y2 = this.c_nom + this.stirrup_ø / 2;
      let b2 = this.b - (2 * this.c_nom + this.stirrup_ø + 2 * this.rebar_s);
      if (this.rebar[this.rebar.length - 1].number >= 7) {
        b2 = this.b - (2 * this.c_nom + this.stirrup_ø + 4 * this.rebar_s);
      }
      if (this.rebar[this.rebar.length - 1].number >= 10) {
        b2 = this.b - (2 * this.c_nom + this.stirrup_ø + 6 * this.rebar_s);
      }

      let h2 = this.h - (2 * this.c_nom + this.stirrup_ø) + 4;
      strokeWeight(this.stirrup_ø - 2);

      //** Stirrup Inner
      stroke(75);
      rect(x2, y2 - 2, b2, h2, 10);
    }

    stroke(0);
    strokeWeight(1);
    //circle(0, 0, 20);
    circle(this.b, this.h, 20);

    //** Mesure line bottom
    fill(0);
    line(0, this.h + 10, 0, this.h + 60);
    line(this.b, this.h + 10, this.b, this.h + 60);
    line(-10, this.h + 50, this.b + 10, this.h + 50);
    noStroke();
    circle(0, this.h + 50, 4);
    circle(this.b, this.h + 50, 4);

    textAlign(CENTER, CENTER);
    textSize(25);
    text(nf(this.b, 0, 0), 0.5 * this.b, this.h + 75);

    //** Text bottom
    push();
    stroke(0);
    fill(100, 100, 100, 100);
    strokeWeight(1);
    translate(this.b + 125, this.h);
    line(-105, 0, 10, 0);
    triangle(0, 0, -10, -10, 10, -10);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(25);
    noStroke();
    text(this.h, 0, -25);
    pop();

    //** Text top
    push();
    stroke(0);
    fill(100, 100, 100, 100);
    strokeWeight(1);
    translate(this.b + 125, 0);
    line(-105, 0, 10, 0);
    triangle(0, 0, -10, -10, 10, -10);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(25);
    noStroke();
    text("0", 0, -25);
    pop();

    //** Text a
    push();
    stroke(0);
    strokeWeight(1);
    let x1 =
      this.c_nom + this.stirrup_ø + this.rebar[this.rebar.length - 1].size;
    let x2 = x1 + this.rebar_s - this.rebar[this.rebar.length - 1].size;
    let ya = this.rebar[this.rebar.length - 1].h_ef;
    //translate(this.b + 125, 50);
    line(x1 - 2, ya - 20, x2 + 2, ya - 20);
    line(x1, ya - 10, x1, ya - 22);
    line(x2, ya - 10, x2, ya - 22);
    let a = x2 - x1;

    fill(0);
    textAlign(LEFT, CENTER);
    textSize(25);
    noStroke();
    text("a (" + nf(a, 0, 1) + "mm)", x1 + 0.5 * (x2 - x1), ya - 32);
    pop();

    //** Text c
    push();
    stroke(0);
    strokeWeight(1);
    let y1 = this.h - this.c_nom;
    let y2 = this.h;

    //translate(this.b + 125, 50);
    line(-15, y1 - 2, -15, y2 + 2);
    line(-17, y1, this.c_nom, y1);
    line(-17, y2, -5, y2);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(25);
    noStroke();
    text("c ", -25, this.h - 0.5 * (y2 - y1));
    pop();

    pop(); //** Include translate at top
  }

  DisplayRebar() {
    push();
    //** Display Rebar
    strokeWeight(1);
    //noStroke();
    fill(0);
    translate(this.insertPoint.x, this.insertPoint.y);
    for (let i = 0; i < this.rebar.length; i++) {
      this.rebar_s =
        (this.b - 2 * this.c_nom - 2 * this.stirrup_ø + -this.rebar[i].size) /
        (this.rebar[i].number - 1);
      let rebar_start = this.c_nom + this.stirrup_ø + 0.5 * this.rebar[i].size;
      for (let j = 0; j < this.rebar[i].number; j++) {
        circle(
          rebar_start + j * this.rebar_s,
          this.rebar[i].h_ef,
          this.rebar[i].size
        );
      }

      //** Display h_ef on section
      push();
      fill(100, 100, 100, 100);
      strokeWeight(1);
      translate(this.b + 50, this.rebar[i].h_ef);
      triangle(0, 0, -10, -10, 10, -10);
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(25);
      text(this.rebar[i].h_ef, 0, -25);
      pop();

      /*
      //** Display h_ef on side
      push();
      fill(100, 100, 100, 100);
      strokeWeight(1);
      translate(1050, 300 + this.h + this.rebar[i].h_ef);
      triangle(0, 0, -10, -10, 10, -10);
      line(-35, 0, 10, 0);
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(25);
      text(this.rebar[i].h_ef, 0, -25);
      pop();
      */
    }

    //** Display buttonRolor
    for (let i = 0; i < this.rebar.length; i++) {
      /*
      console.log(
        "geometry line 144: " + i + " Point: " + this.rebar[i].insertPoint
      );*/
      push();
      strokeWeight(1);

      this.rebar[i].DisplayButtonRollor(this.insertPoint);

      noFill();
      strokeWeight(1);
      let x = this.rebar[i].insertPoint.x;
      let y = this.rebar[i].h_ef;
      circle(x - 250, y, 40);

      line(x - 230, y, x - 200, y);
      line(x - 30, y, x + this.b + 60, y);
      pop();
    }

    //** Display Adjust Circel
    pop();
  }

  DisplaySide() {
    push();
    translate(this.insertPoint.x, this.insertPoint.y + this.h + 300);

    //** Concrete
    strokeWeight(3);
    fill(150, 150, 150, 100);

    noStroke();
    rect(0, 0, 1000, this.h);

    stroke(0);
    line(0, 0, 1000, 0);
    line(0, this.h, 1000, this.h);

    //** Rebar
    for (let i = 0; i < this.rebar.length; i++) {
      noStroke();
      fill(50);
      rect(
        0,
        this.rebar[i].h_ef - 0.5 * this.rebar[i].size,
        1000,
        this.rebar[i].size
      );
    }

    //** Rebar Stirrups
    let s = this.stirrup_s;
    let adjust = 0;
    if (this.stirrup_n == 2) adjust = this.stirrup_ø / 2 + 2;

    stroke(100);
    strokeWeight(this.stirrup_ø);
    let y = this.c_nom + 0.5 * this.stirrup_ø;
    let x_start = (500 / s - int(500 / s)) * s;

    for (let i = 0; i <= int(1000 / s); i++) {
      if (x_start + i * s <= 1000) {
        stroke(100);
        line(
          x_start - adjust + i * s,
          y,
          x_start - adjust + i * s,
          geometry.h - y
        );
        if (this.stirrup_n == 2) stroke(75);
        line(
          x_start + adjust + i * s,
          y,
          x_start + adjust + i * s,
          geometry.h - y
        );
      }
    }

    //** Rebar Stirrups line to stirrup
    strokeWeight(1);
    stroke(0);
    noFill();
    line(-25, 50, -25, 215);
    line(-25, 125, (500 / s - int(500 / s)) * s - 0.5 * 30, 125);
    circle((500 / s - int(500 / s)) * s, 125, 30);

    //** cotTheta yieldLine
    this.theta = (atan(1 / this.cotTheta) * 180) / PI;
    let e_C_res = calculationOneTime.yo + calculationOneTime.e_C_res;
    let e_T_res = calculationOneTime.yo + calculationOneTime.e_T_res;

    //let e2 = 0.5*this.h-1*500*tan(this.theta*PI/180);
    //let yTop = max(0.5*this.h-1*500*tan(this.theta*PI/180));
    //let yBottom = min(0.5*this.h+1*500*tan(this.theta*PI/180));

    let hiCotTheta = calculationOneTime.hi * this.cotTheta;

    //** nulpunkt ved x=500;
    let pTop = new p5.Vector(0.5 * hiCotTheta, e_C_res); //** >0
    let pBottom = new p5.Vector(-0.5 * hiCotTheta, e_T_res); //** <0

    if (pTop.x > 500) {
      //** yieldLine
      pTop.x = 500;
      pTop.y = e_C_res + 0.5 * calculationOneTime.hi - 500 / this.cotTheta; //** >0
    }

    if (pBottom.x < -500) {
      //** yieldLine
      pBottom.x = -500;
      pBottom.y = e_T_res - 0.5 * calculationOneTime.hi + 500 / this.cotTheta;
    }
    //let pBottom = new p5.Vector(-0.5 * hiCotTheta, e_T_res); //** <0

    //** this.hi ************************* START
    push();
    //** vertical
    line(1100, e_C_res - 5, 1100, e_T_res + 5); //** hi

    //** horisontal
    line(500 + pTop.x, e_C_res, 1110, e_C_res);
    line(500 + pBottom.x, e_T_res, 1110, e_T_res);

    //** text hi
    fill(0);
    noStroke();
    textSize(25);
    textAlign(LEFT, CENTER);
    text(
      "h  = " + nf(calculation.hi, 0, 1) + " mm",
      1110 + 15,
      e_C_res + 0.5 * (e_T_res - e_C_res)
    );
    text("i", 1110 + 30, e_C_res + 0.5 * (e_T_res - e_C_res) + 8);
    pop();
    //** this.hi ************************* END

    //** this.d ************************* START
    push();
    strokeWeight(1);
    stroke(0);

    //** vertical
    line(1350, -5, 1350, e_T_res + 5); //** d

    //** horisontal
    line(1100, 0, 1360, 0);
    line(1125, e_T_res, 1360, e_T_res);

    //** text d
    fill(0);
    noStroke();
    textSize(25);
    textAlign(LEFT, CENTER);

    text("d  = " + nf(calculation.d, 0, 1) + " mm", 1360 + 15, 0.5 * e_T_res);

    pop();
    //** this.d ************************* END

    //** Yield line
    stroke(255);
    strokeWeight(5);
    //line(500 + pTop.x, pTop.y, 1000, pTop.y); //** Top Line
    //line(0, pBottom.y, 500 + pBottom.x, pBottom.y); //** Bottom Line
    line(500 + pBottom.x, pBottom.y, 500 + pTop.x, pTop.y); //** Yield Line

    //** Mesure Line hiCotTheta
    //console.log("geometry Line 794 - mesure line hiCotTheta");
    stroke(0);
    strokeWeight(2);

    line(
      500 + pBottom.x - 10,
      geometry.h + 50,
      500 + pTop.x + 10,
      geometry.h + 50
    ); //** Horisontal

    if (pTop.x < 500) {
      line(500 + pBottom.x, pBottom.y, 500 + pBottom.x, geometry.h + 60); //** Vertical
      line(500 + pTop.x, pTop.y, 500 + pTop.x, geometry.h + 60); //** Vertical
    } else {
      fill(0);
      triangle(
        0,
        geometry.h + 50,
        25,
        geometry.h + 50 + 10,
        25,
        geometry.h + 50 - 10
      );
      triangle(
        1000,
        geometry.h + 50,
        1000 - 25,
        geometry.h + 50 + 10,
        1000 - 25,
        geometry.h + 50 - 10
      );
      //** Horisontal
    }

    circle(500 + pBottom.x, geometry.h + 50, 4);
    circle(500 + pTop.x, geometry.h + 50, 4);

    circle(500 + pBottom.x, pBottom.y, 4);
    circle(500 + pTop.x, pTop.y, 4);

    //** cotTheta on figure
    let symbol = String.fromCharCode(0x03b8); //U+03B8
    let y_cot = 0.5 * (pBottom.y + pTop.y);
    line(500 - 20, y_cot, 570, y_cot);
    noFill();
    arc(500, y_cot, 125, 125, -radians(this.theta + 5), radians(5)); //** arc(x, y, w, h, start, stop)

    fill(0);
    noStroke();
    textSize(35);
    textAlign(CENTER, CENTER);
    text(symbol, 590, y_cot + 5);

    //** Mesure Line Text
    adjust = 0;
    if (hiCotTheta > 1000) adjust = 10;

    text("h cot    = " + nf(hiCotTheta, 0, 0) + " mm", 500, geometry.h + 85);
    text(symbol, 500 - 50 - adjust, geometry.h + 85);

    textSize(25);

    text("i", 500 - 118 - adjust, geometry.h + 95);

    //** Formular Stirrups s min **************** START
    //** s_min
    textSize(35);
    textAlign(LEFT, CENTER);

    let p = new p5.Vector(0, 250 + this.h);
    text("Stirrup s   <   min. ", p.x, p.y + 25);

    //** min_1
    text("0.75 x d", p.x + 350, p.y - 50);
    text("=", p.x + 650, p.y - 47);
    text("mm", p.x + 800, p.y - 50);

    //** min_2
    text("15.9 x ", p.x + 350, p.y + 50);
    text("A", p.x + 475, p.y + 25);
    text("f", p.x + 560, p.y + 25);

    text("b", p.x + 475, p.y + 75);
    text("f", p.x + 560, p.y + 80);
    text("=", p.x + 650, p.y + 53);
    text("mm", p.x + 800, p.y + 50);

    textSize(42);
    symbol = String.fromCharCode(0x221a); //U+221A
    text(symbol, p.x + 535, p.y + 85);

    textSize(25);
    text("sw", p.x + 505, p.y + 35);
    text("w", p.x + 500, p.y + 85);
    text("yk", p.x + 575, p.y + 35);
    text("ck", p.x + 575, p.y + 90);

    textSize(35);
    textAlign(RIGHT, CENTER);
    if (calculation.s_min_1) text(calculation.s_min_1, p.x + 775, p.y - 50);
    if (calculation.s_min_2) text(calculation.s_min_2, p.x + 775, p.y + 50);

    //** Lines
    stroke(0);
    line(p.x + 325, p.y - 75, p.x + 325, p.y + 125); //** Vertical
    line(p.x + 465, p.y + 50, p.x + 610, p.y + 50);
    line(p.x + 557, p.y + 59, p.x + 602, p.y + 59);
    //** Formular Stirrups s min **************** END

    //** Stirrup mesure line **************** START
    push();
    textAlign(CENTER, CENTER);
    line(p.x + 500 - 10, -50, p.x + 500 + this.stirrup_s + 10, -50); //** Horisontal
    line(p.x + 500, -50 - 10, p.x + 500, -50 + 40); //** Vertical
    line(
      p.x + 500 + this.stirrup_s,
      -50 - 10,
      p.x + 500 + this.stirrup_s,
      -50 + 40
    ); //** Vertical
    noStroke();
    text(this.stirrup_s, p.x + 500 + 0.5 * this.stirrup_s, -50 - 25);
    pop();
    //** Stirrup mesure line **************** END

    //** Vud **************** START
    textSize(35);
    textAlign(LEFT, CENTER);
    noStroke();

    let p1 = new p5.Vector(1650, 50);
    text("V", p1.x, p1.y + 50);
    text("=", p1.x + 75, p1.y + 50);
    text("min.", p1.x + 125, p1.y + 50);
    text("A", p1.x + 250, p1.y - 25);
    text("s", p1.x + 265, p1.y + 25);
    text("f", p1.x + 225 + 125, p1.y);
    text("h", p1.x + 290 + 125, p1.y);
    text("cot", p1.x + 325 + 125, p1.y);
    text("kN", p1.x + 870, p1.y);

    symbol = String.fromCharCode(0x03b8); //U+03B8 ** Theta
    text(symbol, p1.x + 375 + 125, p1.y);
    text("=", p1.x + 700, p1.y);

    text("b", p1.x + 250, p1.y + 100);
    text("h", p1.x + 275, p1.y + 100);

    symbol = String.fromCharCode(0x03bd); //U+03BD ** Ny
    text(symbol, p1.x + 320, p1.y + 100);
    text("f", p1.x + 350, p1.y + 100);
    text("1", p1.x + 510, p1.y + 75);
    text("=", p1.x + 700, p1.y + 100);
    text("kN", p1.x + 870, p1.y + 100);

    text("cot", p1.x + 425, p1.y + 125);
    symbol = String.fromCharCode(0x03b8); //U+03B8 ** Theta
    text(symbol, p1.x + 475, p1.y + 125);

    text("+", p1.x + 505, p1.y + 125);
    text("1/cot", p1.x + 535, p1.y + 125);
    text(symbol, p1.x + 615, p1.y + 125);

    textAlign(RIGHT, CENTER);
    text(nf(calculation.Vud, 0, 1), p1.x + 850, p1.y);
    text(nf(calculation.Vud_max, 0, 1), p1.x + 850, p1.y + 100);

    textAlign(LEFT, CENTER);
    textSize(25);
    text("ud", p1.x + 25, p1.y + 50 + 10);
    text("sw", p1.x + 155 + 125, p1.y - 15);
    text("yd", p1.x + 240 + 125, p1.y + 15);
    text("i", p1.x + 315 + 125, p1.y + 15);

    text("i", p1.x + 300, p1.y + 115);
    text("f", p1.x + 336, p1.y + 115);
    text("cd", p1.x + 240 + 125, p1.y + 115);

    stroke(0);
    line(p1.x + 110 + 125, p1.y, p1.x + 210 + 125, p1.y); //** Horisontal Tæller
    line(p1.x + 410, p1.y + 100, p1.x + 650, p1.y + 100); //** Horisontal Nævner
    line(p1.x + 210, p1.y - 25, p1.x + 210, p1.y + 125); //** Vertical

    //** Set line under result
    let adjustResult = 0;
    if (calculation.Vud > calculation.Vud_max) adjustResult = 100;

    line(
      p1.x + 740,
      p1.y + 25 + adjustResult,
      p1.x + 920,
      p1.y + 25 + adjustResult
    );
    line(
      p1.x + 740,
      p1.y + 32 + adjustResult,
      p1.x + 920,
      p1.y + 32 + adjustResult
    );
    //** Vud **************** END

    //** Text top
    push();
    stroke(0);
    fill(100, 100, 100, 100);
    strokeWeight(1);
    translate(1070, 0);
    line(-55, 0, 10, 0);
    triangle(0, 0, -10, -10, 10, -10);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(25);
    noStroke();
    text("0", 0, -25);
    pop();

    //** Text bottom
    push();
    stroke(0);
    fill(100, 100, 100, 100);
    strokeWeight(1);
    translate(1070, this.h);
    line(-55, 0, 10, 0);
    triangle(0, 0, -10, -10, 10, -10);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(25);
    noStroke();
    text(this.h, 0, -25);
    pop();

    pop();
  }

  Display_yo() {
    push();
    translate(this.insertPoint.x, this.insertPoint.y);
    let yo = calculation.h_0 + calculation.h_1;
    strokeWeight(2);
    //line(-30, calculation.yo, this.b + 1000, calculation.yo);
    line(-30, calculation.yo, this.b + 1850, yo);

    //** Text
    /*
    line(this.b + 10, 0, this.b + 60, 0);
    line(this.b + 50, -10, this.b + 50, yo + 10);
    fill(0);
    circle(this.b + 50, 0, 4);
    circle(this.b + 50, yo, 4);
    textAlign(LEFT, CENTER);
    textSize(25);
    text(nf(yo, 0, 1), this.b + 60, 0.5 * yo);
    */

    push();
    noFill();
    strokeWeight(1);
    translate(this.b + 125, yo);
    fill(0);
    triangle(0, 0, -10, -10, 10, -10);

    textAlign(CENTER, CENTER);
    textSize(25);
    text(nf(yo, 0, 1), 0, -25);
    pop();
    pop();
  }

  DisplayStress() {
    push();
    let insert_x = this.b + 600;
    translate(this.insertPoint.x, this.insertPoint.y);
    strokeWeight(2);
    line(insert_x, 0, insert_x, this.h);
    fill(0);
    circle(insert_x, calculation.yo, 6);

    textSize(25);

    //** StressValues Rebar
    //** Rebar
    for (let i = 0; i < this.rebar.length; i++) {
      if (this.rebar[i].s_s0 < 0) {
        stroke(255, 0, 0);
        fill(255, 0, 0);
      } else {
        stroke(0, 0, 255);
        fill(0, 0, 255);
      }

      strokeWeight(4);
      line(
        insert_x,
        this.rebar[i].h_ef,
        insert_x + this.rebar[i].s_s0 * this.scaleStress,
        this.rebar[i].h_ef
      );

      //** TextValues
      noStroke();
      strokeWeight(1);
      let adjustText = 15;
      if (this.rebar[i].e_s0 < 0) textAlign(LEFT, CENTER);
      else {
        textAlign(RIGHT, CENTER);
        adjustText = -15;
      }
      text(
        nf(this.rebar[i].s_s0, 0, 1),
        insert_x + adjustText,
        this.rebar[i].h_ef
      );
    }

    //** StressValues Concrete Top
    //line(insert_x, 0, insert_x + calculation.e_c0, 0);
    //circle(insert_x, 0, 4);
    //circle(insert_x + calculation.s_c0, 0, 4);
    textAlign(LEFT, CENTER);
    noStroke();
    fill(255, 0, 0);
    text(nf(calculation.s_c0, 0, 1), insert_x + 15, 0);

    //console.log("geometry line 175 s_co: " + calculation.y_175); //** set y_175 = 0 hvis ...
    //** Concrete

    strokeWeight(2);
    stroke(0, 0, 0);
    fill(255, 0, 0, 100);
    beginShape();
    //** Add vertices.
    vertex(insert_x, 0);
    vertex(insert_x + 2 * calculation.s_c0, 0);
    if (2 * calculation.e_c0 <= -calculation.ecu3 * 1000 * 10)
      vertex(insert_x + 2 * calculation.s_c0, calculation.y_175);
    vertex(insert_x, calculation.yo);
    endShape(CLOSE);

    textAlign(CENTER, CENTER);
    textSize(35);
    stroke(0, 0, 0, 255);
    strokeWeight(1);
    fill(0);
    let symbol = String.fromCharCode(0x03c3);
    text(symbol, insert_x, -150);
    noFill();
    strokeWeight(2);
    circle(insert_x, -150, 50);

    //** Header
    textAlign(CENTER, CENTER);
    textSize(25);
    noStroke();
    fill(0);
    text("[MPa]", insert_x, -75);
    pop();
  }

  DisplayForcesConcrete() {
    push();
    let insert_x = this.b + 1000;
    translate(this.insertPoint.x, this.insertPoint.y);
    strokeWeight(2);
    line(insert_x, 0, insert_x, this.h);

    //** Normalize Force
    let maxForce = 1;
    if (calculation.forceMax > maxForce) maxForce = calculation.forceMax;
    if (abs(calculation.forceMin) > maxForce)
      maxForce = abs(calculation.forceMin);
    if (abs(calculation.f_c0) > maxForce) maxForce = abs(calculation.f_c0);
    if (abs(calculation.f_c1) > maxForce) maxForce = abs(calculation.f_c1);
    this.factorForce = 100 / maxForce;

    //** Concrete Force
    strokeWeight(3);

    //** Display h_ef
    push();
    fill(100, 100, 100, 100);
    strokeWeight(1);
    translate(insert_x + 125, calculation.f_c0_hef);
    line(-25, 0, 10, 0);
    triangle(0, 0, -10, -10, 10, -10);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(25);
    text(nf(calculation.f_c0_hef, 0, 1), 0, -25);
    pop();

    push();
    fill(100, 100, 100, 100);
    strokeWeight(1);
    translate(insert_x + 200, calculation.f_c1_hef);
    line(-100, 0, 10, 0);
    triangle(0, 0, -10, -10, 10, -10);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(25);
    text(nf(calculation.f_c1_hef, 0, 1), 0, -25);
    pop();

    stroke(255, 0, 0);
    line(
      insert_x,
      calculation.f_c0_hef,
      insert_x + calculation.f_c0 * this.factorForce,
      calculation.f_c0_hef
    );
    line(
      insert_x,
      calculation.f_c1_hef,
      insert_x + calculation.f_c1 * this.factorForce,
      calculation.f_c1_hef
    );

    //console.log(calculation.f_c0_hef)
    textAlign(LEFT, CENTER);
    textSize(25);
    noStroke();
    strokeWeight(1);
    fill(255, 0, 0);
    if (calculation.f_c0 < 0)
      text(nf(calculation.f_c0, 0, 1), insert_x + 15, calculation.f_c0_hef);
    text(nf(calculation.f_c1, 0, 1), insert_x + 15, calculation.f_c1_hef);

    //** Header
    textAlign(CENTER, CENTER);
    textSize(35);
    noStroke();
    fill(0);
    text("Force", insert_x, 0 - 150);
    text("Concrete", insert_x, 0 - 115);
    textSize(25);
    text("[kN]", insert_x, -75);

    pop();
  }

  DisplayForcesRebar() {
    push();
    let insert_x = this.b + 1400;
    translate(this.insertPoint.x, this.insertPoint.y);
    strokeWeight(2);

    line(insert_x, 0, insert_x, this.h);

    textSize(25);

    //** StressValues Rebar
    //** Rebar
    for (let i = 0; i < this.rebar.length; i++) {
      if (this.rebar[i].s_s0 < 0) {
        stroke(255, 0, 0);
        fill(255, 0, 0);
      } else {
        stroke(0, 0, 255);
        fill(0, 0, 255);
      }

      strokeWeight(4);
      line(
        insert_x,
        this.rebar[i].h_ef,
        insert_x + this.rebar[i].f_s0 * this.factorForce,
        this.rebar[i].h_ef
      );

      //** TextValues
      noStroke();
      strokeWeight(1);
      let adjustText = 15;
      if (this.rebar[i].e_s0 < 0) textAlign(LEFT, CENTER);
      else {
        textAlign(RIGHT, CENTER);
        adjustText = -15;
      }
      text(
        nf(this.rebar[i].f_s0, 0, 1),
        insert_x + adjustText,
        this.rebar[i].h_ef
      );
    }

    //** Header
    textAlign(CENTER, CENTER);
    textSize(35);
    noStroke();
    fill(0);
    text("Force", insert_x, 0 - 150);
    text("Rebar", insert_x, 0 - 115);
    textSize(25);
    text("[kN]", insert_x, -75);
    pop();
  }

  DisplayForcesRes() {
    push();
    let insert_x = this.b + 1800;
    translate(this.insertPoint.x, this.insertPoint.y);
    strokeWeight(2);

    line(insert_x, 0, insert_x, this.h);

    textSize(25);
    strokeWeight(4);

    //** this.C_res
    stroke(255, 0, 0);
    line(
      insert_x,
      calculation.yo + calculation.e_C_res,
      insert_x + calculation.C_res * this.factorForce,
      calculation.yo + calculation.e_C_res
    );

    //** Values this.C_res
    push();
    textAlign(LEFT, CENTER);
    textSize(25);
    noStroke();
    strokeWeight(1);
    fill(255, 0, 0);

    text(
      nf(calculation.C_res, 0, 1),
      insert_x + 15,
      calculation.yo + calculation.e_C_res
    );
    pop();

    //** this.T_res
    stroke(0, 0, 255);
    line(
      insert_x,
      calculation.yo + calculation.e_T_res,
      insert_x + calculation.T_res * this.factorForce,
      calculation.yo + calculation.e_T_res
    );

    //** Values this.T_res
    push();
    noStroke();
    strokeWeight(1);
    fill(0, 0, 255);

    textAlign(RIGHT, CENTER);

    text(
      nf(calculation.T_res, 0, 1),
      insert_x - 15,
      calculation.yo + calculation.e_T_res
    );
    pop();

    //** this.hi
    push();

    let x = insert_x + calculation.T_res * this.factorForce + 120;
    let x1 = insert_x + calculation.T_res * this.factorForce + 25;
    let yC = calculation.yo + calculation.e_C_res;
    let yT = calculation.yo + calculation.e_T_res;
    let yo = calculation.yo;

    strokeWeight(1);
    stroke(0);
    //** vertical
    line(x, yC - 5, x, yT + 5); //** hi
    line(x1, yC - 5, x1, yT + 5); //** e_C, e_T

    //** horisontal
    line(x - 75, yC, x + 5, yC); //** hi Top
    line(x - 75, yT, x + 5, yT); //** hi Bottom
    line(x1 - 5, yC, x1 + 5, yC); //** e_C
    line(insert_x + 75, yo, x1 + 5, yo); //** e_yo
    line(x1 - 5, yT, x1 + 5, yT); //** e_T

    //** text
    noStroke();
    textAlign(LEFT, CENTER);
    text(
      "h  = " + nf(calculation.hi, 0, 1) + " mm",
      x + 15,
      yC + 0.5 * (yT - yC)
    );
    text("i", x + 30, yC + 0.5 * (yT - yC) + 8);

    //** e_C
    text(abs(nf(calculation.e_C_res, 0, 1)), x1 + 15, yo - 0.5 * (yo - yC));

    //** e_T
    text(nf(calculation.e_T_res, 0, 1), x1 + 15, yo + 0.5 * (yT - yo));

    pop();

    //** Header
    textAlign(CENTER, CENTER);
    textSize(35);
    noStroke();
    fill(0);
    text("Force", insert_x, 0 - 150);
    text("Resulting", insert_x, 0 - 115);
    textSize(25);
    text("[kN]", insert_x, -75);
    pop();
  }

  DisplayStrain() {
    push();
    let insert_x = this.b + 300;
    translate(this.insertPoint.x, this.insertPoint.y);
    strokeWeight(2);

    line(insert_x, 0, insert_x, this.h);
    line(insert_x + calculation.e_c0, 0, insert_x + calculation.e_c2, this.h);
    fill(0);
    circle(insert_x, calculation.yo, 6);

    textSize(25);

    //** StrainValues Rebar
    for (let i = 0; i < this.rebar.length; i++) {
      strokeWeight(1);
      line(
        insert_x,
        this.rebar[i].h_ef,
        insert_x + this.rebar[i].e_s0,
        this.rebar[i].h_ef
      );
      circle(insert_x, this.rebar[i].h_ef, 4);
      circle(insert_x + this.rebar[i].e_s0, this.rebar[i].h_ef, 4);

      let adjustText = 15;
      if (this.rebar[i].e_s0 < 0) textAlign(LEFT, CENTER);
      else {
        textAlign(RIGHT, CENTER);
        adjustText = -15;
      }
      text(
        nf(this.rebar[i].e_s0 / 10, 0, 2),
        insert_x + adjustText,
        this.rebar[i].h_ef
      );
    }

    //** StrainValues Concrete Top
    line(insert_x, 0, insert_x + calculation.e_c0, 0);
    circle(insert_x, 0, 4);
    circle(insert_x + calculation.e_c0, 0, 4);
    textAlign(LEFT, CENTER);
    text(nf(calculation.e_c0 / 10, 0, 2), insert_x + 15, 0);

    //** Strain Symbol
    strokeWeight(1);
    textAlign(CENTER, CENTER);
    textSize(35);
    stroke(0, 0, 0, 255);

    fill(0);
    let symbol = String.fromCharCode(0x03b5);
    text(symbol, insert_x, 0 - 150);
    noFill();
    strokeWeight(2);
    circle(insert_x, 0 - 150, 50);

    //** Header
    textAlign(CENTER, CENTER);
    textSize(25);
    noStroke();
    fill(0);
    symbol = String.fromCharCode(0x2030);
    textSize(25);
    text("[" + symbol + "]", insert_x, -75);

    pop();
  }

  GeometryAdjust(pos) {
if (pointGeometryLogged ) movingObject = true;
    
    //** Geometry Adjust when rebar number or size is changed
    if (this.b < this.b_min) this.b = this.b_min;
    if (this.h < this.h_min) this.h = this.h_min;

    this.adjustPoint.x = this.insertPoint.x + this.b;
    this.adjustPoint.y = this.insertPoint.y + this.h;
    //line(0,0,this.adjustPoint.x,this.adjustPoint.y)

    //** Log Point
    if (this.OverlapPoint(pos) && mouseIsPressed) pointGeometryLogged = true;
    //reCalc = false;
    //** Adjust
    if (!pointGeometryLogged) return;

    //**Variable for calculation.Calculate_eM_graph()
    reCalc = true;

    this.adjustPoint.x = max(this.insertPoint.x + this.b_min, this.Step(pos.x));
    this.adjustPoint.y = max(this.insertPoint.y + this.h_min, this.Step(pos.y));
    //console.log("geometry line 756: " + this.adjustPoint.x)

    this.b = this.adjustPoint.x - this.insertPoint.x;
    this.h = this.adjustPoint.y - this.insertPoint.y;

    if (this.b < this.b_min) this.b = this.b_min;
    if (this.h < this.h_min) this.h = this.h_min;

    /*
    //** Adjust last rebar to new height;
    //** If adjust geometry => adjust rebars pos and buttonRollor
    let lastRebar_h_ef = this.rebar[this.rebar.length - 1].h_ef;
    let distTopEdgeToCenterRebar =
      this.h - this.c1_min - 0.5 * this.rebar[this.rebar.length - 1].size;
    if (lastRebar_h_ef < distTopEdgeToCenterRebar) {
      this.rebar[this.rebar.length - 1].h_ef = distTopEdgeToCenterRebar;
    }*/

    /*

    //** Adjust buttonRollor
    this.rebar[this.rebar.length - 1].buttonRollor_stk.pos3.y =
      lastRebar_h_ef + 20;
    this.rebar[this.rebar.length - 1].buttonRollor_stk.Update();

    this.rebar[this.rebar.length - 1].buttonRollor_ø.pos3.y =
      lastRebar_h_ef + 20;
    this.rebar[this.rebar.length - 1].buttonRollor_ø.Update();
    */

    //** Adjust bars inbetween
    for (let i = this.rebar.length - 2; i >= 0; i--) {
      if (
        this.rebar[i].h_ef >
        this.rebar[i + 1].h_ef - this.rebar[i + 1].limitUp
      ) {
        this.rebar[i].h_ef = this.rebar[i + 1].h_ef - this.rebar[i + 1].limitUp;
      }
    }
  }

  OverlapPoint(pos) {
    let distToPoint = dist(
      pos.x,
      pos.y,
      this.adjustPoint.x,
      this.adjustPoint.y
    );

    if (distToPoint < 20) {
      push();
      fill(100, 100, 100, 100);
      if (pointGeometryLogged) fill(0, 250, 0, 100);
      circle(this.adjustPoint.x, this.adjustPoint.y, 20);
      pop();
      return true;
    } else return false;
  }

  RebarSetLimits() {
    if (this.rebar.length == 0) return;
    if (this.rebar.length == 1) {
      this.rebar[0].limitUp =
        this.c_nom + this.stirrup_ø + 0.5 * this.rebar[0].size;
      this.rebar[0].limitDown = max(
        this.c_nom + this.stirrup_ø + 0.5 * this.rebar[0].size,
        this.c1_min + 0.5 * this.rebar[0].size
      );
    }

    //** Length = 2
    if (this.rebar.length == 2) {
      this.rebar[0].limitUp =
        this.c_nom + this.stirrup_ø + 0.5 * this.rebar[0].size;
      this.rebar[0].limitDown =
        this.a + 0.5 * (this.rebar[0].size + this.rebar[1].size);

      this.rebar[1].limitUp =
        this.a + 0.5 * (this.rebar[0].size + this.rebar[1].size);

      let l1 = this.c_nom + this.stirrup_ø + 0.5 * this.rebar[1].size;
      let l2 = this.c1_min + 0.5 * this.rebar[1].size;
      this.rebar[1].limitDown = max(
        this.c_nom + this.stirrup_ø + 0.5 * this.rebar[1].size,
        this.c1_min + 0.5 * this.rebar[1].size
      );
      //console.log("geometry Line 881 - this.rebar[1].limitDown: " + this.c1_min)
    }

    //** Length > 2
    if (this.rebar.length > 2) {
      //** [first]
      this.rebar[0].limitUp =
        this.c_nom + this.stirrup_ø + 0.5 * this.rebar[0].size;
      this.rebar[0].limitDown =
        this.a + 0.5 * (this.rebar[0].size + this.rebar[1].size);

      //** [inBetween]
      for (let i = 1; i < this.rebar.length - 1; i++) {
        this.rebar[i].limitUp =
          this.a + 0.5 * (this.rebar[i - 1].size + this.rebar[i].size);
        this.rebar[i].limitDown =
          this.a + 0.5 * (this.rebar[i].size + this.rebar[i + 1].size);
      }

      //** [last]
      this.rebar[this.rebar.length - 1].limitUp =
        this.a +
        0.5 *
          (this.rebar[this.rebar.length - 2].size +
            this.rebar[this.rebar.length - 1].size);
      this.rebar[this.rebar.length - 1].limitDown = max(
        this.c_nom +
          this.stirrup_ø +
          0.5 * this.rebar[this.rebar.length - 1].size,
        this.c1_min + 0.5 * this.rebar[this.rebar.length - 1].size
      );
    }

    //console.log(this.rebar)
    //console.log("*****")
  }

  RebarAdjust(pos) {
    if (this.rebarNumberLogged >= 0) movingObject = true;
    
    //** color rebarInsertCircle
    push();
    if (this.rebarNumberLogged) {
      fill(0, 250, 0, 100);
      circle(
        this.rebar[this.rebarNumberLogged].insertPoint.x +
          this.insertPoint.x -
          250,
        this.insertPoint.y + this.rebar[this.rebarNumberLogged].h_ef,
        40
      );
    }
    pop();

    //** Log Point
    if (this.OverlapPointRebar(pos) && mouseIsPressed) pointRebarLogged = true;

    //** Adjust if point logged otherwise return
    if (!pointRebarLogged) return;

    //** Move top rebar
    if (this.rebarNumberLogged == 0) {
      //**Variable for calculation.Calculate_eM_graph()
      reCalc = true;
      this.rebar[0].h_ef = this.Step(pos.y - this.insertPoint.y);
    }

    //** Move bottom rebar
    if (this.rebarNumberLogged == this.rebar.length - 1) {
      //**Variable for calculation.Calculate_eM_graph()
      reCalc = true;

      this.rebar[this.rebar.length - 1].h_ef = this.Step(
        pos.y - this.insertPoint.y
      );
    }

    //** Move rebars between Top and bottom rebar
    for (let i = 1; i < this.rebar.length - 1; i++) {
      //console.log("overlapped: " +i + " "+this.rebar[i].overlapped)
      if (this.rebarNumberLogged == i) {
        //**Variable for calculation.Calculate_eM_graph()
        reCalc = true;

        //** limits
        let limitUp = this.rebar[i - 1].h_ef + this.rebar[i - 1].limitDown;
        let limitDown = this.rebar[i + 1].h_ef - this.rebar[i + 1].limitUp;

        /*
        console.log(
          "limitUp: " +
            limitUp +
            "  h_ef: " +
            this.rebar[i].h_ef +
            "   limitDown: " +
            limitDown
        );
        */

        //** Move if between limits
        if (limitUp <= this.rebar[i].h_ef && this.rebar[i].h_ef <= limitDown) {
          //** Condition so that no lock and no move of other bars
          pos.y = max(limitUp + this.insertPoint.y, pos.y);
          pos.y = min(limitDown + this.insertPoint.y, pos.y);
          //console.log("geometry line 712 " + pos.y);

          //** Move
          this.rebar[i].h_ef = this.Step(pos.y - this.insertPoint.y);
          //this.rebar[i].h_ef = (pos.y - this.insertPoint.y);
        }
      }
    }

    //** ButtonRollor Update *** By Update pos3
    for (let i = 0; i < this.rebar.length; i++) {
      this.rebar[i].buttonRollor_stk.pos3.y = this.Step(
        this.rebar[i].h_ef + 20
      );
      this.rebar[i].buttonRollor_ø.pos3.y = this.Step(this.rebar[i].h_ef + 20);
      this.rebar[i].buttonRollor_stk.Update();
      this.rebar[i].buttonRollor_ø.Update();
    }

    let topRebar = 0;
    let bottomRebar = this.rebar.length - 1;
    //** Limit to topConcrete
    if (this.rebar[0].h_ef < this.rebar[0].limitUp)
      this.rebar[0].h_ef = this.rebar[0].limitUp;
    //** Limit to bottomConcrete
    if (
      this.h - this.rebar[bottomRebar].h_ef <
      this.rebar[bottomRebar].limitDown
    )
      this.rebar[bottomRebar].h_ef = this.h - this.rebar[bottomRebar].limitDown;

    if (this.rebar.length > 1) {
      //** Limit Top- and Bottom Rebar

      //** TopRebar ** START **

      //** Limit to next rebar
      if (this.rebar[1].h_ef - this.rebar[0].h_ef < this.rebar[0].limitDown)
        this.rebar[0].h_ef = this.rebar[1].h_ef - this.rebar[1].limitUp;
      //** TopRebar ** END **

      //** BottomRebar ** START **

      //** Limit to previous rebar
      if (
        this.rebar[bottomRebar].h_ef - this.rebar[bottomRebar - 1].h_ef <
        this.rebar[bottomRebar].limitUp
      )
        this.rebar[bottomRebar].h_ef =
          this.rebar[bottomRebar - 1].h_ef + this.rebar[bottomRebar].limitUp;
      //** BottomRebar ** END **}
    }
  }

  OverlapPointRebar(pos) {
    for (let i = 0; i < this.rebar.length; i++) {
      this.rebar[i].overlapped = false;

      let distToPointRebar = dist(
        pos.x,
        pos.y,
        this.rebar[i].insertPoint.x + this.insertPoint.x - 250,
        this.insertPoint.y + this.rebar[i].h_ef
      );

      //let distToPointRebar = abs(pos.y-(this.insertPoint.y + this.rebar[i].h_ef));
      //console.log("dist: " + distToPointRebar)

      if (distToPointRebar < 20) {
        push();
        fill(100, 100, 100, 100);
        this.rebarOverlapped = i;
        if (pointRebarLogged) {
          fill(0, 250, 0, 100);
          this.rebar[i].overlapped = true;
          this.rebarNumberLogged = i;
        }

        circle(
          this.rebar[i].insertPoint.x + this.insertPoint.x - 250,
          this.insertPoint.y + this.rebar[i].h_ef,
          40
        );

        pop();

        return true;
      } //else return false;
    }
  }

  /*
  RebarLimits() {
    for (let i = 0; i < this.rebar.length; i++) {
      let distTopEdgeToCenterRebar = this.h - this.c1_min - 0.5 * this.rebar[i].size;
      if (this.rebar[i].h_ef >= distTopEdgeToCenterRebar)
        this.rebar[i].h_ef = distTopEdgeToCenterRebar;
    }
  }*/

  //**Sort Array or Rebar after h_ef
  //**Called from geometry.RebarAdd;
  BubbleSort(array) {
    for (let i = array.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (array[j].h_ef > array[j + 1].h_ef) {
          // swap
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
  }

  Step(pos) {
    pos = round(pos / this.stepSize) * this.stepSize;
    return pos;
  }
}
