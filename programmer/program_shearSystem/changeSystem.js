//** AddStringer(pos)
//** DeleteStringer(pos)
//** AddSupport(pos)
//** DeleteSupport(pos)
//** AddLoad(pos)
//** DeleteLoad(pos)
//** AddGrid(pos)
//** AddSkinRow(rows, columns, startPos, w, h)
//** AddSkinColumn(rows, columns, startPos, w, h)
//** AddSkinSingle(row, column, startPos, w, h)
//** DeleteSkin(pos)
//** UpdateForCalc()

class ChangeSystem {
  constructor() {}

  AddStringer(pos) {
    /*
    //if (mousePressed && oneTime == false) {}
            this.stringerTopExist = false;
    this.stringerBottomExist = false;
    this.stringerLeftExist = false;
    this.stringerRigthExist = false;
        */

    //** Log skin row & col for mousePosWorld
    let rowLog = skinSystem.rowLog;
    let colLog = skinSystem.colLog;

    let tol = 20;

    if (rowLog >= 0 && colLog >= 0) {
      if (skinSystem.skinMatrix[rowLog][colLog].skinExist == false) {
        let w = skinSystem.skinMatrix[rowLog][colLog].w;
        let h = skinSystem.skinMatrix[rowLog][colLog].h;

        let topLeft = skinSystem.skinMatrix[rowLog][colLog].startPos;
        let bottomRigth = p5.Vector.add(topLeft, new p5.Vector(w, h));

        //circle(bottomRigth.x,bottomRigth.y,40)

        let distTop = pos.y - topLeft.y;
        let distBottom = abs(pos.y - bottomRigth.y);
        let distLeft = pos.x - topLeft.x;
        let distRigth = abs(pos.x - bottomRigth.x);

        let stringerTop = false;
        let stringerBottom = false;
        let stringerLeft = false;
        let stringerRigth = false;

        push();
        //fill(200, 34, 100, 200);
        stroke(0, 250, 0, 200);
        strokeWeight(16);

        //** Check top
        if (rowLog == 0 && distTop < tol) {
          line(topLeft.x, topLeft.y, topLeft.x + w, topLeft.y);
          stringerTop = true;
        }

        //** Check bottom
        if (rowLog == skinSystem.rowsSkin - 1 && distBottom < tol) {
          line(topLeft.x, bottomRigth.y, topLeft.x + w, bottomRigth.y);
          stringerBottom = true;
        }

        //** Check left
        if (colLog == 0 && distLeft < tol) {
          line(topLeft.x, topLeft.y, topLeft.x, bottomRigth.y);
          stringerLeft = true;
        }

        //** Check Rigth
        if (colLog == skinSystem.columnsSkin - 1 && distRigth < tol) {
          line(bottomRigth.x, topLeft.y, bottomRigth.x, bottomRigth.y);
          stringerRigth = true;
        }

        //** Check for skinAbove
        if (0 < rowLog) {
          //** Check for skin Above
          if (
            skinSystem.skinMatrix[rowLog - 1][colLog].skinExist == false &&
            distTop < tol
          ) {
            line(topLeft.x, topLeft.y, topLeft.x + w, topLeft.y);
            stringerTop = true;
          }
        }

        //** Check for skinBelow
        if (rowLog < skinSystem.rowsSkin - 1) {
          //** Check for skin Below
          if (
            skinSystem.skinMatrix[rowLog + 1][colLog].skinExist == false &&
            distBottom < tol
          ) {
            line(topLeft.x, bottomRigth.y, topLeft.x + w, bottomRigth.y);
            stringerBottom = true;
          }
        }

        //** Check for skinLeft
        if (0 < colLog) {
          if (
            skinSystem.skinMatrix[rowLog][colLog - 1].skinExist == false &&
            distLeft < tol
          ) {
            line(topLeft.x, topLeft.y, topLeft.x, bottomRigth.y);
            stringerLeft = true;
          }
        }

        //** Check for skinRigth
        if (colLog < skinSystem.columnsSkin - 1) {
          if (
            skinSystem.skinMatrix[rowLog][colLog + 1].skinExist == false &&
            distRigth < tol
          ) {
            line(bottomRigth.x, topLeft.y, bottomRigth.x, bottomRigth.y);
            stringerRigth = true;
          }
        }

        pop();

        //** AddStringer
        if (mousePressed && oneTime == false) {
          if (stringerTop)
            skinSystem.skinMatrix[rowLog][colLog].stringerTopExist = true;
          if (stringerBottom)
            skinSystem.skinMatrix[rowLog][colLog].stringerBottomExist = true;
          if (stringerLeft)
            skinSystem.skinMatrix[rowLog][colLog].stringerLeftExist = true;
          if (stringerRigth)
            skinSystem.skinMatrix[rowLog][colLog].stringerRigthExist = true;
        }

        oneTime = true;
      }
    }
  }

