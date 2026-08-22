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
  
  
  //**TEST
  matrix_A = [
    [4760, -4760, 2500, 0,-2500],
    [-4760,1e8,-2500,0,2500],
    [2500, -2500, 1e8, -1750,0],
    [0,0,-1750,7000,-5250],
    [-2500,2500,0,-5250,1e8],
  ];  
  
   matrix_B = [[0], [0], [0], [10000],[0]];
  

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

  UpdateMatrixSize() {
    this.matrix_A = [];
    this.matrix_B = [];

    this.matrix_A_Changed = [];
    this.matrix_B_Changed = [];

    this.matrix_x = [];
    this.matrix_U = [];
  }

  DisplayMatrix() {
    line(
      this.insertPoint.x + this.size * this.space - 5,
      this.insertPoint.y - 5,
      this.insertPoint.x + this.size * this.space - 5,
      this.insertPoint.y + (this.size - 1) * this.space + 5
    );

    line(
      this.insertPoint.x + this.size * this.space - 5,
      this.insertPoint.y + (this.size + 1) * this.space - 5,
      this.insertPoint.x + this.size * this.space - 5,
      this.insertPoint.y + 2 * this.size * this.space + 5
    );

    textAlign(RIGHT, CENTER);
    for (let row = 0; row < this.size; row++) {
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
        }

        //**matrix_U
        text(
          this.matrix_U[row][col],
          this.insertPoint.x + this.space * col,
          this.insertPoint.y + (this.size + 1) * this.space + row * this.space
        );
      }
    }

    //**Display matrix_x
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < 1; col++) {
        text(
          this.matrix_x[row][col],
          this.insertPoint.x + (this.size + 1) * this.space + this.space * col,
          this.insertPoint.y + (this.size + 6) * this.space + row * this.space
        );
      }
    }
  } //Method End

  InputData(matrix_A, matrix_B) {
    this.size = matrix_A.length;

    //arrayCopy()
    for (let row = 0; row < this.size; row++) {
      this.matrix_A_Changed[row] = [];
      this.matrix_A[row] = [];
      for (let col = 0; col < this.size; col++) {
        this.matrix_A_Changed[row][col] = matrix_A[row][col];
        this.matrix_A[row][col] = matrix_A[row][col];
      }
    }

    //arrayCopy()
    for (let row = 0; row < this.size; row++) {
      this.matrix_B_Changed[row] = [];
      this.matrix_B[row] = [];
      for (let col = 0; col < 1; col++) {
        this.matrix_B_Changed[row][col] = matrix_B[row][col];
        this.matrix_B[row][col] = matrix_B[row][col];
      }
    }

    //**make a zeroMatrix
    for (let row = 0; row < this.size; row++) {
      this.matrix_U[row] = [];
      for (let col = 0; col < this.size; col++) {
        this.matrix_U[row][col] = 0;
      }
    }

    //**make a zeroMatrix
    for (let row = 0; row < this.size; row++) {
      this.matrix_x[row] = [];
      for (let col = 0; col < 1; col++) {
        this.matrix_x[row][col] = 0;
      }
    }
  }

  ForwardElimination() {
    for (let k = 0; k < this.size; k++) {
      //RowOperations Start
      for (let row = 1 + k; row < this.size; row++) {
        let factor =
          this.matrix_A_Changed[row][k] / this.matrix_A_Changed[k][k]; //diagonal element
        for (let col = 0; col < this.size; col++) {
          this.matrix_A_Changed[row][col] -=
            factor * this.matrix_A_Changed[k][col];
          if (col == 0)
            this.matrix_B_Changed[row][0] -=
              factor * this.matrix_B_Changed[k][0];
        }
      }
      //RowOperations End
    }
    //**Copy matrix_A_manipulated into matrix_U (upperMatrix)
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.matrix_U[row][col] = this.matrix_A_Changed[row][col];
      }
    }
  }

  BackwardSubstitution() {
    //** empty so that reduced is possible
    //this.matrix_x = []

    //**Calculate last element in matrix_x
    let k = this.size - 1;
    this.matrix_x[k][0] =
      this.matrix_B_Changed[k][0] / this.matrix_A_Changed[k][k];

    let sum = 0;
    for (let row = this.size - 2; row >= 0; row--) {
      for (let col = this.size - 1; col >= k; col--) {
        sum += this.matrix_U[row][col] * this.matrix_x[col][0];
      }
      this.matrix_x[row][0] =
        (this.matrix_B_Changed[k - 1][0] - sum) / this.matrix_U[k - 1][k - 1];
      sum = 0;
      k--;
    }

    return this.matrix_x;
  }

  DisplayOneMatrix(posX, posY, matrix, name) {
    //**Display matrix
    push();
    noStroke();
    textSize(20);
    textAlign(RIGHT);
    this.insertPoint = new p5.Vector(posX, posY);
    this.space = 100;

    let rows = matrix.length;
    let cols = matrix[0].length;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let value = matrix[row][col];

        if (value != 0) {
          text(
            nfp(matrix[row][col].toExponential(2)),
            this.insertPoint.x + this.space * col - 7.5,
            this.insertPoint.y + 25 * row
          );
        } else {
          text(
            value,
            this.insertPoint.x + this.space * col - 7.5,
            this.insertPoint.y + 25 * row
          );
        }
      }
    }

    //**HeaderText
    textAlign(LEFT);
    textSize(30);
    text(name, this.insertPoint.x - 100, this.insertPoint.y - 80);
    text("Matrix", this.insertPoint.x - 100, this.insertPoint.y - 50);

    //**Lines
    stroke(0);
    strokeWeight(2);
    for (let i = 0; i < 2; i++) {
      line(
        i * cols * 100 + this.insertPoint.x - 100,
        this.insertPoint.y - 25,
        i * cols * 100 + this.insertPoint.x - 100,
        this.insertPoint.y + 25 * (rows - 1) + 10
      );
    }

    pop();
  }

  MatrixProduct() {}

  MatrixAddToDiagonal(A, B) {
    let tempMatrix = [];
    for (let row = 0; row < A.length; row++) {
      tempMatrix[row] = [];
      for (let col = 0; col < A.length; col++) {
        if (row == col) tempMatrix[row][col] = A[row][row] + B[row][0];
        else tempMatrix[row][col] = A[row][col];
      }
    }
    return tempMatrix;
  }

  ZeroMatrix(rowsTotal, colsTotal) {
    let matrix = [];
    for (let row = 0; row < rowsTotal; row++) {
      matrix[row] = [];
      for (let col = 0; col < colsTotal; col++) {
        matrix[row][col] = 0;
      }
    }
    return matrix;
  } //**Method End
}
