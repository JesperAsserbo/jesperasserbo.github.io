class Calculation {
  constructor() {
    this.fyk;
    this.fyd;
    this.Esk = 200000; //** Esd = Esk
    this.Esd = this.Esk;
    this.e_syd = this.fyd / this.Esd;

    this.fck;
    this.fcd;
    this.ny = 0;
    this.Eck;
    //this.n = 14.5;
    this.n_uls = 14.5;
    this.Ecd = this.Esd / this.n_uls; //****************************************

    this.ec3 = 0.00175;
    this.ecu3 = 0.0035;

    //** Elastic
    this.yo = 0;
    this.S_tr = 0;
    this.A_tr = 0;

    //** Recursion/Iteration
    this.count = 0;
    this.countLimit = 1000;
    this.factor = 1;
    this.guessAdjust = 0;

    this.h_0 = 0;
    this.h_1 = 0;
    this.y_175 = 0;

    this.s_c0 = 0;
    this.f_c0 = 0;
    this.f_c1 = 0;

    this.f_c0_hef = 0;
    this.f_c1_hef = 0;

    this.compresCon = 0;
    this.compresSteel = 0;
    this.compres_sum = 0;
    this.tension = 0;

    this.forceMax = 0;
    this.forceMin = 0;

    this.e_c0 = 0;
    
    //** Stirrups
    this.s_min_1 = 150;
    this.s_min_2 = 150;
    this.s_min_res = 150;

    //** Excentrities to T_res and C_res
    this.e_T_res = 0;
    this.e_C_res = 0;

    //** Resulting forces
    this.T_res = 0;
    this.C_res = 0;

    this.hi = 0;
    this.d = 0;
    
    this.Asw=0;
    this.Vud = 0;
    this.Vud_max = 0;

    //** Graph
    this.eM_graph = [];
    this.eM_graph_saved = [];
    this.graphSaved = false;

    this.Mud = 0;
    this.logMud = 0;
    //this.eM_graph.push([this.e_c0, 0]); //** StartValue
    this.mud = 0;

    this.insertPoint = new p5.Vector(3000, 1250);
    this.saveButtonPos = new p5.Vector(3000, 1350);

    this.displaceX = 0;
    this.displaceY = 0;

    this.logDisplaceY = 0;
  }

  Update() {
    this.fck = buttonRollor_fck.ReadValue();
    this.fcd = buttonRollor_fck.ReadValue() / buttonRollor_gck.ReadValue();
    this.fyk = buttonRollor_fyk.ReadValue();
    this.fyd = buttonRollor_fyk.ReadValue() / buttonRollor_gyk.ReadValue();
    this.e_syd = this.fyd / this.Esk;
    this.ny = 0.7 - this.fck/200;

    //** ULS => ec3 = 1,75 o/oo jf. EC2
    this.n_uls = (0.00175 * this.Esk) / this.fcd; //** => ec3 = 1,75 o/oo
    this.Ecd = this.Esd / this.n_uls;

    this.logMud = calculationOneTime.Mud;

    //** Update saveButtonPos
    this.saveButtonPos.y = this.insertPoint.y + geometry.h + 100;
    this.saveButtonPos.x = this.insertPoint.x + geometry.b;

    //line(0,0,this.saveButtonPos.x,this.saveButtonPos.y)
    //console.log("calculation line 56: " + this.n_uls);
  }

  CalculateStirrup() {
    //** s min 1
    this.d = calculationOneTime.yo + calculationOneTime.e_T_res;
    this.s_min_1 = int(0.75 * this.d);

    //** s min 2
    this.Asw = PI * pow(0.5 * geometry.stirrup_ø, 2) * (2 * geometry.stirrup_n);
    let bw = geometry.b;
    this.s_min_2 = int((15.9 * this.Asw * this.fyk) / (bw * pow(this.fck, 0.5)));

    //** s min result
    if(this.s_min_1>1 &&this.s_min_2>1 ) this.s_min_res = min(this.s_min_1, this.s_min_2);
  }
  
  CalculateShearCapacity(){
    this.Vud = this.Asw/geometry.stirrup_s*this.fyd*calculationOneTime.hi*geometry.cotTheta/1000;
    //console.log("calculation line 125 - Vud: " +this.Vud)
    this.Vud_max = geometry.b*calculationOneTime.hi*this.ny*this.fcd/(geometry.cotTheta+1/geometry.cotTheta)/1000;
   // console.log("calculation line 125 - Vud: " +this.cotTheta)
  }

  /*
  Display_eM_graph() {
    push();

    //** Displace if graph cant fit under geometry
    let displaceY = 0;
    let logMud = 0;
    if (this.logMud > 400) logMud = this.logMud - 400;
    let logSavedMud = 0;
    if (this.eM_graph_saved.length > 0) {
      if (this.eM_graph_saved[35 * 4 - 1][1] > 400)
        logSavedMud = this.eM_graph_saved[35 * 4 - 1][1] - 400;
    }
    displaceY = max(logSavedMud, logMud);

    //** log displaceY
    //** reset in Calculate_eM_graph()
    if (displaceY >= this.logDisplaceY) this.logDisplaceY = displaceY;

    //console.log(this.Mud)
    translate(
      this.insertPoint.x,
      this.insertPoint.y + geometry.h + this.logDisplaceY
    );

    //** Axise
    let yMax = this.logMud;
    if (this.eM_graph_saved.length > 0) {
      yMax = max(this.eM_graph_saved[35 * 4 - 1][1], this.logMud);
    }

    strokeWeight(2);
    this.yMax = max(400, yMax + 0);

    line(0, 10, 0, -this.yMax - 50);
    line(-10, 0, 450, 0);

    fill(0);
    triangle(0, -this.yMax - 50, -5, -this.yMax - 25, 5, -this.yMax - 25);
    triangle(450, 0, 425, 5, 425, -5);

    //** AxisValue X-Axis
    textSize(25);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < 4; i++) {
      text(nf(i, 0, 1), 0 + i * 100, 25);
      line(i * 100, -5, i * 100, +5);
    }

    //** AxisValue Y-Axis
    textAlign(RIGHT, CENTER);

    for (let i = 0; i <= int(this.yMax / 100); i++) {
      text(nf(i * 100, 0, 0), -25, 0 - i * 100);
      line(-5, -i * 100, +5, -i * 100);
    }

    //** Text
    push();
    //** X-axis
    textSize(35);
    textAlign(LEFT, CENTER);
    let symbol = String.fromCharCode(0x03b5);
    text(symbol, 460, 30);
    textSize(25);
    text("c", 480, 40);
    symbol = String.fromCharCode(0x2030);
    textSize(35);
    text("[" + symbol + "]", 500, 30);

    //** Y-axis
    textSize(35);
    text("M", 10, -480 - this.logDisplaceY);
    //textSize(25);
    text("[kNm]", 50, -480 - this.logDisplaceY);
    pop();

    //** graph eM
    for (let i = 1; i < this.eM_graph.length - 1; i++) {
      line(
        -this.eM_graph[i][0] * 10,
        -this.eM_graph[i][1],
        -this.eM_graph[i + 1][0] * 10,
        -this.eM_graph[i + 1][1]
      );
    }

    stroke(255, 0, 0);
    for (let i = this.eM_graph_saved.length - 2; i >= 0; i--) {
      line(
        -this.eM_graph_saved[i][0] * 10,
        -this.eM_graph_saved[i][1],
        -this.eM_graph_saved[i + 1][0] * 10,
        -this.eM_graph_saved[i + 1][1]
      );
    }
    pop();
  }
  */

  Display_eM_graph_A() {
    push();

    //** Displace if graph cant fit under geometry
    let displaceY = 0;
    let y_correct = 100;
    if (geometry.h > 100) y_correct = 100 + (geometry.h - 100);

    /*
    let logSavedMud = 0;
    if (this.eM_graph_saved.length > 0) {
      //if (this.eM_graph_saved[35 * 4 - 1][1] > 400)
        logSavedMud = this.eM_graph_saved[35 * 4 - 1][1];
    }*/

    //displaceY = max(logSavedMud, logMud);

    //** log displaceY
    //** reset in Calculate_eM_graph()
    //if (displaceY >= this.logDisplaceY) this.logDisplaceY = displaceY;

    translate(this.insertPoint.x + geometry.b, this.insertPoint.y + geometry.h);

    //** Axise
    let yMax = this.logMud;
    if (this.eM_graph_saved.length > 0) {
      yMax = max(this.eM_graph_saved[35 * 4 - 1][1], this.logMud, y_correct);
    } else {
      yMax = max(this.logMud, y_correct);
    }

    strokeWeight(2);
    this.yMax = max(100, yMax - 0);

    //console.log(this.yMax)

    //** Scale if Mud > Y-graph
    this.scale_Mud_Y = this.yMax / this.logMud;

    //** Scale if yMax > h-graph
    if (this.yMax > geometry.h) {
      this.scale_Mud_Y = geometry.h / this.logMud;
      this.yMax = geometry.h;
    }

    line(0, 10, 0, -this.yMax - 50);
    line(-10, 0, 450, 0);

    fill(0);
    triangle(0, -this.yMax - 50, -5, -this.yMax - 25, 5, -this.yMax - 25);
    triangle(450, 0, 425, 5, 425, -5);

    //console.log(this.scale_Mud_Y)
    //** AxisValue X-Axis
    textSize(25);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < 4; i++) {
      text(nf(i, 0, 1), 0 + i * 100, 25);
      line(i * 100, -5, i * 100, +5);
    }

    //** AxisValue Y-Axis
    textAlign(RIGHT, CENTER);
    this.interval = 5;
    if (this.logMud >= 20) this.interval = 10;
    if (this.logMud >= 100) this.interval = 25;
    if (this.logMud >= 200) this.interval = 50;
    if (this.logMud >= 500) this.interval = 100;
    if (this.logMud >= 1000) this.interval = 200;

    let divide = this.logMud / this.interval;

    for (let i = 0; i <= divide; i++) {
      text(
        nf(i * this.interval, 0, 0),
        -25,
        0 - i * this.interval * this.scale_Mud_Y
      );
      line(
        -5,
        -i * this.interval * this.scale_Mud_Y,
        +5,
        -i * this.interval * this.scale_Mud_Y
      );
    }

    //** Text
    push();
    //** X-axis
    textSize(35);
    textAlign(LEFT, CENTER);
    let symbol = String.fromCharCode(0x03b5);
    text(symbol, 460, 30);
    textSize(25);
    text("c", 480, 40);
    symbol = String.fromCharCode(0x2030);
    textSize(35);
    text("[" + symbol + "]", 500, 30);

    //** Y-axis
    textSize(35);
    text("M", 20, -y_correct - 100);
    //textSize(25);
    text("[kNm]", 60, -y_correct - 100);
    pop();

    //** graph eM
    for (let i = 1; i < this.eM_graph.length - 1; i++) {
      line(
        -this.eM_graph[i][0] * 10,
        -this.eM_graph[i][1] * this.scale_Mud_Y,
        -this.eM_graph[i + 1][0] * 10,
        -this.eM_graph[i + 1][1] * this.scale_Mud_Y
      );
    }

    stroke(255, 0, 0);
    for (let i = this.eM_graph_saved.length - 2; i >= 0; i--) {
      line(
        -this.eM_graph_saved[i][0] * 10,
        -this.eM_graph_saved[i][1] * this.scale_Mud_Y,
        -this.eM_graph_saved[i + 1][0] * 10,
        -this.eM_graph_saved[i + 1][1] * this.scale_Mud_Y
      );
    }
    pop();
  }

  Calculate_eM_graph() {
    //** If change => calc
    //this.logMud =
    //text(this.logMud,500,1500)

    if (reCalc) {
      this.e_c0 = 0;
      this.logDisplaceY = 0;
      this.calcMudMax = true;

      //** variable set to false when reCalc
      //** so that extra graph can be displayed
      this.graphSaved = false;

      //** array delete
      this.eM_graph = [];
    }

    //** Calculate if e_c0 and no graph saved (false)
    if (this.e_c0 >= -35 && !this.graphSaved) {
      if (this.e_c0 == 0) {
        this.Mud = 0;
      }
      this.eM_graph.push([this.e_c0, this.Mud]);
      this.e_c0 -= 0.25;
    }

    //*************************************************************************
    //** if graph saved display slideCircle
    //console.log("calculate line 132 - graphSaved: " + this.graphSaved);
    push();

    translate(this.insertPoint.x + geometry.b, this.insertPoint.y + geometry.h);

    if (this.graphSaved) {
      let x_start = this.insertPoint.x + geometry.b;
      let y_start = this.insertPoint.y + geometry.h;
      let posX = geometry.Step(mousePosWorld.x);
      let pos = posX - x_start;

      if (
        x_start + 5 < mousePosWorld.x &&
        mousePosWorld.x <= x_start + 350 &&
        y_start - 50 < mousePosWorld.y &&
        mousePosWorld.y < y_start + 50
      ) {
        if (this.eM_graph_saved.length > 0) {
          this.e_c0 = (x_start - posX) / 10;

          //** *4 because step 0.25 (1/0.25 = 4)
          let Mud = this.eM_graph_saved[-this.e_c0 * 4][1];

          fill(0);
          circle(posX - x_start, 0, 6);
          circle(posX - x_start, -Mud * this.scale_Mud_Y, 6);
          circle(0, -Mud * this.scale_Mud_Y, 6);

          /*
          let extent = 0;
          for (let i = 0; i < 4; i++) {
            if (20 + i * 100 <= pos && pos <= 80 + i * 100) extent = 30;
            line(pos, 0, pos, extent);
          }
          */

          /*
          let count = int(this.yMax / 100);
          let extent_Y = 0;
          for (let i = 0; i < count; i++) {
            if ((20 + i * 100) <= Mud && Mud <= (80 + i * 100)) extent_Y = 65;
            line(0, -Mud, -extent_Y, -Mud);
          }  */

          line(posX - x_start, 0, posX - x_start, -Mud * this.scale_Mud_Y);
          line(
            posX - x_start,
            -Mud * this.scale_Mud_Y,
            0,
            -Mud * this.scale_Mud_Y
          );

          //** text
          textSize(25);
          textAlign(RIGHT, CENTER);
          text(nf(Mud, 0, 1), -75, -Mud * this.scale_Mud_Y);
          textAlign(CENTER, CENTER);
          text(nf(-this.e_c0 / 10, 0, 2), posX - x_start, 50);
        }
      }
    } else this.graphSaved = false;

    pop();
    //console.log("calc line 252 lodDisplace: " + this.logDisplaceY);
  }

  DisplaySaveButton() {
    push();
    noFill();
    circle(this.saveButtonPos.x, this.saveButtonPos.y, 50);
    fill(0);
    textSize(30);
    textAlign(LEFT, CENTER);
    text("Save Graph", this.saveButtonPos.x + 50, this.saveButtonPos.y);
    pop();
  }

  OverlapSaveButton(pos) {
    push();
    let distToSaveButton = dist(
      pos.x,
      pos.y,
      this.saveButtonPos.x,
      this.saveButtonPos.y
    );
    // console.log("calc Line 426 - DistToSaveButton: " + distToSaveButton)

    if (distToSaveButton < 20) {
      push();
      fill(100, 100, 100, 100);
      circle(this.saveButtonPos.x, this.saveButtonPos.y, 50);
      pop();
      if (mouseIsPressed) {
        fill(0, 255, 0, 100);
        circle(this.saveButtonPos.x, this.saveButtonPos.y, 50);
      }
      return true;
    } else return false;
    pop();
  }

  Calcuate_Save_graph() {
    push();
    this.OverlapSaveButton(mousePosWorld);
    pop();
    //console.log("oneTime " + oneTime)
    if (!mouseIsPressed && oneTime && this.OverlapSaveButton(mousePosWorld)) {
      //** Delete old saved
      this.eM_graph_saved = [];

      this.logDisplaceY = 0;

      //** copy array (if not already saved)
      if (!this.graphSaved && this.eM_graph_saved.length < 10) {
        for (let i = 0; i < this.eM_graph.length; i++) {
          this.eM_graph_saved.push(this.eM_graph[i]);
        }
      }
      this.graphSaved = true;
      this.eM_graph = [];
    }
    oneTime = false;
    //console.log(this.eM_graph_saved.length);
  }

  ForceMinMaxRebar() {
    this.forceMax = 0;
    this.forceMin = 0;
    for (let i = 0; i < geometry.rebar.length; i++) {
      if (geometry.rebar[i].f_s0 > this.forceMax)
        this.forceMax = geometry.rebar[i].f_s0;
      if (geometry.rebar[i].f_s0 < this.forceMin)
        this.forceMin = geometry.rebar[i].f_s0;
    }
    //console.log(this.forceMin)
  }

  ForceResulting() {
    this.C_res = 0;
    this.T_res = 0;

    this.e_C_res = 0;
    this.e_T_res = 0;

    this.Mud_C = 0;
    this.Mud_T = 0;

    this.C_res = this.f_c0 + this.f_c1;

    let yo = this.h_0 + this.h_1;
    this.Mud_C += abs((this.f_c0 * (yo - this.f_c0_hef)) / 1000);
    this.Mud_C += abs((this.f_c1 * (yo - this.f_c1_hef)) / 1000);

    for (let i = 0; i < geometry.rebar.length; i++) {
      if (geometry.rebar[i].f_s0 < 0) {
        this.C_res += geometry.rebar[i].f_s0;
        this.Mud_C += abs(
          (geometry.rebar[i].f_s0 * (geometry.rebar[i].h_ef - yo)) / 1000
        );
      }

      if (geometry.rebar[i].f_s0 >= 0) {
        this.T_res += geometry.rebar[i].f_s0;
        this.Mud_T += abs(
          (geometry.rebar[i].f_s0 * (geometry.rebar[i].h_ef - yo)) / 1000
        );
      }
    }

    //** excentrities with respect to yo
    this.e_T_res = (this.Mud_T / this.T_res) * 1000;
    this.e_C_res = (this.Mud_C / this.C_res) * 1000;

    this.hi = this.e_T_res + abs(this.e_C_res);
    //console.log("calculation line 355: " + this.hi);

    //this.compres_sum = 0;
    //this.tension = 0;
  }

  CalculateMud() {
    //console.log(this.e_c0 + " " + typeof(this.Mud))
    this.Mud = 0;

    let yo = this.h_0 + this.h_1;
    this.Mud += abs(this.f_c0 * (yo - this.f_c0_hef));
    this.Mud += abs(this.f_c1 * (yo - this.f_c1_hef));

    for (let i = 0; i < geometry.rebar.length; i++) {
      this.Mud += abs(geometry.rebar[i].f_s0 * (geometry.rebar[i].h_ef - yo));
    }

    this.Mud = this.Mud / 1000;
  }

  DisplayMud() {
    push();

    translate(this.insertPoint.x + geometry.b, this.insertPoint.y + geometry.h);
    let y = calculationOneTime.Mud * this.scale_Mud_Y;
    textSize(25);
    text("ud", 405, 15 - y);
    textAlign(RIGHT, CENTER);
    textSize(35);
    text(nf(calculationOneTime.Mud, 0, 1), 575, -y);
    textAlign(LEFT, CENTER);
    textSize(35);
    text("M", 370, -y);
    text("=", 440, -y);
    text("kNm", 600, -y);
    pop();
  }

  CalculateRecursion(startGuess) {
    //** Counter for stopCriteria
    this.count += 1;

    //** StartGuess
    startGuess += this.factor * this.guessAdjust; //**
    this.guessAdjust = 10 * exp(-0.05 * this.count); //** Exponential decay

    //** Calculate yo with startGuess

    //** Concrete_1
    this.y_175 = startGuess + (1.75 / (this.e_c0 / 10)) * startGuess;
    //this.h_0 = 0;
    //this.h_1 = 0;
    if (this.y_175 > 0) this.h_0 = this.y_175;
    else this.h_0 = 0;
    this.h_1 = startGuess - this.h_0;

    this.compresCon = 0;
    this.compresSteel = 0;
    this.compres_sum = 0;
    this.tension = 0;

    //** Concrete
    this.s_c0 = ConcreteStress(this.e_c0 / 10);
    this.f_c0 = (this.s_c0 * geometry.b * this.h_0) / 1000;
    this.f_c1 = (this.s_c0 * ((1 / 2) * geometry.b * this.h_1)) / 1000;
    this.compresCon = this.f_c0 + this.f_c1;

    //** Height to Resultant concret
    this.f_c0_hef = 0.5 * this.h_0;
    //this.f_c1_hef = this.yo - (2 / 3) * this.h_1;
    this.f_c1_hef = this.h_0 + (1 / 3) * this.h_1;

    //console.log( this.f_c1_hef)

    //** Concrete Strain
    //this.e_c0 = -min(mouseX, 35); //** Concrete strain at top
    let yo = this.h_0 + this.h_1;
    this.e_c2 = (-this.e_c0 * (geometry.h - yo)) / yo; //** Concrete strain at bottom

    //** Steel
    for (let i = 0; i < geometry.rebar.length; i++) {
      geometry.rebar[i].e_s0 =
        (-this.e_c0 / startGuess) * -(startGuess - geometry.rebar[i].h_ef);
      geometry.rebar[i].s_s0 = SteelStress(geometry.rebar[i].e_s0 / 10);
      let n = geometry.rebar[i].number;
      let As = geometry.rebar[i].Area;
      geometry.rebar[i].f_s0 = (geometry.rebar[i].s_s0 * (n * As)) / 1000;
    }

    //** Steel in tension
    for (let i = 0; i < geometry.rebar.length; i++) {
      //** Steel in compression
      if (geometry.rebar[i].e_s0 <= 0)
        this.compresSteel += geometry.rebar[i].f_s0;

      //** Steel in tension
      if (geometry.rebar[i].e_s0 > 0) this.tension += geometry.rebar[i].f_s0;
    }

    //** calc equalibrium (yo) with startGuess ** StopCriteria
    this.yo = startGuess;

    this.compres_sum = this.compresCon + this.compresSteel;
    let diff = this.compres_sum + this.tension;
    if (diff < 0) this.factor = -1;
    if (diff > 0) this.factor = 1;

    /*
    console.log(
      "com: " +
        this.compres_sum +
        " Tens: " +
        this.tension +
        " diff:" +
        diff +
        " yo: " +
        this.yo
    );*/

    //** STOP condition I
    if (-0.001 < diff && diff < 0.001) {
      //console.log("Limit: " + limit);
      this.count = 0;

      return;
    }

    //** STOP condition II
    if (this.count >= this.countLimit) {
      //console.log("** Limit **");
      this.count = 0;
      return;
    }
    //console.log("** Limit **" + this.count);

    //** RECURTION
    this.CalculateRecursion(this.yo);
  }
}

function SteelStress(e) {
  let e_syd = calculation.e_syd * 1000; //** 2.29 o/oo
  if (-e_syd <= e && e <= e_syd) return ((e / 1000) * calculation.Esd) / 1;
  if (e < -e_syd) return -calculation.fyd;
  if (e > e_syd) return calculation.fyd;
  else return 0;
}

function ConcreteStress(e) {
  let e_c3 = 1.75;
  if (-e_c3 <= e && e <= e_c3) return ((e / 1000) * calculation.Ecd) / 1;
  if (e < -e_c3) return -calculation.fcd;
  if (e > e_c3) return calculation.fcd;
  else return false;
}
