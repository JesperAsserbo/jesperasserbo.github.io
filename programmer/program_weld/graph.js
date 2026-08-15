class Graph {
  constructor() {
    this.insertPoint = new p5.Vector(1500, 2050);
    this.array = [];
  }

  CalcValues() {
    let K = calc.sigma_eff_Limit;
    for (let i = 0; i < 25; i++) {
      let tau = i * 10;

      let sigma = pow(pow(K, 2) - 3 * pow(tau, 2), 0.5);
      //console.log(i + " " + sigma);

      //** if negative sqr => break;
      if (!isNaN(sigma)) {
        this.array.push([tau, -sigma]);
      } else break;

      //** Fin inddeling
      if (tau >= 180) {
        for (let j = 0; j < 10; j++) {
          tau = i * 10 + j * 1;
          sigma = pow(pow(K, 2) - 3 * pow(tau, 2), 0.5);
          //console.log(i + " " + sigma);

          //** if negative sqr => break;
          if (!isNaN(sigma)) {
            this.array.push([tau, -sigma]);
          } else break;
        }
        this.array.pop(); //** Delete last NaN element
      }
    }
    this.array.pop(); //** Delete last NaN element
    //console.log(this.array.length);

    //** Last element on x-axis
    this.array.push([K / pow(3, 0.5), 0]);
  }

  Axis() {
    push();
    //circle(this.insertPoint.x, this.insertPoint.y, 50);
    translate(this.insertPoint.x, this.insertPoint.y);

    strokeWeight(3);
    line(0, 10, 0, -450);
    line(-10, 0, 300, 0);

    fill(0);
    triangle(0, -450, -5, -430, 5, -430);
    triangle(300,0,280,-5,280,5)
    
    //** Text
    textSize(30);
    textAlign(LEFT, CENTER);
    text("\u03c3", 0, -475);
    text("\u03c4", 325, 10);
        
    //** sigma perpendicular
    translate(-180,-525);
    strokeWeight(2)
    line(200, 70, 200 + 16, 70); //** 16
    line(200 + 8, 70, 200 + 8, 58); //** 12
    pop();
  }

  Display() {
    this.CalcValues();
    this.Axis();

    push();
    //circle(this.insertPoint.x, this.insertPoint.y, 50);
    translate(this.insertPoint.x, this.insertPoint.y);
    strokeWeight(1);
    for (let i = 0; i < this.array.length - 1; i++) {
      let start_x = this.array[i][0];
      let start_y = this.array[i][1];
      let end_x = this.array[i + 1][0];
      let end_y = this.array[i + 1][1];

      line(start_x, start_y, end_x, end_y);
      //circle(this.array[i][0], this.array[i][1], 2);
    }
    fill(255, 0, 0, 100);
    if (calc.sigma_eff < calc.sigma_eff_Limit) fill(0, 255, 0, 200);

    let point_eff_x = pow(
      pow(calc.tau_perpendic, 2) + pow(calc.tau_parallel, 2),
      0.5
    );
    let point_eff_y = -calc.sigma_Res;

    //console.log(point_eff_x )

    noStroke();
    circle(point_eff_x, point_eff_y, 20);
    stroke(0);
    fill(0);
    circle(point_eff_x, point_eff_y, 5);

    pop();

    this.array = [];
  }
}
