//** MoveAllGrid(pos)
//** UpdateGrid() => DeleteGridColumn()
//**              => DeleteGridRow()
//** DeleteGridColumn()
//** DeleteGridRow()
//** DisplayGrid()
//** DisplayGridNodes()
//** DisplayGridMesure()
//** FindNearestGridNodes(pos)
//** GridLineAbove(pos)
//** GridLineLeft(pos)
//** OverlapNode(pos)
//** ChangeGrid(pos) - Not in use
//** ChangeGridSteps(pos)

class Grid {
  constructor() {
    this.moveOrigin = new p5.Vector(500, 1450);
    this.origin = new p5.Vector(this.moveOrigin.x + 50, this.moveOrigin.y + 50);

    this.rows = [];
    this.columns = [];

    //** this.gridNodes[][] = [x,y]
    this.gridNodes = [];
    this.GridNodesDiameter = 15;

    this.stepChange = 5;
    this.stepChangeGrid = 5;

    this.rowsTotal = 2;
    this.columnsTotal = 3;

    //** Search
    this.rowNearest = 0;
    this.columnNearest = 0;
    this.distToNearestNode = 0;

    this.rowAbove = 0;
    this.columnLeft = 0;

    //** Grid default ** START **
    //** Rows **
    //** this.rows = [[y,x_start,x_end,rowNumber],.....]
    for (let rows = 0; rows < this.rowsTotal; rows++) {
      this.rows.push([
        this.origin.y + rows * 100, //** y
        this.origin.x - 20, //** x_start
        this.origin.x + (this.columnsTotal - 1) * 100 + 20, //** x_end
        rows,
      ]);
    }

    //** Columns **
    //** this.columns = [[x,y_start,y_end,columnNumber],.....]
    for (let columns = 0; columns < this.columnsTotal; columns++) {
      this.columns.push([
        this.origin.x + columns * 100, //** x
        this.origin.y - 20, //** y_start
        this.origin.y + (this.rowsTotal - 1) * 100 + 20, //** y_end
        columns,
      ]);
    }

    //** comstruct gridNodes so that supportMatrix and loadMatrix can initialize
    this.DisplayGridNodes();
    //** Grid default ** END **
  }

  MoveAllGrid(pos) {
    //this.ChangeGridSteps(mousePosWorld);
    let distToMovePoint = dist(
      pos.x,
      pos.y,
      this.moveOrigin.x,
      this.moveOrigin.y
    );
    //** MoveOrigin Update
    this.moveOrigin.x = this.columns[0][0] - 50;
    this.moveOrigin.y = this.rows[0][0] - 50;

    //** Log => that node sticks to mousePos until released
    if (mouseIsPressed && distToMovePoint < 20) logGridOriginMove = true;

    //** MoveGridInsertPoint
    push();
    noFill();
    noStroke();
    if (distToMovePoint < 20) fill(100, 100, 100, 100);
    if (logGridOriginMove && mouseIsPressed) fill(0, 250, 0, 100);
    stroke(100);
    circle(this.moveOrigin.x, this.moveOrigin.y, 20);
    pop();

    //**pos.y in multioplum of this.stepChangeGrid
    let remainderX = int(pos.y) % this.stepChangeGrid;
    if (remainderX > this.stepChangeGrid / 2)
      pos.y = int(pos.y) + (this.stepChangeGrid - remainderX);
    if (remainderX <= this.stepChangeGrid / 2) pos.y = int(pos.y) - remainderX;

    //**pos.x in multioplum of this.stepChangeGrid
    let remainderY = int(pos.x) % this.stepChangeGrid;
    if (remainderY > this.stepChangeGrid / 2)
      pos.x = int(pos.x) + (this.stepChangeGrid - remainderY);
    if (remainderY <= this.stepChangeGrid / 2) pos.x = int(pos.x) - remainderY;

    let adjust_Y = this.rows[0][0] - pos.y - 50;
    let adjust_X = this.columns[0][0] - pos.x - 50;

    if (logGridOriginMove) {
      for (let row = 0; row < this.rowsTotal; row++) {
        this.rows[row][0] = this.rows[row][0] - adjust_Y;
      }
      for (let col = 0; col < this.columnsTotal; col++) {
        this.columns[col][0] = this.columns[col][0] - adjust_X;
      }
    }
  }

