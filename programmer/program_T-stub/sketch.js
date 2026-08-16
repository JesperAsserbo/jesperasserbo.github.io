//** check calc this.lambda og this.a1 Line 83

let count = 0;

//**ButtonChoice
let buttonChoiceBoltSize;
let buttonChoiceLibBoltSize;

let buttonChoiceBoltStrength;
let buttonChoiceLibBoltStrength;

let buttonChoiceBoltCount;
let buttonChoiceLibBoltCount;

//** ButtonRollor
let buttonRollor_t;
let buttonRollor_a1;
let buttonRollor_bf;
let buttonRollor_b;

let graphPosNoScale_t;
let graphPosNoScale_a1;
let graphPosNoScale_a2;
let graphPosNoScale_b;

//**Layout
let layoutText;

//**Figure
let figure;

//**Calculation
let calc;
let calcFirstRun = 0;
let calcZoneActive;

//**Time
let timeReal;

//**Limit mouse call to one call;
let mouseButtonIsClicked = false;
let mouseButtonIsReleased = false;
let oneTime = false;

//**Pan and Zoom
let mousePosScreen = new p5.Vector(0, 0);
let mousePosWorld = new p5.Vector(0, 0);
let mousePosWorldPre = new p5.Vector(0, 0);
let scaleFactorStep = 1.1; // [1;xx] 1 = ingen scale, 2 = dobbelt/halvering
let movingObject = false; //** flag used in pan

let S = new p5.Vector(0.5, 0.5); //**ScaleFactor
let T = new p5.Vector(0, 0);
let T1 = new p5.Vector(0, 0); //**ScaleFactor (svarer til translation tilbage til origo)

let startPan = new p5.Vector(0, 0);

