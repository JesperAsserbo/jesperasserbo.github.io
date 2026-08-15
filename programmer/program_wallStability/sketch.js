//** TO DO
//** Highlight load in table when overlap load and likwise when overlap in Load Table
//** When adjust overlapped/moved shove wall width and height

let buttonArrayGroup_1 = [];
let buttonArrayGroup_2 = [];
let buttonArrayGroup_3 = [];

let count = 0;

//**Time
let timeReal;

//**Tables
let tables;

//**Limit mouse call to one call;
let mouseButtonIsClicked = false;
let mouseButtonIsReleased = false;
let oneTime = false;
let oneTimeMouseWheel = false;

//**Pan and Zoom
let mousePosScreen = new p5.Vector(0, 0);
let mousePosWorld = new p5.Vector(0, 0);
let mousePosWorldPre = new p5.Vector(0, 0);
let scaleFactorStep = 1.1; // [1;xx] 1 = ingen scaleGeo, 2 = dobbelt/halvering
let movingObject = false; //** flag used in pan

let S = new p5.Vector(0.5, 0.5); //**scaleGeoFactor
let T = new p5.Vector(0, 0);
let T1 = new p5.Vector(0, 0); //**scaleGeoFactor (svarer til translation tilbage til origo)

let startPan = new p5.Vector(0, 0);

let wallArray = [];

//** Mouse Step
let stepChange = 5; //** Global

//** Globale
let scaleGeo = 100;
let scaleGeo_Test = 100;
let g = 20; //**kN/m3
let fcd = 5; //** Mpa

let logGlobal = 0; //** no log registred

//** Log values when buttonRollor overlapped (in moouseWheel function)
let log_wall_H = null;
let log_load_H = null;
let log_wall_t = null;
let log_wall_N = null;
let log_load_N = null;