  UpdateGrid() {
    this.DeleteGridRow();
    this.DeleteGridColumn();

    this.rowsTotal = this.rows.length;
    this.columnsTotal = this.columns.length;

    this.origin.x = this.gridNodes[0][0][0];
    this.origin.y = this.gridNodes[0][0][1];

    //** Update GridLines limits
    for (let rows = 0; rows < this.rowsTotal; rows++) {
      //** Adjust LEFT limit og gridLines
      this.rows[rows][1] = this.columns[0][0] - 20;

      //** Adjust RIGHT limit og gridLines
      this.rows[rows][2] = this.columns[this.columns.length - 1][0] + 20;
    }

    for (let columns = 0; columns < this.columnsTotal; columns++) {
      //** Adjust UPPER limit og gridLines
      this.columns[columns][1] = this.rows[0][0] - 20;

      //** Adjust LOWER limit og gridLines
      this.columns[columns][2] = this.rows[this.rows.length - 1][0] + 20;
    }
  }

  DeleteGridColumn() {
    //** If no skin in last column
    let lastSkinCol = skinSystem.columnsSkin - 1;
    let skinInLastCol = false;

    //** Check for skin in last column
    for (let row = 0; row < skinSystem.rowsSkin; row++) {
      if (skinSystem.skinMatrix[row][lastSkinCol].skinExist)
        skinInLastCol = true;
    }

    if (skinInLastCol == false) {
      //** Delete gridLine
      grid.columns.splice(grid.columns.length - 1, 1);

      //** Delete skins in last column (skin exist but G=0)
      for (let row = 0; row < skinSystem.rowsSkin; row++) {
        skinSystem.skinMatrix[row].splice(lastSkinCol, 1);
      }
    }

    //** Update row and columns
    skinSystem.UpdateSkinSystem();
  }

  DeleteGridRow() {
    //** If no skin in last row
    let lastSkinRow = skinSystem.rowsSkin - 1;
    let skinInLastRow = false;

    //** Check for skin in last row
    for (let col = 0; col < skinSystem.columnsSkin; col++) {
      if (skinSystem.skinMatrix[lastSkinRow][col].skinExist)
        skinInLastRow = true;
    }

    if (skinInLastRow == false) {
      //** Delete gridLine
      grid.rows.splice(grid.rows.length - 1, 1);

      //** Delete skins in last row (skin exist but G=0)
      skinSystem.skinMatrix.splice(lastSkinRow, 1);
    }

    //** Update row and columns
    skinSystem.UpdateSkinSystem();
  }

  DisplayGrid() {
    push();
    strokeWeight(1);
    stroke(100);
    noFill();

    //** Rows **
    //** this.rows = [[y,x_start,x_end,rowNumber],.....]
    for (let rows = 0; rows < this.rowsTotal; rows++) {
      line(
        this.rows[rows][1], //** x_start
        this.rows[rows][0], //** y
        this.rows[rows][2], //** x_end
        this.rows[rows][0] //** y
      );

      push();
      //**Display GridRowNumbers
      line(
        this.rows[rows][1] - 50, //** x
        this.rows[rows][0], //** y
        this.rows[rows][1] - 110, //** x
        this.rows[rows][0] //** y
      );

      stroke(0);
      noFill();
      circle(this.rows[rows][1] - 130, this.rows[rows][0], 40);

      //** gridRow Text
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(24);
      text(
        rows,
        this.rows[rows][1] - 130,
        this.rows[rows][0]+2
      );
      pop();
    }

    //** Columns **
    //** this.columns = [[x,y_start,y_end,columnNumber],.....]
    for (let columns = 0; columns < this.columnsTotal; columns++) {
      line(
        this.columns[columns][0], //** x
        this.columns[columns][1], //** y
        this.columns[columns][0], //** x
        this.columns[columns][2] //** y
      );

      push();
      //**Display GridColNumbers
      line(
        this.columns[columns][0], //** x
        this.columns[columns][1] - 50, //** y
        this.columns[columns][0], //** x
        this.columns[columns][1] - 110 //** y
      );

      stroke(0);
      noFill();
      circle(this.columns[columns][0], this.columns[columns][1] - 130, 40);

      //** gridCol Text
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(24);
      text(
        columns,
        this.columns[columns][0],
        this.columns[columns][1] - 130 + 2
      );
      pop();
    }

    //** Display MoveOrigin
    noFill();
    stroke(0);
    if (!logGridOriginMove) circle(this.moveOrigin.x, this.moveOrigin.y, 20);
    pop();
  }

