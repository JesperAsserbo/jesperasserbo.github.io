//** class ButtonCiffer ** Methods **
//**  DisplayButonCiffer()
//**  DisplayValue()
//**  MouseOverlaps(pos)
//**  ChangeColor()
//**  NewValue()

class ButtonCiffer {
  constructor(
    posXTopLeft,
    posYTopLeft,
    buttonWidth,
    buttonHeight,
    startValue,
    letterSize
  ) {
    this.pos = new p5.Vector(posXTopLeft, posYTopLeft);
    this.buttonWidth = buttonWidth;
    this.buttonHeight = buttonHeight;
    this.buttonCenter = new p5.Vector(
      this.pos.x + 0.5 * this.buttonWidth,
      this.pos.y + 5 + 0.5 * this.buttonHeight
    );
    this.letterSize = letterSize;

    this.startValue = startValue;
    this.value = this.startValue;
  }

  Update() {}

  DisplayButonCiffer() {
    push();
    //noFill();
    fill(0, 255, 0, 75);
    stroke(0, 255, 0, 250);
    //stroke(0, 100);
    rect(this.pos.x, this.pos.y, this.buttonWidth, this.buttonHeight);
    pop();

    if (this.value >= 0 && this.value <= 9) this.DisplayValue();
  }

  DisplayValue() {
    push();
    textSize(this.letterSize);
    textAlign(CENTER, CENTER);
    text(this.value, this.buttonCenter.x, this.buttonCenter.y + 0);
    pop();
  }

  MouseOverlaps(pos) {
    if (pos != undefined) {
      let left = this.pos.x;
      let right = this.pos.x + this.buttonWidth;
      let top = this.pos.y;
      let bottom = this.pos.y + this.buttonHeight;
      if (left < pos.x && pos.x < right) {
        if (top < pos.y && pos.y < bottom) {
          this.ChangeColor();
          return true;
        }
      } else {
        return false;
      }
    }
  }

  ChangeColor() {
    push();
    fill(100, 100);
    noStroke();
    rect(this.pos.x, this.pos.y, this.buttonWidth, this.buttonHeight);
    pop();
  }

  NewValue() {
    if (this.value <= 0) {
      this.value = 0;
    }
    if (this.value >= 9) {
      this.value = 9;
    }
  }

  //**Value continius count
  /*
    NewValue() {
    if (this.value < 0) {
      this.value = 9;
    }
    if (this.value > 9 ) {
      this.value = 0;
    }
  }
  */
}