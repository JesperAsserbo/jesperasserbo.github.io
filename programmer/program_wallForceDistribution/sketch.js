//** Bugs
//** Error- infinit loop after added calculation.DisplayPointDef(pos) variable checkInPlateArea

//** To Do
//** Units in tabel C_ref
//** Include stifness E og G i wall calculation (wall line 330ff)
//** Resulting load - Px,Py,M in signature
//** Theta
//** Uf, Uv
//** Deformed plate
//** Torsional rigidity - Icr
//** Load button show on/off
//** Button, Display LoadValue on walls
//** Display length of walls when overlap
//** No fixPoint overlap wwhen short walls

let count = 0;

let walls = [];
let wallSystem;

let logWallStartPoint = false;
let logWallEndPoint = false;
let logWallCenterPoint = false;

let logStart_id = null;
let logEnd_id = null;
let logCenter_id = null;

let countLoggedInsertPoints = 0;

//** Do not move if fixPoint overlap
let logFixpoint = false;
let logFixpoint_Px = false;
let logFixpoint_Py = false;

let logFixpointGraphOrigo = false;

//** Log wall_t when buttonRollor overlapped (in moouseWheel function)
let log_t = null;
let log_ID = null;

//**Tables
let tables;

//** Temp ButtonRollor
let buttonRollorTempArray = [];

//**ButtonRollor
let buttonRollor_Px;
let buttonRollor_Py;

//**Button
let buttonArray = [];
let buttonArrayOne = [];

let button_WallAdd; //**Object
let button_WallDelete; //**Object

//**Scale
let scaleGeo = 1;

//**StepSize
let stepSize = 0.1;

