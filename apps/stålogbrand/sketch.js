let count = 0;

let calc;
let ins; //** Insulation
let steel;
let graph;
let beam;

//** ButtonChoice
let buttonChoiceLibYieldStrength;
let buttonChoiceYieldStrength;

//** Tidsstep
const dt = 30; // sekunder

//**Time
let timeReal;

//**Button
let button_ReductionFactors; //**Object

//**Limit mouse call to one call;
let mouseButtonIsClicked = false;
let mouseButtonIsReleased = true; //** start Released is true
let oneTime = false;

//**Pan and Zoom
let mousePosScreen = new p5.Vector(0, 0);
let mousePosWorld = new p5.Vector(0, 0);
let mousePosWorldPre = new p5.Vector(0, 0);
let scaleFactorStep = 1.1; // [1;xx] 1 = ingen scale, 2 = dobbelt/halvering

let S = new p5.Vector(0.5, 0.5); //**ScaleFactor
let T = new p5.Vector(0, 0);
let T1 = new p5.Vector(0, 0); //**ScaleFactor (svarer til translation tilbage til origo)

let startPan = new p5.Vector(0, 0);

function setup() {
  createCanvas(windowWidth - 10, windowHeight - 10);

  calc = new Calculation(0, 0);
  ins = new Insulation();
  steel = new Steel();
  graph = new Graph(400, 1700);
  beam = new Beam();

  /*
  //** ButtonChoice yieldStrength *** START
  buttonChoiceLibYieldStrength = new ButtonChoiceLib(0); //** (startElement)
  buttonChoiceLibYieldStrength.arrayLib = [
    ["S235", 235, 225, 215],
    ["S275", 275, 265, 255],
    ["S355", 355, 345, 335],
    ["S450", 450, 430, 410],
  ]; //** [name, strength, x]

  buttonChoiceYieldStrength = new ButtonChoice(
    1200,
    695,
    100,
    40,
    30,
    buttonChoiceLibYieldStrength.arrayLib
  ); //** posX,posY,w,h,textSize, Lib
  */

  //console.log(buttonChoiceYieldStrength)

  let xPosAdd = 1405;
  let xPosDelete = 455;
  button_ReductionFactors = new Button(
    (pos1x = xPosAdd),
    (pos1y = 1895),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );
}

function draw() {
  background(100);
  count++;

  //**Display TimePerFrame
  let timePerFrame = millis() - timeReal;
  timeReal = millis();
  text(nf(timePerFrame, 0, 0), 100, 20);
  text(nf(millis(), 0, 0), 100, 32);

  //**StopOfLoop if too long time
  if (timePerFrame > 2000) noLoop();

  mousePosScreen.x = mouseX;
  mousePosScreen.y = mouseY;

  mousePosWorld.x = (mousePosScreen.x - T.x) / S.x;
  mousePosWorld.y = (mousePosScreen.y - T.y) / S.y;

  //*****PAN*****
  if (mouseIsPressed) {
    if (mouseButton === CENTER) {
      startPan.x = mousePosScreen.x;
      startPan.y = mousePosScreen.y;
    }
  }
  //*****PAN*****

  //**PrintOnScreen After This Line => World Coordinates
  //**Applay T1*S*T2*P = P' => (from right to left) 1.translate T2, 2. Scale, 3. translate T1

  //push(); //**ApplyMatrix START
  //*****ZOOM*****
  applyMatrix(1, 0, 0, 1, T1.x, T1.y);
  applyMatrix(S.x, 0, 0, S.y, 0, 0);
  applyMatrix(1, 0, 0, 1, -mousePosWorldPre.x, -mousePosWorldPre.y);
  //*****ZOOM*****

  //**Paper
  paper_0 = new Paper(0, 0);
  paper_1 = new Paper(2200, 0);

  //**Paper
  paper_0.DisplayPaperCross(2100, 3000); //**Page 1
  paper_1.DisplayPaperCross(2100, 3000); //**Page 2
  //paper_0.DisplayPaperBlank(2100, 3000);
  paper_0.DisplayHeader();
  paper_0.DisplayText();

  //*****************************************************************

  push();
  fill(0);
  circle(mousePosWorld.x, mousePosWorld.y, 5);
  pop();

  //** Button
  //**ButtonTekst
  push();
  textSize(30);
  textAlign(LEFT);
  text("Reduction Factors", 1470, 1885);
  pop();

  let AddColor = color(0, 250, 0, 150);
  let DeleteColor = color(250, 0, 0, 150);
  button_ReductionFactors.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign

  button_ReductionFactors.MouseOverlaps(mousePosWorld);

  //console.log(steel.SpecificHeatCapacitySteel(500));
  //console.log(calc.TemperatureGas(60));

  //console.log(calc.Phi(20));
  //console.log(calc.DeltaSteelTemp(360, 33.1));
  graph.DisplayGraphTemp();
  graph.DisplayGraphUtilisation();

  ins.DisplayAndReadButonRollor(mousePosWorld);
  ins.Update();

  steel.DisplayAndReadButonRollor(mousePosWorld);

  calc.SteelInsulatedTemp();
  calc.GasTemp();
  calc.Graph();
  calc.Utilization();
  calc.ReductionFactor_Ky(); //** Tabel 3.1
  calc.ReductionFactor_Kp(); //** Tabel 3.1
  calc.ReductionFactor_KE(); //** Tabel 3.1
  calc.FindTime(0);

  graph.DisplayGraphUtilisationValues();
  graph.DisplayUtilizationOnGraph();
  if (button_ReductionFactors.state == 1) graph.DisplayGraphReductionFactors();

  graph.Result();
  graph.Check();

  //** Beam
  beam.Text();
  beam.Update();
  beam.DisplayAndReadButonRollor(mousePosWorld);

  /*
    //** ButtonChoice
  buttonChoiceYieldStrength.Display(
    mousePosWorld,
    buttonChoiceLibYieldStrength
  );
  buttonChoiceLibYieldStrength.Update();
  */
} //** DRAW END **

