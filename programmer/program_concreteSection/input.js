class Input {
  constructor() {
    this.insertPoint = new p5.Vector(400, 400);
    this.insertPoint_1 = new p5.Vector(400, 450);

    this.displaceX = 50;
    this.displaceY = -10;

    //** Cover input
    this.displaceX2 = 850;
    this.displaceY2 = 100;

    this.fck = 0;
    this.fcd = 0;

    this.fyk = 0;
    this.fyd = 0;
  }

  InputUpdate() {
    this.fck = buttonRollor_fck.ReadValue();
    this.fcd = buttonRollor_fck.ReadValue() / buttonRollor_gck.ReadValue();

    this.fyk = buttonRollor_fyk.ReadValue();
    this.fyd = buttonRollor_fyk.ReadValue() / buttonRollor_gyk.ReadValue();

    // this.esyd = this.fyd / this.Esk;

    //** ULS => ec3 = 1,75 o/oo jf. EC2
    //this.n_uls = (0.00175 * this.Esk) / this.fcd; //** => ec3 = 1,75 o/oo
    //buttonRollor_n.SetValue(this.n_uls);
  }

  Display() {
    push();

    textSize(50);
    text("Inputdata", this.insertPoint.x, this.insertPoint.y);
    text("Geometry", this.insertPoint.x, this.insertPoint.y + 600);

    textSize(35);
    textAlign(LEFT, CENTER);
    text(
      "Rebar Add/Detlete",
      this.insertPoint.x + 255,
      this.insertPoint.y + 675
    );
    //text("Calculation", this.insertPoint.x+750, this.insertPoint.y+550);
    this.DisplayConcreteIndata(0, 0);
    this.DisplayReinforcementIndata(0, 0);
    //this.DisplayStiffnessIndata(0,0);
    pop();
  }

  ConvertToSciNot(number, precision) {
    this.power = Math.round(Math.log10(number));
    this.mantissa = (number / Math.pow(10, Math.abs(this.power))).toFixed(
      precision
    );
    if (number == 0) {
      this.mantissa = 0;
    }
  }

  DisplayConcreteIndata() {
    push();
    textSize(35);
    text(
      "Concrete:",
      this.insertPoint.x + this.displaceX + 0,
      this.insertPoint.y + this.displaceY + 100
    );
    text(
      "f",
      this.insertPoint.x + this.displaceX + 50,
      this.insertPoint.y + this.displaceY + 150
    );
    text(
      "=",
      this.insertPoint.x + this.displaceX + 100,
      this.insertPoint.y + this.displaceY + 150
    );
    text(
      "Mpa",
      this.insertPoint.x + this.displaceX + 250,
      this.insertPoint.y + this.displaceY + 150
    );

    textSize(25);
    text(
      "ck",
      this.insertPoint.x + this.displaceX + 64,
      this.insertPoint.y + this.displaceY + 155
    );

    //**Concrete gamma
    textSize(35);
    let symbol = String.fromCharCode(0x03b3);
    text(
      symbol,
      this.insertPoint.x + this.displaceX + 450,
      this.insertPoint.y + this.displaceY + 150
    );

    text(
      "=",
      this.insertPoint.x + this.displaceX + 500,
      this.insertPoint.y + this.displaceY + 150
    );

    textSize(20);
    text(
      "M",
      this.insertPoint.x + this.displaceX + 467,
      this.insertPoint.y + this.displaceY + 155
    );

    //**Concrete design
    textSize(35);
    text(
      "f",
      this.insertPoint.x + this.displaceX + 50,
      this.insertPoint.y + this.displaceY + 200
    );
    text(
      "=",
      this.insertPoint.x + this.displaceX + 100,
      this.insertPoint.y + this.displaceY + 200
    );
    text(
      "Mpa",
      this.insertPoint.x + this.displaceX + 250,
      this.insertPoint.y + this.displaceY + 200
    );

    symbol = String.fromCharCode(0x03bd); //U+03BD ny
    text(
      symbol,
      this.insertPoint.x + this.displaceX + 50,
      this.insertPoint.y + this.displaceY + 250
    );
    text(
      "=",
      this.insertPoint.x + this.displaceX + 100,
      this.insertPoint.y + this.displaceY + 250
    );

    textSize(25);
    text(
      "cd",
      this.insertPoint.x + this.displaceX + 64,
      this.insertPoint.y + this.displaceY + 205
    );
    text(
      "f",
      this.insertPoint.x + this.displaceX + 68,
      this.insertPoint.y + this.displaceY + 260
    );
    pop();

    //** fcd
    push();
    textSize(35);
    textAlign(RIGHT);
    text(
      nf(this.fcd, 1, 1),
      this.insertPoint.x + this.displaceX + 225,
      this.insertPoint.y + this.displaceY + 200
    );

    //** ny
    //calculation.ny = 0.7 - this.fck/200;
    text(
      nf(calculation.ny, 1, 2),
      this.insertPoint.x + this.displaceX + 225,
      this.insertPoint.y + this.displaceY + 250
    );

    pop();
  }

  DisplayReinforcementIndata(displaceX, displaceY) {
    //**Reinforcement
    push();
    textSize(35);
    text(
      "Reinforcement:",
      this.insertPoint_1.x + this.displaceX + 0,
      this.insertPoint_1.y + this.displaceY + 300
    );
    text(
      "f",
      this.insertPoint_1.x + this.displaceX + 50,
      this.insertPoint_1.y + this.displaceY + 350
    );
    text(
      "=",
      this.insertPoint_1.x + this.displaceX + 100,
      this.insertPoint_1.y + this.displaceY + 350
    );
    text(
      "Mpa",
      this.insertPoint_1.x + this.displaceX + 250,
      this.insertPoint_1.y + this.displaceY + 350
    );

    textSize(25);
    text(
      "yk",
      this.insertPoint_1.x + this.displaceX + 64,
      this.insertPoint_1.y + this.displaceY + 355
    );

    //**Reinforcement gamma
    textSize(35);
    let symbol = String.fromCharCode(0x03b3);
    text(
      symbol,
      this.insertPoint_1.x + this.displaceX + 450,
      this.insertPoint_1.y + this.displaceY + 350
    );

    text(
      "=",
      this.insertPoint_1.x + this.displaceX + 500,
      this.insertPoint_1.y + this.displaceY + 350
    );

    textSize(20);
    text(
      "M",
      this.insertPoint_1.x + this.displaceX + 467,
      this.insertPoint_1.y + this.displaceY + 355
    );

    //**Reinforcement design
    textSize(35);

    text(
      "f",
      this.insertPoint_1.x + this.displaceX + 50,
      this.insertPoint_1.y + this.displaceY + 400
    );
    text(
      "=",
      this.insertPoint_1.x + this.displaceX + 100,
      this.insertPoint_1.y + this.displaceY + 400
    );
    text(
      "Mpa",
      this.insertPoint_1.x + this.displaceX + 250,
      this.insertPoint_1.y + this.displaceY + 400
    );

    textSize(25);
    text(
      "yd",
      this.insertPoint_1.x + this.displaceX + 64,
      this.insertPoint_1.y + this.displaceY + 405
    );
    pop();

    //** fyd
    push();
    textSize(35);
    textAlign(RIGHT);
    text(
      nf(this.fyd, 1, 1),
      this.insertPoint_1.x + this.displaceX + 225,
      this.insertPoint_1.y + this.displaceY + 400
    );
    pop();
  }

  DisplayGeometryInddata() {
    //** Cover
    push();
    textSize(35);
    textAlign(LEFT, BASELINE);
    text(
      "Cover:",
      this.insertPoint.x + this.displaceX2 + 0,
      this.insertPoint.y + this.displaceY2 + 0
    );

    text(
      "Aggregate max size:",
      this.insertPoint.x + this.displaceX2 + 500,
      this.insertPoint.y + this.displaceY2 + 0
    );

    text(
      "Geometry Limits:",
      this.insertPoint.x + this.displaceX2 + 1100,
      this.insertPoint.y + this.displaceY2 + 0
    );

    pop();

    push();
    translate(1350, 550);
    textSize(35);
    textAlign(LEFT);

    //** Column 1
    //** c_min
    text("c", -50, 0);
    text("=", 50, 0);
    text("mm", 200, 0);

    //** c_dev
    text("c", -50, 50);
    text("=", 50, 50);
    text("mm", 200, 50);

    //** c_nom
    text("c", -50, 100);
    text("=", 50, 100);
    text("mm", 200, 100);

    //** dg
    text("d", 450, 0);
    text("=", 550, 0);
    text("mm", 700, 0);

    textSize(25);
    text("min.", -25, 5);
    text("dev.", -25, 55);
    text("nom.", -25, 105);
    text("g", 475, 5);

    //** Column 3


    pop();
  }

  DisplayStiffnessIndata(displaceX, displaceY) {
    push();
    textSize(35);
    text(
      "Stiffness:",
      this.insertPoint.x + this.displaceX + 0,
      this.insertPoint.y + this.displaceY + 650
    );
    text(
      "n",
      this.insertPoint.x + this.displaceX + 50,
      this.insertPoint.y + this.displaceY + 700
    );
    text(
      "=",
      this.insertPoint.x + this.displaceX + 100,
      this.insertPoint.y + this.displaceY + 700
    );

    text(
      "E",
      this.insertPoint.x + this.displaceX + 50,
      this.insertPoint.y + this.displaceY + 750
    );
    text(
      "=",
      this.insertPoint.x + this.displaceX + 100,
      this.insertPoint.y + this.displaceY + 750
    );
    text(
      "Mpa",
      this.insertPoint.x + this.displaceX + 300,
      this.insertPoint.y + this.displaceY + 750
    );

    text(
      "E",
      this.insertPoint.x + this.displaceX + 50,
      this.insertPoint.y + this.displaceY + 800
    );
    text(
      "=",
      this.insertPoint.x + this.displaceX + 100,
      this.insertPoint.y + this.displaceY + 800
    );

    text(
      "Mpa",
      this.insertPoint.x + this.displaceX + 300,
      this.insertPoint.y + this.displaceY + 800
    );

    /*
    push();
    textAlign(RIGHT);
    text(
      nf(calculate.Ec, 2, 1),
      this.insertPoint.x + this.displaceX + 275,
      this.insertPoint.y + this.displaceY + 750
    );

    textAlign(RIGHT);
    text(
      nf(calculate.Es, 2, 1),
      this.insertPoint.x + this.displaceX + 275,
      this.insertPoint.y + this.displaceY + 800
    );
    pop();
    */

    text(
      "EI",
      this.insertPoint.x + this.displaceX + 50,
      this.insertPoint.y + this.displaceY + 900
    );

    text(
      "=",
      this.insertPoint.x + this.displaceX + 100,
      this.insertPoint.y + this.displaceY + 900
    );

    text(
      "Nmm",
      this.insertPoint.x + this.displaceX + 400,
      this.insertPoint.y + this.displaceY + 900
    );
    pop();

    /*
    //*SciNotation START
    push();
    textAlign(RIGHT);
    this.ConvertToSciNot(calculate.EI_elastic, 3);
    text(
      this.mantissa + " x 10",
      this.insertPoint.x + this.displaceX + 345,
      this.insertPoint.y + this.displaceY + 900
    );
    textSize(25);
    text(
      this.power,
      this.insertPoint.x + this.displaceX + 375,
      this.insertPoint.y + this.displaceY + 880
    );
    pop();
    //*SciNotation END
    */

    push();
    textSize(25);
    text(
      "C",
      this.insertPoint.x + this.displaceX + 77,
      this.insertPoint.y + this.displaceY + 760
    );

    text(
      "S",
      this.insertPoint.x + this.displaceX + 77,
      this.insertPoint.y + this.displaceY + 810
    );
    text(
      "2",
      this.insertPoint.x + this.displaceX + 490,
      this.insertPoint.y + this.displaceY + 880
    );
    pop();

    //** ScaleGeo
    push();
    textSize(35);
    text(
      "ScaleGeo",
      this.insertPoint.x + this.displaceX + 50,
      this.insertPoint.y + this.displaceY + 1100
    );
    pop();
  }
}