  DisplayOverlap(pos, colorLigth) {
    /*
    let nodeX = this.columns[this.columnNearest][0];
    let nodeY = this.rows[this.rowNearest][0];
    if (this.OverlapNode(pos)) {
      push();

      noStroke();
      if (colorLigth == 0) fill(255, 0, 0, 50);
      else fill(0, 255, 0, 150);

      circle(nodeX, nodeY, 2 * this.GridNodesDiameter);

      pop();
    }*/
  }

  DisplayGridNodes() {
    push();
    noFill();
    for (let rows = 0; rows < this.rowsTotal; rows++) {
      this.gridNodes[rows] = [];
      for (let columns = 0; columns < this.columnsTotal; columns++) {
        //** this.gridNodes[][] = [x,y]
        this.gridNodes[rows][columns] = [
          this.columns[columns][0],
          this.rows[rows][0],
        ];

        fill(255);
        strokeWeight(2);
        circle(
          this.gridNodes[rows][columns][0],
          this.gridNodes[rows][columns][1],
          this.GridNodesDiameter
        );
      }
    }
    pop();
  }

  DisplayGridMesure() {
    push();
    //** X-axis
    line(
      this.columns[0][0] - 5,
      this.rows[0][0] - 50,
      this.columns[this.columnsTotal - 1][0] + 5,
      this.rows[0][0] - 50
    );
    for (let columns = 0; columns < this.columnsTotal; columns++) {
      line(
        this.columns[columns][0],
        this.rows[0][0] - 45,
        this.columns[columns][0],
        this.rows[0][0] - 55
      );
      if (columns < this.columnsTotal - 1) {
        textSize(20);
        textAlign(CENTER);
        let w = this.columns[columns + 1][0] - this.columns[columns][0];
        text(
          nf(w * 10 * scaleGeo, 2, 0),
          this.columns[columns][0] + 0.5 * w,
          this.rows[0][0] - 55
        );
      }
    }

    //** Y-axis
    line(
      this.columns[0][0] - 50,
      this.rows[0][0] - 5,
      this.columns[0][0] - 50,
      this.rows[this.rowsTotal - 1][0] + 5
    );
    for (let rows = 0; rows < this.rowsTotal; rows++) {
      line(
        this.columns[0][0] - 45,
        this.rows[rows][0],
        this.columns[0][0] - 55,
        this.rows[rows][0]
      );
      if (rows < this.rowsTotal - 1) {
        textSize(20);
        textAlign(CENTER, CENTER);
        let h = this.rows[rows + 1][0] - this.rows[rows][0];

        push();
        translate(this.columns[0][0] - 60, this.rows[rows][0] + 0.5 * h);
        rotate(-PI / 2);
        text(nf(h * 10 * scaleGeo, 2, 0), 0, 0);
        pop();
      }
    }
    pop();
  }

