//** TO DO **
//** Rev P - text on stringerForce addapted so not on top of each other
//** Display StringerForces && Button on/off
//** Table Displacement
//** Move values (load and reaction) with line to node
//** result.AngleDef()
//** If skin placed on stringer => delete stringer
//** skin.UpdateSkin ..... Sletter ikke stringer når skin slettes (inde i konstruktion)....
//** Kommer an på til hvilket skin stringer er sat på

//** Limit Skin shearForce
//** def draw deformed disk in color

//** Highligt when add/delete load/support
//** when delete all skins in row => error
//** when delete skin with support => delete support in node
//** Coneccted are not correct
//** SkinConnectedSet() - not OK

let runnedOnce = false;
let systemChanged = false;
let inTheCalcZone = false;
let inTheCalcZoneTable = false;
let calcTimes = 0;

let count = 0;
let scaleGeo = 1;
let scaleStringer = 1;
let scaleDef = 1;
let logGridNode = false; //** used in grid.ChangeGridSteps(pos)
let moveGridNode = true; //** used in grid.ChangeGridSteps(pos)
let logGridOriginMove = false;
let logStringerInsertPoint = false;

//**Matrix
let matrix_x = [];
let matrixSolve; //**Object
let matrixLoad; //**Object
let matrixSupport; //**Object

//**Button
//let button_AddSkin; //**Object
//let button_DeleteSkin; //**Object
//let button_AddSupport; //**Object
//let button_DeleteSupport; //**Object
let buttonArray = [];
let buttonDisplayArray = [];

//**Time
let timeReal;

//**Limit mouse call to one call;
let mouseButtonIsClicked = false;
let mouseButtonIsReleased = false;
let oneTime = false;

//** Pan and Zoom ** START
let mousePosScreen = new p5.Vector(0, 0);
let mousePosWorld = new p5.Vector(0, 0);
let mousePosWorldPre = new p5.Vector(0, 0);
let scaleFactorStep = 1.1; // [1;xx] 1 = ingen scale, 2 = dobbelt/halvering
let movingObject = false; //** flag used in pan

let S = new p5.Vector(0.5, 0.5); //**ScaleFactor
let T = new p5.Vector(0, 0);
let T1 = new p5.Vector(0, 0); //**ScaleFactor (svarer til translation tilbage til origo)

let startPan = new p5.Vector(0, 0);
//** Pan and Zoom ** END

//** Skin **
let skin;
let skinSystem;

