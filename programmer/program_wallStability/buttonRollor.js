//** class ButtonRollor ** Methods **
//**  DisplayButonRollor(mousePos)
//**  DisplaySign()
//**  SetValue(value)
//**  ReadValue()
//**  MouseOverlapsSign(pos)
//**  ChangeColorSign()
//**  NewValueSign()
//**  ChangeVal(val, pos) - call from mouseWheel in sketch
//**  CheckMinMaxLimit()

class ButtonRollor {
  constructor(
    pos1x, //** textPro BR
    pos1y, //** textPro BR
    pos2x, //** textMid BR
    pos3x, //** ciffers BL
    pos4x, //** unit BR
    numberPrefix,
    numberSufix,
    buttonWidth,
    buttonHeight,
    letterSize,
    textPro,
    textMid,
    textPre,
    StartValue,
    minValue,
    maxValue
  ) {
    this.buttonCiffer = [];
    this.pos1 = new p5.Vector(pos1x, pos1y);
    this.pos2 = new p5.Vector(pos2x, pos1y); //new p5.Vector.add(this.pos1, new p5.Vector(pos2x, 0));
    this.pos3 = new p5.Vector(pos3x, pos1y); //new p5.Vector.add(this.pos1, new p5.Vector(pos3x, 0));
    this.pos4 = new p5.Vector(pos4x, pos1y); //new p5.Vector.add(this.pos1, new p5.Vector(pos4x, 0));

    this.numberPrefix = numberPrefix;
    this.numberSufix = numberSufix;
    this.buttonWidth = buttonWidth;
    this.buttonHeight = buttonHeight;
    this.letterSize = letterSize;

    this.textPro = textPro;
    this.textMid = textMid;
    this.textPre = textPre;

    this.startValue = StartValue;
    this.value;

    if (StartValue < 0) this.signValue = 0; //**1 => + & 0 => -
    if (StartValue >= 0) this.signValue = 1;

    this.minValue = minValue;
    this.maxValue = maxValue;

    if (StartValue < this.minValue) StartValue = this.minValue;
    if (StartValue > this.maxValue) StartValue = this.maxValue;

    this.overlapCiffer = false;

    //**Test if SignExist
    if (minValue >= 0) this.signExist = false;
    else this.signExist = true;

    this.posBL = new p5.Vector();

    for (let i = 1; i <= this.numberSufix; i++) {
      this.buttonCiffer.push(
        new ButtonCiffer(
          this.pos3.x - i * this.buttonWidth,
          this.pos3.y - this.buttonHeight,
          this.buttonWidth,
          this.buttonHeight,
          0,
          this.letterSize
        )
      );
    }

    for (let i = 1; i <= this.numberPrefix; i++) {
      //**If no sufix then correct for ","
      let correction = 10;
      if (this.numberSufix == 0) correction = 0;

      this.buttonCiffer.push(
        new ButtonCiffer(
          this.pos3.x -
            correction -
            this.numberSufix * this.buttonWidth -
            i * this.buttonWidth,
          this.pos3.y - this.buttonHeight,
          this.buttonWidth,
          this.buttonHeight,
          0,
          this.letterSize
        )
      );
    }

    //**SignPos
    let noSign = 10;
    if (this.numberSufix == 0) noSign = 0;

    let signPos_x =
      this.pos3.x -
      noSign -
      this.numberSufix * this.buttonWidth -
      (this.numberPrefix + 1) * this.buttonWidth;
    let signPos_y = this.pos3.y - this.buttonHeight;

    this.signPos = new p5.Vector(signPos_x, signPos_y);

    //**set StartValue
    this.value = this.SetValue(StartValue);
  }

  UpdateIfNotVisible() {
    //this.textPro = "test";
    this.overlapCiffer = false;
  }

