class CalculationOneTime {
  constructor() {
    this.fyk;
    this.fyd;
    this.Esk = 200000; //** Esd = Esk
    this.Esd = this.Esk;
    this.e_syd = this.fyd / this.Esd;

    this.fck;
    this.fcd;
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
    
    //** Excentrities to T_res and C_res
    this.e_T_res = 0;
    this.e_C_res = 0;

    //** Resulting forces
    this.T_res = 0;
    this.C_res = 0;

    this.hi = 0;

    //** Graph
    this.eM_graph = [];
    this.eM_graph_saved = [];
    this.graphSaved = false;

    this.Mud = 0;
    this.logMud = 0;
    //this.eM_graph.push([this.e_c0, 0]); //** StartValue
    this.mud = 0;

    this.insertPoint = new p5.Vector(600, 1900);
    this.saveButtonPos = new p5.Vector(350, 1900);

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

    //** ULS => ec3 = 1,75 o/oo jf. EC2
    this.n_uls = (0.00175 * this.Esk) / this.fcd; //** => ec3 = 1,75 o/oo
    this.Ecd = this.Esd / this.n_uls;

 
  }

  CalculateMud() {
    //console.log(this.e_c0 + " " + typeof(this.Mud))
    this.Mud = 0;

    let yo = this.h_0 + this.h_1;
    this.Mud += abs(this.f_c0 * (yo - this.f_c0_hef));
    this.Mud += abs(this.f_c1 * (yo - this.f_c1_hef));

    for (let i = 0; i < geometry.rebar.length; i++) {
      this.Mud += abs(geometry.rebar[i].f_s0_oneTime * (geometry.rebar[i].h_ef - yo));
    }

    this.Mud = this.Mud / 1000;
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
    this.s_c0 = ConcreteStressOneTime(this.e_c0 / 10);
    this.f_c0 = (this.s_c0 * geometry.b * this.h_0) / 1000;
    this.f_c1 = (this.s_c0 * ((1 / 2) * geometry.b * this.h_1)) / 1000;
    this.compresCon = this.f_c0 + this.f_c1;
    

    //** Height to Resultant concret
    this.f_c0_hef = 0.5 * this.h_0;
    //this.f_c1_hef = this.yo - (2 / 3) * this.h_1;
    this.f_c1_hef = this.h_0 + (1 / 3) * this.h_1;

    //console.log( this.f_c1_hef)

    //** Concrete Strain
    this.e_c0 = -35; //** Concrete strain at top
    let yo = this.h_0 + this.h_1;
    this.e_c2 = (-this.e_c0 * (geometry.h - yo)) / yo; //** Concrete strain at bottom

    //** Steel
    for (let i = 0; i < geometry.rebar.length; i++) {
      geometry.rebar[i].e_s0_oneTime =
        (-this.e_c0 / startGuess) * -(startGuess - geometry.rebar[i].h_ef);
      geometry.rebar[i].s_s0_oneTime = SteelStressOneTime(geometry.rebar[i].e_s0_oneTime / 10);
      let n = geometry.rebar[i].number;
      let As = geometry.rebar[i].Area;
      geometry.rebar[i].f_s0_oneTime = (geometry.rebar[i].s_s0_oneTime * (n * As)) / 1000;
    }

    //** Steel in tension
    for (let i = 0; i < geometry.rebar.length; i++) {
      //** Steel in compression
      if (geometry.rebar[i].e_s0_oneTime <= 0)
        this.compresSteel += geometry.rebar[i].f_s0_oneTime;

      //** Steel in tension
      if (geometry.rebar[i].e_s0_oneTime > 0) this.tension += geometry.rebar[i].f_s0_oneTime;
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
  
  

}

function SteelStressOneTime(e) {
  let e_syd = calculationOneTime.e_syd * 1000; //** 2.29 o/oo
  if (-e_syd <= e && e <= e_syd) return ((e / 1000) * calculationOneTime.Esd) / 1;
  if (e < -e_syd) return -calculationOneTime.fyd;
  if (e > e_syd) return calculationOneTime.fyd;
  else return 0;
}

function ConcreteStressOneTime(e) {
  let e_c3 = 1.75;
  if (-e_c3 <= e && e <= e_c3) return ((e / 1000) * calculationOneTime.Ecd) / 1;
  if (e < -e_c3) return -calculationOneTime.fcd;
  if (e > e_c3) return calculationOneTime.fcd;
  else return false;
}