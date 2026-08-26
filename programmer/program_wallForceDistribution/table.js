class Table {
  constructor() {
    //countLoggedInsertPoints = 0;

    //** Result
    //this.insertPointTabelDef = new p5.Vector(900, 1700);
    //this.insertPointTabelSpring = new p5.Vector(850, 500);
    this.insertPointTabelForces = new p5.Vector(1300, 2300);
    this.insertPointTabelGeo = new p5.Vector(500, 2300);
    this.insertPointTabelCalc_CR = new p5.Vector(2500, 1400);
    this.insertPointTabelCalc_CM = new p5.Vector(2500, 600);

    //this.insertPointDefLog = false;
    //this.insertPointSpringLog = false;
    this.insertPointForcesLog = false;

    //** Input
    //this.insertPointTabelLoad = new p5.Vector(400, 1700);

    //this.insertPointLoadLog = false;

    this.rowOverlap = undefined;
    this.colOverlap = undefined;
  }

  //** 1 **
  OverlapInsertPointForces(pos) {
    //** Move Table
    //** Called in sketch

    let distInsertPointSupport = dist(
      pos.x,
      pos.y,
      this.insertPointTabelForces.x,
      this.insertPointTabelForces.y
    );

    if (distInsertPointSupport < 10) {
      this.OverlapHighligth(this.insertPointTabelForces);
      if (countLoggedInsertPoints == 0) {
        //** LogState => move particle fast
        if (mouseIsPressed) {
          this.insertPointForcesLog = true;
          countLoggedInsertPoints++;
        } else {
          this.insertPointForcesLog = false;
        }
      }
    }
  }
  OverlapInsertPointGeo(pos) {
    //** Move Table
    //** Called in sketch

    let distInsertPointGeo = dist(
      pos.x,
      pos.y,
      this.insertPointTabelGeo.x,
      this.insertPointTabelGeo.y
    );

    if (distInsertPointGeo < 10) {
      this.OverlapHighligth(this.insertPointTabelGeo);
      if (countLoggedInsertPoints == 0) {
        //** LogState => move particle fast
        if (mouseIsPressed) {
          this.insertPointGeoLog = true;
          countLoggedInsertPoints++;
        } else {
          this.insertPointGeoLog = false;
        }
      }
    }
  }
  OverlapInsertPointCalc_CR(pos) {
    //** Move Table
    //** Called in sketch

    let distInsertPointCalc_CR = dist(
      pos.x,
      pos.y,
      this.insertPointTabelCalc_CR.x,
      this.insertPointTabelCalc_CR.y
    );

    if (distInsertPointCalc_CR < 10) {
      this.OverlapHighligth(this.insertPointTabelCalc_CR);
      if (countLoggedInsertPoints == 0) {
        //** LogState => move particle fast
        if (mouseIsPressed) {
          this.insertPointCalcCRLog = true;
          countLoggedInsertPoints++;
        } else {
          this.insertPointCalcCRLog = false;
        }
      }
    }
  }
  OverlapInsertPointCalc_CM(pos) {
    //** Move Table
    //** Called in sketch

    let distInsertPointCalc_CM = dist(
      pos.x,
      pos.y,
      this.insertPointTabelCalc_CM.x,
      this.insertPointTabelCalc_CM.y
    );

    if (distInsertPointCalc_CM < 10) {
      this.OverlapHighligth(this.insertPointTabelCalc_CM);
      if (countLoggedInsertPoints == 0) {
        //** LogState => move particle fast
        if (mouseIsPressed) {
          this.insertPointCalcCMLog = true;
          countLoggedInsertPoints++;
        } else {
          this.insertPointCalcCMLog = false;
        }
      }
    }
  }

  OverlapHighligth(pos) {
    push();
    if (mouseIsPressed) {
      fill(0, 255, 0, 100);
    } else {
      fill(100, 100, 100, 100);
    }
    circle(pos.x, pos.y, 20);
    pop();
  }

  //** 2 **
  MoveTable(pos) {
    this.TableMoveSteps(pos);

    if (this.insertPointForcesLog) {
      this.insertPointTabelForces.x = pos.x;
      this.insertPointTabelForces.y = pos.y;
    }

    if (this.insertPointGeoLog) {
      this.insertPointTabelGeo.x = pos.x;
      this.insertPointTabelGeo.y = pos.y;
    }

    if (this.insertPointCalcCRLog) {
      this.insertPointTabelCalc_CR.x = pos.x;
      this.insertPointTabelCalc_CR.y = pos.y;
    }

    if (this.insertPointCalcCMLog) {
      this.insertPointTabelCalc_CM.x = pos.x;
      this.insertPointTabelCalc_CM.y = pos.y;
    }
  }

  DisplayButtonRollorInTable(pos) {
    push();
    let p = this.insertPointTabelGeo;

    //console.log("table line 104 - Create buttonRollor in table - " + p);

    let col_0 = 0; //** Node
    let col_1 = 100; //** Cy
    let col_2 = 250; //** Cz
    let col_3 = 500;

    let top_Y = p.y + 100;
    let bottom_Y = p.y + 100 + wallSystem.array.length * 50;
    let left_X = p.x + col_1 + 75;
    let rigth_X = p.x + col_2 - 10;

    let w = rigth_X - left_X;
    let h = bottom_Y - top_Y;
    //rect(left_X, top_Y, w, h);

    if (
      left_X < mousePosWorld.x &&
      mousePosWorld.x < rigth_X &&
      top_Y < mousePosWorld.y &&
      mousePosWorld.y < bottom_Y
    ) {
      //** Find row in table
      let distToTop_Y = dist(p.x, mousePosWorld.y, p.x, top_Y);
      let row = int(distToTop_Y / 50);
      //console.log("table line 85: " + row);
      //console.log("row: " +row)
      //** Find col in table
      let distToLeft_X = dist(mousePosWorld.x, p.y, left_X, p.y);
      let col = int(distToLeft_X / 150);

      //**Display ButtonRollor and Read Value t
      if (col == 0 && wallSystem.array[row].t > 0) {
        //** Hihligth node
        push();
        fill(0, 255, 0, 100);
        noStroke();
        //circle(supports[row].fixPoint.x, supports[row].fixPoint.y, 30);
        pop();

        this.HighligthWall(row);

        let translatePoint_t = new p5.Vector();
        translatePoint_t.x = p.x + col_1 - 17.5;
        translatePoint_t.y = p.y + 145 + row * 50;

        translate(translatePoint_t.x, translatePoint_t.y);

        wallSystem.array[row].graphPosNoScale_t = new p5.Vector.sub(
          mousePosWorld,
          translatePoint_t
        );

        //** Show buttonRoller if mouseY is in cell
        let test = pos.y - translatePoint_t.y;
        if (test > -35 && test < -5) {
          push();
          noStroke();
          fill(255, 255, 255);
          rect(95, -40, 60, 40);

          pop();
          wallSystem.array[row].buttonRollor_wall_t.DisplayButonRollor(
            wallSystem.array[row].graphPosNoScale_t
          );
          wallSystem.array[row].t = wallSystem.array[
            row
          ].buttonRollor_wall_t.ReadValue();
        } else {
          for (let i = 0, length = wallSystem.array.length; i < length; i++) {
            wallSystem.array[i].buttonRollor_wall_t.overlapCiffer = false;
          }
        }
      }
    } else {
      //** Sets all overlapCiffer to false
      for (let i = 0, length = wallSystem.array.length; i < length; i++) {
        wallSystem.array[i].buttonRollor_wall_t.overlapCiffer = false;
      }
    }

    pop();
  }

  //** Called from this.DisplayButtonRollorInTable(pos)
  HighligthWall(row) {
    let x = wallSystem.array[row].fixPointWall_ID_pos.x;
    let y = wallSystem.array[row].fixPointWall_ID_pos.y;

    push();
    noStroke();
    fill(0, 255, 0, 100);
    circle(x, y, 50);

    pop();
  }
  HighligthRowInTable(pos) {
    //** check overlap
    wallSystem.OverlapWall(pos);
    if (wallSystem.overlapWall == null) return;

    //** Highligth
    let wallposInArray = wallSystem.overlapWall;

    let xGeo = this.insertPointTabelGeo.x + 5;
    let yGeo = this.insertPointTabelGeo.y + 105 + 50 * wallposInArray;

    let xForce = this.insertPointTabelForces.x + 5;
    let yForce = this.insertPointTabelForces.y + 105 + 50 * wallposInArray;

    let xCalc_CR = this.insertPointTabelCalc_CR.x + 5;
    let yCalc_CR = this.insertPointTabelCalc_CR.y + 105 + 50 * wallposInArray;

    let xCalc_CM = this.insertPointTabelCalc_CM.x + 5;
    let yCalc_CM = this.insertPointTabelCalc_CM.y + 105 + 50 * wallposInArray;

    push();
    noStroke();
    fill(0, 255, 0, 50);
    rect(xGeo, yGeo, 540, 40);
    rect(xForce, yForce, 540, 40);
    rect(xCalc_CR, yCalc_CR, 1740, 40);
    rect(xCalc_CM, yCalc_CM, 840, 40);
    pop();
    // console.log(wallSystem.overlapWall)
  }
  HighligthWallFromTable(pos) {
    //** Tabel Geo
    if (
      this.insertPointTabelGeo.x < pos.x &&
      pos.x < this.insertPointTabelGeo.x + this.w_geo &&
      this.insertPointTabelGeo.y < pos.y &&
      pos.y < this.insertPointTabelGeo.y + this.h_geo
    ) {
      this.MarkRowInTable(pos, this.insertPointTabelGeo, this.w_geo);
    } else if (
      this.insertPointTabelForces.x < pos.x &&
      pos.x < this.insertPointTabelForces.x + this.w_forces &&
      this.insertPointTabelForces.y < pos.y &&
      pos.y < this.insertPointTabelForces.y + this.h_forces
    ) {
      this.MarkRowInTable(pos, this.insertPointTabelForces, this.w_forces);
    } else if (
      this.insertPointTabelCalc_CR.x < pos.x &&
      pos.x < this.insertPointTabelCalc_CR.x + this.w_CR &&
      this.insertPointTabelCalc_CR.y < pos.y &&
      pos.y < this.insertPointTabelCalc_CR.y + this.h_CR
    ) {
      this.MarkRowInTable(pos, this.insertPointTabelCalc_CR, this.w_CR);
    } else if (
      this.insertPointTabelCalc_CM.x < pos.x &&
      pos.x < this.insertPointTabelCalc_CM.x + this.w_CM &&
      this.insertPointTabelCalc_CM.y < pos.y &&
      pos.y < this.insertPointTabelCalc_CM.y + this.h_CM
    ) {
      this.MarkRowInTable(pos, this.insertPointTabelCalc_CM, this.w_CM);
    }
  }
  //** called from this.HighligthWallFromTable(pos)
  MarkRowInTable(pos, insertPointTable, widthTabel) {
    //** FindRow
    let a = (pos.y - insertPointTable.y - 100) / 50;
    let row = floor(a);
    //console.log(row)

    push();
    if (row >= 0) {
      let x = insertPointTable.x + 5;
      let w = widthTabel - 10;
      let y = insertPointTable.y + 100 + 5 + 50 * row;

      line(
        x + 5,
        y + 20,
        wallSystem.array[row].fixPointWall_ID_pos.x,
        wallSystem.array[row].fixPointWall_ID_pos.y
      );
      fill(0);
      circle(x + 5, y + 20, 4);
      noStroke();
      fill(0, 255, 0, 50);
      rect(x, y, w, 40);

      circle(
        wallSystem.array[row].fixPointWall_ID_pos.x,
        wallSystem.array[row].fixPointWall_ID_pos.y,
        40
      );
      pop();
    }
  }

  DisplayWallForces(pos) {
    //*************************************************
    //************ Tabel Forces  ************ START ***
    //*************************************************
    this.BubbleSortLoad(wallSystem.array);

    let p = this.insertPointTabelForces;
    let col_0 = 0; //** Node
    let col_1 = 100; //** Fx
    let col_2 = 250; //** Cz
    let col_3 = 400;
    let col_4 = 550;

    push();
    circle(p.x, p.y, 20);

    //** Table Background
    noStroke();
    fill(255, 150);
    this.w_forces = col_4;
    this.h_forces = 100 + 50 * wallSystem.array.length;
    rect(p.x, p.y, this.w_forces, this.h_forces); //** Set at metod end
    fill(0);

    //** Headline
    textAlign(LEFT, CENTER);
    textSize(30);
    text("Wall Forces", p.x, p.y - 25);

    //** Table Text
    textAlign(CENTER, CENTER);
    textSize(30);
    text("Wall", p.x + 50, p.y + 25);

    textAlign(RIGHT);
    text("Fx", p.x + col_2 - 15, p.y + 25);
    text("[kN]", p.x + col_2 - 15, p.y + 75);
    text("Fy", p.x + col_3 - 15, p.y + 25);
    text("[kN]", p.x + col_3 - 15, p.y + 75);
    text("F", p.x + col_4 - 15, p.y + 25);
    text("[kN]", p.x + col_4 - 15, p.y + 75);
    //text("Force", p.x + col_4 - 15, p.y + 25);
    //text("[kN]", p.x + col_4 - 15, p.y + 75);
    pop();

    //** Lines
    push();
    stroke(0);
    translate(p.x, p.y);
    let length = wallSystem.array.length;
    //** Horisontal
    line(-5, 0, col_4 + 5, 0);
    line(-5, 100, col_4 + 5, 100);
    line(-5, 100 + length * 50, col_4 + 5, 100 + length * 50);
    //** Vertical
    line(0, -5, 0, 100 + 50 * length + 5);
    line(100, -5, 100, 100 + 50 * length + 5);
    line(250, -5, 250, 100 + 50 * length + 5);
    line(col_3, -5, col_3, 100 + 50 * length + 5);
    line(col_4, -5, col_4, 100 + 50 * length + 5);
    pop();

    //** Values
    let Fx_sum = 0;
    let Fy_sum = 0;
    push();
    for (let i = 0, length = wallSystem.array.length; i < length; i++) {
      textAlign(CENTER, CENTER);
      textSize(30);
      let id = wallSystem.array[i].id;
      text(id, p.x + col_0 + 50, p.y + 127.5 + 50 * i);
      textAlign(RIGHT);

      let Fx = nf(round(-wallSystem.array[i].forceXY.x / 1000, 2), 0, 2);
      let Fy = nf(round(-wallSystem.array[i].forceXY.y / 1000, 2), 0, 2);
      let F = nf(round(wallSystem.array[i].forceXY.mag() / 1000, 2), 0, 2);

      Fx_sum += wallSystem.array[i].forceXY.x;
      Fy_sum += wallSystem.array[i].forceXY.y;

      if (Fx == 0) Fx = "-";
      text(Fx, p.x + col_2 - 15, p.y + 130 + 50 * i);

      if (Fy == 0) Fy = "-";
      text(Fy, p.x + col_3 - 15, p.y + 130 + 50 * i);

      if (Fx == "-" || Fy == "-") F = "-";
      text(F, p.x + col_4 - 15, p.y + 130 + 50 * i);
    }

    Fx_sum = nf(round(-Fx_sum / 1000, 2), 0, 2);
    Fy_sum = nf(round(-Fy_sum / 1000, 2), 0, 2);
    text(Fx_sum, p.x + col_2 - 15, p.y + 130 + wallSystem.array.length * 50);
    text(Fy_sum, p.x + col_3 - 15, p.y + 130 + wallSystem.array.length * 50);

    textSize(24);
    text("\u2211", p.x + col_1 - 40, p.y + 125 + wallSystem.array.length * 50);
    pop();
  }
  DisplayWallCalc_CR(pos) {
    //*************************************************
    //************ Tabel Calc  ************ START ***
    //*************************************************
    this.BubbleSortLoad(wallSystem.array);

    let p = this.insertPointTabelCalc_CR;
    let col_0 = 0; //** Wall
    let col_1 = 100; //** alfa
    let col_2 = 250; //** cos(alfa)
    let col_3 = 400; //** sin(alfa)
    let col_4 = 550; //** Cx
    let col_5 = 700; //** Cy
    let col_6 = 850; //** Cc
    let col_7 = 1000;
    let col_8 = 1150;
    let col_9 = 1300;
    let col_10 = 1450;
    let col_11 = 1600;
    let col_12 = 1750;

    push();
    circle(p.x, p.y, 20);

    //** Table Background
    noStroke();
    fill(255, 150);
    this.w_CR = col_12;
    this.h_CR = 100 + 50 * wallSystem.array.length;
    rect(p.x, p.y, this.w_CR, this.h_CR); //** Set at metod end
    fill(0);

    //** Headline
    textAlign(LEFT, CENTER);
    textSize(30);
    text("Wall Calculation - Center of Rotation (CR)", p.x, p.y - 25);
    text("C     =", p.x + 600, p.y - 25);
    text("C", p.x + 690, p.y - 25);

    //** Value
    const value = wallSystem.array[0].Cns_n;
    const scaled = value >= 1000 ? value / 1000 : value;
    const unit = value >= 1000 ? "kN/mm" : "N/mm";

    //** `${1. text string} ${2. text string}`
    text(`${"= "} ${nf(round(scaled, 1), 0, 1)} ${unit}`, p.x + 740, p.y - 25);

    //text("= " + nf(round(wallSystem.array[0].Cns_n/1,1),0,1) + " N/mm  ",p.x + 740, p.y - 25);
    textSize(20);
    text("ref", p.x + 622, p.y - 17);
    let wall_id = wallSystem.array[0].id;
    text(wall_id, p.x + 715, p.y - 17);

    //** Table Text
    textAlign(CENTER, CENTER);
    textSize(30);
    text("Wall", p.x + 50, p.y + 25);

    textAlign(RIGHT);
    // "\u2211" U+03B1
    text("C", p.x + col_2 - 15, p.y + 25);
    text("\u03B1", p.x + col_3 - 15, p.y + 25); //** alfa
    text("cos(\u03B1)", p.x + col_4 - 15, p.y + 25); //** cos
    text("sin(\u03B1)", p.x + col_5 - 15, p.y + 25); //** sin
    text("A  ", p.x + col_6 - 15, p.y + 25); //** Cx //** A1
    text("[m]", p.x + col_6 - 15, p.y + 75);
    text("A  ", p.x + col_7 - 15, p.y + 25); //** CY //** A2
    text("[m]", p.x + col_7 - 15, p.y + 75);
    text("A  ", p.x + col_8 - 15, p.y + 25); //** Cc //** A3
    text("[m]", p.x + col_8 - 15, p.y + 75);
    text("x ", p.x + col_9 - 15, p.y + 25); //** x_tp
    text("[m]", p.x + col_9 - 15, p.y + 75);
    text("y ", p.x + col_10 - 15, p.y + 25); //** y_tp
    text("[m]", p.x + col_10 - 15, p.y + 75);
    text("B  ", p.x + col_11 - 15, p.y + 25);
    text("[m]", p.x + col_11 - 15, p.y + 75);
    text("B  ", p.x + col_12 - 15, p.y + 25);
    text("[m]", p.x + col_12 - 15, p.y + 75);

    //console.log("Table line 386: " + calculation.theta)

    pop();

    //** Index
    push();
    textSize(24);
    textAlign(RIGHT);
    text("1 ", p.x + col_6 - 7.5, p.y + 45);
    text("2 ", p.x + col_7 - 7.5, p.y + 45);
    text("3 ", p.x + col_8 - 7.5, p.y + 45);
    text("1 ", p.x + col_11 - 7.5, p.y + 45);
    text("2 ", p.x + col_12 - 7.5, p.y + 45);

    pop();

    //** Lines
    push();
    stroke(0);
    translate(p.x, p.y);
    let length = wallSystem.array.length;
    //** Horisontal
    line(-5, 0, col_12 + 5, 0);
    line(-5, 100, col_12 + 5, 100);
    line(-5, 100 + length * 50, col_12 + 5, 100 + length * 50);
    //** Vertical
    line(0, -5, 0, 100 + 50 * length + 5);
    line(100, -5, 100, 100 + 50 * length + 5);
    line(250, -5, 250, 100 + 50 * length + 5);
    line(col_3, -5, col_3, 100 + 50 * length + 5);
    line(col_4, -5, col_4, 100 + 50 * length + 5);
    line(col_5, -5, col_5, 100 + 50 * length + 5);
    line(col_6, -5, col_6, 100 + 50 * length + 5);
    line(col_7, -5, col_7, 100 + 50 * length + 5);
    line(col_8, -5, col_8, 100 + 50 * length + 5);
    line(col_9, -5, col_9, 100 + 50 * length + 5);
    line(col_10, -5, col_10, 100 + 50 * length + 5);
    line(col_11, -5, col_11, 100 + 50 * length + 5);
    line(col_12, -5, col_12, 100 + 50 * length + 5);
    pop();

    //** Values
    let C_rel = wallSystem.array[0].Cns_n; //** [N/mm]
    //console.log(C_rel)

    push();
    for (let i = 0, length = wallSystem.array.length; i < length; i++) {
      textAlign(CENTER, CENTER);
      textSize(30);
      let id = wallSystem.array[i].id;
      text(id, p.x + col_0 + 50, p.y + 127.5 + 50 * i);
      textAlign(RIGHT);

      /*
      let C_rel = nf(
        round(wallSystem.array[i].Cns_n / wallSystem.array[0].Cns_n, 2),
        0,
        2
      );
      */

      let C = wallSystem.array[i].Cns_n / C_rel;
      let a_deg = wallSystem.array[i].wallAngleDegrees;

      let cos_a = wallSystem.array[i].cos; //cos(wallSystem.array[i].wallAngleRadians);
      let sin_a = wallSystem.array[i].sin; //sin(wallSystem.array[i].wallAngleRadians);
      let A1 = wallSystem.array[i].A1 / C_rel; //(C_rel * cos_a* cos_a); //** (4.30) A1
      let A2 = wallSystem.array[i].A2 / C_rel; //(C_rel * sin_a* sin_a); //** (4.30) A2
      let A3 = wallSystem.array[i].A3 / C_rel; //** (4.30) A3 //** coupling term
      let x_tp = wallSystem.array[i].centerPos.x / 100; //** [m]
      let y_tp = wallSystem.array[i].centerPos.y / 100; //** [m]

      //console.log(calculation.B2_sum/wallSystem.array[0].Cns_n)
      let B1 = wallSystem.array[i].B1 / C_rel / 1000; //Cx * y_tp - x_tp * Cc; //** (4.30) B1
      let B2 = wallSystem.array[i].B2 / C_rel / 1000; //Cy * x_tp - y_tp * Cc; //** (4.30) B2

      text(nf(round(C, 2), 0, 2), p.x + col_2 - 15 - 50, p.y + 130 + 50 * i);
      text(nf(a_deg, 0, 2), p.x + col_3 - 15, p.y + 130 + 50 * i);
      text(nf(round(cos_a, 2), 0, 2), p.x + col_4 - 15, p.y + 130 + 50 * i);
      text(nf(round(sin_a, 2), 0, 2), p.x + col_5 - 15, p.y + 130 + 50 * i);

      text("C", p.x + col_2 - 15 - 25, p.y + 130 + 50 * i);
      textSize(20);
      text("ref", p.x + col_2 - 15, p.y + 137 + 50 * i);
      textSize(30);

      if (round(A1, 2) == 0) {
        text("-", p.x + col_6 - 15, p.y + 130 + 50 * i);
      } else {
        text(nf(round(A1, 2), 0, 2), p.x + col_6 - 15 - 50, p.y + 130 + 50 * i);
        text("C", p.x + col_6 - 15 - 25, p.y + 130 + 50 * i);
        textSize(20);
        text("ref", p.x + col_6 - 15, p.y + 137 + 50 * i);
        textSize(30);
      }

      if (round(A2, 2) == 0) {
        text("-", p.x + col_7 - 15, p.y + 130 + 50 * i);
      } else {
        text(nf(round(A2, 2), 0, 2), p.x + col_7 - 15 - 50, p.y + 130 + 50 * i);
        text("C", p.x + col_7 - 15 - 25, p.y + 130 + 50 * i);
        textSize(20);
        text("ref", p.x + col_7 - 15, p.y + 137 + 50 * i);
        textSize(30);
      }

      if (round(A3, 2) == 0) {
        text("-", p.x + col_8 - 15, p.y + 130 + 50 * i);
      } else {
        text(nf(round(A3, 2), 0, 2), p.x + col_8 - 15 - 50, p.y + 130 + 50 * i);
        text("C", p.x + col_8 - 15 - 25, p.y + 130 + 50 * i);
        textSize(20);
        text("ref", p.x + col_8 - 15, p.y + 137 + 50 * i);
        textSize(30);
      }

      text(nf(x_tp, 0, 2), p.x + col_9 - 15, p.y + 130 + 50 * i);
      text(nf(y_tp, 0, 2), p.x + col_10 - 15, p.y + 130 + 50 * i);

      if (round(B1, 2) == 0) {
        text("-", p.x + col_11 - 15, p.y + 130 + 50 * i);
      } else {
        text(
          nf(round(B1, 2), 0, 2),
          p.x + col_11 - 15 - 50,
          p.y + 130 + 50 * i
        );
        text("C", p.x + col_11 - 15 - 25, p.y + 130 + 50 * i);
        textSize(20);
        text("ref", p.x + col_11 - 15, p.y + 137 + 50 * i);
        textSize(30);
      }

      if (round(B2, 2) == 0) {
        text("-", p.x + col_12 - 15, p.y + 130 + 50 * i);
      } else {
        text(
          nf(round(B2, 2), 0, 2),
          p.x + col_12 - 15 - 50,
          p.y + 130 + 50 * i
        );
        text("C", p.x + col_12 - 15 - 25, p.y + 130 + 50 * i);
        textSize(20);
        text("ref", p.x + col_12 - 15, p.y + 137 + 50 * i);
        textSize(30);
      }
    }

    text(
      nf(calculation.A1_sum / C_rel, 0, 2),
      p.x + col_6 - 15 - 50,
      p.y + 130 + wallSystem.array.length * 50
    );

    text("C", p.x + col_6 - 15 - 25, p.y + 130 + wallSystem.array.length * 50);
    textSize(20);
    text("ref", p.x + col_6 - 15, p.y + 137 + wallSystem.array.length * 50);
    textSize(30);

    text(
      nf(calculation.A2_sum / C_rel, 0, 2),
      p.x + col_7 - 15 - 50,
      p.y + 130 + wallSystem.array.length * 50
    );
    text("C", p.x + col_7 - 15 - 25, p.y + 130 + wallSystem.array.length * 50);
    textSize(20);
    text("ref", p.x + col_7 - 15, p.y + 137 + wallSystem.array.length * 50);
    textSize(30);

    if (round(calculation.A3_sum, 2) == 0) {
      text("-", p.x + col_8 - 15, p.y + 130 + wallSystem.array.length * 50);
    } else {
      text(
        nf(round(calculation.A3_sum / C_rel, 2), 0, 2),
        p.x + col_8 - 15 - 50,
        p.y + 130 + wallSystem.array.length * 50
      );
      text(
        "C",
        p.x + col_8 - 15 - 25,
        p.y + 130 + wallSystem.array.length * 50
      );
      textSize(20);
      text("ref", p.x + col_8 - 15, p.y + 137 + wallSystem.array.length * 50);
      textSize(30);
    }

    text(
      nf(round(calculation.B1_sum / C_rel / 1000, 2), 0, 2),
      p.x + col_11 - 15 - 50,
      p.y + 130 + wallSystem.array.length * 50
    );
    text("C", p.x + col_11 - 15 - 25, p.y + 130 + wallSystem.array.length * 50);
    textSize(20);
    text("ref", p.x + col_11 - 15, p.y + 137 + wallSystem.array.length * 50);
    textSize(30);

    text(
      nf(round(calculation.B2_sum / C_rel / 1000, 2), 0, 2),
      p.x + col_12 - 15 - 50,
      p.y + 130 + wallSystem.array.length * 50
    );
    text("C", p.x + col_12 - 15 - 25, p.y + 130 + wallSystem.array.length * 50);
    textSize(20);
    text("ref", p.x + col_12 - 15, p.y + 137 + wallSystem.array.length * 50);
    textSize(30);

    let tableSize_pos = new p5.Vector(
      p.x,
      p.y + 125 + wallSystem.array.length * 50
    );
    textSize(24);
    text("\u2211", p.x + col_1 - 40, tableSize_pos.y);
    pop();

    //** Display
    this.DisplayFormularRotationCenter(tableSize_pos);
  }
  DisplayWallCalc_CM(pos) {
    //*************************************************
    //************ Tabel Calc  ************ START ***
    //*************************************************

    this.BubbleSortLoad(wallSystem.array);

    let p = this.insertPointTabelCalc_CM;
    let col_0 = 0; //**
    let col_1 = 100; //** wall
    let col_2 = 250; //** Mass
    let col_3 = 400; //** x
    let col_4 = 550; //** y
    let col_5 = 700; //** Cy
    let col_6 = 850; //** Cc
    let col_7 = 1000;
    let col_8 = 1150;
    let col_9 = 1300;
    let col_10 = 1450;
    let col_11 = 1600;
    let col_12 = 1750;

    //** Table
    push();
    circle(p.x, p.y, 20);

    //** Table Background
    noStroke();
    fill(255, 150);
    this.w_CM = col_6;
    this.h_CM = 100 + 50 * wallSystem.array.length;
    rect(p.x, p.y, this.w_CM, this.h_CM); //** Set at metod end
    fill(0);

    //** Headline
    push();
    textSize(50);

    text(
      "Calculation",
      this.insertPointTabelCalc_CM.x,
      this.insertPointTabelCalc_CM.y - 200
    );
    textAlign(LEFT, CENTER);
    textSize(30);
    text(
      "Skivebygningers Statik 2. udgave 1992",
      this.insertPointTabelCalc_CM.x,
      this.insertPointTabelCalc_CM.y - 150
    );
    //text("DELETE", this.insertPoint.x + 775, this.insertPoint.y + 440);
    //text("Output Data", this.insertPoint.x + 350, this.insertPoint.y + 1850);
    pop();

    textAlign(LEFT, CENTER);

    textSize(30);
    text("Wall Calculation - Center of Mass (CM)", p.x, p.y - 25);

    text("A     =", p.x + 600, p.y - 25);
    text("A", p.x + 690, p.y - 25);
    text(
      "= " + nf(wallSystem.array[0].area / 1e6, 0, 3) + " m  ",
      p.x + 740,
      p.y - 25
    );
    textSize(20);
    text("ref", p.x + 622, p.y - 17);
    text(wallSystem.array[0].id, p.x + 715, p.y - 17);
    text("2", p.x + 875, p.y - 35);

    //** Table Text
    textAlign(CENTER, CENTER);
    textSize(30);
    text("Wall", p.x + 50, p.y + 25);

    textAlign(RIGHT);
    // "\u2211" U+03B1
    text("A", p.x + col_2 - 15, p.y + 25);
    text("[m  ]", p.x + col_2 - 15, p.y + 75);
    text("x ", p.x + col_3 - 15, p.y + 25); //** x_tp
    text("[m]", p.x + col_3 - 15, p.y + 75);
    text("y ", p.x + col_4 - 15, p.y + 25); //** y_tp
    text("[m]", p.x + col_4 - 15, p.y + 75);
    text("Sx ", p.x + col_5 - 15, p.y + 25); //** Sx = M x_tp
    text("[m  ]", p.x + col_5 - 15, p.y + 75);
    text("Sy  ", p.x + col_6 - 15, p.y + 25); //** Sy = M y_tp
    text("[m  ]", p.x + col_6 - 15, p.y + 75);

    pop();

    //** Index
    push();
    textSize(22);
    textAlign(RIGHT);

    text("2", p.x + col_2 - 26, p.y + 72);
    text("3", p.x + col_5 - 26, p.y + 72);
    text("3", p.x + col_6 - 26, p.y + 72);

    pop();

    //** Lines
    push();
    stroke(0);
    translate(p.x, p.y);
    let length = wallSystem.array.length;
    //** Horisontal
    line(-5, 0, col_6 + 5, 0);
    line(-5, 100, col_6 + 5, 100);
    line(-5, 100 + length * 50, col_6 + 5, 100 + length * 50);
    //** Vertical
    line(0, -5, 0, 100 + 50 * length + 5);
    line(100, -5, 100, 100 + 50 * length + 5);
    line(250, -5, 250, 100 + 50 * length + 5);
    line(col_3, -5, col_3, 100 + 50 * length + 5);
    line(col_4, -5, col_4, 100 + 50 * length + 5);
    line(col_5, -5, col_5, 100 + 50 * length + 5);
    line(col_6, -5, col_6, 100 + 50 * length + 5);

    pop();

    //** Values
    let M_rel = wallSystem.array[0].t * wallSystem.array[0].wallLength * 1000;

    push();
    for (let i = 0, length = wallSystem.array.length; i < length; i++) {
      textAlign(CENTER, CENTER);
      textSize(30);
      let id = wallSystem.array[i].id;
      text(id, p.x + col_0 + 50, p.y + 127.5 + 50 * i);
      textAlign(RIGHT);

      let M =
        ((wallSystem.array[i].t * wallSystem.array[i].wallLength) / M_rel) *
        1000;

      let x_tp = wallSystem.array[i].centerPos.x / 100;
      let y_tp = wallSystem.array[i].centerPos.y / 100;

      //** A
      text(nf(round(M, 2), 0, 2), p.x + col_2 - 15 - 50, p.y + 130 + 50 * i);

      //**Tp
      text(nf(x_tp, 0, 2), p.x + col_3 - 15, p.y + 130 + 50 * i);
      text(nf(y_tp, 0, 2), p.x + col_4 - 15, p.y + 130 + 50 * i);

      //**Sx
      text(
        nf(wallSystem.array[i].Sxy.y / M_rel, 0, 2),
        p.x + col_5 - 15 - 50,
        p.y + 130 + 50 * i
      );

      //**Sy
      text(
        nf(wallSystem.array[i].Sxy.x / M_rel, 0, 2),
        p.x + col_6 - 15 - 50,
        p.y + 130 + 50 * i
      );

      text("A", p.x + col_2 - 15 - 25, p.y + 130 + 50 * i);
      text("A", p.x + col_5 - 15 - 25, p.y + 130 + 50 * i);
      text("A", p.x + col_6 - 15 - 25, p.y + 130 + 50 * i);
      textSize(20);
      text("ref", p.x + col_2 - 15, p.y + 137 + 50 * i);
      text("ref", p.x + col_5 - 15, p.y + 137 + 50 * i);
      text("ref", p.x + col_6 - 15, p.y + 137 + 50 * i);
      textSize(30);
    }

    //** A
    text(
      nf(round((calculation.area_sum / M_rel) * 1000, 2), 0, 2),
      p.x + col_2 - 15 - 50,
      p.y + 130 + wallSystem.array.length * 50
    );

    //** Sx
    text(
      nf(round(calculation.S_sum_X / M_rel, 2), 0, 2),
      p.x + col_5 - 15 - 50,
      p.y + 130 + wallSystem.array.length * 50
    );

    //** Sy
    text(
      nf(round(calculation.S_sum_Y / M_rel, 2), 0, 2),
      p.x + col_6 - 15 - 50,
      p.y + 130 + wallSystem.array.length * 50
    );

    let tableSize_pos = new p5.Vector(
      p.x,
      p.y + 125 + wallSystem.array.length * 50
    );

    text("A", p.x + col_2 - 15 - 25, p.y + 130 + wallSystem.array.length * 50);
    text("A", p.x + col_5 - 15 - 25, p.y + 130 + wallSystem.array.length * 50);
    text("A", p.x + col_6 - 15 - 25, p.y + 130 + wallSystem.array.length * 50);
    textSize(20);
    text("ref", p.x + col_2 - 15, p.y + 137 + wallSystem.array.length * 50);
    text("ref", p.x + col_5 - 15, p.y + 137 + wallSystem.array.length * 50);
    text("ref", p.x + col_6 - 15, p.y + 137 + wallSystem.array.length * 50);

    textSize(24);
    text("\u2211", p.x + col_1 - 40, tableSize_pos.y);

    pop();

    //** Display
    this.DisplayFormularMassCenter(tableSize_pos);
  }
  DisplayWallGeo(pos) {
    //*************************************************
    //************ Tabel WallGeo  ************ START ***
    //*************************************************
    this.BubbleSortLoad(wallSystem.array);

    let p = this.insertPointTabelGeo;
    let col_0 = 0; //** Node
    let col_1 = 100; //** Fx
    let col_2 = 250; //** Cz
    let col_3 = 400;
    let col_4 = 550;

    push();
    circle(p.x, p.y, 20);

    //** Table Background
    noStroke();
    fill(255, 150);
    this.w_geo = col_4;
    this.h_geo = 100 + 50 * wallSystem.array.length;
    rect(p.x, p.y, this.w_geo, this.h_geo); //** Set at metod end
    fill(0);

    //** Headline
    textAlign(LEFT, CENTER);
    textSize(30);
    text("Wall Geomtry", p.x, p.y - 25);

    //** Table Text
    textAlign(CENTER, CENTER);
    textSize(30);
    text("Wall", p.x + 50, p.y + 25);

    textAlign(RIGHT);
    text("t", p.x + col_2 - 15, p.y + 25);
    text("[mm]", p.x + col_2 - 15, p.y + 75);
    text("L", p.x + col_3 - 15, p.y + 25);
    text("[m]", p.x + col_3 - 15, p.y + 75);
    text("C", p.x + col_4 - 15, p.y + 25);
    text("[N/mm]", p.x + col_4 - 15, p.y + 75);
    //text("[kN]", p.x + col_4 - 15, p.y + 75);
    //text("Force", p.x + col_4 - 15, p.y + 25);
    //text("[kN]", p.x + col_4 - 15, p.y + 75);
    pop();

    //** Lines
    push();
    stroke(0);
    translate(p.x, p.y);
    let length = wallSystem.array.length;
    //** Horisontal
    line(-5, 0, col_4 + 5, 0);
    line(-5, 100, col_4 + 5, 100);
    line(-5, 100 + length * 50, col_4 + 5, 100 + length * 50);
    //** Vertical
    line(0, -5, 0, 100 + 50 * length + 5);
    line(100, -5, 100, 100 + 50 * length + 5);
    line(250, -5, 250, 100 + 50 * length + 5);
    line(col_3, -5, col_3, 100 + 50 * length + 5);
    line(col_4, -5, col_4, 100 + 50 * length + 5);
    pop();

    //** Values
    let Fx_sum = 0;
    let Fy_sum = 0;
    push();
    for (let i = 0, length = wallSystem.array.length; i < length; i++) {
      textAlign(CENTER, CENTER);
      textSize(30);
      let id = wallSystem.array[i].id;
      text(id, p.x + col_0 + 50, p.y + 127.5 + 50 * i);
      textAlign(RIGHT);

      let t = nf(wallSystem.array[i].t, 0, 0);
      let L = nf(wallSystem.array[i].wallLength / 1000, 0, 2);
      let S = nf(
        round(wallSystem.array[i].Cns_n / wallSystem.array[0].Cns_n, 2),
        0,
        2
      );

      /*
          //**Stiffness C=1/6*t*L^2 equivalent to C [N/mm]
    if (button_Shear.state == 1) {
      this.Cns_n = (1) * this.t * pow(this.wallLength, 1); //**(1)
      this.Cns_s = 0; //**noStiffnessPerpendicular //**(2)
      //console.log(this.wallLength )
    }
    
    //**Stiffness C=1/12*t*L^3 equivalent to C [N/mm]
    if (button_Bending.state == 1) {
      this.Cns_n = (1 / 12) * this.t * pow(this.wallLength, 3); //**(1)
      this.Cns_s = 0; //**noStiffnessPerpendicular //**(2)
    }
      */

      text(t, p.x + col_2 - 15, p.y + 130 + 50 * i);
      text(L, p.x + col_3 - 15, p.y + 130 + 50 * i);
      text(S, p.x + col_4 - 15 - 50, p.y + 130 + 50 * i);

      text("C", p.x + col_4 - 15 - 22, p.y + 130 + 50 * i);
      textSize(22);
      text("ref", p.x + col_4 - 15 + 5, p.y + 130 + 5 + 50 * i);
    }

    pop();
  }

  //** Called from this. DisplayWallCalc_CR(Pos)
  DisplayFormularRotationCenter(pos) {
    push();
    translate(pos.x, pos.y + 100);

    let C_rel = wallSystem.array[0].Cns_n;

    //** D
    textSize(30);
    textAlign(LEFT, CENTER);
    text("Center of Rotation (CR)", 50, 2.5);
    text("D", 50, 50 + 2.5);
    text("= A   A    - A", 100, 50 + 2.5);
    text("=", 450, 50 + 2.5);

    text("C", 570, 50 + 2.5);
    textSize(20);
    text("ref", 595, 57 + 2.5);
    text("2", 595, 37.5);
    textSize(30);

    //** x_CR
    text("x", 50, 100 + 2.5);
    text("= (A   B   + B   A   ) / D", 100, 100 + 2.5);
    text("=", 450, 100 + 2.5);
    text("m", 570, 100 + 2.5);

    //** y_CR
    text("y", 50, 150 + 2.5);
    text("= (A   B   + B   A   ) / D", 100, 150 + 2.5);
    text("=", 450, 150 + 2.5);
    text("m", 570, 150 + 2.5);

    //** Index D
    textSize(24);
    text("1", 150, 50 + 12 + 2.5);
    text("2", 195, 50 + 12 + 2.5);
    text("3", 265, 50 + 12 + 2.5);
    textSize(20);
    text("2", 270, 50 - 8 - 2.5);

    //** Index x
    textSize(24);
    text("1", 160, 100 + 12 + 2.5);
    text("2", 205, 100 + 12 + 2.5);
    text("1", 275, 100 + 12 + 2.5);
    text("3", 320, 100 + 12 + 2.5);
    textSize(18);
    text("CR", 67, 100 + 12 + 2.5);

    //** Index y
    textSize(24);
    text("2", 160, 150 + 12 + 2.5);
    text("1", 205, 150 + 12 + 2.5);
    text("2", 275, 150 + 12 + 2.5);
    text("3", 320, 150 + 12 + 2.5);
    textSize(18);
    text("CR", 67, 150 + 12 + 2.5);

    textSize(30);
    textAlign(RIGHT, CENTER);

    //** Values D
    text(nf(round(calculation.D / pow(C_rel, 2), 2), 0, 2), 550, 50 + 2.5);
    text(nf(round(calculation.FC_x / 1000, 2), 0, 2), 550, 100 + 2.5);
    text(nf(round(calculation.FC_y / 1000, 2), 0, 2), 550, 150 + 2.5);

    noFill();
    stroke(0);
    //circle(0, 0, 20);

    //** Cross
    stroke(255, 0, 0);
    strokeWeight(3);
    let posX = 25;
    let posY = 0;
    line(posX - 10, posY, posX + 10, posY);
    line(posX, posY - 10, posX, posY + 10);
    pop();
  }

  //** Called from this. DisplayWallCalc_CM(Pos)
  DisplayFormularMassCenter(pos) {
    push();
    translate(pos.x, pos.y + 100);

    let C_rel = wallSystem.array[0].Cns_n;

    //** D
    textSize(30);
    textAlign(LEFT, CENTER);
    text("Center of Mass (CM)", 50, 2.5);

    //** x_CR
    text("x", 50, 50 + 2.5);
    text("= Sx / A", 100, 50 + 2.5);
    text("=", 450, 50 + 2.5);
    text("m", 570, 50 + 2.5);

    //** y_CR
    text("y", 50, 100 + 2.5);
    text("= Sy / A", 100, 100 + 2.5);
    text("=", 450, 100 + 2.5);
    text("m", 570, 100 + 2.5);

    //** Index x
    textSize(18);
    text("CM", 67, 50 + 12 + 2.5);

    //** Index y

    textSize(18);
    text("CM", 67, 100 + 12 + 2.5);

    textSize(30);
    textAlign(RIGHT, CENTER);

    //** Values D
    //text(nf(round(calculation.D / pow(C_rel, 2), 2), 0, 2), 550, 50 + 2.5);
    text(nf(round(calculation.Tp_X / 1000, 2), 0, 2), 550, 50 + 2.5);
    text(nf(round(calculation.Tp_Y / 1000, 2), 0, 2), 550, 100 + 2.5);

    noFill();
    stroke(0);
    //circle(0, 0, 20);
    //** Cross
    stroke(0, 0, 250);
    strokeWeight(3);
    let posX = 25;
    let posY = 0;
    line(posX - 10, posY, posX + 10, posY);
    line(posX, posY - 10, posX, posY + 10);
    pop();
  }

  TableMoveSteps(pos) {
    //**pos.y in multioplum of stepChange
    //let stepChange = 10; //*scaleGeo;
    pos.x = round(pos.x / stepSize) * stepSize;
    pos.y = round(pos.y / stepSize) * stepSize;
    return pos;
  }

  //**Sort loadPoints or loadLines if one is deleted
  //**Called from sketch
  BubbleSortLoad(array) {
    for (let i = array.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (array[j].id > array[j + 1].id) {
          // swap
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
  }
}