  //**Ciffer
  DisplayButonRollor(mousePos) {
    this.overlapCiffer = false;
    for (let i = 0; i < this.buttonCiffer.length; i++) {
      this.buttonCiffer[i].DisplayButonCiffer();
      if (this.buttonCiffer[i].MouseOverlaps(mousePos)) {
        this.buttonCiffer[i].NewValue();
        this.overlapCiffer = true;
      }
    }

    push();
    //textAlign(CENTER,TOP)

    //**If no Suffix
    textSize(30);
    if (this.numberSufix != 0) {
      text(
        ".",
        this.pos3.x - 9 - this.numberSufix * this.buttonWidth,
        this.pos3.y - 5 - 2.5
      );
    }

    //**TextPre
    textAlign(LEFT, BOTTOM);
    text(this.textPro, this.pos1.x, this.pos1.y - 2.5);
    text(this.textMid, this.pos2.x, this.pos2.y - 2.5);
    text(this.textPre, this.pos4.x, this.pos4.y - 2.5);

    //**DisplaySign if minValue < 0 else noSign
    //if (this.minValue < 0) {

    if (this.signExist) {
      //console.log("buttonRollor.DisplayButtonRollor line 146 " + this.minValue + "mousePos " + mousePos)
      this.DisplaySign();
      this.NewValueSign();
      if (this.MouseOverlapsSign(mousePos) == true) this.overlapCiffer = true;
    }
    pop();
  }

  DisplaySign() {
    //console.log("**")
    push();
    fill(0, 150, 0, 50);
    stroke(0, 250, 0, 250);
    rect(this.signPos.x, this.signPos.y, this.buttonWidth, this.buttonHeight);
    pop();

    if (0 <= this.signValue && this.signValue <= 1) this.DisplayValueSign();
  }

  DisplayValueSign() {
    push();
    textSize(this.letterSize);
    textAlign(CENTER, CENTER);
    let sign;
    if (this.signValue == 0) sign = "-";
    if (this.signValue == 1) sign = "+";
    text(
      sign,
      this.signPos.x + 0.5 * this.buttonWidth,
      this.signPos.y + 5 + 0.5 * this.buttonHeight - 2.5
    );
    pop();
  }

  SetValue(value) {
    if (this.signValue == 0) value *= -1;

    let length = this.numberPrefix + this.numberSufix;
    //console.log(" value: " + value);
    for (let i = length; i > this.numberSufix; i--) {
      let a = int(value / pow(10, i - this.numberSufix - 1));
      this.buttonCiffer[i - 1].value = a;
      value = value - a * pow(10, i - this.numberSufix - 1);
      //console.log("i: " + i + " value: " + value);
    }

    for (let i = length - this.numberPrefix; i >= 1; i--) {
      value = round(value, this.numberSufix);
      //console.log("i: " + i + " valueRound: " +value)
      let temp = pow(10, i - this.numberSufix - 1);
      //console.log("temp: " + temp)

      //**1.01 else int sometimes is a lower value (ex 10,3 => 10,2)
      let a = int((value / temp) * 1.01);
      //console.log("a: " + a)
      this.buttonCiffer[i - 1].value = a;
      value = value - a * temp;
      //console.log("i: " + i + " value: " + value)
    }
  }

  ReadValue() {
    let value;
    let valueSumSufix = 0.0;
    let valueSumPrefix = 0.0;
    for (let i = 0; i < this.numberSufix; i++) {
      value = this.buttonCiffer[i].value;
      value = value * pow(10, i - this.numberSufix);
      //value = value*(1/(pow(10,i+this.numberSufix)));
      valueSumSufix += value;
    }

    for (let i = 0; i < this.numberPrefix; i++) {
      value = this.buttonCiffer[i + this.numberSufix].value;
      value = value * pow(10, i);

      valueSumPrefix += value;
    }

    //**Negative values
    let sum = valueSumSufix + valueSumPrefix;
    if (this.signValue <= 0) sum *= -1;

    this.value = sum;
    return sum;
  }

  MouseOverlapsSign(pos) {
    if (pos != undefined) {
      let left = this.signPos.x;
      let right = this.signPos.x + this.buttonWidth;
      let top = this.signPos.y;
      let bottom = this.signPos.y + this.buttonHeight;

      //console.log("pos: " + pos.x)
      //console.log("RigthLimit: " + right)

      if (left < pos.x && pos.x < right) {
        if (top < pos.y && pos.y < bottom) {
          this.ChangeColorSign();
          return true;
        }
      } else {
        return false;
      }
    }
  }

