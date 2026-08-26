//** Grundlag
//** Kap. 4 i "skivebygningers statik", 2. udgave 1992

//** Methods **
//** Calculation(array, load)
//** TableDisplayResults(array)
//** TableDisplayCalc(array)

class Calculation {
  constructor(posX, posY) {
    this.insertPoint = new p5.Vector(posX, posY);

    this.posTableResult = new p5.Vector(
      this.insertPoint.x + 0,
      this.insertPoint.y + 0
    );
    this.posTableCalc = new p5.Vector(
      this.insertPoint.x + 0,
      this.insertPoint.y + 1000
    );
    this.scale = 100; //** 100 => [meters] used in print to Table

    //**GeometryDependent calculation
    this.S_sum_X = 0;
    this.S_sum_Y = 0;

    this.area_sum = 0;

    this.A1_sum = 0;
    this.A2_sum = 0;
    this.A3_sum = 0;

    this.B1_sum = 0;
    this.B2_sum = 0;

    this.D = 0;

    this.Tp_X = 0;
    this.Tp_Y = 0;

    this.FC_x = 0;
    this.FC_y = 0;
    this.FC = new p5.Vector(this.FC_x, this.FC_y);

    //**LoadDependent calculation
    //**translation in xy-system
    this.u_FC = 0;
    this.v_FC = 0;

    this.theta = 0;
    this.CzCF_sum = 0;

    this.Rx_sum = 0;
    this.Ry_sum = 0;

    this.M_FC_sum = 0;
  }

  Calculation(array, load) {
    //**Reset Values
    this.S_sum_X = 0;
    this.S_sum_Y = 0;

    this.area_sum = 0;

    this.A1_sum = 0;
    this.A2_sum = 0;
    this.A3_sum = 0;

    this.B1_sum = 0;
    this.B2_sum = 0;

    this.CzCF_sum = 0;

    this.Rx_sum = 0;
    this.Ry_sum = 0;

    this.M_FC_sum = 0;

    //**Calculation
    //noprotection
    for (let i = 0; i < array.length; i++) {
      //**StaticMoment
      //console.log("Area: " +  array[i].area)
      array[i].Sxy.x = array[i].centerPos.y * 10 * array[i].area;
      array[i].Sxy.y = array[i].centerPos.x * 10 * array[i].area;

      this.S_sum_X += array[i].Sxy.y;
      this.S_sum_Y += array[i].Sxy.x;

      //**Area
      this.area_sum += array[i].area;

      //**(4.30)
      this.A1_sum += array[i].A1; //** CiX
      this.A2_sum += array[i].A2; //** CiY
      this.A3_sum += array[i].A3;

      this.B1_sum += array[i].B1; //** yCix
      this.B2_sum += array[i].B2; //** xCiy
    };
    this.D = this.A1_sum * this.A2_sum - pow(this.A3_sum, 2);
    //console.log(this.D)

    //**CenterOFGravity - Tp
    this.Tp_X = this.S_sum_X / this.area_sum;
    this.Tp_Y = this.S_sum_Y / this.area_sum;

    //**(4.29) CenterOFShear - FC [mm]
    this.FC_x =
      (this.A1_sum * this.B2_sum + this.B1_sum * this.A3_sum) / this.D;
    this.FC_y =
      (this.A2_sum * this.B1_sum + this.B2_sum * this.A3_sum) / this.D;
    this.FC = new p5.Vector(this.FC_x, this.FC_y);

    //console.log(this.FC_x)

    //**(4.31) Calculation LoadDependent Def FC center (no rotationcontribution in FC)
    this.u_FC = (load.Px.x * this.A2_sum - load.Py.y * this.A3_sum) / this.D;
    this.v_FC = (load.Py.y * this.A1_sum - load.Px.x * this.A3_sum) / this.D;

    //console.log("**** calculation line 119 - this.u_FC: " + this.u_FC)
    // noprotection
    for (let i = 0; i < array.length; i++) {
      //**(4.24)
      array[i].un_FC = this.u_FC * array[i].cos + this.v_FC * array[i].sin; //** un_FC
      array[i].us_FC = this.v_FC * array[i].cos - this.u_FC * array[i].sin; //** us_FC

      //**(4.33) - Torsional stiffness
      this.CzCF_sum +=
        array[i].Cns_n * pow(array[i].s_sFC, 2) +
        array[i].Cns_s * pow(array[i].n_nFC, 2);
      // console.log("**** calculation line 131 - CzCF_sum : " + array[i].un_FC  )
    };

    //**(4.32)
    this.theta = load.M_FC / this.CzCF_sum;

    //**(4.28) forces
    // noprotection
    for (let i = 0; i < array.length; i++) {
      array[i].Qn =
        array[i].Cns_n * (array[i].un_FC - array[i].s_sFC * this.theta);
      array[i].Qs = 0;
      //console.log("ID: " + array[i].id + " Qn: " + array[i].Qn);

      //**ForceVector in xy-system
      let Fx = array[i].Qn * array[i].cos + array[i].Qs * array[i].sin;
      let Fy = array[i].Qs * array[i].cos + array[i].Qn * array[i].sin;

      array[i].forceXY = new p5.Vector(Fx, Fy);
      //console.log("calculate line 146 - i: " + i + " Fxy: " + array[i].forceXY);

      //**Reactions
      this.Rx_sum -= array[i].forceXY.x;
      this.Ry_sum -= array[i].forceXY.y;

      //**M_FC
      array[i].M_FC =
        array[i].dist_x_FC * array[i].forceXY.y -
        array[i].dist_y_FC * array[i].forceXY.x;

      this.M_FC_sum += array[i].M_FC;
      //console.log(array[i].forceXY.y)
    }
  }