//**ChangeSystem
let changeSystem; //**Object

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


  //**Calculation
  calculation = new Calculation(450, 2000);

  //**Load
  load = new Load(500, 700);

  //**ChangeSystem
  //changeSystem = new ChangeSystem();

  //**Graph
  graph = new Graph();

  //**CollisonDetection
  collisionDetection = new CollisionDetection();

  //** WallSystem
  wallSystem = new WallSystem(walls);

  //**ChangeSystem
  changeSystem = new ChangeSystem();

  //** Tables
  tables = new Table();

  //**WallsDefault
  //**Horisontal
  walls.push(new Wall(400, 300, 600, 300, (id = 0)));
  walls.push(new Wall(400, 100, 600, 100, (id = 1)));

  //** Vertical
  walls.push(new Wall(100, 100, 100, 500, (id = 10)));
  walls.push(new Wall(900, 100, 900, 500, (id = 11)));
  walls.push(new Wall(300, 300, 300, 500, (id = 12)));
  walls.push(new Wall(700, 300, 700, 500, (id = 13)));

  buttonRollor_scaleGeo = new ButtonRollor(
    (pos1x = 700), //** textPro BR
    (pos1y = 550), //** textPro BR
    (pos2x = 800), //** "=" BR
    (pos3x = 950), //** ciffers BL
    (pos4x = 960), //** unit BR
    (prefix = 2),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "Scale Geo: "),
    (textMid = ""),
    (textPre = "m"),
    (startValue = 1),
    (minValue = 0.1),
    (maxValue = 90)
  );
  //**ButtonRoller ForceScale
  buttonRollor_scaleForce = new ButtonRollor(
    (pos1x = 700), //** textPro BR
    (pos1y = 500), //** textPro BR
    (pos2x = 800), //** "=" BR
    (pos3x = 950), //** ciffers BL
    (pos4x = 960), //** unit BR
    (prefix = 3),
    (sufix = 0),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "Scale Force: "),
    (textMid = ""),
    (textPre = "kN"),
    (startValue = 10),
    (minValue = 1),
    (maxValue = 100)
  );

  //**ButtonRoller Px
  buttonRollor_Px = new ButtonRollor(
    (pos1x = 400),
    (pos1y = 500),
    (pos2x = 450),
    (pos3x = 600),
    (pos4x = 610),
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "Px"),
    (textMid = "="),
    (textPre = "kN"),
    (startValue = 10),
    (minValue = -500),
    (maxValue = 500)
  );

  //**ButtonRoller Py
  buttonRollor_Py = new ButtonRollor(
    (pos1x = 400),
    (pos1y = 550),
    (pos2x = 450),
    (pos3x = 600),
    (pos4x = 610),
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "Py"),
    (textMid = "="),
    (textPre = "kN"),
    (startValue = 10),
    (minValue = -500),
    (maxValue = 500)
  );

  buttonRollor_stepSize = new ButtonRollor(
    (pos1x = 550),
    (pos1y = 900),
    (pos2x = 550),
    (pos3x = 650),
    (pos4x = 660),
    (prefix = 1),
    (sufix = 2),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = ""),
    (textMid = ""),
    (textPre = "m"),
    (startValue = 0.1),
    (minValue = 0.01),
    (maxValue = 0.2)
  );

  //**ButtonRoller H
  buttonRollor_H = new ButtonRollor(
    (pos1x = 1300),
    (pos1y = 850),
    (pos2x = 1350),
    (pos3x = 1500),
    (pos4x = 1510),
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "H"),
    (textMid = "="),
    (textPre = "m"),
    (startValue = 50),
    (minValue = 1),
    (maxValue = 500)
  );
  //**ButtonRoller H
  buttonRollor_E = new ButtonRollor(
    (pos1x = 1300),
    (pos1y = 900),
    (pos2x = 1350),
    (pos3x = 1500),
    (pos4x = 1590),
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "E"),
    (textMid = "="),
    (textPre = "N/mm"),
    (startValue = 30),
    (minValue = 1),
    (maxValue = 500)
  );

  buttonRollor_G = new ButtonRollor(
    (pos1x = 1300),
    (pos1y = 900),
    (pos2x = 1350),
    (pos3x = 1500),
    (pos4x = 1590),
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "G"),
    (textMid = "="),
    (textPre = "N/mm"),
    (startValue = 18), //** G = E/(2*(1-0.2)); //** Beton
    (minValue = 1),
    (maxValue = 500)
  );

  let xPosAdd = 405;
  let xPosDelete = 455;

  button_Shear = new Button(
    (pos1x = xPosAdd),
    (pos1y = 645),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_Bending = new Button(
    (pos1x = xPosAdd),
    (pos1y = 695),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = 1) //**-1 => OFF, +1 => ON
  );

  button_WallAdd = new Button(
    (pos1x = xPosAdd),
    (pos1y = 795),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_WallDelete = new Button(
    (pos1x = xPosDelete),
    (pos1y = 795),
    (pos2x = 870),
    (pos3x = 970),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_PlateDisplay = new Button(
    (pos1x = xPosAdd),
    (pos1y = 745),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  buttonArray.push(button_WallAdd, button_WallDelete);
  buttonArrayOne.push(button_Shear, button_Bending, button_PlateDisplay);
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

  //** pan
  if (
    logFixpoint ||
    logFixpointGraphOrigo ||
    logFixpoint_Px ||
    logFixpoint_Py ||
    tables.insertPointGeoLog ||
    tables.insertPointForcesLog ||
    tables.insertPointCalcCRLog ||
    tables.insertPointCalcCMLog ||
    wallSystem.wallMoveLogged
  ) {
    movingObject = true;
  } else movingObject = false;

  //**Paper
  paper_0 = new Paper(0, 0);
  //paper_1 = new Paper(2200, 0);

  //**Paper
  paper_0.DisplayPaperCross(5000, 3000); //**Page 1
  //paper_1.DisplayPaperCross(2100, 3000); //**Page 2
  //paper_0.DisplayPaperBlank(2100, 3000);
  paper_0.DisplayHeader();
  //paper_0.DisplayText();

  //**ButtonTekst
  push();
  textSize(30);
  textAlign(LEFT);
  text("Distribute force by wall shear stiffness ", 520, 635);
  text("Distribute force by wall bending stiffness ", 520, 685);
  text("Display Plate ", 520, 735);
  text("Wall Add / Delete", 520, 785);
  text("StepSize", 400, 892.5);
  pop();

  //**Button
  let AddColor = color(0, 250, 0, 150);
  let DeleteColor = color(250, 0, 0, 150);
  button_Shear.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_Bending.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign

  button_WallAdd.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_WallDelete.DisplayButton(DeleteColor, 0); //**1 = AddSign, 0 = DeleteSign

  button_PlateDisplay.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign

  let left = 400;
  let right = 500;
  let top = 750;
  let bottom = 800;

  let left1 = 400;
  let right1 = 450;
  let top1 = 600;
  let bottom1 = 750;

  push();
  fill(0, 255, 0, 100);
  //rect(left, top, right - left, bottom - top);
  //rect(left1, top1, right1 - left1, bottom1 - top1);
  pop();

  //** TEST
  //**If tested in each loop => stall at some point
  if (left < mousePosWorld.x && mousePosWorld.x < right) {
    if (top < mousePosWorld.y && mousePosWorld.y < bottom) {
      for (let i = 0, length = buttonArray.length; i < length; i++) {
        buttonArray[i].SwitchFunction(mousePosWorld, buttonArray);
      }
    }
  }

  //** Switch between 2 buttons
  if (left1 < mousePosWorld.x && mousePosWorld.x < right1) {
    if (top1 < mousePosWorld.y && mousePosWorld.y < bottom1) {
      button_Shear.SwitchFunctionTwoButton(mousePosWorld, button_Bending);
      button_Bending.SwitchFunctionTwoButton(mousePosWorld, button_Shear);

      button_PlateDisplay.MouseOverlaps(mousePosWorld);
    }
  }

  //** MousePos MoveInSteps if in graph
  push();
  fill(0);
  graph.FindMinMax(wallSystem.array);

  if (
    mouseIsPressed &&
    graph.posOrigo.x - 50 < mousePosWorld.x &&
    mousePosWorld.x < graph.xMax + 100 &&
    graph.posOrigo.y - 50 < mousePosWorld.y &&
    mousePosWorld.y < graph.yMax + 100
  ) {
    mousePosWorld = graph.MoveInSteps(mousePosWorld);
  }

  circle(mousePosWorld.x, mousePosWorld.y, 5);

  pop();

  //*****************************************************************************************

  //**

  //**ButtonRollor
  buttonRollor_Px.DisplayButonRollor(mousePosWorld);
  buttonRollor_Py.DisplayButonRollor(mousePosWorld);
  buttonRollor_scaleGeo.DisplayButonRollor(mousePosWorld);
  buttonRollor_scaleForce.DisplayButonRollor(mousePosWorld);
  buttonRollor_stepSize.DisplayButonRollor(mousePosWorld);
  buttonRollor_H.DisplayButonRollor(mousePosWorld);

  if (button_Bending.state == 1) {
    buttonRollor_E.DisplayButonRollor(mousePosWorld);
    buttonRollor_E.DisplayUnitsE();
  }

  if (button_Shear.state == 1) {
    buttonRollor_G.DisplayButonRollor(mousePosWorld);
    buttonRollor_G.DisplayUnitsE();
  }

  //**ButtonRollor ReadValue
  load.Px.x = buttonRollor_Px.ReadValue() * 1000; //**kN
  load.Py.y = buttonRollor_Py.ReadValue() * 1000; //**kN
  scaleGeo = buttonRollor_scaleGeo.ReadValue();
  scaleForce = buttonRollor_scaleForce.ReadValue() * 10;
  stepSize = (buttonRollor_stepSize.ReadValue() * 100) / scaleGeo;

  //console.log(stepSize)
  //** Tables
  tables.DisplayWallForces(mousePosWorld);
  tables.DisplayWallCalc_CR(mousePosWorld);
  tables.DisplayWallCalc_CM(mousePosWorld);
  tables.DisplayWallGeo(mousePosWorld);

  tables.OverlapInsertPointForces(mousePosWorld);
  tables.OverlapInsertPointCalc_CR(mousePosWorld);
  tables.OverlapInsertPointCalc_CM(mousePosWorld);
  tables.OverlapInsertPointGeo(mousePosWorld);
  tables.HighligthWallFromTable(mousePosWorld);

  tables.MoveTable(mousePosWorld);

  //tables.MoveTable(mousePosWorld);
  tables.HighligthRowInTable(mousePosWorld);

  tables.DisplayButtonRollorInTable(mousePosWorld);

  //** WallSystem
  wallSystem.UpdateWallSystem(mousePosWorld);

  calculation.Calculation(wallSystem.array, load);
  calculation.DisplayPlate();
  calculation.DisplayPlateText();
  calculation.DisplayPointDef(mousePosWorld);

  changeSystem.WallAdd(mousePosWorld);
  changeSystem.WallDelete(mousePosWorld);
  changeSystem.ChangeWallPos(wallSystem.array, mousePosWorld);
  changeSystem.ChangeLoadPos_Px(mousePosWorld);
  changeSystem.ChangeLoadPos_Py(mousePosWorld);

  load.UpdatePosTo_o();
  load.DisplayLoad();
  load.CalculateLoad(calculation.FC);
  load.DisplayLoadMesure(calculation.FC);

  //console.log(calculation.Tp_X)
  graph.DisplayPoints(
    calculation.Tp_X,
    calculation.Tp_Y,
    graph.xMax - graph.posOrigo.x + 350,
    0,
    color(0, 0, 255),
    "Center of Mass (CM)"
  );

  graph.DisplayPoints(
    calculation.FC_x,
    calculation.FC_y,
    graph.xMax - graph.posOrigo.x + 350,
    100,
    color(255, 0, 0),
    "Center of Rotation (CR)"
  );

  graph.DisplayAxis(wallSystem);
  graph.DisplayWalls(wallSystem.array);
  graph.UploadData(load, walls);
  graph.DisplayForceDiagram(wallSystem.array);
  graph.MoveForceDiagram(mousePosWorld);
  graph.DisplayForceWalls(wallSystem.array);
  graph.OverlapInsertPoint(mousePosWorld);
  graph.MoveGraph(mousePosWorld);
  graph.DisplayText();

  graph.DisplayForceScale(buttonRollor_scaleForce.pos3);
  graph.DisplayMesureScale(buttonRollor_scaleGeo.pos3);

  graph.DisplayStiffnesModel_Bending();
  graph.DisplayStiffnesModel_Shear();

  //**GraphPoints
  //** Convert from mm tio screenUnits
  graph.DisplayPoints(
    calculation.Tp_X / 10 / scaleGeo,
    calculation.Tp_Y / 10 / scaleGeo,
    calculation.Tp_X / 10 / scaleGeo,
    calculation.Tp_Y / 10 / scaleGeo,
    color(0, 0, 255),
    ""
  );

  graph.DisplayPoints(
    calculation.FC_x / 10 / scaleGeo,
    calculation.FC_y / 10 / scaleGeo,
    calculation.FC_x / 10 / scaleGeo,
    calculation.FC_y / 10 / scaleGeo,
    color(255, 0, 0),
    ""
  );

  log_t = null;
} //** DRAW END **

function mousePressed() {
  mouseButtonIsReleased = false;
  mouseButtonIsClicked = false; //**Global variable
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

  //** Set to true in changeSystem
  logWallStartPoint = false;
  logWallEndPoint = false;
  logWallCenterPoint = false;

  logStart_id = null;
  logEnd_id = null;
  logCenter = null;

  //**
  logFixpoint = false;
  logFixpoint_Px = false;
  logFixpoint_Py = false;
  logFixpointGraphOrigo = false;

  //**Tables

  countLoggedInsertPoints = 0;

  wallSystem.wallMoveLogged = false;
  //** Flag pan
  movingObject = false;
}

function mouseWheel(event) {
  let graphPos = new p5.Vector.sub(mousePosWorld, graph.posOrigo);

  //**Test for mouseWorld Overlaps buttonroller
  let test = false;
  if (
    buttonRollor_scaleGeo.overlapCiffer ||
    buttonRollor_scaleForce.overlapCiffer ||
    buttonRollor_Px.overlapCiffer ||
    buttonRollor_Py.overlapCiffer ||
    buttonRollor_stepSize.overlapCiffer ||
    buttonRollor_H.overlapCiffer ||
    buttonRollor_E.overlapCiffer ||
    buttonRollor_G.overlapCiffer
  )
    test = true;

  //**wall_t
  //** Test for overlap
  for (let i = 0; i < wallSystem.array.length; i++) {
    if (wallSystem.array[i].buttonRollor_wall_t.overlapCiffer) {
      test = true;
      log_t = i;
    }
  }

  for (let i = 0; i < wallSystem.array.length; i++) {
    if (wallSystem.array[i].buttonRollor_ID.overlapCiffer) {
      test = true;
      log_ID = i;
    }
  }

  /*
  //**First time overlap ID => create object buttonRoller
  if (buttonRollorTempArray.length > 0) {
    if (buttonRollorTempArray[0].overlapCiffer) test = true;
   buttonRollorTempArray[0].overlapCiffer = false;
  }
  */

  //console.log("overlapCiffer in mousewheel ######  " + buttonRollorTempArray[0].overlapCiffer)

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
    let val = 0;

    if (event.deltaY > 0) val = -1;
    if (event.deltaY < 0) val = 1;

    buttonRollor_Px.ChangeVal(val, mousePosWorld); //**Px
    buttonRollor_Py.ChangeVal(val, mousePosWorld); //**Py
    buttonRollor_scaleGeo.ChangeVal(val, mousePosWorld); //**scaleGeo
    buttonRollor_scaleForce.ChangeVal(val, mousePosWorld); //**scaleForce
    buttonRollor_stepSize.ChangeVal(val, mousePosWorld);
    buttonRollor_H.ChangeVal(val, mousePosWorld);
    if (button_Bending.state == 1) buttonRollor_E.ChangeVal(val, mousePosWorld);
    if (button_Shear.state == 1) buttonRollor_G.ChangeVal(val, mousePosWorld);

    //** wall_t
    if (log_t != null) {
      //console.log("sketch line 1205 - log_Cy **** " + log_Cy);
      wallSystem.array[log_t].buttonRollor_wall_t.ChangeVal(
        val,
        wallSystem.array[log_t].graphPosNoScale_t
      );
    }
    log_t = null;

    //** wall_t
    if (log_ID != null) {
      //console.log("sketch line 1205 - log_Cy **** " + log_Cy);
      wallSystem.array[log_ID].buttonRollor_ID.ChangeVal(
        val,
        wallSystem.array[log_ID].graphPosNoScale_ID
      );
    }
    log_ID = null;

    /*
    if (buttonRollorTempArray.length > 0) {
       buttonRollorTempArray[0].ChangeVal(val,graphPos);
      

    } */
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
