

//** Methods
//** UpdateSkinSystem()
//** DisplaySkinSystem()
//** SkinConnectedHorisontalSet()
//** SkinConnectedVerticalSet()
//** ConstructHorisontalStringers()
//** DisplayHorisontalStringers()
//** ConstructVerticalStringers()
//** DisplayVerticalStringers()

//** StringerSkinSystemHorisontal()
//** StringerSkinSystemVertical()
//** StiffnessMatrixGlobal()

class SkinSystem {
  constructor() {
    this.skinMatrix = [];
    this.stiffnessMatrixGlobal = [];

    this.rowsSkin = grid.rows.length - 1;
    this.columnsSkin = grid.columns.length - 1;

    
    //** SkinMatrice Default ** START
    //** One less skin than rows
    for (let rows = 0; rows < this.rowsSkin; rows++) {
      this.skinMatrix[rows] = [];
      //** One less skin than columns
      for (let columns = 0; columns < this.columnsSkin; columns++) {
        let startPosX = grid.columns[columns][0];
        let startPosY = grid.rows[rows][0];
        let startPos = new p5.Vector(startPosX, startPosY);
        let w = grid.columns[columns + 1][0] - grid.columns[columns][0];
        let h = grid.rows[rows + 1][0] - grid.rows[rows][0];

        //** Skin in skinMatrix[][]
        this.skinMatrix[rows][columns] = new Skin(
          startPos,
          w,
          h,
          500,
          5,
          rows + columns / 100
        );
      }
    }

    //** SkinMatrice Default ** End

    this.stringerHorisontal = [];
    this.stringerSkinMatrixHorisontal = [];

    this.stringerVertical = [];
    this.stringerSkinMatrixVertical = [];

    this.unknowns;
    this.testArrayHorisontal = [];
    this.testArrayVertical = [];

    //this.ConstructStringers();
    this.rowsSkin = grid.rows.length - 1;
    this.columnsSkin = grid.columns.length - 1;

    //** Make Stringers on DefaultSystem
    this.UpdateSkinSystem();
    this.ConstructHorisontalStringers();
    this.ConstructVerticalStringers();
    this.DisplayHorisontalStringers();
    this.DisplayVerticalStringers();

    //** Log skin(mousePosWorld) row & col
    this.rowLog;
    this.colLog;


  }

  /*
  LogSkin() {
    for (let row = 0; row < this.rowsSkin; row++) {
      for (let col = 0; col < this.columnsSkin; col++) {
        //** Length og gridArray changes when added or deleted grid row or column
        //** => need to restrict because otherwise first run will result in undefined
        if (
          this.skinMatrix.length == grid.rows.length &&
          this.skinMatrix[0].length == grid.columns.length
        ) {
          //** Log overlapped Node
          if (
            this.skinMatrix[row][col].skinExist &&
            this.skinMatrix[row][col].fixPointOverlap_t
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
  */

  UpdateSkinSystem() {
    
    this.rowsSkin = grid.rows.length - 1;
    this.columnsSkin = grid.columns.length - 1;

    for (let rows = 0; rows < this.rowsSkin; rows++) {
      for (let columns = 0; columns < this.columnsSkin; columns++) {
        let startPosX = grid.columns[columns][0];
        let startPosY = grid.rows[rows][0];
        let startPos = new p5.Vector(startPosX, startPosY);
        let w = grid.columns[columns + 1][0] - grid.columns[columns][0];
        let h = grid.rows[rows + 1][0] - grid.rows[rows][0];

        this.skinMatrix[rows][columns].startPos = startPos;
        this.skinMatrix[rows][columns].w = w;
        this.skinMatrix[rows][columns].h = h;
        
        //console.log(this.skinMatrix[rows][columns].t)

        //** Update induvidual skin => check if exist
        this.skinMatrix[rows][columns].UpdateSkin();

        //** Log Skin row && col
        this.LogSkin(mousePosWorld);

        //** OverlapFixPoint_t check
        this.skinMatrix[rows][columns].OverlapFixPoint_skin_t(mousePosWorld);
        
        //console.log(this.skinMatrix[rows][columns].t)
      }
    }

    this.unknowns =
      this.stringerHorisontal.length + this.stringerVertical.length;

    //console.log("stringerHor: " + this.stringerHorisontal.length)
    //console.log("stringerVer: " + this.stringerVertical.length)
  }