  DisplayPlate() {
    if (button_PlateDisplay.state == -1) return;

    push();
    //translate(graph.posOrigo.x,graph.posOrigo.y)
    this.TL = new p5.Vector(graph.xMin - 50, graph.yMin - 50);
    this.TR = new p5.Vector(graph.xMax + 50, graph.yMin - 50);
    this.BL = new p5.Vector(graph.xMin - 50, graph.yMax + 50);
    this.BR = new p5.Vector(graph.xMax + 50, graph.yMax + 50);

    let TLnew = this.CalcDefPoint(this.TL);
    let TRnew = this.CalcDefPoint(this.TR);
    let BLnew = this.CalcDefPoint(this.BL);
    let BRnew = this.CalcDefPoint(this.BR);

    //** Not deformed plate
    noFill();
    stroke(0);
    strokeWeight(2);
    rect(this.TL.x, this.TL.y, this.TR.x - this.TL.x, this.BR.y - this.TR.y);

    //** Deforemed plate
    fill(0, 0, 0, 30);

    beginShape();
    // Add vertices.
    vertex(TLnew.x, TLnew.y);
    vertex(TRnew.x, TRnew.y);
    vertex(BRnew.x, BRnew.y);
    vertex(BLnew.x, BLnew.y);
    endShape(CLOSE);

    stroke(0, 0, 0, 100);
    line(this.TL.x, this.TL.y, TLnew.x, TLnew.y);
    line(this.BL.x, this.BL.y, BLnew.x, BLnew.y);
    line(this.TR.x, this.TR.y, TRnew.x, TRnew.y);
    line(this.BR.x, this.BR.y, BRnew.x, BRnew.y);

    pop();
  }

  //** Used in this.DisplayPlate()
  CalcDefPoint(pos) {
    let posNew = new p5.Vector(0, 0);
    //**(4.03) return in [cm] so fits with graph .... calculated in [mm]

    let xF = this.FC_x + graph.posOrigo.x * 10;
    let yF = this.FC_y + graph.posOrigo.y * 10;

    /* //** (4.03)
    posNew.x = (pos.x * 10 + this.u_FC - (pos.y * 10 - yF) * this.theta) / 10;
    posNew.y = (pos.y * 10 + this.v_FC + (pos.x * 10 - xF) * this.theta) / 10;
*/

    //** Translation => no distortion at greater angles (theta)
    posNew.x =
      (xF +
        this.u_FC +
        (pos.x * 10 - xF) * cos(this.theta) -
        (pos.y * 10 - yF) * sin(this.theta)) /
      10;
    posNew.y =
      (yF +
        this.v_FC +
        (pos.x * 10 - xF) * sin(this.theta) +
        (pos.y * 10 - yF) * cos(this.theta)) /
      10;

    return posNew;
  }

