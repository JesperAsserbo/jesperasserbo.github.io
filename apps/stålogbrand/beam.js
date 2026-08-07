class Beam {
  constructor() {
    this.insertPoint = new p5.Vector(2200, 0);
    this.wpl = 104000; //** HE100B
    this.fyk = 235; //** S235
    this.Mplrd = 10; //**
    this.M_ALS = 10; //**

    //** yield
    this.buttonRollor_fyk = new ButtonRollor(
      2600, //** pos1x - textPro BR
      550, //** pos1y - textPro BR
      3100, //** pos2x - "=" BR
      3300, //** pos3x - ciffers BL
      3310, //** pos4x - unit BR
      3, // prefix
      0, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "Steel yield strength ", // textPro
      "=", // textMid
      "Mpa", // textPre
      235, // startValue
      100, // minValue (ikke < 0,013 jf. norm)
      999 // maxValue
    );

    //** Modstandsmoment - Plastic Section Moment
    this.buttonRollor_wpl = new ButtonRollor(
      2600, //** pos1x - textPro BR
      600, //** pos1y - textPro BR
      3100, //** pos2x - "=" BR
      3300, //** pos3x - ciffers BL
      3390, //** pos4x - unit BR
      4, // prefix
      1, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "Plastic section modulus ", // textPro
      "=", // textMid
      "mm", // textPre
      104, // startValue
      1, // minValue (ikke < 0,013 jf. norm)
      9999 // maxValue
    );

    //** Moment in ALS
    this.buttonRollor_M_ALS = new ButtonRollor(
      2600, //** pos1x - textPro BR
      750, //** pos1y - textPro BR
      3100, //** pos2x - "=" BR
      3300, //** pos3x - ciffers BL
      3310, //** pos4x - unit BR
      4, // prefix
      1, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "Moment Effect - ALS ", // textPro
      "=", // textMid
      "kNm", // textPre
      11.1, // startValue
      0.1, // minValue
      9999 // maxValue
    );

    this.buttonRollor_Tcrit = new ButtonRollor(
      2600, //** pos1x - textPro BR
      1350, //** pos1y - textPro BR
      3100, //** pos2x - "=" BR
      3300, //** pos3x - ciffers BL
      3310, //** pos4x - unit BR
      4, // prefix
      1, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "Chosen Temperature ", // textPro
      "=", // textMid
      "", // textPre
      500, // startValue
      20, // minValue
      1200 // maxValue
    );
  }

  Text() {
    push();

    textSize(36);
    text(
      "Exampel - Beam",
      this.insertPoint.x + 350,
      this.insertPoint.y + 492.5
    );
    textAlign(CENTER);
    textSize(30);
    //text("ADD", this.insertPoint.x + 425, this.insertPoint.y + 440);
    //text("DELETE", this.insertPoint.x + 775, this.insertPoint.y + 440);
    //text("Output Data", this.insertPoint.x + 350, this.insertPoint.y + 1850);
    pop();
  }

  Update() {
    this.Mplrd = nf((this.fyk * this.wpl) / 1.1 / 1e6, 0, 1);
    this.Mplrk = nf((this.fyk * this.wpl) / 1e6, 0, 1);
  }

  DisplayAndReadButonRollor(pos) {
    //** Display
    this.buttonRollor_fyk.DisplayButonRollor(pos);
    this.buttonRollor_wpl.DisplayButonRollor(pos);
    this.buttonRollor_wpl.DisplayUnitsW();
    this.buttonRollor_M_ALS.DisplayButonRollor(pos);
    this.buttonRollor_Tcrit.DisplayButonRollor(pos);

    push();

    textAlign(LEFT, BOTTOM);

    //** 1. Yield
    textSize(30);
    text("f", 3000, 550);
    textSize(22);
    text("yk", 3000 + 10, 550 + 5);

    //** 2. section Modulus
    textSize(30);
    text("W", 3000, 600);
    textSize(22);
    text("pl", 3000 + 30, 600 + 5);

    //** 3. Moment resistence
    textSize(30);
    text("Moment Resistance - ULS", 2600, 700);
    text("M", 3000, 700);
    text("=", 3100, 700);
    textAlign(RIGHT, BOTTOM);
    text(this.Mplrk, 3300, 700);
    textAlign(LEFT, BOTTOM);
    //text("( = f    W    / \u03B3     )", 3500, 700); //** gamma
    text("  = f    W   ", 3500, 700); //** gamma
    text("kNm", 3310, 700);
    textSize(22);
    text("pl,Rk", 3000 + 30, 700 + 5);
    text("yk", 3142 + 415, 700 + 5);
    text("pl", 3200 + 415, 700 + 5);
    //text("M0", 3270 + 415, 700 + 10);

    //** 4. Moment Effect
    textSize(30);
    text("M", 3000, 750);
    textSize(22);
    text("\u03B8,Ed", 3000 + 30, 750 + 5); //** theta

    //** 5. utilization
    textSize(30);
    textAlign(LEFT, BOTTOM);
    text("\u03BC", 3000, 797.5);
    text("=", 3100, 800);
    textAlign(RIGHT, BOTTOM);
    let u = this.M_ALS / this.Mplrk;
    text(nf(round(u, 3), 0, 3), 3300, 800);

    textAlign(LEFT, BOTTOM);
    text("(4.23)", 3420, 800);
    text("-", 3310, 800);
    text("  = M       / M  ", 3500, 800); //** gamma

    textSize(22);
    text("o", 3020, 797.5 + 10);
    text("\u03B8,Ed", 3540 + 30, 800 + 5); //** theta
    text("pl,Rk", 3640 + 30, 800 + 5);

    //** 6. Tcrit
    textSize(30);
    text("\u03B8", 3000, 850); //** theta
    text("=", 3100, 850);
    let tcrit = 39.19 * log(1 / (0.9674 * pow(u, 3.833)) - 1) + 482;
    textAlign(RIGHT, BOTTOM);
    text(nf(round(tcrit, 1), 0, 1), 3300, 850);
    textAlign(LEFT, BOTTOM);
    text(" C", 3310, 850);
    text("(4.22)", 3420, 850);
    textSize(22);
    text("a,cr", 3020, 850 + 5);
    text("o", 3310, 827.5);

    //** 7. Reduction Factor
    textSize(30);
    text("k", 3000, 900);
    text("=", 3100, 900);
    let ky = nf(round(calc.YieldTemp(tcrit), 3), 0, 3);
    textAlign(RIGHT, BOTTOM);
    text(ky, 3300, 900);

    textAlign(LEFT, BOTTOM);
    text("-", 3310, 900);
    text("(Tabel 3.1)", 3420, 900);
    textSize(22);
    text("y,\u03B8", 3020, 900);

    //** 8. Momentkapacitet
    textSize(30);
    text("Moment Resistance - ALS", 2600, 1000);
    text("M", 3000, 1000);
    text("=", 3100, 1000);
    let mrd = nf(round(((ky * 1.1) / 1.0) * this.Mplrd, 1), 0, 1);
    textAlign(RIGHT, BOTTOM);
    text(mrd, 3300, 1000);
    textAlign(LEFT, BOTTOM);
    text("kNm", 3310, 1000);
    textSize(22);
    text("\u03B8,Rd", 3000 + 30, 1000 + 5); //** theta
    textSize(30);
    text("(4.8)", 3420, 1000); //** gamma
    text("  = k            M        = k     M       ", 3500, 1000); //** gamma

    text("\u03B3     ", 3600, 1000 - 25); //** gamma
    line(3600, 1000 - 16, 3650, 1000 - 16);
    text("\u03B3     ", 3600, 1000 + 10); //** gamma
    textSize(22);
    text("y,\u03B8", 3562, 1000 + 5);
    text("M0", 3615, 1000 - 15);
    text("M\u03B8", 3615, 1000 + 20);
    text("pl,Rd", 3690, 1000 + 5);
    text("y,\u03B8", 3797, 1000 + 5);
    text("pl,Rk", 3865, 1000 + 5);

    //** 9. Udnyttelse
    textSize(30);
    text("Ratio", 2600, 1100);
    text("u", 3000, 1100);
    text("=", 3100, 1100);
    let ratio = nf(round(this.buttonRollor_M_ALS.ReadValue() / mrd, 3), 0, 3);
    textAlign(RIGHT, BOTTOM);
    text(ratio, 3300, 1100);
    textAlign(LEFT, BOTTOM);
    text("-", 3310, 1100);
    text("  = M       / M  ", 3500, 1100); //** gamma
    textSize(22);
    text("o", 3020, 1097.5 + 10);
    text("\u03B8,Ed", 3540 + 30, 1100 + 5); //** theta
    text("\u03B8,Rd", 3640 + 30, 1100 + 5);

    //** 10. Chosen critical temperature
    textSize(30);
    text("\u03B8", 3000, 1350); //** theta
    //text("=", 3100, 1350);
    textAlign(RIGHT, BOTTOM);
    textAlign(LEFT, BOTTOM);
    text(" C", 3310, 1350);
    textSize(22);
    text("a,cr", 3020, 1350 + 5);
    text("o", 3310, 1327.5);

    //** 11. ky
    //** 7. Reduction Factor
    textSize(30);
    text("k", 3000, 1400);
    text("=", 3100, 1400);
    let ky_1 = calc.YieldTemp(this.buttonRollor_Tcrit.ReadValue());
    textAlign(RIGHT, BOTTOM);
    text(nf(round(ky_1, 3), 0, 3), 3300, 1400);
    textAlign(LEFT, BOTTOM);
    text("-", 3310, 1400);
    text("(Tabel 3.1)", 3420, 1400);
    textSize(22);
    text("y,\u03B8", 3020, 1400);

    //** 12. Momentkapacitet
    textSize(30);
    text("Moment Resistance - ALS", 2600, 1500);
    text("M", 3000, 1500);
    text("=", 3100, 1500);
    let mrd_1 = nf(round(((ky_1 * 1.1) / 1.0) * this.Mplrd, 1), 0, 1);
    textAlign(RIGHT, BOTTOM);
    text(mrd_1, 3300, 1500);
    textAlign(LEFT, BOTTOM);
    text("kNm", 3310, 1500);
    textSize(22);
    text("\u03B8,Rd", 3000 + 30, 1500 + 5); //** theta
    textSize(30);
    text("(4.8)", 3420, 1500); //** gamma

    //** 13. Udnyttelse
    textSize(30);
    text("Ratio", 2600, 1550);
    text("u", 3000, 1550);
    text("=", 3100, 1550);
    let ratio_1 = nf(
      round(this.buttonRollor_M_ALS.ReadValue() / mrd_1, 3),
      0,
      3
    );
    textAlign(RIGHT, BOTTOM);
    text(ratio_1, 3300, 1550);
    textAlign(LEFT, BOTTOM);
    text("-", 3310, 1550);
    text("  = M       / M  ", 3500, 1550); //** gamma
    textSize(22);
    text("o", 3020, 1097.5 + 10 + 450);
    text("\u03B8,Ed", 3540 + 30, 1550 + 5); //** theta
    text("\u03B8,Rd", 3640 + 30, 1550 + 5);
    pop();

    //** Read
    this.fyk = this.buttonRollor_fyk.ReadValue();
    this.wpl = this.buttonRollor_wpl.ReadValue() * 1000;

    //** Upper limit Mals < Mplrd
    this.M_ALS = min(this.buttonRollor_M_ALS.ReadValue(), this.Mplrk);
    if (this.M_ALS >= this.Mplrk) {
      this.buttonRollor_M_ALS.SetValue(this.Mplrk);
    }

    //** Lower limit utilization: this.M_ALS /  this.Mplrd > 0.015

    if (this.M_ALS <= 0.015 * this.Mplrk) {
      this.buttonRollor_M_ALS.SetValue(0.015 * this.Mplrk);
    }
  }
}