  ChangeColorSign() {
    push();
    fill(100, 100);
    noStroke();
    rect(this.signPos.x, this.signPos.y, this.buttonWidth, this.buttonHeight);
    pop();
  }

  NewValueSign() {
    if (this.signValue <= 0) {
      this.signValue = 0;
    }
    if (this.signValue >= 1) {
      this.signValue = 1;
    }
  }

  ChangeVal(val, pos) {
    //console.log("this.value)
    let valueTempBefore = this.value;
    let valueTempAfter;

    let valueTempBeforeSign;
    let valueTempAfterSign;

    //console.log("valueTempBefore: " + valueTempBefore)

    //*****************************************
    //**Sign check

    if (this.MouseOverlapsSign(pos)) {
      this.signValue += val;

      valueTempAfterSign = this.ReadValue();

      if (this.CheckMinMaxLimit(valueTempAfterSign) == false) {
        this.signValue -= val;
      } else {
        //this.SetValue(valueTempAfterSign);
      }
    }
    //******************************************

    //**Ciffer check
    //if(this.signValue == 0) val *=-1

    for (let i = 0; i < this.buttonCiffer.length; i++) {
      if (this.buttonCiffer[i].MouseOverlaps(pos)) {
        valueTempBefore = this.ReadValue();
        //console.log("ValueTempBefore: " + valueTempBefore);
        //console.log("val: " + val)
        this.buttonCiffer[i].value += val;
        valueTempAfter = this.ReadValue();
        //console.log("ValueTempAfter 1: " + valueTempAfter);
        //console.log("TestMinMax: " + this.CheckMinMaxLimit(valueTempAfter));

        //**If out of limit => return to original value of ciffer
        if (this.CheckMinMaxLimit(valueTempAfter) == false) {
          this.buttonCiffer[i].value -= val;
          this.SetValue(this.minValue);//******************* 2025.06.29
          //**Else change value
        } else {
          //console.log("ValueTempAfter 2: " + valueTempAfter);
          //****************************************************************
          this.SetValue(valueTempAfter);
         // this.value = this.ReadValue()
          //****************************************************************
          //console.log("ValueTempAfter 3: " + valueTempAfter);
        }
      }
    }

    //**If change past zero (0) => set value to minValue
    //console.log("valueTempAfter: " + valueTempAfter)
    let product = valueTempAfter * valueTempBefore;
    //console.log("product: " + product)
    if (product < 0) {
      //****** Improved 2023.08.15
      if (this.minValue < 0) this.SetValue(0);
      else this.SetValue(this.minValue);
      //****** Improved 2023.08.15

      if (this.signValue == 0) this.signValue = 1;
      //if(this.signValue ==1) this.signValue=0
    }
  }

  CheckMinMaxLimit(valueTempAfter) {
    if (this.minValue <= valueTempAfter && valueTempAfter <= this.maxValue) {
      //**Can change value
      return true;
    } else {
      //console.log("Value out of interval");
      return false;
    }
  }

  DisplayUnitsE() {
    push();
    textSize(this.letterSize);
    text("x 10 ", this.pos3.x + 10, this.pos3.y - 7);
    textSize(20);
    text("3", this.pos3.x + 70, this.pos3.y - 20);
    text("2", this.pos4.x + 83, this.pos4.y - 20);
    pop();
  }

  /*
  DisplayUnitsI_Beam() {
    push();
    textSize(this.letterSize);
    text("x 10 ", this.pos3.x + 10, this.pos3.y - 7);
    textSize(20);
    text("6", this.pos3.x + 70, this.pos3.y - 20);
    text("4", this.pos4.x + 53, this.pos4.y - 20);
    pop();
  }
  */

  DisplayUnits_I() {
    push();
    textSize(this.letterSize);
    if (buttonDisplay_Plate.state == 1) {
      text("/m", this.pos3.x + 165, this.pos3.y - 9);
    }
    text("x 10 ", this.pos3.x + 10, this.pos3.y - 7);
    textSize(20);
    text("6", this.pos3.x + 70, this.pos3.y - 20);
    text("4", this.pos4.x + 53, this.pos4.y - 20);
    pop();
  }
}
