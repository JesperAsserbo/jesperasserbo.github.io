class Output {
  constructor() {
    this.insertPoint = new p5.Vector(400, 1550);

    this.displaceX = 0;
    this.displaceY = 0;

    this.fck = 0;
    this.fcd = 0;

    this.fyk = 0;
    this.fyd = 0;
  }

  OutputUpdate() {
    this.displaceY = geometry.h;
    this.displaceX = geometry.b;
  }

  Display() {
    push();
    textSize(50);
    //text("OutputData", this.insertPoint.x, this.insertPoint.y + this.displaceY);
    text("Calculation", this.insertPoint.x+ this.displaceX+450, this.insertPoint.y-550 );
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
}
