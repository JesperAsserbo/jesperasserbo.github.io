class Calculation {
  constructor(insertPointX, insertPointY) {
    this.insertPoint = new p5.Vector(insertPointX, insertPointY);
    this.steelInsTemp = [];
    this.gasTemp = [];
    this.utilization = [];

    this.ky = []; //** ky - Tabel 3.1
    this.kp = []; //** kp - Tabel 3.1
    this.kE = []; //** kE - Tabel 3.1

    this.critTemp = 0;
    this.critTime = 0;

    this.timeSpan = 120 * 60; //** sek
    this.timeSteel = 0;
    this.timeGas = 0;
    this.utilizationValue = 0.5;
  }

  FindTime() {
    this.utilizationValue = steel.myo;
    let temp =
      39.19 * log(1 / (0.9674 * pow(this.utilizationValue, 3.833)) - 1) + 482;

    //console.log(this.utilizationValue);
    //** search stellInsTemp

    this.critTemp = 0;
    this.critTime = 0;
    for (let i = 0; i < this.steelInsTemp.length; i++) {
      if (temp < this.steelInsTemp[i][1]) {
        this.critTemp = temp;

        //** Find critTime
        let p1x = this.steelInsTemp[i - 1][0];
        let p1y = this.steelInsTemp[i - 1][1];
        let p2x = this.steelInsTemp[i][0];
        let p2y = this.steelInsTemp[i][1];

        let a = (p2y - p1y) / (p2x - p1x);
        let critTime = nf(
          round(p1x / 60 + (this.critTemp - p1y) / a / 60, 0),
          0,
          0
        );

        this.critTimeNotRounded = p1x / 60 + (this.critTemp - p1y) / a / 60;
        this.critTime = critTime;

        break;
      } else {
        this.critTemp =
          39.19 * log(1 / (0.9674 * pow(this.utilizationValue, 3.833)) - 1) +
          482;
        this.critTime = " > 120 min";
      }
    }
  }

  Utilization() {
    if (this.utilization.length > 98) return;
    //** Value in 0 (oo)
    this.utilization.push([0, 10000]);
    for (let i = 1; i < 101; i++) {
      let value = 39.19 * log(1 / (0.9674 * pow(i / 100, 3.833)) - 1) + 482;
      this.utilization.push([i, value]);
      //console.log(this.utilization)
    }
  }

  GasTemp() {
    let arrayLength = this.timeSpan / dt;
    if (this.gasTemp.length >= arrayLength) return;

    for (let i = 0; i < arrayLength; i++) {
      let gasTemp = this.TemperatureGas(this.timeGas);

      this.gasTemp.push([this.timeGas, gasTemp]);
      this.timeGas += dt;
    }
  }

  SteelInsulatedTemp() {
    let arrayLength = this.timeSpan / dt;
    if (this.steelInsTemp.length > arrayLength) return;

    //** startCondition
    let steelTemp = steel.startTemp;
    this.steelInsTemp.push([this.timeSteel, steelTemp]);

    for (let i = 0; i < arrayLength; i++) {
      steelTemp += this.DeltaSteelTemp(this.timeSteel, steelTemp);

      this.timeSteel += dt;
      this.steelInsTemp.push([this.timeSteel, steelTemp]); //** store data with new time.
    }
  }

  ReductionFactor_Ky() {
    //** ky
    if (this.ky.length > 11) return;
    for (let i = 12; i >= 0; i--) {
      let y = i * 100;
      let x = this.YieldTemp(i * 100);

      this.ky.push([x, y]);
    }
  }

  ReductionFactor_Kp() {
    //** kp
    if (this.kp.length > 11) return;
    for (let i = 12; i >= 0; i--) {
      let y = i * 100;
      let x = this.ProportionalLimitTemp(i * 100);
      this.kp.push([x, y]);
    }
  }
  
    ReductionFactor_KE() {
    //** kE
    if (this.kE.length > 11) return;
    for (let i = 12; i >= 0; i--) {
      let y = i * 100;
      let x = this.ElasticLimitTemp(i * 100);
      this.kE.push([x, y]);
    }
  }

  Graph() {
    push();
    translate(400, 1700);

    //** SteelInsulated
    for (let i = 0; i < this.steelInsTemp.length - 1; i++) {
      let x1 = this.steelInsTemp[i][0] / 10;
      let y1 = -this.steelInsTemp[i][1] / 2;
      let x2 = this.steelInsTemp[i + 1][0] / 10;
      let y2 = -this.steelInsTemp[i + 1][1] / 2;

      strokeWeight(2);
      stroke(255, 0, 0);

      line(x1, y1, x2, y2);
    }

    for (let i = 0; i < this.gasTemp.length - 1; i++) {
      //** Gas

      let x3 = this.gasTemp[i][0] / 10;
      let y3 = -this.gasTemp[i][1] / 2;
      let x4 = this.gasTemp[i + 1][0] / 10;
      let y4 = -this.gasTemp[i + 1][1] / 2;

      strokeWeight(2);
      stroke(0, 0, 255);
      line(x3, y3, x4, y4);
    }

    pop();
  }

  DeltaSteelTemp(sek, tempSteel) {
    let deltaTempSteel = 0;
    let phi = this.Phi(tempSteel);
    let c_a = this.SpecificHeatCapacitySteel(tempSteel);
    let tempGas = this.TemperatureGas(sek);
    let dTempGas = 0;
    if (sek > 0)
      dTempGas = this.TemperatureGas(sek) - this.TemperatureGas(sek - dt); //** forskel i gasTemp

    let k = (exp(phi / 10) - 1) * dTempGas;

    //** DS/EN 1993-1-2 formel (4.27)
    deltaTempSteel =
      (ins.lambda_p * ins.sectionFactor * (tempGas - tempSteel) * dt) /
        ((ins.t_p / 1000) * c_a * steel.roh_a * (1 + phi / 3)) -
      k;
    return max(0, deltaTempSteel);
  }

  SpecificHeatCapacitySteel(tempSteel) {
    let ca_steel = 0; //** J/(kg K)
    if (20 <= tempSteel && tempSteel < 600) {
      ca_steel =
        425 +
        0.773 * tempSteel -
        0.00169 * pow(tempSteel, 2) +
        2.22e-6 * pow(tempSteel, 3);
    } else if (600 <= tempSteel && tempSteel < 735) {
      ca_steel = 666 + 13002 / (738 - tempSteel);
    } else if (735 <= tempSteel && tempSteel < 900) {
      ca_steel = 545 + 17820 / (tempSteel - 731);
    } else if (900 <= tempSteel && tempSteel < 1200) {
      ca_steel = 650;
    }

    return ca_steel;
  }

  TemperatureGas(sek) {
    let minutes = sek / 60;
    let temp_gas = 20;
    temp_gas = 20 + 345 * Math.log10(8 * minutes + 1);

    return temp_gas;
  }

  Phi(tempSteel) {
    let c_a = this.SpecificHeatCapacitySteel(tempSteel);

    let phi =
      (ins.c_p * ins.roh_p * (ins.t_p / 1000) * ins.sectionFactor) /
      (c_a * steel.roh_a);

    return phi;
  }

  YieldTemp(temp) {
    //** DS/EN 1993-1-2 Tabel 3.1
    let yieldSteel = 20;
    if (temp <= 400) {
      yieldSteel = 1;
    } else if (400 < temp && temp <= 500) {
      yieldSteel = 1 - ((1 - 0.78) / 100) * (temp - 400);
    } else if (500 < temp && temp <= 600) {
      yieldSteel = 0.78 - ((0.78 - 0.47) / 100) * (temp - 500);
    } else if (600 < temp && temp <= 700) {
      yieldSteel = 0.47 - ((0.47 - 0.23) / 100) * (temp - 600);
    } else if (700 < temp && temp <= 800) {
      yieldSteel = 0.23 - ((0.23 - 0.11) / 100) * (temp - 700);
    } else if (800 < temp && temp <= 900) {
      yieldSteel = 0.11 - ((0.11 - 0.06) / 100) * (temp - 800);
    } else if (900 < temp && temp <= 1000) {
      yieldSteel = 0.06 - ((0.06 - 0.04) / 100) * (temp - 900);
    } else if (1000 < temp && temp <= 1100) {
      yieldSteel = 0.04 - ((0.04 - 0.02) / 100) * (temp - 1000);
    } else if (1100 < temp && temp <= 1200) {
      yieldSteel = 0.02 - ((0.02 - 0.0) / 100) * (temp - 1100);
    }
    return yieldSteel;
  }

  ProportionalLimitTemp(temp) {
    //** DS/EN 1993-1-2 Tabel 3.1
    let PropSteel = 20;
    if (temp <= 100) {
      PropSteel = 1;
    } else if (100 < temp && temp <= 200) {
      PropSteel = 1 - ((1 - 0.807) / 100) * (temp - 100);
    } else if (200 < temp && temp <= 300) {
      PropSteel = 0.807 - ((0.807 - 0.613) / 100) * (temp - 200);
    } else if (300 < temp && temp <= 400) {
      PropSteel = 0.613 - ((0.613 - 0.42) / 100) * (temp - 300);
    } else if (400 < temp && temp <= 500) {
      PropSteel = 0.42 - ((0.42 - 0.36) / 100) * (temp - 400);
    } else if (500 < temp && temp <= 600) {
      PropSteel = 0.36 - ((0.36 - 0.18) / 100) * (temp - 500);
    } else if (600 < temp && temp <= 700) {
      PropSteel = 0.18 - ((0.18 - 0.075) / 100) * (temp - 600);
    } else if (700 < temp && temp <= 800) {
      PropSteel = 0.075 - ((0.075 - 0.05) / 100) * (temp - 700);
    } else if (800 < temp && temp <= 900) {
      PropSteel = 0.05 - ((0.05 - 0.0375) / 100) * (temp - 800);
    } else if (900 < temp && temp <= 1000) {
      PropSteel = 0.0375 - ((0.0375 - 0.025) / 100) * (temp - 900);
    } else if (1000 < temp && temp <= 1100) {
      PropSteel = 0.025 - ((0.025 - 0.0125) / 100) * (temp - 1000);
    } else if (1100 < temp && temp <= 1200) {
      PropSteel = 0.0125 - ((0.0125 - 0.0) / 100) * (temp - 1100);
    }
    return PropSteel;
  }

  ElasticLimitTemp(temp) {
    //** DS/EN 1993-1-2 Tabel 3.1
    let ElasticSteel = 20;
    if (temp <= 100) {
      ElasticSteel = 1;
    } else if (100 < temp && temp <= 200) {
      ElasticSteel = 1 - ((1 - 0.9) / 100) * (temp - 100);
    } else if (200 < temp && temp <= 300) {
      ElasticSteel = 0.9 - ((0.9 - 0.8) / 100) * (temp - 200);
    } else if (300 < temp && temp <= 400) {
      ElasticSteel = 0.8 - ((0.8 - 0.7) / 100) * (temp - 300);
    } else if (400 < temp && temp <= 500) {
      ElasticSteel = 0.7 - ((0.7 - 0.6) / 100) * (temp - 400);
    } else if (500 < temp && temp <= 600) {
      ElasticSteel = 0.6 - ((0.6 - 0.31) / 100) * (temp - 500);
    } else if (600 < temp && temp <= 700) {
      ElasticSteel = 0.31 - ((0.31 - 0.13) / 100) * (temp - 600);
    } else if (700 < temp && temp <= 800) {
      ElasticSteel = 0.13 - ((0.13 - 0.09) / 100) * (temp - 700);
    } else if (800 < temp && temp <= 900) {
      ElasticSteel = 0.09 - ((0.09 - 0.0675) / 100) * (temp - 800);
    } else if (900 < temp && temp <= 1000) {
      ElasticSteel = 0.0675 - ((0.0675 - 0.045) / 100) * (temp - 900);
    } else if (1000 < temp && temp <= 1100) {
      ElasticSteel = 0.045 - ((0.045 - 0.0225) / 100) * (temp - 1000);
    } else if (1100 < temp && temp <= 1200) {
      ElasticSteel = 0.0225 - ((0.0225 - 0.0) / 100) * (temp - 1100);
    }
    return ElasticSteel;
  }
}