  DisplaySkinSystem() {   
    for (let rows = 0; rows < this.rowsSkin; rows++) {
      for (let columns = 0; columns < this.columnsSkin; columns++) {
        this.skinMatrix[rows][columns].DisplaySkin();
        this.skinMatrix[rows][columns].DisplayConnection();
      }
    }
  }

  //** Used in changeSystem //** Updated in UpdateSkinSystem()
  LogSkin(pos) {
    //** Reset to "undefined" before calc => undefined when mouse outside skinZone
    this.colLog = undefined;
    this.rowLog = undefined;

    //** Only calculate when in skinZone
    let leftLimit = this.skinMatrix[0][0].startPos.x;
    let rigthLimit =
      this.skinMatrix[0][this.columnsSkin - 1].startPos.x +
      this.skinMatrix[0][this.columnsSkin - 1].w;
    let topLimit = this.skinMatrix[0][0].startPos.y;
    let bottomLimit =
      this.skinMatrix[this.rowsSkin - 1][0].startPos.y +
      this.skinMatrix[this.rowsSkin - 1][0].h;

    if (leftLimit < pos.x && pos.x < rigthLimit) {
      if (topLimit < pos.y && pos.y < bottomLimit) {
        //** LOG START **
        for (let row = 0; row < this.rowsSkin; row++) {
          if (
            this.skinMatrix[row][0].startPos.y < pos.y &&
            pos.y < this.skinMatrix[row][0].bottom_y
          ) {
            this.rowLog = row;

            for (let col = 0; col < this.columnsSkin; col++) {
              if (
                this.skinMatrix[this.rowLog][col].startPos.x < pos.x &&
                pos.x < this.skinMatrix[this.rowLog][col].topRigth_x
              )
                this.colLog = col;
            }
          }
        }
        //** LOG END **
      }
    }

    //console.log("SkinSystem line 188 - rowLog: " + this.rowLog + " colLog: " +this.colLog)
  }

  //** Determine if Skins are connected
  SkinConnectedHorisontalSet() {
    //** Check every row
    //** Only check until col-1
    for (let rows = 0; rows < this.rowsSkin; rows++) {
      for (let columns = 0; columns < this.columnsSkin - 1; columns++) {
        //** Only check if actual skin exist
        if (this.skinMatrix[rows][columns].skinExist) {
          //** First row **

          if (rows == 0) {
            //** if skin Right Exist
            if (this.skinMatrix[rows][columns + 1].skinExist) {
              //** Skin Actual
              this.skinMatrix[rows][columns].connected_21 = true;
              this.skinMatrix[rows][columns].connected_41 = true;
              //** Skin to the right
              this.skinMatrix[rows][columns + 1].connected_11 = true;
              this.skinMatrix[rows][columns + 1].connected_31 = true;
            } else {
              //** Skin Actual
              this.skinMatrix[rows][columns].connected_21 = false;
              this.skinMatrix[rows][columns].connected_41 = false;
              //** Skin to the right
              this.skinMatrix[rows][columns + 1].connected_11 = false;
              this.skinMatrix[rows][columns + 1].connected_31 = false;
            }

            //** if rows skin > 1 && if skin to LowerRight Exist
            if (
              this.rowsSkin > 1 &&
              this.skinMatrix[rows + 1][columns + 1].skinExist
            ) {
              //** Skin Actual
              this.skinMatrix[rows][columns].connected_41 = true;
              //** Skin to the LowerRight
              this.skinMatrix[rows + 1][columns + 1].connected_11 = true;
            }

            //** Last row **
          } else if (rows == this.rowsSkin - 1) {
            //**
            //** if skin to UpperRight Exist
            if (this.skinMatrix[rows - 1][columns + 1].skinExist) {
              //** Skin Actual
              this.skinMatrix[rows][columns].connected_21 = true;
              //** Skin to the UpperRight
              this.skinMatrix[rows - 1][columns + 1].connected_31 = true;
            }

            //** if skin Right Exist
            if (this.skinMatrix[rows][columns + 1].skinExist) {
              //** Skin Actual
              this.skinMatrix[rows][columns].connected_21 = true;
              this.skinMatrix[rows][columns].connected_41 = true;
              //** Skin to the right
              this.skinMatrix[rows][columns + 1].connected_11 = true;
              this.skinMatrix[rows][columns + 1].connected_31 = true;
            }
          } else {
            //** if skin to UpperRight Exist
            if (this.skinMatrix[rows - 1][columns + 1].skinExist) {
              //** Skin actual
              this.skinMatrix[rows][columns].connected_21 = true;
              //** Skin to the UpperRigth
              this.skinMatrix[rows - 1][columns + 1].connected_31 = true;
            }

            //** if skin Right Exist
            if (this.skinMatrix[rows][columns + 1].skinExist) {
              //** Skin Actual
              this.skinMatrix[rows][columns].connected_21 = true;
              this.skinMatrix[rows][columns].connected_41 = true;
              //** Skin to the right
              this.skinMatrix[rows][columns + 1].connected_11 = true;
              this.skinMatrix[rows][columns + 1].connected_31 = true;
            }
            //** if skin to LowerRight Exist
            if (this.skinMatrix[rows + 1][columns + 1].skinExist) {
              //** Skin Actual
              this.skinMatrix[rows][columns].connected_41 = true;
              //** Skin to the LowerRight
              this.skinMatrix[rows + 1][columns + 1].connected_11 = true;
            }
          }
        } //** if skinExist ** END
      } //** Columns ** END
    } //** Rows ** END
    //** Check finish
  }

