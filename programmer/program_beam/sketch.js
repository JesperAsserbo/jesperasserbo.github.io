//** Github
//** Sketch line 949 => test pan;
//** Error infinite loop test line 1121

//** p5.js v2 => matrice regning angiver infiniteLoop hvis tager mere end 500ms.
//** Indsæt '// noprotect' for matriceløkker
//** evt. sænke frameRate()
//** disableFriendlyErrors = true (indsat før setup())

//**** Rev B **********
//** add reinforcement graphs
//** add connection Forces

//**** Rev A **********
//** BeamReinforced
//** changeSystem line 191 (delete node => delete bolt)
//** Calculation.CreateMtrices() => this.Unknowns => adjust unknowns/MatrixSize

//**** TO DO ****
//** Display Button V_Sum & M_Sum
//** Eigenvalue
//** Graph Values on Graphs
//** Graph Values only show if reinforcedExist in Calculate.DisplayGraphResultValuesReinforced
//** Headline on Reinforced E, I
//** Add Reinforcment data E, I with color
//** Fill global Matrice
//** LoadLine snap to nodes... not working in first loadLine
//** Overlap table Highligth
//*********************

//** loadPoint.MoveLoadDisplay.....

//**Overskrifter på FEM Kx=P og Eigenvalue K-w2M = 0
//**LoadMatrix - loadLineSum, loadPointSum fordel last til knuder i CMM og LMM
//**EigenValue
//**EigenValue charnier ?? Check with Robot
//***Lumped MassMatrix

//**Graph.DisplayReactions(supports)..... sign on MomentValue for fixed support

//**ReadValue function on graph
//**move action in sketch to elementChange class
//**When add support make sure that node does not move to mousePosWorld
//**Only calculate etc. when nessesary
//**Error when to many charniers etc.

let x0 = 0;
let x1 = 0;
let x2 = 0;
let x3 = 0;
let x4 = 0;
let count = 0;

let elements = [];
let elementsReinforced = [];
let bolts = [];

//**Global Objects
let calculate; //**Object
let changeSystem; //**Object
let supportSystem; //**Object
let loadSystem; //**Object
let matrixSolve; //**Object
let matrixEigen; //**Object
let x; //**Solution to Ax=B
let collisionDetect; //**Object
let graph;

let supports = [];
let loadPoints = [];
let loadLines = [];
let loadMoments = [];
let reactions = [];
let buttonArray = [];
let buttonArrayGroupOne = [];
let buttonArrayGroupTwo = [];
let buttonArrayGroupTree = [];

//**Time
let timeReal;

//**Tables
let tables;

//**Button
let button_AddNode; //**Object
let button_AddSupport; //**Object

//**Limit mouse call to one call;
let mouseButtonIsClicked = false;
let mouseButtonIsReleased = true; //** start Released is true
let oneClickSupport = false;
let oneClickLoadPoint = false;
let oneClickLoadLine = false;
let oneClickLoadMoment = false;
let oneClickNodeDelete = false;
let oneClickLoadLineDelete = false;
let oneClickLoadPointDelete = false;
let oneClickLoadMomentDelete = false;
let oneClickCharnier = false;
let oneClickCharnierDelete = false;
let oneClickSupportFixed = false;
let oneClickSupportFixedDelete = false;
let oneTime = false;

//** Log supports when buttonRollor overlapped (in moouseWheel function)
let log_Cy = null;
let log_Cz = null;

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

