class Insulation {
  constructor() {
    this.c_p = 1000; //** [J/(kg K)]
    this.t_p = 45; //** [mm]
    this.roh_p = 2300; //** [kg/m3]
    this.lambda_p = 1.6; //** [W/(m K)]

    this.A_p = 300; //** Areal/længdeenhed ~ omkreds
    this.V_p = 2600; //** Volumen/længdeenhed ~ tværsnitsareal
    this.sectionFactor = (this.A_p / this.V_p) * 1000; //** A/V faktor [m-1]

    //** Specific heat capacity 
    this.buttonRollor_c_p = new ButtonRollor(
      400, //** pos1x - textPro BR
      550, //** pos1y - textPro BR
      20, //** pos2x - "=" BR
      900, //** pos3x - ciffers BL
      910, //** pos4x - unit BR
      4, // prefix
      2, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "Specific heat capacity ", // textPro
      "", // textMid
      "J/(kg K)", // textPre
      1000, // startValue
      0.01, // minValue
      9999 // maxValue
    );

    //** Density
    this.buttonRollor_roh_p = new ButtonRollor(
      400, //** pos1x - textPro BR
      600, //** pos1y - textPro BR
      20, //** pos2x - "=" BR
      900, //** pos3x - ciffers BL
      910, //** pos4x - unit BR
      4, // prefix
      2, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "Density", // textPro
      "", // textMid
      "kg/m ", // textPre
      2300, // startValue
      0.01, // minValue
      9999 // maxValue
    );

    //** lambda - thermal conductivity - jo lavere des bedre isolerende
    this.buttonRollor_lambda_p = new ButtonRollor(
      400, //** pos1x - textPro BR
      650, //** pos1y - textPro BR
      20, //** pos2x - "=" BR
      900, //** pos3x - ciffers BL
      910, //** pos4x - unit BR
      2, // prefix
      3, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "Thermal conductivity", // textPro
      "", // textMid
      "W/(m K)", // textPre
      1.6, // startValue
      0.001, // minValue
      99 // maxValue
    );
    
        //** thickness
    this.buttonRollor_t_p = new ButtonRollor(
      400, //** pos1x - textPro BR
      700, //** pos1y - textPro BR
      20, //** pos2x - "=" BR
      900, //** pos3x - ciffers BL
      910, //** pos4x - unit BR
      3, // prefix
      0, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "Thickness Insulation", // textPro
      "", // textMid
      "mm", // textPre
      45, // startValue
      5, // minValue
      999 // maxValue
    );
    
            //** A_p Eksponeret overflade / m 
    this.buttonRollor_A_p = new ButtonRollor(
      400, //** pos1x - textPro BR
      800, //** pos1y - textPro BR
      20, //** pos2x - "=" BR
      900, //** pos3x - ciffers BL
      910, //** pos4x - unit BR
      5, // prefix
      0, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "A - Areal / mm  ", // textPro
      "", // textMid
      "mm  /mm", // textPre
      300, // startValue
      1, // minValue
      99999 // maxValue
    );
    
                //** V_p Eksponeret overflade / m 
    this.buttonRollor_V_p = new ButtonRollor(
      400, //** pos1x - textPro BR
      850, //** pos1y - textPro BR
      20, //** pos2x - "=" BR
      900, //** pos3x - ciffers BL
      910, //** pos4x - unit BR
      5, // prefix
      0, //sufix
      20, // buttonWidth
      40, // buttonHeight
      30, // letterSize
      "V - Volumen / mm  ", // textPro
      "", // textMid
      "mm  /mm", // textPre
      2600, // startValue
      1, // minValue
      99999 // maxValue
    );
  }

  Update() {
    this.sectionFactor = (this.A_p / this.V_p) * 1000; //** A/V faktor [m-1]
  }

  DisplayAndReadButonRollor(pos) {
    //** Display
    this.buttonRollor_c_p.DisplayButonRollor(pos);
    this.buttonRollor_lambda_p.DisplayButonRollor(pos);
    this.buttonRollor_roh_p.DisplayButonRollor(pos);
    this.buttonRollor_roh_p.DisplayDensityUnit();
    this.buttonRollor_t_p.DisplayButonRollor(pos);
    
    this.buttonRollor_A_p.DisplayButonRollor(pos);
    this.buttonRollor_A_p.Display_A_Unit();
    
    this.buttonRollor_V_p.DisplayButonRollor(pos);
    this.buttonRollor_V_p.Display_V_Unit();
    
    push();
    textSize(30);
    textAlign(RIGHT,BOTTOM);
    
    text("(" + "\u03BB" + ")",720,650)
    
    text(nf(round(this.sectionFactor,1),0,1),900,847.5+50);
    
    textAlign(LEFT,BOTTOM);
    text("Section Factor - A / V",400,847.5+50);
    text("m",910,847.5+50);
    
    textSize(22);
    text("-1",938,847.5+35);
    pop();

    //** Read
    this.c_p = this.buttonRollor_c_p.ReadValue();
    this.lambda_p = this.buttonRollor_lambda_p.ReadValue();
    this.roh_p = this.buttonRollor_roh_p.ReadValue();
    this.t_p = this.buttonRollor_t_p.ReadValue();
    this.A_p = this.buttonRollor_A_p.ReadValue();
    this.V_p = this.buttonRollor_V_p.ReadValue();
  }
}