  //** Determine if Skins are connected
  SkinConnectedVerticalSet() {
    //** Check every column
    //** Only check until row-1
    for (let columns = 0; columns < this.columnsSkin; columns++) {
      for (let rows = 0; rows < this.rowsSkin - 1; rows++) {
        //** Only check if actual skin exist
        if (this.skinMatrix[rows][columns].skinExist) {
          //** First column **
          if (columns == 0) {
            //** if skin Right Exist
            if (this.skinMatrix[rows + 1][columns].skinExist) {
              //** Skin Actual
              this.skinMatrix[rows][columns].connected_32 = true;
              this.skinMatrix[rows][columns].connected_42 = true;
              //** Skin to Lower
              this.skinMatrix[rows + 1][columns].connected_12 = true;
              this.skinMatrix[rows + 1][columns].connected_22 = true;
            }
            //** if columns Skin > 1 && if skin to LowerRight Exist
            if (
              this.columnsSkin > 1 &&
              this.skinMatrix[rows + 1][columns + 1].skinExist
            ) {
              //** Skin Actual
              this.skinMatrix[rows][columns].connected_42 = true;
              //** Skin to the LowerRight
              this.skinMatrix[rows + 1][columns + 1].connected_12 = true;
            }

            //** Last column **
          } else if (columns == this.columnsSkin - 1) {
            //**
            //** if skin to LowerLeft
            if (this.skinMatrix[rows + 1][columns - 1].skinExist) {
              //** Skin Actual
              this.skinMatrix[rows][columns].connected_32 = true;
              //** Skin to the LowerLeft
              this.skinMatrix[rows + 1][columns - 1].connected_22 = true;
            }

            //** if skin Lower Exist
            if (this.skinMatrix[rows + 1][columns].skinExist) {
              //** Skin Actual
              this.skinMatrix[rows][columns].connected_32 = true;
              this.skinMatrix[rows][columns].connected_42 = true;
              //** Skin to the right
              this.skinMatrix[rows + 1][columns].connected_12 = true;
              this.skinMatrix[rows + 1][columns].connected_22 = true;
            }
          } else {
            //** if skin to LowerLeft Exist
            if (this.skinMatrix[rows + 1][columns - 1].skinExist) {
              //** Skin actual
              this.skinMatrix[rows][columns].connected_32 = true;
              //** Skin to the LowerLeft
              this.skinMatrix[rows + 1][columns - 1].connected_22 = true;
            }

            //** if skin Lower Exist
            if (this.skinMatrix[rows + 1][columns].skinExist) {
              //** Skin Actual
              this.skinMatrix[rows][columns].connected_32 = true;
              this.skinMatrix[rows][columns].connected_42 = true;
              //** Skin to the Lower
              this.skinMatrix[rows + 1][columns].connected_12 = true;
              this.skinMatrix[rows + 1][columns].connected_22 = true;
            }
            //** if skin to LowerRight Exist
            if (this.skinMatrix[rows + 1][columns + 1].skinExist) {
              //** Skin Actual
              this.skinMatrix[rows][columns].connected_42 = true;
              //** Skin to the LowerRight
              this.skinMatrix[rows + 1][columns + 1].connected_12 = true;
            }
          }
        } //** if skinExist ** END
      } //** Rows ** END
    } //** Columns ** END
    //** Check finish
  }

