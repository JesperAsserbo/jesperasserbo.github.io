//***** TO DO ********
//** Geometry line 740 - tilføj cotTheta på figur - OK
//** Geometry line 740 - tilpas mesure lines when hiCotTheta > 1000mm - OK
//** Geometry tolerance buttonRoller on reinforcement
//** one rebar
//** Scale
//** Elastic
//** Stiffness
//** min a to rebar when only 2 rebar

let count = 0;
let run = 0; //** variable in calculation.Calculate_eM_graph(), so that Mud can be calculatet at first
let reCalc = false; //**Variable for calculation.Calculate_eM_graph()
let mouseWheelEvent = false;

//**Time
let timeReal;

//** Button
buttonArray = [];

//**Limit mouse call to one call;
let mouseButtonIsClicked = false; //** Used with button
let mouseButtonIsReleased = false;
let oneTime = false;

let pointGeometryLogged = false;
let pointRebarLogged = false;

//**Pan and Zoom
let mousePosScreen = new p5.Vector(0, 0);
let mousePosWorld = new p5.Vector(0, 0);
let mousePosWorldPre = new p5.Vector(0, 0);
let scaleFactorStep = 1.1; // [1;xx] 1 = ingen scale, 2 = dobbelt/halvering
let movingObject = false; //** flag used in pan

