class Graph {
  constructor() {
    this.insertPoint = new p5.Vector(500, 1650);

    this.leftLimit = Infinity;
    this.rightLimit = 0;

    // this.h_total = 0;
    this.hightSum = 0;
  }

  Display() {
    push();
    noFill();
    circle(this.insertPoint.x, this.insertPoint.y, 40);
    pop();
  }
  Update() {
    this.rightLimit = 0;
    this.leftLimit = Infinity;
    this.h_total = 0;

    for (let i = 0; i < wallArray.length; i++) {
      if (wallArray[i].adjustPoint_Right.x > this.rightLimit)
        this.rightLimit = wallArray[i].adjustPoint_Right.x;
      this.h_total += wallArray[i].h;
    }

    for (let i = 0; i < wallArray.length; i++) {
      if (wallArray[i].adjustPoint_Left.x > this.leftLimit) continue;
      this.leftLimit = wallArray[i].adjustPoint_Left.x;
    }
  }

  OverlapInsertPoint(pos) {
    let distPoint = dist(pos.x, pos.y, this.insertPoint.x, this.insertPoint.y);

    if (distPoint < 20) {
      this.Highlight(this.insertPoint);
      if (mouseIsPressed) this.logInserPointGraph = true;
    }

    if (mouseIsPressed && this.logInserPointGraph)
      this.AdjustInsertPoint(this.MoveInSteps(pos));
  }
  AdjustInsertPoint(pos) {
    //this.insertPoint.x = pos.x;
    this.insertPoint.y = pos.y;
  }