  //** ConstructStringers called from Setup and sketch
  //** check gridLines and if skin connected to line
  ConstructHorisontalStringers() {
    //** Empty so that reduce in size is possible
    this.stringerHorisontal = [];

    //** Horisontal stringers
    let countHorisontal = -1;
    let countElement = 0;

    for (let rowSkin = 0; rowSkin <= this.rowsSkin; rowSkin++) {
      //** New Stringer when rowShift

      if (rowSkin < this.rowsSkin) {
        countHorisontal++;
        this.stringerHorisontal[countHorisontal] = [
          this.skinMatrix[rowSkin][0].startPos.y,
        ];
      }

      if (rowSkin == this.rowsSkin) {
        countHorisontal++;
        this.stringerHorisontal[countHorisontal] = [
          this.skinMatrix[rowSkin - 1][0].bottom_y,
        ];
      }

      for (let colSkin = 0; colSkin < this.columnsSkin; colSkin++) {
        //** Add to Stringer if skinExist * BELOW stringer
        if (rowSkin == 0) {
          if (
            this.skinMatrix[rowSkin][colSkin].skinExist ||
            this.skinMatrix[rowSkin][colSkin].stringerTopExist
          ) {
            countElement++;
            this.stringerHorisontal[countHorisontal][
              countElement
            ] = this.skinMatrix[rowSkin][colSkin].startPos.x;
            countElement++;
            this.stringerHorisontal[countHorisontal][
              countElement
            ] = this.skinMatrix[rowSkin][colSkin].topRigth_x;
          }
        }

        //** Add to Stringer if skinExist ** ABOVE & BELOW
        if (0 < rowSkin && rowSkin < this.rowsSkin) {
          if (
            this.skinMatrix[rowSkin][colSkin].skinExist ||
            this.skinMatrix[rowSkin - 1][colSkin].skinExist ||
            this.skinMatrix[rowSkin][colSkin].stringerTopExist ||
            this.skinMatrix[rowSkin - 1][colSkin].stringerBottomExist
          ) {
            countElement++;
            this.stringerHorisontal[countHorisontal][
              countElement
            ] = this.skinMatrix[rowSkin][colSkin].startPos.x;
            countElement++;
            this.stringerHorisontal[countHorisontal][
              countElement
            ] = this.skinMatrix[rowSkin][colSkin].topRigth_x;
          }
        }

        //** Add to Stringer if skinExist ** ABOVE
        if (rowSkin == this.rowsSkin) {
          if (
            this.skinMatrix[rowSkin - 1][colSkin].skinExist ||
            this.skinMatrix[rowSkin - 1][colSkin].stringerBottomExist
          ) {
            countElement++;
            this.stringerHorisontal[countHorisontal][
              countElement
            ] = this.skinMatrix[rowSkin - 1][colSkin].startPos.x;
            countElement++;
            this.stringerHorisontal[countHorisontal][
              countElement
            ] = this.skinMatrix[rowSkin - 1][colSkin].topRigth_x;
          }
        }
      } //** colSkin END

      //** start next element at location 1
      countElement = 0;
    }
    //** Split Continuous Array to one Array for each stringer
    this.stringerHorisontal = this.ConstructHorisontalStringersArray();
  }