  DeleteStringer(pos) {
    //** Log skin row & col for mousePosWorld
    let rowLog = skinSystem.rowLog;
    let colLog = skinSystem.colLog;

    let tol = 20;

    if (rowLog >= 0 && colLog >= 0) {
      if (skinSystem.skinMatrix[rowLog][colLog].skinExist == false) {
        let w = skinSystem.skinMatrix[rowLog][colLog].w;
        let h = skinSystem.skinMatrix[rowLog][colLog].h;

        let topLeft = skinSystem.skinMatrix[rowLog][colLog].startPos;
        let bottomRigth = p5.Vector.add(topLeft, new p5.Vector(w, h));

        //circle(bottomRigth.x,bottomRigth.y,40)

        let distTop = pos.y - topLeft.y;
        let distBottom = abs(pos.y - bottomRigth.y);
        let distLeft = pos.x - topLeft.x;
        let distRigth = abs(pos.x - bottomRigth.x);

        push();
        //fill(200, 34, 100, 200);
        stroke(250, 0, 0, 150);
        strokeWeight(16);

        //** Check top
        if (
          distTop < tol &&
          skinSystem.skinMatrix[rowLog][colLog].stringerTopExist
        ) {
          line(topLeft.x, topLeft.y, topLeft.x + w, topLeft.y);
          if (mousePressed && oneTime == false)
            skinSystem.skinMatrix[rowLog][colLog].stringerTopExist = false;
        }
        //** Check bottom
        if (
          distBottom < tol &&
          skinSystem.skinMatrix[rowLog][colLog].stringerBottomExist
        ) {
          line(topLeft.x, bottomRigth.y, topLeft.x + w, bottomRigth.y);
          if (mousePressed && oneTime == false)
            skinSystem.skinMatrix[rowLog][colLog].stringerBottomExist = false;
        }

        //** Check left
        if (
          distLeft < tol &&
          skinSystem.skinMatrix[rowLog][colLog].stringerLeftExist
        ) {
          line(topLeft.x, topLeft.y, topLeft.x, bottomRigth.y);
          if (mousePressed && oneTime == false)
            skinSystem.skinMatrix[rowLog][colLog].stringerLeftExist = false;
        }

        //** Check Rigth
        if (
          distRigth < tol &&
          skinSystem.skinMatrix[rowLog][colLog].stringerRigthExist
        ) {
          line(bottomRigth.x, topLeft.y, bottomRigth.x, bottomRigth.y);
          if (mousePressed && oneTime == false)
            skinSystem.skinMatrix[rowLog][colLog].stringerRigthExist = false;
        }
        pop();
      }
    }

    oneTime = true;
  }

