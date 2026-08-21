class MatrixEigenValue {
  constructor() {
    this.resultDeterminant = []; //[[x1,det1],[x2,det2],...]
    this.resultEigenValuesTemp = []; //[[x1,eig1],[x2,eig2],...]
    this.resultEigenValues = [];

    this.insertEigen = new p5.Vector(1000, 2700);
    this.scaleEigen = 1;
    this.axisStrokeWeight = 2;

    this.posMass = new p5.Vector(1000, 3000);
    this.mass = 1;

    //**Position of text after axis
    this.endX = 0;
    this.endY = 0;

    /*
    this.buttonRollor_mass = new ButtonRollor(
      (pos1x = 20), //** textPro BR
      (pos1y = 0), //** textPro BR
      (pos2x = 20), //** "=" BR
      (pos3x = 155), //** ciffers BL
      (pos4x = 165), //** unit BR
      (prefix = 4),
      (sufix = 1),
      (buttonWidth = 20),
      (buttonHeight = 40),
      (letterSize = 30),
      (textPro = "mass"),
      (textMid = "="),
      (textPre = "kg/m"),
      (startValue = 100),
      (minValue = 1),
      (maxValue = 9999)
    );
    */

    this.buttonRollor_mass = new ButtonRollor(
      -70, //** x textPro BR
      0, //** y textPro BR
      10, //** "=" BR
      150, //** ciffers BL
      165, //** unit BR
      4, //** Prefix
      1, //**Suffix
      20, //**buttonWidth
      40, //**buttonHeight
      30, //**letterSize
      "Mass", //**textPro
      "=", //**textMid
      "kg/m", //**textPre
      0, //**startValue
      0, //**minValue
      9999 //**maxValue
    );
  }

  DisplayInputValues() {
    //** Called from sketch

    push();
    translate(this.insertEigen.x - 125, this.insertEigen.y + 230);

    //**Display E [N/m2],
    textSize(30);
    text("E = ", 0, 50);
    textAlign(RIGHT);
    text(nf(buttonRollor_E.value, 0, 1), 130, 50);

    text("x 10", 200, 50);
    textSize(20);
    text("9", 215, 35);
    textAlign(LEFT);

    textSize(30);
    text("N/m", 230, 50);
    textSize(20);
    text("2", 285, 35);

    //**Display I [m4]
    textSize(30);
    text("I = ", 0, 100);
    textAlign(RIGHT);
    text(nf(buttonRollor_I.value, 0, 1), 130, 100);

    text("x 10", 200, 100);
    textSize(20);
    text("-6", 222, 85);
    textAlign(LEFT);

    textSize(30);
    text("m", 230, 100);
    textSize(20);
    text("4", 255, 85);

    pop();
  }

  DisplayButtonRollor() {
    //**ButtonRollor msss
    push();
    let translatePointMass = new p5.Vector();
    translatePointMass.x = this.endX + 150;
    translatePointMass.y = this.endY + 17.5;
    translate(translatePointMass.x, translatePointMass.y);

    this.graphPosNoScale = new p5.Vector.sub(mousePosWorld, translatePointMass);
    this.buttonRollor_mass.DisplayButonRollor(this.graphPosNoScale);

    //**ButtonRollor ReadValue
    this.mass = this.buttonRollor_mass.ReadValue(); //**Mass

    pop();
  }

  CalcDeterminant(stiffMatrix, massMatrix, n) {
    let x = 0.0;
    this.resultDeterminant = [];

    //**UnitCorrection form EI/L3

    //** det[ K - w2 M] = 0
    // noprotect
    for (let i = 0; i < n; i++) {
      x += 1;
      let w2_M = this.MatrixMultConst(massMatrix, pow(x, 2));
      let K_sub_w2_M = this.MatrixSub(stiffMatrix, w2_M);
      let det = this.MatrixDeterminant(K_sub_w2_M);
      this.resultDeterminant.push([x, det]);
    }

    this.DisplayDeterminant();
    //console.table(this.resultDeterminant)
  }

  DisplayDeterminant() {
    //**Find min/max
    let maxi = 0;
    let mini = Infinity;

    for (
      let i = 0, length_1 = this.resultDeterminant.length;
      i < length_1;
      i++
    ) {
      if (this.resultDeterminant[i][1] > maxi)
        maxi = this.resultDeterminant[i][1];
      if (this.resultDeterminant[i][1] < mini)
        mini = this.resultDeterminant[i][1];
    }
    let adjustX = 1;
    let adjustY = 1;
    if (abs(mini) < abs(maxi)) adjustY = abs(maxi);
    else adjustY = abs(mini);

    push();
    for (
      let i = 0, length = this.resultDeterminant.length - 1;
      i < length;
      i++
    ) {
      let y0 =
        this.insertEigen.y + (200 * this.resultDeterminant[i][1]) / adjustY;
      let y1 =
        this.insertEigen.y + (200 * this.resultDeterminant[i + 1][1]) / adjustY;

      line(
        this.insertEigen.x + 100 + this.resultDeterminant[i][0] / adjustX,
        y0,
        this.insertEigen.x + 100 + this.resultDeterminant[i + 1][0] / adjustX,
        y1
      );
    }
    //**Axis
    stroke(0);
    strokeWeight(this.axisStrokeWeight);

    //**Horsontal
    line(
      this.insertEigen.x + 95,
      this.insertEigen.y,
      this.insertEigen.x + 95 + 500,
      this.insertEigen.y
    );

    //**Vertical
    line(
      this.insertEigen.x + 100,
      this.insertEigen.y + 200,
      this.insertEigen.x + 100,
      this.insertEigen.y - 200
    );

    pop();
    //**AxisText Horisontal
    push();
    textSize(30);
    textAlign(LEFT, CENTER);
    this.endX =
      this.insertEigen.x +
      120 +
      this.resultDeterminant[this.resultDeterminant.length - 1][0] / adjustX;
    this.endY = this.insertEigen.y;
    text("\u03c9", this.endX, this.endY);
    pop();

    //**HeadLineGraph
    push();
    textSize(30);
    textAlign(LEFT, BASELINE);
    text("EigenValue", this.insertEigen.x + -125, this.insertEigen.y - 220);
    pop();

    //**AxisText Vertical
    push();
    textSize(30);
    textAlign(LEFT, CENTER);

    text(
      "det | [K] -     [M] |",
      this.insertEigen.x + 120,
      this.insertEigen.y - 200
    );
    text("\u03c9", this.insertEigen.x + 245, this.insertEigen.y - 200);
    textSize(20);
    text("2", this.insertEigen.x + 270, this.insertEigen.y - 210);
    pop();

    //**AxisValue
    for (let i = 0; i < this.resultEigenValues.length; i++) {
      push();
      fill(0);
      let xVal = this.insertEigen.x + 100 + this.resultEigenValues[i] / adjustX;
      //console.log(this.resultEigenValues[0]/adjustX)
      circle(xVal, this.insertEigen.y, 8);

      textSize(25);
      textAlign(RIGHT, CENTER);
      let w = this.resultEigenValues[i] / 1;
      text("" + nf(w, 0, 1), xVal + 50, this.insertEigen.y + 30 + 60 * i);

      text(
        "" + nf(w / (2 * PI), 0, 1),
        xVal + 50,
        this.insertEigen.y + 60 + 60 * i
      );
      textAlign(LEFT, CENTER);
      text("rad/sek", xVal + 60, this.insertEigen.y + 30 + 60 * i);
      text("Hz", xVal + 60, this.insertEigen.y + 60 + 60 * i);
      line(xVal, this.insertEigen.y, xVal, this.insertEigen.y + 60 * i + 10);
      pop();
      //console.log(this.resultEigenValues[0])
    }
    //**Name
    push();
    noFill();
    stroke(0);
    strokeWeight(1);
    circle(this.insertEigen.x - 100, this.insertEigen.y, 50);

    textAlign(CENTER, CENTER);
    textSize(35);
    fill(50);

    text("\u03c9", this.insertEigen.x - 100, this.insertEigen.y); //Omega loweCase UNICODE: 03c9

    line(
      this.insertEigen.x + 75,
      this.insertEigen.y,
      this.insertEigen.x - 75,
      this.insertEigen.y
    );
    pop();
  }

  EigenValue() {
    //**Find values where sign change and make fine elementIntervals until tol <xxxx%
    this.resultEigenValues = [];
    this.resultEigenValuesTemp = [];
    for (
      let i = 0, length = this.resultDeterminant.length;
      i < length - 1;
      i++
    ) {
      let sign_i = this.resultDeterminant[i][1];
      let sign_i1 = this.resultDeterminant[i + 1][1];

      //**Detect Change in sign (=> find zero)
      if (sign_i * sign_i1 < 0) {
        this.resultEigenValuesTemp.push(this.resultDeterminant[i]);
        this.resultEigenValuesTemp.push(this.resultDeterminant[i + 1]);
      }
    }
    //console.table(this.resultEigenValuesTemp);

    //**Lineær regression => estimere nulpunkt y=Ax+B
    for (let i = 0; i < this.resultEigenValuesTemp.length - 1; i += 2) {
      let x1 = this.resultEigenValuesTemp[i][0];
      let y1 = this.resultEigenValuesTemp[i][1];
      let x2 = this.resultEigenValuesTemp[i + 1][0];
      let y2 = this.resultEigenValuesTemp[i + 1][1];

      let A = (y2 - y1) / (x2 - x1);
      let B = y1;

      let xNew = x1 - B / A;
      let w = xNew;
      let T = (2 * PI) / w;
      let fe = 1 / T;

      this.resultEigenValues.push(w);
    }
    //console.log(this.resultEigenValues);
  }

  MatrixDeterminant(A) {
    //**Make zeroLowerMatrix => determ = diagonalelements mult
    let size = A[0].length;
    let rows = A.length;
    let cols = A[0].length;

    // noprotect
    for (let runs = 0; runs < size; runs++) {
      //RowOperations Start
      for (let row = 1 + runs; row < size; row++) {
        let a = A[row][runs] / A[runs][runs]; //diagonal element
        for (let col = 0; col < size; col++) {
          A[row][col] -= a * A[runs][col];
        };
      };
      //RowOperations End
    };

    /*
    console.table(A)
    console.log("1. " + A[0][0]/pow(L,2)*(pow(E*I/1,0.5)))
    console.log("2. " + A[1][1]/pow(L,2)*(pow(E*I/1,0.5)))
*/
    let determ = 1;
    for (let i = 0; i < size; i++) {
      determ *= A[i][i];
    }
    return determ;
  }

  MatrixMultConst(A, Aconst) {
    let C = [];
    let rows = A.length;
    let cols = A[0].length;

    // noprotect
    for (let row = 0; row < rows; row++) {
      C[row] = [];
      for (let col = 0; col < cols; col++) {
        C[row][col] = A[row][col] * Aconst;
      };
    };
    return C;
  }

  //**sub C=A-B
  MatrixSub(A, B) {
    let C = [];
    let rows = A.length;
    let cols = A[0].length;

    // noprotect
    for (let row = 0; row < rows; row++) {
      C[row] = [];
      for (let col = 0; col < cols; col++) {
        C[row][col] = A[row][col] - B[row][col];
      };
    };
    return C;
  }

  DisplayMatrix(posX, posY, matrix, name) {
    //**Display matrix
    push();
    noStroke();
    textSize(15);
    textAlign(RIGHT);
    this.insertPoint = new p5.Vector(posX, posY);
    this.space = 75;

    let rows = matrix.length;
    let cols = matrix[0].length;

    // noprotect
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let value = matrix[row][col];
        if (value != 0) {
          text(
            nfp(matrix[row][col].toExponential(2)),
            this.insertPoint.x + this.space * col - 7.7,
            this.insertPoint.y + 25 * row
          );
        } else {
          text(
            value,
            this.insertPoint.x + this.space * col - 7.5,
            this.insertPoint.y + 25 * row
          );
        };
      };
    };

    //**HeaderText
    textAlign(LEFT);
    textSize(20);
    text(name, this.insertPoint.x - 100, this.insertPoint.y - 80);
    text("Matrix", this.insertPoint.x - 100, this.insertPoint.y - 50);

    //**Lines
    stroke(0);
    strokeWeight(2);
    for (let i = 0; i < 2; i++) {
      line(
        i * cols * 100 + this.insertPoint.x - this.space,
        this.insertPoint.y - 25,
        i * cols * 100 + this.insertPoint.x - this.space,
        this.insertPoint.y + 25 * (rows - 1) + 10
      );
    }

    pop();
  }
}
