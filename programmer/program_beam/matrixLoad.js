class LoadMatrix {
  constructor() {
    this.loadMatrix = [];
    this.loadPointsSum = [];
  }

  LoadSumElement(loadLineArray, elementArray) {
    
    for (let i = 0; i < elements.length; i++) elements[i].loadLineSum = 0;

    // noprotect
    for (let j = 0; j < loadLineArray.length; j++) {
      // console.log(loadLineArray)
      for (let k = 0; k < loadLineArray[j].elementTotal; k++) {
        elements[loadLineArray[j].elementStart + k].loadLineSum +=
          loadLineArray[j].PyStart;
      };
    };

    //for (let i = 0; i < elements.length; i++) console.log(elements[i].loadLineSum);
  }

  LoadSumNode(loadPointArray) {
    //**Reset matrix beacause can reduce in size when node are deleted
    this.loadPointsSum = [];

    //**ZeroMatrix
    for (let i = 0; i < calculate.countNodes; i++) {
      this.loadPointsSum[i] = 0;
    }

    for (let i = 0; i < loadPointArray.length; i++) {
      this.loadPointsSum[loadPointArray[i].nodeId] += loadPointArray[i].Py;
    }
  }

  LoadMatrix(unknowns) {
    //**Delete Matrix (otherwise size do not reduce when nodes are deleted)
    this.loadMatrix = [];

    //**ZeroMatrix //matrix with one collumn because solveMethod
    // noprotect
    for (let row = 0; row < unknowns; row++) {
      this.loadMatrix[row] = [];
      for (let col = 0; col < 1; col++) {
        this.loadMatrix[row][col] = 0;
      }
    }
    //**Load must be relative to coordinates
    //this.loadMatrix[1][0] = 1e6;//1kNm
    //console.table(this.loadMatrix);
  }

  UploadData() {}

  //** Called from sketch
  AddLoad(loadArray) {
    this.BubbleSort(loadArray);

    for (let i = 0; i < loadArray.length; i++) {
      this.loadMatrix[loadArray[i].nodeId * 2][0] += loadArray[i].Py;
    }
  }

  //** Called from sketch
  AddLoadMoment(loadArray) {
    this.BubbleSortMoment(loadArray);

    for (let i = 0; i < loadArray.length; i++) {
      this.loadMatrix[loadArray[i].nodeId * 2 + 1][0] += loadArray[i].My;
    }
  }

  AddLoadLine(loadArray, element) {
    // noprotect
    for (let i = 0; i < loadArray.length; i++) {
      //console.log("matrixLoad Line 38:" + loadArray[i].elementTotal)
      for (let j = 0; j < loadArray[i].elementTotal; j++) {
        //**Length of first element with load
        let elementLength =
          element[loadArray[i].elementStart + j].elementLength;
        let firsElementInLoadcase = loadArray[i].nodeIdStart + j;

        //** Shear
        //****************
        let z0 = (loadArray[i].nodeIdStart + j) * 2;
        let z2 = (loadArray[i].nodeIdStart + j + 1) * 2;

        //**No Charniers
        if (elements[firsElementInLoadcase].charnierLeft == false) {
          this.loadMatrix[z0][0] += 0.5 * loadArray[i].PyStart * elementLength;
          this.loadMatrix[z2][0] += 0.5 * loadArray[i].PyStart * elementLength;
        };

        //**CharnierLeft
        if (elements[firsElementInLoadcase].charnierLeft == true) {
          this.loadMatrix[z0][0] +=
            (3 / 8) * loadArray[i].PyStart * elementLength;
          this.loadMatrix[z2][0] +=
            (5 / 8) * loadArray[i].PyStart * elementLength;
        };

        //** Moment
        //****************
        let z1 = (loadArray[i].nodeIdStart + j) * 2 + 1;
        let z3 = (loadArray[i].nodeIdStart + j + 1) * 2 + 1;

        //**No Charniers
        if (elements[firsElementInLoadcase].charnierLeft == false) {
          this.loadMatrix[z1][0] +=
            (1 / 12) * loadArray[i].PyStart * pow(elementLength, 2);
          this.loadMatrix[z3][0] +=
            -((1 / 12) * loadArray[i].PyStart) * pow(elementLength, 2);
        };

        //**CharnierLeft
        if (elements[firsElementInLoadcase].charnierLeft == true) {
          this.loadMatrix[z1][0] +=
            0 * loadArray[i].PyStart * pow(elementLength, 2);
          this.loadMatrix[z3][0] +=
            (-1 / 8) * loadArray[i].PyStart * pow(elementLength, 2);
        };
      };
    };
  }

  //**reference by pointer (so no need to return array)
  BubbleSort(array) {
    for (let i = array.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (array[j].posLoadPoint.x > array[j + 1].posLoadPoint.x) {
          // swap
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
  }

  BubbleSortMoment(array) {
    for (let i = array.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (array[j].posLoadMoment.x > array[j + 1].posLoadMoment.x) {
          // swap
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
  }
}
