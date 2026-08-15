class Calculation {
  constructor() {
    this.N;
    this.V;
    this.M;
    this.a;
    this.L;
    this.L_eff;
    this.sigma_N;
    this.sigma_M;
    this.sigma_Res;
    this.tau_parallel;
    this.tau_perpendic;
    this.sigma_eff;
    this.sigma_90;

    this.beta;
    this.fu;
    this.sigma_eff_Limit;
  }

  Update() {
    this.M = nf(buttonRollor_M.ReadValue(), 0, 1);
    this.N = nf(buttonRollor_N.ReadValue(), 0, 1);
    this.V = nf(buttonRollor_V.ReadValue(), 0, 1);
    this.a = buttonRollor_a.ReadValue();
    this.L = buttonRollor_L.ReadValue();

    buttonRollor_L.minValue = max(30, this.a * 6) + 2 * this.a;
    if (buttonRollor_L.ReadValue() <= buttonRollor_L.minValue)
      buttonRollor_L.SetValue(buttonRollor_L.minValue);
  }

  Calculate() {
    this.L_eff = this.L - 2 * this.a; //**  30mm (eller 6a) < L_eff < 150a (9.2)
    this.sigma_N = round((this.N * 1000) / (2 * this.a * this.L_eff), 1);

    //let factor = 6;
    //if()
    let factor_M = 6;
    if(button_Plastic.state == 1) factor_M = 4;
    this.sigma_M = round(
      (factor_M * this.M * 1000000) / (2 * this.a * pow(this.L_eff, 2)),
      1
    );

    let res = (abs(this.sigma_N) + abs(this.sigma_M)) / pow(2, 0.5);
    this.sigma_Res = round(res, 1);

    let factor_V = 3/4;
    if(button_Plastic.state == 1) factor_V = 1/2;
    this.tau_parallel = factor_V * round((this.V * 1000) / (this.a * this.L_eff), 1);
    this.tau_perpendic = this.sigma_Res

    let s = pow(this.sigma_Res, 2);
    let t1 = pow(this.tau_perpendic, 2);
    let t2 = pow(this.tau_parallel, 2);

    this.sigma_eff = round(pow(s + 3 * (t1 + t2), 0.5), 1);

    //**
    if (button_S235.state == 1) {
      this.beta = 0.8;
      this.fu = 360;
    }
    if (button_S275.state == 1) {
      this.beta = 0.85;
      this.fu = 410;
    }
    if (button_S355.state == 1) {
      this.beta = 0.9;
      this.fu = 470;
    }

    this.sigma_eff_Limit = round(this.fu / (this.beta * 1.35),1);
  }
}
