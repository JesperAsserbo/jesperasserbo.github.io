//** METHODS

//** 0 **
//** DisplayElements(elements,pos) incl. nodenumbers
//** DisplayElementsReinforced(array)
//** OverlapGraphGeoPos(pos)
//** GraphMoveGeo(pos)

//** 1 **
//** OverlapGraphDefPos(pos)
//** GraphMoveDef(pos)
//** DisplayElementsDef(elements)
//** DisplayElementsDefReinforced(elements)
//** DisplayDefValues(elements)
//** DisplayDefValuesReinforced(array)

//** 2 **
//** OverlapGraphMomentPos(pos)
//** GraphMoveMoment(pos)
//** DisplayMoment(elements, pos)
//** DisplayMomentReinforced(array, supports, pos)
//** DisplayMomentSum(array_1,array_2)
//** DisplayMomentValues(elements)
//** DisplayMomentValuesReinforced(array)

//** 3 **
//** OverlapGraphShearPos(pos)
//** OverlapGraphShearReinforcedPos(pos)
//** GraphMoveShear(pos)
//** GraphMoveShearReinforced(pos)
//** DisplayShearSum(array_1,array_2)
//** DisplayShear(elements, pos)
//** DisplayShearReinforced(array, supports, pos)
//** DisplayShearValues(elements)
//** DisplayShearValuesReinforced(array)

//** 4 **
//** ScaleMesure(elements, insertPoint)
//** ScaleMesureGeo(pos)

//** 5 **
//** DisplayReactions(supports)
//** DisplaySupports(supports)
//** DisplayLoads(loads)
//** DisplayLoadLines(loadLines)
//** DisplayLoadMoments()
//** DisplayCharniers(elements)

//** 6 **
//** DisplayMesure(elements, supports);
//** GraphMoveSteps(pos);

//** 7 **
//** OverlapGraphConnectionPos(pos)
//** GraphMoveConnection(pos)
//** DisplayConnections(array)

