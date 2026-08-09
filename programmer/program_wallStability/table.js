class Table {
  constructor() {
    this.countLoggedInsertPoints = 0;
    this.table_h = 0;

    //** Result
    //this.insertPointTabelDef = new p5.Vector(900, 1700);
    //this.insertPointTabelSpring = new p5.Vector(850, 500);
    //this.insertPointTabelSupport = new p5.Vector(1400, 1700);
    this.insertPointLoadTable = new p5.Vector(1400, 1000);

    //this.insertPointDefLog = false;
    //this.insertPointSpringLog = false;
    //this.insertPointSupportLog = false;
    this.insertPointLoadTableLog = false;

    //** Input
    //this.insertPointTabelLoad = new p5.Vector(400, 1700);

    //this.insertPointLoadLog = false;

    this.rowOverlap = undefined;
    this.colOverlap = undefined;
  }

  //** 1 **
  OverlapInsertPoint(pos) {
    //console.log(this.insertPointLoadTable)
    //** Move Table
    //** Called in sketch

    let distInsertPointLoadTable = dist(
      pos.x,
      pos.y,
      this.insertPointLoadTable.x,
      this.insertPointLoadTable.y
    );

    if (distInsertPointLoadTable < 10) {
      this.OverlapHighligth(this.insertPointLoadTable);
      if (this.countLoggedInsertPoints == 0) {
        //** LogState => move particle fast
        if (mouseIsPressed) {
          this.insertPointLoadTableLog = true;
          this.countLoggedInsertPoints++;
        } else {
          this.insertPointLoadTableLog = false;
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

    if (this.insertPointLoadTableLog) {
      this.insertPointLoadTable.x = pos.x;
      this.insertPointLoadTable.y = pos.y;
    }
  }

  


  TabelLoad() {
    let p = this.insertPointLoadTable;
    let col_0 = 50; //** Row
    let col_1 = 150; //** Col
    let col_2 = 300; //** t
    let col_3 = 425; //** V

    push();
    noFill();
    circle(p.x, p.y, 20);

    let count = 0;
    /*
    //** Highligt skin in table
    let rowOverlap = 1//skinSystem.rowLog;
    let colOverlap = 1//skinSystem.colLog;
    
    let columns = 2
    let rows = 3
    

    fill(0, 250, 0, 200);
    noStroke();
    if (!mouseIsPressed) {
      rect(
        p.x + col_0 - 45,
        p.y +
          5 +
          (50 * colOverlap - 25) +
          50 * (rowOverlap * columns) +
          125,
        490,
        40
      );
    }
    */

    let walls = wallArray.length;
    //let loads = 3

    //** Table Background
    fill(255, 150);
    rect(p.x, p.y, 500, 100 + 50 * this.loadsTotal);

    fill(0);

    //** Headline
    textAlign(LEFT, CENTER);
    textSize(30);
    text("Load Vertical", p.x, p.y - 25);

    //** Table Text
    textAlign(CENTER, CENTER);
    textSize(30);

    //text("Skin", p.x + 50, p.y + 25);
    text("Wall", p.x + col_0, p.y + 75);
    text("Load", p.x + col_1, p.y + 75);

    textAlign(RIGHT, CENTER);
    text("x", p.x + col_2 + 25, p.y + 25);
    text("[m]", p.x + col_2 + 25, p.y + 75);
    text("P", p.x + col_3 + 50, p.y + 25);
    text("[kN]", p.x + col_3 + 50, p.y + 75);
    textAlign(CENTER, CENTER);

    let countOverlap = 0;
    this.loadsTotal = 0;

    for (let wall = walls - 1; wall >= 0; wall--) {
      //  this.BubbleSortLoad(wallArray[wall].loadVertical_Array)
      this.loadsTotal += wallArray[wall].loadVertical_Array.length - 1; //** dont count G_wall

      //** Line horisontal at last load in table for each wall
      //** Lines
      push();
    stroke(100, 100, 100, 250);
    strokeWeight(2);
      line(
        p.x - 5,
        p.y + 100 + 50 * this.loadsTotal,
        p.x + col_3 + 80,
        p.y + 100 + 50 * this.loadsTotal
      );
      pop();

      //**only text if there is a load
      if (wallArray[wall].loadVertical_Array.length > 1)
        text(wall, p.x + col_0, p.y + 50 * count + 125 + 2.5);

      for (
        let load = 1;
        load < wallArray[wall].loadVertical_Array.length;
        load++
      ) {
        count++;

        let x1 = p.x + col_1;
        let y1 = p.y + 50 * (count - 1) + 125 + 2.5;

        let x2 = p.x + col_2 + 25;
        let y2 = p.y + 50 * (count - 1) + 125 + 2.5;

        let x3 = p.x + col_3 + 50; //** Shear
        let y3 = p.y + 50 * (count - 1) + 125 + 2.5;

        //** only print wallNumber if load on wall
        if (wallArray[wall].loadVertical_Array.length > 1)
          text(wallArray[wall].loadVertical_Array[load].loadCase, x1, y1);

        let mesure =
          (1 / 100) *
          (wallArray[wall].loadVertical_Array[load].ip_Load_N.x -
            wallArray[wall].insertPointWall.x)*scaleGeo_Test;
        textAlign(RIGHT);
        text(nf(mesure, 0, 3), x2, y2);
        text(
          nf(wallArray[wall].loadVertical_Array[load].value_load_N, 0, 2),
          x3,
          y3
        );
        textAlign(CENTER);
      }
    }

    //** Lines
    stroke(100, 100, 100, 250);
    strokeWeight(2);
    this.table_h = 50 * this.loadsTotal;

    //** Horisontal Lines
    line(p.x - 5, p.y, p.x + col_3 + 80, p.y);
    line(p.x - 5, p.y + 100, p.x + col_3 + 80, p.y + 100);

    //** Vertical lines
    line(p.x,p.y - 5, p.x, p.y + this.table_h + 105);
    line(p.x + 100, p.y + 45, p.x + 100, p.y + this.table_h + 105);
    line(p.x + 200, p.y - 5, p.x + 200, p.y + this.table_h + 105);
    line(p.x + 350, p.y - 5, p.x + 350, p.y + this.table_h + 105);
    line(p.x + 500, p.y - 5, p.x + 500, p.y + this.table_h+ 105);
    //**

    pop();
  }

  TabelHighlightLoad(pos) {
    push();
    let loads = 0;
    for (let i = 0; i < wallArray.length; i++) {
      loads += wallArray[i].loadVertical_Array.length - 1; //** dont count G_walll in place [0]
      for (let j = 1; j < wallArray[i].loadVertical_Array.length; j++) {
        let distLoadVertical = dist(
          pos.x,
          pos.y,
          wallArray[i].loadVertical_Array[j].ip_Load_N.x,
          wallArray[i].loadVertical_Array[j].ip_Load_N.y
        );

        if (distLoadVertical < 10) {
          //console.log(loads);
          let placeInArray = j - 1; //** dont count G_wall in place [0]
         // console.log(placeInArray);
          this.logWall = i;
          this.logLoad = j;
          this.logLoadCase = wallArray[i].loadVertical_Array[j].loadCase;

          noStroke();
          fill(0, 255, 0, 100);
          rect(
            this.insertPointLoadTable.x+5,
            this.insertPointLoadTable.y +
              100 +5+
              this.table_h -
              50 * loads +
              50 * placeInArray,
            490,
            40
          );

        }
      }
    }
    pop();
  }

  //**Sort loadPoints by loadCase so that
  //**Called from sketch
  BubbleSortLoad(array) {
    //console.log(array)
    for (let i = array.length - 1; i > 1; i--) {
      for (let j = 1; j < i; j++) {
        //console.log("*** " +array[j].loadCase)
        if (array[j].loadCase > array[j + 1].loadCase) {
          // swap
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }

    //**Redefine loadCaseNumber
    for (let i = 1; i < array.length; i++) {
      // array[i].loadCase = i;
      // console.log(array[i].loadCase)
    }
  }

  TableMoveSteps(pos) {
    //**pos.y in multioplum of stepChange
    pos.x = round(pos.x / stepChange) * stepChange;
    pos.y = round(pos.y / stepChange) * stepChange;
    return pos;
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

        //** Show buttonRoller if mouseY is in cell
        let test = pos.y - translatePoint_Cz.y;
        if (test > -35 && test < -5) {
          push();
          noStroke();
          fill(255, 255, 255);
          rect(5, -40, 150, 40);
          pop();
          //console.log(" table line 139 && 179 test Cz");

          //console.log("table line 139 pos.y: " + test)
          supports[row].buttonRollor_Cz.DisplayButonRollor(
            supports[row].graphPosNoScale_Cz
          );
          supports[row].Cz = supports[row].buttonRollor_Cz.ReadValue() * 1000e6;
        } else {
          for (let i = 0, length = supports.length; i < length; i++) {
            supports[i].buttonRollor_Cy.overlapCiffer = false;
            supports[i].buttonRollor_Cz.overlapCiffer = false;
          }
        }
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

        //** Show buttonRoller if mouseY is in cell
        let test = pos.y - translatePoint_Cy.y;
        if (test > -35 && test < -5) {
          push();
          noStroke();
          fill(255, 255, 255);
          rect(45, -40, 110, 40);
          pop();
          supports[row].buttonRollor_Cy.DisplayButonRollor(
            supports[row].graphPosNoScale_Cy
          );
          supports[row].Cy = supports[row].buttonRollor_Cy.ReadValue() * 1000;
        } else {
          for (let i = 0, length = supports.length; i < length; i++) {
            supports[i].buttonRollor_Cy.overlapCiffer = false;
            supports[i].buttonRollor_Cz.overlapCiffer = false;
          }
        }
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
