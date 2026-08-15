let count = 0;

//**Time
let timeReal;

//**Limit mouse call to one call;
let mouseButtonIsClicked = false;
let mouseButtonIsReleased = false;
let oneTime = false;

let button_S235;

let buttonArray = [];
let buttonArray_two = [];

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

//** Classes
let drawing;
let formular;

//** ButtonRollors
//let buttonRollor_N

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
  

  drawing = new Drawing();
  formular = new Formular();
  calc = new Calculation();
  graph = new Graph();

  //** Button
  let xPosAdd = 805;
  let xPosDelete = 455;

  button_S235 = new Button(
    (pos1x = xPosAdd),
    (pos1y = 495),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = 1) //**-1 => OFF, +1 => ON
  );

  button_S275 = new Button(
    (pos1x = xPosAdd),
    (pos1y = 545),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_S355 = new Button(
    (pos1x = xPosAdd),
    (pos1y = 595),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  buttonArray.push(button_S235, button_S275, button_S355);

  button_Elastic = new Button(
    (pos1x = xPosAdd - 400),
    (pos1y = 595 + 850),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = 1) //**-1 => OFF, +1 => ON
  );

  button_Plastic = new Button(
    (pos1x = xPosAdd - 400),
    (pos1y = 595 + 900),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  buttonArray_two.push(button_Elastic, button_Plastic);

  buttonRollor_N = new ButtonRollor(
    (pos1x = 400), //** textPro BR
    (pos1y = 495), //** textPro BR
    (pos2x = 450), //** "=" BR
    (pos3x = 595), //** ciffers BL
    (pos4x = 620), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "N"),
    (textMid = "="),
    (textPre = "kN"),
    (startValue = 10),
    (minValue = -900),
    (maxValue = 900)
  );

  buttonRollor_V = new ButtonRollor(
    (pos1x = 400), //** textPro BR
    (pos1y = 545), //** textPro BR
    (pos2x = 450), //** "=" BR
    (pos3x = 595), //** ciffers BL
    (pos4x = 620), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "V"),
    (textMid = "="),
    (textPre = "kN"),
    (startValue = 10),
    (minValue = -900),
    (maxValue = 900)
  );

  buttonRollor_M = new ButtonRollor(
    (pos1x = 400), //** textPro BR
    (pos1y = 595), //** textPro BR
    (pos2x = 450), //** "=" BR
    (pos3x = 595), //** ciffers BL
    (pos4x = 620), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "M"),
    (textMid = "="),
    (textPre = "kNm"),
    (startValue = 1),
    (minValue = -900),
    (maxValue = 900)
  );

  buttonRollor_a = new ButtonRollor(
    (pos1x = 400), //** textPro BR
    (pos1y = 795), //** textPro BR
    (pos2x = 450), //** "=" BR
    (pos3x = 595), //** ciffers BL
    (pos4x = 620), //** unit BR
    (prefix = 2),
    (sufix = 0),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "a"),
    (textMid = "="),
    (textPre = "mm"),
    (startValue = 5),
    (minValue = 3),
    (maxValue = 20)
  );

  buttonRollor_L = new ButtonRollor(
    (pos1x = 400), //** textPro BR
    (pos1y = 845), //** textPro BR
    (pos2x = 450), //** "=" BR
    (pos3x = 595), //** ciffers BL
    (pos4x = 620), //** unit BR
    (prefix = 3),
    (sufix = 0),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "L"),
    (textMid = "="),
    (textPre = "mm"),
    (startValue = 110),
    (minValue = 3),
    (maxValue = 900)
  );
}

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

  //**Button
  let AddColor = color(0, 250, 0, 150);
  let DeleteColor = color(250, 0, 0, 150);
  button_S235.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_S275.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_S355.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign

  button_Elastic.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_Plastic.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign

  let left = 800;
  let right = 850;
  let top = 450;
  let bottom = 600;

  let left_2 = 400;
  let right_2 = 450;
  let top_2 = 1400;
  let bottom_2 = 1500;

  push();
  noFill();
  //rect(left, top, right - left, bottom - top);
  //rect(left_2, top_2, right_2 - left_2, bottom_2 - top_2);
  pop();

  //** TEST
  //**If tested in each loop => stall at some point
  if (left < mousePosWorld.x && mousePosWorld.x < right) {
    if (top < mousePosWorld.y && mousePosWorld.y < bottom) {
      for (let i = 0, length = buttonArray.length; i < length; i++) {
        buttonArray[i].MouseOverlaps(mousePosWorld);
      }

      //**ButtonSwitchFunction
      if (mouseIsPressed) {
        //**SwitchGroup
        button_S235.SwitchFunction(mousePosWorld, buttonArray);
        button_S275.SwitchFunction(mousePosWorld, buttonArray);
        button_S355.SwitchFunction(mousePosWorld, buttonArray);
      }
    }
  }

  if (left_2 < mousePosWorld.x && mousePosWorld.x < right_2) {
    if (top_2 < mousePosWorld.y && mousePosWorld.y < bottom_2) {
      for (let i = 0, length = buttonArray_two.length; i < length; i++) {
        buttonArray_two[i].MouseOverlaps(mousePosWorld);

        //**ButtonSwitchFunction
        if (mouseIsPressed) {
          //**SwitchGroup
          button_Elastic.SwitchFunction(mousePosWorld, buttonArray_two);
          button_Plastic.SwitchFunction(mousePosWorld, buttonArray_two);
        }
      }
    }
  }

  //**ButtonRollor that do not move
  buttonRollor_N.DisplayButonRollor(mousePosWorld);
  buttonRollor_V.DisplayButonRollor(mousePosWorld);
  buttonRollor_M.DisplayButonRollor(mousePosWorld);
  buttonRollor_a.DisplayButonRollor(mousePosWorld);
  buttonRollor_L.DisplayButonRollor(mousePosWorld);

  //** Text Button
  push();
  textSize(30);
  textAlign(LEFT, CENTER);

  //** Header
  //text("DS/EN 10025-2",900,428)

  textSize(20);
  text("u", 1060, 488);
  text("w", 1270, 488);

  text("u", 1060, 538);
  text("w", 1270, 538);

  text("u", 1060, 588);
  text("w", 1270, 588);
  textSize(30);

  //** S235
  text("S235", 900, 478);
  text("\u21D2", 1000, 478);
  text("f", 1050, 478);
  text("= 360 Mpa,", 1080, 478);
  text("\u03b2", 1250, 478);
  text("= 0.80", 1290, 478);
  //line(500, 475, 1200, 475);

  //** S275
  text("S275", 900, 478 + 50);
  text("\u21D2", 1000, 478 + 50);
  text("f", 1050, 478 + 50);
  text("= 410 Mpa,", 1080, 478 + 50);
  text("\u03b2", 1250, 478 + 50);
  text("= 0.85", 1290, 478 + 50);

  //** S355
  text("S355", 900, 478 + 100);
  text("\u21D2", 1000, 478 + 100);
  text("f", 1050, 478 + 100);
  text("= 470 Mpa,", 1080, 478 + 100);
  text("\u03b2", 1250, 478 + 100);
  text("= 0.90", 1290, 478 + 100);

  pop();

  //** Text
  push();
  textSize(30);
  textAlign(LEFT, CENTER);
  text("\u21D2", 710, 830); //** =>
  text("L", 760, 830);
  text("=", 820, 830);
  text("mm", 910, 830);
  text(">  max [30mm ; 6a]", 980, 830);
  textAlign(RIGHT, CENTER);
  text(calc.L_eff, 900, 830);

  textSize(25);
  textAlign(LEFT, CENTER);
  text("eff", 780, 840);

  //**
  textSize(30);
  text("Elastic", 470, 1427.5);
  text("Plastic", 470, 1427.5 + 50);
  pop();

  //** Resultat
  //console.log(buttonRollor_L.ReadValue() )

  //**

  calc.Update();
  calc.Calculate();

  drawing.Display();

  formular.Formular();
  formular.Sigma_N();
  formular.Sigma_M();
  formular.Sigma_Res();
  formular.Tau_prallel();
  formular.Sigma_Eff();
  formular.Sigma_90();

  graph.Display();

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
  //**Test for mouseWorld Overlaps buttonroller
  let test = false;

  if (
    buttonRollor_N.overlapCiffer ||
    buttonRollor_V.overlapCiffer ||
    buttonRollor_M.overlapCiffer ||
    buttonRollor_a.overlapCiffer ||
    buttonRollor_L.overlapCiffer
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

    if (event.deltaY > 0) val = -1;
    if (event.deltaY < 0) val = 1;

    buttonRollor_N.ChangeVal(val, mousePosWorld); //** N
    buttonRollor_V.ChangeVal(val, mousePosWorld); //** V
    buttonRollor_M.ChangeVal(val, mousePosWorld); //** M
    buttonRollor_a.ChangeVal(val, mousePosWorld); //** a
    buttonRollor_L.ChangeVal(val, mousePosWorld); //** a
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