  AddSupport(pos) {
    //** Highligt node
    if (
      grid.OverlapNode(pos) &&
      button_AddSupport_Cx.state == 1 &&
      matrixSupport.matrixSupport[grid.rowNearest][grid.columnNearest].Cx == 0
    ) {
      this.HighLigthNodeGreen();
    }

    if (
      grid.OverlapNode(pos) &&
      button_AddSupport_Cy.state == 1 &&
      matrixSupport.matrixSupport[grid.rowNearest][grid.columnNearest].Cy == 0
    ) {
      this.HighLigthNodeGreen();
    }

    //** Add node
    if (oneTime == false && grid.OverlapNode(pos)) {
      let grid_x = grid.gridNodes[grid.rowNearest][grid.columnNearest][0];
      let grid_y = grid.gridNodes[grid.rowNearest][grid.columnNearest][1];

      //** Cx
      if (button_AddSupport_Cx.state == 1) {
        matrixSupport.matrixSupport[grid.rowNearest][
          grid.columnNearest
        ].Cx = 10000; //** 10kN/mm (equal to startvalue)
      }

      //** Cy
      if (button_AddSupport_Cy.state == 1) {
        matrixSupport.matrixSupport[grid.rowNearest][
          grid.columnNearest
        ].Cy = 10000; //** 10kN/mm (equal to startvalue)
      }

      oneTime = true;
    }
  }

  HighLigthNodeRed() {
    push();
    fill(255, 0, 0, 175);
    noStroke();
    circle(
      grid.gridNodes[grid.rowNearest][grid.columnNearest][0],
      grid.gridNodes[grid.rowNearest][grid.columnNearest][1],
      40
    );
    pop();
  }

  HighLigthNodeGreen() {
    push();
    fill(0, 255, 0, 175);
    noStroke();
    circle(
      grid.gridNodes[grid.rowNearest][grid.columnNearest][0],
      grid.gridNodes[grid.rowNearest][grid.columnNearest][1],
      40
    );
    pop();
  }

  DeleteSupport(pos) {
    //** Highligt node
    if (
      grid.OverlapNode(pos) &&
      button_DeleteSupport_Cx.state == 1 &&
      matrixSupport.matrixSupport[grid.rowNearest][grid.columnNearest].Cx > 0
    ) {
      this.HighLigthNodeRed();
    }

    if (
      grid.OverlapNode(pos) &&
      button_DeleteSupport_Cy.state == 1 &&
      matrixSupport.matrixSupport[grid.rowNearest][grid.columnNearest].Cy > 0
    ) {
      this.HighLigthNodeRed();
    }

    //** Delete if mouseIsPressed
    if (oneTime == false && grid.OverlapNode(pos)) {
      //** Cx
      if (button_DeleteSupport_Cx.state == 1) {
        matrixSupport.matrixSupport[grid.rowNearest][grid.columnNearest].Cx = 0;
        matrixSupport.matrixSupport[grid.rowNearest][
          grid.columnNearest
        ].buttonRollor_Cx.SetValue(10); //** startValueReset
        matrixSupport.matrixSupport[grid.rowNearest][
          grid.columnNearest
        ].supportExist_Cx = false;
      }
      //** Cy
      if (button_DeleteSupport_Cy.state == 1) {
        matrixSupport.matrixSupport[grid.rowNearest][grid.columnNearest].Cy = 0;
        matrixSupport.matrixSupport[grid.rowNearest][
          grid.columnNearest
        ].buttonRollor_Cy.SetValue(10); //** startValueReset
        matrixSupport.matrixSupport[grid.rowNearest][
          grid.columnNearest
        ].supportExist_Cy = false;
        //matrixSupport.matrixSupport[grid.rowNearest][grid.columnNearest]
      }
      oneTime = true;
    }
  }

