class MatrixLoad {
  constructor() {
    this.matrixLoad = [];
    this.matrixLoadArray = [];

    this.overlapRow;
    this.overlapCol;

    this.rowLogTable;
    this.colLogTable;

    //** Construct start/default matrixLoad
    //** => new Support in each gridNode
    for (let row = 0; row < grid.rows.length; row++) {
      this.matrixLoad[row] = [];
      for (let col = 0; col < grid.columns.length; col++) {
        this.matrixLoad[row][col] = new Load(
          grid.gridNodes[row][col][0],
          grid.gridNodes[row][col][1],
          row,
          col
        );
      }
    }
  } //** Constructor END

  MatrixLoadConstruct() {
    //** size correspond to unknowns (stringers)
    this.matrixLoadArray = [];
    for (let i = 0; i < skinSystem.unknowns; i++) {
      this.matrixLoadArray[i] = [0];
    }
    this.MatrixLoadHorisontal();
    this.MatrixLoadVertical();
  }

  //** Called from changeSystem.DeleteSkin();
  LoadDeleteIfNoSkins() {
    //*************
    //** Corners **
    if (skinSystem.skinMatrix[0][0].skinExist == false) this.LoadReset(0, 0); //** TopLeft
    if (skinSystem.skinMatrix[0][grid.columns.length - 2].skinExist == false)
      this.LoadReset(0, grid.columns.length - 1); //** TopRigth
    if (
      skinSystem.skinMatrix[grid.rows.length - 2][grid.columns.length - 2]
        .skinExist == false
    )
      this.LoadReset(grid.rows.length - 1, grid.columns.length - 1); //** BottomRigth
    if (skinSystem.skinMatrix[grid.rows.length - 2][0].skinExist == false) {
      this.LoadReset(grid.rows.length - 1, 0); //** BottomLeft
    }

    //** Corners **
    //*************

    //**************
    //** Internal **
    for (let rowGrid = 1; rowGrid < grid.rows.length - 1; rowGrid++) {
      for (let colGrid = 1; colGrid < grid.columns.length - 1; colGrid++) {
        //** if Load exist in GridNode => test for skins
        if (
          this.matrixLoad[rowGrid][colGrid].loadExist_Py ||
          this.matrixLoad[rowGrid][colGrid].loadExist_Px
        ) {
          //** if skins all araound node NOT exist => splice
          if (
            skinSystem.skinMatrix[rowGrid - 1][colGrid - 1].skinExist ==
              false &&
            skinSystem.skinMatrix[rowGrid - 1][colGrid].skinExist == false &&
            skinSystem.skinMatrix[rowGrid][colGrid].skinExist == false &&
            skinSystem.skinMatrix[rowGrid][colGrid - 1].skinExist == false
          ) {
            this.LoadReset(rowGrid, colGrid);
          }
        }
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
        this.LoadReset(0, colGrid);
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
        this.LoadReset(grid.rows.length - 1, colGrid);
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
        this.LoadReset(rowGrid, 0);
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
        this.LoadReset(rowGrid, lastSkinCol + 1);
    }
    //** Rigth **
    //***********
  }

  LoadReset(rowGrid, colGrid) {
    //console.log("row: " + rowGrid + " col: " + colGrid);
    //** Splice => Delete old Load replace/splice with new Load
    //** splice(Place,antal,newValue)
    this.matrixLoad[rowGrid].splice(
      colGrid,
      1,
      new Load(
        grid.gridNodes[rowGrid][colGrid][0],
        grid.gridNodes[rowGrid][colGrid][1],
        rowGrid,
        colGrid
      )
    );
  }

  MatrixLoadHorisontal() {
    //** New Load when system change (gridRow or gridCol added)
    grid.UpdateGrid();

    for (let row = 0; row < grid.rows.length; row++) {
      for (let col = 0; col < grid.columns.length; col++) {
        //** Add row in matrixSupport when changed
        if (this.matrixLoad.length - 1 < row) {
          this.matrixLoad[row] = [];
          //systemChanged = true;
          //console.log(this.matrixLoad[row]); //*****
        }
        //** Add Load in new row (and column)
        if (this.matrixLoad[row][col] == undefined) {
          this.matrixLoad[row][col] = new Load(
            grid.gridNodes[row][col][0],
            grid.gridNodes[row][col][1],
            row,
            col
          );

          //console.log("new Load ******");
        }

        //** Set Load to Exist if Px > 0
        if (this.matrixLoad[row][col].Px > 0) {
          this.matrixLoad[row][col].loadExist_Px = true;
        }
      }
    }

    this.LoadDeleteIfNoGrid();

    /*
        //** Delete row in matrixLoad when changed
    if (this.matrixLoad.length > grid.rows.length) {
      //** removes last element and reduce arrayLength
      this.matrixLoad.pop();
      //systemChanged = true;
    }*/

    //** Construct loadArray from matrixLoad
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
              this.matrixLoadArray[stringer_hor][0] += this.matrixLoad[row][
                col
              ].Px;
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

  //** Called from MatrixLoadVertical() & MatrixLoadHorisontal()
  LoadDeleteIfNoGrid() {
    let gridRows = grid.rowsTotal;
    this.loadRows = this.matrixLoad.length;

    //** Delete load if gridLine Rows deleted
    if (this.loadRows > gridRows) this.matrixLoad.pop();

    //** Delete load if gridLine Cols deleted
    if (this.matrixLoad[0].length > grid.columns.length) {
      //** removes last element in each row
      //console.log("*****")
      for (let row = 0; row < grid.rows.length; row++) {
        this.matrixLoad[row].pop();
      }
    }
  }

  MatrixLoadVertical() {
    //console.log("vertical col " + this.matrixSupport[0].length);
    //console.log("support col " + this.matrixSupport[0][this.matrixSupport[0].length-1].Cy )
    //** New Load when system change (gridRow or gridCol added)
    for (let row = 0; row < grid.rows.length; row++) {
      for (let col = 0; col < grid.columns.length; col++) {
        //** Add col in matrixLoad when changed
        //if (this.matrixLoad[0].length - 1 < col) {
        //this.matrixLoad[row].push([]);
        //console.log(this.matrixLoad[row]); //*****

        if (this.matrixLoad[row][col].Py > 0) {
          this.matrixLoad[row][col].loadExist_Py = true;
        }
      }
    }

    this.LoadDeleteIfNoGrid();

    /*
        //** Delete last column in matrixSupport when changed
    if (this.matrixLoad[0].length > grid.columns.length) {
      //** removes last element in each row
      for (let row = 0; row < grid.rows.length; row++) {
        this.matrixLoad[row].pop();
      }
      //systemChanged = true;
    }*/

    //** Construct LoadArray from matrixSupport
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
              this.matrixLoadArray[
                stringer_ver + skinSystem.stringerHorisontal.length
              ][0] += this.matrixLoad[row][col].Py;
            }
          }
        }
      }

      /*     
      console.log(
        "stringer: " +
          stringer_ver +
          " Value: " +
          this.matrixLoadArray[stringer_ver][0]
      );
   */
    }
  }

  //** Called from Sketch
  DisplayMatrixLoad() {
    for (let row = 0; row < grid.rows.length; row++) {
      for (let col = 0; col < grid.columns.length; col++) {
        //** Length og gridArray changes when added or deleted grid row or column
        //** => need to restrict because otherwise first run will result in undefined

        if (
          this.matrixLoad.length == grid.rows.length &&
          this.matrixLoad[0].length == grid.columns.length
        ) {
          this.matrixLoad[row][col].Display();
          //this.matrixLoad[row][col].DisplayLoadValue();
          this.matrixLoad[row][col].OverlapFixPoint_Py();
          this.matrixLoad[row][col].OverlapFixPoint_Px();
          //console.log("Overlap: " + this.matrixLoad[row][col].loadOverlap)
          //console.log("LoadExist: " + this.matrixLoad[row][col].loadExist)

          //** Log overlapped Node
          if (
            (this.matrixLoad[row][col].loadExist_Py &&
              this.matrixLoad[row][col].loadOverlap_Py) ||
            (this.matrixLoad[row][col].loadExist_Px &&
              this.matrixLoad[row][col].loadOverlap_Px)
          ) {
            this.overlapRow = row;
            this.overlapCol = col;
          } else {
            //this.overlapRow = false;
            //this.overlapCol = false;
          }
        }
      }
    }
  }

  DisplayMatrixLoadValues() {
    for (let row = 0; row < grid.rows.length; row++) {
      for (let col = 0; col < grid.columns.length; col++) {
        this.matrixLoad[row][col].DisplayLoadValue();
      }
    }
  }
}