  DisplayWallDimensions() {
    
    //** Mesure lines below figure
    push();
    strokeWeight(2);

    this.hightSum = 0;

    for (let i = 0; i < wallArray.length; i++) {
      //** Vertical
      let yStart = wallArray[i].insertPointWall.y;
      let yEnd = wallArray[i].adjustPoint_Left.y;
      //let x = this.leftLimit - 150;
      let x = this.insertPoint.x + 150;

      //** Horisontal
      let xStart = wallArray[i].adjustPoint_Left.x - 5;
      let xEnd = wallArray[i].adjustPoint_Right.x + 5;
      let y = wallArray[0].insertPointWall.y + 200 + 75 * i;

      //** Horisontal
      strokeWeight(6);
      stroke(100, 100, 100, 200);
      line(xStart, y, xEnd, y);
      stroke(0);
      strokeWeight(1);
      fill(0);
      circle(xStart + 5, y, 5);
      circle(xEnd - 5, y, 5);
      //noStroke();

      //** mesureLine left of wall
      if (wallArray[i].adjustPoint_Left.x > this.leftLimit) {
        circle(this.leftLimit, y, 5);
        strokeWeight(1);
        line(this.leftLimit - 5, y, xStart, y);

        let a = (wallArray[i].adjustPoint_Left.x - this.leftLimit);
        textSize(20);
        textAlign(RIGHT, CENTER);
        noStroke();
        text(nf(a * scaleGeo_Test/100, 0, 3) + " m", this.leftLimit - 10, y + 20);
        stroke(0);
      }
      if (wallArray[i].adjustPoint_Right.x < this.rightLimit) {
        strokeWeight(1);
        circle(this.rightLimit, y, 5);
        strokeWeight(1);
        line(this.rightLimit + 5, y, xStart, y);

        let a = (this.rightLimit - wallArray[i].adjustPoint_Right.x);
        textSize(20);
        textAlign(LEFT, CENTER);
        noStroke();
        text(nf(a * scaleGeo_Test/100, 0, 3) + " m", this.rightLimit + 10, y + 20);
      }

      //** mesureLine right of wall
      textSize(20);

      noStroke();
      textAlign(LEFT, CENTER);
      text(nf(wallArray[i].b*scaleGeo_Test, 0, 3) + " m", xStart + 10, y + 20);

      textSize(25);
      textAlign(LEFT, CENTER);
      text("wall " + i, this.rightLimit + 100, y);

      //** Vertical
      stroke(0);
      strokeWeight(2);
      line(x - 150, yStart, x - 150, yEnd);
      circle(x - 150, yStart, 5);
      circle(x - 150, yEnd, 5);

      textSize(20);
      noStroke();
      textAlign(CENTER, CENTER);

      //** Rotate hight value ** Start
      push();
      rotate(-PI / 2);
      translate(
        -yStart + 0.5 * wallArray[i].h * scaleGeo,
        this.insertPoint.x - 15
      );
      text(nf(wallArray[i].h*scaleGeo_Test, 0, 3) + " m", 0, 0);
      translate(-this.insertPoint.x, -this.insertPoint.y);
      pop();
      //** Rotate hight value ** End

      //** Niveau Mesure
      push();
      stroke(0);
      strokeWeight(1);
      this.hightSum += wallArray[i].h;
      let h = graph.insertPoint.y - this.hightSum * scaleGeo;
      line(graph.insertPoint.x - 200, h, graph.insertPoint.x + 25, h);

      translate(graph.insertPoint.x - 180, h - 2);
      noStroke();
      triangle(0, 0, -15, -15, 15, -15);
      textSize(20);

      textAlign(LEFT, CENTER);
      text(nf(this.hightSum*scaleGeo_Test, 0, 3) + " m", -20, -30);
      pop();

      //** Niveau 0.000 m
      if (i == 0) {
        push();
        stroke(0);
        strokeWeight(1);
        translate(graph.insertPoint.x - 180, graph.insertPoint.y);
        line(-20, 0, +425, 0);

        noStroke();
        triangle(0, -2, -15, -17, 15, -17);
        textSize(20);

        textAlign(LEFT, CENTER);
        text(nf(0, 0, 3) + " m", -20, -30);
        pop();
      }

      //** WallName & Thickness in WallElement.DisplayWall()
    }
    pop();
  }
  DisplayReactionOnWallMesureLines() {
    //** Reaction on wall mesure Lines
    if (button_DisplayReactions.state == 1) {
      for (let i = 0; i < wallArray.length; i++) {
        //** Skip mesure line if...
        if (wallArray[i].wallFailiure) continue;

        
        push();
        let centerReaction = 0;

        //** Stabil
        centerReaction =
          wallArray[i].adjustPoint_Left.x + wallArray[i].e_local_res * 100 /scaleGeo_Test;
    
        
        if (wallArray[i].inStabil_Left)
          centerReaction =
            wallArray[i].adjustPoint_Left.x -
            wallArray[i].e_local_sum * 100/scaleGeo_Test;

        if (wallArray[i].inStabil_Right) {
          centerReaction =
            wallArray[i].adjustPoint_Left.x +
            wallArray[i].e_local_sum * 100/scaleGeo_Test ;
        }
        

        //console.log("Graph line 208 centerReaction " + wallArray[i].e_local_sum)
        let xStart = centerReaction - 0.5 * wallArray[i].b_eff * 100/scaleGeo_Test ;
        let xEnd = centerReaction + 0.5 * wallArray[i].b_eff * 100/scaleGeo_Test ;
        let y = wallArray[0].insertPointWall.y + 200 + 75 * i;

        stroke(0, 0, 255, 200);
        strokeWeight(8);
        line(xStart, y, xEnd, y);

        noStroke();
        textSize(15);
        textAlign(RIGHT, CENTER);
        fill(0, 0, 255);
        text(nf(round(wallArray[i].b_eff, 3), 0, 3) + " m", xEnd, y - 15);
        fill(0, 0, 255, 200);
        if (wallArray[i].anchorForce > 0)
          circle(wallArray[i].anchor_left.x, y, 15);

        pop();
      }
      

      //** FAILIURE ** START
      for (let i = 0; i < wallArray.length; i++) {
        push();
        let y = wallArray[0].insertPointWall.y + 200 + 75 * i;
        if (wallArray[i].wallFailiure) {
          stroke(255, 0, 0, 200);
          strokeWeight(8);
          line(
            wallArray[i].adjustPoint_Left.x,
            y,
            wallArray[i].adjustPoint_Right.x,
            y
          );
        }
        pop();
      }
      //** FAILIURE ** END
    }
  }