//** InfiniteLoops
disableFriendlyErrors = true
//let displayMatrixUpdate = true;
let flagMatrixChange = false;

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
  

  calculate = new Calculation();
  changeSystem = new ChangeSystem();
  supportSystem = new SupportMatrix();
  collisionDetect = new CollisionDetection();
  loadSystem = new LoadMatrix();
  graph = new Graph();
  tables = new Table();

  matrixSolve = new Matrix(); //** MatrixSolve Ax=B;
  matrixEigen = new MatrixEigenValue(); //**determinant[k-w2M]=0

  let xPosAdd = 405;
  let xPosDelete = 455;

  button_AddNode = new Button(
    (pos1x = xPosAdd),
    (pos1y = 495),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_NodeDelete = new Button(
    (pos1x = xPosDelete),
    (pos1y = 495),
    (pos2x = 870),
    (pos3x = 970),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_AddSupport = new Button(
    (pos1x = xPosAdd),
    (pos1y = 545),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_SupportDelete = new Button(
    (pos1x = xPosDelete),
    (pos1y = 545),
    (pos2x = 870),
    (pos3x = 970),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_AddSupportFixed = new Button(
    (pos1x = xPosAdd),
    (pos1y = 595),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DeleteSupportFixed = new Button(
    (pos1x = xPosDelete),
    (pos1y = 595),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_AddCharnier = new Button(
    (pos1x = xPosAdd),
    (pos1y = 645),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DeleteCharnier = new Button(
    (pos1x = xPosDelete),
    (pos1y = 645),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_AddLoadPoint = new Button(
    (pos1x = xPosAdd),
    (pos1y = 695),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DeleteLoadPoint = new Button(
    (pos1x = xPosDelete),
    (pos1y = 695),
    (pos2x = 870),
    (pos3x = 1070),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_AddLoadLine = new Button(
    (pos1x = xPosAdd),
    (pos1y = 745),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DeleteLoadLine = new Button(
    (pos1x = xPosDelete),
    (pos1y = 745),
    (pos2x = 870),
    (pos3x = 1070),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_AddLoadMoment = new Button(
    (pos1x = xPosAdd),
    (pos1y = 795),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DeleteLoadMoment = new Button(
    (pos1x = xPosDelete),
    (pos1y = 795),
    (pos2x = 870),
    (pos3x = 1070),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DisplayValuesAdd = new Button(
    (pos1x = xPosAdd),
    (pos1y = 845),
    (pos2x = 870),
    (pos3x = 1070),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DisplayValuesDelete = new Button(
    (pos1x = xPosDelete),
    (pos1y = 845),
    (pos2x = 870),
    (pos3x = 1070),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_MassMAtrixCMM = new Button(
    (pos1x = xPosDelete + 500),
    (pos1y = 495),
    (pos2x = 870),
    (pos3x = 1070),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_MassMAtrixLMM = new Button(
    (pos1x = xPosDelete + 500),
    (pos1y = 545),
    (pos2x = 870),
    (pos3x = 1070),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  //** Reinforced button
  button_BeamReinforced = new Button(
    (pos1x = xPosDelete + 500),
    (pos1y = 795),
    (pos2x = 870),
    (pos3x = 1070),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DisplayBoltAdd = new Button(
    (pos1x = xPosAdd + 550),
    (pos1y = 845),
    (pos2x = 870),
    (pos3x = 1070),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_DisplayBoltDelete = new Button(
    (pos1x = xPosDelete + 550),
    (pos1y = 845),
    (pos2x = 870),
    (pos3x = 1070),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  buttonArray.push(
    button_AddNode,
    button_NodeDelete,
    button_AddSupport,
    button_SupportDelete,
    button_AddLoadPoint,
    button_DeleteLoadPoint,
    button_AddLoadLine,
    button_DeleteLoadLine,
    button_AddCharnier,
    button_DeleteCharnier,
    button_AddSupportFixed,
    button_DeleteSupportFixed,
    button_AddLoadMoment,
    button_DeleteLoadMoment
  );

  buttonArrayGroupOne.push(button_DisplayValuesAdd);
  buttonArrayGroupOne.push(button_DisplayValuesDelete);

  buttonArrayGroupTwo.push(button_MassMAtrixCMM);
  buttonArrayGroupTwo.push(button_MassMAtrixLMM);
  buttonArrayGroupTwo.push(button_BeamReinforced);

  buttonArrayGroupTree.push(button_DisplayBoltAdd, button_DisplayBoltDelete);

  //**Paper
  paper_0 = new Paper(0, 0);
  paper_1 = new Paper(2200, 0);

  //**Start Elements
  elements.push(
    new Element(700, 800, 900, 800, (E = 200000), (I = 10000000), (Id = 1))
  );
  elements.push(
    new Element(500, 800, 700, 800, (E = 200000), (I = 10000000), (Id = 0))
  );

  //**StartElementsReinforced
  elementsReinforced.push(
    new Element(700, 800, 900, 800, (E = 200000), (I = 10000000), (Id = 1))
  );
  elementsReinforced.push(
    new Element(500, 800, 700, 800, (E = 200000), (I = 10000000), (Id = 0))
  );

  //**StartBolts
  let pos_1 = elements[0].startPos;
  let pos_2 = elements[1].startPos;
  let pos_3 = elements[1].endPos;

  bolts.push(new Bolt(0, pos_1));
  bolts.push(new Bolt(1, pos_2));
  bolts.push(new Bolt(2, pos_3));

  //console.log("sketch line 372: " + elementsReinforced);

  //**ButtonRollor_scaleMoment
  buttonRollor_scaleMoment = new ButtonRollor(
    (pos1x = 50), //** textPro BR
    (pos1y = 15), //** textPro BR
    (pos2x = 125), //** "=" BR
    (pos3x = 245), //** ciffers BL
    (pos4x = 255), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "Scale"),
    (textMid = ":"),
    (textPre = "kNm"),
    (startValue = 5),
    (minValue = 0.1),
    (maxValue = 100)
  );

  buttonRollor_scaleShear = new ButtonRollor(
    (pos1x = 50), //** textPro BR
    (pos1y = 15), //** textPro BR
    (pos2x = 125), //** "=" BR
    (pos3x = 245), //** ciffers BL
    (pos4x = 255), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "Scale"),
    (textMid = ":"),
    (textPre = "kN"),
    (startValue = 5),
    (minValue = 0.1),
    (maxValue = 100)
  );

  buttonRollor_scaleDef = new ButtonRollor(
    (pos1x = 50), //** textPro BR
    (pos1y = 15), //** textPro BR
    (pos2x = 125), //** "=" BR
    (pos3x = 245), //** ciffers BL
    (pos4x = 255), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "Scale"),
    (textMid = ":"),
    (textPre = "mm"),
    (startValue = 5),
    (minValue = 1),
    (maxValue = 100)
  );

  buttonRollor_E = new ButtonRollor(
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
    (textPro = "E"),
    (textMid = "="),
    (textPre = "N/mm"),
    (startValue = 10),
    (minValue = 1),
    (maxValue = 250)
  );

  buttonRollor_I = new ButtonRollor(
    (pos1x = 400), //** textPro BR
    (pos1y = 1145), //** textPro BR
    (pos2x = 450), //** "=" BR
    (pos3x = 595), //** ciffers BL
    (pos4x = 700), //** unit BR
    (prefix = 4),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "I"),
    (textMid = "="),
    (textPre = "mm"),
    (startValue = 100),
    (minValue = 0.1),
    (maxValue = 9999)
  );

  buttonRollor_scaleGeo = new ButtonRollor(
    (pos1x = 400), //** textPro BR
    (pos1y = 945), //** textPro BR
    (pos2x = 480), //** "=" BR
    (pos3x = 595), //** ciffers BL
    (pos4x = 610), //** unit BR
    (prefix = 2),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "Scale"),
    (textMid = ":"),
    (textPre = "m"),
    (startValue = 1),
    (minValue = 0.1),
    (maxValue = 10)
  );

  //** Reinforcement
  buttonRollor_E1 = new ButtonRollor(
    (pos1x = 950), //** textPro BR
    (pos1y = 1095), //** textPro BR
    (pos2x = 1000), //** "=" BR
    (pos3x = 1145), //** ciffers BL
    (pos4x = 1250), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "E"),
    (textMid = "="),
    (textPre = "N/mm"),
    (startValue = 10),
    (minValue = 1),
    (maxValue = 250)
  );

  buttonRollor_I1 = new ButtonRollor(
    (pos1x = 950), //** textPro BR
    (pos1y = 1145), //** textPro BR
    (pos2x = 1000), //** "=" BR
    (pos3x = 1145), //** ciffers BL
    (pos4x = 1250), //** unit BR
    (prefix = 4),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "I"),
    (textMid = "="),
    (textPre = "mm"),
    (startValue = 100),
    (minValue = 0.1),
    (maxValue = 9999)
  );

  buttonRollor_ConnectionC = new ButtonRollor(
    (pos1x = 950), //** textPro BR
    (pos1y = 1195), //** textPro BR
    (pos2x = 1000), //** "=" BR
    (pos3x = 1145), //** ciffers BL
    (pos4x = 1155), //** unit BR
    (prefix = 4),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "C"),
    (textMid = "="),
    (textPre = "kN/mm  - Connection Stiffness"),
    (startValue = 100),
    (minValue = 0.1),
    (maxValue = 9999)
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



//***************************************************
//***************************************************
//***************************************************

function draw() {
  let drawStart = millis();
  background(100);

  frameRate(30);
  count++;

  //console.log("****************")
  //console.log("sketch line 470 - log_Cy " + log_Cy + " log_Cz " + log_Cz);
  //console.log(" count " + count+ " *** 1 *** " + nf(elements[1].elementDef,0,1));

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
  paper_0.DisplayPaperCross(2100, 3000); //**Page 1
  paper_1.DisplayPaperCross(2100, 3000); //**Page 2
  //paper_0.DisplayPaperBlank(2100, 3000);
  paper_0.DisplayHeader();
  paper_0.DisplayText();

  //text("count " + count, 100, 900);
  //text("x0: " + nf(millis() - x0, 0, 1), 100, 985);
  //x0 = millis();

  push();
  fill(0);
  circle(mousePosWorld.x, mousePosWorld.y, 5);
  pop();

  //**ButtonTekst
  push();
  textSize(30);
  textAlign(LEFT);
  text("Node", 520, 485);
  text("Node Support - Simple", 520, 535);
  text("Node Support - Fixed", 520, 586);
  text("Node Charnier", 520, 635);
  text("Load Point", 520, 685);
  text("Load Line", 520, 735);
  text("Load Moment", 520, 785);
  text("Add/Delete Graph Values", 520, 845);

  text("CMM - Consistent Mass Matrix", 1020, 485);
  text("LMM - Lumped Mass Matrix", 1020, 535);

  text("Reinforcement beam", 1070, 785);
  if (button_BeamReinforced.state == 1)
    text("Add/Delete connection", 1070, 835);

  pop();

  //**Button
  let AddColor = color(0, 250, 0, 150);
  let DeleteColor = color(250, 0, 0, 150);
  button_AddNode.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_AddSupport.DisplayButton(AddColor, 1);
  if (button_AddSupport.state == 1)
    button_AddSupport.DrawSupport(mousePosWorld, 1); //** Draw support when buttonState = 1
  button_SupportDelete.DisplayButton(DeleteColor, 0);
  button_AddLoadPoint.DisplayButton(AddColor, 1);
  button_NodeDelete.DisplayButton(DeleteColor, 0);
  button_AddLoadLine.DisplayButton(AddColor, 1);
  button_DeleteLoadLine.DisplayButton(DeleteColor, 0);
  button_DeleteLoadPoint.DisplayButton(DeleteColor, 0);
  button_AddCharnier.DisplayButton(AddColor, 1);
  button_DeleteCharnier.DisplayButton(DeleteColor, 0);
  button_AddSupportFixed.DisplayButton(AddColor, 1);
  if (button_AddSupportFixed.state == 1)
    button_AddSupportFixed.DrawSupportFixed(mousePosWorld, 1); //** Draw support when buttonState = 1
  button_DeleteSupportFixed.DisplayButton(DeleteColor, 0);

  button_AddLoadMoment.DisplayButton(AddColor, 1);
  button_DeleteLoadMoment.DisplayButton(DeleteColor, 0);
  button_DisplayValuesAdd.DisplayButton(AddColor, 1);
  button_DisplayValuesDelete.DisplayButton(DeleteColor, 0);

  //**Button - EigenvalueCalculation
  button_MassMAtrixCMM.DisplayButton(AddColor, 1);
  button_MassMAtrixLMM.DisplayButton(AddColor, 1);

  //**Button - Reinforced
  button_BeamReinforced.DisplayButton(AddColor, 1);

  //**Button - Reinforced Bolts
  if (button_BeamReinforced.state == 1) {
    button_DisplayBoltAdd.DisplayButton(AddColor, 1);
    button_DisplayBoltDelete.DisplayButton(DeleteColor, 0);
  }

  //** ButtonRollor that moves
  let adjustScalePos = 0;
  if (button_BeamReinforced.state == 1) adjustScalePos = 75;

  //**ButtonRollor Moment
  push();
  let translatePointMoment = new p5.Vector();
  translatePointMoment.x =
    elements[elements.length - 1].endPos.x + adjustScalePos;
  translatePointMoment.y = graph.insertMoment.y;
  translate(translatePointMoment.x, translatePointMoment.y);

  let graphPosNoScale = new p5.Vector.sub(mousePosWorld, translatePointMoment);
  buttonRollor_scaleMoment.DisplayButonRollor(graphPosNoScale);

  //**ButtonRollor ReadValue
  graph.scaleMoment = buttonRollor_scaleMoment.ReadValue(); //**ScaleMoment
  pop();

  //**ButtonRollor Shear
  push();
  let translatePointShear = new p5.Vector();
  translatePointShear.x =
    elements[elements.length - 1].endPos.x + adjustScalePos;
  translatePointShear.y = graph.insertShear.y;
  translate(translatePointShear.x, translatePointShear.y);

  let graphPosNoScaleShear = new p5.Vector.sub(
    mousePosWorld,
    translatePointShear
  );
  buttonRollor_scaleShear.DisplayButonRollor(graphPosNoScaleShear);

  //**ButtonRollor ReadValue
  graph.scaleShear = buttonRollor_scaleShear.ReadValue(); //**ScaleShear
  pop();

  //**ButtonRollor Def
  push();
  let translatePointDef = new p5.Vector();
  translatePointDef.x = elements[elements.length - 1].endPos.x + adjustScalePos;
  translatePointDef.y = graph.insertDef.y;
  translate(translatePointDef.x, translatePointDef.y);

  let graphPosNoScaleDef = new p5.Vector.sub(mousePosWorld, translatePointDef);
  buttonRollor_scaleDef.DisplayButonRollor(graphPosNoScaleDef);

  //**ButtonRollor ReadValue
  graph.scaleDef = buttonRollor_scaleDef.ReadValue(); //**ScaleDef
  pop();

  //**ButtonRollor that do not move
  buttonRollor_E.DisplayButonRollor(mousePosWorld);
  buttonRollor_E.DisplayUnitsE();
  buttonRollor_I.DisplayButonRollor(mousePosWorld);
  buttonRollor_I.DisplayUnitsI();

  if (button_BeamReinforced.state == 1) {
    buttonRollor_E1.DisplayButonRollor(mousePosWorld);
    buttonRollor_E1.DisplayUnitsE();
    buttonRollor_E1.DisplayColorID();
    buttonRollor_I1.DisplayButonRollor(mousePosWorld);
    buttonRollor_I1.DisplayUnitsI();
    buttonRollor_I1.DisplayColorID();
    buttonRollor_ConnectionC.DisplayButonRollor(mousePosWorld);
    buttonRollor_ConnectionC.DisplayColorID();
  }

  buttonRollor_scaleGeo.DisplayButonRollor(mousePosWorld);
  //graph.scaleGeo = buttonRollor_scaleGeo.ReadValue();

  /*
  for (let i = 0, length = elements.length; i < length; i++) {
    //elements[i].E = buttonRollor_E.ReadValue() * 1000; //** x10^3
    //elements[i].I = buttonRollor_I.ReadValue() * 1000000; //** x10^6
    //elements[i].scaleGeo = buttonRollor_scaleGeo.ReadValue();
    //console.log("sketch ReadValue EI " + elements[i].EI)
  }
*/
  /*
  for (let i = 0, length = elementsReinforced.length; i < length; i++) {
    //elementsReinforced[i].E = buttonRollor_E1.ReadValue() * 1000; //** x10^3
    //elementsReinforced[i].I = buttonRollor_I1.ReadValue() * 1000000; //** x10^6
    //elementsReinforced[i].scaleGeo = buttonRollor_scaleGeo.ReadValue();
  }
  */

  let left = 400;
  let right = 500;
  let top = 450;
  let bottom = 850;

  let left2 = 950;
  let right2 = 1050;
  let top2 = 450;
  let bottom2 = 850;

  push();
  fill(0, 255, 0, 100);
  //rect(left, top, right - left, bottom - top);
  //rect(left2, top2, right2 - left2, bottom2 - top2);
  pop();

  //** TEST
  //**If tested in each loop => stall at some point
  if (left < mousePosWorld.x && mousePosWorld.x < right) {
    if (top < mousePosWorld.y && mousePosWorld.y < bottom) {
      for (let i = 0, length = buttonArray.length; i < length; i++) {
        buttonArray[i].MouseOverlaps(mousePosWorld);
        buttonArray[i].SwitchFunction(mousePosWorld, buttonArrayGroupTree);
        buttonArray[i].SwitchFunction(mousePosWorld, buttonArray);
      }

      for (let i = 0, length = buttonArrayGroupOne.length; i < length; i++) {
        buttonArrayGroupOne[i].MouseOverlaps(mousePosWorld);
        buttonArrayGroupOne[i].SwitchFunction(
          mousePosWorld,
          buttonArrayGroupOne
        );
      }
    }
  }

  if (left2 < mousePosWorld.x && mousePosWorld.x < right2) {
    if (top2 < mousePosWorld.y && mousePosWorld.y < bottom2) {
      for (let i = 0, length = buttonArrayGroupTwo.length; i < length; i++) {
        buttonArrayGroupTwo[i].MouseOverlaps(mousePosWorld);
        buttonArrayGroupTwo[i].SwitchFunction(
          mousePosWorld,
          buttonArrayGroupTwo
        );
      }

      if (button_BeamReinforced.state == 1) {
        for (let i = 0, length = buttonArrayGroupTree.length; i < length; i++) {
          buttonArrayGroupTree[i].MouseOverlaps(mousePosWorld);
          buttonArrayGroupTree[i].SwitchFunction(
            mousePosWorld,
            buttonArrayGroupTree
          );
          buttonArrayGroupTree[i].SwitchFunction(mousePosWorld, buttonArray);
        }
      }
    }
  }
  //text("x1: " + nf(millis() - x1, 0, 1), 100, 1000);
  //x1 = millis();

  //text("x2: " + nf(millis() - x2, 0, 1), 100, 1015);
  //x2 = millis();

  //**TimeStop

  //***************************
  //** changeSystem ** START **
  //***************************

  //**HighLigth when ADD/DELETE
  changeSystem.HighligthChange();
  changeSystem.HighligthLoadPointAdd();
  changeSystem.HighligthCharnierAdd();

  if (button_NodeDelete.state == 1)
    changeSystem.NodeDelete(
      mousePosWorld,
      elements,
      loadPoints,
      loadMoments,
      loadLines,
      supports
    );

  if (button_AddSupport.state == 1 || button_AddLoadPoint.state == 1) {
    //**Nothing
    //** => that element can only change when button are in state -1 (off)
    //** => taht nodes dont move when mouse is pressed when overlaps node
  } else {
    //** Including elementsReinforced
    changeSystem.ElementChangeLength(mousePosWorld, elements);
  }

  changeSystem.DataUpdate(elements);
  changeSystem.BubbleSortLoad(loadPoints);
  changeSystem.BubbleSortLoad(loadMoments);
  changeSystem.NodeAdd(mousePosWorld, elements, loadLines);
  if (button_DeleteLoadLine.state == 1)
    changeSystem.LoadLineDelete(mousePosWorld);
  if (button_DeleteLoadPoint.state == 1)
    changeSystem.LoadPointDelete(mousePosWorld);
  if (button_SupportDelete.state == 1)
    changeSystem.SupportDelete(mousePosWorld, elements, supports);
  if (button_DeleteLoadMoment.state == 1)
    changeSystem.LoadMomentDelete(mousePosWorld);
  changeSystem.ChangeLoadPointPos(mousePosWorld);
  changeSystem.ChangeLoadMomentPos(mousePosWorld);

  changeSystem.DataUpdateReinforced(elementsReinforced); //** Reinforced
  changeSystem.ReinforcementLength(bolts); //** Reinforced

  //** Test if Pan 
  changeSystem.TestPan();

  //** Infinite loop
  changeSystem.FlagMatrixChange();
  console.log("sketch Line 963 - FlagMatrixChange " + flagMatrixChange)

  //console.log("sketch - line 901 - ElementMoment: " +  elementsReinforced[0].elementMoment);

  //**Only activate if mouseIsPressed
  if (mouseIsPressed) {
    for (let i = 0, length = elements.length; i < length; i++) {
      changeSystem.AddSupport(elements[i], supports); //**Add Supports
      changeSystem.LoadPointAdd(elements[i]); //**Add LoadPoint
      changeSystem.LoadMomentAdd(elements[i]); //**Add LoadMoment
      changeSystem.AddLoadLine(mousePosWorld, elements[i]); //**AddLoadLine
      changeSystem.AddCharnier(mousePosWorld, elements[i], elements[i + 1]); //**Add Charnier
      changeSystem.DeleteCharnier(mousePosWorld, elements[i]); //**Delete Charnier
      changeSystem.AddSupportFixed(elements[i], supports); //**Add Supports
      changeSystem.DeleteSupportFixed(mousePosWorld, elements[i], supports); //**Add Supports
    }
  }

  //** Reinforced Add Bolt
  if (button_BeamReinforced.state == 1) {
    //console.log("ksetch line 906 " + bolts.length)
    for (let i = 0; i < bolts.length; i++) {
      bolts[i].Update();
      bolts[i].DisplayBolt();
    }

    if (button_DisplayBoltAdd.state == 1) {
      changeSystem.BoltAdd(mousePosWorld);
    }

    if (button_DisplayBoltDelete.state == 1) {
      changeSystem.BoltDelete(mousePosWorld);
      //console.log(bolts)
    }
  }

  //** Update textPro according to loadcaseNumber
  changeSystem.UpdateButtonRollorText();

  //*************************
  //** changeSystem ** END **
  //*************************

  //************************************************
  //** Tables **************************************
  //************************************************
  tables.DisplaySupport(mousePosWorld);
  tables.OverlapInsertPoint(mousePosWorld);
  tables.MoveTable(mousePosWorld);
  tables.DisplayButtonRollorInTable(mousePosWorld);

  //**calculate/determine number of unknowns
  //**Determine nodeId
  //console.log(" - 4 - sketch");

  calculate.Unknowns(elements);
  //console.log(" - 6 - sketch");

  //**Prepare supportMatrix and loadMatrix
  supportSystem.SupportMatrix(calculate.unknowns);
  loadSystem.LoadMatrix(calculate.unknowns);
  //console.log(" - 7 - sketch");

  //**Redefine element nodes after change
  calculate.Unknowns(elements);

  //**Adjust Supports

  for (let i = 0, length = supports.length; i < length; i++) {
    //** Snaps support to node
    supports[i].AdjustSupport(elements);

    /*
    //** Only used when buttonRollor displayed at graph
    supports[i].OverlapFixPoint();
    supports[i].OverlapFixPoint_Cz();
    
    if (supports[i].supportOverlap) {
      supports[i].DisplayButtonRollor();

      //**Break when one support is activated
      //**So taht no more supports are activated
      break;
    }
    
    
       if (supports[i].supportOverlap_Cz) {
          //console.log(supports[i].supportOverlap_Cz)
      supports[i].DisplayButtonRollor_Cz();

      //**Break when one support is activated
      //**So taht no more supports are activated
      break;
    }
    */
  }

  //**LoadPoints
  for (let i = 0, length = loadPoints.length; i < length; i++) {
    loadPoints[i].AdjustLoadPos(mousePosWorld, elements, loadLines.length);
    loadPoints[i].DisplayButtonRollor(
      mousePosWorld,
      elements,
      loadLines.length
    );
    loadPoints[i].Update();
  }

  //**LoadMoments
  for (let i = 0, length = loadMoments.length; i < length; i++) {
    loadMoments[i].AdjustLoadMomentPos(
      mousePosWorld,
      elements,
      loadLines.length + loadPoints.length
    );
    loadMoments[i].DisplayButtonRollor(
      mousePosWorld,
      elements,
      loadLines.length + loadPoints.length
    );

    loadMoments[i].Update();
  }

  //**LoadLines
  for (let i = 0; i < loadLines.length; i++) {
    //console.log("fixPoint: " + loadLines[i].fixPointRight.y)
    //**Change LoadLines

    //**loadLines follow elementNodes
    loadLines[i].AdjustLoadLines(mousePosWorld, elements); //2
    loadLines[i].DefineLoadLine(mousePosWorld, elements); //3
    loadLines[i].Update(elements); //1
    loadLines[i].DisplayButtonRollor(mousePosWorld, elements);
  }

  //**Add support and loads to matrices
  supportSystem.AddSupport(supports);
  loadSystem.AddLoad(loadPoints);
  loadSystem.AddLoadMoment(loadMoments);
  loadSystem.AddLoadLine(loadLines, elements);

  //**For use in calculate massMatrices (CMM) in Elements
  loadSystem.LoadSumElement(loadLines, elements);
  loadSystem.LoadSumNode(loadPoints);
  //console.log(" - 8 - sketch");


   //**Create stiffnessMatrix_Global
  calculate.CreateMatrices(
    elements,
    supportSystem.supportMatrix,
    loadSystem.loadMatrix
  );

  //text("x3: " + nf(millis() - x3, 0, 1), 100, 1030);
  //x3 = millis();

  // console.log("*** 2 *** " +  nf(elements[1.elementDef,0,1));

  //**MatrixSolve Ax=B
  //console.log("sketch line 1059 stifGlobal.length: " + calculate.stiffnessMatrix_Global[0].length )
  let matrix_A = calculate.stiffnessMatrix_Global;
  let matrix_B = loadSystem.loadMatrix;

  //*** Test why infinite Loop
  /*
  console.log(
  "Sketch Line 1122 - matrix_A.length =", matrix_A.length,
  "matrix_A[0].length =", matrix_A[0].length,
  "matrixSolve.size =", matrixSolve.size
);
*/

  //let t0 = millis();  
  
  matrixSolve.InputData(matrix_A, matrix_B);
  matrixSolve.ForwardElimination();
  matrixSolve.BackwardSubstitution();
 
  matrix_x = matrixSolve.matrix_x;
  
  //************************
  //**EigenValue ** START **
  //************************
  //**Matrix determinant[k-w2M]=0
  //if (false && (button_MassMAtrixLMM.state == 1 || button_MassMAtrixCMM.state == 1)) {
 if (button_MassMAtrixLMM.state == 1 || button_MassMAtrixCMM.state == 1) {
    let matrix_mass = calculate.massMatrix_Global; //**CMM
    if (button_MassMAtrixLMM.state == 1)
      matrix_mass = calculate.lumpedMassMatrix_Global; //**LMM

    matrixEigen.CalcDeterminant(
      calculate.stiffnessMatrixEigen_Global,
      matrix_mass,
      500
    );
    matrixEigen.EigenValue();

    let w = matrixEigen.resultEigenValues[0]; //**first egenfrekvens rad/sek
    let t = (2 * PI) / w; //**sek
    let fe = 1 / t; // 1/sek.

    push();
    textSize(30);
    //if(fe) text("fe = " + nf(fe,0,1),100,200);

    pop();
    //console.log("w: " + w);

    //**Display Matrix
    let posMatrix_stiffness =
      calculate.insertPoint.y +
      matrix_A.length * 30 +
      100 +
      supportSystem.supportMatrix.length * 30 +
      240;

   
    calculate.DisplayMatrix(
      2600,
      posMatrix_stiffness,
      calculate.stiffnessMatrixEigen_Global,
      "Stiffness [K]"
    );
    

    let posMatrix_mass =
      posMatrix_stiffness +
      calculate.stiffnessMatrixEigen_Global.length * 30 +
      100;
    calculate.DisplayMatrix(2600, posMatrix_mass, matrix_mass, "Mass [M]");

    let posDeterminantGraph = posMatrix_mass + matrix_mass.length * 30 + 350;
    matrixEigen.insertEigen = new p5.Vector(2625, posDeterminantGraph);

    push();
    textSize(30);
    //**Teori se Sten Krenk afsnit 4.2.1
    text("( [K] -      [M] ) [x] = [0]", 2500, posMatrix_stiffness - 150);
    text("\u03c9", 2500 + 80, posMatrix_stiffness - 150);
    textSize(20);
    text("2", 2500 + 105, posMatrix_stiffness - 160);
    strokeWeight(3);
    line(2500, posMatrix_stiffness - 140, 2800, posMatrix_stiffness - 140);
    pop();

    matrixEigen.DisplayButtonRollor(mousePosWorld);

    //***************************
    //** Display values *********
    //***************************
    matrixEigen.DisplayInputValues();
  }

  //***********************
  //** EigenValue ** END **
  //***********************

  //**Calculate
  calculate.Result(matrix_x, elements);
  calculate.ResultMoment(matrix_x, elements, loadLines);
  calculate.ResultDefLoad(matrix_x, elements, mousePosWorld); //**storeraph and Values in array
  calculate.DeleteGraphValues();
  calculate.ResultShear(matrix_x, elements);
  calculate.ResultReactions(matrix_x, supports);

  //** Reinforced
  calculate.ResultMomentReinforced(matrix_x, elementsReinforced, loadLines);
  calculate.ResultDefLoadReinforced(
    matrix_x,
    elementsReinforced,
    mousePosWorld
  ); //**storeraph and Values in array
  calculate.ResultConecctions(matrix_x, bolts);
  calculate.ResultConnectionMaxMin(bolts);

  //**Display Matrix ** START
  
  push();
  textSize(30);
  text("[K] [x] = [P]", 2500, 250);
  strokeWeight(3);
  line(2500, 260, 2650, 260);
  pop();

  //console.log("BEFORE DisplayMatrix");
  calculate.DisplayMatrix(2600, 400, matrix_A, "Stiffness [K]");

  //console.log("AFTER DisplayMatrix");

  let posMatrix_support = calculate.insertPoint.y + matrix_A.length * 30 + 100;
  calculate.DisplayMatrix(
    2600,
    posMatrix_support,
    supportSystem.supportMatrix,
    "Support"
  );

  let posMatrix_x = calculate.insertPoint.x + matrix_A[0].length * 100 + 50;
  calculate.DisplayMatrix(posMatrix_x, 400, matrix_x, "Result [x]");
  let posMatrix_B = calculate.insertPoint.x + matrix_x[0].length * 100 + 50;
  calculate.DisplayMatrix(posMatrix_B, 400, matrix_B, "Load [P]");
  
  //**Display Matrix ** END

  graph.DisplaySupports(supports);
  graph.DisplayReactions(supports);
  graph.DisplayMomentSum(elements,elementsReinforced);
  graph.DisplayShearSum(elements,elementsReinforced)
  graph.DisplayMoment(elements, supports, mousePosWorld); //** elementMoment = []
  graph.DisplayShear(elements, supports, mousePosWorld); ////** elementShear = []
  graph.DisplayElementsDef(elements, supports, mousePosWorld);
  graph.DisplayElements(elements, mousePosWorld);
  graph.DisplayLoads(loadPoints, loadLines.length);
  graph.DisplayMesure(elements, supports);
  graph.DisplayLoadLines(loadLines);
  graph.DisplayLoadMoments();
  graph.DisplayCharniers(elements);
  graph.ScaleMesureGeo(
    p5.Vector.sub(buttonRollor_scaleGeo.pos3, new p5.Vector(95, -20))
  );

  //** Reinforced
  graph.DisplayElementsDefReinforced(
    elementsReinforced,
    supports,
    mousePosWorld
  );

  graph.DisplayElementsReinforced(elementsReinforced);
  
  graph.DisplayMomentReinforced(elementsReinforced, supports, mousePosWorld); //** elementMoment = []
  graph.DisplayShearReinforced(elementsReinforced, supports, mousePosWorld);
  graph.DisplayConnections(bolts, mousePosWorld);

  //**Reset solutuion otherwise matrix_x aint adjusted when reduces size
  matrixSolve.matrix_x = [];

  //console.log("Moment: " + graph.moveMomentActive + "  Shear: " + graph.moveShearActive)
  //changeSystem.ElementChangeLength(mousePosWorld,elements);

  //console.log("*** 3 *** " + nf(elements[1].elementDef,0,0));

  //text("x4: " + nf(millis() - x4, 0, 1), 100, 1045);
  //x4 = millis();

  //console.log(tables.countLoggedInsertPoints )
  //pop(); //**ApplyMatrix END

  //** Reset
  //log_Cy = null;
  //log_Cz = null;

  /*
  for (let i = 0, length = supports.length; i < length; i++) {
    if (supports[i].buttonRollor_Cy.overlapCiffer)
      console.log("Sketch Line 1031 - Cy Overlap ciffer: " + i);
  }
  */
//console.log("Sketch draw end - DRAW TIME =", millis() - drawStart, "ms");
} //**Draw

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

  //** Used for pan (se shangeSystem.TestPan())
  flagLoadLine = false;

  //** Used for infiniteLoop (se shangeSystem.FlagMatrixChange())
  flagMatrixChange = false;

  mouseButtonIsClicked = false; //**Global variable
  oneClickSupport = true; //**Global variable
  oneClickSupportDelete = true; //**Global variable
  oneClickLoadPoint = true; //**Global variable
  oneClickLoadPointDelete = true; //**Global variable
  oneClickLoadLine = true; //**Global variable
  oneClickLoadLineDelete = true; //**Global variable
  oneClickLoadMoment = true; //**Global variable
  oneClickNodeDelete = true; //**Global variable

  oneClickLoadMomentDelete = true; //**Global variable
  oneClickCharnier = true; //**Global variable
  oneClickCharnierDelete = true;
  oneClickSupportFixed = true;
  oneClickSupportFixedDelete = true;

  //**Variabel so that graph can move over another graph
  graph.moveMomentActive = false;
  graph.moveShearActive = false;
  graph.moveDefActive = false;
  graph.moveGeoActive = false;
  graph.moveConnectionActive = false;

  graph.moveShearReinforcedActive = false;

  //**Varibel so that graph stick to mousePos
  graph.moveMomentLocked = false;
  graph.moveShearLocked = false;
  graph.moveDefLocked = false;
  graph.moveGeoLocked = false;
  graph.moveConnectionLocked = false;

  graph.moveShearReinforcedLocked = false;

  //**LoadLine
  for (let i = 0; i < loadLines.length; i++) {
    loadLines[i].logStartNode = false;
    loadLines[i].logEndNode = false;
  }

  //**LoadPoints
  for (let i = 0; i < loadPoints.length; i++) {
    loadPoints[i].logNode = false;
  }

  //**Tables
  tables.countLoggedInsertPoints = 0;

  //** Flag pan
  movingObject = false;
}

function mouseWheel(event) {
  let adjustScalePos = 0;
  if (button_BeamReinforced.state == 1) adjustScalePos = 75;

  let translatePointMoment = new p5.Vector();
  translatePointMoment.x =
    elements[elements.length - 1].endPos.x + adjustScalePos;
  translatePointMoment.y = graph.insertMoment.y;
  translate(translatePointMoment.x, translatePointMoment.y);
  let graphPosNoScale = new p5.Vector.sub(mousePosWorld, translatePointMoment);

  let translatePointShear = new p5.Vector();
  translatePointShear.x =
    elements[elements.length - 1].endPos.x + adjustScalePos;
  translatePointShear.y = graph.insertShear.y;
  translate(translatePointShear.x, translatePointShear.y);
  let graphPosNoScaleShear = new p5.Vector.sub(
    mousePosWorld,
    translatePointShear
  );

  let translatePointDef = new p5.Vector();
  translatePointDef.x = elements[elements.length - 1].endPos.x + adjustScalePos;
  translatePointDef.y = graph.insertDef.y;
  translate(translatePointDef.x, translatePointDef.y);
  let graphPosNoScaleDef = new p5.Vector.sub(mousePosWorld, translatePointDef);

  //**Test for mouseWorld Overlaps buttonroller
  let test = false;
  if (
    buttonRollor_scaleMoment.overlapCiffer ||
    buttonRollor_scaleShear.overlapCiffer ||
    buttonRollor_scaleDef.overlapCiffer ||
    buttonRollor_E.overlapCiffer ||
    buttonRollor_I.overlapCiffer ||
    buttonRollor_E1.overlapCiffer ||
    buttonRollor_I1.overlapCiffer ||
    buttonRollor_ConnectionC.overlapCiffer ||
    buttonRollor_scaleGeo.overlapCiffer ||
    matrixEigen.buttonRollor_mass.overlapCiffer //**EigenValue Mass
  )
    test = true;

  //**Supports
  //** Test for overlap
  for (let i = 0; i < supports.length; i++) {
    if (supports[i].buttonRollor_Cy.overlapCiffer) {
      test = true;
      log_Cy = i;
    }
    if (supports[i].buttonRollor_Cz.overlapCiffer) {
      test = true;
      log_Cz = i;
    }
  }

  //**LoadMoments
  for (let i = 0, length = loadMoments.length; i < length; i++) {
    if (loadMoments[i].buttonRollor_loadMoment.overlapCiffer) test = true;
  }

  //**LoadPoints
  for (let i = 0, length = loadPoints.length; i < length; i++) {
    if (loadPoints[i].buttonRollor_loadPoint.overlapCiffer) test = true;
  }

  //**LoadLines
  for (let i = 0, length = loadLines.length; i < length; i++) {
    if (loadLines[i].buttonRollor_loadLine.overlapCiffer) test = true;
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
    let val = 0;

    if (event.deltaY > 0) val = -1;
    if (event.deltaY < 0) val = 1;

    buttonRollor_scaleMoment.ChangeVal(val, graphPosNoScale); //**scaleMoment
    buttonRollor_scaleShear.ChangeVal(val, graphPosNoScaleShear); //**scaleShear
    buttonRollor_scaleDef.ChangeVal(val, graphPosNoScaleDef); //**scaleDef
    buttonRollor_E.ChangeVal(val, mousePosWorld); //**E
    buttonRollor_I.ChangeVal(val, mousePosWorld); //**I
    buttonRollor_E1.ChangeVal(val, mousePosWorld); //**E1
    buttonRollor_I1.ChangeVal(val, mousePosWorld); //**I1
    buttonRollor_ConnectionC.ChangeVal(val, mousePosWorld); //** Conection stffness
    buttonRollor_scaleGeo.ChangeVal(val, mousePosWorld); //**scaleGeo
    matrixEigen.buttonRollor_mass.ChangeVal(val, matrixEigen.graphPosNoScale);
    //console.log(matrixEigen.mass)

    //**LoadPoints
    for (let i = 0, length = loadPoints.length; i < length; i++) {
      loadPoints[i].buttonRollor_loadPoint.ChangeVal(
        val,
        loadPoints[i].graphPosNoScale
      );
    }

    //**LoadMoments
    for (let i = 0, length = loadMoments.length; i < length; i++) {
      loadMoments[i].buttonRollor_loadMoment.ChangeVal(
        val,
        loadMoments[i].graphPosNoScale
      );
    }

    //**LoadLines
    for (let i = 0, length = loadLines.length; i < length; i++) {
      loadLines[i].buttonRollor_loadLine.ChangeVal(
        val,
        loadLines[i].graphPosNoScale
      );
    }

    //**Cy and Cz
    if (log_Cy != null) {
      //console.log("sketch line 1205 - log_Cy **** " + log_Cy);
      supports[log_Cy].buttonRollor_Cy.ChangeVal(
        val,
        supports[log_Cy].graphPosNoScale_Cy
      );
    }

    if (log_Cz != null) {
      //console.log("sketch line 1217 - log_Cz **** " + log_Cz);
      supports[log_Cz].buttonRollor_Cz.ChangeVal(
        val,
        supports[log_Cz].graphPosNoScale_Cz
      );
    }

    log_Cy = null;
    log_Cz = null;

    /*
    for (let i = 0, length = supports.length; i < length; i++) {
   
      if (supports[i].buttonRollor_Cy.overlapCiffer) {
        supports[i].buttonRollor_Cy.ChangeVal(
          val,
          supports[i].graphPosNoScale_Cy
        );
      }
   
      if (supports[i].buttonRollor_Cz.overlapCiffer) {
        supports[i].buttonRollor_Cz.ChangeVal(
          val,
          supports[i].graphPosNoScale_Cz
        );
      }   
    }
    */

    /*
    //**Cy and Cz
    for (let i = 0, length = supports.length; i < length; i++) {
      supports[i].buttonRollor_Cz.ChangeVal(
        val,
        supports[i].graphPosNoScale_Cz
      );
    }*/
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
