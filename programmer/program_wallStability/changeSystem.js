class ChangeSystem {
  constructor() {
    this.wallNumberLog = NaN;
    this.loadNumberLog = NaN;
  }

  /*
  DisplayWallScale() {
    push();
    for (let i = 0; i < wallArray.length; i++) {
      let topLeftScaled = this.ScalePoint(wallArray[i].adjustPoint_Left);
      fill(0, 0, 255, 100);
      rect(
        topLeftScaled.x,
        topLeftScaled.y,
        (wallArray[i].b / scaleGeo_Test) * 100,
        (wallArray[i].h / scaleGeo_Test) * 100
      );
      console.log("ChangeSystem line 18 " + topLeftScaled);
    }
    pop();
  }

  ScalePoint(point) {
    let base = wallArray[0].insertPointWall;
    let pointVector = p5.Vector.sub(point, base);

    pointVector.div(scaleGeo_Test);
    pointVector.add(base);

    return pointVector;
  }
  */

  Wall_Add(pos) {
    //** Draw wall contour
    let x_left = wallArray[wallArray.length - 1].adjustPoint_Left.x;
    let y_left = wallArray[wallArray.length - 1].adjustPoint_Left.y - 250;
    let w = wallArray[wallArray.length - 1].b * scaleGeo;
    let h = 250;

    push();
    fill(0, 255, 0, 100);
    strokeWeight(2);
    stroke(0, 255, 0, 250);
    rect(x_left, y_left, w, h);

    //** Text
    textAlign(CENTER, CENTER);
    textSize(40);
    fill(0);
    text("Add Wall", x_left + 0.5 * w, y_left + 0.4 * 250);
    pop();

    let addWall = false;

    if (x_left < pos.x && pos.x < x_left + w) {
      if (y_left < pos.y && pos.y < y_left + h) {
        addWall = true;
      }
    }

    //** if pos of wll to high on paper => move insertPointPos
    if (mouseIsPressed && !oneTime && addWall) {
      if (wallArray[wallArray.length - 1].insertPointWall.y < 1450) {
        graph.insertPoint.y = wallArray[0].insertPointWall.y + 250;
      }

      //** Add Wall
      //** (posX, posY, wallNumber)
      wallArray.push(
        new WallElement(
          wallArray[wallArray.length - 1].insertPointWall.x,
          wallArray[wallArray.length - 1].insertPointWall.y -
            wallArray[wallArray.length - 1].h * scaleGeo,
          wallArray.length
        )
      );

      //** Set wall b = lower wall b
      wallArray[wallArray.length - 1].b = wallArray[wallArray.length - 2].b;

      oneTime = true;
    }
  }
  Wall_Delete(pos) {
    if (wallArray.length == 1) return;

    //** Draw wall contour
    let x_left = wallArray[wallArray.length - 1].adjustPoint_Left.x + 20;
    let y_left = wallArray[wallArray.length - 1].adjustPoint_Left.y + 20;
    let w = wallArray[wallArray.length - 1].b * scaleGeo - 40;
    let h = wallArray[wallArray.length - 1].h * scaleGeo - 40;

    push();
    fill(255, 0, 0, 100);
    strokeWeight(2);
    stroke(255, 0, 0, 250);
    rect(x_left, y_left, w, h);

    //** Text
    textAlign(CENTER, CENTER);
    textSize(40);
    fill(0);
    text("Delete Wall", x_left + 0.5 * w, y_left + 0.3 * h);
    pop();

    let deleteWall = false;

    if (x_left < pos.x && pos.x < x_left + w) {
      if (y_left < pos.y && pos.y < y_left + h) {
        deleteWall = true;
      }
    }

    if (mouseIsPressed && !oneTime && deleteWall) {
      //** Delete else value is storede even if upper wall deleted
      wallArray[0].M_local_res_upper = 0;
      wallArray[0].H_local_res_upper = 0;
      wallArray[0].N_local_res_upper = 0;

      //**
      wallArray.splice(wallArray.length - 1, 1);
      oneTime = true;
    }
  }

  Load_Add(pos) {
    this.Highligth_Add();
    this.wallNumberLog = NaN;

    pos = this.MoveInSteps(pos);

    for (let i = 0; i < wallArray.length; i++) {
      //** Test for wall and
      let distToWallTop = abs(pos.y - wallArray[i].adjustPoint_Left.y);
      let distToWallCenter = pos.x - wallArray[i].insertPointWall.x;
      let sign = 1;
      if (distToWallCenter < 0) sign = -1;

      //** LogWall
      if (distToWallTop <= 20) {
        this.wallNumberLog = i;
        pos.y = wallArray[this.wallNumberLog].adjustPoint_Left.y;

        //** Horisontal line
        line(
          pos.x + 5 * sign,
          wallArray[this.wallNumberLog].adjustPoint_Left.y + 50,
          wallArray[this.wallNumberLog].insertPointWall.x - 5 * sign,
          wallArray[this.wallNumberLog].adjustPoint_Left.y + 50
        );

        //** Vertical line
        line(
          pos.x,
          pos.y + 15,
          pos.x,
          wallArray[this.wallNumberLog].adjustPoint_Left.y + 55
        );

        //** Circle
        circle(pos.x, wallArray[this.wallNumberLog].adjustPoint_Left.y + 50, 5);
        circle(
          wallArray[this.wallNumberLog].insertPointWall.x,
          wallArray[this.wallNumberLog].adjustPoint_Left.y + 50,
          5
        );

        //** Text
        push();
        textSize(15);
        textAlign(CENTER);
        text(
          nf(distToWallCenter / 100*scaleGeo_Test, 0, 3) + " m",
          pos.x - 0.5 * distToWallCenter,
          wallArray[this.wallNumberLog].adjustPoint_Left.y + 75
        );
        pop();
      }
    }

    if (
      mouseIsPressed &&
      !oneTime &&
      pos.y > 600 &&
      !isNaN(this.wallNumberLog)
    ) {
      //console.log("LOAD ADDED " + this.wallNumberLog )

      wallArray[this.wallNumberLog].loadVertical_Array.push(
        new LoadVertical(
          pos.x,
          wallArray[this.wallNumberLog].adjustPoint_Left.y,
          wallArray[this.wallNumberLog].loadVertical_Array.length //** loadCase
        )
      );
      oneTime = true;

      //** SORT (so that mesure is ok)
      this.BubbleSortLoad(wallArray[this.wallNumberLog].loadVertical_Array);
    }

    push();
    //** Arrow
    strokeWeight(4);
    translate(pos.x, pos.y);
    line(0, -25, 0, -45);
    fill(0);
    triangle(0, -15, -6, -25, 6, -25);
    strokeWeight(1);
    noFill();
    circle(0, 0, 15);
    pop();

    //** Load Sort (so mesure is OK)
  }
  Load_Delete(pos) {
    this.wallNumberLog = NaN;
    this.loadNumberLog = NaN;

    //** Log wall number
    for (let i = 0; i < wallArray.length; i++) {
      //** Test for wall and
      let distToWallTop = abs(pos.y - wallArray[i].adjustPoint_Left.y);
      if (distToWallTop <= 10) this.wallNumberLog = i;
    }

    //** Log Load number
    if (pos.y > 600 && !isNaN(this.wallNumberLog)) {
      //** do not delete i=0 (correspond to G)
      for (
        let i = 1;
        i < wallArray[this.wallNumberLog].loadVertical_Array.length;
        i++
      ) {
        let distToLoad = abs(
          pos.x -
            wallArray[this.wallNumberLog].loadVertical_Array[i].ip_Load_N.x
        );
        if (distToLoad < 15) {
          this.loadNumberLog = i;
        }
      }
    }

    this.Highligth_Delete();

    //** Delete Load
    if (mouseIsPressed && !oneTime && !isNaN(this.loadNumberLog)) {
      wallArray[this.wallNumberLog].loadVertical_Array.splice(
        this.loadNumberLog,
        1
      );
      oneTime = true;
    }
  }

  Highligth_Add() {
    push();
    for (let i = 0; i < wallArray.length; i++) {
      stroke(0, 255, 0, 100);
      strokeWeight(20);
      line(
        wallArray[i].adjustPoint_Left.x,
        wallArray[i].adjustPoint_Left.y,
        wallArray[i].adjustPoint_Right.x,
        wallArray[i].adjustPoint_Right.y
      );
    }
    pop();
  }
  Highligth_Delete() {
    push();
    noStroke();
    fill(255, 0, 0, 100);
    //** HighLigth all loadPoints
    for (let i = 0; i < wallArray.length; i++) {
      for (let j = 1; j < wallArray[i].loadVertical_Array.length; j++) {
        circle(
          wallArray[i].loadVertical_Array[j].ip_Load_N.x,
          wallArray[i].loadVertical_Array[j].ip_Load_N.y,
          30
        );
      }
    }

    //** HighLigth actual loadPoints
    if (!isNaN(this.wallNumberLog) && !isNaN(this.loadNumberLog)) {
      fill(255, 0, 0, 250);

      circle(
        wallArray[this.wallNumberLog].loadVertical_Array[this.loadNumberLog]
          .ip_Load_N.x,
        wallArray[this.wallNumberLog].loadVertical_Array[this.loadNumberLog]
          .ip_Load_N.y,
        20
      );
    }

    pop();
  }

  UpdateLoad() {
    for (let i = 0; i < wallArray.length; i++) {
      for (let j = 0; j < wallArray[i].loadVertical_Array.length; j++) {
        //** control that y-value always on wall top
        wallArray[i].loadVertical_Array[j].ip_Load_N.y =
          wallArray[i].adjustPoint_Left.y;
      }

      for (let j = 0; j < wallArray[i].loadHorisontal_Array.length; j++) {
        //** control that y-value always on wall top
        wallArray[i].loadHorisontal_Array[j].ip_Load_H.x =
          wallArray[i].adjustPoint_Left.x;

        wallArray[i].loadHorisontal_Array[j].ip_Load_H.y =
          wallArray[i].adjustPoint_Left.y;
      }
    }
  }
  UpdateLoadSystem() {
    //** Wall defaultStart
    for (let i = wallArray.length - 1; i > 0; i--) {
      if (i == wallArray.length - 1) {
        wallArray[i].M_local_res_upper = 0;
        wallArray[i].N_local_res_upper = 0;
        wallArray[i].H_local_res_upper = 0;
      }

      //** Set load on top of lower wall [i-1] => lower wall
      wallArray[i - 1].M_local_res_upper = wallArray[i].M_local_res;
      wallArray[i - 1].N_local_res_upper = wallArray[i].N_local_res;
      wallArray[i - 1].H_local_res_upper = wallArray[i].H_local_res;
    }
  }

  //** Adjust wall (b_adjusted) if lower wall is shorter
  AdjustWallWidth() {
    //** Do not test first wall in array (lowest wall)
    for (let i = wallArray.length - 1; i > 0; i--) {
      //** is wall supported
      //** if not supported

      //** RIGHT ADJUST
      if (
        wallArray[i].adjustPoint_Right.x > wallArray[i - 1].adjustPoint_Right.x
      ) {
        wallArray[i].wallSupported_Right = false;
        wallArray[i].b_adjusted_Right =
          ((wallArray[i - 1].adjustPoint_Right.x -
            wallArray[i].adjustPoint_Left.x) /
            100) *
          scaleGeo_Test; //** [m]
        /*
        console.log(
          "changeSystem line 347 - lower wall do not support" +
            wallArray[i].b_adjusted_Right
        );
        */
      }
      //** if supported
      else {
        wallArray[i].b_adjusted_Right = Infinity;
        wallArray[i].wallSupported_Right = true;
      }

      //** LEFT ADJUST
      if (
        wallArray[i].adjustPoint_Left.x < wallArray[i - 1].adjustPoint_Left.x
      ) {
        wallArray[i].wallSupported_Left = false;
        wallArray[i].b_adjusted_Left =
          ((wallArray[i - 1].adjustPoint_Left.x -
            wallArray[i].adjustPoint_Right.x) /
            100) *
          scaleGeo_Test; //** [m]
        // console.log("changeSystem line 28 - lower wall do not support" + wallArray[i].b_adjusted_Right)
      }
      //** if supported
      else {
        wallArray[i].b_adjusted_Left = Infinity;
        wallArray[i].wallSupported_Left = true;
      }
    }

    //** Set condition for wall[0]
    wallArray[0].b_adjusted_Left = wallArray[0].b_scaled; //*scaleGeo_Test;
    wallArray[0].b_adjusted_Right = wallArray[0].b_scaled; //*scaleGeo_Test;

    wallArray[0].distToLowerWall_Left = 0;
    wallArray[0].distToLowerWall_Right = 0;
  }

  SetWallMesures() {
    for (let i = wallArray.length - 1; i >= 0; i--) {
      if (i > 0) {
        //** Set wall on top of eachother
        wallArray[i].insertPointWall.y =
          wallArray[i - 1].insertPointWall.y - wallArray[i - 1].h * scaleGeo;

        //** Set dist from lower wall [i-1] edges to upper wall [i] edges
        wallArray[i - 1].distToUpperWall_Left =
          (wallArray[i].adjustPoint_Left.x -
            wallArray[i - 1].adjustPoint_Left.x) /
          scaleGeo;
        wallArray[i - 1].distToUpperWall_Right =
          (wallArray[i].adjustPoint_Right.x -
            wallArray[i - 1].adjustPoint_Right.x) /
          scaleGeo;

        //** Set dist from wall [i] edges to lower wall [i-1] edges ****
        //** a < 0 if lower wall Left Edge to the Left.
        //** a > 0 if lower wall Left Edge to the Right.
        wallArray[i].distToLowerWall_Left =
          (wallArray[i - 1].adjustPoint_Left.x -
            wallArray[i].adjustPoint_Left.x) /
          scaleGeo;

        //** a < 0 if lower wall Rigth Edge to the Left.
        //** a > 0 if lower wall Right Edge to the Right.
        wallArray[i].distToLowerWall_Right =
          (wallArray[i - 1].adjustPoint_Right.x -
            wallArray[i].adjustPoint_Right.x) /
          scaleGeo;

        //** Set dist form center to center in x
        wallArray[i].distCenterCenterLowerWall =
          (wallArray[i].center.x - wallArray[i - 1].center.x) / scaleGeo;
        wallArray[i - 1].distCenterCenterUpperWall =
          (wallArray[i - 1].center.x - wallArray[i].center.x) / scaleGeo;
      }
    }
  }

  MoveInSteps(pos) {
    //**pos in multioplum of stepChange
    //console.log("Before: " + pos)
    pos.x = round(pos.x / stepChange) * stepChange;
    pos.y = round(pos.y / stepChange) * stepChange;
    //console.log("After: " + pos)
    return pos;
  }

  //**Sort loadPoints or loadLines if one is deleted
  //**Called from sketch
  BubbleSortLoad(array) {
    //console.log(array)
    for (let i = array.length - 1; i > 1; i--) {
      for (let j = 1; j < i; j++) {
        //console.log("*** " +array[j].loadCase)
        if (array[j].ip_Load_N.x > array[j + 1].ip_Load_N.x) {
          // swap
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }

    //**Redefine loadCaseNumber
    for (let i = 0; i < array.length; i++) {
      //array[i].loadCaseNumber = i;
      //console.log(array[i].loadCaseNumber)
    }
  }
}