  ConstructHorisontalStringersArray() {
    //** Construct stringers from Array
    //******************
    this.testArrayHorisontal = [];
    //let count = 0;
    let countStringer = -1;
    for (let i = 0; i < this.stringerHorisontal.length; i++) {
      let y_temp = this.stringerHorisontal[i][0];
      //console.log("y_temp: " + y_temp);
      countStringer++;
      //console.log("countStringer: " + countStringer);
      this.testArrayHorisontal[countStringer] = [
        y_temp,
        this.stringerHorisontal[i][1],
        this.stringerHorisontal[i][2],
      ];

      for (let j = 2; j < this.stringerHorisontal[i].length - 1; j++) {
        //console.log("j: " + j);

        if (
          this.stringerHorisontal[i][j] == this.stringerHorisontal[i][j + 1]
        ) {
          this.testArrayHorisontal[countStringer].push(
            this.stringerHorisontal[i][j + 1],
            this.stringerHorisontal[i][j + 2]
          );
          j += 1;
        } else {
          countStringer++;
          j++;
          this.testArrayHorisontal[countStringer] = [
            y_temp,
            this.stringerHorisontal[i][j],
            this.stringerHorisontal[i][j + 1],
          ];
        }
      }
    }
    //console.table("* " + this.testArrayHorisontal);
    return this.testArrayHorisontal;
  }

  DisplayHorisontalStringers() {
    for (
      let stringer = 0;
      stringer < this.stringerHorisontal.length;
      stringer++
    ) {
      for (
        let element = 1;
        element < this.stringerHorisontal[stringer].length;
        element += 2
      ) {
        push();
        stroke(50, 50, 50);
        strokeWeight(3);
        let gridLine_Y = this.stringerHorisontal[stringer][0];
        let start_X = this.stringerHorisontal[stringer][element];
        let end_X = this.stringerHorisontal[stringer][element + 1];
        if (start_X && end_X) line(start_X, gridLine_Y, end_X, gridLine_Y);

        pop();
      }
      //console.log("stringer :" + stringer);
    }
  }

  //** ConstructStringers called from Setup
  //** check gridLines and if skin connected to line
  ConstructVerticalStringers() {
    //** Empty so that reduce in size is possible
    this.stringerVertical = [];

    //** Vertical stringers
    let countVertical = -1;
    let countElement = 0;

    for (let colSkin = 0; colSkin <= this.columnsSkin; colSkin++) {
      //** New Stringer when col Shift

      if (colSkin < this.columnsSkin) {
        countVertical++;
        this.stringerVertical[countVertical] = [
          this.skinMatrix[0][colSkin].startPos.x,
        ];
      }

      if (colSkin == this.columnsSkin) {
        countVertical++;
        this.stringerVertical[countVertical] = [
          this.skinMatrix[0][colSkin - 1].topRigth_x,
        ];
      }

      for (let rowSkin = 0; rowSkin < this.rowsSkin; rowSkin++) {
        //** Add to Stringer if skinExist * RIGTH || stringer Left Exist
        if (colSkin == 0) {
          if (
            this.skinMatrix[rowSkin][colSkin].skinExist ||
            this.skinMatrix[rowSkin][colSkin].stringerLeftExist
          ) {
            countElement++;
            this.stringerVertical[countVertical][
              countElement
            ] = this.skinMatrix[rowSkin][colSkin].startPos.y;
            countElement++;
            this.stringerVertical[countVertical][
              countElement
            ] = this.skinMatrix[rowSkin][colSkin].bottom_y;
          }
        }

        //** Add to Stringer if skinExist ** LEFT & RIGTH
        if (0 < colSkin && colSkin < this.columnsSkin) {
          if (
            this.skinMatrix[rowSkin][colSkin].skinExist ||
            this.skinMatrix[rowSkin][colSkin - 1].skinExist ||
            this.skinMatrix[rowSkin][colSkin].stringerLeftExist ||
            this.skinMatrix[rowSkin][colSkin - 1].stringerRigthExist
          ) {
            countElement++;
            this.stringerVertical[countVertical][
              countElement
            ] = this.skinMatrix[rowSkin][colSkin].startPos.y;
            countElement++;
            this.stringerVertical[countVertical][
              countElement
            ] = this.skinMatrix[rowSkin][colSkin].bottom_y;
          }
        }

        //** Add to Stringer if skinExist ** LEFT || stringer rigth Exist
        if (colSkin == this.columnsSkin) {
          if (
            this.skinMatrix[rowSkin][colSkin - 1].skinExist ||
            this.skinMatrix[rowSkin][colSkin - 1].stringerRigthExist
          ) {
            countElement++;
            this.stringerVertical[countVertical][
              countElement
            ] = this.skinMatrix[rowSkin][colSkin - 1].startPos.y;
            countElement++;
            this.stringerVertical[countVertical][
              countElement
            ] = this.skinMatrix[rowSkin][colSkin - 1].bottom_y;
          }
        }
      } //** rowSkin END

      //** start next element at location 1
      countElement = 0;
    }
    //** Split Continuous Array to one Array for each stringer
    this.stringerVertical = this.ConstructVerticalStringersArray();
  }

