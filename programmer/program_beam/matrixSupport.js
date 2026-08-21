class SupportMatrix {
  constructor() {

    this.supportMatrix = [];
  }

  //**Support direction Cy
  AddSupport(supportArray) {
    this.BubbleSort(supportArray);

    for (let i = 0; i < supportArray.length; i++) {
      this.supportMatrix[supportArray[i].nodeId * 2][0] = supportArray[i].Cy;
      this.supportMatrix[supportArray[i].nodeId * 2+1][0] = supportArray[i].Cz;
      //console.log(supportArray[i].Cz)
      
    }
  }

  SupportMatrix(unknowns) {
    //**Delete Matrix (otherwise size do not reduce when nodes are deleted)
    this.supportMatrix = [];

    //**ZeroMatrix //matrix with one collumn because solveMethod
    // noprotect
    for (let row = 0; row < unknowns; row++) {
      this.supportMatrix[row] = [];
      for (let col = 0; col < 1; col++) {
        this.supportMatrix[row][col] = 0;
      };
    };

    //**Load must be relative to coordinates
    //this.supportMatrix[0][0] = 1e6;//N/mm
    //this.supportMatrix[4][0] = 1e6;//N/mm
  }

  UploadData(supports) {}

  //**reference by pointer (so no need to return array)
  BubbleSort(array) {
    for (let i = array.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (array[j].posSupport.x > array[j + 1].posSupport.x) {
          // swap
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
  }

  OverlapsNode() {}
}
