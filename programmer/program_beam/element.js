class Element {
  constructor(startX, startY, endX, endY, E, I, id) {
    this.id = id;
    this.fixPointsDiameter = 20;

    this.E = E;
    this.I = I;
    this.EI = E * I;

    this.stepChange = 5;

    //**ID point
    this.fixPointWall_ID_pos = new p5.Vector(0, 0);
    this.fixPointWall_ID_radius = 30;

    //**ElementPos
    this.startPos = new p5.Vector(startX, startY);
    this.endPos = new p5.Vector(endX, endY);

    //**ElemenetNodes Id so that position in stiffnessMatrix_Global
    //**determined in class calculation method unknowns().
    this.startNodeId = 0;
    this.endNodeId = 0;

    //**Charniers
    this.charnierLeft = false;
    this.charnierRight = false;

    //**ElementPosDef
    this.startPosDef = new p5.Vector(0, 0);
    this.endPosDef = new p5.Vector(0, 0);

    //**ElementDef and elementMoment calculated in calculation.ResultDef(matrix_x,elements) -Diff. equ.
    this.elementDef = [];
    this.elementMoment = [];
    this.elementShear = [];

    this.elementVector = new p5.Vector.sub(this.endPos, this.startPos);
    this.elementVectorUnit = this.elementVector.copy().normalize();
    this.elementAngleRadians = this.elementVector.heading();
    this.elementAngleDegrees = (this.elementAngleRadians * 180) / PI;

    this.elementVectorNormal = this.elementVector.copy().rotate(-PI / 2);
    this.elementVectorNormalUnit = this.elementVectorNormal.copy().normalize();

    this.elementLength = this.elementVector.mag(); //**100pix = 1000mm = 1m
    this.elementLengthAdjusted;

    this.centerPos = p5.Vector.add(
      this.startPos,
      p5.Vector.mult(this.elementVectorUnit, 0.5 * this.elementLength)
    );

    this.stiffnessMatrix_Local = [];
    this.matrixSize = 4;

    //**start and end moment
    this.m1 = 0; //**Start
    this.m2 = 0; //**End

    //**Stiff-stiff conection
    this.matrixMomentStiffStiff_1 = [];
    this.matrixMomentStiffStiff_2 = [];

    //**start and end shear
    this.v1 = 0; //**Start
    this.v2 = 0; //**End

    //**Stiff-stiff conection
    this.matrixShearStiffStiff_1 = [];
    this.matrixShearStiffStiff_2 = [];

    //**EigenValue
    this.massMatrix_Local = [];
    this.lumpedMassMatrix_Local = [];

    this.loadLineSum = 0; //**calculated in matrixLoad
    this.loadPointSumLeft = 0;
    this.loadPointSumRight = 0;

    //** Scale used in calculation.ResultDefLoad();
    this.scaleGeo = 1;
  }

  DataUpdate() {
    this.E = buttonRollor_E.ReadValue() * 1000; //** x10^3
    this.I = buttonRollor_I.ReadValue() * 1000000; //** x10^6
    this.scaleGeo = buttonRollor_scaleGeo.ReadValue();

    this.elementVector = new p5.Vector.sub(this.endPos, this.startPos);
    this.elementLength = this.elementVector.mag() * (this.scaleGeo * 10); //**100pix = 1000mm = 1m

    //** AdjustedLength determined in changesystem.AdjustPosToScale(elements)
    //this.elementLength = this.elementLengthAdjusted * 10;

    //this.stepChange = this.stepChange*this.scaleGeo
    //console.log(this.scaleGeo)

    this.centerPos = p5.Vector.add(
      this.startPos,
      p5.Vector.mult(
        this.elementVectorUnit,
        (0.5 * this.elementLength) / (this.scaleGeo * 10)
      )
    );

    this.stepChange = 5;

    this.EI = this.E * this.I;

    this.StiffnessMatrixLocal();
    this.MatrixMomentStiffStiff();
    this.MatrixShearStiffStiff();

    //**For calc eigenValues
    this.StiffnessMatrixLocalEigen();
    this.MassMatrixLocal();
    this.LumpesMassMatrixLocal();
  }

  DataUpdateReinforced() {
    this.E = buttonRollor_E1.ReadValue() * 1000; //** x10^3
    this.I = buttonRollor_I1.ReadValue() * 1000000; //** x10^6
    this.scaleGeo = buttonRollor_scaleGeo.ReadValue();

    this.elementVector = new p5.Vector.sub(this.endPos, this.startPos);
    this.elementLength = this.elementVector.mag() * (this.scaleGeo * 10); //**100pix = 1000mm = 1m

    //** AdjustedLength determined in changesystem.AdjustPosToScale(elements)
    //this.elementLength = this.elementLengthAdjusted * 10;

    //this.stepChange = this.stepChange*this.scaleGeo
    //console.log(this.scaleGeo)

    this.centerPos = p5.Vector.add(
      this.startPos,
      p5.Vector.mult(
        this.elementVectorUnit,
        (0.5 * this.elementLength) / (this.scaleGeo * 10)
      )
    );

    this.stepChange = 5;

    this.EI = this.E * this.I;

    
    this.StiffnessMatrixLocal();
    this.MatrixMomentStiffStiff();
    this.MatrixShearStiffStiff();

    //**For calc eigenValues
    this.StiffnessMatrixLocalEigen();
    this.MassMatrixLocal();
    this.LumpesMassMatrixLocal();
  }

  Display() {
    push();
    //scale(100 / this.scaleMesure); //**100/this.scaleMesure

    //**element_Start, element_Center and element_End fixPoin
    strokeWeight(1);
    noFill();
    stroke(100);
    circle(this.startPos.x, this.startPos.y, this.fixPointsDiameter);

    //circle(this.centerPos.x, this.centerPos.y, this.fixPointsDiameter);
    circle(this.endPos.x, this.endPos.y, this.fixPointsDiameter);

    //**Plot ID
    textSize(20);
    //text(this.id, this.centerPos.x, this.centerPos.y - 20);

    //**Plot nodeNumber
    //fill(0)
    //text(this.startNodeId, this.startPos.x + 15, this.startPos.y + 25);
    //text(this.endNodeId, this.endPos.x - 20, this.endPos.y + 25);

    //**NodeCoordinates
    /*
    text(nf(this.startPos.x, 0, 1), this.startPos.x + 10, this.startPos.y + 50);
    textAlign(RIGHT)
    text(nf(this.endPos.x,0,1), this.endPos.x - 20, this.endPos.y + 50);
    */

    //**Element
    stroke(50);
    strokeWeight(5);

    circle(this.startPos.x, this.startPos.y, 4);
    circle(this.endPos.x, this.endPos.y, 4);
    line(this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y);

    pop();
  }

  DisplayReinforced() {
    push();
    //scale(100 / this.scaleMesure); //**100/this.scaleMesure

    //**element_Start, element_Center and element_End fixPoin
    strokeWeight(1);
    noFill();
    stroke(100);
    //circle(this.startPos.x, this.startPos.y, this.fixPointsDiameter);

    //circle(this.centerPos.x, this.centerPos.y, this.fixPointsDiameter);
    //circle(this.endPos.x, this.endPos.y, this.fixPointsDiameter);

    //**Plot ID

    //**Element
    stroke(50);
    strokeWeight(5);

    circle(this.startPos.x, this.startPos.y, 4);
    circle(this.endPos.x, this.endPos.y, 4);
    stroke(0, 0, 255, 150);
    line(this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y);

    pop();
  }

  DisplayStiffnesMatrix(elementNumber) {
    //**Display matrix

    this.insertPoint = new p5.Vector(20, 20);
    this.space = 60;

    // noprotect
    for (let row = 0; row < this.matrixSize; row++) {
      for (let col = 0; col < this.matrixSize; col++) {
        text(
          nfp(this.stiffnessMatrix_Local[row][col].toExponential(2)),
          this.insertPoint.x + 250 * elementNumber + this.space * col,
          this.insertPoint.y + 20 * row
        );
      }
    }
  }

  ReadNodeId(pos) {
    let nodeId = -1;
    //**Wall_Start FixPoint
    let distToStart = dist(this.startPos.x, this.startPos.y, pos.x, pos.y);
    //console.log("distToStart: " + distToStart)
    if (distToStart < 1 * this.fixPointsDiameter) nodeId = this.startNodeId;

    //**Wall_End FixPoint
    let distToEnd = dist(this.endPos.x, this.endPos.y, pos.x, pos.y);
    if (distToEnd < 1 * this.fixPointsDiameter) nodeId = this.endNodeId;

    //**Returns -1 if no match
    return nodeId;
  }

  Overlap(pos) {
    //**Wall_Start FixPoint
    let distToStart = dist(this.startPos.x, this.startPos.y, pos.x, pos.y);
    //console.log("distToStart: " + distToStart)
    if (distToStart < 1 * this.fixPointsDiameter) return true;

    //**Wall_End FixPoint
    let distToEnd = dist(this.endPos.x, this.endPos.y, pos.x, pos.y);
    if (distToEnd < 1 * this.fixPointsDiameter) return true;
    /*
    //**Wall_Center FixPoint
    let distToCenter = dist(this.centerPos.x, this.centerPos.y, pos.x, pos.y);
    if (distToCenter < 1 * this.fixPointsDiameter) return true;
*/
    //**
    else return false;
  }

  OverlapLeftNode(pos) {
    //**Wall_Start FixPoint
    let distToStart = dist(this.startPos.x, this.startPos.y, pos.x, pos.y);
    if (distToStart < 1 * this.fixPointsDiameter) return true;
    else return false;
  }

  OverlapRightNode(pos) {
    //**Wall_End FixPoint
    let distToEnd = dist(this.endPos.x, this.endPos.y, pos.x, pos.y);
    if (distToEnd < 1 * this.fixPointsDiameter) return true;
    else return false;
  }

  OverlapHighlight(pos) {
    //**Wall_Start FixPoint
    let distToStart = dist(this.startPos.x, this.startPos.y, pos.x, pos.y);
    if (distToStart < 1 * this.fixPointsDiameter) {
      push();
      //scale(100 / this.scaleMesure); //**100/this.scaleMesure

      fill(100, 100, 100, 100);
      circle(this.startPos.x, this.startPos.y, this.fixPointsDiameter);
      if (mouseIsPressed) {
        fill(0, 255, 0, 50);
        circle(this.startPos.x, this.startPos.y, this.fixPointsDiameter);
      }
      pop();
    }

    //**Wall_End FixPoint
    let distToEnd = dist(this.endPos.x, this.endPos.y, pos.x, pos.y);
    if (distToEnd < 1 * this.fixPointsDiameter) {
      push();
      //scale(100 / this.scaleMesure); //**100/this.scaleMesure

      fill(100, 100, 100, 100);
      circle(this.endPos.x, this.endPos.y, this.fixPointsDiameter);
      if (mouseIsPressed) {
        fill(0, 255, 0, 50);
        circle(this.endPos.x, this.endPos.y, this.fixPointsDiameter);
      }
      pop();
    }
  }

  MatrixMomentStiffStiff() {
   // console.log("element line 323: " + this.EI)
    let f2 = this.EI / pow(this.elementLength, 2);
    let f1 = this.EI / this.elementLength;

    //**No Charnier
    //** m1 Left node
    if (this.charnierLeft == false && this.charnierRight == false) {
      this.m11 = 6 * f2;
      this.m12 = 4 * f1;
      this.m13 = -6 * f2;
      this.m14 = 2 * f1;
    }

    //** m2 Right node
    if (this.charnierLeft == false && this.charnierRight == false) {
      this.m21 = -6 * f2;
      this.m22 = -2 * f1;
      this.m23 = 6 * f2;
      this.m24 = -4 * f1;
    }

    //**Charnier LEFT
    //** m1 Left node
    if (this.charnierLeft == true && this.charnierRight == false) {
      this.m11 = 0 * f2;
      this.m12 = 0 * f1;
      this.m13 = -0 * f2;
      this.m14 = 0 * f1;
    }

    //** m2 Right node
    if (this.charnierLeft == true && this.charnierRight == false) {
      this.m21 = -3 * f2;
      this.m22 = 0 * f1;
      this.m23 = 3 * f2;
      this.m24 = -3 * f1;
    }

    //**Charnier RIGHT
    //** m1 Left node
    if (this.charnierLeft == false && this.charnierRight == true) {
      this.m11 = 3 * f2;
      this.m12 = 3 * f1;
      this.m13 = -3 * f2;
      this.m14 = 0 * f1;
    }

    //** m2 Right node
    if (this.charnierLeft == false && this.charnierRight == true) {
      this.m21 = -0 * f2;
      this.m22 = 0 * f1;
      this.m23 = 0 * f2;
      this.m24 = -0 * f1;
    }

    this.matrixMomentStiffStiff_1 = [this.m11, this.m12, this.m13, this.m14];
    this.matrixMomentStiffStiff_2 = [this.m21, this.m22, this.m23, this.m24];
  }

  MatrixShearStiffStiff() {
    let f3 = this.EI / pow(this.elementLength, 3); //** N/mm
    let f2 = this.EI / pow(this.elementLength, 2);

    //** m1 Left node
    this.v11 = -12 * f3;
    this.v12 = -6 * f2;
    this.v13 = 12 * f3;
    this.v14 = -6 * f2;

    //** m2 Right node
    this.v21 = -12 * f3;
    this.v22 = -6 * f2;
    this.v23 = 12 * f3;
    this.v24 = -6 * f2;

    this.matrixShearStiffStiff_1 = [this.v11, this.v12, this.v13, this.v14];
    this.matrixShearStiffStiff_2 = [this.v21, this.v22, this.v23, this.v24];
  }

  StiffnessMatrixLocal() {
    //**stiffnessMAtrix_Local
    let f3 = this.EI / pow(this.elementLength, 3); //** N/mm
    let f2 = this.EI / pow(this.elementLength, 2);
    let f1 = this.EI / this.elementLength;

    //**Add Charnier fastsat i sketch add Charnier
    if (this.charnierLeft == false && this.charnierRight == false) {
      this.z11 = 12 * f3;
      this.z12 = 6 * f2;
      this.z13 = -12 * f3;
      this.z14 = 6 * f2;

      this.z21 = this.z12;
      this.z22 = 4 * f1;
      this.z23 = -6 * f2;
      this.z24 = 2 * f1;

      this.z31 = this.z13;
      this.z32 = this.z23;
      this.z33 = 12 * f3;
      this.z34 = -6 * f2;

      this.z41 = this.z14;
      this.z42 = this.z24;
      this.z43 = this.z34;
      this.z44 = 4 * f1;
    }

    if (this.charnierLeft == true && this.charnierRight == false) {
      this.z11 = 3 * f3;
      this.z12 = 0 * f2;
      this.z13 = -3 * f3;
      this.z14 = 3 * f2;

      this.z21 = this.z12;
      this.z22 = 0 * f1;
      this.z23 = 0 * f2;
      this.z24 = 0 * f1;

      this.z31 = this.z13;
      this.z32 = this.z23;
      this.z33 = 3 * f3;
      this.z34 = -3 * f2;

      this.z41 = this.z14;
      this.z42 = this.z24;
      this.z43 = this.z34;
      this.z44 = 3 * f1;
    }

    this.stiffnessMatrix_Local = [
      [this.z11, this.z12, this.z13, this.z14],
      [this.z21, this.z22, this.z23, this.z24],
      [this.z31, this.z32, this.z33, this.z34],
      [this.z41, this.z42, this.z43, this.z44],
    ];
  }

  StiffnessMatrixLocalEigen() {
    //**stiffnessMAtrix_Local
    let f3 = (this.EI * 1e-6) / pow(this.elementLength * 1e-3, 3); //** N/m
    let f2 = (this.EI * 1e-6) / pow(this.elementLength * 1e-3, 2);
    let f1 = (this.EI * 1e-6) / pow(this.elementLength * 1e-3, 1);

    //**Add Charnier fastsat i sketch add Charnier
    if (this.charnierLeft == false && this.charnierRight == false) {
      this.z11e = 12 * f3;
      this.z12e = 6 * f2;
      this.z13e = -12 * f3;
      this.z14e = 6 * f2;

      this.z21e = this.z12e;
      this.z22e = 4 * f1;
      this.z23e = -6 * f2;
      this.z24e = 2 * f1;

      this.z31e = this.z13e;
      this.z32e = this.z23e;
      this.z33e = 12 * f3;
      this.z34e = -6 * f2;

      this.z41e = this.z14e;
      this.z42e = this.z24e;
      this.z43e = this.z34e;
      this.z44e = 4 * f1;
    }

    if (this.charnierLeft == true && this.charnierRight == false) {
      this.z11e = 3 * f3;
      this.z12e = 0 * f2;
      this.z13e = -3 * f3;
      this.z14e = 3 * f2;

      this.z21e = this.z12e;
      this.z22e = 0 * f1;
      this.z23e = 0 * f2;
      this.z24e = 0 * f1;

      this.z31e = this.z13e;
      this.z32e = this.z23e;
      this.z33e = 3 * f3;
      this.z34e = -3 * f2;

      this.z41e = this.z14e;
      this.z42e = this.z24e;
      this.z43e = this.z34e;
      this.z44e = 3 * f1;
    }

    this.stiffnessMatrixEigen_Local = [
      [this.z11e, this.z12e, this.z13e, this.z14e],
      [this.z21e, this.z22e, this.z23e, this.z24e],
      [this.z31e, this.z32e, this.z33e, this.z34e],
      [this.z41e, this.z42e, this.z43e, this.z44e],
    ];
  }

  //**Consistent MassMatrix CMM
  MassMatrixLocal() {
    //**MassMAtrix_Local
    let my = matrixEigen.mass; //**kg/m

    //**Calculated in matrixLoad.LoadSumElement();
    let loadLineSum = this.loadLineSum * 100; //**kg/m assumption 1kN = 100 kg

    //console.log(my)
    let f3 = ((my + loadLineSum) * pow(this.elementLength * 1e-3, 3)) / 420;
    let f2 = ((my + loadLineSum) * pow(this.elementLength * 1e-3, 2)) / 420;
    let f1 = ((my + loadLineSum) * pow(this.elementLength * 1e-3, 1)) / 420;

    if (this.charnierLeft == false && this.charnierRight == false) {
      this.mass11 = 156 * f1;
      this.mass12 = 22 * f2;
      this.mass13 = 54 * f1;
      this.mass14 = -13 * f2;

      this.mass21 = this.mass12;
      this.mass22 = 4 * f3;
      this.mass23 = 13 * f2;
      this.mass24 = -3 * f3;

      this.mass31 = this.mass13;
      this.mass32 = this.mass23;
      this.mass33 = 156 * f1;
      this.mass34 = -22 * f2;

      this.mass41 = this.mass14;
      this.mass42 = this.mass24;
      this.mass43 = this.mass34;
      this.mass44 = 4 * f3;
    }

    this.massMatrix_Local = [
      [this.mass11, this.mass12, this.mass13, this.mass14],
      [this.mass21, this.mass22, this.mass23, this.mass24],
      [this.mass31, this.mass32, this.mass33, this.mass34],
      [this.mass41, this.mass42, this.mass43, this.mass44],
    ];
  }

  //**Lumped MassMatrix LMM
  LumpesMassMatrixLocal() {
    //**MassMAtrix_Local
    let my = matrixEigen.mass; //**kg/m
    //console.log(my)

    let f1 = (my * pow(this.elementLength * 1e-3, 1)) / 2;
    this.lumpedMass11 = f1;
    this.lumpedMass33 = f1;
    this.lumpedMassMatrix_Local = [
      [f1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, f1, 0],
      [0, 0, 0, 0],
    ];

    //  console.log(this.lumpedMass11)
  }

  //**Called from changeSytem.ElementChangeLength
  ChangePos(pos) {
    let distToStart = dist(this.startPos.x, this.startPos.y, pos.x, pos.y);
    let distToEnd = dist(this.endPos.x, this.endPos.y, pos.x, pos.y);

    //let distToCenter = dist(this.centerPos.x, this.centerPos.y, pos.x, pos.y);
    //let tolerance = 0 * this.stepChange;
    let stepScaled = this.stepChange; /// this.scaleGeo;

    /*
    if(mouseX-pmouseX > 2) stepScaled = 20
    else stepScaled = this.stepChange
    console.log(mouseX-pmouseX)
    */
    //console.log("ChangePos");
    if (distToStart < 1 * this.fixPointsDiameter) {
      //**StepMove
      if (this.startPos.x - pos.x > 0) this.startPos.x -= stepScaled;
      if (this.startPos.x - pos.x < 0) this.startPos.x += stepScaled;
      //if (this.startPos.y - pos.y > 0) this.startPos.y -= this.stepChange;
      //if (this.startPos.y - pos.y < 0) this.startPos.y += this.stepChange;
    }
    if (distToEnd < 1 * this.fixPointsDiameter) {
      //**StepMove
      if (this.endPos.x - pos.x > 0) this.endPos.x -= stepScaled;
      if (this.endPos.x - pos.x < 0) this.endPos.x += stepScaled;
      //if (this.endPos.y - pos.y > 0) this.endPos.y -= this.stepChange;
      //if (this.endPos.y - pos.y < 0) this.endPos.y += this.stepChange;
    }

    //console.log("*")
    /*
    if (distToCenter < 1 * this.fixPointsDiameter) {
      //**StepMove
      if (this.centerPos.x - pos.x > tolerance)
        this.centerPos.x -= this.stepChange;
      if (this.centerPos.x - pos.x < tolerance)
        this.centerPos.x += this.stepChange;
      if (this.centerPos.y - pos.y > tolerance)
        this.centerPos.y -= this.stepChange;
      if (this.centerPos.y - pos.y < tolerance)
        this.centerPos.y += this.stepChange;
      this.startPos = p5.Vector.add(this.centerPos, this.wallVector.mult(-0.5));
      this.endPos = p5.Vector.add(this.centerPos, this.wallVector.mult(-1));
    }
    */
    //**Update after change
    //this.DataUpdate();
  }

  ExpAdjust(pos) {
    let logNode = this.ReadNodeId(pos);
    //console.log(logNode);

    //**If movement read Pos
    let testMoveDirection = mouseX - pmouseX;
    if (testMoveDirection != 0) {
      let Ao_x = testMoveDirection;
      let countDamping = 0.1;
      let factor = 10;

      //this.startPos.x += 5
      let test = Ao_x * exp(-1 * countDamping) * factor;
      //console.log(test);
      return test;
    }
  }
}