function setup() {
  //createCanvas(windowWidth - 10, windowHeight - 10);


    //** GitHub - Remember delete Loop()
  
    //** GitHub setUp - Start 
    let canvas = createCanvas(
    document.getElementById("programvindue").clientWidth,
    document.getElementById("programvindue").clientHeight
  );

  canvas.parent("programvindue");
  //** GitHub setUp - End 
  

  layoutTest = new Layout(350, 400);
  calc = new Calculation();
  figure = new Figure(1700, 700);

  //** ButtonChoice BoltSize *** START
  buttonChoiceLibBoltSize = new ButtonChoiceLib(3); //** (startElement)
  buttonChoiceLibBoltSize.arrayLib = [
    ["M10", 58.0, 10, 19.6, 7],
    ["M12", 84.3, 12, 21.9, 8],
    ["M14", 115.0, 14, 25.4, 9],
    ["M16", 157.0, 16, 27.7, 10],
    ["M20", 245.0, 20, 34.6, 13],
    ["M22", 303.0, 22, 37.0, 14],
    ["M24", 353.0, 24, 41.6, 15],
    ["M27", 459.0, 27, 47.3, 17],
    ["M30", 561.0, 30, 53.1, 19],
  ]; //** [name, As, ø, d_møtrik, hjørnemål e, møtrik højde]

  buttonChoiceBoltSize = new ButtonChoice(
    900,
    495,
    100,
    40,
    30,
    buttonChoiceLibBoltSize.arrayLib
  ); //** posX,posY,w,h,textSize, Lib
  //** ButtonChoice BoltSize *** END

  //** ButtonChoice BoltStrength *** START
  buttonChoiceLibBoltStrength = new ButtonChoiceLib(5); //** (startElement)
  buttonChoiceLibBoltStrength.arrayLib = [
    ["4.6", 400, 240],
    ["4.8", 400, 320],
    ["5.6", 500, 300],
    ["5.8", 500, 400],
    ["6.8", 600, 480],
    ["8.8", 800, 640],
    ["10.9", 1000, 900],
  ]; //** [name, fub, fyb]

  buttonChoiceBoltStrength = new ButtonChoice(
    900,
    545,
    100,
    40,
    30,
    buttonChoiceLibBoltStrength.arrayLib
  ); //** posX,posY,w,h,textSize, Lib
  //** ButtonChoice BoltStrength *** END

  //** ButtonChoice BoltCount *** START
  buttonChoiceLibBoltCount = new ButtonChoiceLib(0); //** (startElement)
  buttonChoiceLibBoltCount.arrayLib = [
    ["2", 2, 0],
    //["4", 4, 1],
    //["6", 6, 2],
    //["8", 8, 3],
  ]; //** [name, count, x]

  buttonChoiceBoltCount = new ButtonChoice(
    900,
    595,
    100,
    40,
    30,
    buttonChoiceLibBoltCount.arrayLib
  ); //** posX,posY,w,h,textSize, Lib
  //** ButtonChoice BoltCount *** END

  //** ButtonChoice PlateStrength *** START
  buttonChoiceLibPlateStrength = new ButtonChoiceLib(0); //** (startElement)
  buttonChoiceLibPlateStrength.arrayLib = [
    ["S235", 235, 225, 215],
    ["S275", 275, 265, 255],
    ["S355", 355, 345, 335],
    ["S450", 450, 430, 410],
  ]; //** [name, strength, x]

  buttonChoicePlateStrength = new ButtonChoice(
    900,
    645,
    100,
    40,
    30,
    buttonChoiceLibPlateStrength.arrayLib
  ); //** posX,posY,w,h,textSize, Lib
  //** ButtonChoice BoltCount *** END

  //**ButtonRollor_t
  buttonRollor_t = new ButtonRollor(
    (pos1x = 0), //** textPro BR
    (pos1y = -5 + 900), //** textPro BR
    (pos2x = 125), //** "=" BR
    (pos3x = 350 + 550), //** ciffers BL
    (pos4x = 360 + 550), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 22.5),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = ""),
    (textMid = ""),
    (textPre = "mm"),
    (startValue = 15),
    (minValue = 1),
    (maxValue = 200)
  );

  //**ButtonRollor_b //** ændret til L
  buttonRollor_b = new ButtonRollor(
    (pos1x = 0), //** textPro BR
    (pos1y = -5 + 950), //** textPro BR
    (pos2x = 125), //** "=" BR
    (pos3x = 350 + 550), //** ciffers BL
    (pos4x = 360 + 550), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 22.5),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = ""),
    (textMid = ""),
    (textPre = "mm"),
    (startValue = 100),
    (minValue = 50),
    (maxValue = 200)
  );

  //**ButtonRollor_a1
  buttonRollor_a1 = new ButtonRollor(
    (pos1x = 0), //** textPro BR
    (pos1y = -5 + 1050), //** textPro BR
    (pos2x = 125), //** "=" BR
    (pos3x = 350 + 550), //** ciffers BL
    (pos4x = 360 + 550), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 22.5),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = ""),
    (textMid = ""),
    (textPre = "mm"),
    (startValue = 40),
    (minValue = 5),
    (maxValue = 200)
  );

  //**ButtonRollor_bf
  buttonRollor_bf = new ButtonRollor(
    (pos1x = 0), //** textPro BR
    (pos1y = -5 + 1000), //** textPro BR
    (pos2x = 125), //** "=" BR
    (pos3x = 350 + 550), //** ciffers BL
    (pos4x = 360 + 550), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 22.5),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = ""),
    (textMid = ""),
    (textPre = "mm"),
    (startValue = 100),
    (minValue = 0),
    (maxValue = 250)
  );
}


//** GitHub - Rezise browserWindow 
function windowResized() {
    const programvindue = document.getElementById("programvindue");

    if (programvindue) {
        resizeCanvas(
            programvindue.clientWidth,
            programvindue.clientHeight
        );
    }
}
//** GitHub - Rezise browserWindow 


