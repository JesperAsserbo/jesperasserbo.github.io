class Steel {
  constructor() {
    this.roh_a = 7850; //** [kg/m3]
    this.startTemp = 20;
    this.myo = 0.5; //** Utilization

    //** Utilization
    this.buttonRollor_myo = new ButtonRollor(
      1400, //** pos1x - textPro BR
      900, //** pos1y - textPro BR
      1700, //** pos2x - "=" BR
      1850, //** pos3x - ciffers BL
      1860, //** pos4x - unit BR
      1, // prefix
      3, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "Steel utilization ", // textPro
      "=", // textMid
      "-", // textPre
      0.5, // startValue
      0.015, // minValue (ikke < 0,013 jf. norm)
      1 // maxValue
    );
  }

  DisplayAndReadButonRollor(pos) {
    //** Display
    this.buttonRollor_myo.DisplayButonRollor(pos);

    push();

    textSize(30);
    textAlign(RIGHT, BOTTOM);

    // text(nf(round(this.sectionFactor,1),0,1),900,847.5+50);

    textAlign(LEFT, BOTTOM);
    text("\u03BC", 1650, 847.5 + 50);
    text("(4.23)", 1900, 847.5 + 52.5);

    textSize(22);
    text("o", 1670, 847.5 + 60);

    pop();

    //** Read
    this.myo = this.buttonRollor_myo.ReadValue();
  }

  SpecificHeatCapacitySteel(tempSteel) {
    let c_a_steel = 0; //** J/(kg K)
    if (20 <= tempSteel && tempSteel < 600) {
      c_a_steel =
        425 +
        0.773 * tempSteel -
        0.00169 * pow(tempSteel, 2) +
        2.22e-6 * pow(tempSteel, 3);
    } else if (600 <= tempSteel && tempSteel < 735) {
      c_a_steel = 666 + 13002 / (738 - tempSteel);
    } else if (735 <= tempSteel && tempSteel < 900) {
      c_a_steel = 545 + 17820 / (tempSteel - 731);
    } else if (900 <= tempSteel && tempSteel < 1200) {
      c_a_steel = 650;
    }

    return c_a_steel;
  }
}
