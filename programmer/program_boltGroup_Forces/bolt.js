class Bolt {
  constructor(posX, posY, id) {
    this.insertPoint = graph.insertPoint;
    this.pos_o = new p5.Vector(posX, posY);
    this.pos_o_scaled = p5.Vector.add(this.insertPoint, this.pos_o);
    this.pos_o_scaledGraph = p5.Vector.add(this.pos_o_scaled, this.insertPoint);

    this.pos_o_calc = new p5.Vector(posX, posY);

    this.r_Tp_Vector = new p5.Vector(0, 0); //** Calculated in calc
    this.r_Tp = 0;
    this.r2_Tp = 0;
    //this.Force = new p5.Vector(0, 0);
    this.id = id;

    //** Scaled so Graph is showed correct
    this.F_Mz_Vector = new p5.Vector(0, 0);
    this.F_x_Vector = new p5.Vector(0, 0);
    this.F_y_Vector = new p5.Vector(0, 0);

    this.F_res_Vector = new p5.Vector(0, 0);
    this.F_Res_Vector = new p5.Vector(0, 0);

    this.F_Mz = 0;
    this.F_x = 0;
    this.F_y = 0;

    //** Not scaled ** Vector
    this.F_res = new p5.Vector(0, 0);

    //**
    this.d = 16;
    this.do = this.d + 2;
    this.fub = 360;
    this.As = 157;
    this.A = 116;
    this.A_shearPlane = 116;
    this.av = 0.5; //** ShearPlane
    this.shearPlane = 0; //** se buttonChoice

    //** Test and set variable if overlap
    this.overlapAnotherBoltCenter = false;
    this.overlapEdge = false;

    this.pointsOnEdge = []; //** Object pointsOnEdge[i].x
  }

  Update() {
    //this.d = buttonRollor_d.ReadValue();
    this.d = buttonChoiceLibBoltSize.GetValue(3);
    this.fub = buttonChoiceLibBoltStrength.GetValue(1);
    this.As = buttonChoiceLibBoltSize.GetValue(1);
    this.A = buttonChoiceLibBoltSize.GetValue(2);
    this.A_shearPlane = this.As;
    
    this.do = this.d + buttonRollor_dt.ReadValue();
    this.shearPlane = buttonChoiceLibShearPlane.GetValue(1);

    //** determine A_shearPlane and av
    if (this.shearPlane == 0) this.av = buttonChoiceLibBoltStrength.GetValue(3);
    else if (this.shearPlane == 1)
      this.av = buttonChoiceLibBoltStrength.GetValue(4);
    else if (this.shearPlane == 2){
      this.av = buttonChoiceLibBoltStrength.GetValue(5);
      this.A_shearPlane = this.A
    }
    //this.av =

    this.insertPoint = graph.insertPoint;
    this.pos_o_scaled = p5.Vector.mult(this.pos_o, 10);
    this.pos_o_scaledGraph = p5.Vector.add(this.pos_o_scaled, this.insertPoint);

    //** pos for calculation
    this.pos_o_calc = p5.Vector.mult(this.pos_o_scaled, 1 / scaleGeo);

    this.r2_Tp = pow(this.r_Tp, 2);

    //** Vector
    let r_hat = new p5.Vector(-this.r_Tp_Vector.y, this.r_Tp_Vector.x);
    this.F_Mz_Vector_Unit = p5.Vector.normalize(r_hat);
    this.F_Mz_Vector = p5.Vector.mult(this.F_Mz_Vector_Unit, this.F_Mz);

    this.F_x_Vector = new p5.Vector(this.F_Px, 0);
    this.F_y_Vector = new p5.Vector(0, this.F_Py);

    this.F_res_Pxy_Vector = p5.Vector.add(this.F_x_Vector, this.F_y_Vector);
    this.F_Res_Vector = p5.Vector.add(this.F_Mz_Vector, this.F_res_Pxy_Vector);

    //**Not scaled
    this.F_Res = new p5.Vector(0, 0);

    //**
  }

  DisplayForce() {
    push();
    strokeWeight(5);
    //translate(this.pos_o_scaledGraph.x, this.pos_o_scaledGraph.y);
    translate(this.pos_o_scaledGraph.x, this.pos_o_scaledGraph.y);
    line(0, 0, this.F_Res_Vector.x, this.F_Res_Vector.y);

    if (this.F_Res_Vector.mag() > 0) this.DisplayForceArrow(this.F_Res_Vector);

    strokeWeight(2);
    stroke(0, 255, 0);
    line(0, 0, this.F_Mz_Vector.x, this.F_Mz_Vector.y);
    translate(this.F_Mz_Vector.x, this.F_Mz_Vector.y);
    stroke(255, 0, 0);
    line(0, 0, this.F_x_Vector.x, this.F_x_Vector.y);
    translate(this.F_x_Vector.x, this.F_x_Vector.y);
    stroke(0, 0, 255);
    line(0, 0, this.F_y_Vector.x, this.F_y_Vector.y);
    strokeWeight(3);

    pop();
  }

  DisplayForceArrow(pos) {
    push();
    fill(0);
    let dir = pos.heading();
    translate(pos.x, pos.y);
    rotate(PI / 2 + dir);
    triangle(0, 0, -6, 20, 6, 20);
    pop();
  }

  //** call to class instance DistEdgeBolt
  DrawDistBolts() {
    //console.log(this.pos_o_scaledGraph.x)
    distEdgeBolt.DrawDistSteelBoltsCalc(
      this.pos_o_scaledGraph,
      this.F_Res_Vector,
      this.overlapAnotherBoltCenter
    );
    distEdgeBolt.Update(this.do);
  }

  //** call to class instance DistEdgeBolt
  DrawDistEdges() {
    distEdgeBolt.DrawDistSteelEdgesCalc(
      this.pos_o_scaledGraph,
      this.F_Res_Vector,
      this.overlapEdge
    );
    distEdgeBolt.Update(this.do);
  }

  Display() {
    push();

        noFill();
    fill(255,100)
    circle(
      this.pos_o_scaledGraph.x,
      this.pos_o_scaledGraph.y,
      this.do * scaleGeo
    );
    
    fill(100, 100, 100, 150);
    //circle(this.pos_o.x, this.pos_o.y, 20);
    //circle(this.pos_o_scaled.x, this.pos_o_scaled.y, 20);
    circle(
      this.pos_o_scaledGraph.x,
      this.pos_o_scaledGraph.y,
      this.d * scaleGeo
    );

    fill(0);
    circle(this.pos_o_scaledGraph.x, this.pos_o_scaledGraph.y, 10);

    textSize(25);
    textAlign(LEFT, CENTER);
    stroke(0);
    fill(0);
    text(this.id, this.pos_o_scaledGraph.x + 20, this.pos_o_scaledGraph.y);
    pop();
  }

  OverlapBolt(pos) {
    //** Check for overlap
    let distToBolt = dist(
      pos.x,
      pos.y,
      this.pos_o_scaledGraph.x,
      this.pos_o_scaledGraph.y
    );
    if (distToBolt < 25) {
      return true;
    } else {
      return false;
    }
  }
}
