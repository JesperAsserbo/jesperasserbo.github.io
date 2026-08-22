//** 1 - OverlapInsertPoint(pos)
//** 2 - MoveInSteps(pos, insertPoint)
//** 3 - TabelResultSupport()
//** 4 - TabelResultLoad()
//** 5 - TabelResult()
//** 6 - TestForEqu()
//** 7 - Def()
//** 8 - AngleDef()
//** 9 - DiagonalDef()
//** 10 - DisplayDef()
//** 11 - Reaction()
//** 12 - DisplayReaction()
//** 13 - DisplayReactionValue()
//** 14 - Arrow(centerX, centerY, color, rotation, len, offSetX, offSetY)
//** 15 - Shear()
//** 16 - ShearDisplay()
//** 17 - ShearForceDisplay()
//** 18 - StringerForceHorisontal()
//** 19 - StringerForceVertical()
//** 20 - StringerForceMaxMin()
//** 21 - StringerForceVerticalDisplayShade()
//** 22 - StringerForceHorisontalDisplayShade()
//** 23 - StringerForceHorisontalDisplayColor()
//** 24 - StringerForceVerticalDisplayColor()
//** 25 - DisplayStringerHorisontal() => //** 27 - OverlapInsertPointStringer(pos)
//**                                  => //** 29 - MoveInsertPointStringer(pos)
//** 26 - DisplayStringerVertical() => //** 28 - OverlapInsertPointStringerVertical(pos)
//**                                => //** 29 - MoveInsertPointStringer(pos)
//** 30 - SetGradient(x, y, w, h, c1, c2)
//** 31 - SetGradientVertical(x, y, w, h, c1, c2)

