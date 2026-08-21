class Table {
  constructor() {
    this.countLoggedInsertPoints = 0;

    //** Result
    //this.insertPointTabelDef = new p5.Vector(900, 1700);
    //this.insertPointTabelSpring = new p5.Vector(850, 500);
    this.insertPointTabelSupport = new p5.Vector(1400, 1700);

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
    } 
    
  
    else {
      //** Sets all overlapCiffer to false
      for (let i = 0, length = supports.length; i < length; i++) {
        supports[i].buttonRollor_Cy.overlapCiffer = false;
        supports[i].buttonRollor_Cz.overlapCiffer = false;
      }
    }

    pop();
  }

  DisplaySupport(pos) {
    //*************************************************
    //************ Tabel Support  ************ START ***
    //*************************************************
    let p = this.insertPointTabelSupport;
    let col_0 = 0; //** Node
    let col_1 = 100; //** Cy
    let col_2 = 250; //** Cz
    let col_3 = 500;
    //let col_4 = 750;

    push();
    circle(p.x, p.y, 20);

    //** Table Background
    noStroke();
    fill(255, 150);
    let w = col_3;
    let h = 100 + 50 * supports.length;
    rect(p.x, p.y, w, h); //** Set at metod end
    fill(0);

    //** Headline
    textAlign(LEFT, CENTER);
    textSize(30);
    text("Support", p.x, p.y - 25);

    //** Table Text
    textAlign(CENTER, CENTER);
    textSize(30);
    text("Node", p.x + 50, p.y + 25);

    textAlign(RIGHT);
    text("Cy", p.x + col_2 - 15, p.y + 25);
    text("[kN/mm]", p.x + col_2 - 15, p.y + 75);
    text("Cz", p.x + col_3 - 15, p.y + 25);
    text("[kNm/rad]", p.x + col_3 - 15, p.y + 75);
    //text("Force", p.x + col_4 - 15, p.y + 25);
    //text("[kN]", p.x + col_4 - 15, p.y + 75);
    pop();

    //** Lines
    push();
    stroke(0);
    translate(p.x, p.y);
    let length = supports.length;
    //** Horisontal
    line(-5, 0, col_3 + 5, 0);
    line(-5, 100, col_3 + 5, 100);
    line(-5, 100 + length * 50, col_3 + 5, 100 + length * 50);
    //** Vertical
    line(0, -5, 0, 100 + 50 * length + 5);
    line(100, -5, 100, 100 + 50 * length + 5);
    line(250, -5, 250, 100 + 50 * length + 5);
    line(col_3, -5, col_3, 100 + 50 * length + 5);
    pop();

    //** Values
    push();
    for (let i = 0, length = supports.length; i < length; i++) {
      textAlign(CENTER, CENTER);
      textSize(30);
      let support = supports[i].nodeId;
      text(support, p.x + col_0 + 50, p.y + 127.5 + 50 * i);

      textAlign(RIGHT);

      //let supports_Temp = supports.copy

      let Cy = nf(supports[i].Cy / 1000, 0, 1);
      let Cz = nf(supports[i].Cz / 1000000000, 0, 2);

      //let Cy = nf(supports[i].buttonRollor_Cy.ReadValue(),0, 1);
      //let Cz = nf(supports[i].buttonRollor_Cz.ReadValue(), 0, 1);
      //console.log("Cy: " + supports[i].Cy  + " Cz: " + supports[i].Cz )

      if (Cz == 0) text("-", p.x + col_3 - 15, p.y + 127.5 + 50 * i);
      else {
        text(Cz, p.x + col_3 - 15 - 75, p.y + 130 + 50 * i);
        text(" x 10", p.x + col_3 - 15 - 15, p.y + 130 + 50 * i);

        push();
        textSize(20);
        text("6", p.x + col_3 - 15, p.y + 127.5 - 10 + 50 * i);
        pop();
      }

      if (Cy == 0) Cy = "-";
      text(Cy, p.x + col_2 - 15, p.y + 130 + 50 * i);

      //  let angle = nf(round(degrees(supportArray[i].C_angle) - 90, 1), 0, 1);
      //  text(angle, p.x + col_3 - 15, p.y + 130 + 50 * i);

      /*
      let force_1 = nf(
        round(supportArray[i].supportForce.mag() / 1000, 1),
        0,
        1
      );
      */
    }
    pop();
  }

  TableMoveSteps(pos) {
    //**pos.y in multioplum of stepChange
    let stepChange = 10; //*scaleGeo;
    pos.x = round(pos.x / stepChange) * stepChange;
    pos.y = round(pos.y / stepChange) * stepChange;
    return pos;
  }
}