  ConstructVerticalStringersArray() {
    //** Construct stringers from Array
    //******************
    this.testArrayVertical = [];
    //let count = 0;
    let countStringer = -1;
    for (let i = 0; i < this.stringerVertical.length; i++) {
      let y_temp = this.stringerVertical[i][0];
      //console.log("y_temp: " + y_temp);
      countStringer++;
      //console.log("countStringer: " + countStringer);
      this.testArrayVertical[countStringer] = [
        y_temp,
        this.stringerVertical[i][1],
        this.stringerVertical[i][2],
      ];

      for (let j = 2; j < this.stringerVertical[i].length - 1; j++) {
        //console.log("j: " + j);

        if (this.stringerVertical[i][j] == this.stringerVertical[i][j + 1]) {
          this.testArrayVertical[countStringer].push(
            this.stringerVertical[i][j + 1],
            this.stringerVertical[i][j + 2]
          );
          j += 1;
        } else {
          countStringer++;
          j++;
          this.testArrayVertical[countStringer] = [
            y_temp,
            this.stringerVertical[i][j],
            this.stringerVertical[i][j + 1],
          ];
        }
      }
    }
    //console.table("* " + this.testArrayVertical);
    return this.testArrayVertical;
  }

  DisplayVerticalStringers() {
    for (
      let stringer = 0;
      stringer < this.stringerVertical.length;
      stringer++
    ) {
      for (
        let element = 1;
        element < this.stringerVertical[stringer].length;
        element += 2
      ) {
        push();
        stroke(50, 50, 50);
        strokeWeight(3);
        let gridLine_X = this.stringerVertical[stringer][0];
        let start_Y = this.stringerVertical[stringer][element];
        let end_Y = this.stringerVertical[stringer][element + 1];
        ///console.log("start_Y: " + start_Y + " : end_Y: " + end_Y)
        if (start_Y && end_Y) line(gridLine_X, start_Y, gridLine_X, end_Y);

        pop();
      }
      //console.log("stringer :" + stringer);
    }
  }