  DisplaySumForces() {
    for (let i = 0; i < wallArray.length; i++) {
      //** ArrowsForces
      //** Reaction RED
      push();
      strokeWeight(3);

      translate(
        wallArray[i].adjustPoint_Left.x + wallArray[i].e_local_res *100/scaleGeo_Test,
        wallArray[i].insertPointWall.y
      );

      //** Arrow Vertical
      stroke(255, 0, 0);
      line(0, -22, 0, -50);
      fill(255, 0, 0, 100);
      triangle(0, -12, -6, -22, 6, -22);
      if (wallArray[i].H_local_res > 0) {
        //** Arrow Horisontal
        line(-25, -6, 15, -6);
        fill(255, 0, 0, 100);
        triangle(15, -6, 25, -6, 15, -12);
      }

      if (wallArray[i].H_local_res < 0) {
        //** Arrow Horisontal
        line(-15, -6, 25, -6);
        fill(255, 0, 0, 100);
        triangle(-15, -6, -25, -6, -15, -12);
      }
      pop();

      //** Text
      push();
      noStroke();
      fill(255, 0, 0);
      textAlign(LEFT, CENTER);
      textSize(20);
      let x = this.rightLimit + 150;
      let y = wallArray[i].insertPointWall.y;

      text("M", x, y - 50);
      text("N", x, y - 30);
      text("H", x, y - 10);
      text("e", x + 235, y - 40);
      text("\u21D2", x + 200, y - 40);

      textSize(15);
      text("\u23AC", x + 180, y - 27.5);
      textSize(20);

      text("=", x + 35, y - 50);
      text("=", x + 35, y - 30);
      text("=", x + 35, y - 10);
      text("=", x + 260, y - 40);

      text("kNm", x + 135, y - 50);
      text("kN", x + 135, y - 30);
      text("kN", x + 135, y - 10);
      text("m", x + 340, y - 40);

      textAlign(RIGHT, CENTER);
      text(nf(round(wallArray[i].M_local_res, 2), 0, 2), x + 125, y - 50);
      text(nf(round(wallArray[i].N_local_res, 2), 0, 2), x + 125, y - 30);
      text(nf(round(wallArray[i].H_local_res, 2), 0, 2), x + 125, y - 10);
      text(nf(round(wallArray[i].e_local_res, 3), 0, 3), x + 330, y - 40);

      textSize(15);
      text("A", x + 28, y - 45);
      text("A", x + 28, y - 25);
      text("A", x + 28, y - 5);
      text("A", x + 258, y - 30);

      //** Mark point A (M,N,H,e with respect to A)
      let x1Start =
        wallArray[i].insertPointWall.x - 0.5 * wallArray[i].b * scaleGeo;
      let y1 = wallArray[i].insertPointWall.y;
      textAlign(RIGHT, CENTER);
      textSize(20);
      noStroke();
      text("A", x1Start - 7, y1 - 10);

      circle(x1Start, y1, 7);

      pop();
    }
  }
  DisplaySumForcesMesure() {
    //** MesureLine o
    push();
    stroke(255, 0, 0);
    line(
      this.leftLimit,
      wallArray[0].insertPointWall.y,
      this.leftLimit,
      wallArray[0].insertPointWall.y - this.h_total * 100
    );
    pop();

    //** MesureLine
    textSize(15);
    for (let i = 0; i < wallArray.length; i++) {
      push();
      fill(255, 0, 0);

      let x1Start = 0;
      let x1End = 0;
      let y1 = wallArray[i].insertPointWall.y;

      let sign = 1;

      //** e_res if >= 0
      if (wallArray[i].e_local_res >= 0) {
        x1Start =
          wallArray[i].insertPointWall.x - 0.5 * wallArray[i].b * 100;
        x1End = x1Start + wallArray[i].e_local_res * 100/scaleGeo_Test;

        textAlign(RIGHT, CENTER);
        text(
          nf(round(abs(wallArray[i].e_local_res), 3), 0, 3) + " m",
          x1Start - 10,
          y1 - 65
        );
      }

      //** e_res if < 0
      if (wallArray[i].e_local_res < 0) {
        x1Start =
          wallArray[i].insertPointWall.x - 0.5 * wallArray[i].b * 100;
        x1End = x1Start + wallArray[i].e_local_res * 100/scaleGeo_Test;
        sign = -1;
        textAlign(RIGHT, CENTER);
        text(
          nf(round(abs(wallArray[i].e_local_res), 3), 0, 3) + " m",
          x1End - 10,
          y1 - 65
        );
      }

      stroke(255, 0, 0);
      line(x1Start - 5 * sign, y1 - 65, x1End + 5 * sign, y1 - 65); //** Horisontal
      line(x1End, y1 - 70, x1End, y1 - 50); //** Vertical

      circle(x1Start, y1 - 65, 5);
      circle(x1End, y1 - 65, 5);

      //** MesureLine left
      if (x1Start > this.leftLimit) {
        let a = nf(round((x1Start - this.leftLimit) / 100*scaleGeo_Test, 3), 0, 3);
        circle(this.leftLimit, y1 - 85, 5);
        circle(x1Start, y1 - 85, 5);
        line(this.leftLimit - 5, y1 - 85, x1Start + 5, y1 - 85);
        noStroke();
        textAlign(RIGHT, CENTER);
        text(a + " m", this.leftLimit - 15, y1 - 85);
      }

      pop();
    }
  }