class Result {
  constructor() {
    this.matrixReaction = [];
    this.matrixShear = [];
    this.matrixDef = [];
    this.matrixStringerHorisontal = [];
    this.matrixStringerVertical = [];

    this.tableSupportLength = 0;
    this.tableLoadLength = 0;

    this.stringerMaxMin = 0;

    this.intensityColor = 200;
    this.colorWidth = 10;

    this.insertPointEqu = new p5.Vector(1000, 1090);
    this.insertPointTabel = new p5.Vector(1100, 1500);
    this.insertPointTabelSupport = new p5.Vector(1700, 1000);
    this.insertPointTabelLoad = new p5.Vector(1100, 1000);

    //** Stringer with Values
    this.insertPointstringerHorisontal = new p5.Vector(400, 2300);
    this.insertPointStringerHor = []; //new p5.Vector(500, 2000);
    this.insertPointstringerVertical = new p5.Vector(1000, 2150);
    this.insertPointStringerVer = []; //new p5.Vector(500, 2000);

    this.insertPointTabelRadius = 20;
    this.insertPointTabelSupportRadius = 20;
    this.insertPointTabelLoadRadius = 20;

    this.insertPointLog = false;
    this.insertPointLogSupport = false;
    this.insertPointLogLoad = false;

    this.resultTableRowLog;
    this.resultTableColLog;

    this.resultTableSupportRowLog;
    this.resultTableSupportColLog;

    this.resultTableLoadRowLog;
    this.resultTableLoadColLog;

    this.stepChange = 25;

    //** ZeroMatrix
    for (let row = 0; row < skinSystem.rowsSkin; row++) {
      this.matrixReaction[row] = [];
      this.matrixShear[row] = [];
      this.matrixDef[row] = [];
      for (let col = 0; col < skinSystem.columnsSkin; col++) {
        this.matrixReaction[row][col] = [0, 0]; //** [Rx,Ry]
        this.matrixShear[row][col] = 0;
        this.matrixDef[row][col] = [0, 0]; //** [Ux,Uy]
      }
    }
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 1
  OverlapInsertPoint(pos) {
    //** Move Table
    //** Called in sketch
    let distInsertPoint = dist(
      pos.x,
      pos.y,
      this.insertPointTabel.x,
      this.insertPointTabel.y
    );

    let distInsertPointSupport = dist(
      pos.x,
      pos.y,
      this.insertPointTabelSupport.x,
      this.insertPointTabelSupport.y
    );

    let distInsertPointLoad = dist(
      pos.x,
      pos.y,
      this.insertPointTabelLoad.x,
      this.insertPointTabelLoad.y
    );

    if (distInsertPoint < 50) {
      this.insertPointLog = true;
    } else if (distInsertPointSupport < 50) {
      this.insertPointLogSupport = true;
    } else if (distInsertPointLoad < 50) {
      this.insertPointLogLoad = true;
    }
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 2
  MoveInSteps(pos, insertPoint) {
    //** If logged => move node

    push();
    if (mouseIsPressed) {

      fill(0, 250, 0, 100);
      circle(insertPoint.x, insertPoint.y, 20);

      //**pos.y in multioplum of this.stepChange
      let remainderX = int(pos.y) % this.stepChange;
      if (remainderX > this.stepChange / 2)
        pos.y = int(pos.y) + (this.stepChange - remainderX);
      if (remainderX <= this.stepChange / 2) pos.y = int(pos.y) - remainderX;

      insertPoint.y = pos.y;

      //**pos.x in multioplum of this.stepChange
      let remainderY = int(pos.x) % this.stepChange;
      if (remainderY > this.stepChange / 2)
        pos.x = int(pos.x) + (this.stepChange - remainderY);
      if (remainderY <= this.stepChange / 2) pos.x = int(pos.x) - remainderY;

      insertPoint.x = pos.x;
      //}
    } else {
      fill(100, 100, 100, 100);
      circle(insertPoint.x, insertPoint.y, 20);

      this.insertPointLog = false;
      this.insertPointLogSupport = false;
      this.insertPointLogLoad = false;
    }
    pop();
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 3
  TabelResultSupport() {
    let p = this.insertPointTabelSupport;
    let col_0 = 50; //** Row
    let col_1 = 150; //** Col
    let col_2 = 275; //** Cx
    let col_3 = 425; //** Cy
    let col_4 = 575; //** Rx
    let col_5 = 725; //** Ry

    push();
    circle(p.x, p.y, this.insertPointTabelSupportRadius);

    let count = 0;

    //** Table Background
    noStroke();
    fill(255, 150);
    rect(p.x, p.y, 800, 100 + 50 * this.tableSupportLength);

    fill(0);

    //** Headline
    textAlign(LEFT, CENTER);
    textSize(40);
    text("Support", p.x, p.y - 25);

    //** Table Text
    textAlign(CENTER, CENTER);
    textSize(30);
    text("Node", p.x + 50, p.y + 25);
    text("Row", p.x + col_0, p.y + 75);
    text("Col", p.x + col_1, p.y + 75);
    text("Cx", p.x + col_2, p.y + 25);
    text("[kN/mm]", p.x + col_2, p.y + 75);
    text("Cy", p.x + col_3, p.y + 25);
    text("[kN/mm]", p.x + col_3, p.y + 75);
    text("Rx", p.x + col_4, p.y + 25);
    text("[kN]", p.x + col_4, p.y + 75);
    text("Ry", p.x + col_5, p.y + 25);
    text("[kN]", p.x + col_5, p.y + 75);

    let countOverlap = 0;
    for (let row = 0; row < grid.rowsTotal; row++) {
      for (let col = 0; col < grid.columnsTotal; col++) {
        let Cx = matrixSupport.matrixSupport[row][col].supportExist_Cx;
        let Cy = matrixSupport.matrixSupport[row][col].supportExist_Cy;
        let Rx = round(this.matrixReaction[row][col][0] / 1000, 2);
        let Ry = round(this.matrixReaction[row][col][1] / 1000, 2);

        if (Cy || Cx) {
          count++;

          //** Highligt node in table
          if (grid.OverlapNode(mousePosWorld)) {
            let rowOverlap = grid.rowNearest;
            let colOverlap = grid.columnNearest;

            if (row == rowOverlap && col == colOverlap) {
              noStroke();
              if (!mouseIsPressed) {
                push();
                fill(0, 250, 0, 100);
                rect(
                  p.x + col_0 - 45,
                  p.y + 50 * (count - 1) + 100 + 5,
                  790,
                  40
                );
                pop();
              }
            }
          }
          //** Highligt END

          text(row, p.x + col_0, p.y + 50 * count + 75 + 2.5);

          let x1 = p.x + col_1;
          let y1 = p.y + 50 * (count - 1) + 125 + 2.5;

          let x2 = p.x + col_2;
          let y2 = p.y + 50 * (count - 1) + 125 + 2.5;

          let x3 = p.x + col_3;
          let y3 = p.y + 50 * (count - 1) + 125 + 2.5;

          let x4 = p.x + col_4;
          let y4 = p.y + 50 * (count - 1) + 125 + 2.5;

          let x5 = p.x + col_5;
          let y5 = p.y + 50 * (count - 1) + 125 + 2.5;

          text(col, x1, y1);

          //** Text
          textAlign(RIGHT);

          let Cx = matrixSupport.matrixSupport[row][col].Cx / 1000;
          let Cy = matrixSupport.matrixSupport[row][col].Cy / 1000;

          //** 2 buttonRollors => setValue so that the same in both buttonRollors
          if (!inTheCalcZone && !inTheCalcZoneTable) {
            matrixSupport.matrixSupport[row][col].buttonRollor_Cx.SetValue(Cx);
            matrixSupport.matrixSupport[row][col].buttonRollorTable_Cx.SetValue(
              Cx
            );
            matrixSupport.matrixSupport[row][col].buttonRollor_Cy.SetValue(Cy);
            matrixSupport.matrixSupport[row][col].buttonRollorTable_Cy.SetValue(
              Cy
            );
          }

          //** Cx && Cy
          if (Cx != 0) text(nf(Cx, 0, 1), x2 + 50, y2);
          else text("-", x2 + 50, y2);

          if (Cy != 0) text(nf(Cy, 0, 1), x3 + 50, y3);
          else text("-", x3 + 50, y3);

          //** [Rx,Ry]
          let Rx = round(this.matrixReaction[row][col][0] / 1000, 2);
          if (
            !isNaN(Rx) &&
            matrixSupport.matrixSupport[row][col].supportExist_Cx
          ) {
            text(nf(Rx, 0, 2), x4 + 50, y4);
          } else {
            text("-", x4 + 50, y4);
          }

          //** [Rx,Ry]
          let Ry = round(this.matrixReaction[row][col][1] / 1000, 2);
          if (
            !isNaN(Ry) &&
            matrixSupport.matrixSupport[row][col].supportExist_Cy
          ) {
            text(nf(Ry, 0, 2), x5 + 50, y5);
          } else {
            text("-", x5 + 50, y5);
          }

          //** support.fixPoint_Cx placed (if supportExist_Cx )
          if (matrixSupport.matrixSupport[row][col].supportExist_Cx) {
            matrixSupport.matrixSupport[row][col].fixPointTable_Cx.x = x2;
            matrixSupport.matrixSupport[row][col].fixPointTable_Cx.y = y2;

            //** Check for Overlap (=> display buttonRollor)
            matrixSupport.matrixSupport[row][col].OverlapFixPointTable_Cx();
          }

          //** support.fixPoint_Cy placed (if supportExist_Cy )
          if (matrixSupport.matrixSupport[row][col].supportExist_Cy) {
            matrixSupport.matrixSupport[row][col].fixPointTable_Cy.x = x3;
            matrixSupport.matrixSupport[row][col].fixPointTable_Cy.y = y3;

            //** Check for Overlap (=> display buttonRollor)
            matrixSupport.matrixSupport[row][col].OverlapFixPointTable_Cy();
          }

          //** Highligth skin in model
          //** Overlap
          noStroke();
          if (
            matrixSupport.matrixSupport[row][col].fixPointTableOverlap_Cx ||
            matrixSupport.matrixSupport[row][col].fixPointTableOverlap_Cy
          ) {
            countOverlap++;

            //** Log row and col used in mouseWheelFunction
            this.resultTableSupportRowLog = row;
            this.resultTableSupportColLog = col;

            //** Log row and col
            matrixSupport.rowLogTable = row;
            matrixSupport.colLogTable = col;

            //** Highligth node in model
            fill(0, 250, 0, 150);
            circle(
              matrixSupport.matrixSupport[row][col].pos.x,
              matrixSupport.matrixSupport[row][col].pos.y,
              40
            );
            fill(0);
          }

          textAlign(CENTER);
        }
      }
    }

    //** If count changes => store in this.tableSupportLength
    //** Used in table to determine heigth of background
    if (this.tableSupportLength != count) this.tableSupportLength = count;

    //** Reset values when not fixPointOverlap_t => can delete skin
    if (countOverlap == 0) {
      this.resultTableSupportRowLog = undefined;
      this.resultTableSupportColLog = undefined;

      matrixSupport.rowLogTable = undefined;
      matrixSupport.colLogTable = undefined;
    }

    //** Lines
    stroke(100, 100, 100, 250);
    strokeWeight(2);
    let tabel_h = 50 * this.tableSupportLength;
    //** Horisontal Lines
    line(p.x - 5, p.y, p.x + col_5 + 80, p.y);
    line(p.x - 5, p.y + 100, p.x + col_5 + 80, p.y + 100);

    line(p.x - 5, p.y + tabel_h + 100, p.x + col_5 + 80, p.y + tabel_h + 100);

    //** Vertical lines
    line(p.x, p.y - 5, p.x, p.y + tabel_h + 105);
    line(p.x + 100, p.y + 45, p.x + 100, p.y + tabel_h + 105);
    line(p.x + 200, p.y - 5, p.x + 200, p.y + tabel_h + 105);
    line(p.x + 350, p.y - 5, p.x + 350, p.y + tabel_h + 105);
    line(p.x + 500, p.y - 5, p.x + 500, p.y + tabel_h + 105);
    line(p.x + 650, p.y - 5, p.x + 650, p.y + tabel_h + 105);
    line(p.x + 800, p.y - 5, p.x + 800, p.y + tabel_h + 105);
    //**

    pop();
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 4
  TabelResultLoad() {
    //*************************************************
    //************ Tabel Loads ************** START ***
    //*************************************************
    let p = this.insertPointTabelLoad;
    let col_0 = 50; //** Row
    let col_1 = 150; //** Col
    let col_2 = 275; //** Px
    let col_3 = 425; //** Py

    push();
    circle(p.x, p.y, this.insertPointTabelLoadRadius);

    let count = 0;

    //** Table Background
    noStroke();
    fill(255, 150);
    rect(p.x, p.y, 500, 100 + 50 * this.tableLoadLength); //** Set at metod end
    fill(0);

    //** Headline
    textAlign(LEFT, CENTER);
    textSize(40);
    text("Load", p.x, p.y - 25);

    //** Table Text
    textAlign(CENTER, CENTER);
    textSize(30);
    text("Node", p.x + 50, p.y + 25);
    text("Row", p.x + col_0, p.y + 75);
    text("Col", p.x + col_1, p.y + 75);
    text("Px", p.x + col_2, p.y + 25);
    text("[kN]", p.x + col_2, p.y + 75);
    text("Py", p.x + col_3, p.y + 25);
    text("[kN]", p.x + col_3, p.y + 75);

    let countOverlap = 0;
    for (let row = 0; row < grid.rowsTotal; row++) {
      for (let col = 0; col < grid.columnsTotal; col++) {
        let Px = matrixLoad.matrixLoad[row][col].loadExist_Px;
        let Py = matrixLoad.matrixLoad[row][col].loadExist_Py;

        if (Py || Px) {
          count++;

          //** Highligt node in table
          if (grid.OverlapNode(mousePosWorld)) {
            let rowOverlap = grid.rowNearest;
            let colOverlap = grid.columnNearest;

            if (row == rowOverlap && col == colOverlap) {
              noStroke();
              if (!mouseIsPressed) {
                push();
                fill(0, 250, 0, 100);
                rect(
                  p.x + col_0 - 45,
                  p.y + 50 * (count - 1) + 100 + 5,
                  490,
                  40
                );
                pop();
              }
            }
          }
          //** Highligt END

          text(row, p.x + col_0, p.y + 50 * count + 75 + 2.5);

          let x1 = p.x + col_1;
          let y1 = p.y + 50 * (count - 1) + 125 + 2.5;

          let x2 = p.x + col_2;
          let y2 = p.y + 50 * (count - 1) + 125 + 2.5;

          let x3 = p.x + col_3;
          let y3 = p.y + 50 * (count - 1) + 125 + 2.5;

          text(col, x1, y1);

          //** Text
          textAlign(RIGHT);

          let Px = matrixLoad.matrixLoad[row][col].Px / 1000;
          let Py = matrixLoad.matrixLoad[row][col].Py / 1000;

          //** 2 buttonRollors => setValue so that the same in both buttonRollors
          if (!inTheCalcZone && !inTheCalcZoneTable) {
            matrixLoad.matrixLoad[row][col].buttonRollor_Px.SetValue(Px);
            matrixLoad.matrixLoad[row][col].buttonRollorTable_Px.SetValue(Px);
            matrixLoad.matrixLoad[row][col].buttonRollor_Py.SetValue(Py);
            matrixLoad.matrixLoad[row][col].buttonRollorTable_Py.SetValue(Py);
          }

          //** Px && Py
          if (Px != 0) text(nf(Px, 0, 1), x2 + 50, y2);
          else text("-", x2 + 50, y2);

          if (Py != 0) text(nf(Py, 0, 1), x3 + 50, y3);
          else text("-", x3 + 50, y3);

          //** load.fixPoint_Px placed (if loadExist_Px )
          if (matrixLoad.matrixLoad[row][col].loadExist_Px) {
            matrixLoad.matrixLoad[row][col].fixPointTable_Px.x = x2;
            matrixLoad.matrixLoad[row][col].fixPointTable_Px.y = y2;

            //** Check for Overlap (=> display buttonRollor)
            matrixLoad.matrixLoad[row][col].OverlapFixPointTable_Px();
          }

          //** load.fixPoint_Py placed (if loadExist_Py )
          if (matrixLoad.matrixLoad[row][col].loadExist_Py) {
            matrixLoad.matrixLoad[row][col].fixPointTable_Py.x = x3;
            matrixLoad.matrixLoad[row][col].fixPointTable_Py.y = y3;

            //** Check for Overlap (=> display buttonRollor)
            matrixLoad.matrixLoad[row][col].OverlapFixPointTable_Py();
          }

          //** Highligth skin in model
          //** Overlap
          noStroke();
          if (
            matrixLoad.matrixLoad[row][col].fixPointTableOverlap_Px ||
            matrixLoad.matrixLoad[row][col].fixPointTableOverlap_Py
          ) {
            countOverlap++;

            //** Log row and col used in mouseWheelFunction
            this.resultTableLoadRowLog = row;
            this.resultTableLoadColLog = col;

            //** Log row and col
            matrixLoad.rowLogTable = row;
            matrixLoad.colLogTable = col;

            //** Highligth node in model
            fill(0, 250, 0, 150);
            circle(
              matrixLoad.matrixLoad[row][col].pos.x,
              matrixLoad.matrixLoad[row][col].pos.y,
              40
            );
            fill(0);
          }

          textAlign(CENTER);
        }
      }
    }

    //** If count changes => store in this.tableSupportLength
    //** Used in table to determine heigth of background
    if (this.tableLoadLength != count) this.tableLoadLength = count;

    //** Reset values when not fixPointOverlap_t => can delete skin
    if (countOverlap == 0) {
      this.resultTableLoadRowLog = undefined;
      this.resultTableLoadColLog = undefined;

      matrixLoad.rowLogTable = undefined;
      matrixLoad.colLogTable = undefined;
    }

    /*
    console.log(
      "rowLog: " +
        matrixSupport.rowLogTable +
        " colLog: " +
        matrixSupport.colLogTable
    );
    */

    //** Lines
    stroke(100, 100, 100, 250);
    strokeWeight(2);
    let tabel_h = 50 * this.tableLoadLength;
    //** Horisontal Lines
    line(p.x - 5, p.y, p.x + col_3 + 80, p.y);
    line(p.x - 5, p.y + 100, p.x + col_3 + 80, p.y + 100);

    line(p.x - 5, p.y + tabel_h + 100, p.x + col_3 + 80, p.y + tabel_h + 100);

    //** Vertical lines
    line(p.x, p.y - 5, p.x, p.y + tabel_h + 105);
    line(p.x + 100, p.y + 45, p.x + 100, p.y + tabel_h + 105);
    line(p.x + 200, p.y - 5, p.x + 200, p.y + tabel_h + 105);
    line(p.x + 350, p.y - 5, p.x + 350, p.y + tabel_h + 105);
    line(p.x + 500, p.y - 5, p.x + 500, p.y + tabel_h + 105);

    //**

    pop();
    //***********************************************
    //************ Tabel Loads ************** END ***
    //***********************************************
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 5
  TabelResult() {
    let p = this.insertPointTabel;
    let col_0 = 50; //** Row
    let col_1 = 150; //** Col
    let col_2 = 300; //** t
    let col_3 = 425; //** V

    push();
    circle(p.x, p.y, this.insertPointTabelRadius);

    let count = 0;

    //** Highligt skin in table
    let rowOverlap = skinSystem.rowLog;
    let colOverlap = skinSystem.colLog;

    fill(0, 250, 0, 200);
    noStroke();
    if (!mouseIsPressed) {
      rect(
        p.x + col_0 - 45,
        p.y +
          5 +
          (50 * colOverlap - 25) +
          50 * (rowOverlap * skinSystem.columnsSkin) +
          125,
        490,
        40
      );
    }

    //** Table Background
    fill(255, 150);
    rect(
      p.x,
      p.y,
      500,
      100 + 50 * skinSystem.rowsSkin * skinSystem.columnsSkin
    );

    fill(0);

    //** Headline
    textAlign(LEFT, CENTER);
    textSize(40);
    text("ShearForce", p.x, p.y - 25);

    //** Table Text
    textAlign(CENTER, CENTER);
    textSize(30);

    text("Skin", p.x + 50, p.y + 25);
    text("Row", p.x + col_0, p.y + 75);
    text("Col", p.x + col_1, p.y + 75);
    text("t", p.x + col_2 - 25, p.y + 25);
    text("[mm]", p.x + col_2 - 25, p.y + 75);
    text("V", p.x + col_3, p.y + 25);
    text("[kN/m]", p.x + col_3, p.y + 75);

    let countOverlap = 0;
    for (let row = 0; row < skinSystem.rowsSkin; row++) {
      text(row, p.x + col_0, p.y + 50 * count + 125 + 2.5);
      for (let col = 0; col < skinSystem.columnsSkin; col++) {
        count++;

        let x1 = p.x + col_1;
        let y1 = p.y + 50 * (count - 1) + 125 + 2.5;

        let x2 = p.x + col_2 + 25;
        let y2 = p.y + 50 * (count - 1) + 125 + 2.5;

        let x3 = p.x + col_3 + 50; //** Shear
        let y3 = p.y + 50 * (count - 1) + 125 + 2.5;

        text(col, x1, y1);

        if (skinSystem.skinMatrix[row][col].skinExist) {
          textAlign(RIGHT);
          text(nf(skinSystem.skinMatrix[row][col].t, 0, 1), x2, y2);

          if (isNaN(skinSystem.skinMatrix[row][col].shear))
            skinSystem.skinMatrix[row][col].shear = 0;
          text(
            nf(round(skinSystem.skinMatrix[row][col].shear, 2), 0, 2),
            x3,
            y3
          );
          textAlign(CENTER);

          //** skin.fixPoint_t placed
          skinSystem.skinMatrix[row][col].fixPoint_t.x = x2 - 40;
          skinSystem.skinMatrix[row][col].fixPoint_t.y = y2;

          //** Highligth skin in model
          //** Overlap
          noStroke();
          if (skinSystem.skinMatrix[row][col].fixPointOverlap_t) {
            countOverlap++;
            let topLeft = skinSystem.skinMatrix[row][col].startPos;
            let h = skinSystem.skinMatrix[row][col].h;
            let w = skinSystem.skinMatrix[row][col].w;

            //** Log row and col
            skinSystem.rowLog = row;
            skinSystem.colLog = col;

            //** Log row and col used in mouseWheelFunction
            this.resultTableRowLog = row;
            this.resultTableColLog = col;

            //** Highligth skin in model
            fill(0, 250, 0, 100);
            rect(topLeft.x, topLeft.y, w, h);
            fill(0);

            /*
            console.log(
              "Row: " + skinSystem.rowLog + " Col: " + skinSystem.colLog
            );*/
          }
        } else {
          text("-", x2 - 10 + 2.5, y2);
          text("-", x3 - 10 + 2.5, y3);
        }
      }
    }

    //console.log("result line 130: reset values ");
    //** Reset values when not fixPointOverlap_t => can delete skin
    if (countOverlap == 0) {
      this.resultTableRowLog = undefined;
      this.resultTableColLog = undefined;
    }

    //** Lines
    stroke(100, 100, 100, 250);
    strokeWeight(2);
    let tabel_h = 50 * (skinSystem.rowsSkin * skinSystem.columnsSkin);
    //** Horisontal Lines
    line(p.x - 5, p.y, p.x + col_3 + 80, p.y);
    line(p.x - 5, p.y + 100, p.x + col_3 + 80, p.y + 100);
    for (let row = 0; row < skinSystem.rowsSkin; row++) {
      line(
        p.x - 5,
        p.y + 100 + 50 * row * skinSystem.columnsSkin,
        p.x + col_3 + 80,
        p.y + 100 + 50 * row * skinSystem.columnsSkin
      );
    }
    line(p.x - 5, p.y + tabel_h + 100, p.x + col_3 + 80, p.y + tabel_h + 100);

    //** Vertical lines
    line(p.x, p.y - 5, p.x, p.y + tabel_h + 105);
    line(p.x + 100, p.y + 45, p.x + 100, p.y + tabel_h + 105);
    line(p.x + 200, p.y - 5, p.x + 200, p.y + tabel_h + 105);
    line(p.x + 350, p.y - 5, p.x + 350, p.y + tabel_h + 105);
    line(p.x + 500, p.y - 5, p.x + 500, p.y + tabel_h + 105);
    //**

    pop();
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 6
  TestForEqu() {
    let numberOfSupports = 0;
    let numberOfSkins = 0;
    let numberOfCuts = skinSystem.unknowns - 3;
    let numberOfEquations = 3; //** Moment og 2x projektion

    //** Udvendig statisk
    //** Ubekendte: Supports
    //** Ligninger: 3xLigninger
    //** Overtallige = supports-ligninger >= 0

    //** Indvendig statisk
    //** Ubekendte: Skiver
    //** Ligninger: ligninger_ind = snit -1 (statisk uafhængige projektionsligninger)
    //** Overtallige = skiver - ligninger_ind

    //** Udregning hvis
    //** min 3 understøtninger
    //** Kontrol ligevægt

    //** Ubekendte: numberOfSupprts
    for (let row = 0; row < matrixSupport.matrixSupport.length; row++) {
      for (let col = 0; col < matrixSupport.matrixSupport[0].length; col++) {
        if (matrixSupport.matrixSupport[row][col].Cx != 0)
          numberOfSupports += 1;
        if (matrixSupport.matrixSupport[row][col].Cy != 0)
          numberOfSupports += 1;
      }
    }
    //console.log(numberOfSupports);

    //** Ubekendte: numberOfSkins
    for (let row = 0; row < skinSystem.rowsSkin; row++) {
      for (let col = 0; col < skinSystem.columnsSkin; col++) {
        if (skinSystem.skinMatrix[row][col].skinExist) numberOfSkins += 1;
      }
    }
    //console.log(numberOfSkins);
    //console.log(numberOfCuts);

    let unknownsOuter = numberOfSupports;
    let knownsOuter = 3;
    let ovetalligOuter = unknownsOuter - knownsOuter;

    let unknownsInner = numberOfSkins;
    let knownsInner = numberOfCuts;
    let ovetalligInner = unknownsInner - knownsInner;

    push();
    textSize(20);
    textAlign(LEFT);

    text("Number Of Supports: ", this.insertPointEqu.x, this.insertPointEqu.y);
    text(
      "Number Of Equations: ",
      this.insertPointEqu.x,
      this.insertPointEqu.y + 30
    );
    text(
      "Static unknowns (Outer): ",
      this.insertPointEqu.x,
      this.insertPointEqu.y + 60
    );

    let xAdjust = 400;
    textAlign(RIGHT);

    strokeWeight(2);
    line(
      this.insertPointEqu.x + xAdjust,
      this.insertPointEqu.y + 65,
      this.insertPointEqu.x + xAdjust - 50,
      this.insertPointEqu.y + 65
    );
    line(
      this.insertPointEqu.x + xAdjust - 45,
      this.insertPointEqu.y + 15,
      this.insertPointEqu.x + xAdjust - 35,
      this.insertPointEqu.y + 15
    );
    //noStroke();
    text(unknownsOuter, this.insertPointEqu.x + xAdjust, this.insertPointEqu.y);
    text(
      knownsOuter,
      this.insertPointEqu.x + xAdjust,
      this.insertPointEqu.y + 30
    );
    text(
      ovetalligOuter,
      this.insertPointEqu.x + xAdjust,
      this.insertPointEqu.y + 60
    );

    xAdjust = 500;
    textAlign(LEFT);
    text(
      "Number Of Skins: ",
      this.insertPointEqu.x + xAdjust,
      this.insertPointEqu.y
    );
    text(
      "Number Of Equations: ",
      this.insertPointEqu.x + xAdjust,
      this.insertPointEqu.y + 30
    );
    text(
      "Static unknowns (Inner): ",
      this.insertPointEqu.x + xAdjust,
      this.insertPointEqu.y + 60
    );

    xAdjust = 900;
    textAlign(RIGHT);
    strokeWeight(2);
    line(
      this.insertPointEqu.x + xAdjust,
      this.insertPointEqu.y + 65,
      this.insertPointEqu.x + xAdjust - 50,
      this.insertPointEqu.y + 65
    );
    line(
      this.insertPointEqu.x + xAdjust - 45,
      this.insertPointEqu.y + 15,
      this.insertPointEqu.x + xAdjust - 35,
      this.insertPointEqu.y + 15
    );
    text(unknownsInner, this.insertPointEqu.x + xAdjust, this.insertPointEqu.y);
    text(
      knownsInner,
      this.insertPointEqu.x + xAdjust,
      this.insertPointEqu.y + 30
    );

    text(
      ovetalligInner,
      this.insertPointEqu.x + xAdjust,
      this.insertPointEqu.y + 60
    );
    //console.log("Overtallige - Result line 53: " + ovetallig);
    pop();
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 7
  Def() {
    //** ZeroMatrix
    this.matrixDef = [];
    for (let row = 0; row < grid.rowsTotal; row++) {
      this.matrixDef[row] = [];
      for (let col = 0; col < grid.columnsTotal; col++) {
        //** Def [x,y]
        this.matrixDef[row][col] = [0, 0];
      }
    }

    //** Deformation Horisontal [x]
    let stringer = 0;
    for (
      stringer = 0;
      stringer < skinSystem.stringerHorisontal.length;
      stringer++
    ) {
      for (let row = 0; row < grid.rowsTotal; row++) {
        for (let col = 0; col < grid.columnsTotal; col++) {
          //** same Y coordinate
          if (
            skinSystem.stringerHorisontal[stringer][0] ==
            grid.gridNodes[row][col][1]
          ) {
            //** x-interval
            let x_start = skinSystem.stringerHorisontal[stringer][1];
            let x_end =
              skinSystem.stringerHorisontal[stringer][
                skinSystem.stringerHorisontal[stringer].length - 1
              ];
            if (
              x_start <= grid.gridNodes[row][col][0] &&
              grid.gridNodes[row][col][0] <= x_end
            ) {
              this.matrixDef[row][col][0] = matrix_x[stringer][0];
            }
          }
        }
      }
    }

    //** Deformation Vertical [y]
    for (
      let stringerVer = 0;
      stringerVer < skinSystem.stringerVertical.length;
      stringerVer++
    ) {
      for (let row = 0; row < grid.rowsTotal; row++) {
        for (let col = 0; col < grid.columnsTotal; col++) {
          //** same X coordinate
          if (
            skinSystem.stringerVertical[stringerVer][0] ==
            grid.gridNodes[row][col][0]
          ) {
            //** y-interval
            let y_start = skinSystem.stringerVertical[stringerVer][1];
            let y_end =
              skinSystem.stringerVertical[stringerVer][
                skinSystem.stringerVertical[stringerVer].length - 1
              ];
            if (
              y_start <= grid.gridNodes[row][col][1] &&
              grid.gridNodes[row][col][1] <= y_end
            ) {
              this.matrixDef[row][col][1] = matrix_x[stringer + stringerVer][0];
            }
          }
        }
      }
    }
    //console.table("result line 26")
    //console.table(this.matrixDef);

    this.AngleDef();
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 8
  AngleDef() {
    
    for (let row = 0; row < skinSystem.rowsSkin; row++) {
      for (let col = 0; col < skinSystem.columnsSkin; col++) {
        if (skinSystem.skinMatrix[row][col].skinExist) {
          /*
        let lowerLeft = this.matrixDef[row+1][col]
        let upperRigth = this.matrixDef[row][col+1]
        let distDia = dist(lowerLeft[0],lowerLeft[1],upperRigth[0],upperRigth[1])
        console.log("result line 255: " + upperRigth[0] + " " + upperRigth[1])
          //skinSystem.skinMatrix[row][col].diagonalDef = factorLimitShearaDef_h = 1
          //let diaDef = grid.gridNodes[row]
          */
        }
      }
    }

    /*
    for (let row = 0; row < grid.rowsTotal-1; row++) {
      for (let col = 0; col < grid.columnsTotal-1; col++) {
        
        let lowerLeft = this.matrixDef[row+1][col]
        let upperRigth = this.matrixDe[row][col+1]
        
        //console.log("LowerLeft " + lowerLeft)
        console.log("UpperRigth Result line 266 " + upperRigth)
        
      }
    }
    */
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 9
  DiagonalDef() {
    //** Draw diagonal in skin
    /*
    let x_start;
    let y_start;

    let x_slut;
    let y_slut;

    for (let row = 0; row < skinSystem.rowsSkin; row++) {
      for (let col = 0; col < skinSystem.columnsSkin; col++) {
        if (skinSystem.skinMatrix[row][col].skinExist) {
          //** Skin
             push();
          strokeWeight(4);
          fill(50, 50, 50, 50);
          //** TopLeft
          let p0x = grid.gridNodes[row][col][0] + this.matrixDef[row][col][0];
          let p0y = grid.gridNodes[row][col][1] + this.matrixDef[row][col][1];

          //** TopRigth
          let p1x =
            grid.gridNodes[row][col + 1][0] + this.matrixDef[row][col + 1][0];
          let p1y =
            grid.gridNodes[row][col + 1][1] + this.matrixDef[row][col + 1][1];

          //** BottomRigth
          let p2x =
            grid.gridNodes[row + 1][col + 1][0] +
            this.matrixDef[row + 1][col + 1][0];
          let p2y =
            grid.gridNodes[row + 1][col + 1][1] +
            this.matrixDef[row + 1][col + 1][1];

          //** BottomLeft
          let p3x =
            grid.gridNodes[row + 1][col][0] + this.matrixDef[row + 1][col][0];
          let p3y =
            grid.gridNodes[row + 1][col][1] + this.matrixDef[row + 1][col][1];

          //quad(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);
          pop();

          //line(p3x, p3y, p1x, p1y);

          skinSystem.skinMatrix[row][col].diagonalDef = dist(
            p3x,
            p3y,
            p1x,
            p1y
          );
        }
      }
    }
    */
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 10
  DisplayDef() {
    let scale = 100 / scaleDef; //** Button_Rollor

    let x_start;
    let y_start;

    let x_slut;
    let y_slut;

    for (let row = 0; row < skinSystem.rowsSkin; row++) {
      for (let col = 0; col < skinSystem.columnsSkin; col++) {
        if (skinSystem.skinMatrix[row][col].skinExist) {
          //** Skin
          /*
          push();
          fill(0,100,0,100)
          let topLeft = skinSystem.skinMatrix[row][col].startPos
          let w=skinSystem.skinMatrix[row][col].w;
          let h=skinSystem.skinMatrix[row][col].h;
          rect(topLeft.x,topLeft.y,topLeft.x+w,topLeft.y+h);
          pop();
          */
          push();
          strokeWeight(4);
          fill(50, 50, 50, 50);
          //** TopLeft
          let p0x =
            grid.gridNodes[row][col][0] + scale * this.matrixDef[row][col][0];
          let p0y =
            grid.gridNodes[row][col][1] + scale * this.matrixDef[row][col][1];

          //** TopRigth
          let p1x =
            grid.gridNodes[row][col + 1][0] +
            scale * this.matrixDef[row][col + 1][0];
          let p1y =
            grid.gridNodes[row][col + 1][1] +
            scale * this.matrixDef[row][col + 1][1];

          //** BottomRigth
          let p2x =
            grid.gridNodes[row + 1][col + 1][0] +
            scale * this.matrixDef[row + 1][col + 1][0];
          let p2y =
            grid.gridNodes[row + 1][col + 1][1] +
            scale * this.matrixDef[row + 1][col + 1][1];

          //** BottomLeft
          let p3x =
            grid.gridNodes[row + 1][col][0] +
            scale * this.matrixDef[row + 1][col][0];
          let p3y =
            grid.gridNodes[row + 1][col][1] +
            scale * this.matrixDef[row + 1][col][1];

          quad(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);
          pop();

          /*
          //** Horisontal Lines
          x_start =
            grid.gridNodes[row][col][0] + scale * this.matrixDef[row][col][0];
          y_start =
            grid.gridNodes[row][col][1] + scale * this.matrixDef[row][col][1];
          x_slut =
            grid.gridNodes[row][col + 1][0] +
            scale * this.matrixDef[row][col + 1][0];
          y_slut =
            grid.gridNodes[row][col + 1][1] +
            scale * this.matrixDef[row][col + 1][1];
          //push();
          
          
          strokeWeight(2);
          stroke(0, 0, 0);
          line(x_start, y_start, x_slut, y_slut);
          //pop();

          //** last row
          //    if (row == skinSystem.rowsSkin - 1) {
          x_start =
            grid.gridNodes[row + 1][col][0] +
            scale * this.matrixDef[row + 1][col][0];
          y_start =
            grid.gridNodes[row + 1][col][1] +
            scale * this.matrixDef[row + 1][col][1];
          x_slut =
            grid.gridNodes[row + 1][col + 1][0] +
            scale * this.matrixDef[row + 1][col + 1][0];
          y_slut =
            grid.gridNodes[row + 1][col + 1][1] +
            scale * this.matrixDef[row + 1][col + 1][1];
          //push();
          //strokeWeight(1);
          //stroke(0, 0, 0);
          line(x_start, y_start, x_slut, y_slut);
          //pop();
          //    }

          //** Vertical lines
          x_start =
            grid.gridNodes[row][col][0] + scale * this.matrixDef[row][col][0];
          y_start =
            grid.gridNodes[row][col][1] + scale * this.matrixDef[row][col][1];
          x_slut =
            grid.gridNodes[row + 1][col][0] +
            scale * this.matrixDef[row + 1][col][0];
          y_slut =
            grid.gridNodes[row + 1][col][1] +
            scale * this.matrixDef[row + 1][col][1];
          // push();
          //strokeWeight(1);
          //stroke(0, 0, 0);
          line(x_start, y_start, x_slut, y_slut);
          //pop();

          //** last column
          // if (col == skinSystem.columnsSkin - 1) {
          x_start =
            grid.gridNodes[row][col + 1][0] +
            scale * this.matrixDef[row][col + 1][0];
          y_start =
            grid.gridNodes[row][col + 1][1] +
            scale * this.matrixDef[row][col + 1][1];
          x_slut =
            grid.gridNodes[row + 1][col + 1][0] +
            scale * this.matrixDef[row + 1][col + 1][0];
          y_slut =
            grid.gridNodes[row + 1][col + 1][1] +
            scale * this.matrixDef[row + 1][col + 1][1];
          //push();
          //strokeWeight(1);
          //stroke(0, 0, 0);
          line(x_start, y_start, x_slut, y_slut);
          pop();
          // }
          
          */
        }
      }
    }

    /*
    //** All lines are drawn
    //** Horisontal
    for (let row = 0; row < grid.rowsTotal; row++) {
      for (let col = 0; col < grid.columnsTotal - 1; col++) {       
            let x_start =
              grid.gridNodes[row][col][0] + scale * this.matrixDef[row][col][0];
            let y_start =
              grid.gridNodes[row][col][1] + scale * this.matrixDef[row][col][1];
            let x_slut =
              grid.gridNodes[row][col + 1][0] +
              scale * this.matrixDef[row][col + 1][0];
            let y_slut =
              grid.gridNodes[row][col + 1][1] +
              scale * this.matrixDef[row][col + 1][1];
            push();
            strokeWeight(1);
            stroke(0, 0, 0);
            line(x_start, y_start, x_slut, y_slut);
            pop();
            
      }
    }

    //** Vertical
    for (let col = 0; col < grid.columnsTotal; col++) {
      for (let row = 0; row < grid.rowsTotal - 1; row++) {
        let x_start =
          grid.gridNodes[row][col][0] + scale * this.matrixDef[row][col][0];
        let y_start =
          grid.gridNodes[row][col][1] + scale * this.matrixDef[row][col][1];
        let x_slut =
          grid.gridNodes[row + 1][col][0] +
          scale * this.matrixDef[row + 1][col][0];
        let y_slut =
          grid.gridNodes[row + 1][col][1] +
          scale * this.matrixDef[row + 1][col][1];
        push();
        strokeWeight(1);
        stroke(0, 0, 0);
        line(x_start, y_start, x_slut, y_slut);
        pop();
      }
    }
    */
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 11
  Reaction() {
    //** Def() must be calculatede before Reaction()
    //** ZeroMatrix
    this.matrixReaction = [];
    for (let row = 0; row < grid.rowsTotal; row++) {
      this.matrixReaction[row] = [];
      for (let col = 0; col < grid.columnsTotal; col++) {
        //** Reaction [Rx,Ry]
        this.matrixReaction[row][col] = [0, 0];
      }
    }

    for (let row = 0; row < grid.rowsTotal; row++) {
      for (let col = 0; col < grid.columnsTotal; col++) {
        //** Reaction [Rx,Ry]
        //** Rx = ux * Cx
        this.matrixReaction[row][col][0] =
          -this.matrixDef[row][col][0] *
          matrixSupport.matrixSupport[row][col].Cx;

        //** Ry = uy * Cy
        this.matrixReaction[row][col][1] =
          -this.matrixDef[row][col][1] *
          matrixSupport.matrixSupport[row][col].Cy;
      }
    }
    //console.table("result line 94")
    //console.table(this.matrixReaction)

    //this.DisplayReaction()
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 12
  DisplayReaction() {
    for (let row = 0; row < grid.rowsTotal; row++) {
      for (let col = 0; col < grid.columnsTotal; col++) {
        let centerX = grid.gridNodes[row][col][0];
        let centerY = grid.gridNodes[row][col][1];

        let len = 40;
        let offSet = 70;

        //** Ry
        let Ry = round(this.matrixReaction[row][col][1], 2);

        if (Ry < 0) {
          this.Arrow(centerX, centerY, color(255, 255, 255), 0, len, 0, offSet);
        }

        //** Display Value
        if (Ry > 0) {
          this.Arrow(
            centerX,
            centerY,
            color(255, 255, 255),
            PI,
            len,
            0,
            offSet
          );
        }

        //** Rx
        let Rx = round(this.matrixReaction[row][col][0], 2);
        if (Rx < 0) {
          this.Arrow(
            centerX,
            centerY,
            color(255, 255, 255),
            -PI / 2,
            len,
            -offSet,
            0
          );
        }

        if (Rx > 0) {
          this.Arrow(
            centerX,
            centerY,
            color(255, 255, 255),
            PI / 2,
            len,
            -offSet,
            0
          );
        }
      }
    }
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 13
  DisplayReactionValue() {
    for (let row = 0; row < grid.rowsTotal; row++) {
      for (let col = 0; col < grid.columnsTotal; col++) {
        let centerX = grid.gridNodes[row][col][0];
        let centerY = grid.gridNodes[row][col][1];

        let len = 40;
        let offSet = 70;

        //** Ry
        let Ry = this.matrixReaction[row][col][1];

        if (Ry < 0) {
          //** Display Value
          push();
          textAlign(CENTER, CENTER);
          textSize(30);
          fill(250, 250, 250, 200);
          rect(centerX + 20, centerY + 55, 100, 40);
          fill(0);
          text(
            nf(round(abs(Ry) / 1000, 2), 0, 2),
            centerX + 70,
            centerY + 77.5
          );
          pop();
        }

        //** Display Value
        if (Ry > 0) {
          //** Display Value
          push();
          textAlign(CENTER, CENTER);
          textSize(30);
          fill(250, 250, 250, 200);
          rect(centerX + 20, centerY + 55, 100, 40);
          fill(0);
          text(
            nf(round(abs(Ry) / 1000, 2), 0, 2),
            centerX + 70,
            centerY + 77.5
          );
          pop();
        }

        //** Rx
        let Rx = this.matrixReaction[row][col][0];
        if (Rx < 0) {
          //** Display Value
          push();
          textAlign(CENTER, CENTER);
          textSize(30);
          fill(250, 250, 250, 200);
          rect(centerX - 140, centerY + 25, 100, 40);
          fill(0);
          text(
            nf(round(abs(Rx) / 1000, 2), 0, 2),
            centerX - 90,
            centerY + 47.5
          );
          pop();
        }

        if (Rx > 0) {
          //** Display Value
          push();
          textAlign(CENTER, CENTER);
          textSize(30);
          fill(250, 250, 250, 200);
          rect(centerX - 140, centerY + 25, 100, 40);
          fill(0);
          text(
            nf(round(abs(Rx) / 1000, 2), 0, 2),
            centerX - 90,
            centerY + 47.5
          );
          pop();
        }
      }
    }
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 14
  Arrow(centerX, centerY, color, rotation, len, offSetX, offSetY) {
    push();
    fill(color);

    translate(centerX + offSetX, centerY + offSetY);
    rotate(rotation);

    strokeWeight(4);
    line(0, +0.5 * len, 0, -0.5 * len);
    triangle(0, -0.5 * len - 10, -10, -5 - 10, 10, -5 - 10);
    pop();
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 15
  Shear() {
    //** construct matrixShear
    //** ZeroMatrix
    this.matrixShear = [];
    for (let row = 0; row < skinSystem.rowsSkin; row++) {
      this.matrixShear[row] = [];
      for (let col = 0; col < skinSystem.columnsSkin; col++) {
        this.matrixShear[row][col] = 0;
      }
    }

    //** Shear from StringerHorisontal
    //** Can only calculate when system is updated
    /*
    if (
      skinSystem.stringerSkinMatrixHorisontal.length > 0 &&
      skinSystem.stringerSkinMatrixVertical[0].length == grid.rows.length - 1 &&
      skinSystem.stringerSkinMatrixHorisontal[0][0].length ==
        grid.columns.length - 1
    ) {
    */
    //** Calculate Shear
    for (
      let stringerHor = 0;
      stringerHor < skinSystem.stringerHorisontal.length;
      stringerHor++
    ) {
      //console.log("stringerHor: " + stringerHor);
      for (let row = 0; row < skinSystem.rowsSkin; row++) {
        //this.matrixShear[row] = [];
        for (let col = 0; col < skinSystem.columnsSkin; col++) {
          let factor = 1;
          let v =
            skinSystem.stringerSkinMatrixHorisontal[stringerHor][row][col][0];
          if (v < 0) factor = -1;
          let a =
            skinSystem.stringerSkinMatrixHorisontal[stringerHor][row][col][1];
          let w = skinSystem.skinMatrix[row][col].w;
          let temp = this.matrixShear[row][col];
          let add = (factor * v * a * matrix_x[stringerHor][0]) / (w * 10);
          this.matrixShear[row][col] = temp + add;
          /*
            console.log(
              "v: " + v + " a: " + a + " x: " + matrix_x[stringerHor][0]
            );
            console.log(
              "Result.Shear line 7: Row: " +
                row +
                " col: " +
                col +
                "  => " +
                this.matrixShear[row][col]
            );
            */
        }
      }
    }

    //** Shear from StringerHorisontal
    //** Can only calculate when system is updated
    for (
      let stringerVer = 0;
      stringerVer < skinSystem.stringerVertical.length;
      stringerVer++
    ) {
      //console.log("stringerVer: " + stringerVer);
      for (let row = 0; row < skinSystem.rowsSkin; row++) {
        //this.matrixShear[row] = [];
        for (let col = 0; col < skinSystem.columnsSkin; col++) {
          let factor = 1;
          let v =
            skinSystem.stringerSkinMatrixVertical[stringerVer][row][col][0];
          if (v < 0) factor = -1;
          let a =
            skinSystem.stringerSkinMatrixVertical[stringerVer][row][col][1];
          let h = skinSystem.skinMatrix[row][col].h;
          let temp = this.matrixShear[row][col];

          let add =
            (factor *
              v *
              a *
              matrix_x[skinSystem.stringerHorisontal.length + stringerVer][0]) /
            (h * 10);

          this.matrixShear[row][col] = temp + add;
          /*
            console.log(
              "v: " +
                v +
                " a: " +
                a +
                " x: " +
                matrix_x[skinSystem.stringerHorisontal.length + stringerVer][0]
            );
            console.log(
              "Result.Shear line 8: Row: " +
                row +
                " col: " +
                col +
                "  => " +
                this.matrixShear[row][col]
            );
            */
        }
      }
    }
    //}

    //** SherMatrix adjusted to scalGeo
    for (let row = 0; row < skinSystem.rowsSkin; row++) {
      for (let col = 0; col < skinSystem.columnsSkin; col++) {
        this.matrixShear[row][col] = this.matrixShear[row][col] / scaleGeo;

        //  if(!isNaN(this.matrixShear[row][col])){
        //console.log("reslut Line 753 -  test is NaN")

        skinSystem.skinMatrix[row][col].shear = this.matrixShear[row][col]; // scaleGeo;

        // }
      }
    }

    //if(this.matrixShear.length>0) console.log("Result.Shear line 7: " +this.matrixShear[0][0]);
    //console.table(skinSystem.stringerSkinMatrixHorisontal[2])
  } //** Shear() END

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 16
  ShearDisplay() {
    let shearLengthRow = this.matrixShear.length;
    let shearLengthCol = this.matrixShear[0].length;
    //console.log("ShearDisplay " + shearLengthRow + " " +shearLengthCol );

    for (let row = 0; row < shearLengthRow; row++) {
      for (let col = 0; col < shearLengthCol; col++) {
        if (this.matrixShear[row][col] != 0) {
          let shearForce = round(this.matrixShear[row][col], 5);
          //console.log("shearForce: " + shearForce);
          //console.log("scaleGeo: " + scaleGeo);

          let center = skinSystem.skinMatrix[row][col].centerSkin;
          let w = skinSystem.skinMatrix[row][col].w;
          let h = skinSystem.skinMatrix[row][col].h;
          let arrowLength = 40;
          let adjust = 10;

          //** Only show value if !0 and !NaN
          if (shearForce != 0 && !isNaN(shearForce)) {
            push();
            translate(center.x, center.y);
            strokeWeight(2);
            stroke(100);
            fill(100);
            line(
              -arrowLength / 2,
              -h / 2 + adjust,
              arrowLength / 2,
              -h / 2 + adjust
            ); //** Top
            line(
              -arrowLength / 2,
              h / 2 - adjust,
              arrowLength / 2,
              h / 2 - adjust
            ); //** Bottom
            line(
              -w / 2 + adjust,
              -arrowLength / 2,
              -w / 2 + adjust,
              arrowLength / 2
            ); //** Left
            line(
              w / 2 - adjust,
              -arrowLength / 2,
              w / 2 - adjust,
              arrowLength / 2
            ); //** Right

            let factor = 1;
            if (shearForce > 0) factor = 1;
            if (shearForce < 0) factor = -1;

            triangle(
              (factor * arrowLength) / 2,
              -h / 2 + adjust,
              0,
              -h / 2 + 1.75 * adjust,
              0,
              -h / 2 + adjust
            ); //** Top
            triangle(
              factor * (-arrowLength / 2),
              h / 2 - adjust,
              0,
              h / 2 - 1.75 * adjust,
              0,
              h / 2 - adjust
            ); //** Bottom
            triangle(
              -w / 2 + adjust,
              factor * (arrowLength / 2),
              -w / 2 + 1.75 * adjust,
              0,
              -w / 2 + adjust,
              0
            ); //** Left
            triangle(
              w / 2 - adjust,
              factor * (-arrowLength / 2),
              w / 2 - 1.75 * adjust,
              0,
              w / 2 - adjust,
              0
            ); //** Rigth

            pop();
          }
        }
      }
    }
  } //** ShearDisplay() END

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 17
  ShearForceDisplay() {
    let shearLengthRow = this.matrixShear.length;
    let shearLengthCol = this.matrixShear[0].length;

    //** Only show value if not NaN
    if (!isNaN(this.matrixShear[0][0])) {
      for (let row = 0; row < shearLengthRow; row++) {
        for (let col = 0; col < shearLengthCol; col++) {
          if (skinSystem.skinMatrix[row][col].skinExist) {
            let shearForce = round(this.matrixShear[row][col], 5);
            let center = skinSystem.skinMatrix[row][col].centerSkin;
            push();
            //console.log("****" + shearForce);
            translate(center.x, center.y);
            let factor = 1;
            if (shearForce > 0) factor = 1;
            if (shearForce < 0) factor = -1;

            textAlign(CENTER, CENTER);
            textSize(25);
            if (abs(shearForce) < 10000)
              text(nf(round(factor * shearForce, 2), 0, 2), 0, 0);
            pop();
          }
        }
      }
    }
  } //** ShearForceDisplay() END

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 18
  StringerForceHorisontal() {
    //** [row][col][left,rigth]
    this.matrixStringerHorisontal = [];

    //** ZeroMatrix
    for (let row = 0; row < grid.rowsTotal; row++) {
      this.matrixStringerHorisontal[row] = [];
      for (let col = 0; col < grid.columnsTotal; col++) {
        this.matrixStringerHorisontal[row][col] = [0, 0];
      }
    }

    for (let rowGrid = 0; rowGrid < grid.rowsTotal; rowGrid++) {
      for (let colGrid = 0; colGrid < grid.columnsTotal; colGrid++) {
        let left = 0;
        let rigth = 0;

        //** Load
        if (colGrid == 0)
          this.matrixStringerHorisontal[rowGrid][colGrid][0] +=
            matrixLoad.matrixLoad[rowGrid][colGrid].Px;
        else
          this.matrixStringerHorisontal[rowGrid][colGrid][1] +=
            matrixLoad.matrixLoad[rowGrid][colGrid].Px;

        //** Support
        if (colGrid == 0)
          this.matrixStringerHorisontal[rowGrid][
            colGrid
          ][0] += this.matrixReaction[rowGrid][colGrid][0];
        else
          this.matrixStringerHorisontal[rowGrid][
            colGrid
          ][1] += this.matrixReaction[rowGrid][colGrid][0];
      }
    }

    for (let rowGrid = 0; rowGrid < grid.rowsTotal; rowGrid++) {
      for (let colGrid = 0; colGrid < grid.columnsTotal; colGrid++) {
        let rowSkin = rowGrid;
        let colSkin = colGrid;

        if (rowGrid > 0) rowSkin = rowGrid - 1;
        if (colGrid > 0) colSkin = colGrid - 1;

        let w = skinSystem.skinMatrix[rowSkin][colSkin].w * scaleGeo;
        let h = skinSystem.skinMatrix[rowSkin][colSkin].h * scaleGeo;
        let shearForce = this.matrixShear[rowSkin][colSkin]; //** N/mm => kN/m

        //** Horisontal rowGrid **
        //** StartValues
        this.matrixStringerHorisontal[rowGrid][colGrid][0] += 0;
        this.matrixStringerHorisontal[rowGrid][
          colGrid
        ][1] += this.matrixStringerHorisontal[rowGrid][colGrid][0];

        //** 1 -
        if (rowGrid == 0) {
          //** shear
          if (colGrid > 0) {
            //** Lower skin contribution
            this.matrixStringerHorisontal[rowGrid][colGrid][0] +=
              this.matrixStringerHorisontal[rowGrid][colGrid - 1][1] +
              shearForce * w * 10;

            this.matrixStringerHorisontal[rowGrid][
              colGrid
            ][1] += this.matrixStringerHorisontal[rowGrid][colGrid][0];
          }
        }

        //** 2 -
        if (0 < rowGrid && rowGrid < grid.rowsTotal - 1) {
          //** shear
          if (colGrid > 0) {
            this.matrixStringerHorisontal[rowGrid][
              colGrid
            ][0] += this.matrixStringerHorisontal[rowGrid][colGrid - 1][1];

            //** Upper skin contribution
            //shearForce = this.matrixShear[rowSkin][colSkin]; //** N/mm => kN/m
            this.matrixStringerHorisontal[rowGrid][colGrid][0] +=
              -shearForce * w * 10;

            //** Lower skin contribution
            shearForce = this.matrixShear[rowSkin + 1][colSkin]; //** N/mm => kN/m
            this.matrixStringerHorisontal[rowGrid][colGrid][0] +=
              shearForce * w * 10;

            this.matrixStringerHorisontal[rowGrid][
              colGrid
            ][1] += this.matrixStringerHorisontal[rowGrid][colGrid][0];
          }
        }

        //** 3 -
        if (rowGrid == grid.rowsTotal - 1) {
          //** shear
          if (colGrid > 0) {
            //** Upper skin contribution
            this.matrixStringerHorisontal[rowGrid][colGrid][0] +=
              this.matrixStringerHorisontal[rowGrid][colGrid - 1][1] -
              shearForce * w * 10;

            this.matrixStringerHorisontal[rowGrid][
              colGrid
            ][1] += this.matrixStringerHorisontal[rowGrid][colGrid][0];
          }
        }
        /*
                          console.log("stringer: " + rowGrid + " Force Left: " + this.matrixStringerHorisontal[rowGrid][colGrid][0] + " Force Rigth: " + this.matrixStringerHorisontal[rowGrid][colGrid][1])
                          */
      }
    }

    //console.table(  this.matrixStringerHorisontal[0])
  } //** StringerForceHorisontal() END

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 19
  StringerForceVertical() {
    //** [row][col][Up,down]
    this.matrixStringerVertical = [];

    //** ZeroMatrix
    for (let row = 0; row < grid.rowsTotal; row++) {
      this.matrixStringerVertical[row] = [];
      for (let col = 0; col < grid.columnsTotal; col++) {
        this.matrixStringerVertical[row][col] = [0, 0];
      }
    }

    let up = 0;
    let down = 1;

    for (let rowGrid = 0; rowGrid < grid.rowsTotal; rowGrid++) {
      for (let colGrid = 0; colGrid < grid.columnsTotal; colGrid++) {
        //** Load
        if (rowGrid == 0)
          this.matrixStringerVertical[rowGrid][colGrid][0] +=
            matrixLoad.matrixLoad[rowGrid][colGrid].Py;
        else
          this.matrixStringerVertical[rowGrid][colGrid][1] +=
            matrixLoad.matrixLoad[rowGrid][colGrid].Py;

        //** Support
        if (rowGrid == 0)
          this.matrixStringerVertical[rowGrid][
            colGrid
          ][1] += this.matrixReaction[rowGrid][colGrid][1];
        else
          this.matrixStringerVertical[rowGrid][
            colGrid
          ][1] += this.matrixReaction[rowGrid][colGrid][1];
      }
    }

    for (let colGrid = 0; colGrid < grid.columnsTotal; colGrid++) {
      //** Vertical colGrid **
      //** StartValues
      this.matrixStringerVertical[0][colGrid][0] += 0;
      this.matrixStringerVertical[0][
        colGrid
      ][1] += this.matrixStringerVertical[0][colGrid][0];

      for (let rowGrid = 0; rowGrid < grid.rowsTotal; rowGrid++) {
        let rowSkin = rowGrid;
        let colSkin = colGrid;

        if (rowGrid > 0) rowSkin = rowGrid - 1;
        if (colGrid > 0) colSkin = colGrid - 1;

        let w = skinSystem.skinMatrix[rowSkin][colSkin].w * scaleGeo;
        let h = skinSystem.skinMatrix[rowSkin][colSkin].h * scaleGeo;
        let shearForce = this.matrixShear[rowSkin][colSkin]; //** N/mm => kN/m

        //** 1 -
        if (colGrid == 0) {
          //** shear
          if (rowGrid > 0) {
            //** Rigth skin contribution
            this.matrixStringerVertical[rowGrid][colGrid][0] +=
              this.matrixStringerVertical[rowGrid - 1][colGrid][1] +
              shearForce * h * 10;

            this.matrixStringerVertical[rowGrid][
              colGrid
            ][1] += this.matrixStringerVertical[rowGrid][colGrid][0];
          }
        }

        //** 2 -
        if (0 < colGrid && colGrid < grid.columnsTotal - 1) {
          //** shear
          if (rowGrid > 0) {
            this.matrixStringerVertical[rowGrid][
              colGrid
            ][0] += this.matrixStringerVertical[rowGrid - 1][colGrid][1];

            //** Left skin contribution
            //shearForce = this.matrixShear[rowSkin][colSkin]; //** N/mm => kN/m
            this.matrixStringerVertical[rowGrid][colGrid][0] +=
              -shearForce * h * 10; //** -

            //** Rigth skin contribution
            shearForce = this.matrixShear[rowSkin][colSkin + 1]; //** N/mm => kN/m
            this.matrixStringerVertical[rowGrid][colGrid][0] +=
              +shearForce * h * 10;

            this.matrixStringerVertical[rowGrid][
              colGrid
            ][1] += this.matrixStringerVertical[rowGrid][colGrid][0];
          }
        }

        //** 3 -
        if (colGrid == grid.columnsTotal - 1) {
          //** shear
          if (rowGrid > 0) {
            //** Left skin contribution
            //********************************************************************************* RETTE ??
            this.matrixStringerVertical[rowGrid][colGrid][0] +=
              this.matrixStringerVertical[rowGrid - 1][colGrid][1] -
              shearForce * h * 10;

            this.matrixStringerVertical[rowGrid][
              colGrid
            ][1] += this.matrixStringerVertical[rowGrid][colGrid][0];
          }
        }
        //** Tryk positiv
        //** Træk negativ
        /*
        console.log("stringer: " + colGrid + " Force Up: " + this.matrixStringerVertical[rowGrid][colGrid][0] + " Force Down: " + this.matrixStringerVertical[rowGrid][colGrid][1])
       */
      }
    }
  } //** StringerForceVertical() END

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 20
  StringerForceMaxMin() {
    this.stringerMax = 0;
    this.stringerMin = 0;
    this.stringerMaxMin = 0;
    for (let row = 0; row < grid.rowsTotal; row++) {
      for (let col = 0; col < grid.columnsTotal; col++) {
        //** Max
        if (this.matrixStringerHorisontal[row][col][0] > this.stringerMax) {
          this.stringerMax = this.matrixStringerHorisontal[row][col][0];
        }
        if (this.matrixStringerHorisontal[row][col][1] > this.stringerMax) {
          this.stringerMax = this.matrixStringerHorisontal[row][col][1];
        }
        if (this.matrixStringerVertical[row][col][0] > this.stringerMax) {
          this.stringerMax = this.matrixStringerVertical[row][col][0];
        }
        if (this.matrixStringerVertical[row][col][1] > this.stringerMax) {
          this.stringerMax = this.matrixStringerVertical[row][col][1];
        }

        //** Min
        if (this.matrixStringerHorisontal[row][col][0] < this.stringerMin) {
          this.stringerMin = this.matrixStringerHorisontal[row][col][0];
        }
        if (this.matrixStringerHorisontal[row][col][1] < this.stringerMin) {
          this.stringerMin = this.matrixStringerHorisontal[row][col][1];
        }
        if (this.matrixStringerVertical[row][col][0] < this.stringerMin) {
          this.stringerMin = this.matrixStringerVertical[row][col][0];
        }
        if (this.matrixStringerVertical[row][col][1] < this.stringerMin) {
          this.stringerMin = this.matrixStringerVertical[row][col][1];
        }

        this.stringerMaxMin = max(abs(this.stringerMin), abs(this.stringerMax));
      }
    }
    //console.log(this.stringerMaxMin)
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 21
  StringerForceVerticalDisplayShade() {
    //** Limit => no flickering when move nodes
    // if (-10000 < matrix_x[0][0] && matrix_x[0][0] < 10000) {
    push();
    for (let col = 0; col < grid.columnsTotal; col++) {
      for (let row = 0; row < grid.rowsTotal - 1; row++) {
        //** shade
        let p0x = grid.gridNodes[row][col][0];
        let p0y = grid.gridNodes[row][col][1];
        let p1x = grid.gridNodes[row + 1][col][0];
        let p1y = grid.gridNodes[row + 1][col][1];

        let p2x =
          p1x +
          this.matrixStringerVertical[row + 1][col][0] / (10 * scaleStringer);
        let p2y = p1y;

        let p3x =
          p0x + this.matrixStringerVertical[row][col][1] / (10 * scaleStringer);
        let p3y = p0y;

        //** Color
        let forceStartNode = this.matrixStringerVertical[row][col][1];
        let forceEndNode = this.matrixStringerVertical[row + 1][col][0];

        fill(0, 0, 0, 0);
        if (forceStartNode <= 0 && forceEndNode <= 0) {
          //stroke(0, 0, 255, 200);
          fill(0, 0, 255, 50);
        }
        if (forceStartNode >= 0 && forceEndNode >= 0) {
          //stroke(255, 0, 0, 200)
          fill(255, 0, 0, 50);
        }

        //** if no force stroke is not drawn
        if (round(forceEndNode, 0) == 0 && round(forceStartNode, 0) == 0)
          strokeWeight(0);
        else strokeWeight(1);
        quad(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);

        if (forceStartNode * forceEndNode < 0) {
          let widthStringer =
            grid.gridNodes[row + 1][col][1] - grid.gridNodes[row][col][1];

          let widthStart =
            abs(forceStartNode / (forceStartNode - forceEndNode)) *
            widthStringer;

          let middle = new p5.Vector(
            grid.gridNodes[row][col][0],
            grid.gridNodes[row][col][1] + widthStart
          );

          let pmx = middle.x;
          let pmy = middle.y;

          // fill(0, 255, 0);
          if (forceStartNode <= 0) {
            //stroke(0, 0, 255, 200);
            fill(0, 0, 255, 50);
          }
          if (forceStartNode >= 0) {
            //stroke(255, 0, 0, 200)
            fill(255, 0, 0, 50);
          }
          triangle(p0x, p0y, pmx, pmy, p3x, p3y);

          if (forceEndNode <= 0) {
            //stroke(0, 0, 255, 200);
            fill(0, 0, 255, 50);
          }
          if (forceEndNode >= 0) {
            //stroke(255, 0, 0, 200)
            fill(255, 0, 0, 50);
          }
          triangle(p1x, p1y, pmx, pmy, p2x, p2y);
        }
      }
    }
    pop();
    //}
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 22
  StringerForceHorisontalDisplayShade() {
    //** Limit => no flickering when move nodes
    //  if (-10000 < matrix_x[0][0] && matrix_x[0][0] < 10000) {
    push();
    for (let row = 0; row < grid.rowsTotal; row++) {
      for (let col = 0; col < grid.columnsTotal - 1; col++) {
        //** shade
        let p0x = grid.gridNodes[row][col][0];
        let p0y = grid.gridNodes[row][col][1];
        let p1x = grid.gridNodes[row][col + 1][0];
        let p1y = grid.gridNodes[row][col + 1][1];

        let p2x = p1x;
        let p2y =
          p1y -
          this.matrixStringerHorisontal[row][col + 1][0] / (10 * scaleStringer);

        let p3x = p0x;
        let p3y =
          p0y -
          this.matrixStringerHorisontal[row][col][1] / (10 * scaleStringer);

        //** Color
        let forceStartNode = this.matrixStringerHorisontal[row][col][1];
        let forceEndNode = this.matrixStringerHorisontal[row][col + 1][0];

        fill(0, 0, 0, 0);
        if (forceStartNode <= 0 && forceEndNode <= 0) fill(0, 0, 255, 50);
        if (forceStartNode >= 0 && forceEndNode >= 0) fill(255, 0, 0, 50);

        //** if no force stroke is not drawn
        if (round(forceEndNode, 0) == 0 && round(forceStartNode, 0) == 0)
          strokeWeight(0);
        else strokeWeight(1);
        quad(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);

        //** cross line
        if (forceStartNode * forceEndNode < 0) {
          let widthStringer =
            grid.gridNodes[row][col + 1][0] - grid.gridNodes[row][col][0];

          let widthStart =
            abs(forceStartNode / (forceStartNode - forceEndNode)) *
            widthStringer;

          let middle = new p5.Vector(
            grid.gridNodes[row][col][0] + widthStart,
            grid.gridNodes[row][col][1]
          );

          let pmx = middle.x;
          let pmy = middle.y;

          // fill(0, 255, 0);
          if (forceStartNode <= 0) fill(0, 0, 255, 50);
          if (forceStartNode >= 0) fill(255, 0, 0, 50);
          triangle(p0x, p0y, pmx, pmy, p3x, p3y);

          if (forceEndNode <= 0) fill(0, 0, 255, 50);
          if (forceEndNode >= 0) fill(255, 0, 0, 50);
          triangle(p1x, p1y, pmx, pmy, p2x, p2y);
        }
      }
    }
    pop();
    // }
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 23
  StringerForceHorisontalDisplayColor() {
    this.StringerForceMaxMin();
    //console.log("ForceMax (result line 455): " + this.stringerMax);

    let adjust = 0;

    if (this.stringerMaxMin != 0) {
      //** Grid are not updated at this point. but skins are
      let rowStringer = skinSystem.skinMatrix.length + 1;
      let colStringer = skinSystem.skinMatrix[0].length + 1;
      for (let row = 0; row < rowStringer; row += 1) {
        for (let col = 0; col < colStringer - 1; col += 1) {
          let R = 255;
          let G = 255;
          let B = 255;

          //**StartNode
          let forceStart = abs(
            this.matrixStringerHorisontal[row][col][1] / this.stringerMaxMin
          );

          if (this.matrixStringerHorisontal[row][col][1] < 0) {
            R = 255 * (1 - forceStart);
            G = 255 * (1 - forceStart);
            B = 255 * (1 - 0.1 * forceStart);
          }
          if (this.matrixStringerHorisontal[row][col][1] >= 0) {
            R = 255 * (1 - 0.1 * forceStart);
            G = 255 * (1 - forceStart);
            B = 255 * (1 - forceStart);
          }
          let c_start = color(R, G, B, this.intensityColor);

          //**MiddelNode
          let c_neutral = color(255, 255, 255, 0);

          //**EndNode
          let forceEnd = abs(
            this.matrixStringerHorisontal[row][col + 1][0] / this.stringerMaxMin
          );
          if (this.matrixStringerHorisontal[row][col + 1][0] < 0) {
            R = 255 * (1 - forceEnd);
            G = 255 * (1 - forceEnd);
            B = 255 * (1 - 0.1 * forceEnd);
          }
          if (this.matrixStringerHorisontal[row][col + 1][0] >= 0) {
            R = 255 * (1 - 0.1 * forceEnd);
            G = 255 * (1 - forceEnd);
            B = 255 * (1 - forceEnd);
          }
          let c_end = color(R, G, B, this.intensityColor);

          let forceStartNode = this.matrixStringerHorisontal[row][col][0];
          let forceEndNode = this.matrixStringerHorisontal[row][col + 1][0];

          //console.log("start: " + forceStartNode)
          //console.log("end: " + forceEndNode)

          let widthStringer =
            grid.gridNodes[row][col + 1][0] -
            grid.gridNodes[row][col][0] -
            2 * adjust;

          let widthStart =
            abs(forceStartNode / (forceStartNode - forceEndNode)) *
            widthStringer;
          let widthEnd = widthStringer - widthStart;

          //console.log("Width: " + widthStart);

          let start = new p5.Vector(
            grid.gridNodes[row][col][0] + adjust,
            grid.gridNodes[row][col][1]
          );

          //console.log("start: " + start)
          let middle = new p5.Vector(
            grid.gridNodes[row][col][0] + widthStart,
            grid.gridNodes[row][col][1]
          );
          let end = new p5.Vector(
            grid.gridNodes[row][col + 1][0],
            grid.gridNodes[row][col + 1][1]
          );

          //**Check if same prefix (-- = + , ++=+)
          if (forceStartNode * forceEndNode >= 0) {
            //this.SetGradient(x, y, w, h, c1, c2)
            this.SetGradient(
              start.x,
              start.y - this.colorWidth / 2,
              widthStringer,
              this.colorWidth,
              c_start,
              c_end
            );
          }
          //**Else change in comp/ten (+-=- , -+=-)
          else {
            //this.SetGradient(x, y, w, h, c1, c2)
            this.SetGradient(
              start.x,
              start.y - this.colorWidth / 2,
              widthStart,
              this.colorWidth,
              c_start,
              c_neutral
            );

            this.SetGradient(
              middle.x,
              middle.y - this.colorWidth / 2,
              widthEnd,
              this.colorWidth,
              c_neutral,
              c_end
            );
          }
        }
      }
    }
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 24
  StringerForceVerticalDisplayColor() {
    this.StringerForceMaxMin();
    //console.log("ForceMax (result line 455): " + this.stringerMax);

    let adjust = 0;

    if (this.stringerMaxMin != 0) {
      //** Grid are not updated at this point. but skins are
      let rowStringer = skinSystem.skinMatrix.length + 1;
      let colStringer = skinSystem.skinMatrix[0].length + 1;
      for (let col = 0; col < colStringer; col += 1) {
        for (let row = 0; row < rowStringer - 1; row += 1) {
          let R = 255;
          let G = 255;
          let B = 255;

          //**StartNode
          let forceStart = abs(
            this.matrixStringerVertical[row][col][1] / this.stringerMaxMin
          );

          if (this.matrixStringerVertical[row][col][1] < 0) {
            R = 255 * (1 - forceStart);
            G = 255 * (1 - forceStart);
            B = 255 * (1 - 0.1 * forceStart);
          }
          if (this.matrixStringerVertical[row][col][1] >= 0) {
            R = 255 * (1 - 0.1 * forceStart);
            G = 255 * (1 - forceStart);
            B = 255 * (1 - forceStart);
          }
          let c_start = color(R, G, B, this.intensityColor);

          //**MiddelNode
          let c_neutral = color(255, 255, 255, 0);

          //**EndNode
          let forceEnd = abs(
            this.matrixStringerVertical[row + 1][col][0] / this.stringerMaxMin
          );
          if (this.matrixStringerVertical[row + 1][col][0] < 0) {
            R = 255 * (1 - forceEnd);
            G = 255 * (1 - forceEnd);
            B = 255 * (1 - 0.1 * forceEnd);
          }
          if (this.matrixStringerVertical[row + 1][col][0] >= 0) {
            R = 255 * (1 - 0.1 * forceEnd);
            G = 255 * (1 - forceEnd);
            B = 255 * (1 - forceEnd);
          }
          let c_end = color(R, G, B, this.intensityColor);
          // console.table(this.matrixStringerVertical)

          let forceStartNode = this.matrixStringerVertical[row][col][0];
          let forceEndNode = this.matrixStringerVertical[row + 1][col][0];

          //console.log("start: " + forceStartNode)
          //console.log("end: " + forceEndNode)

          let hightStringer =
            grid.gridNodes[row + 1][col][1] -
            grid.gridNodes[row][col][1] -
            2 * adjust;

          let widthStart =
            abs(forceStartNode / (forceStartNode - forceEndNode)) *
            hightStringer;
          let widthEnd = hightStringer - widthStart;

          //console.log("Width: " + widthStart);

          let start = new p5.Vector(
            grid.gridNodes[row][col][0],
            grid.gridNodes[row][col][1] + adjust
          );

          //console.log("start: " + start)
          let middle = new p5.Vector(
            grid.gridNodes[row][col][0],
            grid.gridNodes[row][col][1] + widthStart
          );
          let end = new p5.Vector(
            grid.gridNodes[row + 1][col][0],
            grid.gridNodes[row + 1][col][1]
          );

          //**Check if same prefix (-- = + , ++=+)
          if (forceStartNode * forceEndNode >= 0) {
            //this.SetGradient(x, y, w, h, c1, c2)
            this.SetGradientVertical(
              start.x - this.colorWidth / 2,
              start.y,
              this.colorWidth,
              hightStringer,
              c_start,
              c_end
            );
          }
          //**Else change in comp/ten (+-=- , -+=-)
          else {
            //this.SetGradient(x, y, w, h, c1, c2)
            this.SetGradientVertical(
              start.x - this.colorWidth / 2,
              start.y,
              this.colorWidth,
              widthStart,

              c_start,
              c_neutral
            );

            this.SetGradientVertical(
              middle.x - this.colorWidth / 2,
              middle.y,
              this.colorWidth,
              widthEnd,
              c_neutral,
              c_end
            );
          }
        }
      }
    }
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 25
  DisplayStringerHorisontal() {
    //************************************************************
    //***** DisplayStringerHorisontal() ** START *****************
    //************************************************************
    //** DisplayStringer and values - called from sketch
    if (this.insertPointStringerHor.length < grid.rowsTotal) {
      for (
        let i = this.insertPointStringerHor.length;
        i < grid.rowsTotal;
        i++
      ) {
        // this.insertPointStringerHor[i] = [new p5.Vector(400, 1800 + i * 100), check overlap];
        this.insertPointStringerHor.push([
          new p5.Vector(
            this.insertPointstringerHorisontal.x,
            this.insertPointstringerHorisontal.y + i * 200
          ),
          false,
        ]);
      }
    }

    //** Delete this.insertPointStringerHor if GridLine deleted
    if (this.insertPointStringerHor.length > grid.rowsTotal) {
      this.insertPointStringerHor.pop(); //** Remove from end
    }

    for (let i = 0; i < this.insertPointStringerHor.length; i++) {
      //** StartLine ** START **
      push(); //** 1 Start
      stroke(0);
      noFill();
      circle(
        this.insertPointStringerHor[i][0].x,
        this.insertPointStringerHor[i][0].y,
        40
      );
      line(
        this.insertPointStringerHor[i][0].x + 20,
        this.insertPointStringerHor[i][0].y,
        this.insertPointStringerHor[i][0].x + 130,
        this.insertPointStringerHor[i][0].y
      );

      //** gridRow Text
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(24);
      text(
        i,
        this.insertPointStringerHor[i][0].x,
        this.insertPointStringerHor[i][0].y + 2
      );
      pop(); //** 1 End
      //** StartLine ** END **

      let start_x = this.insertPointStringerHor[i][0].x + 150;
      let start_y = this.insertPointStringerHor[i][0].y;
      let end_x = this.insertPointStringerHor[i][0].x + 150;
      let end_y = this.insertPointStringerHor[i][0].y;

      for (let colGrid = 0; colGrid < grid.columnsTotal; colGrid++) {
        //**
        if (colGrid < grid.columnsTotal - 1) {
          end_x += skinSystem.skinMatrix[0][colGrid].w;
          end_y = this.insertPointStringerHor[i][0].y;

          //** shade
          let p0x = start_x;
          let p0y = start_y;
          let p1x = end_x;
          let p1y = end_y;

          let p2x = p1x;
          let p2y =
            p1y -
            this.matrixStringerHorisontal[i][colGrid + 1][0] /
              (10 * scaleStringer);

          let p3x = p0x;
          let p3y =
            p0y -
            this.matrixStringerHorisontal[i][colGrid][1] / (10 * scaleStringer);

          //*************************************************
          //** Color ** START  ******************************
          //*************************************************
          push(); //** 2 Start

          let forceStartNode = this.matrixStringerHorisontal[i][colGrid][1];
          let forceEndNode = this.matrixStringerHorisontal[i][colGrid + 1][0];

          fill(0, 0, 0, 0);
          if (forceStartNode <= 0 && forceEndNode <= 0) fill(0, 0, 255, 50);
          if (forceStartNode >= 0 && forceEndNode >= 0) fill(255, 0, 0, 50);

          //** if no force stroke is not drawn
          if (round(forceEndNode, 0) == 0 && round(forceStartNode, 0) == 0)
            strokeWeight(0);
          else strokeWeight(1);

          quad(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);

          //** cross line
          if (forceStartNode * forceEndNode < 0) {
            let widthStringer =
              grid.gridNodes[i][colGrid + 1][0] - grid.gridNodes[i][colGrid][0];

            let widthStart =
              abs(forceStartNode / (forceStartNode - forceEndNode)) *
              widthStringer;

            let middle = new p5.Vector(start_x + widthStart, start_y);

            let pmx = middle.x;
            let pmy = middle.y;

            // fill(0, 255, 0);
            if (forceStartNode <= 0) fill(0, 0, 255, 50);
            if (forceStartNode >= 0) fill(255, 0, 0, 50);
            triangle(p0x, p0y, pmx, pmy, p3x, p3y);

            if (forceEndNode <= 0) fill(0, 0, 255, 50);
            if (forceEndNode >= 0) fill(255, 0, 0, 50);
            triangle(p1x, p1y, pmx, pmy, p2x, p2y);
          }

          pop(); //** 2 End
          //***********************************************
          //** Color ** END  ******************************
          //***********************************************

          //** Shear
          let forceLeftOfNode = round(
            this.matrixStringerHorisontal[i][colGrid][0] / 1000,
            2
          );
          let forceRigthOfNode = round(
            this.matrixStringerHorisontal[i][colGrid][1] / 1000,
            2
          );

          //** Used in display ** start skin && end skin
          let forceLeft = -round(
            this.matrixStringerHorisontal[i][colGrid][1] / (10 * scaleStringer),
            2
          );
          let forceRigth = -round(
            this.matrixStringerHorisontal[i][colGrid + 1][0] /
              (10 * scaleStringer),
            2
          );

          push(); //** 3 Start
          //** Line in insertStringerLine
          line(start_x, start_y, end_x, end_y);
          //fill(0)
          circle(start_x, start_y, 6);
          circle(end_x, end_y, 6);

          //*********************************
          //** Display ForceValue ** START **
          //*********************************

          textAlign(CENTER, CENTER);
          fill(0);
          textSize(24);

          let adjustUp = -25; //** => value above graph
          let adjustDown = -25; //** => value above graph
          if (forceLeftOfNode < 0) adjustUp = 25;
          if (forceRigthOfNode < 0) adjustDown = 25;

          //** If forceLeft = forceRigth
          if (forceLeftOfNode == forceRigthOfNode) {
            if (forceLeftOfNode != 0)
              text(nf(-forceLeftOfNode, 0, 2), p3x, p3y + adjustUp); //start_y + forceLeft + adjust);
          }

          //** if jump in force on different side of line
          else if (forceLeftOfNode * forceRigthOfNode <= 0) {
            if (forceLeftOfNode != 0)
              text(
                nf(-forceLeftOfNode, 0, 2),
                start_x,
                start_y - (forceLeftOfNode * 100) / scaleStringer + adjustUp
              );

            if (forceRigthOfNode != 0)
              text(
                nf(-forceRigthOfNode, 0, 2),
                start_x,
                start_y - (forceRigthOfNode * 100) / scaleStringer + adjustDown
              );
          }

          //** If jump in force on same side of line
          else if (forceLeftOfNode < 0 && forceRigthOfNode < 0) {
            text(
              nf(-forceLeftOfNode, 0, 2),
              start_x - 30,
              start_y - (forceLeftOfNode * 100) / scaleStringer + adjustUp
            );
            text(
              nf(-forceRigthOfNode, 0, 2),
              start_x + 30,
              start_y - (forceRigthOfNode * 100) / scaleStringer + adjustDown
            );
          } else if (forceLeftOfNode > 0 && forceRigthOfNode > 0) {
            text(
              nf(-forceLeftOfNode, 0, 2),
              start_x - 40,
              start_y - (forceLeftOfNode * 100) / scaleStringer + adjustUp
            );
            text(
              nf(-forceRigthOfNode, 0, 2),
              start_x + 40,
              start_y - (forceRigthOfNode * 100) / scaleStringer + adjustDown
            );
          }

          //*******************************
          //** Display ForceValue ** END **
          //*******************************
          pop(); //** 3 End

          start_x = end_x;
          start_y = end_y;
        } //** end of colGrid

        //** EndNode ** Display ForceValue
        push(); //** 4 Start
        textAlign(CENTER, CENTER);
        textSize(24);
        if (colGrid == grid.columnsTotal - 1) {
          let forceLeftOfNode = round(
            this.matrixStringerHorisontal[i][colGrid][0] / 1000,
            2
          );

          if (forceLeftOfNode < 0) {
            text(
              nf(-forceLeftOfNode, 0, 2),
              start_x,
              start_y - (forceLeftOfNode * 100) / scaleStringer + 25
            );
          } else if (forceLeftOfNode > 0) {
            text(
              nf(-forceLeftOfNode, 0, 2),
              start_x,
              start_y - (forceLeftOfNode * 100) / scaleStringer - 25
            );
          }
        }
        pop(); //** 4 End
      }
    } // end of rowGrid / insertStringerPoint

    //** Test Overlap and => move
    this.OverlapInsertPointStringer(mousePosWorld);
    this.MoveInsertPointStringer(mousePosWorld);
    //**********************************************************
    //***** DisplayStringerHorisontal() ** END *****************
    //**********************************************************
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 26
  DisplayStringerVertical() {
    //**********************************************************
    //***** DisplayStringerVertical() ** START *****************
    //**********************************************************
    //** DisplayStringer and values - called from sketch
    if (this.insertPointStringerVer.length < grid.columnsTotal) {
      for (
        let i = this.insertPointStringerVer.length;
        i < grid.columnsTotal;
        i++
      ) {
        // this.insertPointStringerVer[i] = [new p5.Vector(400, 1800 + i * 100), check overlap];
        this.insertPointStringerVer.push([
          new p5.Vector(
            this.insertPointstringerVertical.x + i * 200,
            this.insertPointstringerVertical.y
          ),
          false,
        ]);
      }
    }

    //** Delete this.insertPointStringerHor if GridLine deleted
    if (this.insertPointStringerVer.length > grid.columnsTotal) {
      this.insertPointStringerVer.pop(); //** Remove from end
    }

    for (let i = 0; i < this.insertPointStringerVer.length; i++) {
      //** StartLine ** START **
      push();
      stroke(0);
      noFill();
      circle(
        this.insertPointStringerVer[i][0].x,
        this.insertPointStringerVer[i][0].y,
        40
      );
      line(
        this.insertPointStringerVer[i][0].x,
        this.insertPointStringerVer[i][0].y + 20,
        this.insertPointStringerVer[i][0].x,
        this.insertPointStringerVer[i][0].y + 130
      );

      //** gridCol Text
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(24);
      text(
        i,
        this.insertPointStringerVer[i][0].x,
        this.insertPointStringerVer[i][0].y + 2
      );

      pop();
      //** StartLine ** END **

      let start_x = this.insertPointStringerVer[i][0].x;
      let start_y = this.insertPointStringerVer[i][0].y + 150;
      let end_x = this.insertPointStringerVer[i][0].x;
      let end_y = this.insertPointStringerVer[i][0].y + 150;

      //console.table(this.matrixStringerVertical)

      for (let rowGrid = 0; rowGrid < grid.rowsTotal; rowGrid++) {
        //**
        if (rowGrid < grid.rowsTotal - 1) {
          end_x = this.insertPointStringerVer[i][0].x;
          end_y += skinSystem.skinMatrix[rowGrid][0].h;

          //** shade
          let p0x = start_x;
          let p0y = start_y;
          let p1x = end_x;
          let p1y = end_y;

          let p2x =
            p1x +
            this.matrixStringerVertical[rowGrid + 1][i][0] /
              (10 * scaleStringer);
          let p2y = p1y;

          let p3x =
            p0x +
            this.matrixStringerVertical[rowGrid][i][1] / (10 * scaleStringer);
          let p3y = p0y;

          //*************************************************
          //** Color ** START  ******************************
          //*************************************************
          push(); //** 3 Start//** Color

          let forceStartNode = this.matrixStringerVertical[rowGrid][i][1];
          let forceEndNode = this.matrixStringerVertical[rowGrid + 1][i][0];

          fill(0, 0, 0, 0);
          if (forceStartNode <= 0 && forceEndNode <= 0) fill(0, 0, 255, 50);
          if (forceStartNode >= 0 && forceEndNode >= 0) fill(255, 0, 0, 50);

          //** if no force stroke is not drawn
          if (round(forceEndNode, 0) == 0 && round(forceStartNode, 0) == 0)
            strokeWeight(0);
          else strokeWeight(1);

          quad(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);

          //** cross line
          if (forceStartNode * forceEndNode < 0) {
            let heigthStringer =
              grid.gridNodes[rowGrid + 1][i][1] - grid.gridNodes[rowGrid][i][1];

            let heigthStart =
              abs(forceStartNode / (forceStartNode - forceEndNode)) *
              heigthStringer;

            let middle = new p5.Vector(start_x, start_y + heigthStart);
            //circle(middle.x, middle.y, 20);

            let pmx = middle.x;
            let pmy = middle.y;

            // fill(0, 255, 0);
            if (forceStartNode <= 0) fill(0, 0, 255, 50);
            if (forceStartNode >= 0) fill(255, 0, 0, 50);
            triangle(p0x, p0y, pmx, pmy, p3x, p3y);

            if (forceEndNode <= 0) fill(0, 0, 255, 50);
            if (forceEndNode >= 0) fill(255, 0, 0, 50);
            triangle(p1x, p1y, pmx, pmy, p2x, p2y);
          }

          pop(); //** 3 End //** Color
          //***********************************************
          //** Color ** END  ******************************
          //***********************************************

          //** Shear
          let forceUpOfNode = round(
            this.matrixStringerVertical[rowGrid][i][0] / 1000,
            2
          );
          let forceDownOfNode = round(
            this.matrixStringerVertical[rowGrid][i][1] / 1000,
            2
          );

          //console.log("result line 2884")
          //console.log("Up: " + i + " " +this.matrixStringerVertical[rowGrid][i][0] )
          //console.log("down: " + i + " " +this.matrixStringerVertical[rowGrid][i][1] )

          //** Used in display ** start skin && end skin
          let forceUp = -round(
            this.matrixStringerVertical[rowGrid][i][1] / (10 * scaleStringer),
            2
          );
          let forceDown = -round(
            this.matrixStringerVertical[rowGrid + 1][i][0] /
              (10 * scaleStringer),
            2
          );

          push(); //** 4 Start
          //** Line in insertStringerLine
          line(start_x, start_y, end_x, end_y);
          //fill(0)
          circle(start_x, start_y, 6);
          circle(end_x, end_y, 6);

          //*********************************
          //** Display ForceValue ** START **
          //*********************************

          textAlign(CENTER, CENTER);
          fill(0);
          textSize(24);

          let adjustLeft = 35; //** => value above graph
          let adjustRigth = 35; //** => value above graph
          if (forceUpOfNode < 0) adjustLeft = -35;
          if (forceDownOfNode < 0) adjustRigth = -35;

          //** If forceUp = forceDown
          if (forceUpOfNode == forceDownOfNode) {
            if (forceUpOfNode != 0)
            text(nf(-forceUpOfNode, 0, 2), p3x + adjustLeft, p3y);
          }
          //** if jump in force on different side of line
          else if (forceUpOfNode * forceDownOfNode <= 0) {
            if (forceUpOfNode != 0)
            text(
              nf(-forceUpOfNode, 0, 2),
              start_x + (forceUpOfNode * 100) / scaleStringer - adjustRigth,
              start_y
            );

            if (forceDownOfNode != 0)
            text(
              nf(-forceDownOfNode, 0, 2),
              start_x + (forceDownOfNode * 100) / scaleStringer - adjustLeft,
              start_y
            );
          }
          //** If jump in force on same side of line
          else if (forceUpOfNode < 0 && forceDownOfNode < 0) {
            text(
              nf(-forceUpOfNode, 0, 2),
              start_x + (forceUpOfNode * 100) / scaleStringer + adjustRigth,
              start_y - 25
            );
            text(
              nf(-forceDownOfNode, 0, 2),
              start_x + (forceDownOfNode * 100) / scaleStringer + adjustLeft,
              start_y + 25
            );
          } else if (forceUpOfNode > 0 && forceDownOfNode > 0) {
            text(
              nf(-forceUpOfNode, 0, 2),
              start_x + (forceUpOfNode * 100) / scaleStringer + adjustRigth,
              start_y - 25
            );
            text(
              nf(-forceDownOfNode, 0, 2),
              start_x + (forceDownOfNode * 100) / scaleStringer + adjustLeft,
              start_y + 25
            );
          }

          //*******************************
          //** Display ForceValue ** END **
          //*******************************
          pop(); //** 4 End

          start_x = end_x;
          start_y = end_y;
        } //** end of rowGrid

        //** EndNode ** Display ForceValue
        push(); //** 5 Start
        textAlign(CENTER, CENTER);
        textSize(24);
        if (rowGrid == grid.rowsTotal - 1) {
          let forceDownOfNode = round(
            this.matrixStringerVertical[rowGrid][i][0] / 1000,
            2
          );

          if (forceDownOfNode < 0) {
            text(
              nf(-forceDownOfNode, 0, 2),
              start_x + (forceDownOfNode * 100) / scaleStringer - 35,
              start_y
            );
          } else if (forceDownOfNode > 0) {
            text(
              nf(-forceDownOfNode, 0, 2),
              start_x + (forceDownOfNode * 100) / scaleStringer + 35,
              start_y
            );
          }
        }
        pop(); //** 5 End
      }
    } // end of rowGrid / insertStringerPoint

    //** Test Overlap and => move
    this.OverlapInsertPointStringerVertical(mousePosWorld);
    this.MoveInsertPointStringer(mousePosWorld);
    //********************************************************
    //***** DisplayStringerVertical() ** END *****************
    //********************************************************
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 27
  OverlapInsertPointStringer(pos) {
    let countLogged = 0;

    for (let i = 0; i < this.insertPointStringerHor.length; i++) {
      let distToStringerHor = dist(
        pos.x,
        pos.y,
        this.insertPointStringerHor[i][0].x,
        this.insertPointStringerHor[i][0].y
      );

      let logInsertPoint;

      //** Log => that node sticks to mousePos until released
      //** set to false in mouseIsReleased (Sketch)
      if (mouseIsPressed && distToStringerHor < 20 && countLogged == 0) {
        countLogged++;
        this.insertPointStringerHor[i][1] = true;
      }

      push();
      noFill();
      noStroke();

      if (distToStringerHor < 20 && !mouseIsPressed && countLogged == 0)
        fill(100, 100, 100, 100);
      if (this.insertPointStringerHor[i][1] && mouseIsPressed)
        fill(0, 250, 0, 100);
      circle(
        this.insertPointStringerHor[i][0].x,
        this.insertPointStringerHor[i][0].y,
        40
      );

      pop();
    }
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 28
  OverlapInsertPointStringerVertical(pos) {
    let countLogged = 0;

    for (let i = 0; i < this.insertPointStringerVer.length; i++) {
      let distToStringerVer = dist(
        pos.x,
        pos.y,
        this.insertPointStringerVer[i][0].x,
        this.insertPointStringerVer[i][0].y
      );

      //let logInsertPoint;

      //** Log => that node sticks to mousePos until released
      //** set to false in mouseIsReleased (Sketch)
      if (mouseIsPressed && distToStringerVer < 20 && countLogged == 0) {
        countLogged++;
        this.insertPointStringerVer[i][1] = true;
      }

      push();
      noFill();
      noStroke();

      if (distToStringerVer < 20 && !mouseIsPressed && countLogged == 0)
        fill(100, 100, 100, 100);
      if (this.insertPointStringerVer[i][1] && mouseIsPressed)
        fill(0, 250, 0, 100);
      circle(
        this.insertPointStringerVer[i][0].x,
        this.insertPointStringerVer[i][0].y,
        40
      );

      pop();
    }
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 29
  MoveInsertPointStringer(pos) {
    for (let i = 0; i < this.insertPointStringerHor.length; i++) {
      //** InserPoint... [i][1] true/false if overlapped
      //** Set in result.OverlapInsertPointStringer(pos)
      if (this.insertPointStringerHor[i][1] && mouseIsPressed) {
        //**pos.y in multioplum of this.stepChangeGrid
        let remainderX = int(pos.y) % this.stepChange;
        if (remainderX > this.stepChange / 2)
          pos.y = int(pos.y) + (this.stepChange - remainderX);
        if (remainderX <= this.stepChange / 2) pos.y = int(pos.y) - remainderX;

        //**pos.x in multioplum of this.stepChangeGrid
        let remainderY = int(pos.x) % this.stepChange;
        if (remainderY > this.stepChange / 2)
          pos.x = int(pos.x) + (this.stepChange - remainderY);
        if (remainderY <= this.stepChange / 2) pos.x = int(pos.x) - remainderY;

        //** if point logged => move
        // if (this.insertPointStringerHor[i][1]) {
        this.insertPointStringerHor[i][0].x = pos.x;
        this.insertPointStringerHor[i][0].y = pos.y;
        // }
      }
    }

    for (let i = 0; i < this.insertPointStringerVer.length; i++) {
      //** InserPoint... [i][1] true/false if overlapped
      //** Set in result.OverlapInsertPointStringer(pos)
      if (this.insertPointStringerVer[i][1] && mouseIsPressed) {
        //**pos.y in multioplum of this.stepChangeGrid
        let remainderX = int(pos.y) % this.stepChange;
        if (remainderX > this.stepChange / 2)
          pos.y = int(pos.y) + (this.stepChange - remainderX);
        if (remainderX <= this.stepChange / 2) pos.y = int(pos.y) - remainderX;

        //**pos.x in multioplum of this.stepChangeGrid
        let remainderY = int(pos.x) % this.stepChange;
        if (remainderY > this.stepChange / 2)
          pos.x = int(pos.x) + (this.stepChange - remainderY);
        if (remainderY <= this.stepChange / 2) pos.x = int(pos.x) - remainderY;

        //** if point logged => move
        // if (this.insertPointStringerHor[i][1]) {
        this.insertPointStringerVer[i][0].x = pos.x;
        this.insertPointStringerVer[i][0].y = pos.y;
        // }
      }
    }
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 30
  SetGradient(x, y, w, h, c1, c2) {
    push();
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);

      line(i, y, i, y + h);
    }
    pop();
  }

  //*****************************************************************************
  //*****************************************************************************
  //*****************************************************************************

  //** 31
  SetGradientVertical(x, y, w, h, c1, c2) {
    push();
    // Left to right gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
    pop();
  }
}