let S = new p5.Vector(0.25, 0.25); //**ScaleFactor
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
  


  inputData = new Input();
  outputData = new Output();
  calculation = new Calculation();
  calculationOneTime = new CalculationOneTime();
  geometry = new Geometry();

  //** ButtonRollor
  buttonRollor_fck = new ButtonRollor(
    (pos1x = 0), //** textPro BR
    (pos1y = 557.5), //** textPro BR
    (pos2x = 0), //** textMid BR
    (pos3x = 675), //** ciffers BL
    (pos4x = 0), //** unit BR
    (numberPrefix = 2),
    (numberSufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 35),
    (textPro = ""),
    (textMid = ""),
    (textPre = ""),
    (startValue = 35),
    (minValue = 5),
    (maxValue = 50)
  );

  buttonRollor_gck = new ButtonRollor(
    (pos1x = 0), //** textPro BR
    (pos1y = 557.5), //** textPro BR
    (pos2x = 0), //** textMid BR
    (pos3x = 1075), //** ciffers BL
    (pos4x = 0), //** unit BR
    (numberPrefix = 1),
    (numberSufix = 2),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 35),
    (textPro = ""),
    (textMid = ""),
    (textPre = ""),
    (startValue = 1.45),
    (minValue = 1),
    (maxValue = 2)
  );

  buttonRollor_fyk = new ButtonRollor(
    (pos1x = 0), //** textPro BR
    (pos1y = 807.5), //** textPro BR
    (pos2x = 0), //** textMid BR
    (pos3x = 675), //** ciffers BL
    (pos4x = 0), //** unit BR
    (numberPrefix = 3),
    (numberSufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 35),
    (textPro = ""),
    (textMid = ""),
    (textPre = ""),
    (startValue = 550),
    (minValue = 5),
    (maxValue = 900)
  );

  buttonRollor_gyk = new ButtonRollor(
    (pos1x = 0), //** textPro BR
    (pos1y = 807.5), //** textPro BR
    (pos2x = 0), //** textMid BR
    (pos3x = 1075), //** ciffers BL
    (pos4x = 0), //** unit BR
    (numberPrefix = 1),
    (numberSufix = 2),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 35),
    (textPro = ""),
    (textMid = ""),
    (textPre = ""),
    (startValue = 1.2),
    (minValue = 1),
    (maxValue = 2)
  );
  


  //** Button Single
  button_RebarAdd = new Button(
    (pos1x = 455),
    (pos1y = 1095),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_RebarDelete = new Button(
    (pos1x = 505),
    (pos1y = 1095),
    (pos2x = 870),
    (pos3x = 970),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  buttonArray.push(button_RebarAdd, button_RebarDelete);
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
  run++;

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
  //*****ZOOM*****

  //**Paper
  paper_0 = new Paper(0, 0);
  paper_1 = new Paper(2200, 0);

  //**Paper
  paper_0.DisplayPaperCross(4200, 3500); //**Page 1
  //paper_1.DisplayPaperCross(2100, 3000); //**Page 2
  //paper_0.DisplayPaperBlank(2100, 3000);
  paper_0.DisplayHeader();
  paper_0.DisplayText();

  //** Geometry
  geometry.Update();
  geometry.Display();
  geometry.DisplaySide();
  geometry.Display_yo();
  geometry.DisplayStrain();
  geometry.DisplayStress();
  geometry.DisplayForcesConcrete();
  geometry.DisplayForcesRebar();
  geometry.DisplayForcesRes();
  geometry.RebarSetLimits();
  geometry.DisplayRebar();
  geometry.GeometryAdjust(mousePosWorld);
  geometry.RebarAdjust(mousePosWorld);
  geometry.RebarAdd(mousePosWorld);
  geometry.RebarDelete(mousePosWorld);

  //** Calculate
  calculation.CalculateRecursion(100);
  calculation.Update();
  calculation.ForceMinMaxRebar();
  calculation.ForceResulting()
  calculation.CalculateMud();
  calculation.Calculate_eM_graph();
  //calculation.Display_eM_graph();
  calculation.Display_eM_graph_A(); //** Location next to force graph
  calculation.Calcuate_Save_graph();
  calculation.DisplaySaveButton();
  calculation.DisplayMud();
  calculation.CalculateStirrup();
  calculation.CalculateShearCapacity();

  //** Calculate One Time (Mud)
  calculationOneTime.CalculateRecursion(100);
  calculationOneTime.Update();
  calculationOneTime.CalculateMud();
  calculationOneTime.ForceResulting();

  //console.log("sketch line 185 - reCalc: " + reCalc)
  /*
  let diff = calculation.compres_sum + calculation.tension;
  console.log(
    "com: " +
      calculation.compres_sum +
      " Tens: " +
      calculation.tension +
      " diff:" +
      diff +
      " yo: " +
      calculation.yo
  );
  */

  //** InputData
  inputData.Display();
  inputData.InputUpdate();
  inputData.DisplayGeometryInddata();

  
  //** ButtonRollor
  buttonRollor_fck.DisplayButonRollor(mousePosWorld);
  buttonRollor_gck.DisplayButonRollor(mousePosWorld);
  buttonRollor_fyk.DisplayButonRollor(mousePosWorld);
  buttonRollor_gyk.DisplayButonRollor(mousePosWorld);


  //** OutputData
  outputData.Display();
  outputData.OutputUpdate();

  //**Variable reCalc for calculation.Calculate_eM_graph()
  let rebarOverlapped = false;
  for (let i = 0; i < geometry.rebar.length; i++) {
    if (
      geometry.rebar[i].buttonRollor_ø.overlapCiffer ||
      geometry.rebar[i].buttonRollor_stk.overlapCiffer
    ) {
      rebarOverlapped = true;
    }
  }
  
  if (
    !buttonRollor_fck.overlapCiffer &&
    !buttonRollor_gck.overlapCiffer &&
    !buttonRollor_fyk.overlapCiffer &&
    !buttonRollor_gyk.overlapCiffer &&
    !geometry.buttonRollor_dg.overlapCiffer &&
    !geometry.buttonRollor_c_min.overlapCiffer &&
    //!geometry.buttonRollor_c1.overlapCiffer &&
    !geometry.buttonRollor_stirrup_ø.overlapCiffer &&
    //!geometry.buttonRollor_stirrup_cc.overlapCiffer &&
    //!geometry.buttonRollor_stirrup_n.overlapCiffer &&
    //!geometry.buttonRollor_cotTheta.overlapCiffer &&
    !rebarOverlapped
  )
    mouseWheelEvent = false;
  
    if (mouseWheelEvent) {
    reCalc = true;
  } else {
    reCalc = false;
    mouseWheelEvent = false;
  }

  //**Button
  let AddColor = color(0, 250, 0, 150);
  let DeleteColor = color(250, 0, 0, 150);
  button_RebarAdd.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_RebarDelete.DisplayButton(DeleteColor, 0); //**1 = AddSign, 0 = DeleteSign

  //**ButtonSwitchFunction
  if (mouseIsPressed) {
    //**SwitchGroup
    button_RebarAdd.SwitchFunction(mousePosWorld, buttonArray);
    button_RebarDelete.SwitchFunction(mousePosWorld, buttonArray);
  }

  //console.log("sketch line 234: " + mouseWheelEvent);
} //** DRAW END **

function mousePressed() {
  mouseButtonIsReleased = false;
  oneTime = false;
  //pointGeometryLogged = true;

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
  mouseButtonIsClicked = false; //**Global variable
  oneTime = true;

  pointGeometryLogged = false;
  pointRebarLogged = false;
  geometry.rebarNumberLogged = undefined;

    //** Flag pan
  movingObject = false;
}

function mouseWheel(event) {
  //**Test for mouseWorld Overlaps buttonroller
  let test = false;

  if (
    buttonRollor_fck.overlapCiffer ||
    buttonRollor_gck.overlapCiffer ||
    buttonRollor_fyk.overlapCiffer ||
    buttonRollor_gyk.overlapCiffer ||
    geometry.buttonRollor_dg.overlapCiffer||
    geometry.buttonRollor_c_min.overlapCiffer||
    geometry.buttonRollor_c_dev.overlapCiffer ||
    geometry.buttonRollor_stirrup_ø.overlapCiffer||
    geometry.buttonRollor_stirrup_s.overlapCiffer ||
    geometry.buttonRollor_stirrup_n.overlapCiffer ||
    geometry.buttonRollor_cotTheta.overlapCiffer
  ) {
    test = true;
  }

  for (let i = 0; i < geometry.rebar.length; i++) {
    if (
      geometry.rebar[i].buttonRollor_ø.overlapCiffer ||
      geometry.rebar[i].buttonRollor_stk.overlapCiffer
    ) {
      test = true;
    }
  }

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
    mouseWheelEvent = true;

    if (event.deltaY > 0) val = -1;
    if (event.deltaY < 0) val = 1;

    buttonRollor_fck.ChangeVal(val, mousePosWorld);
    buttonRollor_gck.ChangeVal(val, mousePosWorld);
    buttonRollor_fyk.ChangeVal(val, mousePosWorld);
    buttonRollor_gyk.ChangeVal(val, mousePosWorld);
    geometry.buttonRollor_dg.ChangeVal(val, mousePosWorld);
    geometry.buttonRollor_c_min.ChangeVal(val, mousePosWorld);
    geometry.buttonRollor_c_dev.ChangeVal(val, mousePosWorld);
    geometry.buttonRollor_stirrup_ø.ChangeVal(val, mousePosWorld);
    geometry.buttonRollor_stirrup_s.ChangeVal(val, mousePosWorld);
    geometry.buttonRollor_stirrup_n.ChangeVal(val, mousePosWorld);
    geometry.buttonRollor_cotTheta.ChangeVal(val, mousePosWorld);

    for (let i = 0; i < geometry.rebar.length; i++) {
      geometry.rebar[i].buttonRollor_ø.ChangeVal(
        val,
        geometry.rebar[i].graphPosNoScale
      );
      geometry.rebar[i].buttonRollor_stk.ChangeVal(
        val,
        geometry.rebar[i].graphPosNoScale
      );
    }
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