function draw() {
  background(100);
  count++;

  //**Display TimePerFrame
  let timePerFrame = millis() - timeReal;
  timeReal = millis();
  //text(nf(timePerFrame, 0, 0), 100, 20);
  //text(nf(millis(), 0, 0), 100, 32);

  //** GitHub delete Loop
  //**StopOfLoop if too long time
  //if (timePerFrame > 2000) noLoop();

  mousePosScreen.x = mouseX;
  mousePosScreen.y = mouseY;

  mousePosWorld.x = (mousePosScreen.x - T.x) / S.x;
  mousePosWorld.y = (mousePosScreen.y - T.y) / S.y;

  //** PAN/ZOOM struktur
  //** MousePos ->
  //** Beregn mousePosWorld
  //** applyMatrix(T)
  //** applyMatrix(S)
  //** tegn verden
  //**

  //***** TRANSFORMATION *****
  applyMatrix(1, 0, 0, 1, T.x, T.y);
  applyMatrix(S.x, 0, 0, S.y, 0, 0);

  //**Paper
  paper_0 = new Paper(0, 0);
  paper_1 = new Paper(2200, 0);

  //**Paper
  paper_0.DisplayPaperCross(2100, 3000); //**Page 1
  //paper_1.DisplayPaperCross(2100, 3000); //**Page 2
  //paper_0.DisplayPaperBlank(2100, 3000);
  paper_0.DisplayHeader();
  paper_0.DisplayText();

  //** ButtonChoice ** START
  //** BoltSize
  buttonChoiceBoltSize.Display(mousePosWorld, buttonChoiceLibBoltSize);
  buttonChoiceLibBoltSize.Update();

  //** BoltStrength
  buttonChoiceBoltStrength.Display(mousePosWorld, buttonChoiceLibBoltStrength);
  buttonChoiceLibBoltStrength.Update();

  /*
  //** BoltCount
  buttonChoiceBoltCount.Display(mousePosWorld, buttonChoiceLibBoltCount);
  buttonChoiceLibBoltCount.Update();
*/

  //** BoltCount
  buttonChoicePlateStrength.Display(
    mousePosWorld,
    buttonChoiceLibPlateStrength
  );
  buttonChoiceLibPlateStrength.Update();

  //** Display ChangeOptions
  if (buttonChoiceBoltStrength.Overlap(mousePosWorld))
    buttonChoiceBoltStrength.DisplayChange(buttonChoiceLibBoltStrength);
  if (buttonChoiceBoltSize.Overlap(mousePosWorld))
    buttonChoiceBoltSize.DisplayChange(buttonChoiceLibBoltSize);
  /*
  if (buttonChoiceBoltCount.Overlap(mousePosWorld))
    buttonChoiceBoltCount.DisplayChange(buttonChoiceLibBoltCount);
    */
  if (buttonChoicePlateStrength.Overlap(mousePosWorld))
    buttonChoicePlateStrength.DisplayChange(buttonChoiceLibPlateStrength);

  //** ButtonChoice ** END

  //**ButtonRollor
  buttonRollor_t.DisplayButonRollor(mousePosWorld);
  buttonRollor_b.DisplayButonRollor(mousePosWorld);
  buttonRollor_a1.DisplayButonRollor(mousePosWorld);
  buttonRollor_bf.DisplayButonRollor(mousePosWorld);

  //** Calculation ** START
  //** CalcZoneActive - 3 runs for determine værdier
  if ((800 < mousePosWorld.x && mousePosWorld.x < 900) || calcFirstRun < 3) {
    if ((450 < mousePosWorld.y && mousePosWorld.y < 1050) || calcFirstRun < 3) {
      calc.FailiureMode();
      calc.Plade();
      calc.Bolt();
      calc.UpdateValues();
      if (calcFirstRun < 3) calcFirstRun++;
    }
  }
  calc.FailureModeDisplay();
  calc.Graph();
  //** Calculation ** END

  //** Layout Text - Placeres efter calc hvor fyk opdateres
  layoutTest.Display();

  //** Figure
  figure.Update();
  figure.Display();

  //text("count " + count, 100, 900);
} //** DRAW END **

