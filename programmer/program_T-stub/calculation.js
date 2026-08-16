class Calculation {
  constructor() {
    //** Bolt
    this.FtRd_single = 0;
    this.FtRd_sum = 0;
    this.As = 1;
    this.n = 1;
    this.fub = 1;

    //** Plade
    this.mplRd = 0;
    this.Mplud = 0;
    this.b = 100;
    this.t = 1;
    this.fyk = 1;
    this.a1 = 1;
    this.a2 = 1;
    this.bf = 100;

    //** Calc
    this.beta = 1;
    this.lambda = 1;
    this.failiureMode = 0;

    //** Graph
    this.xValue = 1;
    this.yValue = 1;

    this.xLimitMode_1 = 1;
    this.yLimitMode_1 = 1;

    this.xLimitMode_2 = 1;
    this.yLimitMode_2 = 1;
    
    
    this.x2 = this.a1 + this.a2;
    this.x1 = this.a1;
    this.x0 = 0;

    this.insertPointFailuremode = new p5.Vector(800, 2000);
  }

  UpdateValues() {
    //** Bolt
    this.As = buttonChoiceLibBoltStrength.GetValue(1);
    this.n = buttonChoiceLibBoltCount.GetValue(1);
    this.fub = buttonChoiceLibBoltSize.GetValue(1);

    //** Plade
    this.fyk = buttonChoiceLibPlateStrength.GetValue(1);
    if (this.t > 63) {
      buttonRollor_t.SetValue(63);
      this.fyk = buttonChoiceLibPlateStrength.GetValue(3);
    } else if (this.t > 40) {
      this.fyk = buttonChoiceLibPlateStrength.GetValue(3);
    } else if (this.t > 16) {
      this.fyk = buttonChoiceLibPlateStrength.GetValue(2);
    }
    this.t = buttonRollor_t.ReadValue();
    this.b = buttonRollor_b.ReadValue();

    //**Geometri
    this.a1 = buttonRollor_a1.ReadValue();
    this.bf = buttonRollor_bf.ReadValue();

    //** Limit
    //**1
    this.a2 = min(1.25 * this.a1, this.bf - this.a1);
    //**2
    let bfLimit = this.a1 + 1 * buttonChoiceLibBoltSize.GetValue(2);
    if (this.bf <= bfLimit) buttonRollor_bf.SetValue(bfLimit);
    if (this.a1 <= 1.0 * buttonChoiceLibBoltSize.GetValue(2))
      buttonRollor_a1.SetValue(1.0 * buttonChoiceLibBoltSize.GetValue(2));
  }

  Bolt() {
    this.FtRd_single = (0.9 * this.fub * this.As) / 1.35;
    this.FtRd_sum = this.n * this.FtRd_single;
  }

  Plade() {
    this.mplud = (((1 / 4) * this.fyk) / 1.1) * pow(this.t, 2);
    this.Mplud = (this.mplud * this.b) / 1000;
  }

  FailiureMode() {
    this.lambda = this.a2 / this.a1;
    //this.lambda = min(1,this.a2 / this.a1); //****************************************************
    //this.a2 = this.lambda * this.a1 //*****************************************************

    this.beta = (4 * (this.Mplud * 1000)) / this.a1 / this.FtRd_sum;

    //** < Mode_1 (Flydning i plade)
    this.xLimitMode_1 = (2 * this.lambda) / (1 + 2 * this.lambda);
    this.yLimitMode_1 = this.xLimitMode_1 * this.FtRd_sum;
    this.Fu_1 = this.yLimitMode_1 / 1000;

    //** < Mode_2 (Flydning i plade og bolte)
    this.xLimitMode_2 = 2;
    this.yLimitMode_2 = this.FtRd_sum;
    this.Fu_2 = this.yLimitMode_2 / 1000;

    //** < mode_3 (Flydning i bolte)
    this.Fu_3 = this.FtRd_sum / 1000;

    //** Failure Mode
    this.xValue = this.beta;
    this.yValue = 1;

    this.x2 = this.a1 + this.a2;
    this.x1 = this.a1;
    this.x0 = 0;

    if (this.beta > this.xLimitMode_2) {
      this.yValue = this.Fu_3;
      this.failiureMode = 3;
      this.Fc_3 = 0;
      this.Ft_3 = 0.5 * this.Fu_3;
      this.y2 = 25;
      this.y1 = 25;
      this.y0 = 25;
      //console.log("Failiure Mode 3: " + this.yValue);
    } else if (this.beta > this.xLimitMode_1) {
      this.yValue =
        (this.beta * (1 / (2 + 2 * this.lambda)) +
          this.lambda / (1 + this.lambda)) *
        this.Fu_3;
      this.Fu_2 = this.yValue;
      this.Fc_2 = ((this.Fu_2 / 2) * this.a1 - this.Mplud) / this.a2;
      this.Ft_2 = 0.5 * this.Fu_2 + this.Fc_2;
      this.failiureMode = 2;
      this.y2 = 0;
      this.y1 = (25 * this.a2) / (this.a1 + this.a2);
      this.y0 = 25;
      //console.log("Failiure Mode 2: " + this.yValue);
    } else {
      this.yValue = (this.beta * this.FtRd_sum) / 1000;

      this.failiureMode = 1;
      this.Fu_1 = (4 * this.Mplud) / this.a1;
      this.Fc_1 = (0.5 * (2 * this.Mplud)) / this.a2;
      this.Ft_1 = 0.5 * this.Fu_1 + this.Fc_1;
      this.y2 = 0;
      this.y1 = 0;
      this.y0 = 25;
      //console.log("Failiure Mode 1: " + this.yValue + " beta: " + this.beta);
    }
  }

  FailureModeDisplay() {
    this.scaleX = 2;

    push();
    translate(this.insertPointFailuremode.x, this.insertPointFailuremode.y);
    scale(this.scaleX);

    //** Failiure mode
    strokeWeight(1);
    line(-(this.a1 + this.a2) - 50, 0, this.a1 + this.a2 + 50, 0);

    //** Static model Failiure Mode - arrows
    strokeWeight(5);
    line(-(this.a1 + this.a2), -this.y2, -this.a1, -this.y1);
    line(-this.a1, -this.y1, 0, -this.y0);
    line(0, -this.y0, 0, -this.y0 - 25);
    line(this.a1, -this.y1, 0, -this.y0);
    line(this.a1 + this.a2, -this.y2, this.a1, -this.y1);

    //** Failiure Mode 1
    strokeWeight(1);
    textAlign(LEFT, CENTER);
    textSize(20);
    text("Failiure Mode", 25, -175);
    circle(0, -175, 20);
    textAlign(CENTER, CENTER);

    strokeWeight(3);
    fill(0);
    stroke(0, 0, 255);
    line(-this.x1, 25, -this.x1, 65); //** Left
    line(0, -65, 0, -115); //** Center Fu
    line(this.x1, 25, this.x1, 65); //** Rigth
    triangle(-this.x1 - 3, 65, -this.x1 + 3, 65, -this.x1, 70); //** Left
    triangle(-3, -115, 3, -115, 0, -120); //** Center Fu
    triangle(this.x1 - 3, 65, this.x1 + 3, 65, this.x1, 70); //** Rigth
    textSize(15);
    noStroke();

    if (this.failiureMode == 1) {
      text("1", 0, -175 + 1); //** Failiure mode
      text(nf(this.Fc_1, 0, 1), -this.x2, -this.y2 + 65);
      text(nf(this.Ft_1, 0, 1), -this.a1, -this.y2 + 87);
      text(nf(this.Fu_1, 0, 1), 0, -this.y2 - 135);
      text(nf(this.Ft_1, 0, 1), this.a1, -this.y2 + 87);
      text(nf(this.Fc_1, 0, 1), this.x2, -this.y2 + 65);

      stroke(0);
      circle(-this.x1, -this.y1, 8);
      circle(0, -this.y0, 8);
      circle(this.x1, -this.y1, 8);

      stroke(255, 0, 0);
      line(-this.x2, 25, -this.x2, 50);
      line(this.x2, 25, this.x2, 50);
      triangle(-this.x2 - 3, 25, -this.x2 + 3, 25, -this.x2, 20);
      triangle(this.x2 - 3, 25, this.x2 + 3, 25, this.x2, 20);
    }

    if (this.failiureMode == 2) {
      text("2", 0, -175 + 1); //** Failiure mode
      text(nf(this.Fc_2, 0, 1), -this.x2, -this.y2 + 65);
      text(nf(this.Ft_2, 0, 1), -this.a1, -this.y2 + 87);
      text(nf(this.Fu_2, 0, 1), 0, -this.y2 - 135);
      text(nf(this.Ft_2, 0, 1), this.a1, -this.y2 + 87);
      text(nf(this.Fc_2, 0, 1), this.x2, -this.y2 + 65);

      stroke(0);
      circle(0, -this.y0, 8);

      stroke(255, 0, 0);
      line(-this.x2, 25, -this.x2, 50);
      line(this.x2, 25, this.x2, 50);
      triangle(-this.x2 - 3, 25, -this.x2 + 3, 25, -this.x2, 20);
      triangle(this.x2 - 3, 25, this.x2 + 3, 25, this.x2, 20);
    }

    if (this.failiureMode == 3) {
      text("3", 0, -175 + 1); //** Failiure mode
      text(nf(this.Ft_3, 0, 1), -this.a1, 87);
      text(nf(this.Fu_3, 0, 1), 0, -135);
      text(nf(this.Ft_3, 0, 1), this.a1, 87);
    }

    pop();

    //** Mesure Lines ***************************
    push();
    translate(this.insertPointFailuremode.x, this.insertPointFailuremode.y);
    scale(this.scaleX);
    strokeWeight(0.5);
    textAlign(CENTER);
    text("a", -0.5 * this.a1, 125 - 3);
    text("a", -this.a1 - 0.5 * this.a2, 125 - 3);

    textSize(9);
    text("1", -0.5 * this.a1 + 5, 125 - 1);
    text("2", -this.a1 - 0.5 * this.a2 + 6, 125 - 1);

    //** a1 & a2
    line(5, 125, -this.a1 - this.a2 - 5, 125);
    line(0, -25, 0, 125 + 3);
    line(-this.a1, 125 + 3, -this.a1, 95 + 3); //**a1
    line(-this.a1 - this.a2, 75 + 3, -this.a1 - this.a2, 125 + 3); //**a2

    pop();
  }

  Graph() {
    this.insertPoint = new p5.Vector(1300, 2000);
    this.scaleX = 2;
    this.scaleY = 1;

    //** Graph
    push();
    translate(this.insertPoint.x, this.insertPoint.y);
    strokeWeight(2);
    let endX = this.scaleX * 3 * 100 + 50;
    let endY = (this.scaleY * this.yLimitMode_2) / 1000 + 50;

    fill(0);
    line(-5, 0, endX, 0); //** X-axis
    triangle(endX, 8, endX + 20, 0, endX, -8); // X-axis Arrow
    line(0, 5, 0, -endY); //** Y-axis
    triangle(-8, -endY, 8, -endY, 0, -endY - 20); // Y-axis Arrow

    textAlign(CENTER, CENTER);
    textSize(30);
    text("Fu [kN]", 0, -endY - 50);
    pop();

    //** Result lines
    let mode1_x = this.scaleX * this.xLimitMode_1 * 100;
    let mode1_y = (-this.scaleY * this.yLimitMode_1) / 1000;

    let mode2_x = this.scaleX * this.xLimitMode_2 * 100;
    let mode2_y = (-this.scaleY * this.yLimitMode_2) / 1000;
    push();
    translate(this.insertPoint.x, this.insertPoint.y);
    line(0, 0, mode1_x, mode1_y);
    line(mode1_x, mode1_y, mode2_x, mode2_y);
    line(
      this.scaleX * this.xLimitMode_2 * 100,
      (-this.scaleY * this.yLimitMode_2) / 1000,
      this.scaleX * 3 * 100,
      (-this.scaleY * this.yLimitMode_2) / 1000
    );

    //** Lines Value Y (Fu)
    line(
      -5,
      -this.scaleY * this.yValue,
      this.scaleX * this.xValue * 100 - 15,
      -this.scaleY * this.yValue
    ); //** horisontal

    //** Value Y (Fu)

    textAlign(RIGHT, CENTER);
    textSize(25);
    text(nf(this.yValue, 0, 1), -15, -this.scaleY * this.yValue); //** Fu
    textAlign(CENTER, CENTER);
    text(nf(this.xValue, 0, 2), this.scaleX * this.xValue * 100, 20); //** Beta
    line(
      this.scaleX * this.xValue * 100,
      5,
      this.scaleX * this.xValue * 100,
      -this.scaleY * this.yValue + 15
    ); //** Vertikal
    fill(255, 0, 0, 200);
    circle(this.scaleX * this.xValue * 100, -this.scaleY * this.yValue, 15);
    // console.log( this.xValue)
    pop();

    //** Failiure mode

    push();
    fill(0);
    translate(this.insertPoint.x, this.insertPoint.y);
    line(-5, 50, endX - 50, 50);
    line(mode1_x, 60, mode1_x, mode1_y + 15);
    circle(mode1_x, mode1_y, 4);
    line(mode2_x, 60, mode2_x, mode2_y + 15);
    circle(mode2_x, mode2_y, 4);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(25);

    circle(0.5 * mode1_x, 50, 40);
    circle(mode1_x + 0.5 * (mode2_x - mode1_x), 50, 40);
    circle(this.scaleX * 2 * 100 + 100, 50, 40);

    fill(0);
    text("1", 0.5 * mode1_x, 50 + 2.5);
    text("2", mode1_x + 0.5 * (mode2_x - mode1_x), 50 + 2.5);
    text("3", this.scaleX * 2 * 100 + 100, 50 + 2.5);
    pop();
  }
}