  StringerSkinSystemHorisontal() {
    //**Make ZeroMatrix
    let unknownsHorisontal = this.stringerHorisontal.length; // + this.stringerVertical.length;
    //console.log(unknownsHorisontal);
    for (let stringer = 0; stringer < unknownsHorisontal; stringer++) {
      this.stringerSkinMatrixHorisontal[stringer] = [];
      for (let row = 0, lengthRows = this.rowsSkin; row < lengthRows; row++) {
        this.stringerSkinMatrixHorisontal[stringer][row] = [];
        for (
          let col = 0, lengthCols = this.columnsSkin;
          col < lengthCols;
          col++
        ) {
          //** ZeroMatrix
          this.stringerSkinMatrixHorisontal[stringer][row][col] = [0, 0];

          //console.log(this.stringerHorisontal[stringer])
          //** If centerSkin > stringer.y (skin below stringer)
          let stringerStartX = this.stringerHorisontal[stringer][1];
          let stringerEndX = this.stringerHorisontal[stringer][
            this.stringerHorisontal[stringer].length - 1
          ];
          if (
            this.skinMatrix[row][col].skinExist &&
            this.skinMatrix[row][col].startPos.y ==
              this.stringerHorisontal[stringer][0] &&
            this.skinMatrix[row][col].startPos.x < stringerEndX &&
            this.skinMatrix[row][col].startPos.x >= stringerStartX
          ) {
            this.stringerSkinMatrixHorisontal[stringer][row][col] = [
              this.skinMatrix[row][col].v11,
              this.skinMatrix[row][col].a11,
            ];
          }

          //** If centerSkin < stringer.y (skin abowe stringer)
          if (
            this.skinMatrix[row][col].skinExist &&
            this.skinMatrix[row][col].startPos.y +
              this.skinMatrix[row][col].h ==
              this.stringerHorisontal[stringer][0] &&
            this.skinMatrix[row][col].startPos.x < stringerEndX &&
            this.skinMatrix[row][col].startPos.x >= stringerStartX
          ) {
            this.stringerSkinMatrixHorisontal[stringer][row][col] = [
              this.skinMatrix[row][col].v31,
              this.skinMatrix[row][col].a31,
            ];
          }
        }
      }
    }

    /*
    //** Console.table stringer
    for (let i = 0; i < this.stringerSkinMatrixHorisontal.length; i++) {
      console.table(this.stringerSkinMatrixHorisontal[i]);
    }
    */
    
  }

  //********************

  StringerSkinSystemVertical() {
    //**Make ZeroMatrix
    let unknownsVertical = this.stringerVertical.length; // + this.stringerVertical.length;
    //console.log(unknownsVertical);
    //console.log(this.stringerVertical[0]);
    for (let stringer = 0; stringer < unknownsVertical; stringer++) {
      this.stringerSkinMatrixVertical[stringer] = [];

      for (let row = 0, lengthRows = this.rowsSkin; row < lengthRows; row++) {
        this.stringerSkinMatrixVertical[stringer][row] = [];
        for (
          let col = 0, lengthCols = this.columnsSkin;
          col < lengthCols;
          col++
        ) {
          //** ZeroMatrix
          this.stringerSkinMatrixVertical[stringer][row][col] = [0, 0];

          //** If skin.startPos > stringer.x (skin rigth of stringer)
          let stringerStartY = this.stringerVertical[stringer][1];
          let stringerEndY = this.stringerVertical[stringer][
            this.stringerVertical[stringer].length - 1
          ];

          if (
            this.skinMatrix[row][col].skinExist &&
            this.skinMatrix[row][col].startPos.x ==
              this.stringerVertical[stringer][0] &&
            this.skinMatrix[row][col].startPos.y < stringerEndY &&
            this.skinMatrix[row][col].startPos.y >= stringerStartY
          ) {
            this.stringerSkinMatrixVertical[stringer][row][col] = [
              this.skinMatrix[row][col].v12,
              this.skinMatrix[row][col].a12,
            ];
          }

          //** If skin.startPos < stringer.x (skin Left of stringer)
          if (
            this.skinMatrix[row][col].skinExist &&
            this.skinMatrix[row][col].startPos.x +
              this.skinMatrix[row][col].w ==
              this.stringerVertical[stringer][0] &&
            this.skinMatrix[row][col].startPos.y < stringerEndY &&
            this.skinMatrix[row][col].startPos.y >= stringerStartY
          ) {
            this.stringerSkinMatrixVertical[stringer][row][col] = [
              this.skinMatrix[row][col].v22,
              this.skinMatrix[row][col].a22,
            ];
          }
        }
      }
    }

    //** Console.table stringer
    //console.log("**********************");
    for (let i = 0; i < this.stringerSkinMatrixVertical.length; i++) {
      //console.table(this.stringerSkinMatrixVertical[i]);
    }
  }