function mousePressed() {
  mouseButtonIsReleased = false;
  oneTime = false;

    //** PAN
  if (mouseButton === LEFT) {
    startPan.x = mouseX;
    startPan.y = mouseY;
  }
  //** PAN
}

function mouseMoved() {}

function mouseReleased() {
  mouseButtonIsReleased = true;
  oneTime = true;
  
  //** Flag pan
  movingObject = false;
}

function mouseWheel(event) {
  //**ZOOM**
  T1.x = mouseX;
  T1.y = mouseY;
  mousePosWorldPre = mousePosWorld.copy();

  let val = 0;

  //**Test for mouseWorld Overlaps buttonChoise
  let test = false;
  if (
    buttonChoiceBoltSize.overlap ||
    buttonChoiceBoltStrength.overlap ||
    //buttonChoiceBoltCount.overlap ||
    buttonChoicePlateStrength.overlap ||
    buttonRollor_t.overlapCiffer ||
    buttonRollor_b.overlapCiffer ||
    buttonRollor_a1.overlapCiffer ||
    buttonRollor_bf.overlapCiffer
  )
    test = true;

  if (test == false) {
     //** Pan Zoom
    let oldScale = S.x;

    if (event.deltaY > 0) {
      S.x *= scaleFactorStep;
      S.y *= scaleFactorStep;
      //console.log("**** 1 ****");
    }
    if (event.deltaY < 0) {
      //console.log("**** 2 ****");
      S.x /= scaleFactorStep;
      S.y /= scaleFactorStep;
    }
    // Hold punktet under musen fast
    T.x = mouseX - (mouseX - T.x) * (S.x / oldScale);
    T.y = mouseY - (mouseY - T.y) * (S.y / oldScale);
  } else {
    let val;

    if (event.deltaY > 0) {
      val = -1;
      if (buttonChoiceBoltSize.overlap) buttonChoiceLibBoltSize.elementNumber--;
      if (buttonChoiceBoltStrength.overlap)
        buttonChoiceLibBoltStrength.elementNumber--;
      /*
      if (buttonChoiceBoltCount.overlap)
        buttonChoiceLibBoltCount.elementNumber--;
        */
      if (buttonChoicePlateStrength.overlap)
        buttonChoiceLibPlateStrength.elementNumber--;
    }
    if (event.deltaY < 0) {
      val = 1;
      if (buttonChoiceBoltSize.overlap) buttonChoiceLibBoltSize.elementNumber++;
      if (buttonChoiceBoltStrength.overlap)
        buttonChoiceLibBoltStrength.elementNumber++;
      /*
      if (buttonChoiceBoltCount.overlap)
        buttonChoiceLibBoltCount.elementNumber++;
        */
      if (buttonChoicePlateStrength.overlap)
        buttonChoiceLibPlateStrength.elementNumber++;
    }
    buttonChoiceLibBoltSize.RestrictScroll();
    buttonChoiceLibBoltStrength.RestrictScroll();
    buttonChoiceLibBoltCount.RestrictScroll();
    buttonChoiceLibPlateStrength.RestrictScroll();

    //**ButtonRollor
    buttonRollor_t.ChangeVal(val, mousePosWorld); //** Plate t
    buttonRollor_b.ChangeVal(val, mousePosWorld); //** Plate t
    buttonRollor_a1.ChangeVal(val, mousePosWorld); //** Plate t
    buttonRollor_bf.ChangeVal(val, mousePosWorld); //** Plate t
  }
}

//*****PAN*****
function mouseDragged() {
  if (mouseButton === LEFT && !movingObject) {
    T.x += mouseX - startPan.x;
    T.y += mouseY - startPan.y;

    startPan.x = mouseX;
    startPan.y = mouseY;
  }
}
//*****PAN*****
