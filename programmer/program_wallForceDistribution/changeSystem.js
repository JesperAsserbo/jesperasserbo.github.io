class ChangeSystem {
  constructor() {
    this.buttonAdd;
    this.buttonDelete;

    this.walls;
    //this.stepChange = 10;

    this.graph;

    this.tempNodes = [];

    this.tempNodeStart;
    this.tempNodeEnd;

    this.scaleForce = 1; //**GlobalVariable
    //this.scaleMesure = 100; //** => meters in graph
    this.scaleMesure = 1; //** 100 => meters
  }

  ChangeLoadPos_Px(pos) {
    //** logFixpoint only if overlap and mouseIsPressed... Set to false in sketch.MouseRelease();
    if (load.OverlapPx(pos) && mouseIsPressed) {
      this.MoveInSteps(pos);
      logFixpoint_Px = true;
    }
    if (logFixpoint_Px == false) return;
    load.y_Px = (pos.y - graph.posOrigo.y) * scaleGeo;
  }
  ChangeLoadPos_Py(pos) {
    //** logFixpoint only if overlap and mouseIsPressed... Set to false in sketch.MouseRelease();
    if (load.OverlapPy(pos) && mouseIsPressed) {
      this.MoveInSteps(pos);
      logFixpoint_Py = true;
    }
    if (logFixpoint_Py == false) return;
    load.x_Py = (pos.x - graph.posOrigo.x) * scaleGeo;
  }
  ChangeWallPos(array, pos) {
    //** Test for Overlap
    this.logStart_id = null;
    this.logEnd_id = null;
    this.logCenter_id = null;

    // noprotection
    for (let i = 0, length = array.length; i < length; i++) {
      if (array[i].OverlapStartPos(pos)) {
        this.logStart_id = i;
        if (mouseIsPressed) {
          if (countLoggedInsertPoints == 0) {
            countLoggedInsertPoints++;
            logStart_id = i;
            logWallStartPoint = true;
          };
        }; //** set to false in sketch.MouseRleased()
        this.wallDisplayCoordinates(array[i], pos);
        //** break if Overlap
        break;
      };
      if (array[i].OverlapEndPos(pos)) {
        this.logEnd_id = i;
        if (mouseIsPressed) {
          if (countLoggedInsertPoints == 0) {
            countLoggedInsertPoints++;
            logEnd_id = i;
            logWallEndPoint = true;
          };
        }; //** set to false in sketch.MouseRleased()
        this.wallDisplayCoordinates(array[i], pos);
        //** break if Overlap
        break;
      };
      if (array[i].OverlapCenter(pos)) {
        this.logCenter_id = i;
        if (mouseIsPressed) {
          if (countLoggedInsertPoints == 0) {
            countLoggedInsertPoints++;
            logCenter_id = i;
            logWallCenterPoint = true;
          };
        }; //** set to false in sketch.MouseRleased()
        this.wallDisplayCoordinates(array[i], pos);
        //** break if Overlap
        break;
      };
    };

    //** return if no overlap
    if (
      logWallStartPoint == false &&
      logWallEndPoint == false &&
      logWallCenterPoint == false
    )
      return;

    //pos = this.MoveInSteps(pos);

    //** otherwise move pos
    if (logWallStartPoint && mouseIsPressed) {
      //** Set coordinates with respect to graph.posOrigo

      //** Move Start
      array[logStart_id].startPos_o.x = pos.x;
      array[logStart_id].startPos_o.y = pos.y;

      //** Move Center
      let Lx = array[logStart_id].endPos_o.x - array[logStart_id].startPos_o.x;
      let Ly = array[logStart_id].endPos_o.y - array[logStart_id].startPos_o.y;

      array[logStart_id].centerPos_o.x =
        array[logStart_id].startPos_o.x + 0.5 * Lx;
      array[logStart_id].centerPos_o.y =
        array[logStart_id].startPos_o.y + 0.5 * Ly;

      /*
      //** Set coordinates with respect to paper 0,0
      array[logStart_id].startPos.x =
        (array[logStart_id].startPos_o.x - graph.posOrigo.x)*scaleGeo; //** scaleGeo **
      array[logStart_id].startPos.y =
        (array[logStart_id].startPos_o.y - graph.posOrigo.y)*scaleGeo; //** scaleGeo **

      //** Set Center coordinates with respect to paper 0,0
      array[logStart_id].centerPos.x =
        array[logStart_id].centerPos_o.x - graph.posOrigo.x;
      array[logStart_id].centerPos.y =
        array[logStart_id].centerPos_o.y - graph.posOrigo.y;
      */
    }
    if (logWallEndPoint == true && mouseIsPressed) {
      //** Set coordinates with respect to graph.posOrigo

      //** Move End
      array[logEnd_id].endPos_o.x = pos.x;
      array[logEnd_id].endPos_o.y = pos.y;

      //** Move Center
      let Lx = array[logEnd_id].endPos_o.x - array[logEnd_id].startPos_o.x;
      let Ly = array[logEnd_id].endPos_o.y - array[logEnd_id].startPos_o.y;

      array[logEnd_id].centerPos_o.x = array[logEnd_id].endPos_o.x - 0.5 * Lx;
      array[logEnd_id].centerPos_o.y = array[logEnd_id].endPos_o.y - 0.5 * Ly;

      /*
      //** Set coordinates with respect to paper 0,0
      array[logEnd_id].endPos.x =
        (array[logEnd_id].endPos_o.x - graph.posOrigo.x)*scaleGeo; //** scaleGeo **
      array[logEnd_id].endPos.y =
        (array[logEnd_id].endPos_o.y - graph.posOrigo.y)*scaleGeo; //** scaleGeo **

      //** Set Center coordinates with respect to paper 0,0
      array[logEnd_id].centerPos.x =
        array[logEnd_id].centerPos_o.x - graph.posOrigo.x;
      array[logEnd_id].centerPos.y =
        array[logEnd_id].centerPos_o.y - graph.posOrigo.y;
        */
    }

    if (logWallCenterPoint == true && mouseIsPressed) {
      //** Set coordinates with respect to graph.posOrigo

      //** Move Center
      array[logCenter_id].centerPos_o.x = pos.x;
      array[logCenter_id].centerPos_o.y = pos.y;

      let Lx =
        array[logCenter_id].endPos_o.x - array[logCenter_id].startPos_o.x;
      let Ly =
        array[logCenter_id].endPos_o.y - array[logCenter_id].startPos_o.y;

      //** Move startPos
      array[logCenter_id].startPos_o.x =
        array[logCenter_id].centerPos_o.x - 0.5 * Lx;
      array[logCenter_id].startPos_o.y =
        array[logCenter_id].centerPos_o.y - 0.5 * Ly;

      //** Move endPos
      array[logCenter_id].endPos_o.x =
        array[logCenter_id].centerPos_o.x + 0.5 * Lx;
      array[logCenter_id].endPos_o.y =
        array[logCenter_id].centerPos_o.y + 0.5 * Ly;

      /*
      //** Set coordinates with respect to graph.posOrigo
      array[logCenter_id].startPos_o.x =
        pos.x + p5.Vector.mult(array[logCenter_id].wallVectorUnit, -0.5).x;
      array[logCenter_id].startPos_o.y =
        pos.y + p5.Vector.mult(array[logCenter_id].wallVectorUnit, -0.5).y;

      array[logCenter_id].endPos_o.x =
        pos.x + p5.Vector.mult(array[logCenter_id].wallVectorUnit, 0.5).x;
      array[logCenter_id].endPos_o.y =
        pos.y + p5.Vector.mult(array[logCenter_id].wallVectorUnit, 0.5).y;

      
      //** Set Center coordinates with respect to paper 0,0
      array[logCenter_id].startPos.x =
        array[logCenter_id].startPos_o.x - graph.posOrigo.x;
      array[logCenter_id].startPos.y =
        array[logCenter_id].startPos_o.y - graph.posOrigo.y;

      array[logCenter_id].centerPos.x =
        array[logCenter_id].centerPos_o.x - graph.posOrigo.x;
      array[logCenter_id].centerPos.y =
        array[logCenter_id].centerPos_o.y - graph.posOrigo.y;

      array[logCenter_id].endPos.x =
        array[logCenter_id].endPos_o.x - graph.posOrigo.x;
      array[logCenter_id].endPos.y =
        array[logCenter_id].endPos_o.y - graph.posOrigo.y;
        */
    }
  }

  UploadData(buttonAdd, buttonDelete, walls, graph) {
    this.buttonAdd = buttonAdd;
    this.buttonDelete = buttonDelete;

    this.walls = walls;
    //this.stepChange = this.walls[0].stepChange;
    this.t = this.walls[0].t;

    this.graph = graph;
  }

  ApplyScale(scaleForce, scaleMesure) {
    //**Change in values are stored in objectProporties
    this.scaleMesure = scaleMesure; //** 100 => meters
    this.scaleForce = scaleForce;
  }

  WallAdd(pos) {
    if (button_WallAdd.state == -1) return;
    push();

    pos = this.MoveInSteps(pos);

    //**Pos changed to GraphScale
    let posTemp = p5.Vector.mult(pos, 1); //**ref by value

    //**Add in graphArea
    if (
      button_WallAdd.state == 1 &&
      posTemp.x > graph.posOrigo.x &&
      posTemp.y > graph.posOrigo.y
    ) {
      noFill();

      //mousePosWorld = this.MoveInSteps(mousePosWorld);

      //** Display pos
      this.DisplayPointCoordinates(pos);

      //**Draw temp wall
      if (this.tempNodes.length > 0) {
        circle(this.tempNodes[0].x, this.tempNodes[0].y, 20);
        strokeWeight(10);
        stroke(50, 50, 50, 100);

        //posTemp = this.MoveInSteps(pos);
        this.DisplayPointCoordinates(this.tempNodes[0]);
        line(this.tempNodes[0].x, this.tempNodes[0].y, posTemp.x, posTemp.y);
      }

      //** Only Once
      if (mouseIsPressed && mouseButtonIsClicked == false) {
        mouseButtonIsClicked = true; //**Global variable
        mouseButtonIsReleased = false;

        //**Display tempCoordinates
        this.tempNodes.push(posTemp);
      }

      if (mouseButtonIsReleased && this.tempNodes.length == 1) {
        mouseButtonIsReleased = false;
        this.tempNodes.push(posTemp);
      }

      if (this.tempNodes.length == 2) {
        let startX = this.tempNodes[0].x - graph.posOrigo.x;
        let startY = this.tempNodes[0].y - graph.posOrigo.y;
        let endX = this.tempNodes[1].x - graph.posOrigo.x;
        let endY = this.tempNodes[1].y - graph.posOrigo.y;

        //console.log("temp_0: " + this.tempNodes[0]);
        //console.log("temp_1: " + this.tempNodes[1]);

        let id = wallSystem.array.length;
        //**Push new wall
        wallSystem.array.push(new Wall(startX, startY, endX, endY, id));

        //**Empty tempArray
        this.tempNodes = [];
      }
    }
    pop();

    //**DisplayCoordinates (if not overlap wallAdjustPoints)
    let test = 0;

    // noprotection
    for (let wall of wallSystem.array) {
      if (wall.OverlapCenter(pos) || wall.OverlapID(pos)) test++;
    };

    if (test == 0) {
      //this.wallDisplayCoordinates(posTemp);
      //**Display tempCoordinates when stored
      //if (this.tempNodes.length > 0) this.wallDisplayCoordinates(this.tempNodes[0]);
    } //** test end

    //**Empty tempArray if button off
    if (button_WallAdd.state == -1) this.tempNodes = [];
  }
  WallDelete(pos) {
    if (button_WallDelete.state == -1) return;
    if (wallSystem.array.length <= 3) return;
    push();

    noStroke();
    fill(255, 0, 0, 100);
    // noprotection
    for (let i = 0; i < wallSystem.array.length; i++) {
      circle(
        wallSystem.array[i].centerPos.x + graph.posOrigo.x,
        wallSystem.array[i].centerPos.y + graph.posOrigo.y,
        40
      );
    };

    if (wallSystem.overlapWall != null && mouseIsPressed) {
      wallSystem.array.splice(wallSystem.overlapWall, 1);
    }

    pop();
  }

  //** Called from this.wallAdd()
  DisplayPointCoordinates(pos) {
    //stroke(0,0,0,200)
    push();
    strokeWeight(1);
    stroke(0);
    line(pos.x, pos.y, -5 + graph.posOrigo.x, pos.y);
    textAlign(RIGHT, CENTER);

    fill(0);
    textSize(22);
    text(
      nf(((pos.y - graph.posOrigo.y) * scaleGeo) / 100, 0, 2),
      -10 + graph.posOrigo.x,
      pos.y
    );
    noFill();
    circle(graph.posOrigo.x, pos.y, 8);
    pop();

    //**Start Vertical mesureLine
    push();
    strokeWeight(1);
    stroke(0);
    line(pos.x, pos.y, pos.x, -5 + graph.posOrigo.y);
    textAlign(CENTER, CENTER);

    fill(0);
    textSize(20);
    text(
      nf(((pos.x - graph.posOrigo.x) * scaleGeo) / 100, 0, 2),
      pos.x,
      -20 + graph.posOrigo.y
    );
    noFill();
    circle(pos.x, graph.posOrigo.y, 8);
    pop();
  }

  //** called from this.changeWallPos();
  wallDisplayCoordinates(wall, pos) {
    //console.log("changeSystem line 260 " + wall.startPos)
    //pos = this.MoveInSteps(pos);

    //** START
    //** Horisontal mesureLine
    push();
    line(
      wall.startPos_o.x,
      wall.startPos_o.y,
      -5 + graph.posOrigo.x,
      wall.startPos_o.y
    );
    textAlign(RIGHT, CENTER);
    stroke(0);
    noStroke();
    fill(0);
    textSize(24);
    text(
      nf(wall.startPos.y / 100, 0, 2),
      -10 + graph.posOrigo.x,
      wall.startPos_o.y
    );
    noFill();
    circle(graph.posOrigo.x, wall.startPos_o.y, 8);
    pop();

    //**Start Vertical mesureLine
    push();
    line(
      wall.startPos_o.x,
      wall.startPos_o.y,
      wall.startPos_o.x,
      -5 + graph.posOrigo.y
    );
    textAlign(CENTER, CENTER);
    stroke(0);
    noStroke();
    fill(0);
    textSize(24);
    text(
      nf(wall.startPos.x / 100, 0, 2),
      wall.startPos_o.x,
      -20 + graph.posOrigo.y
    );
    noFill();
    circle(wall.startPos_o.x, graph.posOrigo.y, 8);
    pop();

    //** END
    //** Horisontal mesureLine
    push();
    line(
      wall.endPos_o.x,
      wall.endPos_o.y,
      -5 + graph.posOrigo.x,
      wall.endPos_o.y
    );
    textAlign(RIGHT, CENTER);
    stroke(0);
    noStroke();
    fill(0);
    textSize(24);
    text(
      nf(wall.endPos.y / 100, 0, 2),
      -10 + graph.posOrigo.x,
      wall.endPos_o.y
    );
    noFill();
    circle(graph.posOrigo.x, wall.endPos_o.y, 8);
    pop();

    //**Start Vertical mesureLine
    push();
    line(
      wall.endPos_o.x,
      wall.endPos_o.y,
      wall.endPos_o.x,
      -5 + graph.posOrigo.y
    );
    textAlign(CENTER, CENTER);
    stroke(0);
    noStroke();
    fill(0);
    textSize(24);
    text(
      nf(wall.endPos.x / 100, 0, 2),
      wall.endPos_o.x,
      -20 + graph.posOrigo.y
    );
    noFill();
    circle(wall.endPos_o.x, graph.posOrigo.y, 8);
    pop();
  }

  /*
  WallDelete(pos) {
    //**If in GraphArea then display coordinates
    //**Pos changed to GraphScale
    let posTemp = p5.Vector.mult(pos, 100 / this.scaleMesure); //**ref by value

    //**Add in graphArea
    if (
      this.buttonDelete.state == 1 &&
      posTemp.x < this.graph.xMax + 200 &&
      posTemp.y < this.graph.yMax + 200 &&
      posTemp.x > 0 &&
      posTemp.y > 0
    ) {
      //console.log("Test");
      push();
      noFill();
      circle(posTemp.x, posTemp.y, 20);
      pop();

      //  if (mouseIsPressed) {
      for (let j = this.walls.length - 1; j >= 0; j--) {
        if (
          collisionDetection.LineCircle(
            this.walls[j].startPos,
            this.walls[j].endPos,
            pos
          )
        ) {
          push();
          scale(100 / this.scaleMesure);
          strokeWeight(30);
          stroke(250, 100, 100, 100);
          line(
            this.walls[j].startPos.x,
            this.walls[j].startPos.y,
            this.walls[j].endPos.x,
            this.walls[j].endPos.y
          );
          pop();
          if (mouseIsPressed) this.walls.splice(j, 1);
        }
      }
      // }
    }
  }
  */

  //**reference by pointer (so no need to return array)
  BubbleSort(array) {
    //console.log(array)
    // noprotection
    for (let i = array.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (array[j].startPos.x > array[j + 1].startPos.x) {
          // swap
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        };
      };
    };
  }

  //**Sort loadPoints or loadLines if one is deleted
  //**Called from sketch
  BubbleSortLoad(array) {
    // noprotection
    for (let i = array.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (array[j].loadCaseNumber > array[j + 1].loadCaseNumber) {
          // swap
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        };
      };
    };
  }

  MoveInSteps(pos) {
    //console.log(stepSize)
    //**pos.y in multioplum of stepChange
    //let stepChange = 10; //*scaleGeo;
    pos.x = round(pos.x / stepSize) * stepSize;
    pos.y = round(pos.y / stepSize) * stepSize;
    return pos;
  }
} //**Classe End