  AddLoad(pos) {
    //** Highligt node
    if (
      grid.OverlapNode(pos) &&
      button_AddLoad_Px.state == 1 &&
      matrixLoad.matrixLoad[grid.rowNearest][grid.columnNearest].Px == 0
    ) {
      this.HighLigthNodeGreen();
    }

    if (
      grid.OverlapNode(pos) &&
      button_AddLoad_Py.state == 1 &&
      matrixLoad.matrixLoad[grid.rowNearest][grid.columnNearest].Py == 0
    ) {
      this.HighLigthNodeGreen();
    }

    //** Add Load
    if (oneTime == false && grid.OverlapNode(pos)) {
      let grid_x = grid.gridNodes[grid.rowNearest][grid.columnNearest][0];
      let grid_y = grid.gridNodes[grid.rowNearest][grid.columnNearest][1];

      //** Px
      if (button_AddLoad_Px.state == 1) {
        matrixLoad.matrixLoad[grid.rowNearest][grid.columnNearest].Px = 10000;
        /*
        console.log(
          "***** " +
            matrixLoad.matrixLoad[grid.rowNearest][grid.columnNearest].Cx
        );
        */
      }

      //** Py
      if (button_AddLoad_Py.state == 1) {
        matrixLoad.matrixLoad[grid.rowNearest][grid.columnNearest].Py = 10000;
        /*
        console.log(
          "***** " +
            matrixLoad.matrixLoad[grid.rowNearest][grid.columnNearest].Cy
        );
        */
      }

      oneTime = true;
    }
  }

  DeleteLoad(pos) {
    //** Highligt node
    if (
      grid.OverlapNode(pos) &&
      button_DeleteLoad_Px.state == 1 &&
      matrixLoad.matrixLoad[grid.rowNearest][grid.columnNearest].loadExist_Px 
    ) {
      this.HighLigthNodeRed();
    }

    if (
      grid.OverlapNode(pos) &&
      button_DeleteLoad_Py.state == 1 &&
      matrixLoad.matrixLoad[grid.rowNearest][grid.columnNearest].loadExist_Py
    ) {
      this.HighLigthNodeRed();
    }

    //** Delete Load
    if (oneTime == false && grid.OverlapNode(pos)) {
      //** Px
      if (button_DeleteLoad_Px.state == 1) {
        matrixLoad.matrixLoad[grid.rowNearest][grid.columnNearest].Px = 0;
        matrixLoad.matrixLoad[grid.rowNearest][
          grid.columnNearest
        ].buttonRollor_Px.SetValue(10); //** startValueReset
        matrixLoad.matrixLoad[grid.rowNearest][
          grid.columnNearest
        ].loadExist_Px = false;
      }
      //** Py
      if (button_DeleteLoad_Py.state == 1) {
        matrixLoad.matrixLoad[grid.rowNearest][grid.columnNearest].Py = 0;
        matrixLoad.matrixLoad[grid.rowNearest][
          grid.columnNearest
        ].buttonRollor_Py.SetValue(10); //** startValueReset
        matrixLoad.matrixLoad[grid.rowNearest][
          grid.columnNearest
        ].loadExist_Py = false;
      }
      oneTime = true;
    }
  }

