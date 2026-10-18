class Element {
  constructor(node_Start, node_End, E, A, id) {
    this.id = id;
    this.fixPointsDiameter = 20;

    this.E = E;
    this.A = A;
    this.EA = E * A;
    this.N = 0;

    this.stepChange = 5;

    //**ID point
    //this.fixPointWall_ID_pos = new p5.Vector(0, 0);
    //this.fixPointWall_ID_radius = 30;

    this.startNode = node_Start;
    this.endNode = node_End;
    

    //**ElementPos
    this.startPos = new p5.Vector(this.startNode.pos.x, this.startNode.pos.y);
    this.endPos = new p5.Vector(this.endNode.pos.x, this.endNode.pos.y);

    //**ElemenetNodes Id so that position in stiffnessMatrix_Global
    //**determined in class calculation method unknowns().


    //**ElementPosDef
    this.startPosDef = new p5.Vector(0, 0);
    this.endPosDef = new p5.Vector(0, 0);

    this.elementVector = new p5.Vector.sub(this.endPos, this.startPos);
    this.elementVectorUnit = this.elementVector.copy().normalize();
    this.alfa = this.elementVector.heading();
    this.alfa_Degrees = (this.alfa * 180) / PI;

    this.cos = cos(this.alfa);
    this.sin = sin(this.alfa);

    this.elementVectorNormal = this.elementVector.copy().rotate(-PI / 2);
    this.elementVectorNormalUnit = this.elementVectorNormal.copy().normalize();

    this.elementLength = this.elementVector.mag(); //**100pix = 1000mm = 1m

    this.springStiffness = this.EA / this.elementLength;

    this.centerPos = p5.Vector.add(
      this.startPos,
      p5.Vector.mult(this.elementVectorUnit, 0.5 * this.elementLength)
    );

    this.stiffnessMatrix_Local = [];
    this.matrixSize = 4;

    //** Scale used in calculation.ResultDefLoad();
    this.scaleGeo = 1;

    //** Default
    this.stiffnessMatrix_Local = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  DataUpdate() {
    //** Update Pos
    //this.startPos = p5.Vector(this.startNode.pos.x, this.startNode.pos.y);
    //this.endPos = p5.Vector(this.endNode.pos.x, this.endNode.pos.y);
    this.startPos = this.startNode.pos;
    this.endPos = this.endNode.pos;

    //this.elementVector = new p5.Vector.sub(this.endPos, this.startPos);
    this.elementVector = new p5.Vector.sub(
      this.endNode.pos,
      this.startNode.pos
    );
    this.elementVectorUnit = this.elementVector.copy().normalize();
    this.elementLength = this.elementVector.mag() * (this.scaleGeo * 10); //**100pix = 1000mm = 1m
    this.EA = this.E * this.A;
    this.springStiffness = this.EA / this.elementLength;

    this.alfa = this.elementVector.heading();
    this.cos = cos(this.alfa);
    this.sin = sin(this.alfa);

    this.centerPos = p5.Vector.add(
      this.startPos,
      p5.Vector.mult(
        this.elementVectorUnit,
        (0.5 * this.elementLength) / (this.scaleGeo * 10)
      )
    );

    //** Make Local StiffnessMatrix
    this.StiffnessMatrixLocal();

    this.stepChange = 5;
  }
  DisplayElement() {
    push();
    strokeWeight(4);
    stroke(100);
    
    line(this.startPos.x, this.startPos.y, this.endPos.x, this.endPos.y);
    strokeWeight(2);
    circle(this.startPos.x, this.startPos.y, this.fixPointsDiameter);
    circle(this.endPos.x, this.endPos.y, this.fixPointsDiameter);
    pop();
  }
  DisplayElementDef() {
    push();
    strokeWeight(2);

    stroke(100);
    let x_start = this.startPos.x + this.startNode.posDef.x;
    let y_start = this.startPos.y + this.startNode.posDef.y;
    let x_end = this.endPos.x + this.endNode.posDef.x;
    let y_end = this.endPos.y + this.endNode.posDef.y;
   line(x_start, y_start, x_end, y_end);
    circle(x_start, y_start, 4);
  circle(x_end, y_end, 4);
    pop();
  }

  OverlapElement(pos){
        //** Called fron changeSystem.DeleteElement

  
      let distToElementCenter = dist(
        pos.x,
        pos.y,
        this.centerPos.x,
        this.centerPos.y
      );
      if (distToElementCenter < 20) {
        //console.log("element " + this.id )

        
          return this.id;
           
       
      } 
   
  }

    //** called from this.OverlapNodeSupportFixpoint(pos) 
  HighLigthElement(){
    push();
    noStroke();
    fill(255,0,0,100);
    //if(mouseIsPressed) fill(0,255,0,100);
    circle(this.centerPos.x,this.centerPos.y,25);
    
    
    pop();
  }

  DisplayElementID() {
    push();
    textAlign(CENTER, CENTER);
    stroke(0,0,0,100);//noStroke();
    fill(255, 255, 255,150);
    circle(this.centerPos.x, this.centerPos.y, 25);
    fill(0);
    textSize(20);
    text(this.id, this.centerPos.x, this.centerPos.y+1);
    pop();
  }
  StiffnessMatrixLocal() {
    //console.log("element line 115 - calculation performed");
    //**stiffnessMAtrix_Local
    let k = this.springStiffness;
    let c = this.cos;
    let s = this.sin;

    this.z11_11 = k * c * c;
    this.z11_12 = k * s * c;
    this.z11_21 = -k * c * c;
    this.z11_22 = -k * s * c;

    this.z12_11 = this.z11_12;
    this.z12_12 = k * s * s;
    this.z12_21 = -k * s * c;
    this.z12_22 = -k * s * s;

    this.z21_11 = this.z11_21;
    this.z21_12 = this.z12_21;
    this.z21_21 = k * c * c;
    this.z21_22 = k * s * c;

    this.z22_11 = this.z11_22;
    this.z22_12 = this.z12_22;
    this.z22_21 = this.z21_22;
    this.z22_22 = k * s * s;

    this.stiffnessMatrix_Local = [
      [this.z11_11, this.z11_12, this.z11_21, this.z11_22],
      [this.z12_11, this.z12_12, this.z12_21, this.z12_22],
      [this.z21_11, this.z21_12, this.z21_21, this.z21_22],
      [this.z22_11, this.z22_12, this.z22_21, this.z22_22],
    ];

    this.stiffnessMatrix_NodeStart = [
      [this.z11_11, this.z11_12],
      [this.z12_11, this.z12_12],
    ];

    this.stiffnessMatrix_NodeComb = [
      [this.z11_21, this.z11_22],
      [this.z12_21, this.z12_22],
    ];

    this.stiffnessMatrix_NodeEnd = [
      [this.z21_21, this.z21_22],
      [this.z22_21, this.z22_22],
    ];
  }


}
