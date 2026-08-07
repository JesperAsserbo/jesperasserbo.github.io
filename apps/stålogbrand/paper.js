class Paper {
  constructor(insertPointX, insertPointY) {
    this.insertPoint = new p5.Vector(insertPointX, insertPointY);
    this.stepSize = 50;
  }

  DisplayPaperCross(width, height) {
    push();

    fill(255);
    noStroke();
    rect(this.insertPoint.x, this.insertPoint.y, width, height);

    stroke(0, 100, 250, 150);
    for (let i = 0; i < width / this.stepSize; i++) {
      line(
        this.insertPoint.x + this.stepSize * i,
        this.insertPoint.y,
        this.insertPoint.x + this.stepSize * i,
        this.insertPoint.y + height
      );
    }

    for (let i = 0; i < height / this.stepSize; i++) {
      line(
        this.insertPoint.x,
        this.insertPoint.y + this.stepSize * i,
        this.insertPoint.x + width,
        this.insertPoint.y + this.stepSize * i
      );
    }

    //*Marked line
    stroke(0, 100, 250, 200);
    strokeWeight(4);
    line(
      this.insertPoint.x + 250,
      this.insertPoint.y,
      this.insertPoint.x + 250,
      this.insertPoint.y + height
    );

    //*Holes
    noStroke();
    fill(100);
    circle(this.insertPoint.x + 100, this.insertPoint.y + 300, 50);
    circle(this.insertPoint.x + 100, this.insertPoint.y + 1100, 50);
    circle(this.insertPoint.x + 100, this.insertPoint.y + 1900, 50);
    circle(this.insertPoint.x + 100, this.insertPoint.y + 2700, 50);

    pop();
  }

  DisplayPaperBlank(width, height) {
    push();
    fill(255, 255, 255, 255);
    noStroke();
    rect(this.insertPoint.x, this.insertPoint.y, width, height);
    pop();
  }

  DisplayHeader() {
    push();
    textSize(100);
    textAlign(LEFT, BASELINE);
    textStyle(ITALIC);
    text("Steel - Fireprotection", 350, 150);

    textSize(50);
    text("Under development, ver. 1.0", 350, 250);

    textSize(50);
    text("28/05 - 2026", 1750, 150);
    pop();
  }

  DisplayText() {
    push();
    textSize(50);
    text("Input Data", this.insertPoint.x + 350, this.insertPoint.y + 392.5);
    textSize(36);
    text("Fire protection data (DS/EN1993-1-2 section 4.2.4)", this.insertPoint.x + 350, this.insertPoint.y + 492.5);
    textAlign(CENTER);
    textSize(30);
    //text("ADD", this.insertPoint.x + 425, this.insertPoint.y + 440);
    //text("DELETE", this.insertPoint.x + 775, this.insertPoint.y + 440);
    //text("Output Data", this.insertPoint.x + 350, this.insertPoint.y + 1850);
    pop();
  }
}