  //** AddGrid <=> AddSkin
  AddGrid(pos) {
    systemChanged = true;
    let topLimit = grid.rows[0][0];
    let leftLimit = grid.columns[0][0];
    let rigthLimit = grid.columns[grid.columns.length - 1][0];
    let bottomLimit = grid.rows[grid.rows.length - 1][0];

    //** Only add gridLine Right and bottom
    if (pos.x > leftLimit && pos.y > topLimit) {
      //** [0] = x value, [1] = y start, [2] = y end, [3] = column
      let x = grid.columns[grid.columnLeft][0];

      //** [0] = y value, [1] = x start, [2] = x end, [3] = row
      let y = grid.rows[grid.rowAbove][0];

      let h = 100;
      let w = 100;

      //** Show posible skinAdd **
      push();
      fill(0, 250, 0, 100);

      //** Show Column
      if (pos.x > rigthLimit) {
        if (pos.y < bottomLimit) {
          for (let row = 0; row < skinSystem.rowsSkin; row++) {
            let x = grid.columns[grid.columnLeft][0];
            let y = grid.rows[row][0];

            h = skinSystem.skinMatrix[row][0].h;
            rect(x, y, w, h);
          }
        }
      }

      //** Show Row
      if (pos.y > bottomLimit) {
        if (pos.x < rigthLimit) {
          for (let col = 0; col < skinSystem.columnsSkin; col++) {
            let x = grid.columns[col][0];
            let y = grid.rows[grid.rowAbove][0];

            w = skinSystem.skinMatrix[0][col].w;
            rect(x, y, w, h);
          }
        }
      }

      //** Show skin inside Limits
      if (pos.x < rigthLimit && pos.y < bottomLimit) {
        let x = grid.columns[grid.columnLeft][0];
        let y = grid.rows[grid.rowAbove][0];
        h = skinSystem.skinMatrix[grid.rowAbove][0].h;
        w = skinSystem.skinMatrix[0][grid.columnLeft].w;

        // Show skin if not exist
        if (
          skinSystem.skinMatrix[grid.rowAbove][grid.columnLeft].skinExist ==
          false
        )
          rect(x, y, w, h);
      }

      pop();

      //** AddGrid and Skin
      if (mousePressed && oneTime == false) {
        //** Add Column
        if (pos.x > rigthLimit && pos.y < bottomLimit) {
          grid.columns.push([
            x + 100, //** x
            grid.rows[0][0] - 20, //** y_start
            grid.rows[0][0] + (grid.rowsTotal - 1) * 100 + 20, //** y_end
            grid.columns.length,
          ]);

          let rows = grid.rowAbove;
          let columns = grid.columnLeft;

          //** [x,y]
          let startPos = new p5.Vector(
            grid.gridNodes[rows][columns][0],
            grid.gridNodes[rows][columns][1]
          );

          //** Add Skin
          this.AddSkinColumn(rows, columns, startPos, 200, 50);

          /*
          console.log("GridColLength: " + grid.columns.length);
          console.log("Row: " + rows + " Col:" + columns)
          console.log("x: " + grid.gridNodes[rows][columns][0])
          console.log("y: " +grid.gridNodes[rows][columns][1])
          console.log(startPos)
          */
        }

        //** AddRow
        if (pos.y > bottomLimit && pos.x < rigthLimit) {
          grid.rows.push([
            y + 100, //** x
            grid.columns[0][0] - 20, //** x_start
            grid.columns[0][0] + (grid.columnsTotal - 1) * 100 + 20, //** y_end
            grid.rows.length,
          ]);

          //**AddSkin Row
          let rows = grid.rowAbove;
          let columns = grid.columnLeft;

          //console.log("xccx  " + rows + " " + columns)

          //** [x,y], Put in first column [rows][0][0]
          let startPos = new p5.Vector(
            grid.gridNodes[rows][0][0],
            grid.gridNodes[rows][columns][1]
          );

          //** Add Skin
          this.AddSkinRow(rows, columns, startPos, 10, 10);

          /*
          console.log("GridRowLength: " + grid.rows.length);
          console.log("Row: " + rows + " Col:" + columns);
          console.log("x: " + grid.gridNodes[rows][columns][0]);
          console.log("y: " + grid.gridNodes[rows][columns][1]);
          console.log(startPos);
          */
        }

        //** Add Single Skin (inside Limits)
        if (pos.x < rigthLimit && pos.y < bottomLimit) {
          let row = grid.rowAbove;
          let column = grid.columnLeft;

          //** [x,y]
          let startPos = new p5.Vector(
            grid.gridNodes[row][column][0],
            grid.gridNodes[row][column][1]
          );
          this.AddSkinSingle(row, column, startPos, 10, 10);
          //console.log("xx");
        }

        //** Add skin
      }
    } //** Top and Left Limit

    oneTime = true;
  }