function mousePressed() {
  mouseButtonIsReleased = false;
  oneTime = false;
}

function mouseMoved() {}

function mouseReleased() {
  mouseButtonIsReleased = true;
  mouseButtonIsClicked = false; //**Global variable
  oneTime = true;
}

function mouseWheel(event) {
  let testWheel = false;

  //**Test for mouseWorld Overlaps buttonroller
  if (
    ins.buttonRollor_c_p.overlapCiffer ||
    ins.buttonRollor_lambda_p.overlapCiffer ||
    ins.buttonRollor_roh_p.overlapCiffer ||
    ins.buttonRollor_t_p.overlapCiffer ||
    ins.buttonRollor_A_p.overlapCiffer ||
    ins.buttonRollor_V_p.overlapCiffer ||
    steel.buttonRollor_myo.overlapCiffer ||
    beam.buttonRollor_fyk.overlapCiffer ||
    beam.buttonRollor_wpl.overlapCiffer ||
    beam.buttonRollor_M_ALS.overlapCiffer||
    beam.buttonRollor_Tcrit.overlapCiffer
  )
    testWheel = true;

  /*
  //** Test for overlap
  for (let i = 0; i < fourierSystem.array.length; i++) {
    if (fourierSystem.array[i].buttonRollor_alfa.overlapCiffer) {
      testWheel = true;
      log_alfa = i;
    }

    if (fourierSystem.array[i].buttonRollor_theta.overlapCiffer) {
      testWheel = true;
      log_theta = i;
    }
  }
  */

  if (testWheel == false) {
    //**ZOOM**
    T1.x = mouseX;
    T1.y = mouseY;
    mousePosWorldPre = mousePosWorld.copy();

    if (event.deltaY > 0) {
      S.x *= scaleFactorStep;
      S.y *= scaleFactorStep;
      T.x = T1.x - (T1.x - T.x) * scaleFactorStep;
      T.y = T1.y - (T1.y - T.y) * scaleFactorStep;
      //console.log("**** 1 ****");
    }
    if (event.deltaY < 0) {
      S.x /= scaleFactorStep;
      S.y /= scaleFactorStep;
      T.x = T1.x - (T1.x - T.x) / scaleFactorStep;
      T.y = T1.y - (T1.y - T.y) / scaleFactorStep;
      //console.log("**** 2 ****");
    }
    //**ZOOM**
  } else {
    let val = 0;

    if (event.deltaY > 0) val = -1;
    if (event.deltaY < 0) val = 1;

    ins.buttonRollor_c_p.ChangeVal(val, mousePosWorld);
    ins.buttonRollor_lambda_p.ChangeVal(val, mousePosWorld);
    ins.buttonRollor_roh_p.ChangeVal(val, mousePosWorld);
    ins.buttonRollor_t_p.ChangeVal(val, mousePosWorld);
    ins.buttonRollor_A_p.ChangeVal(val, mousePosWorld);
    ins.buttonRollor_V_p.ChangeVal(val, mousePosWorld);

    steel.buttonRollor_myo.ChangeVal(val, mousePosWorld);

    beam.buttonRollor_fyk.ChangeVal(val, mousePosWorld);
    beam.buttonRollor_wpl.ChangeVal(val, mousePosWorld);
    beam.buttonRollor_M_ALS.ChangeVal(val, mousePosWorld);
    beam.buttonRollor_Tcrit.ChangeVal(val, mousePosWorld);

    calc.steelInsTemp = [];
    calc.timeSteel = 0;
    /*
    //** alfa
    if (log_alfa != null) {
      fourierSystem.array[log_alfa].buttonRollor_alfa.ChangeVal(
        val,
        mousePosWorld
        //fourierSystem.array[log_alfa].graphPosNoScale_alfa
      );
    }
    log_alfa = null;

    //** theta
    if (log_theta != null) {
      fourierSystem.array[log_theta].buttonRollor_theta.ChangeVal(
        val,
        mousePosWorld
        //fourierSystem.array[log_alfa].graphPosNoScale_alfa
      );
    }
    log_theta = null;
      */
  }
}

//*****PAN*****
function mouseDragged() {
  if (mouseIsPressed) {
    if (mouseButton === CENTER) {
      T1.x = mouseX;
      T1.y = mouseY;
      mousePosWorldPre = mousePosWorld.copy();

      T.x += (mouseX - startPan.x) * 1;
      T.y += (mouseY - startPan.y) * 1;
    }
  }
}
//*****PAN*****
