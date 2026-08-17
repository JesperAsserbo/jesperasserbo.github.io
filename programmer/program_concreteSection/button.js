class Button {
  constructor(
    pos1x,
    pos1y,
    pos2x,
    pos3x,
    textPro,
    buttonWidth,
    buttonHeight,
    state
  ) {
    this.pos1 = new p5.Vector(pos1x, pos1y);
    this.pos2 = new p5.Vector(pos2x, pos1y);
    this.pos3 = new p5.Vector(pos3x, pos1y);
    this.textPro = textPro;
    this.buttonWidth = buttonWidth;
    this.buttonHeight = buttonHeight;
    this.state = state; //-1 => OFF, +1 => ON

    this.left = this.pos1.x;
    this.right = this.pos1.x + this.buttonWidth;
    this.top = this.pos1.y - this.buttonHeight;
    this.bottom = this.pos1.y;
  }

  ApplyScale(scaleForce, scaleMesure) {
    //**Change in values are stored in objectProporties
    this.scaleMesure = scaleMesure; //** 100 => meters
    this.scaleForce = scaleForce;
  }

  /*
  SwitchFunction(pos, otherButton) {
    //Delete - OtherButton
    //Add - this.button

    // Delete  off  =>  on
    // Add     off      off

    // Delete  off      off
    // Add     off  =>  on

    // Delete  off  =>  on   Switch
    // Add     on       off
    if (otherButton.MouseOverlaps(pos) && this.state == 1 && mouseIsPressed)
      this.state = -1;

    // Delete  off      off
    // Add     on   =>  off

    // Delete  on   =>  off
    // Add     off      off

    // Delete  on       off  Switch
    // Add     off  =>  on
    if (this.MouseOverlaps(pos) && otherButton.state == 1 && mouseIsPressed)
      otherButton.state = -1;
  }
*/

  SwitchFunction(pos, otherButton) {
    for (let i = 0, length = otherButton.length; i < length; i++) {
      if (
        this.MouseOverlaps(pos) &&
        otherButton[i].state == 1 &&
        mouseIsPressed
      ) {
        otherButton[i].state = -1;
        this.state = 1;
      }
    }
  }

  DisplayButton(color, sign) {
    push();
    strokeWeight(2);

    //**Color Button
    if (this.state == 1) {
      fill(color);
      //fill(0, 200, 0, 100);
    } else fill(25, 25, 25, 25);

    rect(
      this.pos1.x + 5,
      this.pos1.y - this.buttonHeight + 5,
      this.buttonWidth - 10,
      this.buttonHeight - 10
    );

    //**Sign
    push();
    strokeWeight(2);
    line(
      this.pos1.x + 12,
      this.pos1.y - 20,
      this.pos1.x + 28,
      this.pos1.y - 20
    );
    if (sign == 1) {
      line(
        this.pos1.x + 20,
        this.pos1.y - 12,
        this.pos1.x + 20,
        this.pos1.y - 28
      );
    }
    pop();

    //**Button Frame
    noFill();
    rect(
      this.pos1.x,
      this.pos1.y - this.buttonHeight,
      this.buttonWidth,
      this.buttonHeight
    );

    //**Text
    fill(0);
    textSize(30);
    textAlign(LEFT);
    text(this.textPro, this.pos2.x, this.pos2.y - 5);
    //if (this.state == -1) text("OFF", this.pos3.x, this.pos2.y - 5);
    //if (this.state == 1) text("ON", this.pos3.x, this.pos2.y - 5);

    pop();
  }

  MouseOverlaps(pos) {
    push();
    //**Pos changed to GraphScale
    let posTemp = p5.Vector.mult(pos, 1); //;pos, 100 / this.scaleMesure); //**ref by value

    if (this.left < posTemp.x && posTemp.x < this.right) {
      if (this.top < posTemp.y && posTemp.y < this.bottom) {
        this.ChangeColor();
        //**Only Once
        if (mouseIsPressed && mouseButtonIsClicked == false) {
          mouseButtonIsClicked = true; //**Global variable
          this.state *= -1;
        }
        //this.ChangeColor();
        return true;
      }
    } else {
      //mouseButtonIsClicked = false; //**Global variable
      return false;
    }

    pop();
  }

  ChangeColor() {
    push();

    //if (this.state == -1) {
    fill(150, 200);

    /*
      noStroke();
      rect(
        this.pos1.x + 6,
        this.pos1.y + 6 - this.buttonHeight,
        this.buttonWidth - 12,
        this.buttonHeight - 12
      );
      */
    strokeWeight(3);
    stroke(100);

    line(
      this.pos1.x + 2.5,
      this.pos1.y - 2.5,
      this.pos1.x + 2.5,
      this.pos1.y - this.buttonHeight + 2.5
    );
    line(
      this.pos1.x + 2.5,
      this.pos1.y - this.buttonHeight + 2.5,
      this.pos1.x + 1 * this.buttonWidth - 2.5,
      this.pos1.y - this.buttonHeight + 2.5
    );
    line(
      this.pos1.x + 1 * this.buttonWidth - 2.5,
      this.pos1.y - this.buttonHeight + 2.5,
      this.pos1.x + 1 * this.buttonWidth - 2.5,
      this.pos1.y - 2.5
    );
    line(
      this.pos1.x + 1 * this.buttonWidth - 2.5,
      this.pos1.y - 2.5,
      this.pos1.x + 2.5,
      this.pos1.y - 2.5
    );

    //  }
    pop();
  }
}
