class LoadVertical {
  constructor(posX, posY, loadCase) {
    this.ip_Load_N = new p5.Vector(posX, posY); //** InsertPoint

    //** InsertPoint Set in wallElement.UpdateLoadPos();
    this.ip_Load_N_scaled = new p5.Vector(0, 0);

    this.value_load_N = 10; //** [kN]
    this.loadCase = loadCase;
    this.distToCenter = 0; //** real
    this.distToCenter_scaled = 0; //** on paper

    this.logButtonRollerLoad = false;

    //** ButtonRollor move
    this.buttonRollor_N = new ButtonRollor(
      (pos1x = 0), //** textPro BR
      (pos1y = 0), //** textPro BR
      (pos2x = 550), //** "=" BR
      (pos3x = 700), //** ciffers BL
      (pos4x = 710), //** unit BR
      (prefix = 3),
      (sufix = 2),
      (buttonWidth = 20),
      (buttonHeight = 40),
      (letterSize = 30),
      (textPro = ""),
      (textMid = ""),
      (textPre = "kN"),
      (startValue = 10),
      (minValue = -999),
      (maxValue = 999)
    );
  }

  ButtonRollorRectCircumference() {
    this.rx = this.ip_Load_N.x - 80;
    this.ry = this.ip_Load_N.y - 90;
    this.rw = 130;
    this.rh = 40;
    //rect(this.rx,this.ry,this.rw,this.rh)
  }

  Display_ButtonRollor(pos) {
    push();
    let p = this.ip_Load_N_scaled;

    let translatePoint_N = new p5.Vector();
    translatePoint_N.x = p.x - 650;
    translatePoint_N.y = p.y - 50;

    fill(0);
    translate(translatePoint_N.x, translatePoint_N.y);

    this.graphPosNoScale_N = new p5.Vector.sub(mousePosWorld, translatePoint_N);
    this.buttonRollor_N.DisplayButonRollor(this.graphPosNoScale_N);
    pop();
  }

  Display_Load(wallNumber) {
    push();

    //** AdjustLoadPosToScaleGeo
    //this.distToCenter = (this.ip_Load_N.x-wallArray[wallNumber].center.x)
    //console.log("loadVertical line 58..... scalePos")
    //this.ip_Load_N.x =900-(scaleGeo-100)

    //** if load outside walleEdge draw line
    strokeWeight(2);
    if (wallArray[wallNumber].adjustPoint_Left.x > this.ip_Load_N.x) {
      line(
        this.ip_Load_N_scaled.x,
        this.ip_Load_N_scaled.y,
        wallArray[wallNumber].adjustPoint_Left.x,
        wallArray[wallNumber].adjustPoint_Left.y
      );
    }
    if (wallArray[wallNumber].adjustPoint_Right.x < this.ip_Load_N.x) {
      line(
        this.ip_Load_N_scaled.x,
        this.ip_Load_N_scaled.y,
        wallArray[wallNumber].adjustPoint_Left.x,
        wallArray[wallNumber].adjustPoint_Left.y
      );
    }

    //** Load ****************************************************************
    strokeWeight(4);
    if (this.value_load_N > 0) {
      translate(this.ip_Load_N_scaled.x, this.ip_Load_N_scaled.y);
      line(0, -25, 0, -45);
      fill(0);
      triangle(0, -15, -6, -25, 6, -25);
    }

    if (this.value_load_N < 0) {
      translate(this.ip_Load_N_scaled.x, this.ip_Load_N_scaled.y);
      line(0, -15, 0, -32);
      fill(0);
      triangle(0, -42, -6, -32, 6, -32);
    }

    if (this.value_load_N == 0) {
      translate(this.ip_Load_N_scaled.x, this.ip_Load_N_scaled.y);

      if (this.value_load_N == 0) stroke(0, 0, 0, 50);
      line(0, -15, 0, -45);
      noFill();
      stroke(0);
      fill(0);
    }

    strokeWeight(1);
    noFill();
    circle(0, 0, 15);
    pop();
  }
  Display_LoadValue() {
    push();

    if (this.value_load_N == 0) fill(0, 0, 0, 150);
    translate(this.ip_Load_N_scaled.x, this.ip_Load_N.y);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(this.loadCase, 0, -80);
    text(nf(this.value_load_N, 0, 2) + " kN", 0, -60);

    pop();
  }

  Display_G() {
    push();
    strokeWeight(3);

    translate(this.ip_Load_N.x, this.ip_Load_N.y - 20);
    fill(0, 0, 0, 200);
    stroke(0, 0, 0, 200);
    line(0, -30, 0, -55);

    triangle(0, -20, -6, -30, 6, -30);

    //** Tekst
    noStroke();
    fill(0);
    textAlign(LEFT, CENTER);
    textSize(20);
    text(nf(this.value_load_N, 0, 2) + " kN", 10, -45);

    pop();
  }
}