class Graph {
  constructor() {
    this.insertGeo = new p5.Vector(400, 1400);
    this.insertDef = new p5.Vector(400, 1800);
    this.insertMoment = new p5.Vector(400, 2050);
    this.insertShear = new p5.Vector(400, 2300);

    this.insertShearReinforced = new p5.Vector(400, 2550);
    this.insertConnection = new p5.Vector(400, 2800);

    this.overlapDiameter = 75;

    this.moveMomentActive = false;
    this.moveShearActive = false;
    this.moveDefActive = false;
    this.moveGeoActive = false;
    this.moveConnectionActive = false;

    this.moveShearReinforcedActive = false;

    this.moveMomentLocked = false;
    this.moveShearLocked = false;
    this.moveDefLocked = false;
    this.moveGeoLocked = false;
    this.moveConnectionLocked = false;

    this.moveShearReinforcedLocked = false;

    this.scaleMoment = 1;
    this.scaleShear = 1;
    this.scaleDef = 1;

    //this.scaleGeo = 1; //**scaleLength ButtonRollor

    this.elementsLength;

    this.axisStrokeWeight = 2;
  }
  //**********************************
  //** 0 *****************************
  //**********************************
  DisplayElements(elements, pos) {
    //**
    this.elementsLength = elements.length;

    //**Name
    push();
    noFill();
    stroke(50);
    strokeWeight(1);
    circle(300, this.insertGeo.y, 50);

    textAlign(CENTER, CENTER);
    textSize(35);
    fill(50);

    text("", 300, this.insertGeo.y);
    line(
      this.insertGeo.x + 75,
      this.insertGeo.y,
      this.insertGeo.x - 75,
      this.insertGeo.y
    );
    pop();

    //****** MoveGraph Geo ******
    //**Variable to lock graph to mousePos
    //**Variable reset when mouseReleased in function mouseReleased in sketch
    if (this.OverlapGraphGeoPos(pos) && mouseIsPressed)
      this.moveGeoLocked = true;

    if (this.moveGeoLocked) {
      if (
        this.moveShearActive == false &&
        this.moveDefActive == false &&
        this.moveMomentActive == false &&
        this.moveConnectionActive == false
      ) {
        this.GraphMoveGeo(pos);
        this.moveGeoActive = true;
      }
    }

    for (let i = 0, length = elements.length; i < length; i++) {
      /*
      //console.log(this.scaleGeo)
      let tempStart = new p5.Vector();
      let tempEnd = new p5.Vector();
     
      tempStart = elements[i].startPos.copy();
      tempEnd = elements[i].endPos.copy();
      
      elements[i].startPos.x = tempStart.x*this.scaleGeo;
      elements[i].endPos.x = tempEnd.x*this.scaleGeo;
      //this.scaleGeo = 1;
      */

      elements[i].Display();
      elements[i].startPos.y = this.insertGeo.y;
      elements[i].endPos.y = this.insertGeo.y;

      //**Plot nodeNumber
      push();
      //fill(0)
      textSize(22);
      text(
        elements[i].startNodeId,
        elements[i].startPos.x + 15,
        elements[i].startPos.y + 25
      );
      if (i == length - 1)
        text(
          elements[i].endNodeId,
          elements[i].endPos.x + 15,
          elements[i].endPos.y + 25
        );
      //text(this.endNodeId, this.endPos.x - 20, this.endPos.y + 25);
      pop();
    }

    elements = [];
  }
  DisplayElementsReinforced(array) {
    if (button_BeamReinforced.state == -1) return;

    let startNode = changeSystem.startNodeReinforced;
    let endNode = changeSystem.endNodeReinforced;

    for (let i = startNode; i < endNode; i++) {
      array[i].DisplayReinforced();
    }
  }
  OverlapGraphGeoPos(pos) {
    //**GrapGeometry
    let distGeo = dist(pos.x, pos.y, this.insertGeo.x - 100, this.insertGeo.y);
    if (distGeo < this.overlapDiameter) {
      push();
      fill(100, 100, 100, 100);
      circle(this.insertGeo.x - 100, this.insertGeo.y, 50);
      pop();
      return true;
    }
    return false;
  }
  GraphMoveGeo(pos) {
    push();
    fill(0, 255, 0, 100);
    circle(this.insertGeo.x - 100, this.insertGeo.y, 50);

    pos = this.GraphMoveSteps(pos);
    this.insertGeo.y = pos.y;

    //if (this.insertGeo.y - pos.y > 0) this.insertGeo.y -= 10;
    //if (this.insertGeo.y - pos.y < 0) this.insertGeo.y += 10;

    pop();
  }
  //**********************************
  //** 1 *****************************
  //**********************************
  OverlapGraphDefPos(pos) {
    //**GrapGeometry
    let distDef = dist(pos.x, pos.y, this.insertDef.x - 100, this.insertDef.y);
    if (distDef < this.overlapDiameter) {
      push();
      fill(100, 100, 100, 100);
      circle(this.insertDef.x - 100, this.insertDef.y, 50);
      pop();
      return true;
    }
    return false;
  }
  GraphMoveDef(pos) {
    push();
    fill(0, 255, 0, 100);
    circle(this.insertDef.x - 100, this.insertDef.y, 50);

    pos = this.GraphMoveSteps(pos);
    this.insertDef.y = pos.y;

    //if (this.insertDef.y - pos.y > 0) this.insertDef.y -= 10;
    //if (this.insertDef.y - pos.y < 0) this.insertDef.y += 10;

    pop();
  }
  DisplayElementsDef(array, supports, pos) {
    //**ElementsDef
    for (let i = 0, length = array.length; i < length; i++) {
      for (
        let j = 0, length2 = array[i].elementDef.length;
        j < length2 - 1;
        j++
      ) {
        line(
          array[i].startPos.x + array[i].elementDef[j * 2] / 10,
          this.insertDef.y +
            (array[i].elementDef[j * 2 + 1] * 100) / this.scaleDef,
          array[i].startPos.x + array[i].elementDef[j * 2 + 2] / 10,
          this.insertDef.y +
            (array[i].elementDef[j * 2 + 3] * 100) / this.scaleDef
        );
      }
      //console.log(elements[i].elementDef[1] )
    }

    //**Name
    push();
    textSize(20);
    text("[mm]", 335, this.insertDef.y - 10);

    noFill();
    stroke(0);
    strokeWeight(1);

    circle(300, this.insertDef.y, 50);

    textAlign(CENTER, CENTER);
    textSize(35);
    fill(50);

    text("u", 300, this.insertDef.y);
    line(
      this.insertDef.x + 75,
      this.insertDef.y,
      this.insertDef.x - 75,
      this.insertDef.y
    );

    //**Axis
    stroke(0);
    strokeWeight(this.axisStrokeWeight);
    line(
      array[0].startPos.x - 5,
      this.insertDef.y,
      array[array.length - 1].endPos.x + 10,
      this.insertDef.y
    );
    pop();

    //**Mark supports on graph
    for (let i = 0, length = supports.length; i < length; i++) {
      push();
      fill(0);
      circle(
        supports[i].posSupport.x,
        this.insertDef.y + (supports[i].posSupportDef.y / this.scaleDef) * 100,
        8
      );
      pop();
    }

    //**Mark charniers on graph.... elements[i].elementDef.push(x, ux);
    for (let i = 0, length = elements.length; i < length; i++) {
      if (elements[i].charnierLeft == true) {
        push();
        strokeWeight(2);
        stroke(0);
        //fill(255, 255, 255);
        circle(
          array[i].startPos.x,
          this.insertDef.y +
            (array[i].elementDef[(0, 1)] * 100) / this.scaleDef,
          10
        );
        pop();
      }
    }

    //****** MoveGraph DEF ******
    //**Variable to lock graph to mousePos
    //**Variable reset when mouseReleased in function mouseReleased in sketch
    if (this.OverlapGraphDefPos(pos) && mouseIsPressed)
      this.moveDefLocked = true;

    if (this.moveDefLocked) {
      if (
        this.moveShearActive == false &&
        this.moveGeoActive == false &&
        this.moveMomentActive == false &&
        this.moveShearReinforcedActive == false &&
        this.moveConnectionActive == false
      ) {
        this.GraphMoveDef(pos);
        this.moveDefActive = true;
      }
    }

    if (supports.length > 0) this.DisplayDefValues(array);

    //**ScaleMesure
    this.ScaleMesure(array, this.insertDef);

    //** Reset elementDef
    for (let i = 0, length = array.length; i < length; i++)
      array[i].elementDef = [];
  }
  DisplayElementsDefReinforced(array, supports, pos) {
    if (button_BeamReinforced.state == -1) return;

    let startNode = changeSystem.startNodeReinforced;
    let endNode = changeSystem.endNodeReinforced;

    //**Def
    push();
    stroke(0, 0, 255, 200);
    strokeWeight(3);
    for (let i = startNode; i < endNode; i++) {
      for (
        let j = 0, length2 = array[i].elementDef.length;
        j < length2 - 1;
        j++
      ) {
        line(
          array[i].startPos.x + array[i].elementDef[j * 2] / 10,
          this.insertDef.y +
            (array[i].elementDef[j * 2 + 1] * 100) / this.scaleDef,
          array[i].startPos.x + array[i].elementDef[j * 2 + 2] / 10,
          this.insertDef.y +
            (array[i].elementDef[j * 2 + 3] * 100) / this.scaleDef
        );

        //** Point/bolt in

        fill(0, 0, 255, 50);
        //** bolt
        if (j == 0 && bolts[i].exist == 1) {
          circle(
            array[i].startPos.x + array[i].elementDef[j * 2] / 10,
            this.insertDef.y +
              (array[i].elementDef[j * 2 + 1] * 100) / this.scaleDef,
            5
          );
        }
        //** last bolt
        if (j == (length2 - 2) / 2 && i == endNode - 1) {
          circle(
            array[i].startPos.x + array[i].elementDef[j * 2] / 10,
            this.insertDef.y +
              (array[i].elementDef[j * 2 + 1] * 100) / this.scaleDef,
            5
          );
        }
      }
      //console.log(elements[i].elementDef[1] )
    }
    pop();

    //**Mark supports on graph
    for (let i = 0, length = supports.length; i < length; i++) {
      push();
      fill(0);
      circle(
        supports[i].posSupport.x,
        this.insertDef.y + (supports[i].posSupportDef.y / this.scaleDef) * 100,
        8
      );
      pop();
    }

    //**Mark charniers on graph.... elements[i].elementDef.push(x, ux);
    for (let i = 0, length = array.length; i < length; i++) {
      if (array[i].charnierLeft == true) {
        push();
        strokeWeight(2);
        stroke(0);
        //fill(255, 255, 255);
        circle(
          array[i].startPos.x,
          this.insertDef.y +
            (array[i].elementDef[(0, 1)] * 100) / this.scaleDef,
          10
        );
        pop();
      }
    }

    //****** MoveGraph DEF ******
    //**Variable to lock graph to mousePos
    //**Variable reset when mouseReleased in function mouseReleased in sketch
    if (this.OverlapGraphDefPos(pos) && mouseIsPressed)
      this.moveDefLocked = true;

    if (this.moveDefLocked) {
      if (
        this.moveShearActive == false &&
        this.moveGeoActive == false &&
        this.moveMomentActive == false &&
        this.moveConnectionActive == false
      ) {
        this.GraphMoveDef(pos);
        this.moveDefActive = true;
      }
    }

    if (supports.length > 0) this.DisplayDefValuesReinforced(array);

    //**ScaleMesure
    //this.ScaleMesure(array, this.insertDef);

    //** Reset elementDef
    for (let i = 0, length = array.length; i < length; i++)
      array[i].elementDef = [];
  }
  DisplayDefValues(elements) {
    //**Find min/max

    let max = 0;
    let min = Infinity;

    for (let i = 0, length_1 = elements.length; i < length_1; i++) {
      for (
        let j = 1, length_2 = elements[i].elementDef.length;
        j < length_2;
        j += 2
      ) {
        if (elements[i].elementDef[j] > max) max = elements[i].elementDef[j];
        if (elements[i].elementDef[j] < min) min = elements[i].elementDef[j];
      }
    }

    min = nf(round(min / 1, 2), 0, 2);
    max = nf(round(max / 1, 2), 0, 2);

    push();
    textAlign(RIGHT, CENTER);
    textSize(24);
    stroke(0);
    translate(0, this.insertDef.y);
    let start = elements[0].startPos.x;

    if ((max * 100) / this.scaleDef > 25)
      text(max, start - 45, (max * 100) / this.scaleDef);
    else text(max, start - 45, 25);

    if ((min * 100) / this.scaleDef < -25)
      text(min, start - 45, (min * 100) / this.scaleDef);
    else text(min, start - 45, -25);

    stroke(0);
    strokeWeight(this.axisStrokeWeight);
    line(start - 35, -5, start - 35, (max * 100) / this.scaleDef);
    line(start - 35, 5, start - 35, (min * 100) / this.scaleDef);
    pop();
  }
  DisplayDefValuesReinforced(array) {
    //**Find min/max

    let max = 0;
    let min = Infinity;

    for (let i = 0, length_1 = array.length; i < length_1; i++) {
      for (
        let j = 1, length_2 = array[i].elementDef.length;
        j < length_2;
        j += 2
      ) {
        if (array[i].elementDef[j] > max) max = array[i].elementDef[j];
        if (array[i].elementDef[j] < min) min = array[i].elementDef[j];
      }
    }

    min = nf(round(min / 1, 2), 0, 2);
    max = nf(round(max / 1, 2), 0, 2);

    push();
    textAlign(LEFT, CENTER);
    textSize(24);
    stroke(0, 0, 255);
    fill(0, 0, 255);
    translate(0, this.insertDef.y);
    let start = array[array.length - 1].endPos.x;

    if ((max * 100) / this.scaleDef > 25)
      text(max, start + 45, (max * 100) / this.scaleDef);
    else text(max, start + 45, 25);

    if ((min * 100) / this.scaleDef < -25)
      text(min, start + 45, (min * 100) / this.scaleDef);
    else text(min, start + 45, -25);

    stroke(0, 0, 255);
    strokeWeight(this.axisStrokeWeight);
    line(start + 35, -5, start + 35, (max * 100) / this.scaleDef);
    line(start + 35, 5, start + 35, (min * 100) / this.scaleDef);

    stroke(0);
    strokeWeight(1);
    line(start + 25, 0, start + 45, 0);
    pop();
  }
  //**********************************
  //** 2 *****************************
  //**********************************
  OverlapGraphMomentPos(pos) {
    //**GraphMoment
    let distMoment = dist(
      pos.x,
      pos.y,
      this.insertMoment.x - 100,
      this.insertMoment.y
    );
    if (distMoment < this.overlapDiameter) {
      push();
      fill(100, 100, 100, 100);
      circle(this.insertMoment.x - 100, this.insertMoment.y, 50);
      pop();
      return true;
    }
    return false;
  }
  GraphMoveMoment(pos) {
    push();
    fill(0, 255, 0, 100);
    circle(this.insertMoment.x - 100, this.insertMoment.y, 50);

    pos = this.GraphMoveSteps(pos);
    this.insertMoment.y = pos.y;

    //if (this.insertMoment.y - pos.y > 0) this.insertMoment.y -= 10;
    //if (this.insertMoment.y - pos.y < 0) this.insertMoment.y += 10;

    pop();
  }
  DisplayMoment(elements, supports, pos) {
    if (supports.length > 0) {
      for (let i = 0, length = elements.length; i < length; i++) {
        for (
          let j = 0, length2 = elements[i].elementMoment.length;
          j < length2 - 1;
          j++
        ) {
          //console.log("i: " + i + "  J: " + j + " " +elements[i].elementMoment[j * 2] )
          //** elementMoment = [x0,M0,x1,M1,x2,M2.....]
          //** Calculated in class calculation.
          let top0x =
            elements[i].startPos.x + elements[i].elementMoment[j * 2] / 10;
          let top0y = this.insertMoment.y;

          let top1x =
            elements[i].startPos.x + elements[i].elementMoment[j * 2] / 10;
          let top1y =
            this.insertMoment.y +
            elements[i].elementMoment[j * 2 + 1] / 1e4 / this.scaleMoment;

          let top2x =
            elements[i].startPos.x + elements[i].elementMoment[j * 2 + 2] / 10;
          let top2y =
            this.insertMoment.y +
            elements[i].elementMoment[j * 2 + 3] / 1e4 / this.scaleMoment;

          let top3x =
            elements[i].startPos.x + elements[i].elementMoment[j * 2 + 2] / 10;
          let top3y = this.insertMoment.y;

          push();
          strokeWeight(2);
          line(top1x, top1y, top2x, top2y);

          noStroke();
          fill(0, 0, 0, 50);
          quad(top0x, top0y, top1x, top1y, top2x, top2y, top3x, top3y);

          pop();

          push();
          strokeWeight(2);
          //**Vertical line at jump in curve

          let momentEnd =
            elements[i].elementMoment[elements[i].elementMoment.length - 1] /
            1e4 /
            this.scaleMoment;

          //**Dont examine last element
          if (i < elements.length - 1) {
            let momentStartNext =
              elements[i + 1].elementMoment[1] / 1e4 / this.scaleMoment;

            //**If jump in value then draw line
            if (momentEnd != momentStartNext)
              line(
                elements[i].endPos.x,
                this.insertMoment.y + momentEnd,
                elements[i].endPos.x,
                this.insertMoment.y + momentStartNext
              );
          }
          pop();
        }

        //**Vertical line in start and end of beam
        push();
        let momentStartBeam =
          elements[0].elementMoment[1] / 1e4 / this.scaleMoment;
        let momentEndBeam =
          elements[elements.length - 1].elementMoment[
            elements[elements.length - 1].elementMoment.length - 1
          ] /
          1e4 /
          this.scaleMoment;
        strokeWeight(2);
        //**StartBeam
        line(
          elements[0].startPos.x,
          this.insertMoment.y + momentStartBeam,
          elements[0].startPos.x,
          this.insertMoment.y
        );
        //**EndBeam
        line(
          elements[elements.length - 1].endPos.x,
          this.insertMoment.y + momentEndBeam,
          elements[elements.length - 1].endPos.x,
          this.insertMoment.y
        );
        pop();
      }
    }

    //**Name
    push();
    textSize(20);
    text("[kNm]", 335, this.insertMoment.y - 10);

    noFill();
    stroke(0);
    strokeWeight(1);
    circle(300, this.insertMoment.y, 50);

    textAlign(CENTER, CENTER);
    textSize(35);
    fill(50);

    text("M", 300, this.insertMoment.y);
    line(
      this.insertMoment.x + 75,
      this.insertMoment.y,
      this.insertMoment.x - 75,
      this.insertMoment.y
    );

    //**Mark supports on graph
    for (let i = 0, length = supports.length; i < length; i++) {
      circle(supports[i].posSupport.x, this.insertMoment.y, 8);
    }

    //**Axis
    stroke(0);
    strokeWeight(this.axisStrokeWeight);
    line(
      elements[0].startPos.x - 5,
      this.insertMoment.y,
      elements[elements.length - 1].endPos.x + 10,
      this.insertMoment.y
    );
    pop();

    if (supports.length > 0) this.DisplayMomentValues(elements);

    //****** MoveGraph Moment ******
    //**Variable to lock graph to mousePos
    //**Variable reset when mouseReleased in function mouseReleased in sketch
    if (this.OverlapGraphMomentPos(pos) && mouseIsPressed)
      this.moveMomentLocked = true;

    if (this.moveMomentLocked) {
      if (
        this.moveShearActive == false &&
        this.moveDefActive == false &&
        this.moveGeoActive == false &&
        this.moveShearReinforcedActive == false &&
        this.moveConnectionActive == false
      ) {
        this.GraphMoveMoment(pos);
        this.moveMomentActive = true;
      }
    }

    //**ScaleMesure
    this.ScaleMesure(elements, this.insertMoment);

    //** Reset elementMoment
    for (let i = 0, length = elements.length; i < length; i++)
      elements[i].elementMoment = [];
  }
  DisplayMomentReinforced(array, supports, pos) {
    if (button_BeamReinforced.state == -1) return;
    let adjust_Y = 0;

    if(this.insertMoment.y== this.insertGeo.y ) adjust_Y =50;

    console.log(this.insertMoment.y + " " +this.insertGeo.y  )
    translate(0,adjust_Y)

    push();
    if (supports.length > 0) {
      for (let i = 0, length = array.length; i < length; i++) {
        for (
          let j = 0, length2 = array[i].elementMoment.length;
          j < length2 - 1;
          j++
        ) {
          //console.log("i: " + i + "  J: " + j + " " +elements[i].elementMoment[j * 2] )
          //** elementMoment = [x0,M0,x1,M1,x2,M2.....]
          //** Calculated in class calculation.
          let top0x = array[i].startPos.x + array[i].elementMoment[j * 2] / 10 ;
          let top0y = this.insertMoment.y;

          let top1x = array[i].startPos.x + array[i].elementMoment[j * 2] / 10;
          let top1y =
            this.insertMoment.y +
            array[i].elementMoment[j * 2 + 1] / 1e4 / this.scaleMoment;

          let top2x =
            array[i].startPos.x + array[i].elementMoment[j * 2 + 2] / 10;
          let top2y =
            this.insertMoment.y +
            array[i].elementMoment[j * 2 + 3] / 1e4 / this.scaleMoment;

          let top3x =
            array[i].startPos.x + array[i].elementMoment[j * 2 + 2] / 10;
          let top3y = this.insertMoment.y;

          //push();
          strokeWeight(3);
          stroke(0, 0, 255, 200);
          line(top1x, top1y, top2x, top2y);

          noStroke();
          fill(0, 0, 255, 50);
          quad(top0x, top0y, top1x, top1y, top2x, top2y, top3x, top3y);
          stroke(0, 0, 255, 200);
          //pop();

          //push();
          strokeWeight(2);
          //**Vertical line at jump in curve

          let momentEnd =
            array[i].elementMoment[array[i].elementMoment.length - 1] /
            1e4 /
            this.scaleMoment;

          //**Dont examine last element
          if (i < array.length - 1) {
            let momentStartNext =
              array[i + 1].elementMoment[1] / 1e4 / this.scaleMoment;

            //**If jump in value then draw line
            if (momentEnd != momentStartNext)
              line(
                array[i].endPos.x,
                this.insertMoment.y + momentEnd,
                array[i].endPos.x,
                this.insertMoment.y + momentStartNext
              );
          }
          //pop();
        }
        

        /*
        //**Vertical line in start and end of beam
        push();
        let momentStartBeam =
          elements[0].elementMoment[1] / 1e4 / this.scaleMoment;
        let momentEndBeam =
          elements[elements.length - 1].elementMoment[
            elements[elements.length - 1].elementMoment.length - 1
          ] /
          1e4 /
          this.scaleMoment;
        strokeWeight(2);
        //**StartBeam
        line(
          elements[0].startPos.x,
          this.insertMoment.y + momentStartBeam,
          elements[0].startPos.x,
          this.insertMoment.y
        );
        //**EndBeam
        line(
          elements[elements.length - 1].endPos.x,
          this.insertMoment.y + momentEndBeam,
          elements[elements.length - 1].endPos.x,
          this.insertMoment.y
        );
        pop();
        */
      }
    }
    /*
    //**Name
    push();
    noFill();
    stroke(0);
    strokeWeight(1);
    circle(300, this.insertMoment.y, 50);

    textAlign(CENTER, CENTER);
    textSize(35);
    fill(50);

    text("M", 300, this.insertMoment.y);
    line(
      this.insertMoment.x + 75,
      this.insertMoment.y,
      this.insertMoment.x - 75,
      this.insertMoment.y
    );
    

    //**Mark supports on graph
    for (let i = 0, length = supports.length; i < length; i++) {
      circle(supports[i].posSupport.x, this.insertMoment.y, 8);
    }

    //**Axis
    stroke(0);
    strokeWeight(this.axisStrokeWeight);
    line(
      array[0].startPos.x - 5,
      this.insertMoment.y,
      array[array.length - 1].endPos.x + 10,
      this.insertMoment.y
    );
    pop();
    
    */

    if (supports.length > 0)
      this.DisplayMomentValuesReinforced(elementsReinforced);

    /*
    //****** MoveGraph Moment ******
    //**Variable to lock graph to mousePos
    //**Variable reset when mouseReleased in function mouseReleased in sketch
    if (this.OverlapGraphMomentPos(pos) && mouseIsPressed)
      this.moveMomentLocked = true;

    if (this.moveMomentLocked) {
      if (
        this.moveShearActive == false &&
        this.moveDefActive == false &&
        this.moveGeoActive == false
      ) {
        this.GraphMoveMoment(pos);
        this.moveMomentActive = true;
      }
    }
    */

    //**ScaleMesure
    this.ScaleMesure(array, this.insertMoment);
pop();
    /*
    //** Reset elementMoment
    for (let i = 0, length = elements.length; i < length; i++)
      array[i].elementMoment = [];
      */
  }
  DisplayMomentSum(array_1, array_2) {
    if (button_BeamReinforced.state == -1) return;
    if (supports.length > 0) {
      for (let i = 0, length = array_1.length; i < length; i++) {
        for (
          let j = 0, length2 = array_1[i].elementMoment.length;
          j < length2 - 1;
          j++
        ) {
          //console.log("i: " + i + "  J: " + j + " " +elements[i].elementMoment[j * 2] )
          //** elementMoment = [x0,M0,x1,M1,x2,M2.....]
          //** Calculated in class calculation.
          let top1x =
            array_1[i].startPos.x + array_1[i].elementMoment[j * 2] / 10;

          let top1y =
            this.insertMoment.y +
            array_1[i].elementMoment[j * 2 + 1] / 1e4 / this.scaleMoment +
            array_2[i].elementMoment[j * 2 + 1] / 1e4 / this.scaleMoment;

          let top2x =
            array_1[i].startPos.x + array_1[i].elementMoment[j * 2 + 2] / 10;
          let top2y =
            this.insertMoment.y +
            array_1[i].elementMoment[j * 2 + 3] / 1e4 / this.scaleMoment +
            array_2[i].elementMoment[j * 2 + 3] / 1e4 / this.scaleMoment;

          push();
          strokeWeight(1);
          stroke(0, 0, 0, 200);
          line(top1x, top1y, top2x, top2y);

          pop();
        }
      }
    }
  }
  DisplayMomentValues(elements) {
    //**Find min/max

    let max = 0;
    let min = Infinity;

    for (let i = 0, length_1 = elements.length; i < length_1; i++) {
      for (
        let j = 1, length_2 = elements[i].elementMoment.length;
        j < length_2;
        j += 2
      ) {
        if (elements[i].elementMoment[j] > max)
          max = elements[i].elementMoment[j];
        if (elements[i].elementMoment[j] < min)
          min = elements[i].elementMoment[j];
      }
    }

    min = nf(round(min / 1e6, 2), 0, 2);
    max = nf(round(max / 1e6, 2), 0, 2);

    push();
    textAlign(RIGHT, CENTER);
    textSize(24);
    stroke(0);
    translate(0, this.insertMoment.y);
    let start = elements[0].startPos.x;

    if ((max * 100) / this.scaleMoment > 25)
      text(max, start - 45, (max * 100) / this.scaleMoment);
    else text(max, start - 45, 25);

    if ((min * 100) / this.scaleMoment < -25)
      text(min, start - 45, (min * 100) / this.scaleMoment);
    else text(min, start - 45, -25);

    stroke(0);
    strokeWeight(this.axisStrokeWeight);
    line(start - 35, -5, start - 35, (max * 100) / this.scaleMoment);
    line(start - 35, 5, start - 35, (min * 100) / this.scaleMoment);
    pop();
  }
  DisplayMomentValuesReinforced(array) {
    //**Find min/max

    //** Count bolts ** Start
    let count = 0;
    for (let i = 0; i < bolts.length; i++) {
      if (bolts[i].exist == 1) count++;
    }
    if (count < 3) return;
    //** Count bolts ** End

    let max = 0;
    let min = Infinity;

    for (let i = 0, length_1 = array.length; i < length_1; i++) {
      for (
        let j = 1, length_2 = array[i].elementMoment.length;
        j < length_2;
        j += 2
      ) {
        if (array[i].elementMoment[j] > max) max = array[i].elementMoment[j];
        if (array[i].elementMoment[j] < min) min = array[i].elementMoment[j];
      }
    }

    min = nf(round(min / 1e6, 2), 0, 2);
    max = nf(round(max / 1e6, 2), 0, 2);

    push();
    textAlign(LEFT, CENTER);
    textSize(24);
    stroke(0, 0, 255);
    strokeWeight(1)
    //noStroke();
    fill(0, 0, 255);
    translate(0, this.insertMoment.y);
    let start = array[array.length - 1].endPos.x;

    if ((max * 100) / this.scaleMoment > 25)
      text(max, start + 45, (max * 100) / this.scaleMoment);
    else text(max, start + 45, 25);

    if ((min * 100) / this.scaleMoment < -25)
      text(min, start + 45, (min * 100) / this.scaleMoment);
    else text(min, start + 45, -25);

    stroke(0, 0, 255);

    strokeWeight(this.axisStrokeWeight);
    line(start + 35, -5, start + 35, (max * 100) / this.scaleMoment);
    line(start + 35, 5, start + 35, (min * 100) / this.scaleMoment);

    stroke(0);
    strokeWeight(1);
    line(start + 25, 0, start + 45, 0);

    pop();
  }
  //**********************************
  //** 3 *****************************
  //**********************************
  OverlapGraphShearPos(pos) {
    //**GraphShear
    let distShear = dist(
      pos.x,
      pos.y,
      this.insertShear.x - 100,
      this.insertShear.y
    );
    if (distShear < this.overlapDiameter) {
      push();
      fill(100, 100, 100, 100);
      circle(this.insertShear.x - 100, this.insertShear.y, 50);
      pop();
      return true;
    }
    return false;
  }
  OverlapGraphShearReinforcedPos(pos) {
    //**GraphShear
    let distShear = dist(
      pos.x,
      pos.y,
      this.insertShearReinforced.x - 100,
      this.insertShearReinforced.y
    );
    if (distShear < this.overlapDiameter) {
      push();
      fill(100, 100, 100, 100);
      circle(
        this.insertShearReinforced.x - 100,
        this.insertShearReinforced.y,
        50
      );
      pop();
      return true;
    }
    return false;
  }
  GraphMoveShear(pos) {
    {
      push();
      fill(0, 255, 0, 100);
      circle(this.insertShear.x - 100, this.insertShear.y, 50);

      pos = this.GraphMoveSteps(pos);
      this.insertShear.y = pos.y;

      //if (this.insertShear.y - pos.y > 0) this.insertShear.y -= 10;
      //if (this.insertShear.y - pos.y < 0) this.insertShear.y += 10;

      pop();
    }
  }
  GraphMoveShearReinforced(pos) {
    {
      push();
      fill(0, 255, 0, 100);
      circle(
        this.insertShearReinforced.x - 100,
        this.insertShearReinforced.y,
        50
      );

      pos = this.GraphMoveSteps(pos);
      this.insertShearReinforced.y = pos.y;

      //if (this.insertShear.y - pos.y > 0) this.insertShear.y -= 10;
      //if (this.insertShear.y - pos.y < 0) this.insertShear.y += 10;

      pop();
    }
  }
  DisplayShear(elements, supports, pos) {
    if (supports.length > 0) {
      for (let i = 0, length = elements.length; i < length; i++) {
        for (
          let j = 0, length2 = elements[i].elementShear.length;
          j < length2 - 1;
          j++
        ) {
          //** elementShear = [x0,V0,x1,V1,x2,V2.....]
          let top0x =
            elements[i].startPos.x + elements[i].elementShear[j * 2] / 10;
          let top0y = this.insertShear.y;

          let top1x =
            elements[i].startPos.x + elements[i].elementShear[j * 2] / 10;
          let top1y =
            this.insertShear.y +
            elements[i].elementShear[j * 2 + 1] / 1e1 / this.scaleShear;

          let top2x =
            elements[i].startPos.x + elements[i].elementShear[j * 2 + 2] / 10;
          let top2y =
            this.insertShear.y +
            elements[i].elementShear[j * 2 + 3] / 1e1 / this.scaleShear;

          let top3x =
            elements[i].startPos.x + elements[i].elementShear[j * 2 + 2] / 10;
          let top3y = this.insertShear.y;

          push();
          strokeWeight(2);

          line(top1x, top1y, top2x, top2y);

          noStroke();
          fill(0, 0, 0, 50);
          quad(top0x, top0y, top1x, top1y, top2x, top2y, top3x, top3y);
          pop();
        }

        push();
        strokeWeight(2);
        //**Vertical line at jump in curve

        let shearEnd =
          elements[i].elementShear[elements[i].elementShear.length - 1] /
          1e1 /
          this.scaleShear;

        //**Dont examine last element
        if (i < elements.length - 1) {
          let shearStartNext =
            elements[i + 1].elementShear[1] / 1e1 / this.scaleShear;

          //**If jump in value then draw line
          if (shearEnd != shearStartNext)
            line(
              elements[i].endPos.x,
              this.insertShear.y + shearEnd,
              elements[i].endPos.x,
              this.insertShear.y + shearStartNext
            );
        }
        pop();
      }

      //**Vertical line in start and end of beam
      push();
      let shearStartBeam = elements[0].elementShear[1] / 1e1 / this.scaleShear;
      let shearEndBeam =
        elements[elements.length - 1].elementShear[
          elements[elements.length - 1].elementShear.length - 1
        ] /
        1e1 /
        this.scaleShear;
      strokeWeight(2);
      //**StartBeam
      line(
        elements[0].startPos.x,
        this.insertShear.y + shearStartBeam,
        elements[0].startPos.x,
        this.insertShear.y
      );
      //**EndBeam
      line(
        elements[elements.length - 1].endPos.x,
        this.insertShear.y + shearEndBeam,
        elements[elements.length - 1].endPos.x,
        this.insertShear.y
      );
      pop();
    }

    //**Name
    push();
    textSize(20);
    text("[kN]", 335, this.insertShear.y - 10);

    noFill();
    stroke(0);
    strokeWeight(1);
    circle(300, this.insertShear.y, 50);

    textAlign(CENTER, CENTER);
    textSize(35);
    fill(50);

    text("V", 300, this.insertShear.y);
    line(
      this.insertShear.x + 75,
      this.insertShear.y,
      this.insertShear.x - 75,
      this.insertShear.y
    );

    //**Mark supports on graph
    for (let i = 0, length = supports.length; i < length; i++) {
      circle(supports[i].posSupport.x, this.insertShear.y, 8);
      /*
      line(
        supports[i].posSupport.x,
        elements[i].elementShear[i * 2 + 1]/10,
        supports[i].posSupport.x,
        elements[i].elementShear[i * 2 + 1]/10
      );
      */
    }

    //**Axis
    stroke(0);
    strokeWeight(this.axisStrokeWeight);
    line(
      elements[0].startPos.x - 5,
      this.insertShear.y,
      elements[elements.length - 1].endPos.x + 10,
      this.insertShear.y
    );
    pop();

    //****** MoveGraph Shear ******
    //**Variable to lock graph to mousePos
    //**Variable reset when mouseReleased in function mouseReleased in sketch
    if (this.OverlapGraphShearPos(pos) && mouseIsPressed)
      this.moveShearLocked = true;

    if (this.moveShearLocked) {
      if (
        this.moveGeoActive == false &&
        this.moveDefActive == false &&
        this.moveMomentActive == false &&
        this.moveShearReinforcedActive == false &&
        this.moveConnectionActive == false
      ) {
        this.GraphMoveShear(pos);
        this.moveShearActive = true;
      }
    }

    //**ScaleMesure
    this.ScaleMesure(elements, this.insertShear);

    if (supports.length > 0) this.DisplayShearValues(elements);

    //** Reset elementShear
    for (let i = 0, length = elements.length; i < length; i++)
      elements[i].elementShear = [];
  }
  DisplayShearReinforced(array, supports, pos) {
    if (button_BeamReinforced.state == -1) return;

    if (supports.length > 0) {
      for (let i = 0, length = array.length; i < length; i++) {
        for (
          let j = 0, length2 = array[i].elementShear.length;
          j < length2 - 1;
          j++
        ) {
          //** elementShear = [x0,V0,x1,V1,x2,V2.....]
          let top0x = array[i].startPos.x + array[i].elementShear[j * 2] / 10;
          let top0y = this.insertShearReinforced.y;

          let top1x = array[i].startPos.x + array[i].elementShear[j * 2] / 10;
          let top1y =
            this.insertShearReinforced.y +
            array[i].elementShear[j * 2 + 1] / 1e1 / this.scaleShear;

          let top2x =
            array[i].startPos.x + array[i].elementShear[j * 2 + 2] / 10;
          let top2y =
            this.insertShearReinforced.y +
            array[i].elementShear[j * 2 + 3] / 1e1 / this.scaleShear;

          let top3x =
            array[i].startPos.x + array[i].elementShear[j * 2 + 2] / 10;
          let top3y = this.insertShearReinforced.y;

          push();
          strokeWeight(3);
          stroke(0, 0, 255, 200);

          line(top1x, top1y, top2x, top2y);

          noStroke();
          fill(0, 0, 255, 50);
          quad(top0x, top0y, top1x, top1y, top2x, top2y, top3x, top3y);
          pop();
        }

        push();
        stroke(0, 0, 255, 200);
        strokeWeight(3);
        //**Vertical line at jump in curve

        let shearEnd =
          array[i].elementShear[array[i].elementShear.length - 1] /
          1e1 /
          this.scaleShear;

        //**Dont examine last element
        if (i < array.length - 1) {
          let shearStartNext =
            array[i + 1].elementShear[1] / 1e1 / this.scaleShear;

          //**If jump in value then draw line
          if (shearEnd != shearStartNext)
            line(
              array[i].endPos.x,
              this.insertShearReinforced.y + shearEnd,
              array[i].endPos.x,
              this.insertShearReinforced.y + shearStartNext
            );
        }
        pop();
      }

      //**Vertical line in start and end of beam
      push();
      let shearStartBeam = array[0].elementShear[1] / 1e1 / this.scaleShear;
      let shearEndBeam =
        array[array.length - 1].elementShear[
          array[array.length - 1].elementShear.length - 1
        ] /
        1e1 /
        this.scaleShear;
      stroke(0, 0, 255, 200);
      strokeWeight(3);
      //**StartBeam
      line(
        array[0].startPos.x,
        this.insertShearReinforced.y + shearStartBeam,
        array[0].startPos.x,
        this.insertShearReinforced.y
      );
      //**EndBeam
      line(
        array[array.length - 1].endPos.x,
        this.insertShearReinforced.y + shearEndBeam,
        array[elements.length - 1].endPos.x,
        this.insertShearReinforced.y
      );
      pop();
    }

    //**Name
    push();
    textSize(20);
    text("[kN]", 335, this.insertShearReinforced.y - 10);

    noFill();
    stroke(0);
    strokeWeight(1);
    circle(300, this.insertShearReinforced.y, 50);

    textAlign(CENTER, CENTER);
    textSize(35);
    fill(50);

    text("V", 300, this.insertShearReinforced.y);
    line(
      this.insertShearReinforced.x + 75,
      this.insertShearReinforced.y,
      this.insertShearReinforced.x - 75,
      this.insertShearReinforced.y
    );

    //**Mark supports on graph
    for (let i = 0, length = supports.length; i < length; i++) {
      circle(supports[i].posSupport.x, this.insertShearReinforced.y, 8);
      /*
      line(
        supports[i].posSupport.x,
        elements[i].elementShear[i * 2 + 1]/10,
        supports[i].posSupport.x,
        elements[i].elementShear[i * 2 + 1]/10
      );
      */
    }

    //**Axis
    stroke(0);
    strokeWeight(this.axisStrokeWeight);
    line(
      elements[0].startPos.x - 5,
      this.insertShearReinforced.y,
      array[array.length - 1].endPos.x + 10,
      this.insertShearReinforced.y
    );
    pop();

    //****** MoveGraph Shear ******
    //**Variable to lock graph to mousePos
    //**Variable reset when mouseReleased in function mouseReleased in sketch
    if (this.OverlapGraphShearReinforcedPos(pos) && mouseIsPressed)
      this.moveShearReinforcedLocked = true;

    if (this.moveShearReinforcedLocked) {
      if (
        this.moveGeoActive == false &&
        this.moveDefActive == false &&
        this.moveMomentActive == false &&
        this.moveShearActive == false &&
        this.moveConnectionActive == false
      ) {
        this.GraphMoveShearReinforced(pos);
        this.moveShearReinforcedActive = true;
      }
    }

    //**ScaleMesure
    this.ScaleMesure(array, this.insertShear);

    if (supports.length > 0)
      this.DisplayShearValuesReinforced(elementsReinforced);

    //** Reset elementShear
    for (let i = 0, length = array.length; i < length; i++)
      array[i].elementShear = [];
  }
  DisplayShearSum(array_1, array_2) {
    if (button_BeamReinforced.state == -1) return;
    if (supports.length > 0) {
      for (let i = 0, length = array_1.length; i < length; i++) {
        for (
          let j = 0, length2 = array_1[i].elementShear.length;
          j < length2 - 1;
          j++
        ) {
          //console.log("i: " + i + "  J: " + j + " " +elements[i].elementShear[j * 2] )
          //** elementShear = [x0,M0,x1,M1,x2,M2.....]
          //** Calculated in class calculation.
          let top1x =
            array_1[i].startPos.x + array_1[i].elementShear[j * 2] / 10;

          let top1y =
            this.insertShear.y +
            array_1[i].elementShear[j * 2 + 1] / 1e1 / this.scaleShear +
            array_2[i].elementShear[j * 2 + 1] / 1e1 / this.scaleShear;

          let top2x =
            array_1[i].startPos.x + array_1[i].elementShear[j * 2 + 2] / 10;
          let top2y =
            this.insertShear.y +
            array_1[i].elementShear[j * 2 + 3] / 1e1 / this.scaleShear +
            array_2[i].elementShear[j * 2 + 3] / 1e1 / this.scaleShear;

          push();
          strokeWeight(1);
          stroke(0, 0, 0, 200);
          line(top1x, top1y, top2x, top2y);

          pop();
        }

        push();
                  strokeWeight(1);
          stroke(0, 0, 0, 150);
        //**Vertical line at jump in curve

        let shearEnd =
          (array_1[i].elementShear[array_1[i].elementShear.length - 1] +
            array_2[i].elementShear[array_2[i].elementShear.length - 1]) /
          1e1 /
          this.scaleShear;

        //**Dont examine last element
        if (i < array_1.length - 1) {
          let shearStartNext =
            (array_1[i + 1].elementShear[1] + array_2[i + 1].elementShear[1]) /
            1e1 /
            this.scaleShear;

          //**If jump in value then draw line
          if (shearEnd != shearStartNext)
            line(
              array_1[i].endPos.x,
              this.insertShear.y + shearEnd,
              array_1[i].endPos.x,
              this.insertShear.y + shearStartNext
            );
        }
        pop();

        //**Vertical line in start and end of beam
        push();
        let shearStartBeam =
          (array_1[0].elementShear[1] + array_2[0].elementShear[1]) /
          1e1 /
          this.scaleShear;
        let shearEndBeam =
          (array_1[array_1.length - 1].elementShear[
            array_1[array_1.length - 1].elementShear.length - 1
          ] +
            array_2[array_2.length - 1].elementShear[
              array_2[array_2.length - 1].elementShear.length - 1
            ]) /
          1e1 /
          this.scaleShear;
                 strokeWeight(1);
          stroke(0, 0, 0, 150);
        //**StartBeam
        line(
          array_1[0].startPos.x,
          this.insertShear.y + shearStartBeam,
          array_1[0].startPos.x,
          this.insertShear.y
        );
        //**EndBeam
        line(
          array_1[array_1.length - 1].endPos.x,
          this.insertShear.y + shearEndBeam,
          array_1[array_1.length - 1].endPos.x,
          this.insertShear.y
        );
        pop();
      }
    }
  }
  DisplayShearValues(elements) {
    //**Find min/max
    let max = 0;
    let min = Infinity;

    for (let i = 0, length_1 = elements.length; i < length_1; i++) {
      for (
        let j = 1, length_2 = elements[i].elementShear.length;
        j < length_2;
        j += 2
      ) {
        if (elements[i].elementShear[j] > max)
          max = elements[i].elementShear[j];
        if (elements[i].elementShear[j] < min)
          min = elements[i].elementShear[j];
      }
    }

    min = nf(round(min / 1e3, 2), 0, 2);
    max = nf(round(max / 1e3, 2), 0, 2);

    push();
    textAlign(RIGHT, CENTER);
    textSize(24);
    stroke(0);
    translate(0, this.insertShear.y);
    let start = elements[0].startPos.x;

    if ((max * 100) / this.scaleShear > 25)
      text(max, start - 45, (max * 100) / this.scaleShear);
    else text(max, start - 45, 25);

    if ((min * 100) / this.scaleShear < -25)
      text(min, start - 45, (min * 100) / this.scaleShear);
    else text(min, start - 45, -25);

    stroke(0);
    strokeWeight(this.axisStrokeWeight);
    line(start - 35, -5, start - 35, (max * 100) / this.scaleShear);
    line(start - 35, 5, start - 35, (min * 100) / this.scaleShear);
    pop();
  }
  DisplayShearValuesReinforced(array) {
    //**Find min/max

    let max = 0;
    let min = Infinity;

    for (let i = 0, length_1 = array.length; i < length_1; i++) {
      for (
        let j = 1, length_2 = array[i].elementShear.length;
        j < length_2;
        j += 2
      ) {
        if (array[i].elementShear[j] > max) max = array[i].elementShear[j];
        if (array[i].elementShear[j] < min) min = array[i].elementShear[j];
      }
    }

    min = nf(round(min / 1e3, 2), 0, 2);
    max = nf(round(max / 1e3, 2), 0, 2);

    push();
    textAlign(LEFT, CENTER);
    textSize(24);
    stroke(0, 0, 255);
    fill(0, 0, 255);
    translate(0, this.insertShearReinforced.y);
    let start = array[array.length - 1].endPos.x;

    if ((max * 100) / this.scaleShear > 25)
      text(max, start + 45, (max * 100) / this.scaleShear);
    else text(max, start + 45, 25);

    if ((min * 100) / this.scaleShear < -25)
      text(min, start + 45, (min * 100) / this.scaleShear);
    else text(min, start + 45, -25);

    stroke(0, 0, 255);

    strokeWeight(this.axisStrokeWeight);
    line(start + 35, -5, start + 35, (max * 100) / this.scaleShear);
    line(start + 35, 5, start + 35, (min * 100) / this.scaleShear);

    stroke(0);
    strokeWeight(1);
    line(start + 25, 0, start + 45, 0);

    pop();
  }
  //**********************************
  //** 4 *****************************
  //**********************************
  ScaleMesure(elements, insertPoint) {
    let adjustScalePos = 0;
    if (button_BeamReinforced.state == 1) adjustScalePos = 75;

    push();
    fill(0);
    strokeWeight(1);
    translate(
      elements[elements.length - 1].endPos.x + 150 + adjustScalePos,
      insertPoint.y + 30
    );
    line(-5, 20, 105, 20);
    line(0, 25, 0, 5); //**Left
    line(100, 25, 100, 5); //**Right
    strokeWeight(3);
    line(0, 0, 100, 0);
    pop();
  }
  ScaleMesureGeo(pos) {
    push();
    fill(0);
    strokeWeight(1);
    translate(pos.x, pos.y);
    line(-5, 20, 105, 20);
    line(0, 25, 0, 5); //**Left
    line(100, 25, 100, 5); //**Right
    strokeWeight(3);
    line(0, 0, 100, 0);
    pop();
  }
  //**********************************
  //** 5 *****************************
  //**********************************
  DisplayReactions(supports) {
    for (let i = 0, length = supports.length; i < length; i++) {
      let value = nf(round(supports[i].reaction / 1000, 2), 0, 2);
      let valueMoment = nf(
        round(supports[i].reactionMoment / 1000000, 2),
        0,
        2
      );

      push();
      //**ReactionMoment
      textAlign(LEFT, CENTER);
      stroke(0);
      textSize(24);
      //**isNaN(x) return true if x is NaN
      if (valueMoment != 0 && isNaN(valueMoment) == false)
        text(
          nf(abs(valueMoment), 0, 2) + " kNm",
          supports[i].posSupport.x + 30,
          supports[i].posSupport.y - 25
        );

      let x = supports[i].posSupport.x;
      let y = supports[i].posSupport.y;

      if (valueMoment > 0 && isNaN(valueMoment) == false) {
        noFill();
        strokeWeight(4);
        stroke(0, 0, 0);
        arc(x, y, 50, 50, 1.2 * PI, 1.8 * PI);

        translate(x + 23, y - 12);
        fill(0, 0, 0);
        triangle(0, 0, -2, -12, -12, -2);
      }

      if (valueMoment < 0 && isNaN(valueMoment) == false) {
        noFill();
        strokeWeight(4);
        stroke(0, 0, 0);
        arc(x, y, 50, 50, 1.2 * PI, 1.8 * PI);

        translate(x - 23, y - 12);
        fill(0, 0, 0);
        triangle(0, 0, 2, -12, 12, -2);
      }

      pop();

      push();
      //**Reaction
      translate(0, 60);
      let start = supports[i].posSupport;
      let move = new p5.Vector(0, -50);
      let end = p5.Vector.sub(start, move);

      textAlign(CENTER);
      textSize(24);

      //strokeWeight(2);
      stroke(0);
      if (value > 0) text(nf(value, 0, 2) + " kN", end.x, end.y + 30);
      if (value < 0) text(nf(-value, 0, 2) + " kN", end.x, end.y + 30);

      strokeWeight(4);
      stroke(50);
      fill(50);

      if (value > 0) {
        stroke(0, 0, 0);
        fill(0, 0, 0);
        line(start.x, start.y, end.x, end.y);
        strokeWeight(2);
        triangle(
          start.x,
          start.y - 5,
          start.x - 8,
          start.y + 13,
          start.x + 8,
          start.y + 13
        );
      }

      if (value < 0) {
        stroke(0, 0, 0);
        fill(0, 0, 0);
        line(start.x, start.y, end.x, end.y);
        strokeWeight(2);
        triangle(
          start.x,
          start.y + 55,
          start.x - 8,
          start.y + 37,
          start.x + 8,
          start.y + 37
        );
      }
      pop();
    }
  }
  DisplaySupports(supports) {
    for (let i = 0, length = supports.length; i < length; i++) {
      supports[i].DisplaySupport(calculate.nodeResultDefY);
    }
    supports = [];
  }
  DisplayLoads(loads, loadLinesLength) {
    for (let i = 0, length = loads.length; i < length; i++) {
      //** If logNode == true =>
      //** loadLine.Display() are activated in loadPoint.MoveLoadDisplay(pos, loadLinesLength)
      if (loads[i].logNode == false) loads[i].DisplayLoad(loadLinesLength);
    }
    //loads = [];
    //console.log(loads.length)
  }
  DisplayLoadLines(loadLines) {
    for (let i = 0, length = loadLines.length; i < length; i++) {
      //loadLines[i].Adjust();

      //** If logNode == true =>
      //** loadLine.Display() are activated in loadLines.AdjustLoadLines(pos, elements)
      if (
        loadLines[i].logStartNode == false &&
        loadLines[i].logEndNode == false
      )
        loadLines[i].DisplayLoad();

      // loadLines[i].insertPoint.y = this.insertGeo.y
      // loadLines[i].posLoadLineStart.y = this.insertGeo.y;
      // loadLines[i].posLoadLineEnd.y = this.insertGeo.y;
    }
  }
  DisplayLoadMoments() {
    for (let i = 0, length = loadMoments.length; i < length; i++) {
      //** If logNode == true =>
      //** loadLine.Display() are activated in loadPoint.MoveLoadDisplay(pos, loadLinesLength)
      if (loadMoments[i].logNode == false) {
        //console.log("xxx")
        loadMoments[i].DisplayLoadMoment();
      }
    }
    //loads = [];
    //console.log(loads.length)
  }
  DisplayCharniers(elements) {
    for (let i = 0; i < this.elementsLength; i++) {
      if (elements[i].charnierLeft) {
        push();
        fill(255);
        noStroke();
        circle(elements[i].startPos.x, this.insertGeo.y, 22);
        fill(0);
        stroke(50);
        circle(elements[i].startPos.x, this.insertGeo.y, 8);
        strokeWeight(5);
        line(
          elements[i].startPos.x,
          this.insertGeo.y,
          elements[i].startPos.x + 12,
          this.insertGeo.y
        );
        strokeWeight(4);
        noFill();
        arc(elements[i].startPos.x, this.insertGeo.y, 20, 20, PI / 4, -PI / 4);
        pop();
      }
    }
  }
  //**********************************
  //** 6 *****************************
  //**********************************
  DisplayMesure(elements, supports) {
    push();

    let eY = 200; //** Element y
    //**Mesure elements
    for (let i = 0, length = elements.length; i < length; i++) {
      let startX = elements[i].startPos.x;
      let startY = elements[i].startPos.y;
      let endX = elements[i].endPos.x;
      let centerX = elements[i].centerPos.x;

      line(startX - 5, startY + eY, endX + 5, startY + eY);
      line(startX, startY + eY + 5, startX, startY + eY - 5);
      line(endX, startY + eY + 5, endX, startY + eY - 5);

      textSize(22);
      textAlign(CENTER, CENTER);
      text(
        nf(elements[i].elementLength / 1000, 0, 3),
        centerX,
        startY + eY + 20
      );
    }

    let tY = 300; //** Total length

    let startX = elements[0].startPos.x;
    let startY = elements[0].startPos.y;
    let endX = elements[elements.length - 1].endPos.x;
    let centerX = startX + (endX - startX) / 2;

    line(startX - 5, startY + tY, endX + 5, startY + tY);
    line(startX, startY + tY + 5, startX, startY + tY - 5);
    line(endX, startY + tY + 5, endX, startY + tY - 5);

    textSize(22);
    textAlign(CENTER, CENTER);

    let scaleGeo = buttonRollor_scaleGeo.ReadValue();
    text(
      nf((10 * (endX - startX) * scaleGeo) / 1000, 0, 3),
      centerX,
      startY + tY + 20
    );

    let sY = 250; //** Support y
    //**Mesure supports
    for (let i = 1, length = supports.length; i < length; i++) {
      if (length > 1) {
        let startX = supports[i - 1].posSupport.x;
        let endX = supports[i].posSupport.x;
        let startY = supports[i].posSupport.y;

        line(startX - 5, startY + sY, endX + 5, startY + sY);
        line(startX, startY + sY + 5, startX, startY + sY - 5);
        line(endX, startY + sY + 5, endX, startY + sY - 5);

        textSize(22);
        textAlign(CENTER, CENTER);
        let mesure = (endX - startX) * elements[0].scaleGeo;
        let mesurePos = startX + (0.5 * mesure) / elements[0].scaleGeo;

        text(nf(mesure / 100, 0, 3), mesurePos, startY + sY + 20);
      }
    }
    pop();
  }
  GraphMoveSteps(pos) {
    //**pos.y in multioplum of stepChange
    let stepChange = 10; //*scaleGeo;

    //console.log("pos.x: " + pos.x + " round(pos): " + round(pos.x/10)*10)
    //pos.x = int(pos.x / stepChange) * stepChange;
    //pos.y = int(pos.y / stepChange) * stepChange;

    pos.x = round(pos.x / stepChange) * stepChange;
    pos.y = round(pos.y / stepChange) * stepChange;
    /*
    //** X
    let remainder_x = int(pos.x) % stepChange;
    if (remainder_x > stepChange / 2)
      pos.x = int(pos.x) + (stepChange - remainder_x);
    if (remainder_x <= stepChange / 2) pos.x = int(pos.x) - remainder_x;

    //** Y
    let remainder_y = int(pos.y) % stepChange;
    if (remainder_y > stepChange / 2)
      pos.y = int(pos.y) + (stepChange - remainder_y);
    if (remainder_y <= stepChange / 2) pos.y = int(pos.y) - remainder_y;
*/
    return pos;
  }
  //**********************************
  //** 7 *****************************
  //**********************************
  //** OverlapGraphConnectionPos(pos)
  OverlapGraphConnection(pos) {
    //**GraphShear
    let distConnection = dist(
      pos.x,
      pos.y,
      this.insertConnection.x - 100,
      this.insertConnection.y
    );
    if (distConnection < this.overlapDiameter) {
      push();
      fill(100, 100, 100, 100);
      circle(this.insertConnection.x - 100, this.insertConnection.y, 50);
      pop();
      return true;
    }
    return false;
  }
  GraphMoveConnection(pos) {
    push();
    fill(0, 255, 0, 100);
    circle(this.insertConnection.x - 100, this.insertConnection.y, 50);

    pos = this.GraphMoveSteps(pos);
    this.insertConnection.y = pos.y;

    //if (this.insertShear.y - pos.y > 0) this.insertShear.y -= 10;
    //if (this.insertShear.y - pos.y < 0) this.insertShear.y += 10;

    pop();
  }
  DisplayConnections(array, pos) {
    //** array => Bolts[]
    if (button_BeamReinforced.state == -1) return;

    //** Count bolts
    let count = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i].exist == 1) count++;
    }
    if (count < 3) return;

    //**Name
    push();
    textSize(20);
    text("[kN]", 335, this.insertConnection.y - 10);

    noFill();
    stroke(0);
    strokeWeight(1);
    circle(300, this.insertConnection.y, 50);

    textAlign(CENTER, CENTER);
    textSize(35);
    fill(50);

    text("F", 300, this.insertConnection.y);
    line(
      this.insertConnection.x + 75,
      this.insertConnection.y,
      this.insertConnection.x - 75,
      this.insertConnection.y
    );

    stroke(0);
    
    strokeWeight(this.axisStrokeWeight);
    translate(0, this.insertConnection.y);
    strokeWeight(4);
    line(array[0].startPos.x - 5, 0, array[array.length - 1].endPos.x + 10, 0);

    let start = changeSystem.startNodeReinforced;
    let end = changeSystem.endNodeReinforced;
    stroke(0, 0, 255, 200);
    strokeWeight(4);

    line(array[start].startPos.x - 5, 150, array[end].endPos.x + 5, 150);
    pop();

    push();
    translate(0, this.insertConnection.y);

    let scaleForce = calculate.bolt_max / 50;
    textSize(20);
    textAlign(CENTER, CENTER);
    strokeWeight(2);
    fill(0);

    //console.log("graph line 2037: " + supports);
    if (supports.length > 0) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].force == 0) continue;
        let y = abs(array[i].force) / scaleForce;
        let x = array[i].startPos.x;

        line(x, 10, x, 10 + y);
        text(nf(abs(array[i].force), 0, 2), array[i].startPos.x, 75);

        //**
        circle(x, 0, 5);
        if (array[i].force > 0)
          triangle(x, 10 + y, x - 5, 10 + y - 10, x + 5, 10 + y - 10); //** Down
        if (array[i].force < 0) triangle(x, 10, x - 5, 20, x + 5, 20); //** Up

        //** Reinforcement
        line(x, 140, x, 140 - y);
        if (array[i].force > 0)
          triangle(x, 140 - y, x - 5, 140 - y + 10, x + 5, 140 - y + 10); //** Up
        if (array[i].force < 0)
          triangle(x, 140, x - 5, 140 - 10, x + 5, 140 - 10); //** Down

        push();
        stroke(0, 0, 255, 0);
        fill(0, 0, 255);
        circle(x, 150, 8);
        pop();
      }
    }
    pop();

    //****** MoveGraph Moment ******
    //**Variable to lock graph to mousePos
    //**Variable reset when mouseReleased in function mouseReleased in sketch
    if (this.OverlapGraphConnection(pos) && mouseIsPressed)
      this.moveConnectionLocked = true;

    if (this.moveConnectionLocked) {
      if (
        this.moveShearActive == false &&
        this.moveMomentActive == false &&
        this.moveDefActive == false &&
        this.moveGeoActive == false &&
        this.moveShearReinforcedActive == false
      ) {
        this.GraphMoveConnection(pos);
        this.moveConnectionActive = true;
      }
    }

    //**ScaleMesure
    //this.ScaleMesure(elements, this.insertMoment);
  }
}