function setup() {
  //createCanvas(windowWidth - 10, windowHeight - 10);

  
  //** GitHub setUp - Start 
    let canvas = createCanvas(
    document.getElementById("programvindue").clientWidth,
    document.getElementById("programvindue").clientHeight
  );

  canvas.parent("programvindue");
  //** GitHub setUp - End 
  

  changeSystem = new ChangeSystem();
  graph = new Graph();
  tables = new Table();

  let xPosAdd = 405;
  let xPosDelete = 455;
  //** ButtonGroup_1
  button_Load_Add = new Button(
    (pos1x = xPosAdd),
    (pos1y = 545),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_Load_Delete = new Button(
    (pos1x = xPosDelete),
    (pos1y = 545),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_Wall_Add = new Button(
    (pos1x = xPosAdd),
    (pos1y = 495),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_Wall_Delete = new Button(
    (pos1x = xPosDelete),
    (pos1y = 495),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  //** ButtonGroup_2
  button_DisplaySumForces = new Button(
    (pos1x = xPosDelete),
    (pos1y = 745),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DisplayReactions = new Button(
    (pos1x = xPosDelete),
    (pos1y = 795),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DisplayForcesPosMouse = new Button(
    (pos1x = xPosDelete),
    (pos1y = 845),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );
  //** ButtonGroup_3
  button_DisplayWallMesure = new Button(
    (pos1x = xPosDelete + 500),
    (pos1y = 495),
    (pos2x = 1000),
    (pos3x = 1170),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DisplayLoadMesure = new Button(
    (pos1x = xPosDelete + 500),
    (pos1y = 545),
    (pos2x = 1000),
    (pos3x = 1170),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DisplaySumForcesMesure = new Button(
    (pos1x = xPosDelete + 500),
    (pos1y = 745),
    (pos2x = 1000),
    (pos3x = 1170),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DisplayReactionsMesure = new Button(
    (pos1x = xPosDelete + 500),
    (pos1y = 795),
    (pos2x = 1000),
    (pos3x = 1170),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  buttonArrayGroup_1.push(
    button_Wall_Add,
    button_Wall_Delete,
    button_Load_Add,
    button_Load_Delete
  );

  buttonArrayGroup_2.push(
    button_DisplaySumForces,
    button_DisplayReactions,
    button_DisplayForcesPosMouse
  );
  buttonArrayGroup_3.push(
    button_DisplayLoadMesure,
    button_DisplayWallMesure,
    button_DisplaySumForcesMesure,
    button_DisplayReactionsMesure
  );

  //** ButtonRollor do not move
  buttonRollor_g = new ButtonRollor(
    (pos1x = 1400), //** textPro BR
    (pos1y = 695), //** textPro BR
    (pos2x = 1600), //** "=" BR
    (pos3x = 1750), //** ciffers BL
    (pos4x = 1760), //** unit BR
    (prefix = 2),
    (sufix = 2),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = ""),
    (textMid = "="),
    (textPre = "kN/m"),
    (startValue = 24),
    (minValue = 0.0),
    (maxValue = 99)
  );

  buttonRollor_fcd = new ButtonRollor(
    (pos1x = 1450), //** textPro BR
    (pos1y = 745), //** textPro BR
    (pos2x = 1600), //** "=" BR
    (pos3x = 1750), //** ciffers BL
    (pos4x = 1760), //** unit BR
    (prefix = 2),
    (sufix = 2),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = ""),
    (textMid = "="),
    (textPre = "Mpa"),
    (startValue = 1),
    (minValue = 0.01),
    (maxValue = 99)
  );

  buttonRollor_scaleGeo = new ButtonRollor(
    (pos1x = 1400), //** textPro BR
    (pos1y = 845), //** textPro BR
    (pos2x = 550), //** "=" BR
    (pos3x = 1700), //** ciffers BL
    (pos4x = 710), //** unit BR
    (prefix = 3),
    (sufix = 0),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = ""),
    (textMid = ""),
    (textPre = ""),
    (startValue = 100),
    (minValue = 10),
    (maxValue = 1000)
  );

  //** WallDefault
  wall_0 = new WallElement(1000, 1400, 0); //** (posX, posY, wallNumber)
  //wall_1 = new WallElement(1000, 1400, 1); //** (posX, posY, wallNumber)
  wallArray.push(wall_0);
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

  //**StopOfLoop if too long time
  //if (timePerFrame > 2000) noLoop(); //** => window does not freeze */

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
  paper_1.DisplayPaperCross(2100, 3000); //**Page 2
  //paper_0.DisplayPaperBlank(2100, 3000);
  paper_0.DisplayHeader();
  paper_0.DisplayText();

  //** MousePointer
  circle(MoveInSteps(mousePosWorld).x, MoveInSteps(mousePosWorld).y, 4);

  //**ButtonTekst
  push();
  textSize(30);
  textAlign(LEFT);
  text("Wall", 520, 485);
  text("Load - Vertical", 520, 535);
  //text("Load - Horisontal", 520, 586);
  //text("Node Charnier", 520, 635);
  //text("Load Point", 520, 685);
  //text("Load Line", 520, 735);
  //text("Load Moment", 520, 785);
  //text("Add/Delete Graph Values", 520, 845);

  text("Display - Forces sum", 520, 735);
  text("Display - Reactions", 520, 785);
  text("Display - Forces in MousePos", 520, 835);

  //** ButtonRollor Text
  text("Rumvægt,", 1400, 685);
  text("Trykstyrke, f", 1400, 735);
  text("ScaleGeo         1:", 1400, 838);
  text("\u03c1", 1545, 685); //** massefylde

  textSize(20);
  text("3", 1830, 675);
  text("cd", 1565, 745);

  //** ButtonGroup_3
  textSize(30);
  text("Mesures - Wall ", 1020, 485);
  text("Mesures - Load ", 1020, 535);

  if (button_DisplaySumForces.state == 1)
    text("Mesures - Forces Sum ", 1020, 735);
  if (button_DisplayReactions.state == 1)
    text("Mesures - Reaction ", 1020, 785);
  pop();

  //**Button
  let AddColor = color(0, 250, 0, 150);
  let DeleteColor = color(250, 0, 0, 150);
  button_Wall_Add.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_Wall_Delete.DisplayButton(DeleteColor, 0); //**1 = AddSign, 0 = DeleteSign
  button_Load_Add.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_Load_Delete.DisplayButton(DeleteColor, 0); //**1 = AddSign, 0 = DeleteSign

  button_DisplaySumForces.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_DisplayReactions.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_DisplayForcesPosMouse.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign

  //** Buton Mesures
  button_DisplayWallMesure.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_DisplayLoadMesure.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign

  //**Button Display if other Button state is ON
  if (button_DisplaySumForces.state == 1)
    button_DisplaySumForcesMesure.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  if (button_DisplayReactions.state == 1)
    button_DisplayReactionsMesure.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign

  //***************************
  //** buttonRollor ** START **
  //***************************

  //**ButtonRollor that do not move
  buttonRollor_g.DisplayButonRollor(mousePosWorld);
  buttonRollor_fcd.DisplayButonRollor(mousePosWorld);
  buttonRollor_scaleGeo.DisplayButonRollor(mousePosWorld);

  //** ReadValue Global buttonRollor
  g = buttonRollor_g.ReadValue();
  fcd = buttonRollor_fcd.ReadValue();
  scaleGeo = 100;
  scaleGeo_Test = buttonRollor_scaleGeo.ReadValue() / 100;

  //*************************
  //** buttonRollor ** END **
  //*************************

  //***********************
  //** Tables  ** START ***
  //***********************
  tables.TabelLoad();
  tables.OverlapInsertPoint(mousePosWorld);
  tables.MoveTable(mousePosWorld);
  tables.TabelHighlightLoad(mousePosWorld);

  // tables.DisplaySupport(mousePosWorld);
  // tables.OverlapInsertPoint(mousePosWorld);
  //tables.MoveTable(mousePosWorld);

  //console.log(button_DisplaySumForces.state)
  let left = 400;
  let right = 500;
  let top = 450;
  let bottom = 600;

  let left2 = 450;
  let right2 = 500;
  let top2 = 700;
  let bottom2 = 900;

  let left3 = 950;
  let right3 = 1000;
  let top3 = 450;
  let bottom3 = 800;

  push();
  stroke(0);
  fill(0, 255, 0, 50);
  //rect(left, top, right - left, bottom - top); //** ButtonGroup 1
  //rect(left2, top2, right2 - left2, bottom2 - top2); //** ButtonGroup 2
  //rect(left3, top3, right3 - left3, bottom3 - top3); //** ButtonGroup 3
  pop();

  //** TEST ButtonGroup_1
  //**If tested in each loop => stall at some point
  if (left < mousePosWorld.x && mousePosWorld.x < right) {
    if (top < mousePosWorld.y && mousePosWorld.y < bottom) {
      for (let i = 0, length = buttonArrayGroup_1.length; i < length; i++) {
        buttonArrayGroup_1[i].MouseOverlaps(mousePosWorld);
        buttonArrayGroup_1[i].SwitchFunction(mousePosWorld, buttonArrayGroup_1);
      }
    }
  }

  //** TEST ButtonGroup_2
  //**If tested in each loop => stall at some point
  if (left2 < mousePosWorld.x && mousePosWorld.x < right2) {
    if (top2 < mousePosWorld.y && mousePosWorld.y < bottom2) {
      for (let i = 0, length = buttonArrayGroup_2.length; i < length; i++) {
        buttonArrayGroup_2[i].MouseOverlaps(mousePosWorld);
      }
    }
  }

  //** TEST ButtonGroup_3
  //**If tested in each loop => stall at some point
  if (left3 < mousePosWorld.x && mousePosWorld.x < right3) {
    if (top3 < mousePosWorld.y && mousePosWorld.y < bottom3) {
      for (let i = 0, length = buttonArrayGroup_3.length; i < length; i++) {
        buttonArrayGroup_3[i].MouseOverlaps(mousePosWorld);
      }
    }
  }

  //** Wall
  //** Move all walls up/down
  wallArray[0].insertPointWall.y = graph.insertPoint.y;

  changeSystem.UpdateLoad();
  changeSystem.UpdateLoadSystem();
  changeSystem.AdjustWallWidth();
  changeSystem.SetWallMesures();
  //changeSystem.DisplayWallScale();

  if (button_Wall_Add.state == 1) changeSystem.Wall_Add(mousePosWorld);
  if (button_Wall_Delete.state == 1) changeSystem.Wall_Delete(mousePosWorld);
  if (button_Load_Add.state == 1) changeSystem.Load_Add(mousePosWorld);
  if (button_Load_Delete.state == 1) changeSystem.Load_Delete(mousePosWorld);

  for (let i = wallArray.length - 1; i >= 0; i--) {
    //** Geometry
    wallArray[i].UpdateWall();
    wallArray[i].DisplayWall();
    wallArray[i].DisplayAndReadWall_t(mousePosWorld);
    wallArray[i].DisplayWallFailiure();

    //** MesureLines - Wall
    if (button_DisplayWallMesure.state == 1) wallArray[i].WallMesureLines();

    wallArray[i].OverlapWallAdjust(mousePosWorld);
    wallArray[i].OverlapAnchorAdjust(mousePosWorld);

    //** Load distToCenter
    wallArray[i].DistToCenter();

    //** Load Overlap
    wallArray[i].OverlapWallLoadVertical(mousePosWorld);
    wallArray[i].UpdateLoadPos();

    //** Load
    wallArray[i].DisplayAndReadLoad_H(mousePosWorld);
    wallArray[i].DisplayAndReadLoad_N(mousePosWorld);

    //** MesureLines - Load
    if (button_DisplayLoadMesure.state == 1) wallArray[i].DisplayLoadMesure_N();

    //** Calculate
    wallArray[i].Calculate();
    if (button_DisplayReactions.state == 1) {
      wallArray[i].DisplayReaction_Stability();
      wallArray[i].DisplayReaction_Instability_Right();
      wallArray[i].DisplayReaction_Instability_Left();

      //** MesureLines - Reacton
      if (button_DisplayReactionsMesure.state == 1) {
        wallArray[i].DisplayReaction_Stability_MesureLines();
        wallArray[i].DisplayReaction_Instability_Right_MesureLines();
        wallArray[i].DisplayReaction_Instability_Left_MesureLines();
      }
    }
  }

  graph.Update();
  graph.Display();
  graph.DisplayWallDimensions();
  graph.DisplayReactionOnWallMesureLines();
  graph.OverlapInsertPoint(mousePosWorld);
  if (button_DisplayForcesPosMouse.state == 1)
    graph.ResultForceInPoint(mousePosWorld);
  if (button_DisplaySumForces.state == 1) graph.DisplaySumForces();
  if (button_DisplaySumForcesMesure.state == 1) graph.DisplaySumForcesMesure();

  //**Tables
  tables.countLoggedInsertPoints = 0;

  //** PAN **
  if(logGlobal>0) movingObject = true; //** flag used in pan
  if(graph.logInserPointGraph) movingObject = true; //** flag used in pan
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
  mouseButtonIsClicked = false; //**Global variable
  mouseButtonIsReleased = true;
  oneTime = true;

  for (let i = 0; i < wallArray.length; i++) {
    wallArray[i].logAdjustPoint_Left = false;
    wallArray[i].logAdjustPoint_Right = false;

    wallArray[i].logAnchorAdjustPoint_Left = false;
    wallArray[i].logLoadVertical = false;
  }

  logGlobal = 0; //** no log registred

  graph.logInserPointGraph = false;

  
  //** Flag pan
  movingObject = false;
}

function mouseWheel(event) {
  oneTimeMouseWheel = true;
  //** ButtonRollor
  //**Test for mouseWorld Overlaps buttonroller
  let test = false;

  if (
    buttonRollor_g.overlapCiffer ||
    buttonRollor_fcd.overlapCiffer ||
    buttonRollor_scaleGeo.overlapCiffer
  ) {
    test = true;
  }

  //** Horisontal Load
  //** in wallArray[].loadHorrisontal.... this.loadHorisontal_Array[i].buttonRollor_H.UpdateIfNotVisible();
  //** Test for overlap
  for (let wall = 0; wall < wallArray.length; wall++) {
    for (
      let load_H = 0;
      load_H < wallArray[wall].loadHorisontal_Array.length;
      load_H++
    ) {
      if (
        wallArray[wall].loadHorisontal_Array[load_H].buttonRollor_H
          .overlapCiffer
      ) {
        //console.log("OverlapCiffer")
        test = true;
        log_wall_H = wall;
        log_load_H = load_H;
        break;
      }
    }
  }

  //** Vertical load
  //** Test for overlap
  for (let wall = 0; wall < wallArray.length; wall++) {
    for (
      let load_N = 0;
      load_N < wallArray[wall].loadVertical_Array.length;
      load_N++
    ) {
      if (
        wallArray[wall].loadVertical_Array[load_N].buttonRollor_N.overlapCiffer
      ) {
        //console.log("OverlapCiffer")
        test = true;
        log_wall_N = wall;
        log_load_N = load_N;
        break;
      }
    }
  }

  //** wall_t
  for (let wall = 0; wall < wallArray.length; wall++) {
    if (wallArray[wall].buttonRollor_t.overlapCiffer) {
      test = true;
      log_wall_t = wall;
      break;
    }
  }

  if (test == false) {

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

    //** ButtonRollor that do not moves
    buttonRollor_g.ChangeVal(val, mousePosWorld); //**g
    buttonRollor_fcd.ChangeVal(val, mousePosWorld); //**fcd
    buttonRollor_scaleGeo.ChangeVal(val, mousePosWorld); //**fcd

    //** ButtonRollor that move
    //** Horisontal load
    if (log_wall_H != null && log_load_H != null) {
      wallArray[log_wall_H].loadHorisontal_Array[
        log_load_H
      ].buttonRollor_H.ChangeVal(
        val,
        wallArray[log_wall_H].loadHorisontal_Array[log_load_H].graphPosNoScale_H
      );
    }

    //** ButtonRollor that move
    //** Vertical load
    if (log_wall_N != null && log_load_N != null) {
      wallArray[log_wall_N].loadVertical_Array[
        log_load_N
      ].buttonRollor_N.ChangeVal(
        val,
        wallArray[log_wall_N].loadVertical_Array[log_load_N].graphPosNoScale_N
      );
    }

    if (log_wall_t != null) {
      wallArray[log_wall_t].buttonRollor_t.ChangeVal(
        val,
        wallArray[log_wall_t].graphPosNoScale_t
      );
    }
  }

  //** set to null else all buttonRollor change
  log_wall_H = null;
  log_load_H = null;
  log_wall_t = null;
  log_wall_N = null;
  log_load_N = null;
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

//****** MoveInSteps *****
function MoveInSteps(pos) {
  //**pos in multioplum of stepChange
  //console.log("Before: " + pos)
  let stepChangePaper = 1; //*scaleGeoGeo;
  pos.x = round(pos.x / stepChangePaper) * stepChangePaper;
  pos.y = round(pos.y / stepChangePaper) * stepChangePaper;
  //console.log("After: " + pos)
  return pos;
}