  DisplayPlateText() {
    if (button_PlateDisplay.state == -1) return;

    push(); //** Push coordinateSystem
    //console.log("calc line 228 - Torsional stiffness");
    translate(graph.posOrigo.x - 200, graph.posOrigo.y);

    textSize(30);
    noStroke();
    textAlign(LEFT, CENTER);

    //** Plate rotation
    text("Plate Deformation in Center of Rotation (CR)", 0, graph.yMax_o + 325); //**Theta
    text("Rotation", 50, graph.yMax_o + 375); //**Theta
    text("\u03B8", 300, graph.yMax_o + 375);
    text("=", 350, graph.yMax_o + 375);
    text("x 10", 470, graph.yMax_o + 375);
    text("rad", 560, graph.yMax_o + 375);

    //** Plate translation
    text("Translation X", 50, graph.yMax_o + 425); //** def
    text("u", 300, graph.yMax_o + 425);
    text("=", 400, graph.yMax_o + 425);
    text("m", 560, graph.yMax_o + 425);

    text("Translation Y", 50, graph.yMax_o + 475); //** def
    text("u", 300, graph.yMax_o + 475);
    text("=", 400, graph.yMax_o + 475);
    text("m", 560, graph.yMax_o + 475);

    textAlign(RIGHT, CENTER);

    //** Theta
    let theta = this.theta;
    let n = this.FindSciNotation_belowOne(theta);
    let front = theta * pow(10, n);
    if (n == 0) front = 0;
    text(nf(front, 0, 2), 460, graph.yMax_o + 375);

    text(nf(round(this.u_FC / 1000, 3), 0, 3), 550, graph.yMax_o + 425);
    text(nf(round(this.v_FC / 1000, 3), 0, 3), 550, graph.yMax_o + 475);

    textSize(20);
    //** Theta
    text(n * -1, 550, graph.yMax_o + 360);

    textAlign(LEFT, CENTER);

    //** Theta
    text("CR", 317, graph.yMax_o + 385);

    //** Def
    text("X_CR", 320, graph.yMax_o + 435);
    text("Y_CR", 320, graph.yMax_o + 485);

    pop();
  }

