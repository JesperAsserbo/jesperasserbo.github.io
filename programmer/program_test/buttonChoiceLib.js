class ButtonChoiceLib {
  constructor(start) {
    this.arrayLib = [];
    this.elementNumber = start;
    this.elementValue = 0;
  }

  Update() {
    this.size = this.arrayLib.length;
    //this.elementValue = this.arrayLib[this.elementNumber][1];
  }
  
  GetValue(place){
    return this.arrayLib[this.elementNumber][place];
  }

  RestrictScroll() {
    if (this.elementNumber < 0) this.elementNumber = 0;
    if (this.elementNumber > this.size - 1) this.elementNumber = this.size - 1;
  }
}