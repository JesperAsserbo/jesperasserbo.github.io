class Figure {
  constructor(posX, posY) {
    this.posFigure = new p5.Vector(posX, posY);
    this.posFigurePlan = new p5.Vector(posX, posY + 300);
    this.t = 1;
    this.b = 1;
    this.a1 = 1;
    this.a2 = 1;

    this.scaleFig = 2; //** 
  }

  Update() {
    this.t = buttonRollor_t.ReadValue();
    this.b = buttonRollor_b.ReadValue();

    //**Geometri
    this.a1 = buttonRollor_a1.ReadValue();
    this.bf = buttonRollor_bf.ReadValue();
    this.a2 = min(1.25 * this.a1, this.bf - this.a1);
  }

  Display() {
    let hm = buttonChoiceLibBoltSize.GetValue(4); //** hm - Heigth møtrik
    let dm = buttonChoiceLibBoltSize.GetValue(3); //** dm - Diameter møtrik (e hjørnemål)
    let db = buttonChoiceLibBoltSize.GetValue(2); //** dm - Diameter bolt
    let fyb = buttonChoiceLibBoltStrength.GetValue(2); //** fyb - bolt kvalitet flydspænding (240-900)
    let fyk_p = buttonChoiceLibPlateStrength.GetValue(1); //** fyk - Plade kvalitet (235-450)
    let L = 2 * (this.t + hm + 5);

    //** Arrow Force
    push();
    translate(this.posFigure.x, this.posFigure.y);

    scale(this.scaleFig);
    stroke(150);
    strokeWeight(5);
    line(0, -(this.t + 65), 0, -(this.t + 120)); //** Upper
    line(0, this.t + 65, 0, this.t + 120); //** Lower

    fill(150);
    triangle(
      -5,
      -(this.t + 65 + 40),
      5,
      -(this.t + 65 + 40),
      0,
      -(this.t + 120)
    ); //** Upper
    triangle(-5, this.t + 65 + 40, 5, this.t + 65 + 40, 0, this.t + 120); //** Lower

    textSize(20);
    noStroke();
    fill(0);
    text("Fu", 20, -(this.t + 120) + 15); //** Upper
    text("Fu", 20, this.t + 120 - 0); //** Lower
    pop();

    push();
    translate(this.posFigure.x, this.posFigure.y);
    scale(this.scaleFig);
    strokeWeight(1);

    //** Left Bolt
    fill(100 + (100 * (fyb - 240)) / fyb);
    rect(-(this.a1 + 0.5 * db), -0.5 * L, db, L); //** Bolt
    fill(120 + (100 * (fyb - 240)) / fyb);
    rect(-(this.a1 + 0.5 * dm), -0.5 * L + 5, dm, 2 * hm + 2 * this.t); //** Møtrik

    //** Rigth Bolt
    fill(100 + (100 * (fyb - 240)) / fyb);
    rect(this.a1 - 0.5 * db, -0.5 * L, db, L); //** Bolt
    fill(120 + (100 * (fyb - 240)) / fyb);
    rect(this.a1 - 0.5 * dm, -0.5 * L + 5, dm, 2 * hm + 2 * this.t); //** Møtrik

    //** Plate Fu
    fill(150 + (100 * (fyk_p - 235)) / fyk_p);
    strokeWeight(1);
    stroke(0);
    rect(-5, -this.t - 50, 10, 2 * this.t + 100);

    //** Plate fu svejsesøm
    fill(0);
    triangle(-5, -this.t, -12, -this.t, -5, -this.t - 7); //** Left top
    triangle(5, -this.t, 12, -this.t, 5, -this.t - 7); //** Rigth Top
    triangle(-5, this.t, -12, this.t, -5, this.t + 7); //** Left bottom
    triangle(5, this.t, 12, this.t, 5, this.t + 7); //** Rigth Bottom

    //** Plade
    strokeWeight(1);
    stroke(0);
    fill(150 + (100 * (fyk_p - 235)) / fyk_p);
    rect(-this.bf, -this.t, 2 * this.bf, this.t);
    rect(-this.bf, 0, 2 * this.bf, this.t);

    //** Left Bolt lines in plate
    strokeWeight(0.25);
    line(
      -(this.a1 + 0.5 * db),
      -0.5 * L + 5,
      -(this.a1 + 0.5 * db),
      0.5 * L - 5
    );
    line(
      -(this.a1 - 0.5 * db),
      -0.5 * L + 5,
      -(this.a1 - 0.5 * db),
      0.5 * L - 5
    );

    //** Rigth Bolt lines in plate
    strokeWeight(0.25);
    line(this.a1 - 0.5 * db, -0.5 * L + 5, this.a1 - 0.5 * db, 0.5 * L - 5);
    line(this.a1 + 0.5 * db, -0.5 * L + 5, this.a1 + 0.5 * db, 0.5 * L - 5);

    strokeWeight(0.5);
    line(-this.a1, -0.5 * L - 10, -this.a1, 0.5 * L + 10); //** Left mesure line a1
    line(this.a1, -0.5 * L - 10, this.a1, 0.5 * L + 10); //** Rigth mesure line a1

    //** Center line
    line(0, -this.t - 75, 0, this.t + 130 + 3);
    pop();

    //** Mesure Lines ***************************
    push();
    translate(this.posFigure.x, this.posFigure.y);
    scale(this.scaleFig);
    strokeWeight(0.5);
    textAlign(CENTER);
    text("b", -0.5 * this.bf, this.t + 100 - 3);
    text("a", -0.5 * this.a1, this.t + 75 - 3);
    text("a", -this.a1 - 0.5 * this.a2, this.t + 75 - 3);
    text("t", -this.bf-25-10, 0.5*this.t+4 );

    textSize(9);
    text("f", -0.5 * this.bf + 6, this.t + 100 - 1);
    text("1", -0.5 * this.a1 + 5, this.t + 75 - 1);
    text("2", -this.a1 - 0.5 * this.a2 + 6, this.t + 75 - 1);

    //** bf
    line(5, this.t + 100, -this.bf - 5, this.t + 100);
    line(-this.bf, this.t + 3, -this.bf, this.t + 100 + 3);

    //** a1 & a2
    line(5, this.t + 75, -this.a1 - this.a2 - 5, this.t + 75);
    line(-this.a1, this.t + hm + 15 + 3, -this.a1, this.t + 75 + 3); //**a1
    line(-this.a1 - this.a2, this.t + 3, -this.a1 - this.a2, this.t + 75 + 3); //**a2
    
    //** t
    line(-this.bf-25-3,0,-this.bf-3,0);
    line(-this.bf-25-3,this.t,-this.bf-3,this.t);
    line(-this.bf-25,-3,-this.bf-25,this.t+3);
    pop();

    //**********************************************
    //**************** Figure Plan *****************
    //**********************************************

    push();
    translate(this.posFigurePlan.x, this.posFigurePlan.y + 2 * this.t);
    scale(this.scaleFig);
    noStroke();
    fill(150 + (100 * (fyk_p - 235)) / fyk_p);

    //** Plate
    rect(-this.bf, 0, 2 * this.bf, this.b); //** Left side
    //rect(5, 0, this.bf - 5, this.b); //** Rigth side

    //** Weld
    fill(0, 0, 0, 100);
    rect(-12, 0, 7, this.b);
    rect(5, 0, 7, this.b);

    strokeWeight(1);
    stroke(0);
    line(-this.bf, 0, -this.bf, this.b);
    line(-5, 0, -5, this.b);
    line(5, 0, 5, this.b);
    line(this.bf, 0, this.bf, this.b);

    //** Mesure Line
    strokeWeight(0.5);
    line(-this.bf - 25 - 3, 0, -this.bf - 3, 0);
    line(-this.bf - 25 - 3, this.b, -this.bf - 3, this.b);
    line(-this.bf - 25, -3, -this.bf - 25, this.b + 3);

    noStroke();
    textSize(15);
    textAlign(CENTER,CENTER)
    fill(0)
    text("L",-this.bf-40,0.5*this.b)
    
    stroke(0);
    strokeWeight(1);
    //** Bolts
    this.BoltPlanDisplay(-this.a1, 0.5 * this.b, dm, db, fyb);
    this.BoltPlanDisplay(this.a1, 0.5 * this.b, dm, db, fyb);

    pop();
  }

  BoltPlanDisplay(posX, posY, dm, db, fyb) {
    push();
    translate(posX, posY);
    fill(120 + (100 * (fyb - 240)) / fyb);
    angleMode(DEGREES);
    beginShape();
    vertex(0.5 * dm, 0);
    vertex(0.5 * dm * cos(-60), 0.5 * dm * sin(-60));
    vertex(0.5 * dm * cos(-120), 0.5 * dm * sin(-120));
    vertex(-0.5 * dm, 0);
    vertex(0.5 * dm * cos(120), -0.5 * dm * sin(-120));
    vertex(0.5 * dm * cos(60), -0.5 * dm * sin(-120));
    vertex(0.5 * dm, 0);
    endShape();

    fill(100 + (100 * (fyb - 240)) / fyb);
    circle(0, 0, db);
    pop();
  }
}