  DisplayPointDef(pos) {
    if (button_PlateDisplay.state == -1) return;

    let checkInPlateArea = false;
    //** show Def of Point
    let posNew = this.CalcDefPoint(pos);

    this.TL.x, this.TL.y, this.TR.x - this.TL.x, this.BR.y - this.TR.y;
    if (this.TL.x <= pos.x && pos.x <= this.TR.x) {
      if (this.TL.y <= pos.y && pos.y <= this.BR.y) {
        push();
        fill(0);
        noStroke();
        circle(posNew.x, posNew.y, 8);

        stroke(0);
        line(pos.x, pos.y, posNew.x, posNew.y);
        checkInPlateArea = true;
        pop();
      }
    }

    //** Textt under graph
    //** Translation => no distortion at greater angles (theta)
    //posNew.x = (xF +this.u_FC+ (pos.x*10-xF)*cos(this.theta) - (pos.y*10-yF)*sin(this.theta))/10;
    //posNew.y = (yF +this.v_FC+ (pos.x*10-xF)*sin(this.theta) + (pos.y*10-yF)*cos(this.theta))/10;

    push();

    //** Plate rotation

    translate(graph.posOrigo.x, graph.posOrigo.y);

    //** X_new coordinate
    textSize(30);
    noStroke();
    textAlign(LEFT, CENTER);

    translate(600, 0);
    text("Plate Deformation in point (x ,y )", -100, graph.yMax_o + 325); //**Theta

    if (checkInPlateArea) {
      let x = (pos.x - graph.posOrigo.x) / 100;
      let y = (pos.y - graph.posOrigo.y) / 100;
      text(
        "= ( " + nf(x, 0, 2) + " , " + nf(y, 0, 2) + " )",
        340,
        graph.yMax_o + 325
      );
    }
    text("x", -50, graph.yMax_o + 425);
    text("=", 20, graph.yMax_o + 425);
    text("x      +", 50,graph.yMax_o + 425);

    text(
      "u        + (x  - x    ) cos (      ) - (y  - y    ) sin (      )",
      150,
      graph.yMax_o + 425
    );
    text("\u03B8", 453, graph.yMax_o + 427);
    text("\u03B8", 723, graph.yMax_o + 427);

    //** Display value x_new
    if (checkInPlateArea) {
      push();
      textAlign(RIGHT, CENTER);
      let x_new = (posNew.x - graph.posOrigo.x) / 100;
      text(nf(x_new, 0, 2), 900, graph.yMax_o + 425);
      textAlign(LEFT, CENTER);
      text("=", 800, graph.yMax_o + 425);
      text("m", 910, graph.yMax_o + 425);
      pop();
    }

    //** sub
    textSize(20);

    text("i", 281, graph.yMax_o + 335);
    text("i", 311, graph.yMax_o + 335);
    
    text("new", -30, graph.yMax_o + 435);
    text("CR", 70, graph.yMax_o + 435);
    text("X_CR", 170, graph.yMax_o + 435);
    text("i", 288, graph.yMax_o + 435);
    text("CR", 338, graph.yMax_o + 435);
    text("CR", 471, graph.yMax_o + 435);
    text("i", 564, graph.yMax_o + 435);
    text("CR", 614, graph.yMax_o + 435);
    text("CR", 742, graph.yMax_o + 435);

    //** Y_new coordinate
    translate(-800, 50);

    textSize(30);
    noStroke();
    textAlign(LEFT, CENTER);
    translate(800, 0);
    //text("Plate Deformation in point (x ,y )", 0, graph.yMax_o + 325); //**Theta
    text("y", -50, graph.yMax_o + 425);
    text("=", 20, graph.yMax_o + 425);
    text("y      +", 50,graph.yMax_o + 425);
    text(
      "v        + (x  - x    ) sin (      ) + (y  - y    ) cos (      ) ",
      150,
      graph.yMax_o + 425
    );

    text("\u03B8", 453 - 10, graph.yMax_o + 427);
    text("\u03B8", 723 + 5, graph.yMax_o + 427);

    //** Display value y_new
    if (checkInPlateArea) {
      push();
      textAlign(RIGHT, CENTER);
      let y_new = (posNew.y - graph.posOrigo.y) / 100;
      text(nf(y_new, 0, 2), 900, graph.yMax_o + 425);
      textAlign(LEFT, CENTER);
      text("=", 800, graph.yMax_o + 425);
      text("m", 910, graph.yMax_o + 425);
      pop();
    }

    //** sub
    textSize(20);

    //text("i", 381, graph.yMax_o + 335);
    //text("i", 411, graph.yMax_o + 335);
    text("new", -30, graph.yMax_o + 435);
     text("CR", 70, graph.yMax_o + 435);
    text("X_CR", 170, graph.yMax_o + 435);
    text("i", 288, graph.yMax_o + 435);
    text("CR", 338, graph.yMax_o + 435);
    text("CR", 471 - 10, graph.yMax_o + 435);
    text("i", 564, graph.yMax_o + 435);
    text("CR", 614, graph.yMax_o + 435);
    text("CR", 742 + 5, graph.yMax_o + 435);

    pop();
  }

  FindSciNotation_belowOne(number) {
    let test = 0;
    for (let i = 0; i < 10; i++) {
      test = number * pow(10, i);
      //console.log(test)
      if (abs(test) >= 1) {
        return i;
      }
    }
    return 0;
  }
}
