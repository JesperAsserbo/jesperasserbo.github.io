let pos1x,
  pos1y,
  pos2x,
  pos3x,
  pos4x,
  numberPrefix,
  numberSufix,
  buttonWidth,
  buttonHeight,
  letterSize,
  textPro,
  textMid,
  textPre,
  startValue,
  minValueRollor,
  maxValueRollor;

class Rebar {
  constructor(number, size, h_ef) {
    this.number = number;
    this.size = size;
    this.h_ef = h_ef;
    this.Area = PI * pow(this.size / 2, 2);
    


    //** calculated in calculation.CalculateRecursion(startGuess)
    this.e_s0 = 0;
    this.s_s0 = 0;
    this.f_s0 = 0;

    //** calculated in calculationOneTime.CalculateRecursion(startGuess)
    //** Used to get calculated Mud
    this.e_s0_oneTime = 0;
    this.s_s0_oneTime = 0;
    this.f_s0_oneTime = 0;

    this.insertPoint = new p5.Vector(0, this.h_ef);
    this.overlapped = false;

    this.limitUp;
    this.limitDown;

    //** ButtonRoller
    this.buttonRollor_ø = new ButtonRollor(
      (pos1x = -125), //** pos1x, textPro BR
      (pos1y = this.h_ef + 20), //** pos1y, textPro BR
      (pos2x = 0), //** pos2x, textMid BR
      (pos3x = -50), //** ciffers BL
      (pos4x = 0), //** unit BR
      (numberPrefix = 2),
      (numberSufix = 0),
      (buttonWidth = 20),
      (buttonHeight = 40),
      (letterSize = 35),
      (textPro = "Ø"),
      (textMid = ""),
      (textPre = ""),
      (startValue = this.size),
      (minValueRollor = 8),
      (maxValueRollor = 32)
    );

    this.buttonRollor_stk = new ButtonRollor(
      (pos1x = 0), //** textPro BR
      (pos1y = this.h_ef + 20), //** textPro BR
      (pos2x = 0), //** textMid BR
      (pos3x = -140), //** ciffers BL
      (pos4x = 0), //** unit BR
      (numberPrefix = 2),
      (numberSufix = 0),
      (buttonWidth = 20),
      (buttonHeight = 40),
      (letterSize = 35),
      (textPro = ""),
      (textMid = ""),
      (textPre = ""),
      (startValue = this.number),
      (minValueRollor = 2),
      (maxValueRollor = 20)
    );
  }

  Update() {
    //this.buttonRollor_stk.pos3.y = this.h_ef;
    //this.buttonRollor_ø.pos3.y = this.h_ef;
  }

  DisplayButtonRollor(insertPoint) {
    //this.Update();
    //** ButtonRollor
    this.graphPosNoScale = new p5.Vector.sub(mousePosWorld, insertPoint);

    
    //**Display ButtonRollor and Read Value
    this.buttonRollor_ø.DisplayButonRollor(this.graphPosNoScale);
    this.buttonRollor_stk.DisplayButonRollor(this.graphPosNoScale);
    

    this.number = this.buttonRollor_stk.ReadValue();
    this.size = this.buttonRollor_ø.ReadValue();
    this.Area = PI * pow(this.size / 2, 2);

    //console.log(" rebar line 95 - h_ef: " + this.h_ef + " f_s0 " +  this.f_s0 + " Area: " + this.Area)
  }
}
