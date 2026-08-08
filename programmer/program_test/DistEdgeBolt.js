class DistEdgeBolt {
  constructor() {
    //** Steel bolts
    this.do_steel = 10;
    this.colorLimitBolt = [0, 0, 255, 255];
    this.colorLimitEdge = [0, 255, 0, 255];
    this.colorLimitFailiure = [255, 0, 0, 255];

    this.edge_abk1 = 0;
    this.bolt_abk1 = 0;

    //this.do = 10;

    //** Absolutte mindste afstande
    /*
    this.e1_steel = 1.20 * this.do; //** Edge
    this.e2_steel = 1.20 * this.do; //** Edge

    this.p1_steel = 2.20 * this.do; //** Bolt
    this.p2_steel = 2.40 * this.do; //** Bolt
    */

    //** Gængse mindste afstande (svarer til Stabi)
    this.e1_steel = 2.25 * this.do; //** Edge
    this.e2_steel = 1.5 * this.do; //** Edge

    this.p1_steel = 3.0 * this.do; //** Bolt
    this.p2_steel = 3.0 * this.do; //** Bolt

    //** Optimale mindste afstande
    /*
    this.e1_steel = 3.00 * this.do; //** Edge
    this.e2_steel = 1.50 * this.do; //** Edge

    this.p1_steel = 3.75 * this.do; //** Bolt
    this.p2_steel = 3.00 * this.do; //** Bolt
    */

    //** Timber screws
    this.do_timber_srew;
  }

  Update(d_o) {
    //** EdgeDist
    this.e1_steel = buttonRollor_e1.ReadValue() * d_o; //** Edge
    this.e2_steel = buttonRollor_e2.ReadValue() * d_o; //** Edge

    this.edge_ab = this.e1_steel / (3 * d_o);
    this.edge_k1 = (2.8 * this.e2_steel) / d_o - 1.7;
    this.edge_abk1 = this.edge_ab * this.edge_k1;

    //** BoltDist
    this.p1_steel = buttonRollor_p1.ReadValue() * d_o; //** Edge
    this.p2_steel = buttonRollor_p2.ReadValue() * d_o; //** Edge

    this.bolt_ab = this.p1_steel / (3 * d_o) - 0.25;
    this.bolt_k1 = (1.4 * this.p2_steel) / d_o - 1.7;
    this.bolt_abk1 = this.bolt_ab * this.bolt_k1;

    this.fub_fu = boltGroup[0].fub / plate.fu;
    this.ab_min = min(this.edge_ab, this.bolt_ab, this.fub_fu, 1.0);
    this.k1_min = min(this.edge_k1, this.bolt_k1, 2.5);

    //** If only one bolt
    if (boltGroup.length < 2) {
      // this.ab_min = this.edge_ab;
      // this.k1_min = this.edge_k1;

      this.ab_min = min(this.edge_ab, this.fub_fu, 1.0);
      this.k1_min = min(this.edge_k1, this.bolt_k1, 1.5);
    }
    //console.log(this.k1_min)
  }

  //** called from Bolt()
  DrawDistSteelBoltsCalc(pos, forceVector, overlapAnotherBoltCenter) {
    if (boltGroup.length < 2) return;
    push();
    noFill();
    let L_edge = 2 * this.e1_steel;
    let H_edge = 2 * this.e2_steel;

    let L_bolt = 2 * this.p1_steel;
    let H_bolt = 2 * this.p2_steel;
    let dir = forceVector.heading();

    translate(pos.x, pos.y);
    rotate(dir);
    translate(-pos.x, -pos.y);

    strokeWeight(1);
    stroke(this.colorLimitBolt);
    fill(0, 0, 255, 20);
    if (overlapAnotherBoltCenter) {
      stroke(this.colorLimitFailiure);
      fill(255, 0, 0, 20);
    }
    if (button_Limit_Bolt.state == 1)
      ellipse(pos.x, pos.y, L_bolt * scaleGeo, H_bolt * scaleGeo);

    /*
    strokeWeight(2);
    stroke(this.colorLimitEdge);
    fill(255,0,0,20)
    if (button_Limit_Edge.state == 1)
      ellipse(pos.x, pos.y, L_edge * scaleGeo, H_edge * scaleGeo);
*/
    pop();
  }

  //** called from Bolt()
  DrawDistSteelEdgesCalc(pos, forceVector, overlapEdge) {
    push();
    noFill();
    let L_edge = 2 * this.e1_steel;
    let H_edge = 2 * this.e2_steel;

    let L_bolt = 2 * this.p1_steel;
    let H_bolt = 2 * this.p2_steel;
    let dir = forceVector.heading();

    translate(pos.x, pos.y);
    rotate(dir);
    translate(-pos.x, -pos.y);

    /*
    strokeWeight(2);
    stroke(this.colorLimitBolt);
    fill(0,0,255,20)
    if (button_Limit_Bolt.state == 1)
      ellipse(pos.x, pos.y, L_bolt * scaleGeo, H_bolt * scaleGeo);
      */

    strokeWeight(1);
    stroke(this.colorLimitEdge);
    fill(0, 255, 0, 20);
    if (overlapEdge) {
      stroke(this.colorLimitFailiure);
      fill(255, 0, 0, 20);
    }
    if (button_Limit_Edge.state == 1)
      ellipse(pos.x, pos.y, L_edge * scaleGeo, H_edge * scaleGeo);

    pop();
  }

  //** called from sketch
  TextBoltDist() {
    if (boltGroup.length < 2) return;
    let posInsert_x = 700;
    let posInsert_y = 1075;
    //** 0 ** box
    push();
    translate(posInsert_x, posInsert_y);
    stroke(this.colorLimitBolt);
    strokeWeight(2);
    noFill();
    rect(-10, -10, 950 + 20, 100 + 20);
    pop();

    //** 1
    push();
    translate(posInsert_x, posInsert_y);
    //circle(0,0,2);
    textSize(22);
    textAlign(LEFT, CENTER);
    //** e1
    text("1", 20, 40);
    text("o", 180, 40);
    //** e2
    text("2", 20, 90);
    text("o", 180, 90);
    pop();

    //** 2
    push();
    translate(posInsert_x, posInsert_y);
    textSize(30);

    //** e1
    textAlign(LEFT, CENTER);
    text("=", 210, 30);
    text("mm", 340, 30);

    textAlign(RIGHT, CENTER);
    text(nf(round(this.p1_steel, 1), 0, 1), 325, 30);

    //** e2
    textAlign(LEFT, CENTER);
    text("=", 210, 80);
    text("mm", 340, 80);

    textAlign(RIGHT, CENTER);
    text(nf(round(this.p2_steel, 1), 0, 1), 325, 80);

    pop();

    //** 3
    push();
    translate(posInsert_x, posInsert_y);

    //** e1
    textSize(30);
    textAlign(CENTER, CENTER);
    text("\u21D2", 440, 30);

    textAlign(LEFT, CENTER);
    text("\u03B1", 500, 30);

    text("=", 560, 30);
    text("p", 600, 20);
    text("/", 635, 30);
    text("3d   - 0.25  ", 645, 30);

    textSize(22);
    text("b,p", 520, 40);
    text("1", 620, 30);
    text("o", 680, 42);

    //** e2
    textSize(30);
    textAlign(CENTER, CENTER);
    text("\u21D2", 440, 80);

    textAlign(LEFT, CENTER);
    text("k", 500, 80);
    text("=", 560, 80);
    text("1.4", 600, 80);
    text("p", 650, 70);
    text("/", 685, 80);
    text("d   - 1.7", 695, 80);

    textSize(22);
    text("1,p", 520, 90);
    text("2", 670, 80);
    text("o", 715, 92);
    pop();

    //** 4
    push();
    translate(posInsert_x, posInsert_y);

    //** e1
    textSize(30);
    textAlign(LEFT, CENTER);
    text("=", 825, 30);
    textAlign(RIGHT, CENTER);
    text(nf(round(this.bolt_ab, 2), 0, 2), 950, 30);

    //** e2
    textSize(30);
    textAlign(LEFT, CENTER);
    text("=", 825, 80);
    textAlign(RIGHT, CENTER);
    text(nf(round(this.bolt_k1, 2), 0, 2), 950, 80);
    pop();

    /*
    //** 5
    push();
    translate(posInsert_x, posInsert_y);

    //** abk1
    textSize(30);
    textAlign(CENTER, CENTER);
    text("\u21D2", 1000, 50);
    textAlign(LEFT, CENTER);
    text("\u03B1", 1050, 50);
    text("k", 1085, 50);
    text("=", 1120, 50);

    text(nf(round(this.bolt_abk1, 2), 0, 2), 1160, 50);

    textSize(22);
    text("b", 1070, 60);
    text("1", 1100, 60);

    pop();
    */
  }

  //** called from sketch
  TextEdgeDist() {
    let posInsert_x = 700;
    let posInsert_y = 1225;

    //** 0 ** box
    push();
    translate(posInsert_x, posInsert_y);
    stroke(this.colorLimitEdge);
    strokeWeight(2);
    noFill();
    rect(-10, -10, 950 + 20, 100 + 20);
    pop();

    //** 1
    push();
    translate(posInsert_x, posInsert_y);
    //circle(0,0,2);
    textSize(22);
    textAlign(LEFT, CENTER);
    //** e1
    text("1", 20, 40);
    text("o", 180, 40);
    //** e2
    text("2", 20, 90);
    text("o", 180, 90);
    pop();

    //** 2
    push();
    translate(posInsert_x, posInsert_y);
    textSize(30);

    //** e1
    textAlign(LEFT, CENTER);
    text("=", 210, 30);
    text("mm", 340, 30);

    textAlign(RIGHT, CENTER);
    text(nf(round(this.e1_steel, 1), 0, 1), 325, 30);

    //** e2
    textAlign(LEFT, CENTER);
    text("=", 210, 80);
    text("mm", 340, 80);

    textAlign(RIGHT, CENTER);
    text(nf(round(this.e2_steel, 1), 0, 1), 325, 80);

    pop();

    //** 3
    push();
    translate(posInsert_x, posInsert_y);

    //** e1
    textSize(30);
    textAlign(CENTER, CENTER);
    text("\u21D2", 440, 30);

    textAlign(LEFT, CENTER);
    text("\u03B1", 500, 30);

    text("=", 560, 30);
    text("e", 600, 20);
    text("/", 635, 30);
    text("3d  ", 645, 35);

    textSize(22);
    text("b,e", 520, 40);
    text("1", 620, 30);
    text("o", 680, 42);

    //** e2
    textSize(30);
    textAlign(CENTER, CENTER);
    text("\u21D2", 440, 80);

    textAlign(LEFT, CENTER);
    text("k", 500, 80);
    text("=", 560, 80);
    text("2.8", 600, 80);
    text("e", 650, 70);
    text("/", 685, 80);
    text("d   - 1.7", 695, 80);

    textSize(22);
    text("1,e", 520, 90);
    text("2", 670, 80);
    text("o", 715, 92);
    pop();

    //** 4
    push();
    translate(posInsert_x, posInsert_y);

    //** e1
    textSize(30);
    textAlign(LEFT, CENTER);
    text("=", 825, 30);
    textAlign(RIGHT, CENTER);
    text(nf(round(this.edge_ab, 2), 0, 2), 950, 30);

    //** e2
    textSize(30);
    textAlign(LEFT, CENTER);
    text("=", 825, 80);
    textAlign(RIGHT, CENTER);
    text(nf(round(this.edge_k1, 2), 0, 2), 950, 80);
    pop();

    /*
    //** 5
    push();
    translate(posInsert_x, posInsert_y);

    //** abk1
    textSize(30);
    textAlign(CENTER, CENTER);
    text("\u21D2", 1000, 50);
    textAlign(LEFT, CENTER);
    text("\u03B1", 1050, 50);
    text("k", 1085, 50);
    text("=", 1120, 50);

    text(nf(round(this.edge_abk1, 2), 0, 2), 1160, 50);

    textSize(22);
    text("b", 1070, 60);
    text("1", 1100, 60);

    pop();
    */
  }

  //** called from sketch
  TextDistResult() {
    let posInsert_x = 700;
    let posInsert_y = 1150;

    //** 5
    push();
    translate(posInsert_x, posInsert_y);

    //** abk1
    textSize(30);
    textAlign(CENTER, CENTER);
    text("\u21D2", 1000, 50);
    text("\u21D2", 1650, -100);

    //** ab
    textAlign(LEFT, CENTER);
    text("\u03B1", 1050, -100);
    if (boltGroup.length > 1) text("\u03B1", 1150, -175);
    text("\u03B1", 1150, -125);
    text("f    / f ", 1150, -75);
    text("1.00", 1150, -25);
    text("=", 1100, -100 + 2.5);
    text("=", 1285, -100 + 2.5);
    text("=", 1485, -100 + 2.5);

    //** k1
    text("k", 1050, 125);
    if (boltGroup.length > 1) text("k", 1160, 75);
    text("k", 1160, 125);

    if (boltGroup.length < 2) text("1.50", 1160, 175);
    else text("2.50", 1160, 175);

    text("=", 1100, 130);
    text("=", 1285, 130);
    text("=", 1485, 130);

    textSize(22);
    text("b", 1070, 35 - 125);
    if (boltGroup.length > 1) text("b,p", 1170, -160);
    text("b,e", 1170, -110);
    text("ub", 1160, -65);
    text("u", 1220, -65);
    text("min.", 1260, -6);
    text("min.", 1460, -6);

    //** k1
    text("1", 1070, 135);
    if (boltGroup.length > 1) text("1,p", 1180, 85);
    text("1,e", 1180, 135);
    text("min.", 1260, 200 - 6);
    text("min.", 1460, 200 - 6);

    textSize(30);
    textAlign(RIGHT);
    //** ab
    if (boltGroup.length > 1)
      text(nf(round(this.bolt_ab, 2), 0, 2), 1425, -175);
    text(nf(round(this.edge_ab, 2), 0, 2), 1425, -125);
    text(nf(round(this.fub_fu, 2), 0, 2), 1425, -75);
    text(nf(1, 0, 2), 1425, -25);

    //** k1
    if (boltGroup.length > 1) text(nf(round(this.bolt_k1, 2), 0, 2), 1425, 75);
    text(nf(round(this.edge_k1, 2), 0, 2), 1425, 125);
    if (boltGroup.length < 2) text(nf(1.5, 0, 2), 1425, 175);
    else text(nf(2.5, 0, 2), 1425, 175);

    //** Result
    textAlign(LEFT);
    text(nf(round(this.ab_min, 2), 0, 2), 1520, -97.5);
    text(nf(round(this.k1_min, 2), 0, 2), 1520, 130);

    pop();

    //** LINES *1
    push();
    translate(posInsert_x, posInsert_y);
    stroke(0);
    strokeWeight(2);
    line(900, -100, 975, -100);
    line(900, 200, 975, 200);
    line(975, 200, 975, -100);

    if (boltGroup.length > 1) {
      //** LINES *2
      line(1150, 0, 1135, 0);
      line(1150, -200, 1135, -200);
      line(1135, 0, 1135, -200);

      line(1235, 0, 1250, 0);
      line(1235, -200, 1250, -200);
      line(1250, 0, 1250, -200);

      translate(200, 0);
      line(1150, 0, 1135, 0);
      line(1150, -200, 1135, -200);
      line(1135, 0, 1135, -200);

      line(1235, 0, 1250, 0);
      line(1235, -200, 1250, -200);
      line(1250, 0, 1250, -200);
      translate(-200, 0);

      //** LINES *3
      line(1150, 50, 1135, 50);
      line(1150, 200, 1135, 200);
      line(1135, 50, 1135, 200);

      line(1235, 50, 1250, 50);
      line(1235, 200, 1250, 200);
      line(1250, 50, 1250, 200);

      translate(200, 0);
      line(1150, 50, 1135, 50);
      line(1150, 200, 1135, 200);
      line(1135, 50, 1135, 200);

      line(1235, 50, 1250, 50);
      line(1235, 200, 1250, 200);
      line(1250, 50, 1250, 200);
      translate(-200, 0);
    } else {
      //** LINES *2
      line(1150, 0, 1135, 0);
      line(1150, -150, 1135, -150);
      line(1135, 0, 1135, -150);

      line(1235, 0, 1250, 0);
      line(1235, -150, 1250, -150);
      line(1250, 0, 1250, -150);

      translate(200, 0);
      line(1150, 0, 1135, 0);
      line(1150, -150, 1135, -150);
      line(1135, 0, 1135, -150);

      line(1235, 0, 1250, 0);
      line(1235, -150, 1250, -150);
      line(1250, 0, 1250, -150);
      translate(-200, 0);

      //** LINES *3
      line(1150, 100, 1135, 100);
      line(1150, 200, 1135, 200);
      line(1135, 100, 1135, 200);

      line(1235, 100, 1250, 100);
      line(1235, 200, 1250, 200);
      line(1250, 100, 1250, 200);

      translate(200, 0);
      line(1150, 100, 1135, 100);
      line(1150, 200, 1135, 200);
      line(1135, 100, 1135, 200);

      line(1235, 100, 1250, 100);
      line(1235, 200, 1250, 200);
      line(1250, 100, 1250, 200);
      translate(-200, 0);
    }

    //** LINES *4
    //translate(325,0)
    let xAdd = 650;
    line(900 + xAdd, -400, 975 + xAdd, -400);
    line(900 + xAdd, 200, 975 + xAdd, 200);
    line(975 + xAdd, 200, 975 + xAdd, -400);
    pop();
  }

  IsPointInsideRotatedEllipse(px, py, cx, cy, w, h, angle) {
    //** Move to ellipse center
    const dx = (px - cx) / scaleGeo;
    const dy = (py - cy) / scaleGeo;

    //** Rotate into ellipse local coordinates
    const c = cos(angle);
    const s = sin(angle);

    const x = dx * c + dy * s;
    const y = -dx * s + dy * c;

    const test = (x * x) / (w * w) + (y * y) / (h * h);

    return test <= 1;
  }

  //** called from system.TestIfBoltOverlapEdge()
  IsLineIntersectingRotatedEllipse(x1, y1, x2, y2, cx, cy, w, h, angle) {
    //** Move to ellipse center
    let sx = (x1 - cx) / scaleGeo;
    let sy = (y1 - cy) / scaleGeo;
    let ex = (x2 - cx) / scaleGeo;
    let ey = (y2 - cy) / scaleGeo;

    //** Rotate into ellipse local coordinates
    const c = cos(angle);
    const s = sin(angle);

    const lx1 = sx * c + sy * s;
    const ly1 = -sx * s + sy * c;

    const lx2 = ex * c + ey * s;
    const ly2 = -ex * s + ey * c;

    const dx = lx2 - lx1;
    const dy = ly2 - ly1;

    //** Quadratic coefficients
    const A = (dx * dx) / (w * w) + (dy * dy) / (h * h);
    const B = 2 * ((lx1 * dx) / (w * w) + (ly1 * dy) / (h * h));
    const C = (lx1 * lx1) / (w * w) + (ly1 * ly1) / (h * h) - 1;

    const D = B * B - 4 * A * C;

    if (D < 0) {
      //** No intersection => do nothing
      //return [];
    }

    const points = [];

    if (abs(D) < 1e-9) {
      // Tangent (1 point)
      const t = -B / (2 * A);

      if (t >= 0 && t <= 1) {
        const ix = lx1 + t * dx;
        const iy = ly1 + t * dy;

        // rotate back to world coordinates
        const wx = ix * c - iy * s;
        const wy = ix * s + iy * c;

        /*
        points.push({
          x: wx * scaleGeo + cx,
          y: wy * scaleGeo + cy,
        });*/

        let x= wx * scaleGeo + cx
        let y= wy * scaleGeo + cy
        points.push(x,y)
       
      }
      //circle(points[0].x, points[0].y, 6);
      //console.log("t")

      // return points;
    }

    const sqrtD = sqrt(D);

    const t1 = (-B - sqrtD) / (2 * A);
    const t2 = (-B + sqrtD) / (2 * A);

    if (t1 >= 0 && t1 <= 1) {
      //console.log("*1")
      const ix = lx1 + t1 * dx;
      const iy = ly1 + t1 * dy;

      // rotate back to world coordinates
      const wx = ix * c - iy * s;
      const wy = ix * s + iy * c;

      /*
      points.push({
        x: wx * scaleGeo + cx,
        y: wy * scaleGeo + cy,
      });
      */

        let x= wx * scaleGeo + cx
        let y= wy * scaleGeo + cy
                points.push(x,y)


      //console.log(points[0].x)
      //circle(points[0].x, points[0].y, 6);
      //console.log("t1")
    }

    if (t2 >= 0 && t2 <= 1) {
      //console.log("*2")
      const ix = lx1 + t2 * dx;
      const iy = ly1 + t2 * dy;

      // rotate back to world coordinates
      const wx = ix * c - iy * s;
      const wy = ix * s + iy * c;

      /*
      points.push({
        x: wx * scaleGeo + cx,
        y: wy * scaleGeo + cy,
      });
      */

        let x= wx * scaleGeo + cx
        let y= wy * scaleGeo + cy
                points.push(x,y)


      //circle(points[0].x, points[0].y, 6);
      //console.log("t2 " + scaleGeo)
    }

    if (points.length > 0) {
      return points;
    } else return 0;
  }
}
