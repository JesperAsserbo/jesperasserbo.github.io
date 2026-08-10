class Table {
  constructor() {
    this.countLoggedInsertPoints = 0;

    //** Result
    //this.insertPointTabelDef = new p5.Vector(900, 1700);
    //this.insertPointTabelSpring = new p5.Vector(850, 500);
    this.insertPointTabelSupport = new p5.Vector(1850, 1700);

    //this.insertPointDefLog = false;
    //this.insertPointSpringLog = false;
    this.insertPointSupportLog = false;

    //** Input
    //this.insertPointTabelLoad = new p5.Vector(400, 1700);

    //this.insertPointLoadLog = false;

    this.rowOverlap = undefined;
    this.colOverlap = undefined;
  }

  //** 1 **
  OverlapInsertPoint(pos) {
    //** Move Table
    //** Called in sketch
    //** this.countLoggedInsertPoints set to 0 in sketch.mouseReleased

    let distInsertPointSupport = dist(
      pos.x,
      pos.y,
      this.insertPointTabelSupport.x,
      this.insertPointTabelSupport.y
    );

    if (distInsertPointSupport < 10) {
      this.OverlapHighligth(this.insertPointTabelSupport);
      if (this.countLoggedInsertPoints == 0) {
        //** LogState => move particle fast
        if (mouseIsPressed) {
          this.insertPointSupportLog = true;
          this.countLoggedInsertPoints++;
        } else {
          this.insertPointSupportLog = false;
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

    if (this.insertPointSupportLog) {
      this.insertPointTabelSupport.x = pos.x;
      this.insertPointTabelSupport.y = pos.y;
      movingObject = true; //** Flag Pan
    }
  }

  DisplayBoltInTable(pos) {
    push();
    let p = this.insertPointTabelSupport;

    let col_0 = 0; //** Bolt
    let col_1 = 100;
    let col_2 = 250;
    let col_3 = 400;
    let col_4 = 550;
    let col_5 = 700;
    let col_6 = 850; //** Fx
    let col_7 = 1000; //** Fy
    let col_8 = 1150;
    let col_9 = 1300; //** Fb,rd
    let col_10 = 1450; //** Fv,rd

    let top_Y = p.y + 100;
    let bottom_Y = p.y + 100 + boltGroup.length * 50;
    let left_X = p.x + col_0;
    let rigth_X = p.x + col_10;

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

      //** Find col in table
      let distToLeft_X = dist(mousePosWorld.x, p.y, left_X, p.y);
      let col = int(distToLeft_X / 150);
      //console.log("table line 90: " + col);

      //**Display Bolt
      if ((col) => 0) {
        //** Hihligth node
        push();
        fill(0, 0, 0, 50);
        noStroke();
        circle(
          boltGroup[row].pos_o_scaledGraph.x,
          boltGroup[row].pos_o_scaledGraph.y,
          50
        );

        //**Display in Table
        rect(p.x + 5, p.y + 100 + 5 + 50 * row, 1140, 40);
        stroke(0);
        line(
          pos.x,
          pos.y,
          boltGroup[row].pos_o_scaledGraph.x,
          boltGroup[row].pos_o_scaledGraph.y
        );
        pop();
      }
    }
    pop();

    //** Highligt in table when bolt is overlapped.
    for (let bolt in boltGroup) {
      push();
      if (boltGroup[bolt].OverlapBolt(pos)) {
        fill(0, 0, 0, 50);
        if (button_BoltDelete.state == 1) fill(255, 0, 0, 100);
        noStroke();
        rect(p.x + 5, p.y + 100 + 5 + 50 * boltGroup[bolt].id, 1140, 40);
      }
      pop();
    }
  }

  DisplayBolt(pos) {
    //*************************************************
    //************ Tabel Bolt ************ START ******
    //*************************************************
    let p = this.insertPointTabelSupport;
    let col_0 = 0; //** Bolt
    let col_1 = 100;
    let col_2 = 250;
    let col_3 = 400;
    let col_4 = 550;
    let col_5 = 700;
    let col_6 = 850; //** Fx
    let col_7 = 1000; //** Fy
    let col_8 = 1150;
    let col_9 = 1300; //** Fb,rd
    let col_10 = 1450; //** Fv,rd

    push();
    circle(p.x, p.y, 20);

    //** Table Background
    noStroke();
    fill(255, 150);
    let w = col_10;
    let h = 100 + 50 * boltGroup.length;
    rect(p.x, p.y, w, h); //** Set at metod end
    fill(0);

    //** Headline
    textAlign(LEFT, CENTER);
    textSize(30);
    //text("BoltForces", p.x, p.y - 25);

    //** Table Text
    textAlign(CENTER, CENTER);
    textSize(30);
    text("Bolt", p.x + 50, p.y + 25);

    textAlign(RIGHT);
    text("x", p.x + col_2 - 15, p.y + 25);
    text("[mm]", p.x + col_2 - 15, p.y + 75);
    text("y", p.x + col_3 - 15, p.y + 25);
    text("[mm]", p.x + col_3 - 15, p.y + 75);
    text("r", p.x + col_4 - 15, p.y + 25);
    text("[mm]", p.x + col_4 - 15, p.y + 75);
    text("Ip", p.x + col_5 - 15, p.y + 25);
    text("[mm  ]", p.x + col_5 - 15, p.y + 75);
    text("Fx", p.x + col_6 - 15, p.y + 25);
    text("[kN]", p.x + col_6 - 15, p.y + 75);
    text("Fy", p.x + col_7 - 15, p.y + 25);
    text("[kN]", p.x + col_7 - 15, p.y + 75);
    text("Fres", p.x + col_8 - 15, p.y + 25);
    text("[kN]", p.x + col_8 - 15, p.y + 75);
    text("F", p.x + col_9 - 15 - 45, p.y + 25);
    text("[kN]", p.x + col_9 - 15, p.y + 75);
    text("F", p.x + col_10 - 15 - 45, p.y + 25);
    text("[kN]", p.x + col_10 - 15, p.y + 75);
    textAlign(LEFT);
    text("Comment", p.x + col_10 + 15, p.y + 25);

    textSize(20);
    textAlign(RIGHT);
    text("2", p.x + col_5 - 27, p.y + 65);
    text("b,Rd", p.x + col_9 - 15, p.y + 35);
    textSize(24);
    text("v,Rd", p.x + col_10 - 15, p.y + 35);
    pop();

    //** Lines
    push();
    stroke(0);
    translate(p.x, p.y);
    let length = boltGroup.length;
    //** Horisontal
    line(-5, 0, col_10 + 5, 0);
    line(-5, 100, col_10 + 5, 100);
    line(-5, 100 + length * 50, col_10 + 5, 100 + length * 50);
    //** Vertical
    line(0, -5, 0, 100 + 50 * length + 5);
    line(col_1, -5, col_1, 100 + 50 * length + 5);
    line(col_2, -5, col_2, 100 + 50 * length + 5);
    line(col_3, -5, col_3, 100 + 50 * length + 5);
    line(col_4, -5, col_4, 100 + 50 * length + 5);
    line(col_5, -5, col_5, 100 + 50 * length + 5);
    line(col_6, -5, col_6, 100 + 50 * length + 5);
    line(col_7, -5, col_7, 100 + 50 * length + 5);
    line(col_8, -5, col_8, 100 + 50 * length + 5);
    line(col_9, -5, col_9, 100 + 50 * length + 5);
    line(col_10, -5, col_10, 100 + 50 * length + 5);
    pop();

    //** Values
    let Fx_sum = 0;
    let Fy_sum = 0;
    let r2_sum = 0;

    let decimals = 1;
    push();
    for (let i = 0, length = boltGroup.length; i < length; i++) {
      textAlign(CENTER, CENTER);
      textSize(30);
      let bolt = boltGroup[i].id;
      text(bolt, p.x + col_0 + 50, p.y + 127.5 + 50 * i);

      textAlign(RIGHT);

      //let supports_Temp = supports.copy

      let Fx = nf(boltGroup[i].F_Res.x / 1000, 0, decimals);
      let Fy = nf(boltGroup[i].F_Res.y / 1000, 0, decimals);
      let Fres = nf(boltGroup[i].F_Res.mag() / 1000, 0, decimals);
      let x = nf(boltGroup[i].pos_o_calc.x, 0, 0);
      let y = nf(boltGroup[i].pos_o_calc.y, 0, 0);
      let r = nf(boltGroup[i].r_Tp, 0, 1);
      let r2 = nf(boltGroup[i].r2_Tp, 0, 1);

      //this.ConvertToSciNot(r2, 0);

      //if (Fx == 0) Fx = "-";
      //if (Fy == 0) Fy = "-";

      text(Fres, p.x + col_8 - 15, p.y + 130 + 50 * i);
      text(Fx, p.x + col_6 - 15, p.y + 130 + 50 * i);
      text(Fy, p.x + col_7 - 15, p.y + 130 + 50 * i);
      text(x, p.x + col_2 - 15, p.y + 130 + 50 * i);
      text(y, p.x + col_3 - 15, p.y + 130 + 50 * i);
      text(r, p.x + col_4 - 15, p.y + 130 + 50 * i);
      text(r2, p.x + col_5 - 15, p.y + 130 + 50 * i);

      Fx_sum += boltGroup[i].F_Res.x;
      Fy_sum += boltGroup[i].F_Res.y;
      r2_sum += boltGroup[i].r2_Tp;

      //** Test Overlap bolt
      if (
        boltGroup[i].overlapAnotherBoltCenter == true &&
        boltGroup[i].overlapEdge == false
      ) {
        push();
        textAlign(LEFT);
        text("Adjust:   p  , p", p.x + col_10 + 15, p.y + 125 + 50 * i);

        textSize(22);
        text("1", p.x + col_10 + 150, p.y + 140 + 50 * i);
        text("2", p.x + col_10 + 200, p.y + 140 + 50 * i);

        //** Highligt in table when boltDist is insufficient.
        fill(255, 0, 0, 50);
        noStroke();
        rect(p.x + 5, p.y + 100 + 5 + 50 * boltGroup[i].id, 1140, 40);

        pop();
      }

      //** Test Overlap edge
      if (
        boltGroup[i].overlapAnotherBoltCenter == false &&
        boltGroup[i].overlapEdge == true
      ) {
        push();
        textAlign(LEFT);
        text("Adjust:   e  , e", p.x + col_10 + 15, p.y + 125 + 50 * i);

        textSize(22);
        text("1", p.x + col_10 + 150, p.y + 140 + 50 * i);
        text("2", p.x + col_10 + 200, p.y + 140 + 50 * i);

        //** Highligt in table when boltDist is insufficient.
        fill(255, 0, 0, 50);
        noStroke();
        rect(p.x + 5, p.y + 100 + 5 + 50 * boltGroup[i].id, 1140, 40);

        pop();
      }

      //** Test Overlap edge && bolt
      if (
        boltGroup[i].overlapAnotherBoltCenter == true &&
        boltGroup[i].overlapEdge == true
      ) {
        push();
        textAlign(LEFT);
        text(
          "Adjust:   p  , p  , e  , e ",
          p.x + col_10 + 15,
          p.y + 125 + 50 * i
        );

        textSize(22);
        text("1", p.x + col_10 + 150, p.y + 140 + 50 * i);
        text("2", p.x + col_10 + 200, p.y + 140 + 50 * i);
        text("1", p.x + col_10 + 250, p.y + 140 + 50 * i);
        text("2", p.x + col_10 + 300, p.y + 140 + 50 * i);

        //** Highligt in table when boltDist is insufficient.
        fill(255, 0, 0, 50);
        noStroke();
        rect(p.x + 5, p.y + 100 + 5 + 50 * boltGroup[i].id, 1140, 40);

        pop();
      }

      textAlign(RIGHT);
      //** Test Fbrd and Fvrd
      noStroke();
      if (calc.Fvrd > Fres) fill(0, 255, 0, 50);
      else fill(255, 0, 0, 50);
      rect(p.x + col_10 - 145, p.y + 105 + 50 * i, 140, 40);
      if (calc.Fbrd > Fres) fill(0, 255, 0, 50);
      else fill(255, 0, 0, 50);
      rect(p.x + col_9 - 145, p.y + 105 + 50 * i, 140, 40);

      fill(0);
      text(nf(round(calc.Fbrd, 1), 0, 1), p.x + col_9 - 15, p.y + 130 + 50 * i);
      text(
        nf(round(calc.Fvrd, 1), 0, 1),
        p.x + col_10 - 15,
        p.y + 130 + 50 * i
      );
    }

    //** SUM

    text(
      nf(round(Fx_sum / 1000, decimals), 0, decimals),
      p.x + col_6 - 15,
      p.y + 127.5 + 50 * boltGroup.length
    );
    text(
      nf(round(Fy_sum / 1000, decimals), 0, 1),
      p.x + col_7 - 15,
      p.y + 127.5 + 50 * boltGroup.length
    );
    text(
      nf(round(r2_sum, decimals), 0, decimals),
      p.x + col_5 - 15,
      p.y + 127.5 + 50 * boltGroup.length
    );
    pop();
  }

  TableMoveSteps(pos) {
    //**pos.y in multioplum of stepChange
    let stepChange = 10; //*scaleGeo;
    pos.x = round(pos.x / stepChange) * stepChange;
    pos.y = round(pos.y / stepChange) * stepChange;
    return pos;
  }

  //** 12 **
  ConvertToSciNot(number, precision) {
    this.power = Math.round(Math.log10(number));

    this.mantissa = (number * Math.pow(10, Math.abs(this.power))).toFixed(
      precision
    );
    if (number == 0) {
      this.mantissa = 0;
    }
  }

  DisplayButtonRollorInTable(pos) {
    push();
    let p = this.insertPointTabelSupport;

    let col_0 = 0; //** Node
    let col_1 = 100; //** Cy
    let col_2 = 250; //** Cz
    let col_3 = 500;

    let top_Y = p.y + 100;
    let bottom_Y = p.y + 100 + supports.length * 50;
    let left_X = p.x + col_1;
    let rigth_X = p.x + col_3;

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

      //** Find col in table
      let distToLeft_X = dist(mousePosWorld.x, p.y, left_X, p.y);
      let col = int(distToLeft_X / 150);
      //console.log("table line 90: " + col);

      /*
      for (let i = 0, length = supports.length; i < length; i++) {
        supports[i].buttonRollor_Cy.overlapCiffer = false;
      }*/

      //**Display ButtonRollor and Read Value Cz
      if (col > 0 && supports[row].Cz > 0) {
        //** Hihligth node
        push();
        fill(0, 255, 0, 100);
        noStroke();
        circle(supports[row].fixPoint_Cz.x, supports[row].fixPoint_Cz.y, 30);
        pop();

        let translatePoint_Cz = new p5.Vector();
        translatePoint_Cz.x = p.x + 275 - 17.5;
        translatePoint_Cz.y = p.y + 145 + row * 50;
        translate(translatePoint_Cz.x, translatePoint_Cz.y);

        supports[row].graphPosNoScale_Cz = new p5.Vector.sub(
          mousePosWorld,
          translatePoint_Cz
        );

        //supports[row].buttonRollor_Cz.overlapCiffer = true;

        push();
        noStroke();
        fill(255, 255, 255);
        rect(5, -40, 150, 40);
        pop();

        supports[row].buttonRollor_Cz.DisplayButonRollor(
          supports[row].graphPosNoScale_Cz
        );
        supports[row].Cz = supports[row].buttonRollor_Cz.ReadValue() * 1000e6;
      }

      //**Display ButtonRollor and Read Value Cy
      if (col == 0 && supports[row].Cy > 0) {
        //** Hihligth node
        push();
        fill(0, 255, 0, 100);
        noStroke();
        circle(supports[row].fixPoint.x, supports[row].fixPoint.y, 30);
        pop();

        let translatePoint_Cy = new p5.Vector();
        translatePoint_Cy.x = p.x + col_1 - 17.5;
        translatePoint_Cy.y = p.y + 145 + row * 50;
        translate(translatePoint_Cy.x, translatePoint_Cy.y);

        supports[row].graphPosNoScale_Cy = new p5.Vector.sub(
          mousePosWorld,
          translatePoint_Cy
        );

        //supports[row].buttonRollor_Cy.overlapCiffer = true;

        push();
        noStroke();
        fill(255, 255, 255);
        rect(45, -40, 110, 40);
        pop();

        supports[row].buttonRollor_Cy.DisplayButonRollor(
          supports[row].graphPosNoScale_Cy
        );
        supports[row].Cy = supports[row].buttonRollor_Cy.ReadValue() * 1000;
      }
    } else {
      //** Sets all overlapCiffer to false
      for (let i = 0, length = supports.length; i < length; i++) {
        supports[i].buttonRollor_Cy.overlapCiffer = false;
        supports[i].buttonRollor_Cz.overlapCiffer = false;
      }
    }

    pop();
  }
}
