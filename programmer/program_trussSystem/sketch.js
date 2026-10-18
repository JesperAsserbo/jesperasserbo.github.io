//** To do
//** Highligt nodes to element --- nodeSystem line 75
//** when move node dont overlap another node
//** Dont make element if already an element ** 1 **
//** 2k + u = s

let calcNeeded = false;

let logNode = false;
let logNodePosInArray = null;

let logTempNode = false;
let logTempNodePosInArray = null;

let supportFixPointLogged = false
let supportNodeLogged = null;
let supportNumberLogged = null;

let oneTime = true;

let buttonArray = [];

//**Limit mouse call to one call;
let mouseButtonIsClicked = false; //** Used with button
let mouseIsReleased = true;

//** startPan
let size = 6;

//** calcNeeded

//** Pan and Zoom ** Start **
let mousePosScreen = new p5.Vector(0, 0);
let mousePosWorld = new p5.Vector(0, 0);
let mousePosWorldPre = new p5.Vector(0, 0);
let scaleFactorStep = 1.1; // [1;xx] 1 = ingen scale, 2 = dobbelt/halvering
let movingObject = false; //** flag used in pan

let S = new p5.Vector(0.5, 0.5); //**ScaleFactor
let T = new p5.Vector(0, 0);
let T1 = new p5.Vector(0, 0); //**ScaleFactor (svarer til translation tilbage til origo)

let startPan = new p5.Vector(0, 0);
//** Pan and Zoom ** End **

let paper;
let changeSystem;
let matrixSolve;

//** Default
let matrix_0;
let matrix_1;

let matrix_A = [];
let matrix_B = [];
let matrix_x = [];

//**StepSize
let stepSize = 10;

//**
let nodeSystem;
let elementSystem;
let supportSystem;

