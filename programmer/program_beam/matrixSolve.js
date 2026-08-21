 /*
let matrix_A;
let matrix_B;

function setup() {
  createCanvas(400, 400);

  matrixSolve = new Matrix(); //** MatrixSolve Ax=B
}

function draw() {
  background(220);
  frameRate(1);

  //**Ex.2.22 from LA
  matrix_A = [
    [2, -3, 1, 8],
    [6, -6, 4, 6],
    [3, 0, 6, 6],
    [-3, 6, 4, 4],
  ];

  matrix_B = [[21], [-6], [3], [19]];

  //**Solution matrix_x = [[-1], [2], [-3], [4]];

  matrixSolve.InputData(matrix_A, matrix_B);
  matrixSolve.ForwardElimination();
  matrixSolve.BackwardSubstitution();
  matrixSolve.DisplayMatrix();

  //console.table(matrixSolve.matrix_A_Changed)
}
*/

class Matrix {
  constructor() {
    this.size = 0; //**evaluated in method InputData

    this.insertPoint = new p5.Vector(20, 20);
    this.space = 22;

    this.matrix_A = [];
    this.matrix_B = [];

    this.matrix_A_Changed = [];
    this.matrix_B_Changed = [];

    this.matrix_x = [];
    this.matrix_U = [];
  } //constructor End

  /*
  DisplayMatrix() {
    line(
      this.insertPoint.x + this.size * this.space-5,
      this.insertPoint.y - 5,
      this.insertPoint.x + this.size * this.space-5,
      this.insertPoint.y + (this.size - 1) * this.space + 5
    );

    line(
      this.insertPoint.x + this.size * this.space-5,
      this.insertPoint.y + (this.size + 1) * this.space - 5,
      this.insertPoint.x + this.size * this.space-5,
      this.insertPoint.y + 2 * this.size * this.space + 5
    );

    textAlign(RIGHT,CENTER);
    //console.log("DisplayMatrix START, size =", this.size);
    // noprotect
    for (let row = 0; row < this.size; row++) {
      //console.log("Display A row =", row);
      for (let col = 0; col < this.size; col++) {
        //**matrix_A
        text(
          this.matrix_A[row][col],
          this.insertPoint.x + this.space * col,
          this.insertPoint.y + row * this.space
        );

        if (col == 0) {
          //**matrix_B
          text(
            this.matrix_B[row][col],
            this.insertPoint.x +
              (this.size + 1) * this.space +
              this.space * col,
            this.insertPoint.y + row * this.space
          );

          //**matrix_B_Changed
          text(
            this.matrix_B_Changed[row][col],
            this.insertPoint.x +
              (this.size + 1) * this.space +
              this.space * col,
            this.insertPoint.y + (this.size + 1) * this.space + row * this.space
          );
        };

        //**matrix_U
        text(
          this.matrix_U[row][col],
          this.insertPoint.x + this.space * col,
          this.insertPoint.y + (this.size + 1) * this.space + row * this.space
        );
      };
    };

    //**Display matrix_x
    // noprotect
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < 1; col++) {
                  text(
            this.matrix_x[row][col],
            this.insertPoint.x +
              (this.size + 1) * this.space +
              this.space * col,
            this.insertPoint.y + (this.size +6) * this.space + row * this.space
          );
      };
    };
    //console.log("DisplayMatrix END, size =", this.size);
  } //Method End
*/
  InputData(matrix_A, matrix_B) {
    //** InfiniteLoop problem try to solve
    //console.log("Matrix solve line 124 - InputData:", matrix_A.length);
    this.size = matrix_A.length;
  
    // noprotect
    for (let row = 0; row < this.size; row++) {
      this.matrix_A_Changed[row] = [];
      this.matrix_A[row] = [];
      for (let col = 0; col < this.size; col++) {
        this.matrix_A_Changed[row][col] = matrix_A[row][col];
        this.matrix_A[row][col] = matrix_A[row][col];
      };
    };

    //** arrayCopy()
    // noprotect
    for (let row = 0; row < this.size; row++) {
      this.matrix_B_Changed[row] = [];
      this.matrix_B[row] = [];
      for (let col = 0; col < 1; col++) {
        this.matrix_B_Changed[row][col] = matrix_B[row][col];
        this.matrix_B[row][col] = matrix_B[row][col];
      };
    };

    //**make a zeroMatrix
    // noprotect
    for (let row = 0; row < this.size; row++) {
      this.matrix_U[row] = [];
      for (let col = 0; col < this.size; col++) {
        this.matrix_U[row][col] = 0;
      };
    };

    //**make a zeroMatrix
    // noprotect
    for (let row = 0; row < this.size; row++) {
      this.matrix_x[row] = [];
      for (let col = 0; col < 1; col++) {
        this.matrix_x[row][col] = 0;
      };
    };
  }

  ForwardElimination() {
    //** indsæt '// noprotect' før løkke med matrice beregninger p5.js v2
    //console.log("MatrixSolve Line 168 - Forward start, size =", this.size);
    // noprotect
    for (let k = 0; k < this.size; k++) {
      //RowOperations Start
      //console.log("k =", k);
      for (let row = 1 + k; row < this.size; row++) {
        let factor =
          this.matrix_A_Changed[row][k] / this.matrix_A_Changed[k][k]; //diagonal element
        for (let col = 0; col < this.size; col++) {
          this.matrix_A_Changed[row][col] -=
            factor * this.matrix_A_Changed[k][col];
          if (col == 0)
            this.matrix_B_Changed[row][0] -=
              factor * this.matrix_B_Changed[k][0];
        };
      };
      //RowOperations End
    };
    
    //**Copy matrix_A_manipulated into matrix_U (upperMatrix)
    // noprotect
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.matrix_U[row][col] = this.matrix_A_Changed[row][col];
      };
    };
    //console.log("Forward end");
  }

  BackwardSubstitution() {
    //console.log("MatrixSolve Line 200 - Backward start, size =", this.size);
    //**Calculate last element in matrix_x
    let k = this.size - 1;
    this.matrix_x[k][0] =
      this.matrix_B_Changed[k][0] / this.matrix_A_Changed[k][k];

    let sum = 0;
    // noprotect
    for (let row = this.size - 2; row >= 0; row--) {
      //console.log("Backward row =", row);
      for (let col = this.size - 1; col >= k; col--) {
        sum += this.matrix_U[row][col] * this.matrix_x[col][0];
      };
      this.matrix_x[row][0] =
        (this.matrix_B_Changed[k - 1][0] - sum) / this.matrix_U[k - 1][k - 1];
      sum = 0;
      k--;
    };
    //console.log("Backward end");
  
    return this.matrix_x;
  }

  ZeroMatrix(rowsTotal, colsTotal) {
    let matrix = [];
    // noprotect
    for (let row = 0; row < rowsTotal; row++) {
      matrix[row] = [];
      for (let col = 0; col < colsTotal; col++) {
        matrix[row][col] = 0;
      };
    };
    return matrix;
  } //**Method End
}