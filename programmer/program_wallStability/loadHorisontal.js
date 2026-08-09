class LoadHorisontal {
  constructor(posX, posY) {
    this.ip_Load_H = new p5.Vector(posX, posY); //** InsertPoint
    this.value_load_H = 10; //** [kN]

    //** ButtonRollor move
    this.buttonRollor_H = new ButtonRollor(
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

  Update_ButtonRollor() {
    
    
  }

  /*
  Display_ButtonRollor(pos) {
    push();
    if (mouseIsPressed) {
      translate(pos)
      this.buttonRollor_H.DisplayButonRollor(pos);
      fill(255,0,0)
      circle(pos.x,pos.y,30)
      //this.buttonRollor_H.pos1.x = 0
    }
    pop();
  }
  */

  Display_ButtonRollor(pos) {
    push();
    let p = this.ip_Load_H;

    let translatePoint_H = new p5.Vector();
    translatePoint_H.x = graph.leftLimit - 800;
    translatePoint_H.y = p.y - 5;
    /*
        line(
          mousePosWorld.x,
          mousePosWorld.y,
          translatePoint_H.x,
          translatePoint_H.y
        );
*/

    fill(0);
    translate(translatePoint_H.x, translatePoint_H.y);

    this.graphPosNoScale_H = new p5.Vector.sub(mousePosWorld, translatePoint_H);

    this.buttonRollor_H.DisplayButonRollor(this.graphPosNoScale_H);
    pop();
  }

  Display_Load() {
    //if (this.value_load_H == 0) return;
    push();
    strokeWeight(4);

    if (this.value_load_H > 0) {
      translate(graph.leftLimit - 50, this.ip_Load_H.y);
      line(-20, 0, -80, 0);
      fill(0);
      triangle(-20, 0, -30, -6, -30, 6);
    }

    if (this.value_load_H == 0) {
      translate(graph.leftLimit - 50, this.ip_Load_H.y);
      //strokeWeight(1)
      if (this.value_load_H == 0) stroke(0, 0, 0, 50);
      line(-20, 0, -80, 0);
      noFill();
      //triangle(-80, 0, -70, -6, -70, 6);
    }

    if (this.value_load_H < 0) {
      translate(graph.leftLimit - 50, this.ip_Load_H.y);
      line(-20, 0, -70, 0);
      fill(0);
      triangle(-80, 0, -70, -6, -70, 6);
    }
    pop();
  }

  Display_LoadValue() {
    push();
    if (this.value_load_H == 0) fill(0, 0, 0, 150);
    translate(graph.leftLimit - 50, this.ip_Load_H.y);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(nf(this.value_load_H, 0, 2) + " kN", -50, -20);
    pop();
  }

  /*
  Update_Load(pos) {
    this.ip_Load_H.x = pos.x;
    this.ip_Load_H.y = pos.y;
  }
  */
}
