//************ TO DO **************
//** Ret A in buttonChoice
//** Dont place bolt in same position
//** calc if mouseIsPressed or in the calcZone
//*********************************

let count = 0;

//** ButtonArray
let buttonArray = [];

//**Time
let timeReal;

//**Graph
let graph;

//**Table
let table;

//** ChangeSystem
let system;

//** Calculation
let calc;

//** Load
let load;

//** BoltGroup
let boltGroup = [];

//** Plate
let plate;

//**Layout
let layoutText;

//** ButtonRollor
let scaleForce = 1 / 100; //** used in calc.Force_F_Mz()
let scaleGeo = 20;
let stepSize = 5; //** mm

//**Limit mouse call to one call;
let mouseButtonIsClicked = false; //** Used with button
let mouseButtonIsReleased = false;
let oneClicLoadDelete = false;
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

  
    //** GitHub setUp - Start 
  let canvas = createCanvas(
    document.getElementById("programvindue").clientWidth,
    document.getElementById("programvindue").clientHeight
  );

  canvas.parent("programvindue");
  //** GitHub setUp - End 
  

  graph = new Graph(500, 1750);
  system = new System();
  calc = new Calculation();
  load = new Load(100, 50);
  table = new Table();
  distEdgeBolt = new DistEdgeBolt();
  layout = new Layout(200, 700);
  plate = new Plate(500, 800);

  //** ButtonChoice BoltSize *** START
  buttonChoiceLibBoltSize = new ButtonChoiceLib(4); //** (startElement)
  buttonChoiceLibBoltSize.arrayLib = [
    ["M8", 36.6, 50.3, 8, 15.0, 5.5],
    ["M10", 58.0, 78.5, 10, 19.6, 7],
    ["M12", 84.3, 113, 12, 21.9, 8],
    ["M14", 115.0, 154, 14, 25.4, 9],
    ["M16", 157.0, 201, 16, 27.7, 10],
    ["M20", 245.0, 314, 20, 34.6, 13],
    ["M22", 303.0, 380, 22, 37.0, 14],
    ["M24", 353.0, 452, 24, 41.6, 15],
    ["M27", 459.0, 573, 27, 47.3, 17],
    ["M30", 561.0, 707, 30, 53.1, 19],
  ]; //** [name, As, A, ø, d_møtrik, hjørnemål e, møtrik højde]

  buttonChoiceBoltSize = new ButtonChoice(
    700,
    995,
    100,
    40,
    30,
    buttonChoiceLibBoltSize.arrayLib
  ); //** posX,posY,w,h,textSize, Lib

  //** ButtonChoice BoltSize *** START
  buttonChoiceLibShearPlane = new ButtonChoiceLib(1); //** (startElement)
  buttonChoiceLibShearPlane.arrayLib = [
    ["Shear through cutted thread", 1],
    ["Shear through rolled thread", 0],
    ["Shear through unthreaded", 2],
  ];
  /*
  buttonChoiceLibShearPlane.arrayLib = [
    ["Snit gennem skåret gevind", 1],
    ["Snit gennem rullet gevind", 0],
    ["Snit gennem skaft", 2],
  ];
  */

  buttonChoiceShearPlane = new ButtonChoice(
    2800,
    795,
    400,
    40,
    30,
    buttonChoiceLibShearPlane.arrayLib
  ); //** posX,posY,w,h,textSize, Lib
  //** ButtonChoice BoltSize *** END

  //** ButtonChoice BoltStrength *** START
  buttonChoiceLibBoltStrength = new ButtonChoiceLib(5); //** (startElement)
  buttonChoiceLibBoltStrength.arrayLib = [
    ["4.6", 400, 240, 0.6, 0.51, 0.6],
    ["4.8", 400, 320, 0.5, 0.425, 0.6],
    ["5.6", 500, 300, 0.6, 0.51, 0.6],
    ["5.8", 500, 400, 0.5, 0.425, 0.6],
    ["6.8", 600, 480, 0.5, 0.425, 0.6],
    ["8.8", 800, 640, 0.6, 0.51, 0.6],
    ["10.9", 1000, 900, 0.5, 0.425, 0.6],
  ]; //** [name, fub, fyb,av_rullet gevind, av_skåret gevind, av_skaft]

  buttonChoiceBoltStrength = new ButtonChoice(
    700,
    1045,
    100,
    40,
    30,
    buttonChoiceLibBoltStrength.arrayLib
  ); //** posX,posY,w,h,textSize, Lib
  //** ButtonChoice BoltStrength *** END

  //** ButtonChoice PlateStrength *** START
  buttonChoiceLibPlateStrength = new ButtonChoiceLib(0); //** (startElement)
  buttonChoiceLibPlateStrength.arrayLib = [
    ["S235", 235, 225, 215, 360],
    ["S275", 275, 265, 255, 410],
    ["S355", 355, 345, 335, 470],
    ["S450", 450, 430, 410, 550],
  ]; //** [name, fy16,fy40,fy63, fu]

  buttonChoicePlateStrength = new ButtonChoice(
    700,
    845,
    100,
    40,
    30,
    buttonChoiceLibPlateStrength.arrayLib
  ); //** posX,posY,w,h,textSize, Lib
  //** ButtonChoice BoltCount *** END

  boltGroup.push(new Bolt(25, 25, 0));
  boltGroup.push(new Bolt(60, 25, 1));
  boltGroup.push(new Bolt(25, 60, 2));
  boltGroup.push(new Bolt(60, 60, 3));

  //** BUTTONROLLOR *******************************
  buttonRollor_Px = new ButtonRollor(
    (pos1x = 450), //** textPro BR
    (pos1y = 545), //** textPro BR
    (pos2x = 535), //** "=" BR
    (pos3x = 695), //** ciffers BL
    (pos4x = 710), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "P"),
    (textMid = "="),
    (textPre = "kN"),
    (startValue = 0),
    (minValue = -999),
    (maxValue = 999)
  );

  buttonRollor_Py = new ButtonRollor(
    (pos1x = 450), //** textPro BR
    (pos1y = 595), //** textPro BR
    (pos2x = 535), //** "=" BR
    (pos3x = 695), //** ciffers BL
    (pos4x = 710), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "P"),
    (textMid = "="),
    (textPre = "kN"),
    (startValue = 50),
    (minValue = -999),
    (maxValue = 999)
  );

  buttonRollor_Mz = new ButtonRollor(
    (pos1x = 450), //** textPro BR
    (pos1y = 645), //** textPro BR
    (pos2x = 535), //** "=" BR
    (pos3x = 695), //** ciffers BL
    (pos4x = 710), //** unit BR
    (prefix = 3),
    (sufix = 1),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "M"),
    (textMid = "="),
    (textPre = "kNm"),
    (startValue = 0),
    (minValue = -999),
    (maxValue = 999)
  );

  /*
  buttonRollor_d = new ButtonRollor(
    (pos1x = 450), //** textPro BR
    (pos1y = 795), //** textPro BR
    (pos2x = 485), //** "=" BR
    (pos3x = 595), //** ciffers BL
    (pos4x = 610), //** unit BR
    (prefix = 2),
    (sufix = 0),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = ""),
    (textMid = ""),
    (textPre = "mm +"),
    (startValue = 16),
    (minValue = 2),
    (maxValue = 40)
  );
  */

  //** Tolerance in hole
  buttonRollor_dt = new ButtonRollor(
    (pos1x = 715), //** textPro BR
    (pos1y = 995), //** textPro BR
    (pos2x = 535), //** "=" BR
    (pos3x = 595 + 175), //** ciffers BL
    (pos4x = 610 + 175), //** unit BR
    (prefix = 1),
    (sufix = 0),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "+"),
    (textMid = ""),
    (textPre = "mm"),
    (startValue = 2),
    (minValue = 0),
    (maxValue = 3)
  );

  buttonRollor_scaleForce = new ButtonRollor(
    (pos1x = 500), //** textPro BR
    (pos1y = 895 + 650), //** textPro BR
    (pos2x = 530), //** "=" BR
    (pos3x = 795), //** ciffers BL
    (pos4x = 810), //** unit BR
    (prefix = 3),
    (sufix = 0),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "ScaleForce"),
    (textMid = ":"),
    (textPre = "kN"),
    (startValue = 50),
    (minValue = 1),
    (maxValue = 900)
  );

  buttonRollor_scaleGeo = new ButtonRollor(
    (pos1x = 500), //** textPro BR
    (pos1y = 945 + 650), //** textPro BR
    (pos2x = 530), //** "=" BR
    (pos3x = 795), //** ciffers BL
    (pos4x = 810), //** unit BR
    (prefix = 3),
    (sufix = 0),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "ScaleGeo"),
    (textMid = ":"),
    (textPre = "mm"),
    (startValue = 20),
    (minValue = 5),
    (maxValue = 500)
  );

  buttonRollor_stepSize = new ButtonRollor(
    (pos1x = 500 + 500), //** textPro BR
    (pos1y = 1495 + 50), //** textPro BR
    (pos2x = 530 + 450), //** "=" BR
    (pos3x = 795 + 450), //** ciffers BL
    (pos4x = 810 + 450), //** unit BR
    (prefix = 3),
    (sufix = 0),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "StepSize"),
    (textMid = ""),
    (textPre = "mm"),
    (startValue = 5),
    (minValue = 1),
    (maxValue = 100)
  );

  //** plate
  buttonRollor_plate_t = new ButtonRollor(
    (pos1x = 450), //** textPro BR
    (pos1y = 795), //** textPro BR
    (pos2x = 740), //** "=" BR
    (pos3x = 695), //** ciffers BL
    (pos4x = 710), //** unit BR
    (prefix = 2),
    (sufix = 0),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = ""),
    (textMid = ""),
    (textPre = "mm"),
    (startValue = 10),
    (minValue = 1),
    (maxValue = 63)
  );

  //** Bolt BoltDist p1
  buttonRollor_p1 = new ButtonRollor(
    (pos1x = 700), //** textPro BR
    (pos1y = 895 + 220), //** textPro BR
    (pos2x = 740), //** "=" BR
    (pos3x = 845), //** ciffers BL
    (pos4x = 860), //** unit BR
    (prefix = 1),
    (sufix = 2),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "p"),
    (textMid = "="),
    (textPre = "d"),
    (startValue = 3.0),
    (minValue = 2.2),
    (maxValue = 3.75)
  );

  //** Bolt BoltDist p2
  buttonRollor_p2 = new ButtonRollor(
    (pos1x = 700), //** textPro BR
    (pos1y = 945 + 220), //** textPro BR
    (pos2x = 740), //** "=" BR
    (pos3x = 845), //** ciffers BL
    (pos4x = 860), //** unit BR
    (prefix = 1),
    (sufix = 2),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "p"),
    (textMid = "="),
    (textPre = "d"),
    (startValue = 3.0),
    (minValue = 2.4),
    (maxValue = 3.0)
  );

  //** Bolt EdgeDist e1
  buttonRollor_e1 = new ButtonRollor(
    (pos1x = 700), //** textPro BR
    (pos1y = 1045 + 220), //** textPro BR
    (pos2x = 740), //** "=" BR
    (pos3x = 845), //** ciffers BL
    (pos4x = 860), //** unit BR
    (prefix = 1),
    (sufix = 2),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "e"),
    (textMid = "="),
    (textPre = "d"),
    (startValue = 3.0),
    (minValue = 1.2),
    (maxValue = 3.0)
  );

  //** Bolt EdgeDist e2
  buttonRollor_e2 = new ButtonRollor(
    (pos1x = 700), //** textPro BR
    (pos1y = 1095 + 220), //** textPro BR
    (pos2x = 740), //** "=" BR
    (pos3x = 845), //** ciffers BL
    (pos4x = 860), //** unit BR
    (prefix = 1),
    (sufix = 2),
    (buttonWidth = 20),
    (buttonHeight = 40),
    (letterSize = 30),
    (textPro = "e"),
    (textMid = "="),
    (textPre = "d"),
    (startValue = 1.5),
    (minValue = 1.2),
    (maxValue = 1.5)
  );

  //** Button Single
  button_NodeAdd = new Button(
    (pos1x = 455),
    (pos1y = 1345 + 50),
    (pos2x = 400),
    (pos3x = 570),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_BoltDelete = new Button(
    (pos1x = 505),
    (pos1y = 1345 + 50),
    (pos2x = 770),
    (pos3x = 870),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_Limit_Bolt = new Button(
    (pos1x = 455),
    (pos1y = 895 + 250),
    (pos2x = 950),
    (pos3x = 1120),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_Limit_Edge = new Button(
    (pos1x = 455),
    (pos1y = 1045 + 250),
    (pos2x = 950),
    (pos3x = 1120),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  buttonArray.push(button_NodeAdd, button_BoltDelete);
}

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
  paper_0.DisplayPaperCross(4200, 3000); //**Page 1
  //paper_1.DisplayPaperCross(2100, 3000); //**Page 2
  //paper_0.DisplayPaperBlank(2100, 3000);
  paper_0.DisplayHeader();
  paper_0.DisplayText();

  //** MousePos
  circle(mousePosWorld.x, mousePosWorld.y, 3);

  //** Layout Text
  layout.DisplayBoltLayout();
  layout.DisplayPlateLayout();

  //** Graph
  graph.DisplayAxis();
  graph.DisplayBoltCoor();
  graph.ScaleMesureGeo();

  //** System
  system.OverlapBolt(mousePosWorld);
  system.MoveBolt(mousePosWorld);
  system.OverlapLoad(mousePosWorld);
  system.MoveLoad(mousePosWorld);
  system.AddBolt(mousePosWorld);
  system.DeleteBolt(mousePosWorld);
  system.TestIfBoltOverlapBolt();
  system.TestIfBoltOverlapEdge();

  //** plate
  plate.Update();
  plate.DrawEdge();
  plate.OverlapEdgePoint(mousePosWorld);
  plate.EdgeAdjust(mousePosWorld);
  plate.FindXY_Max();
  plate.HighligthEdgePoint();

  //** Bolts
  for (let bolt in boltGroup) boltGroup[bolt].Update();
  for (let bolt in boltGroup) boltGroup[bolt].DrawDistBolts(); //** Blue
  for (let bolt in boltGroup) boltGroup[bolt].DrawDistEdges(); //** Red
  for (let bolt in boltGroup) {
    boltGroup[bolt].Display();
    boltGroup[bolt].DisplayForce();
  }

  //console.log(boltGroup[0].pos_o_scaledGraph)

  //** Calc
  calc.Tp();
  calc.IpBoltGroup();
  calc.Display_Tp();
  calc.ForceBoltOne();
  calc.ForcesBolts();
  calc.Load_Tp();
  calc.Display_Fbrd();
  calc.Display_Fvrd();

  //** Load
  load.Update();
  load.Display();
  load.DisplayDistToTp();
  load.LoadText();
  load.LoadSymbolInLp();
  load.DisplayLpCoor();
  load.LoadTextInLp();

  //**ButtonRollor that do not move
  buttonRollor_Px.DisplayButonRollor(mousePosWorld);
  buttonRollor_Py.DisplayButonRollor(mousePosWorld);
  if (boltGroup.length > 1) buttonRollor_Mz.DisplayButonRollor(mousePosWorld);
  //buttonRollor_d.DisplayButonRollor(mousePosWorld);
  buttonRollor_dt.DisplayButonRollor(mousePosWorld);
  buttonRollor_scaleGeo.DisplayButonRollor(mousePosWorld);
  buttonRollor_scaleForce.DisplayButonRollor(mousePosWorld);
  buttonRollor_stepSize.DisplayButonRollor(mousePosWorld);
  buttonRollor_e1.DisplayButonRollor(mousePosWorld);
  buttonRollor_e2.DisplayButonRollor(mousePosWorld);
  if (boltGroup.length > 1) buttonRollor_p1.DisplayButonRollor(mousePosWorld);
  if (boltGroup.length > 1) buttonRollor_p2.DisplayButonRollor(mousePosWorld);
  buttonRollor_plate_t.DisplayButonRollor(mousePosWorld);

  //**ButtonRollor additional text
  distEdgeBolt.TextEdgeDist();
  distEdgeBolt.TextBoltDist();
  distEdgeBolt.TextDistResult();

  //**ButtonRollor ReadValue
  load.Px = buttonRollor_Px.ReadValue() * 1000; //** kN
  load.Py = buttonRollor_Py.ReadValue() * 1000; //** kN
  load.Mz = buttonRollor_Mz.ReadValue() * 1000000; //** kNm

  //**ButtonRollor
  scaleGeo = 100 / buttonRollor_scaleGeo.ReadValue(); //** ScaleGeo
  scaleForce = 1 / (buttonRollor_scaleForce.ReadValue() * 10); //** ScaleForce
  stepSize = (buttonRollor_stepSize.ReadValue() * scaleGeo) / 10; //** StepSize //stepSize = stepSize/(10/scaleGeo)

  //**Button
  let AddColor = color(0, 250, 0, 150);
  let DeleteColor = color(250, 0, 0, 150);
  button_NodeAdd.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_BoltDelete.DisplayButton(DeleteColor, 0); //**1 = AddSign, 0 = DeleteSign
  if (boltGroup.length > 1) button_Limit_Bolt.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_Limit_Edge.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign

  //**ButtonSwitchFunction
  if (mouseIsPressed) {
    //**SwitchGroup
    button_NodeAdd.SwitchFunction(mousePosWorld, buttonArray);
    button_BoltDelete.SwitchFunction(mousePosWorld, buttonArray);
  }

  if (boltGroup.length > 1) button_Limit_Bolt.MouseOverlaps(mousePosWorld);
  button_Limit_Edge.MouseOverlaps(mousePosWorld);

  //** Table
  table.OverlapInsertPoint(mousePosWorld);
  table.DisplayBolt(mousePosWorld);
  table.MoveTable(mousePosWorld);
  table.DisplayBoltInTable(mousePosWorld);

  //** ButtonChoice ** START
  //** BoltSize
  buttonChoiceBoltSize.Display(mousePosWorld, buttonChoiceLibBoltSize);
  buttonChoiceLibBoltSize.Update();

  //** BoltStrength
  buttonChoiceBoltStrength.Display(mousePosWorld, buttonChoiceLibBoltStrength);
  buttonChoiceLibBoltStrength.Update();

  //** PlateStrength
  buttonChoicePlateStrength.Display(
    mousePosWorld,
    buttonChoiceLibPlateStrength
  );
  buttonChoiceLibPlateStrength.Update();

  //** ShearPlane
  buttonChoiceShearPlane.DisplayLeft(mousePosWorld, buttonChoiceLibShearPlane);
  buttonChoiceLibShearPlane.Update();

  //** Display ChangeOptions
  if (buttonChoiceBoltStrength.Overlap(mousePosWorld))
    buttonChoiceBoltStrength.DisplayChange(buttonChoiceLibBoltStrength);
  if (buttonChoiceBoltSize.Overlap(mousePosWorld))
    buttonChoiceBoltSize.DisplayChange(buttonChoiceLibBoltSize);
  if (buttonChoicePlateStrength.Overlap(mousePosWorld))
    buttonChoicePlateStrength.DisplayChange(buttonChoiceLibPlateStrength);
  if (buttonChoiceShearPlane.Overlap(mousePosWorld))
    buttonChoiceShearPlane.DisplayChangeLeft(buttonChoiceLibShearPlane);
  //** ButtonChoice ** END
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
  mouseButtonIsReleased = true; //**Global variable
  mouseButtonIsClicked = false; //**Global variable
  oneTime = true;
  system.logBoltId = null;
  system.logLoad = false;

  plate.edgePointLocked = null;

  oneClickBoltDelete = true; //**Global variable

  //** Table control
  table.insertPointSupportLog = false;
  table.countLoggedInsertPoints = 0;

  //** Flag pan
  movingObject = false;
}

function mouseWheel(event) {
  //**Test for mouseWorld Overlaps buttonroller
  let test = false;

  if (
    buttonRollor_Px.overlapCiffer ||
    buttonRollor_Py.overlapCiffer ||
    buttonRollor_Mz.overlapCiffer ||
    //buttonRollor_d.overlapCiffer ||
    buttonRollor_dt.overlapCiffer ||
    buttonRollor_scaleGeo.overlapCiffer ||
    buttonRollor_scaleForce.overlapCiffer ||
    buttonRollor_stepSize.overlapCiffer ||
    buttonRollor_e1.overlapCiffer ||
    buttonRollor_e2.overlapCiffer ||
    buttonRollor_p1.overlapCiffer ||
    buttonRollor_p2.overlapCiffer ||
    buttonRollor_plate_t.overlapCiffer ||
    buttonChoiceBoltSize.overlap ||
    buttonChoiceBoltStrength.overlap ||
    buttonChoicePlateStrength.overlap ||
    buttonChoiceShearPlane.overlap
  )
    test = true;

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
    let val;

    if (event.deltaY > 0) {
      val = -1;
      //** ButtonChoice
      if (buttonChoiceBoltSize.overlap) buttonChoiceLibBoltSize.elementNumber++;
      if (buttonChoiceBoltStrength.overlap)
        buttonChoiceLibBoltStrength.elementNumber++;
      if (buttonChoicePlateStrength.overlap)
        buttonChoiceLibPlateStrength.elementNumber++;
      if (buttonChoiceShearPlane.overlap)
        buttonChoiceLibShearPlane.elementNumber++;
    }
    if (event.deltaY < 0) {
      val = 1;
      //** ButtonChoice
      if (buttonChoiceBoltSize.overlap) buttonChoiceLibBoltSize.elementNumber--;
      if (buttonChoiceBoltStrength.overlap)
        buttonChoiceLibBoltStrength.elementNumber--;
      if (buttonChoicePlateStrength.overlap)
        buttonChoiceLibPlateStrength.elementNumber--;
      if (buttonChoiceShearPlane.overlap)
        buttonChoiceLibShearPlane.elementNumber--;
    }

    buttonChoiceLibBoltSize.RestrictScroll();
    buttonChoiceLibBoltStrength.RestrictScroll();
    buttonChoiceLibPlateStrength.RestrictScroll();
    buttonChoiceLibShearPlane.RestrictScroll();

    buttonRollor_Px.ChangeVal(val, mousePosWorld); //** Px
    buttonRollor_Py.ChangeVal(val, mousePosWorld); //** Py
    buttonRollor_Mz.ChangeVal(val, mousePosWorld); //** Mz
    //buttonRollor_d.ChangeVal(val, mousePosWorld); //** d
    buttonRollor_dt.ChangeVal(val, mousePosWorld); //** d
    buttonRollor_scaleGeo.ChangeVal(val, mousePosWorld); //** scaleGeo
    buttonRollor_scaleForce.ChangeVal(val, mousePosWorld); //** scaleForce
    buttonRollor_stepSize.ChangeVal(val, mousePosWorld); //** scaleForce
    buttonRollor_e1.ChangeVal(val, mousePosWorld); //** e1
    buttonRollor_e2.ChangeVal(val, mousePosWorld); //** e2
    buttonRollor_p1.ChangeVal(val, mousePosWorld); //** p1
    buttonRollor_p2.ChangeVal(val, mousePosWorld); //** p2
    buttonRollor_plate_t.ChangeVal(val, mousePosWorld); //** plate_t
  }
  //**ZOOM**
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

/*
  //** 12 **
  ConvertToSciNot(number, precision) {
    this.power = Math.round(Math.log10(number));

    this.mantissa = (number * Math.pow(10, Math.abs(this.power))).toFixed(
      precision
    );
    if (number == 0) {
      this.mantissa = 0;
    }
  }
  */