  StiffnessMatrixGlobal() {
    //**********************
    //** Setup ZeroMatrix **
    //**********************

    this.unknowns =
      this.stringerHorisontal.length + this.stringerVertical.length;

    //** Empty so that reduced matrix is possible
    this.stiffnessMatrixGlobal = [];

    for (let row = 0, length = this.unknowns; row < length; row++) {
      this.stiffnessMatrixGlobal[row] = [];
      for (let col = 0; col < length; col++) {
        this.stiffnessMatrixGlobal[row][col] = 0;
      }
    }

    //**********************************
    //** Elements Horisontal ** Start **
    //**********************************

    for (
      let stringer_i = 0;
      stringer_i < this.stringerHorisontal.length;
      stringer_i++
    ) {
      //** Stringer_i
      for (
        let stringer_j = stringer_i;
        stringer_j < this.stringerHorisontal.length;
        stringer_j++
      ) {
        //** Stringer_j
        for (let row = 0; row < this.rowsSkin; row++) {
          for (let col = 0; col < this.columnsSkin; col++) {
            let skin_i = this.stringerSkinMatrixHorisontal[stringer_i][row][
              col
            ];
            let skin_j = this.stringerSkinMatrixHorisontal[stringer_j][row][
              col
            ];

            let v = skin_i[0];
            let a = skin_j[1];
            this.stiffnessMatrixGlobal[stringer_i][stringer_j] += v * a;

            //** Lower matrix
            this.stiffnessMatrixGlobal[stringer_j][
              stringer_i
            ] = this.stiffnessMatrixGlobal[stringer_i][stringer_j];
          }
        }
      } //** Stringer_j
    } //** Stringer_i

    //**********************************
    //** Elements Vertical ** Start **
    //**********************************

    for (
      let stringer_i = 0;
      stringer_i < this.stringerVertical.length;
      stringer_i++
    ) {
      //** Stringer_i
      for (
        let stringer_j = stringer_i;
        stringer_j < this.stringerVertical.length;
        stringer_j++
      ) {
        //** Stringer_j
        for (let row = 0; row < this.rowsSkin; row++) {
          for (let col = 0; col < this.columnsSkin; col++) {
            let skin_i = this.stringerSkinMatrixVertical[stringer_i][row][col];
            let skin_j = this.stringerSkinMatrixVertical[stringer_j][row][col];
            let adjust = this.stringerHorisontal.length;

            let v = skin_i[0];
            let a = skin_j[1];
            this.stiffnessMatrixGlobal[stringer_i + adjust][
              stringer_j + adjust
            ] += v * a;

            //** Lower matrix
            this.stiffnessMatrixGlobal[stringer_j + adjust][
              stringer_i + adjust
            ] = this.stiffnessMatrixGlobal[stringer_i + adjust][
              stringer_j + adjust
            ];
          }
        }
      } //** Stringer_j
    } //** Stringer_i

    //*******************************************
    //** Elements Horisontol/Vertical ** Start **
    //*******************************************

    for (
      let stringer_i = 0;
      stringer_i < this.stringerHorisontal.length;
      stringer_i++
    ) {
      //** Stringer_i
      for (
        let stringer_j = 0;
        stringer_j < this.stringerVertical.length;
        stringer_j++
      ) {
        //** Stringer_j
        for (let row = 0; row < this.rowsSkin; row++) {
          for (let col = 0; col < this.columnsSkin; col++) {
            let skin_i = this.stringerSkinMatrixHorisontal[stringer_i][row][
              col
            ];
            let skin_j = this.stringerSkinMatrixVertical[stringer_j][row][col];
            let adjust = this.stringerHorisontal.length;

            let v = skin_i[0];
            let a = skin_j[1];
            this.stiffnessMatrixGlobal[stringer_i][stringer_j + adjust] +=
              v * a;

            //** Lower matrix
            this.stiffnessMatrixGlobal[stringer_j + adjust][
              stringer_i
            ] = this.stiffnessMatrixGlobal[stringer_i][stringer_j + adjust];
          }
        }
      } //** Stringer_j
    } //** Stringer_i
  }

  //**Read Skin
  SkinRead() {}
}