  FindNearestGridNodes(pos) {
    //** Find nearest row
    let distToNearestRow = Infinity;

    for (let i = 0; i < this.rows.length; i++) {
      let distToNearestRowTemp = dist(pos.x, pos.y, pos.x, this.rows[i][0]);

      if (distToNearestRowTemp < distToNearestRow) {
        distToNearestRow = distToNearestRowTemp;
        this.rowNearest = i;
      }
    }

    //** Find nearest column
    let distToNearestColumn = Infinity;

    for (let i = 0; i < this.columns.length; i++) {
      let distToNearestColumnTemp = dist(
        pos.x,
        pos.y,
        this.columns[i][0],
        pos.y
      );

      if (distToNearestColumnTemp < distToNearestColumn) {
        distToNearestColumn = distToNearestColumnTemp;
        this.columnNearest = i;
      }
    }

    //** Draw lines to row and column
    //line(pos.x, pos.y, pos.x, this.rows[this.rowNearest][0]); //**Row
    //line(pos.x, pos.y, this.columns[this.columnNearest][0], pos.y); //**Column

    //** Draw lines to node
    /*
    line(
      pos.x,
      pos.y,
      this.columns[this.columnNearest][0],
      this.rows[this.rowNearest][0]
    );
    */
  }

  GridLineAbove(pos) {
    if (pos.y > grid.rows[this.rowNearest][0]) this.rowAbove = this.rowNearest;
    else this.rowAbove = this.rowNearest - 1;

    if (this.rowAbove < 0) this.rowAbove = 0;

    //console.log("RowAbove: " + this.rowAbove);
  }

  GridLineLeft(pos) {
    if (pos.x > grid.columns[this.columnNearest][0])
      this.columnLeft = this.columnNearest;
    else this.columnLeft = this.columnNearest - 1;

    if (this.columnLeft < 0) this.columnLeft = 0;

    //console.log("ColAbove: " + this.columnLeft);
  }

  OverlapNode(pos) {
    //** NearestNode coordinates
    let nodeX = this.columns[this.columnNearest][0];
    let nodeY = this.rows[this.rowNearest][0];

    this.distToNearestNode = dist(pos.x, pos.y, nodeX, nodeY);

    if (this.distToNearestNode < 1 * this.GridNodesDiameter) {
      return true;
    }
    return false;
  }

  /*
  ChangeGrid(pos) {
    if (this.OverlapNode(pos) && mouseIsPressed) {
      this.columns[this.columnNearest][0] = pos.x;
      this.rows[this.rowNearest][0] = pos.y;
    }
  }*/

  ChangeGridSteps(pos) {
    //** Log => that node sticks to mousePos until released
    if (this.OverlapNode(pos) && mouseIsPressed) {
      logGridNode = true;
    }

    //** Highligth node when overlap (and no button activated)
    if (this.OverlapNode(pos)) {
      let turnedOn = false;
      for (let i = 0; i < buttonArray.length; i++) {
        if (buttonArray[i].state == 1) {
          turnedOn = true;
          break;
        }
      }
      if (turnedOn == false) changeSystem.HighLigthNodeGreen();
    }

    //** Move gridNode only if no button.state == 1
    for (let i = 0; i < buttonArray.length; i++) {
      if (buttonArray[i].state == 1) {
        moveGridNode = false;
        break;
      } else moveGridNode = true;
    }

    //** If logged => move node
    if (logGridNode && moveGridNode) {
      //**pos.y in multioplum of this.stepChange
      let remainderX = int(pos.y) % this.stepChange;
      if (remainderX > this.stepChange / 2)
        pos.y = int(pos.y) + (this.stepChange - remainderX);
      if (remainderX <= this.stepChange / 2) pos.y = int(pos.y) - remainderX;

      this.rows[this.rowNearest][0] = pos.y;

      //**pos.x in multioplum of this.stepChange
      let remainderY = int(pos.x) % this.stepChange;
      if (remainderY > this.stepChange / 2)
        pos.x = int(pos.x) + (this.stepChange - remainderY);
      if (remainderY <= this.stepChange / 2) pos.x = int(pos.x) - remainderY;

      this.columns[this.columnNearest][0] = pos.x;
    }
  }
}