  ResultForceInPoint(pos) {
    this.M_mousePos = 0;
    this.N_mousePos = 0;
    this.H_mousePos = 0;
    for (let wall = wallArray.length - 1; wall >= 0; wall--) {
      if (pos.y > wallArray[wall].adjustPoint_Left.y) {
        
        
        for (let N = 0; N < wallArray[wall].loadVertical_Array.length; N++) {
          let distToLoad_x =
            (wallArray[wall].loadVertical_Array[N].ip_Load_N.x - pos.x)*scaleGeo_Test;
          let loadValue = wallArray[wall].loadVertical_Array[N].value_load_N;
          //let posToLoad_y = wallArray[wall].loadVertical_Array[N].ip_Load_N.y-pos.y;
          this.M_mousePos += (distToLoad_x / scaleGeo) * loadValue;
          this.N_mousePos += loadValue;
        }
        

        
        for (let H = 0; H < wallArray[wall].loadHorisontal_Array.length; H++) {
          let distToLoad_y =
            (pos.y - wallArray[wall].loadHorisontal_Array[H].ip_Load_H.y)*scaleGeo_Test;
          let loadValue = wallArray[wall].loadHorisontal_Array[H].value_load_H;
          //let posToLoad_y = wallArray[wall].loadVertical_Array[N].ip_Load_N.y-pos.y;
          this.M_mousePos += (distToLoad_y / scaleGeo) * loadValue;
          this.H_mousePos += loadValue;
        }
        
        
      }
    }
    
          //** Niveau Mesure
      push();
      stroke(255,0,0);
      strokeWeight(1);
      //this.hightSum += wallArray[i].h;
      let h = (graph.insertPoint.y - pos.y)/100*scaleGeo_Test;
      line(pos.x - 75, pos.y, pos.x + 25, pos.y);
    line(pos.x,pos.y-20,pos.x,pos.y+20);
    noFill();
    circle(pos.x,pos.y,20);
    fill(255,0,0);

      translate(pos.x-55, pos.y -2);
      noStroke();
      triangle(0, 0, -15, -15, 15, -15);
      textSize(20);

      textAlign(LEFT, CENTER);
      text(nf(h, 0, 3) + " m", -20, -30);
      pop();
    
    //** Text
    push();
    textSize(20);
    fill(255,0,0);
    textAlign(RIGHT, CENTER);
    text(nf(this.M_mousePos, 0, 2), pos.x + 150, pos.y - 50);
    text(nf(this.N_mousePos, 0, 2), pos.x + 150, pos.y - 30);
    text(nf(this.H_mousePos, 0, 2), pos.x + 150, pos.y - 10);

    textAlign(LEFT, CENTER);
    text("M", pos.x + 25, pos.y - 50);
    text("N", pos.x + 25, pos.y - 30);
    text("H", pos.x + 25, pos.y - 10);

    textAlign(LEFT, CENTER);
    text("=", pos.x + 60, pos.y - 50);
    text("=", pos.x + 60, pos.y - 30);
    text("=", pos.x + 60, pos.y - 10);

    textAlign(LEFT, CENTER);
    text("kNm", pos.x + 160, pos.y - 50);
    text("kN", pos.x + 160, pos.y - 30);
    text("kN", pos.x + 160, pos.y - 10);

    textSize(15);
    text("o", pos.x + 44, pos.y - 45);
    text("o", pos.x + 44, pos.y - 25);
    text("o", pos.x + 44, pos.y - 5);
    pop();
  }

  Highlight(pos) {
    push();
    noStroke();
    fill(100, 100, 100, 100);
    if (mouseIsPressed) fill(0, 255, 0, 100);
    circle(pos.x, pos.y, 40);
    pop();
  }

  MoveInSteps(pos) {
    //**pos in multioplum of stepChange
    //console.log("Before: " + pos)
    
    pos.x = round(pos.x / stepChange) * stepChange;
    pos.y = round(pos.y / stepChange) * stepChange;
    //console.log("After: " + pos)
    return pos;
  }
}
