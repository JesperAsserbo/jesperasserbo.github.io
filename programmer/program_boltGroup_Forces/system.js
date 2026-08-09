class System {
  constructor() {
    this.insertPoint = graph.insertPoint;
    //this.stepSize = 5; //** = x => svarer til x*10 mm

    this.logBoltId = null;
    this.logLoad = false;
    this.overlapBoltId = undefined;
  }

  //** Called from sketch
  TestIfBoltOverlapBolt() {
    const w = distEdgeBolt.p1_steel;
    const h = distEdgeBolt.p2_steel;

    // Reset flags
    for (const bolt of boltGroup) {
      bolt.overlapAnotherBoltCenter = false;
    }

    for (let i = 0; i < boltGroup.length; i++) {
      const bolt = boltGroup[i];
      const p = bolt.pos_o_scaledGraph;
      const angle = bolt.F_Res_Vector.heading();

      for (let j = 0; j < boltGroup.length; j++) {
        if (i === j) continue;

        const c = boltGroup[j].pos_o_scaledGraph;

        if (
          distEdgeBolt.IsPointInsideRotatedEllipse(
            c.x,
            c.y, // point being tested
            p.x,
            p.y, // center of ellipse
            w,
            h,
            angle
          )
        ) {
          bolt.overlapAnotherBoltCenter = true;
          break; // no need to check more bolts
        }
      }
    }
  }

  //** Called from sketch
  TestIfBoltOverlapEdge() {
    const w = distEdgeBolt.e1_steel;
    const h = distEdgeBolt.e2_steel;

    // Reset flags
    for (const bolt of boltGroup) {
      bolt.overlapEdge = false;
      bolt.pointsOnEdge = [];
    }

    for (let i = 0; i < boltGroup.length; i++) {
      //const bolt = boltGroup[i];
      const p = boltGroup[i].pos_o_scaledGraph;
      const angle = boltGroup[i].F_Res_Vector.heading();

      //** reset pointsOnEdge
      //boltGroup[i].pointsOnEdge = [];

      //** For each Edge ** START
      for (let j = 0; j < plate.edge.length - 1; j++) {
        let x1 = plate.edge[j][0];
        let y1 = plate.edge[j][1];
        let x2 = plate.edge[j + 1][0];
        let y2 = plate.edge[j + 1][1];

        //** IsLineIntersectingRotatedEllipse(x1, y1, x2, y2, px, py, w, h, angle)
        let points = distEdgeBolt.IsLineIntersectingRotatedEllipse(
          x1,
          y1,
          x2,
          y2, // Line being tested
          p.x,
          p.y, // center of ellipse
          w,
          h,
          angle
        );

        //** Test if overlap (points in array)
        //** if returned 0 => no intersection points
        if (points != 0) boltGroup[i].pointsOnEdge.push(...points); //** Add in extensin as single elements
      }
      //** For each Edge ** END

      if (boltGroup[i].pointsOnEdge.length > 0) {
        boltGroup[i].overlapEdge = true;
        //console.log("System line 97 - 0: " + boltGroup[0].pointsOnEdge + " 1: " + boltGroup[1].pointsOnEdge)
      } else boltGroup[i].overlapEdge = false;
    }

    //** Draw intersectionPoints
    //console.log("System line 100 " + boltGroup[0].pointsOnEdge.length)
    if (button_Limit_Edge.state == 1) {
      for (let i = 0; i < boltGroup.length; i++) {
        if (boltGroup[i].pointsOnEdge.length > 0) {
          
          for (let j = 0; j < boltGroup[i].pointsOnEdge.length-1; j ++) {
            let x = boltGroup[i].pointsOnEdge[j * 2];
            let y = boltGroup[i].pointsOnEdge[j * 2 + 1];

            //console.log("system line 110 - i: " + i+" j: " + j + " x: " + x )
            push();
            fill(255, 0, 0);
            stroke(255, 0, 0);
            circle(x, y, 8);
            pop();
          }
        }
      }
    }

    //console.log(boltGroup[0].pointsOnEdge);
  }

  AddBolt(pos) {
    //** If statements
    if (button_NodeAdd.state != 1) return;

    if (pos.x < this.insertPoint.x) return;
    if (pos.y < this.insertPoint.y) return;

    //** Mark pos of bolt => set pos in unscaled pos
    let xPos_o = (pos.x - this.insertPoint.x) / 10;
    let yPos_o = (pos.y - this.insertPoint.y) / 10;

    //** Move in steps
    xPos_o = this.Step(xPos_o);
    yPos_o = this.Step(yPos_o);

    let xGraph = xPos_o * 10 + this.insertPoint.x;
    let yGraph = yPos_o * 10 + this.insertPoint.y;
    push();
    fill(100, 100, 100, 100);
    circle(xGraph, yGraph, boltGroup[0].d * scaleGeo);

    fill(0);
    circle(xGraph, yGraph, 4);

    textAlign(LEFT, CENTER);
    textSize(22);
    stroke(0);
    text(
      "[ " +
        nf((xPos_o / scaleGeo) * 10, 0, 0) +
        " ; " +
        nf((yPos_o / scaleGeo) * 10, 0, 0) +
        " ]",
      xGraph + 0.6 * boltGroup[0].d * scaleGeo,
      yGraph
    );
    pop();

    //** If statements
    if (oneTime) return;

    let id = boltGroup.length;
    boltGroup.push(new Bolt(xPos_o, yPos_o, id));
    oneTime = true;
  }

  DeleteBolt(pos) {
    //** If statements
    if (button_BoltDelete.state != 1) return;
    if (boltGroup.length <= 1) return;

    //** Else
    for (let i = boltGroup.length - 1; i >= 0; i--) {
      if (
        mouseIsPressed &&
        boltGroup[i].OverlapBolt(pos) &&
        oneClickBoltDelete
      ) {
        boltGroup.splice(i, 1);
        oneClickBoltDelete = false;
      }
    }

    //** Rename Bolt id
    for (let i = boltGroup.length - 1; i >= 0; i--) {
      boltGroup[i].id = i;
    }
  }

  MoveBolt(pos) {
    //** If statements
    if (this.logBoltId == null) return;
    if (button_BoltDelete.state == 1) return; //** If delete active => dont move
    if (plate.edgePointLocked != null) return;

    let xGraph = (pos.x - graph.insertPoint.x) / 10;
    let yGraph = (pos.y - graph.insertPoint.y) / 10;

    //** Move in steps
    xGraph = this.Step(xGraph);
    yGraph = this.Step(yGraph);

    boltGroup[this.logBoltId].pos_o.x = xGraph;
    boltGroup[this.logBoltId].pos_o.y = yGraph;

    //** HighLigth bolt while moved
    this.Highligth(this.logBoltId);
  }

  MoveLoad(pos) {
    if (this.logLoad == false) return;
    if (plate.edgePointLocked != null) return;

    let xGraph = (pos.x - graph.insertPoint.x) / 10;
    let yGraph = (pos.y - graph.insertPoint.y) / 10;

    //** Move in steps
    xGraph = this.Step(xGraph);
    yGraph = this.Step(yGraph);

    load.pos_Load.x = xGraph;
    load.pos_Load.y = yGraph;

    //** HighLigth Load while moved
    this.HighligthLoad();
  }

  OverlapLoad(pos) {
    //** Do not check for overlap if already overlap and logged
    if (this.logLoad) return;

    //** Do not check for overlap if Bolt logged
    if (this.logBoltId != null) return;

    let distToLoad = dist(
      pos.x,
      pos.y,
      load.pos_Load_scaledGraph.x,
      load.pos_Load_scaledGraph.y
    );
    if (distToLoad < 20) {
      this.HighligthLoad();
      if (mouseIsPressed) this.logLoad = true;
    }
  }

  OverlapBolt(pos) {
    //** Do not check for overlap if already overlap and logged
    if (this.logBoltId != null) return;

    //** Do not check for overlap if Load logged
    if (this.logLoad == true) return;

    //** Check for overlap
    this.overlapBoltId = undefined;
    for (let i = 0; i < boltGroup.length; i++) {
      let distToBolt = dist(
        pos.x,
        pos.y,
        boltGroup[i].pos_o_scaledGraph.x,
        boltGroup[i].pos_o_scaledGraph.y
      );
      if (distToBolt < 25) {
        //logBolt = true;
        this.overlapBoltId = i;
        if (mouseIsPressed) this.logBoltId = i; //** Log Bolt (Realeased in sketch)
        this.Highligth(i);

        //return true;
        //break;
      } else {
        //logBolt = false;
        //this.logBoltId = null;
        //return false;
      }
    }
  }

  Step(pos) {
    //stepSize = stepSize/(10/scaleGeo)
    pos = round(pos / stepSize) * stepSize;
    //console.log(pos)
    return pos;
  }

  Highligth(bolt) {
    //if(this.logBoltId == null) return;
    push();
    noStroke();
    fill(0, 255, 0, 100);

    if (button_BoltDelete.state == 1) fill(255, 0, 0, 100);
    circle(
      boltGroup[bolt].pos_o_scaledGraph.x,
      boltGroup[bolt].pos_o_scaledGraph.y,
      50
    );
    pop();
  }

  HighligthLoad() {
    push();
    noStroke();
    fill(0, 255, 0, 100);
    circle(load.pos_Load_scaledGraph.x, load.pos_Load_scaledGraph.y, 50);
    pop();
  }

}
