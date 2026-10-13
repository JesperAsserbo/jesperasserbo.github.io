class MatrixSupport {
  constructor() {
    this.matrixSupport = [];
    this.matrixSupportArray = [];

    this.overlapRow;
    this.overlapCol;

    this.overlapRowTable;
    this.overlapColTable;

    //** Construct start/default matrixSupport
    //** => new Support in each gridNode
    for (let row = 0; row < grid.rows.length; row++) {
      this.matrixSupport[row] = [];
      for (let col = 0; col < grid.columns.length; col++) {
        this.matrixSupport[row][col] = new Support(
          grid.gridNodes[row][col][0],
          grid.gridNodes[row][col][1],
          row,
          col
        );
      }
    }

    this.supportRows = this.matrixSupport.length;
  } //** Constructor END

  MatrixSupportConstruct() {
    //** size correspond to unknowns (stringers)
    this.matrixSupportArray = [];

    for (let i = 0; i < skinSystem.unknowns; i++) {
      this.matrixSupportArray[i] = [0];
    }

    this.MatrixSupportHorisontal();
    this.MatrixSupportVertical();
  }

  //** Called from changeSystem.DeleteSkin();
  SupportDeleteIfNoSkins() {
    //*************
    //** Corners **
    if (skinSystem.skinMatrix[0][0].skinExist == false) this.SupportReset(0, 0); //** TopLeft
    if (skinSystem.skinMatrix[0][grid.columns.length - 2].skinExist == false)
      this.SupportReset(0, grid.columns.length - 1); //** TopRigth
    if (
      skinSystem.skinMatrix[grid.rows.length - 2][grid.columns.length - 2]
        .skinExist == false
    )
      this.SupportReset(grid.rows.length - 1, grid.columns.length - 1); //** BottomRigth
    if (skinSystem.skinMatrix[grid.rows.length - 2][0].skinExist == false)
      this.SupportReset(grid.rows.length - 1, 0); //** BottomLeft
    //** Corners **
    //*************

    //**************
    //** Internal **
    for (let rowGrid = 1; rowGrid < grid.rows.length - 1; rowGrid++) {
      for (let colGrid = 1; colGrid < grid.columns.length - 1; colGrid++) {
        if (
          skinSystem.skinMatrix[rowGrid - 1][colGrid - 1].skinExist == false &&
          skinSystem.skinMatrix[rowGrid - 1][colGrid].skinExist == false &&
          skinSystem.skinMatrix[rowGrid][colGrid].skinExist == false &&
          skinSystem.skinMatrix[rowGrid][colGrid - 1].skinExist == false
        )
          this.SupportReset(rowGrid, colGrid);
      }
    }
    //** Internal **
    //**************

    //*********
    //** Top **
    for (let colGrid = 1; colGrid < grid.columns.length - 1; colGrid++) {
      if (
        skinSystem.skinMatrix[0][colGrid - 1].skinExist == false &&
        skinSystem.skinMatrix[0][colGrid].skinExist == false
      )
        this.SupportReset(0, colGrid);
    }
    //** Top **
    //*********

    //************
    //** Bottom **
    for (let colGrid = 1; colGrid < grid.columns.length - 1; colGrid++) {
      let lastSkinRow = grid.rows.length - 2;
      if (
        skinSystem.skinMatrix[lastSkinRow][colGrid - 1].skinExist == false &&
        skinSystem.skinMatrix[lastSkinRow][colGrid].skinExist == false
      )
        this.SupportReset(grid.rows.length - 1, colGrid);
    }
    //** Bottom **
    //************

    //**********
    //** Left **
    for (let rowGrid = 1; rowGrid < grid.rows.length - 1; rowGrid++) {
      if (
        skinSystem.skinMatrix[rowGrid - 1][0].skinExist == false &&
        skinSystem.skinMatrix[rowGrid][0].skinExist == false
      )
        this.SupportReset(rowGrid, 0);
    }
    //** Left **
    //**********

    //***********
    //** Rigth **
    for (let rowGrid = 1; rowGrid < grid.rows.length - 1; rowGrid++) {
      let lastSkinCol = grid.columns.length - 2;
      if (
        skinSystem.skinMatrix[rowGrid - 1][lastSkinCol].skinExist == false &&
        skinSystem.skinMatrix[rowGrid][lastSkinCol].skinExist == false
      )
        this.SupportReset(rowGrid, lastSkinCol + 1);
    }
    //** Rigth **
    //***********
  }

  SupportReset(rowGrid, colGrid) {
    //console.log("row: " + rowGrid + " col: " + colGrid);
    //** Splice => Delete old Support replace/splice with new Support
    //** splice(Place,antal,newValue)
    this.matrixSupport[rowGrid].splice(
      colGrid,
      1,
      new Support(
        grid.gridNodes[rowGrid][colGrid][0],
        grid.gridNodes[rowGrid][colGrid][1],
        rowGrid,
        colGrid
      )
    );
    /*
    this.matrixSupport[row][col].supportExist_Cx = false;
    this.matrixSupport[row][col].supportExist_Cy = false;
    this.matrixSupport[row][col].Cx = 0;
    this.matrixSupport[row][col].Cy = 0;
    this.matrixSupport[row][col].buttonRollor_Cx.SetValue(10);
    this.matrixSupport[row][col].buttonRollor_Cy.SetValue(10);
    */
  }

  SupportDeleteIfNoGrid() {
    let gridRows = grid.rowsTotal;
    this.supportRows = this.matrixSupport.length;

    //** Delete supports if gridLine Rows deleted
    if (this.supportRows > gridRows) this.matrixSupport.pop();

    //** Delete supports if gridLine Cols deleted
    if (this.matrixSupport[0].length > grid.columns.length) {
      //** removes last element in each row
      for (let row = 0; row < grid.rows.length; row++) {
        this.matrixSupport[row].pop();
      }
    }
  }

  MatrixSupportHorisontal() {
    //** New Support when system change (gridRow or gridCol added)
    for (let row = 0; row < grid.rows.length; row++) {
      for (let col = 0; col < grid.columns.length; col++) {
        //** Add row in matrixSupport when changed
        if (this.matrixSupport.length - 1 < row) {
          this.matrixSupport[row] = [];
          //console.log(this.matrixSupport[row]); //*****
        }
        //** Add support in new row (and column)
        if (this.matrixSupport[row][col] == undefined) {
          this.matrixSupport[row][col] = new Support(
            grid.gridNodes[row][col][0],
            grid.gridNodes[row][col][1],
            row,
            col
          );
          //console.log("new support ******");
        }

        //** Set support to Exist if Cx > 0
        if (this.matrixSupport[row][col].Cx > 0) {
          this.matrixSupport[row][col].supportExist_Cx = true;
        }

        //this.matrixSupport[row][col].Display();
      }
    }

    this.SupportDeleteIfNoGrid();
    /*
    //** Delete row in matrixSupport when changed
    if (this.matrixSupport.length > grid.rows.length) {
      //** removes last element and reduce arrayLength
      this.matrixSupport.pop();
    }*/

    //console.log("matrixSupport.length " + this.matrixSupport.length);
    //console.log("grid.columns.length " + grid.rows.length);

    // console.table(this.matrixSupport);

    //** Construct supportArray from matrixSupport
    //** stringer[count] = [y,nodeStart_x,nodeEnd_x,nodeStart_x,nodeEnd_x,.....]
    for (
      let stringer_hor = 0;
      stringer_hor < skinSystem.stringerHorisontal.length;
      stringer_hor++
    ) {
      let stringer_y = skinSystem.stringerHorisontal[stringer_hor][0];
      let stringer_x_Start = skinSystem.stringerHorisontal[stringer_hor][1];
      let stringer_x_End =
        skinSystem.stringerHorisontal[stringer_hor][
          skinSystem.stringerHorisontal[stringer_hor].length - 1
        ];

      for (let row = 0; row < grid.rows.length; row++) {
        //** If grid_y = stringer_y => check col
        if (stringer_y == grid.gridNodes[row][0][1]) {
          for (let col = 0; col < grid.columns.length; col++) {
            //** If stringer_x_Start <= grid.x && grid.x <= stringer_x_End
            if (
              stringer_x_Start <= grid.gridNodes[row][col][0] &&
              grid.gridNodes[row][col][0] <= stringer_x_End
            ) {
              //console.log("node_x: " + grid.gridNodes[row][col][0] + " col: " + col)
              this.matrixSupportArray[stringer_hor][0] += this.matrixSupport[
                row
              ][col].Cx;
            }
          }
        }
      }

      /*
      console.log(
        "stringer: " +
          stringer_hor +
          " Value: " +
          this.matrixSupportArray[stringer_hor][0]
      );
      */
    }
  }

  MatrixSupportVertical() {
    //console.log("vertical col " + this.matrixSupport[0].length);
    //console.log("support col " + this.matrixSupport[0][this.matrixSupport[0].length-1].Cy )
    //** New Support when system change (gridRow or gridCol added)
    for (let row = 0; row < grid.rows.length; row++) {
      for (let col = 0; col < grid.columns.length; col++) {
        //** Add col in matrixSupport when changed
        //if (this.matrixSupport[0].length - 1 < col) {
        //this.matrixSupport[row].push([]);
        //console.log(this.matrixSupport[row]); //*****

        if (this.matrixSupport[row][col].Cy > 0) {
          this.matrixSupport[row][col].supportExist_Cy = true;
        }
      }
    }

    //** Construct supportArray from matrixSupport
    //** stringer[count] = [x,nodeStart_y,nodeEnd_y,nodeStart_y,nodeEnd_y,.....]
    for (
      let stringer_ver = 0;
      stringer_ver < skinSystem.stringerVertical.length;
      stringer_ver++
    ) {
      let stringer_x = skinSystem.stringerVertical[stringer_ver][0];
      let stringer_y_Start = skinSystem.stringerVertical[stringer_ver][1];
      let stringer_y_End =
        skinSystem.stringerVertical[stringer_ver][
          skinSystem.stringerVertical[stringer_ver].length - 1
        ];

      for (let col = 0; col < grid.columns.length; col++) {
        //** If grid_x = stringer_x => check row
        if (stringer_x == grid.gridNodes[0][col][0]) {
          //console.log("stringer_x " + grid.gridNodes[0][col][0]);
          for (let row = 0; row < grid.rows.length; row++) {
            //console.log("row: " + row)
            //** If stringer_y_Start <= grid.y && grid.y <= stringer_y_End
            if (
              stringer_y_Start <= grid.gridNodes[row][col][1] &&
              grid.gridNodes[row][col][1] <= stringer_y_End
            ) {
              //console.log("node_y: " + grid.gridNodes[row][col][1] + " row: " + row)
              this.matrixSupportArray[
                stringer_ver + skinSystem.stringerHorisontal.length
              ][0] += this.matrixSupport[row][col].Cy;
            }
          }
        }
      }

      /*
      console.log(
        "stringer: " +
          stringer_ver +
          " Value: " +
          this.matrixSupportArray[stringer_ver][0]
      );
      */
    }
  }

  DisplayMatrixSupport() {
    for (let row = 0; row < grid.rows.length; row++) {
      for (let col = 0; col < grid.columns.length; col++) {
        //** Length og gridArray changes when added or deleted grid row or column
        //** => need to restrict because otherwise first run will result in undefined
        if (
          this.matrixSupport.length == grid.rows.length &&
          this.matrixSupport[0].length == grid.columns.length
        ) {
          this.matrixSupport[row][col].Display();
          this.matrixSupport[row][col].OverlapFixPoint_Cy();
          this.matrixSupport[row][col].OverlapFixPoint_Cx();

          //this.matrixSupport[row][col].OverlapFixPointTable_Cy();
          //this.matrixSupport[row][col].OverlapFixPointTable_Cx();
        }
      }
    }
  }

  LogSupportNode() {
    for (let row = 0; row < grid.rows.length; row++) {
      for (let col = 0; col < grid.columns.length; col++) {
        //** Length og gridArray changes when added or deleted grid row or column
        //** => need to restrict because otherwise first run will result in undefined
        if (
          this.matrixSupport.length == grid.rows.length &&
          this.matrixSupport[0].length == grid.columns.length
        ) {
          //** Log overlapped Node
          if (
            (this.matrixSupport[row][col].supportExist_Cy &&
              this.matrixSupport[row][col].supportOverlap_Cy) ||
            (this.matrixSupport[row][col].supportExist_Cx &&
              this.matrixSupport[row][col].supportOverlap_Cx)
          ) {
            this.overlapRow = row;
            this.overlapCol = col;
          } else {
            //this.overlapRow = undefined;
            //this.overlapCol = undefined;
          }
        }
      }
    }
    //console.log("overlapRow: " + this.overlapRow + " OverlapCol: " + this.overlapCol )
    //console.table(this.matrixSupport)
  }
}