  AddSkinRow(rows, columns, startPos, w, h) {
    systemChanged = true;
    //console.log("* AddSkinRow");
    //console.log("columns: " + skinSystem.columnsSkin);
    let t = buttonRollor_t.ReadValue();
    let temp = [];
    let tempRow = [];
    for (let i = 0; i < skinSystem.columnsSkin; i++) {
      //let startPos =

      //** Skin in skinMatrix[][]
      temp.push(new Skin(startPos, w, h, 500, t, rows + i / 100));
    }
    //skinSystem[0][0].skin.fadeColor +=1;
    //console.log(temp[0].startPos);
    //tempRow.push(temp);
    skinSystem.skinMatrix.push(temp);

    this.UpdateForCalc();
  }

  AddSkinColumn(rows, columns, startPos, w, h) {
   systemChanged = true;
    //console.log("* AddSkinColumn");
    //console.log("rows: " + skinSystem.rowsSkin);
    let t = buttonRollor_t.ReadValue();

    for (let row = 0; row < skinSystem.rowsSkin; row++) {
      //** Skin in skinMatrix[][]
      skinSystem.skinMatrix[row].push(
        new Skin(startPos, w, h, 500, t, row + columns / 100)
      );
    }
    this.UpdateForCalc();
  }

  AddSkinSingle(row, column, startPos, w, h) {
    systemChanged = true;
    skinSystem.skinMatrix[row][column].G = 500;
    skinSystem.skinMatrix[row][column].w = w;
    skinSystem.skinMatrix[row][column].h = h;
  }

  DeleteSkin(pos) {
    let topLimit = grid.rows[0][0];
    let leftLimit = grid.columns[0][0];
    let rigthLimit = grid.columns[grid.columns.length - 1][0];
    let bottomLimit = grid.rows[grid.rows.length - 1][0];

    let rowAbove_y = grid.rows[grid.rowAbove][0];
    let columnLeft_x = grid.columns[grid.columnLeft][0];

    if (
      leftLimit < pos.x &&
      pos.x < rigthLimit &&
      topLimit < pos.y &&
      pos.y < bottomLimit
    ) {
      if (mousePressed && oneTime == false) {
        //** Reset buttonRolor startValue value when deleted.
        let setValue = buttonRollor_t.ReadValue();
        skinSystem.skinMatrix[grid.rowAbove][grid.columnLeft].t = setValue;
        
        //** Delete => G set to 0
        skinSystem.skinMatrix[grid.rowAbove][grid.columnLeft].G = 0;
        skinSystem.skinMatrix[grid.rowAbove][grid.columnLeft].skinExist = false;

        //console.log(skinSystem.skinMatrix[grid.rowAbove][grid.columnLeft].G)

        //** Delete Load and support if no grid;
        //matrixSupport.SupportDeleteIfNoGrid();
        //matrixLoad.LoadDeleteIfNoGrid();

        //** Delete Load and support if no Skin
        matrixSupport.SupportDeleteIfNoSkins();
        matrixLoad.LoadDeleteIfNoSkins();
      }

      if (skinSystem.skinMatrix[grid.rowAbove][grid.columnLeft].skinExist) {
        push();
        fill(250, 0, 0, 100);
        let w = skinSystem.skinMatrix[grid.rowAbove][grid.columnLeft].w;
        let h = skinSystem.skinMatrix[grid.rowAbove][grid.columnLeft].h;
        rect(columnLeft_x, rowAbove_y, w, h);
        pop();
      }
    }

    oneTime = true;
  }

  UpdateForCalc() {
    //** 2023.08.24 ** Start
    //** Update stringers
    skinSystem.UpdateSkinSystem();

    skinSystem.ConstructHorisontalStringers();
    skinSystem.ConstructVerticalStringers();
    skinSystem.DisplayHorisontalStringers();
    skinSystem.DisplayVerticalStringers();

    grid.UpdateGrid();
    //** 2023.08.24 ** End
  }
}