//** Grid **
let grid;

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
  

  grid = new Grid();
  skinSystem = new SkinSystem();
  matrixSolve = new Matrix();
  matrixLoad = new MatrixLoad();
  matrixSupport = new MatrixSupport();
  changeSystem = new ChangeSystem();
  result = new Result();

  //** Button
  let xPosAdd = 405;
  let xPosDelete = 455;

  button_AddSkin = new Button(
    (pos1x = xPosAdd),
    (pos1y = 495),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DeleteSkin = new Button(
    (pos1x = xPosDelete),
    (pos1y = 495),
    (pos2x = 870),
    (pos3x = 970),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_AddSupport_Cx = new Button(
    (pos1x = xPosAdd),
    (pos1y = 545),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DeleteSupport_Cx = new Button(
    (pos1x = xPosDelete),
    (pos1y = 545),
    (pos2x = 870),
    (pos3x = 970),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_AddSupport_Cy = new Button(
    (pos1x = xPosAdd),
    (pos1y = 595),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DeleteSupport_Cy = new Button(
    (pos1x = xPosDelete),
    (pos1y = 595),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_AddLoad_Px = new Button(
    (pos1x = xPosAdd),
    (pos1y = 645),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DeleteLoad_Px = new Button(
    (pos1x = xPosDelete),
    (pos1y = 645),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_AddLoad_Py = new Button(
    (pos1x = xPosAdd),
    (pos1y = 695),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DeleteLoad_Py = new Button(
    (pos1x = xPosDelete),
    (pos1y = 695),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_AddStringer = new Button(
    (pos1x = xPosAdd),
    (pos1y = 795),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DeleteStringer = new Button(
    (pos1x = xPosDelete),
    (pos1y = 795),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  buttonArray.push(
    button_AddSkin,
    button_DeleteSkin,
    button_AddSupport_Cx,
    button_DeleteSupport_Cx,
    button_AddSupport_Cy,
    button_DeleteSupport_Cy,
    button_AddLoad_Px,
    button_DeleteLoad_Px,
    button_AddLoad_Py,
    button_DeleteLoad_Py,
    button_AddStringer,
    button_DeleteStringer
  );

  //** Button Display
  let xPosDisplay = 805;

  buttonDisplay_LoadValues = new Button(
    (pos1x = xPosDisplay),
    (pos1y = 495),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  buttonDisplay_ReactionValues = new Button(
    (pos1x = xPosDisplay),
    (pos1y = 545),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  buttonDisplay_StringerHor = new Button(
    (pos1x = xPosDisplay),
    (pos1y = 595),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  buttonDisplay_StringerHorValues = new Button(
    (pos1x = xPosDisplay),
    (pos1y = 645),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  buttonDisplay_StringerVer = new Button(
    (pos1x = xPosDisplay),
    (pos1y = 695),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  buttonDisplay_StringerVerValues = new Button(
    (pos1x = xPosDisplay),
    (pos1y = 745),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  buttonDisplay_Def = new Button(
    (pos1x = xPosDisplay),
    (pos1y = 795),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  buttonDisplayArray.push(
    buttonDisplay_LoadValues,
    buttonDisplay_ReactionValues,
    buttonDisplay_StringerHor,
    buttonDisplay_StringerHorValues,
    buttonDisplay_StringerVer,
    buttonDisplay_StringerVerValues,
    buttonDisplay_Def
  );

  //** ButtonRollor
  let adjust = 150;

  buttonRollor_G = new ButtonRollor(
    (pos1x = 400), //** textPro BR
    (pos1y = 1095), //** textPro BR
    (pos2x = 450), //** "=" BR
    (pos3x = 595), //** ciffers BL
    (pos4x = 700), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "G"),
    (textMid = "="),
    (textPre = "N/mm"),
    (startValue = 0.5),
    (minValue = 0.1),
    (maxValue = 150)
  );

  buttonRollor_t = new ButtonRollor(
    (pos1x = 400), //** textPro BR
    (pos1y = 1145), //** textPro BR
    (pos2x = 450), //** "=" BR
    (pos3x = 595), //** ciffers BL
    (pos4x = 700), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "t"),
    (textMid = "="),
    (textPre = "mm"),
    (startValue = 5),
    (minValue = 0.1),
    (maxValue = 999)
  );

  buttonRollor_scaleGeo = new ButtonRollor(
    (pos1x = 400), //** textPro BR
    (pos1y = 895), //** textPro BR
    (pos2x = 480 + adjust), //** "=" BR
    (pos3x = 595 + adjust), //** ciffers BL
    (pos4x = 610 + adjust), //** unit BR
    (prefix = 2),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "Scale Geometry"),
    (textMid = ":"),
    (textPre = "m"),
    (startValue = 1),
    (minValue = 0.1),
    (maxValue = 10)
  );

  buttonRollor_scaleStringer = new ButtonRollor(
    (pos1x = 400), //** textPro BR
    (pos1y = 945), //** textPro BR
    (pos2x = 480 + adjust), //** "=" BR
    (pos3x = 595 + adjust), //** ciffers BL
    (pos4x = 610 + adjust), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "Scale Stringer"),
    (textMid = ":"),
    (textPre = "kN"),
    (startValue = 10),
    (minValue = 0.1),
    (maxValue = 999)
  );

  buttonRollor_scaleDef = new ButtonRollor(
    (pos1x = 400), //** textPro BR
    (pos1y = 995), //** textPro BR
    (pos2x = 480 + adjust), //** "=" BR
    (pos3x = 595 + adjust), //** ciffers BL
    (pos4x = 610 + adjust), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "Scale Def"),
    (textMid = ":"),
    (textPre = "mm"),
    (startValue = 10),
    (minValue = 5),
    (maxValue = 999)
  );

  //** ButtonRollor not fixed
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
  frameRate(30);
  count++;
  //systemChanged = false;

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

  //** panMode
  if (
    logGridOriginMove ||
    logGridNode ||
    logStringerInsertPoint ||
    result.insertPointLog ||
    result.insertPointLogSupport ||
    result.insertPointLogLoad
  )
    movingObject = true;

  //**Paper
  paper_0 = new Paper(0, 0);
  paper_1 = new Paper(2200, 0);

  //**Paper
  paper_0.DisplayPaperCross(2100, 3000); //**Page 1
  paper_1.DisplayPaperCross(2100, 3000); //**Page 2
  //paper_0.DisplayPaperBlank(2100, 3000);
  paper_0.DisplayHeader();
  paper_0.DisplayText();

  //** mousePosScreen
  push();
  stroke(0);
  fill(0);
    circle( mousePosWorld.x, mousePosWorld.y,6);
pop();
  //**ButtonTekst
  push();
  textSize(30);
  textAlign(LEFT);
  text("Skin", 520, 485);
  text("Support Cx", 520, 535);
  text("Support Cy", 520, 585);
  text("Load Px", 520, 635);
  text("Load Py", 520, 685);
  text("Stringer", 520, 785);
  //text("Add/Delete Graph Values", 520, 785);

  //** Button Display
  text("Load Values", 870, 485);
  text("Reaction Values", 870, 535);
  text("Stringer Horisontal", 870, 585);
  text("Stringer Horisontal Values", 870, 635);
  text("Stringer Vertical", 870, 685);

  text("Stringer Vertical Values", 870, 735);
  text("Deformation", 870, 785);

  text("StringerHor: " + skinSystem.stringerHorisontal.length, 400, 1200);
  text("StringerVer: " + skinSystem.stringerVertical.length, 400, 1250);
  pop();

  //**Button
  let AddColor = color(0, 250, 0, 150);
  let DeleteColor = color(250, 0, 0, 150);
  button_AddSkin.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_DeleteSkin.DisplayButton(DeleteColor, 0);
  button_AddSupport_Cx.DisplayButton(AddColor, 1);
  button_DeleteSupport_Cx.DisplayButton(DeleteColor, 0);
  button_AddSupport_Cy.DisplayButton(AddColor, 1);
  button_DeleteSupport_Cy.DisplayButton(DeleteColor, 0);
  button_AddLoad_Px.DisplayButton(AddColor, 1);
  button_DeleteLoad_Px.DisplayButton(DeleteColor, 0);
  button_AddLoad_Py.DisplayButton(AddColor, 1);
  button_DeleteLoad_Py.DisplayButton(DeleteColor, 0);
  button_AddStringer.DisplayButton(AddColor, 1);
  button_DeleteStringer.DisplayButton(DeleteColor, 0);

  let left = 400;
  let right = 500;
  let top = 450;
  let bottom = 800;

  push();
  noFill();
  rect(left, top, right - left, bottom - top);
  rect(left + 400, top, right - left - 50, bottom - top);
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
        button_AddSkin.SwitchFunction(mousePosWorld, buttonArray);
        button_DeleteSkin.SwitchFunction(mousePosWorld, buttonArray);
        button_AddSupport_Cx.SwitchFunction(mousePosWorld, buttonArray);
        button_DeleteSupport_Cx.SwitchFunction(mousePosWorld, buttonArray);
        button_AddSupport_Cy.SwitchFunction(mousePosWorld, buttonArray);
        button_DeleteSupport_Cy.SwitchFunction(mousePosWorld, buttonArray);
        button_AddLoad_Px.SwitchFunction(mousePosWorld, buttonArray);
        button_DeleteLoad_Px.SwitchFunction(mousePosWorld, buttonArray);
        button_AddLoad_Py.SwitchFunction(mousePosWorld, buttonArray);
        button_DeleteLoad_Py.SwitchFunction(mousePosWorld, buttonArray);
        button_AddStringer.SwitchFunction(mousePosWorld, buttonArray);
        button_DeleteStringer.SwitchFunction(mousePosWorld, buttonArray);
      }
    }
  }

  //** ButtonDisplay
  buttonDisplay_LoadValues.DisplayButton(AddColor, 1);
  buttonDisplay_ReactionValues.DisplayButton(AddColor, 1);
  buttonDisplay_StringerHor.DisplayButton(AddColor, 1);
  buttonDisplay_StringerHorValues.DisplayButton(AddColor, 1);
  buttonDisplay_StringerVer.DisplayButton(AddColor, 1);
  buttonDisplay_StringerVerValues.DisplayButton(AddColor, 1);
  buttonDisplay_Def.DisplayButton(AddColor, 1);

  if (left + 400 < mousePosWorld.x && mousePosWorld.x < right + 400) {
    if (top < mousePosWorld.y && mousePosWorld.y < bottom) {
      for (let i = 0, length = buttonDisplayArray.length; i < length; i++) {
        buttonDisplayArray[i].MouseOverlaps(mousePosWorld);
      }
    }
  }

  //** SkinSystem **
  /*
  skinSystem.skinMatrix[0][2].G = 0;
  skinSystem.skinMatrix[1][0].G = 0;

  skinSystem.skinMatrix[1][0].G = 0;
  skinSystem.skinMatrix[1][2].G = 0;
  skinSystem.skinMatrix[2][1].G = 0;
  skinSystem.skinMatrix[2][2].G = 0;
  skinSystem.skinMatrix[2][4].G = 0;
  skinSystem.skinMatrix[3][3].G = 0;
*/

  //** SupportMatrix Display
  matrixSupport.DisplayMatrixSupport();

  //***************************
  //** changeSystem ** START **
  //***************************
  //** changeSystem before calculations => all changes are calculated

  //**HighLigth when ADD/DELETE
  //changeSystem.HighligthChange();

  if (button_AddSupport_Cx.state == 1) changeSystem.AddSupport(mousePosWorld);
  if (button_DeleteSupport_Cx.state == 1)
    changeSystem.DeleteSupport(mousePosWorld);

  if (button_AddSupport_Cy.state == 1) changeSystem.AddSupport(mousePosWorld);
  if (button_DeleteSupport_Cy.state == 1)
    changeSystem.DeleteSupport(mousePosWorld);

  if (button_AddLoad_Px.state == 1) changeSystem.AddLoad(mousePosWorld);
  if (button_DeleteLoad_Px.state == 1) changeSystem.DeleteLoad(mousePosWorld);

  if (button_AddLoad_Py.state == 1) changeSystem.AddLoad(mousePosWorld);
  if (button_DeleteLoad_Py.state == 1) changeSystem.DeleteLoad(mousePosWorld);

  if (button_AddStringer.state == 1) changeSystem.AddStringer(mousePosWorld);
  if (button_DeleteStringer.state == 1)
    changeSystem.DeleteStringer(mousePosWorld);

  //*************************
  //** changeSystem ** END **
  //*************************

  //** Add support in StiffnesMatrixGlobal in real time
  let rowSupport = matrixSupport.overlapRow;
  let colSupport = matrixSupport.overlapCol;
  let overLapSupport_Cy = false;
  let overLapSupport_Cx = false;

  if (rowSupport >= 0 || colSupport >= 0) {
    overLapSupport_Cy =
      matrixSupport.matrixSupport[rowSupport][colSupport].buttonRollor_Cy
        .overlapCiffer;
    overLapSupport_Cx =
      matrixSupport.matrixSupport[rowSupport][colSupport].buttonRollor_Cx
        .overlapCiffer;
  }
  //** Reset values => can delete skin
  matrixSupport.overlapRow = undefined;
  matrixSupport.overlapCol = undefined;

  let rowLoad = matrixLoad.overlapRow;
  let colLoad = matrixLoad.overlapCol;
  let overLapLoad_Py = false;
  let overLapLoad_Px = false;

  if (rowLoad >= 0 || colLoad >= 0) {
    overLapLoad_Py =
      matrixLoad.matrixLoad[rowLoad][colLoad].buttonRollor_Py.overlapCiffer;
    overLapLoad_Px =
      matrixLoad.matrixLoad[rowLoad][colLoad].buttonRollor_Px.overlapCiffer;
  }
  //** Reset values => can delete skin
  matrixLoad.overlapRow = undefined;
  matrixLoad.overlapCol = undefined;

  //** CALC ZONE ** START **
  let topGrid = new p5.Vector.add(grid.origin, new p5.Vector(-150, -150));
  //topGrid.x = topGrid.x-150;
  //topGrid.y = topGrid.y-150;
  let endGrid = new p5.Vector(
    -topGrid.x + 150 + grid.gridNodes[0][grid.columnsTotal - 1][0],
    -topGrid.y + 200 + grid.gridNodes[grid.rowsTotal - 1][0][1]
  );

  //** CalcZone visual
  push();
  noFill();
  //rect(topGrid.x,topGrid.y,endGrid.x,endGrid.y)
  pop();

  //** InTheCalcZone when mouse overlap skinSystem
  if (topGrid.x < mousePosWorld.x && mousePosWorld.x < topGrid.x + endGrid.x) {
    if (
      topGrid.y < mousePosWorld.y &&
      mousePosWorld.y < topGrid.y + endGrid.y
    ) {
      inTheCalcZone = true;
    } else inTheCalcZone = false;
  } else inTheCalcZone = false;

  //** InTheCalcZone when mouse overlap buttonRollor in Tabel
  if (
    (result.resultTableRowLog >= 0 && result.resultTableColLog >= 0) ||
    (result.resultTableSupportRowLog >= 0 &&
      result.resultTableSupportRowLog >= 0) ||
    (result.resultTableLoadRowLog >= 0 && result.resultTableLoadRowLog >= 0)
  )
    inTheCalcZoneTable = true;
  else inTheCalcZoneTable = false;
  //console.log("inTheCalcZone: " + inTheCalcZone);
  //** CALC ZONE ** END **

  //skinSystem.DisplaySkinSystem();
  //skinSystem.DisplayHorisontalStringers();
  //skinSystem.DisplayVerticalStringers();

  if (
    (grid.OverlapNode(mousePosWorld) && mouseIsPressed) ||
    buttonRollor_G.overlapCiffer ||
    buttonRollor_t.overlapCiffer ||
    //buttonRollor_scaleGeo.overlapCiffer ||
    overLapSupport_Cy ||
    overLapSupport_Cx ||
    overLapLoad_Py ||
    overLapLoad_Px ||
    inTheCalcZone ||
    inTheCalcZoneTable
    //systemChanged
  ) {
    //console.log("inTheCalcZone " + inTheCalcZone)
    //skinSystem.ConstructHorisontalStringers();
    //skinSystem.ConstructVerticalStringers();
    skinSystem.StringerSkinSystemHorisontal();
    skinSystem.StringerSkinSystemVertical();
    skinSystem.StiffnessMatrixGlobal();

    //** Update must be at end so that unknowns can be
    //** determined for further use
    //skinSystem.UpdateSkinSystem();
    skinSystem.SkinConnectedHorisontalSet();
    skinSystem.SkinConnectedVerticalSet();

    //** LoadMatrix SetUp
    matrixLoad.MatrixLoadConstruct();

    //** SupportMatrix SetUp
    matrixSupport.MatrixSupportConstruct();

    /*
    skinSystem.skinMatrix[0][0].G = 10000;
    skinSystem.skinMatrix[0][0].a_w = 1/1000;
    skinSystem.skinMatrix[0][0].a_h = 1/1000;
    */
  }

  /*
  //**MatrixSolve Ax=B
  let matrix_B = matrixLoad.matrixLoadArray;
  let matrix_A = matrixSolve.MatrixAddToDiagonal(
    skinSystem.stiffnessMatrixGlobal,
    matrixSupport.matrixSupportArray
  );
*/

  //console.log("Matrix_A.length: " + matrix_A.length)
  //console.log("Matrix_B.length: " + matrix_B.length)
  //console.log("stiffnessMatrixGlobal.length: " + skinSystem.stiffnessMatrixGlobal.length)
  //console.log("matrixSupport.length: " + matrixSupport.matrixSupportArray.length)
  //console.log("stiffnessMatrixGlobal.length: " + skinSystem.stiffnessMatrixGlobal.length)

  //matrixSolve.UpdateMatrixSize();

  //runnedOnce = true; //******************************************
  let matrix_B = matrixLoad.matrixLoadArray;
  let matrix_A = matrixSolve.MatrixAddToDiagonal(
    skinSystem.stiffnessMatrixGlobal,
    matrixSupport.matrixSupportArray
  );
  if (matrix_A.length > 0) {
    if (
      mouseIsPressed ||
      buttonRollor_G.overlapCiffer ||
      buttonRollor_t.overlapCiffer ||
      //buttonRollor_scaleGeo.overlapCiffer ||
      overLapSupport_Cy ||
      overLapSupport_Cx ||
      overLapLoad_Py ||
      overLapLoad_Px ||
      inTheCalcZone ||
      inTheCalcZoneTable
      //systemChanged
    ) {
      //**MatrixSolve Ax=B
      matrixSolve.UpdateMatrixSize();
      matrixSolve.InputData(matrix_A, matrix_B);
      matrixSolve.ForwardElimination();
      matrixSolve.BackwardSubstitution();
      matrix_x = matrixSolve.matrix_x;
    }

    let insertPoint = new p5.Vector(2700, 300);

    matrixSolve.DisplayOneMatrix(
      insertPoint.x,
      insertPoint.y,
      matrix_A,
      "Stiffness"
    );
    matrixSolve.DisplayOneMatrix(
      insertPoint.x + (skinSystem.unknowns + 0.25) * 100,
      insertPoint.y,
      matrix_x,
      "Solution"
    );
    matrixSolve.DisplayOneMatrix(
      insertPoint.x + (skinSystem.unknowns + 1.75) * 100,
      insertPoint.y,
      matrix_B,
      "Load"
    );

    matrixSolve.DisplayOneMatrix(
      insertPoint.x,
      insertPoint.y + 400,
      result.matrixShear,
      "Shear"
    );
  }

  //** Grid **
  grid.DisplayGrid();
  grid.DisplayGridMesure();
  if (inTheCalcZone) {
    grid.UpdateGrid();
    grid.FindNearestGridNodes(mousePosWorld);
    grid.GridLineAbove(mousePosWorld);
    grid.GridLineLeft(mousePosWorld);
    grid.OverlapNode(mousePosWorld);
    grid.ChangeGridSteps(mousePosWorld);
    grid.MoveAllGrid(mousePosWorld);
  }

  //***************************
  //** changeSystem ** START **
  //***************************

  if (button_AddSkin.state == 1 && inTheCalcZone) {
    changeSystem.AddGrid(mousePosWorld);
    skinSystem.UpdateSkinSystem();
  }

  if (button_DeleteSkin.state == 1 && inTheCalcZone) {
    changeSystem.DeleteSkin(mousePosWorld);
    skinSystem.UpdateSkinSystem();
  }
  //*************************
  //** changeSystem ** END **
  //*************************

  //*********************
  //** Result ** START **
  //*********************

  //** Can only calculate when system is updated
  if (
    skinSystem.stringerSkinMatrixHorisontal.length > 0 &&
    skinSystem.stringerSkinMatrixVertical[0].length == grid.rows.length - 1 &&
    skinSystem.stringerSkinMatrixHorisontal[0][0].length ==
      grid.columns.length - 1
  ) {
    result.Shear();
    result.Def();
    result.Reaction();
    result.StringerForceHorisontal();
    result.StringerForceVertical();
    result.DiagonalDef(); //** used for limitShear

    //** Display
    result.ShearDisplay();
    result.ShearForceDisplay(); //** Limit in method otherwise flicker when value -> infinity
    result.DisplayReaction();
    //result.TestForEqu();
    result.TabelResult();
    result.TabelResultSupport();
    result.TabelResultLoad();

    //** Move Tables ** Test OverlapInsertPoint
    result.OverlapInsertPoint(mousePosWorld);

    //** move Table Skins
    if (result.insertPointLog) {
      result.MoveInSteps(mousePosWorld, result.insertPointTabel);
    }

    //** move Table Supports
    if (result.insertPointLogSupport) {
      result.MoveInSteps(mousePosWorld, result.insertPointTabelSupport);
    }

    //** move Table Loads
    if (result.insertPointLogLoad) {
      result.MoveInSteps(mousePosWorld, result.insertPointTabelLoad);
    }

    //result.StringerForceHorisontalDisplay();
    result.StringerForceHorisontalDisplayColor();
    //result.StringerForceVerticalDisplay();
    result.StringerForceVerticalDisplayColor();

    //** Display
    if (buttonDisplay_StringerHor.state == 1)
      result.StringerForceHorisontalDisplayShade();
    if (buttonDisplay_StringerVer.state == 1)
      result.StringerForceVerticalDisplayShade();
    if (buttonDisplay_Def.state == 1) result.DisplayDef();
    if (buttonDisplay_LoadValues.state == 1)
      matrixLoad.DisplayMatrixLoadValues();
    if (buttonDisplay_ReactionValues.state == 1) result.DisplayReactionValue();
    if (buttonDisplay_StringerHorValues.state == 1)
      result.DisplayStringerHorisontal();
    if (buttonDisplay_StringerVerValues.state == 1)
      result.DisplayStringerVertical();
  }

  //** Display
  skinSystem.UpdateSkinSystem();
  if (inTheCalcZone || inTheCalcZoneTable) {
    skinSystem.ConstructHorisontalStringers();
    skinSystem.ConstructVerticalStringers();
  }
  skinSystem.DisplayHorisontalStringers();
  skinSystem.DisplayVerticalStringers();
  skinSystem.DisplaySkinSystem();

  grid.DisplayGridNodes();

  //** SupportMatrix Log node
  matrixSupport.LogSupportNode();

  //** SkinMatrix logSkin
  //skinSystem.LogSkin();

  //matrixSupport.matrixSupport[1][0].Cx = 1e5;
  //matrixSupport.matrixSupport[1][0].Cy = 1e5;
  //matrixSupport.matrixSupport[1][2].Cy = 1e5;

  //console.log(skinSystem.skinMatrix[0][0].a_w)

  //** LoadMatrix Display
  matrixLoad.DisplayMatrixLoad();
  //matrixLoad.matrixLoad[0][1].Px = 1e4;

  //*******************
  //** Result ** END **
  //*******************

  //** ButtonRollor that do not move
  buttonRollor_G.DisplayButonRollor(mousePosWorld);
  buttonRollor_G.DisplayUnitsE();
  buttonRollor_t.DisplayButonRollor(mousePosWorld);
  buttonRollor_scaleGeo.DisplayButonRollor(mousePosWorld);
  buttonRollor_scaleStringer.DisplayButonRollor(mousePosWorld);
  buttonRollor_scaleDef.DisplayButonRollor(mousePosWorld);

  //** ButtonRollor ReadValue **
  scaleGeo = buttonRollor_scaleGeo.ReadValue();
  scaleStringer = buttonRollor_scaleStringer.ReadValue();
  scaleDef = buttonRollor_scaleDef.ReadValue();

  for (
    let row = 0, length = skinSystem.skinMatrix.length;
    row < length;
    row++
  ) {
    for (
      let col = 0, length = skinSystem.skinMatrix[0].length;
      col < length;
      col++
    ) {
      //** Do not read value if G !=0
      if (skinSystem.skinMatrix[row][col].G != 0) {
        skinSystem.skinMatrix[row][col].G = buttonRollor_G.ReadValue() * 1000; //** x10^3
        //skinSystem.skinMatrix[row][col].t = buttonRollor_t.ReadValue();
      }
    }
  } //** LIMIT SHEAR **

  /* ** LIMIT SHEAR ** 

  let limitShear = 2; //** kN/m
  let factor;
  let calc = true;
  
    if (abs(skinSystem.skinMatrix[0][1].shear) < limitShear) {
    calc = false;
    factor = 1;
     skinSystem.skinMatrix[0][1].t = buttonRollor_t.ReadValue()
  }

  //console.log(abs(skinSystem.skinMatrix[0][1].shear));

  if (abs(skinSystem.skinMatrix[0][1].shear )  > 0 && calc) {
    // console.log("Sketch Line 898 +"  + result.matrixShear[0][1])
    let def_x = result.matrixDef[0][1][0] - result.matrixDef[1][1][0];
    let def_y = -result.matrixDef[1][2][1] + result.matrixDef[1][1][1];
    //console.log("Def_y: " + def_x)
    //console.log("Def_x: " + def_y)
    let def1 = def_x + def_y;
    //let def2 = pow(pow(def_x,2)+pow(def_y,2),0.5)
    let h = skinSystem.skinMatrix[0][1].h;
    let w = skinSystem.skinMatrix[0][1].w;

    factor = 1 / ((limitShear * h * 1000) / def1 / 500 / 100);

    skinSystem.skinMatrix[0][1].factorLimitShear = round(
      skinSystem.skinMatrix[0][1].t * factor,
      5
    );
    console.log("factorLimitShear (sketch line 905): " + factor);

    skinSystem.skinMatrix[0][1].t =
      skinSystem.skinMatrix[0][1].t /
      skinSystem.skinMatrix[0][1].factorLimitShear;

    //console.log("Def1: " + def1)
  } //else skinSystem.skinMatrix[0][1].t =5

*/

  //systemChanged = false;
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
  mouseButtonIsClicked = false; //**Global variable

  oneTime = true;
  logGridNode = false;
  logGridOriginMove = false;
  logStringerInsertPoint = false;

  for (let i = 0; i < result.insertPointStringerHor.length; i++) {
    result.insertPointStringerHor[i][1] = false;
  }

  for (let i = 0; i < result.insertPointStringerVer.length; i++) {
    result.insertPointStringerVer[i][1] = false;
  }

  //** Flag pan
  movingObject = false;
}

function mouseWheel(event) {
  //**Test for mouseWorld Overlaps buttonroller
  let test = false;
  if (
    buttonRollor_G.overlapCiffer ||
    buttonRollor_t.overlapCiffer ||
    buttonRollor_scaleGeo.overlapCiffer ||
    buttonRollor_scaleStringer.overlapCiffer ||
    buttonRollor_scaleDef.overlapCiffer
  )
    test = true;

  //** Supports
  let row = matrixSupport.overlapRow;
  let col = matrixSupport.overlapCol;
  //* row & col logged in matrixSupport.DisplayMatrixSupport()

  if (row >= 0 && col >= 0) {
    if (matrixSupport.matrixSupport[row][col].buttonRollor_Cy.overlapCiffer)
      test = true;
    if (matrixSupport.matrixSupport[row][col].buttonRollor_Cx.overlapCiffer) {
      test = true;
    }
  }

  //** SupportsTable
  let rowSupportTable = result.resultTableSupportRowLog;
  let colSupportTable = result.resultTableSupportColLog;
  //* row & col logged in matrixSupport.DisplayMatrixSupport()

  if (rowSupportTable >= 0 && colSupportTable >= 0) {
    if (
      matrixSupport.matrixSupport[rowSupportTable][colSupportTable]
        .buttonRollorTable_Cy.overlapCiffer
    )
      test = true;
    if (
      matrixSupport.matrixSupport[rowSupportTable][colSupportTable]
        .buttonRollorTable_Cx.overlapCiffer
    ) {
      test = true;
    }
  }

  //** Loads
  let rowLoad = matrixLoad.overlapRow;
  let colLoad = matrixLoad.overlapCol;
  //* row & col logged in matrixLoad.DisplayMatrixLoad()
  if (rowLoad >= 0 && colLoad >= 0) {
    if (matrixLoad.matrixLoad[rowLoad][colLoad].buttonRollor_Py.overlapCiffer)
      test = true;
    if (matrixLoad.matrixLoad[rowLoad][colLoad].buttonRollor_Px.overlapCiffer)
      test = true;
    //console.log("testLoad " + test + " rowLoad " + rowLoad + " colLoad " + colLoad);
  }

  //** LoadsTable
  let rowLoadTable = result.resultTableLoadRowLog;
  let colLoadTable = result.resultTableLoadColLog;
  //* row & col logged in matrixSupport.DisplayMatrixSupport()

  if (rowLoadTable >= 0 && colLoadTable >= 0) {
    if (
      matrixLoad.matrixLoad[rowLoadTable][colLoadTable].buttonRollorTable_Py
        .overlapCiffer
    )
      test = true;
    if (
      matrixLoad.matrixLoad[rowLoadTable][colLoadTable].buttonRollorTable_Px
        .overlapCiffer
    ) {
      test = true;
    }
  }

  //** Skin_t
  //let rowSkin_t = skinSystem.rowLog;
  //let colSkin_t = skinSystem.colLog;
  let rowSkin_t = result.resultTableRowLog;
  let colSkin_t = result.resultTableColLog;

  if (rowSkin_t >= 0 && colSkin_t >= 0) {
    if (
      skinSystem.skinMatrix[rowSkin_t][colSkin_t].buttonRollor_skin_t
        .overlapCiffer
    ) {
      test = true;
    }
    //console.log("rowSkin " + test + " rowSkin_t " + rowSkin_t + " colSkin_t " + colSkin_t);
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

    if (event.deltaY > 0) val = -1;
    if (event.deltaY < 0) val = 1;

    buttonRollor_G.ChangeVal(val, mousePosWorld); //**E
    buttonRollor_t.ChangeVal(val, mousePosWorld); //**I
    buttonRollor_scaleGeo.ChangeVal(val, mousePosWorld); //**scaleGeo
    buttonRollor_scaleStringer.ChangeVal(val, mousePosWorld);
    buttonRollor_scaleDef.ChangeVal(val, mousePosWorld);

    //** Support
    if (row >= 0 && col >= 0) {
      let graphPosNoScale_Cx =
        matrixSupport.matrixSupport[row][col].graphPosNoScale_Cx;
      matrixSupport.matrixSupport[row][col].buttonRollor_Cx.ChangeVal(
        val,
        graphPosNoScale_Cx
      );

      let graphPosNoScale_Cy =
        matrixSupport.matrixSupport[row][col].graphPosNoScale_Cy;
      matrixSupport.matrixSupport[row][col].buttonRollor_Cy.ChangeVal(
        val,
        graphPosNoScale_Cy
      );
    }

    //** SupportTable
    if (rowSupportTable >= 0 && colSupportTable >= 0) {
      let graphPosNoScaleTable_Cx =
        matrixSupport.matrixSupport[rowSupportTable][colSupportTable]
          .graphPosNoScaleTable_Cx;
      matrixSupport.matrixSupport[rowSupportTable][
        colSupportTable
      ].buttonRollorTable_Cx.ChangeVal(val, graphPosNoScaleTable_Cx);

      let graphPosNoScaleTable_Cy =
        matrixSupport.matrixSupport[rowSupportTable][colSupportTable]
          .graphPosNoScaleTable_Cy;
      matrixSupport.matrixSupport[rowSupportTable][
        colSupportTable
      ].buttonRollorTable_Cy.ChangeVal(val, graphPosNoScaleTable_Cy);
    }

    //** Load
    if (rowLoad >= 0 && colLoad >= 0) {
      console.log("*");
      let graphPosNoScale_Py =
        matrixLoad.matrixLoad[rowLoad][colLoad].graphPosNoScale_Py;
      matrixLoad.matrixLoad[rowLoad][colLoad].buttonRollor_Py.ChangeVal(
        val,
        graphPosNoScale_Py
      );
      //console.log(matrixLoad.matrixLoad[rowLoad][colLoad].graphPosNoScale_Py)

      let graphPosNoScale_Px =
        matrixLoad.matrixLoad[rowLoad][colLoad].graphPosNoScale_Px;
      matrixLoad.matrixLoad[rowLoad][colLoad].buttonRollor_Px.ChangeVal(
        val,
        graphPosNoScale_Px
      );
      //circle(graphPosNoScale_Px.x,graphPosNoScale_Px.y,50)
    }

    //** LoadTable
    if (rowLoadTable >= 0 && colLoadTable >= 0) {
      let graphPosNoScaleTable_Px =
        matrixLoad.matrixLoad[rowLoadTable][colLoadTable]
          .graphPosNoScaleTable_Px;
      matrixLoad.matrixLoad[rowLoadTable][
        colLoadTable
      ].buttonRollorTable_Px.ChangeVal(val, graphPosNoScaleTable_Px);

      let graphPosNoScaleTable_Py =
        matrixLoad.matrixLoad[rowLoadTable][colLoadTable]
          .graphPosNoScaleTable_Py;
      matrixLoad.matrixLoad[rowLoadTable][
        colLoadTable
      ].buttonRollorTable_Py.ChangeVal(val, graphPosNoScaleTable_Py);
    }

    //** Skin t
    if (rowSkin_t >= 0 && colSkin_t >= 0) {
      let graphPosNoScale_skin_t =
        skinSystem.skinMatrix[rowSkin_t][colSkin_t].graphPosNoScale_skin_t;
      skinSystem.skinMatrix[rowSkin_t][colSkin_t].buttonRollor_skin_t.ChangeVal(
        val,
        graphPosNoScale_skin_t
      );
    }

    //console.log("******* row: " + row + " ****** col: " + col);
    //console.log("******* Cy: " + matrixSupport.matrixSupport[row][col].Cy);
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