function setup() {
  //createCanvas(windowWidth - 20, windowHeight - 20);
  
  //** GitHub setUp - Start 
  let canvas = createCanvas(
    document.getElementById("programvindue").clientWidth,
    document.getElementById("programvindue").clientHeight
  );

  canvas.parent("programvindue");
  //** GitHub setUp - End 
  
  paper = new Paper();
  changeSystem = new ChangeSystem();
  matrixSolve = new Matrix(); //** MatrixSolve Ax=B;
  nodeSystem = new NodeSystem();
  elementSystem = new ElementSystem();
  supportSystem = new SupportSystem();

  //**Paper
  paper_0 = new Paper(0, 0);
  paper_1 = new Paper(2200, 0);

  //** Default
  let node_0_pos = new p5.Vector(500, 1500);
  let node_1_pos = new p5.Vector(700, 1500);
  let node_2_pos = new p5.Vector(500, 1300);

  let node_0 = new Node(0, node_0_pos);
  let node_1 = new Node(1, node_1_pos);
  let node_2 = new Node(2, node_2_pos);

  //** NodeSystem
  nodeSystem.nodeArray.push(node_0);
  nodeSystem.nodeArray.push(node_1);
  nodeSystem.nodeArray.push(node_2);

  //** NodeSystem Support
  nodeSystem.nodeArray[0].nodeSupportArray.push(new Support(node_0.pos, PI,node_0.ID));
  nodeSystem.nodeArray[0].nodeSupportArray.push(
    new Support(node_0.pos, PI / 2,node_0.ID)
  );
  nodeSystem.nodeArray[1].nodeSupportArray.push(new Support(node_1.pos, PI/2,node_1.ID));

  let element_0 = new Element(
    nodeSystem.nodeArray[0],
    nodeSystem.nodeArray[1],
    10000,
    1000,
    0
  );

  let element_1 = new Element(
    nodeSystem.nodeArray[1],
    nodeSystem.nodeArray[2],
    10000,
    1000,
    0
  );

  let element_2 = new Element(
    nodeSystem.nodeArray[0],
    nodeSystem.nodeArray[2],
    10000,
    1000,
    0
  );

  elementSystem.elementArray.push(element_0);
  elementSystem.elementArray.push(element_1);
  elementSystem.elementArray.push(element_2);

  matrix_0 = elementSystem.elementArray[0].stiffnessMatrix_Local;
  matrix_1 = elementSystem.elementArray[1].stiffnessMatrix_Local;

  let xPosAdd = 405;
  let xPosDelete = 455;

  button_Node_Add = new Button(
    (pos1x = xPosAdd),
    (pos1y = 495),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_Node_Delete = new Button(
    (pos1x = xPosDelete),
    (pos1y = 495),
    (pos2x = 870),
    (pos3x = 970),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_Element_Add = new Button(
    (pos1x = xPosAdd),
    (pos1y = 545),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_Element_Delete = new Button(
    (pos1x = xPosDelete),
    (pos1y = 545),
    (pos2x = 870),
    (pos3x = 970),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_TestLoad = new Button(
    (pos1x = xPosAdd),
    (pos1y = 745),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = 1) //**-1 => OFF, +1 => ON
  );

  button_Support_Add = new Button(
    (pos1x = xPosAdd),
    (pos1y = 595),
    (pos2x = 500),
    (pos3x = 670),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  button_Support_Delete = new Button(
    (pos1x = xPosDelete),
    (pos1y = 595),
    (pos2x = 870),
    (pos3x = 970),
    (textPro = ""),
    (buttonWidth = 40),
    (buttonHeight = 40),
    (state = -1) //**-1 => OFF, +1 => ON
  );

  buttonArray.push(
    button_Node_Add,
    button_Node_Delete,
    button_Element_Add,
    button_Element_Delete,
    button_TestLoad,
    button_Support_Add,
    button_Support_Delete
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
  background(120);
  /*
  console.log(
    "Sketch line 246 ** program running ** calcNeeded ** " + calcNeeded
  );
  console.log("Sketch line 251 - supportFixPointLogged " + supportFixPointLogged)
  */

  mousePosScreen.x = mouseX;
  mousePosScreen.y = mouseY;

  mousePosWorld.x = (mousePosScreen.x - T.x) / S.x;
  mousePosWorld.y = (mousePosScreen.y - T.y) / S.y;

  //changeSystem.MoveInSteps(mousePosWorld)  

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

  //*****PAN*****
  if (mouseIsPressed) {
    if (mouseButton === CENTER) {
      startPan.x = mouseX;
      startPan.y = mouseY;
    }
  }
  //*****PAN*****
  //console.log(nodeSystem.supportNodeOverlap)

  //***** PAN not possible if ******
  if (logNode || logTempNode  || supportFixPointLogged) {
    //** pan not possible
    movingObject = true;
  } else {
    //** can pan
    movingObject = false;
  }

  //****** CALC
  if (
    logNode ||
    logTempNode ||
    button_TestLoad.state == 1 ||
    button_Support_Add.state == 1 ||
    button_Support_Delete.state == 1 ||
    button_Node_Delete.state == 1 ||
    button_Element_Add.state == 1   
  ) {
    calcNeeded = true;
  } else {
    calcNeeded = false;
  }
  //***** CALC ******

  //**Paper
  paper_0.DisplayPaperCross(2100, 3000); //**Page 1
  paper_1.DisplayPaperCross(2100, 3000); //**Page 2
  //paper_0.DisplayPaperBlank(2100, 3000);
  paper_0.DisplayHeader();
  paper_0.DisplayText();

  //**ButtonTekst
  push();
  textSize(30);
  textAlign(LEFT);
  text("Node", 520, 485);
  text("Element", 520, 535);
  text("Support", 520, 585);
  text("TestLoad", 520, 735);
  pop();

  //**Button
  let AddColor = color(0, 250, 0, 150);
  let DeleteColor = color(250, 0, 0, 150);
  button_Node_Add.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_Node_Delete.DisplayButton(DeleteColor, 0);
  button_Element_Add.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_Element_Delete.DisplayButton(DeleteColor, 0);
  button_Support_Add.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign
  button_Support_Delete.DisplayButton(DeleteColor, 0);
  button_TestLoad.DisplayButton(AddColor, 1); //**1 = AddSign, 0 = DeleteSign

  let left = 400;
  let right = 500;
  let top = 450;
  let bottom = 850;

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
        buttonArray[i].SwitchFunction(mousePosWorld, buttonArray);
      }
    }
  }

  //** Default

  //** ElementSystem
  elementSystem.DisplayElement();
  elementSystem.DisplayElementDef();
  elementSystem.DisplayElementColor();
  elementSystem.DisplayElementForceOnGraph();
  elementSystem.DisplayElementID();
 // console.log("SKETCH LINE 372... elementSystem display turned of. NodeSystem.length " + nodeSystem.nodeArray.length )

  //** changeSystem.DeleteTempNodes must be placed before Test for overlap.   
  changeSystem.DeleteTempNode(mousePosWorld);

  //** Test for node Overlap
  if (button_Element_Add.state == -1) {
    nodeSystem.OverlapNodeTest(mousePosWorld);
    nodeSystem.OverlapTempNodeTest(mousePosWorld);
  }

  if (button_Element_Add.state == 1) {
    nodeSystem.OverlapNodeTestForCreateElement(mousePosWorld);
    nodeSystem.OverlapTempNodeTestForCreateElement(mousePosWorld);
  }



  //** Node
  nodeSystem.DisplayNodeID();
  nodeSystem.DisplayTempNode();
  nodeSystem.DisplayNodeDef();
  nodeSystem.DisplayNodeSupport();
  nodeSystem.DisplaySupportReaction();
  

  //** test for overlap (sets nodeSystem.supportNodeOverlap & nodeSystem.supportNumber)
  nodeSystem.OverlapNodeSupportFixpoint(mousePosWorld); 
    //if (nodeSystem.supportNodeOverlap == null) return;
    //if (nodeSystem.supportNumber == null) return;

  //** Adjust System
  changeSystem.AddNode(mousePosWorld);
  if (button_TestLoad.state == -1) changeSystem.MoveNode(mousePosWorld);
  changeSystem.MoveTempNode(mousePosWorld);
  changeSystem.AddElement(mousePosWorld);
  changeSystem.AddSupport(mousePosWorld);
  changeSystem.DeleteSupport(mousePosWorld);
  changeSystem.DeleteNode(mousePosWorld);
  
  changeSystem.DeleteElement(mousePosWorld);
  changeSystem.AdjustSupportAngle(mousePosWorld);
   
  //** Calulation Nedded FLAG
  //** CALC START **
  if (calcNeeded) {
  
    elementSystem.DataUpdate();
    elementSystem.UpdateID();
    elementSystem.UpdateNormalForce();

    //matrix_0 = elementSystem.elementArray[0].stiffnessMatrix_Local;
    //matrix_1 = elementSystem.elementArray[1].stiffnessMatrix_Local;

    //**MatrixSolve Ax=B
    //console.log("sketch line 1059 stifGlobal.length: " + calculate.stiffnessMatrix_Global[0].length )
    matrix_A = matrixSolve.BuildStiffnessMatrixGlobal();

    //** LoadMatrix
    size = matrix_A[0].length;
    matrix_B = matrixSolve.ZeroMatrix(size, 1);
    //matrix_B[4] = [10000];


    //** TestLoad
    if (logNode) {
      //console.log(logNodePosInArray);
      let loadVector = p5.Vector.sub(
        mousePosWorld,
        nodeSystem.nodeArray[logNodePosInArray].pos
      );
      //console.log(loadVector)
      matrix_B[2 * logNodePosInArray] = [loadVector.x * 100];
      matrix_B[2 * logNodePosInArray + 1] = [loadVector.y * 100];

      //matrix_B[3] = [10000];

      let x = nodeSystem.nodeArray[logNodePosInArray].pos.x;
      let y = nodeSystem.nodeArray[logNodePosInArray].pos.y;

      let loadValue = nf(loadVector.mag() / 10, 0, 1);
      let alfa = loadVector.heading();

      if (button_TestLoad.state == 1) {
        push();
        strokeWeight(4);

        line(
          x,
          y,
          x + 1 * loadValue * cos(alfa),
          y + 1 * loadValue * sin(alfa)
        );

        let x_end = x + 1 * loadValue * cos(alfa);
        let y_end = y + 1 * loadValue * sin(alfa);
        translate(x_end, y_end);
        textSize(25);
        text(loadValue + " kN", 20, 10);
        rotate(alfa - PI / 2);
        translate(-x_end, -y_end);
        fill(0)
        triangle(x_end, y_end, x_end - 5, y_end - 10, x_end + 5, y_end -10);
        pop();
      }

      /*
      let x =
        nodeSystem.nodeArray[logNodePosInArray].pos.x +
        nodeSystem.nodeArray[logNodePosInArray].posDef.x;
      let y =
        nodeSystem.nodeArray[logNodePosInArray].pos.y +
        nodeSystem.nodeArray[logNodePosInArray].posDef.y;
        */
      push();

      line(x, y, mousePosWorld.x, mousePosWorld.y);

      // let loadTest = p5.Vector(loadVector.x*100,loadVector.y*100);
      strokeWeight(4);
      //console.log(loadTest.x)
      //line(x,y,loadTest.x,loadTest.y)
      pop();
    } //** CALC END **

    //** LoadMatrix
    //matrix_B[4] = [10000];
    
    //** SupportMatrix
    // matrix_A[0][0] = 1e5;
    // matrix_A[1][1] = 1e5;
    // matrix_A[4][4] = 1e5;
    // matrix_A[3][3] = 1e5;

    matrixSolve.InputData(matrix_A, matrix_B);
    matrixSolve.ForwardElimination();
    matrixSolve.BackwardSubstitution();
    matrix_x = matrixSolve.matrix_x;
 
    //** Def
    nodeSystem.NodeDef(matrix_x);
    nodeSystem.UpdateNodeID(); //** if node deleted
  }

  //matrixSolve.DisplayMatrix(1000, 500, matrix_0, "Local stiffness");
  //matrixSolve.DisplayMatrix(1500, 500, matrix_1, "Local stiffness");

  //** Only displayMatrix if exist
  if (matrix_A.length > 0) {
    matrixSolve.DisplayMatrix(500, 1800, matrix_A, "Global stiffness");

    if (matrix_x.length > 0) {
      matrixSolve.DisplayMatrix(525 + size * 100, 1800, matrix_x, "Result");
    }

    if (matrix_B.length > 0) {
      matrixSolve.DisplayMatrix(650 + size * 100, 1800, matrix_B, "LoadMatrix");
    }
  }

  push();
  fill(0);
  circle(mousePosWorld.x, mousePosWorld.y, 5);
  pop();
}

function mousePressed() {
  //** PAN
  if (mouseButton === LEFT) {
    startPan.x = mouseX;
    startPan.y = mouseY;
  }
  //** PAN

  //oneTime = false;
  mouseIsReleased = false;
}

function mouseReleased() {
  mouseIsReleased = true;
  //** Log
  logNode = false;
  logNodePosInArray = null;

  logTempNode = false;
  logTempNodePosInArray = null;

  mouseButtonIsClicked = false; //**Global variable
  oneTime = true;

  changeSystem.elementTempStarted = false;
  
  supportFixPointLogged = false;
  supportNodeLogged = null;
  supportNumberLogged = null;
  //changeSystem.startNode = null;

  //** Flag pan
  movingObject = false;
}

//*****ZOOM*****
function mouseWheel(event) {
  let oldScale = S.x;

  if (event.deltaY > 0) {
    S.x *= scaleFactorStep;
    S.y *= scaleFactorStep;
  }
  if (event.deltaY < 0) {
    S.x /= scaleFactorStep;
    S.y /= scaleFactorStep;
  }
  // Hold punktet under musen fast
  T.x = mouseX - (mouseX - T.x) * (S.x / oldScale);
  T.y = mouseY - (mouseY - T.y) * (S.y / oldScale);
}
//*****ZOOM*****

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
