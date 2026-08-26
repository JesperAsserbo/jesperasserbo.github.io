class WallSystem {
  constructor(array) {
    this.insertPoint = new p5.Vector(0, 0);
    this.array = array;

    this.overlapWall = null;
    this.wallMove = false; //** Pan
    // this.testOverlapID = 0;
  }

  UpdateWallSystem(pos) {
    // noprotection
    for (let i = 0, length = this.array.length; i < length; i++) {
      this.array[i].UpdateGeometry();
      this.array[i].Calculate(calculation.FC);
      this.array[i].DisplayWallId();
      this.array[i].DisplayWallLoad();
      this.array[i].DisplayButtonRollor(pos);
    }
  }

  OverlapWall(pos) {
    this.overlapWall = null;
    // noprotection
    for (let i = 0, length = this.array.length; i < length; i++) {
      if (
        this.array[i].OverlapID(pos) ||
        this.array[i].OverlapStartPos(pos) ||
        this.array[i].OverlapCenter(pos) ||
        this.array[i].OverlapEndPos(pos)
      ) {
        this.overlapWall = i;
        this.wallMove = true;
        break;
      } else {
        this.overlapWall = null;
        this.wallMove = false;
      }
    }
  }
}
