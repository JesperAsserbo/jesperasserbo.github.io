class ButtonChoice {
  constructor(pos1x, pos1y, w, h, textSizeButton, lib) {
    this.pos = new p5.Vector(pos1x, pos1y); //** LowerRigth
    this.w = w;
    this.h = h;
    this.textSizeButton = textSizeButton;

    this.lib = lib; //** 2 dim Array [[],[],[],.....]
    this.libLength = lib.length;

    this.center = new p5.Vector(pos1x - 0.5 * w, pos1y - 0.5 * h);
    this.left = pos1x - w;
    this.rigth = pos1x;
    this.top = pos1y - h;
    this.bottom = pos1y;
    this.overlap = false;
    this.fade = 0;
  }

  Display(pos, lib) {
    push();
    fill(0, 200, 0, 50);
    if (this.Overlap(pos)) {
      noFill();
      //this.DisplayChange(lib);
    }
    rect(this.pos.x - this.w, this.pos.y - this.h, this.w, this.h);

    noStroke();
    fill(0);
    textSize(this.textSizeButton);
    textAlign(RIGHT, CENTER);
    text(this.lib[lib.elementNumber][0], this.pos.x - 10, this.center.y + 2.5);
    pop();
  }

    DisplayLeft(pos, lib) {
    push();
    fill(0, 200, 0, 50);
    if (this.Overlap(pos)) {
      noFill();
      //this.DisplayChange(lib);
    }
    rect(this.pos.x - this.w, this.pos.y - this.h, this.w, this.h);

    noStroke();
    fill(0);
    textSize(this.textSizeButton);
    textAlign(LEFT, CENTER);
    text(this.lib[lib.elementNumber][0], this.pos.x - this.w + 10, this.center.y + 2.5);
    pop();
  }

  DisplayChange(lib) {
    push();
    fill(0, 255, 0, 100);
    //if (this.Overlap(pos)) fill(100, 100, 100, 100);
    stroke(0,0,0,this.fade);
    rect(
      this.pos.x - this.w + 4,
      this.pos.y - this.h + 4,
      this.w - 8,
      this.h - 8
    );
    pop();

    //** ValuesAbove
    for (let i = 0; i < lib.elementNumber; i++) {
      push();
      fill(255,255,255,this.fade);
      stroke(0,0,0,this.fade)
      rect(
        this.pos.x - this.w + 4,
        this.pos.y -
          lib.elementNumber * (this.textSizeButton + 10) +
          i * (this.textSizeButton + 10) -
          this.h +
          4,
        this.w - 8,
        this.h - 8
      );
      pop();

      //** Text
      push();
      noStroke();
      fill(0,0,0,this.fade);
      textSize(this.textSizeButton);
      textAlign(RIGHT, CENTER);
      text(
        this.lib[i][0],
        this.pos.x - 10,
        this.pos.y -
          17.5 -
          lib.elementNumber * (this.textSizeButton + 10) +
          i * (this.textSizeButton + 10)
      );
      pop();
    }

    //** ValuesBelow
    for (let i = lib.elementNumber + 1; i < this.libLength; i++) {
      push();
      fill(255,255,255,this.fade);
      stroke(0,0,0,this.fade)
      rect(
        this.pos.x - this.w + 4,
        this.pos.y -
          lib.elementNumber * (this.textSizeButton + 10) +
          i * (this.textSizeButton + 10) -
          this.h +
          4,
        this.w - 8,
        this.h - 8
      );
      pop();

      //** Text
      push();
      noStroke();
      fill(0,0,0,this.fade);
      textSize(this.textSizeButton);
      textAlign(RIGHT, CENTER);
      text(
        this.lib[i][0],
        this.pos.x - 10,
        this.pos.y -
          17.5 -
          lib.elementNumber * (this.textSizeButton + 10) +
          i * (this.textSizeButton + 10)
      );
      pop();
    }

    //** Text ValueChoice
    push();
    noStroke();
    fill(0);
    textSize(this.textSizeButton);
    textAlign(RIGHT, CENTER);
    text(this.lib[lib.elementNumber][0], this.pos.x - 10, this.pos.y - 17.5);
    pop();
  }

  DisplayChangeLeft(lib) {
    push();
    fill(0, 255, 0, 100);
    //if (this.Overlap(pos)) fill(100, 100, 100, 100);
    stroke(0,0,0,this.fade);
    rect(
      this.pos.x - this.w + 4,
      this.pos.y - this.h + 4,
      this.w - 8,
      this.h - 8
    );
    pop();

    //** ValuesAbove
    for (let i = 0; i < lib.elementNumber; i++) {
      push();
      fill(255,255,255,this.fade);
      stroke(0,0,0,this.fade)
      rect(
        this.pos.x - this.w + 4,
        this.pos.y -
          lib.elementNumber * (this.textSizeButton + 10) +
          i * (this.textSizeButton + 10) -
          this.h +
          4,
        this.w - 8,
        this.h - 8
      );
      pop();

      //** Text
      push();
      noStroke();
      fill(0,0,0,this.fade);
      textSize(this.textSizeButton);
      textAlign(LEFT, CENTER);
      text(
        this.lib[i][0],
        this.pos.x - this.w + 10,
        this.pos.y -
          17.5 -
          lib.elementNumber * (this.textSizeButton + 10) +
          i * (this.textSizeButton + 10)
      );
      pop();
    }

    //** ValuesBelow
    for (let i = lib.elementNumber + 1; i < this.libLength; i++) {
      push();
      fill(255,255,255,this.fade);
      stroke(0,0,0,this.fade)
      rect(
        this.pos.x - this.w + 4,
        this.pos.y -
          lib.elementNumber * (this.textSizeButton + 10) +
          i * (this.textSizeButton + 10) -
          this.h +
          4,
        this.w - 8,
        this.h - 8
      );
      pop();

      //** Text
      push();
      noStroke();
      fill(0,0,0,this.fade);
      textSize(this.textSizeButton);
      textAlign(LEFT, CENTER);
      text(
        this.lib[i][0],
        this.pos.x - this.w +10,
        this.pos.y -
          17.5 -
          lib.elementNumber * (this.textSizeButton + 10) +
          i * (this.textSizeButton + 10)
      );
      pop();
    }

    //** Text ValueChoice
    push();
    noStroke();
    fill(0);
    textSize(this.textSizeButton);
    textAlign(LEFT, CENTER);
    text(this.lib[lib.elementNumber][0], this.pos.x - this.w + 10, this.pos.y - 17.5);
    pop();
  }

  Overlap(pos) {
    if (this.left < pos.x && pos.x < this.rigth) {
      if (this.top < pos.y && pos.y < this.bottom) {
        this.overlap = true;
        
        if(this.fade < 255) this.fade +=2
        
        return true;
      }
      this.overlap = false;
      this.fade = 0;
      return false;
    } else {
      this.overlap = false;
      this.fade = 0;
      return false;
    }
  }
}
