//** sketch 1046 =>
//** calc CreateMatriced => this.StiffnessMatrixGlobalReinforcement(elementsReinforced,supportMatrix);

//** Buffer løsning for DisplayMatrix(posX, posY, matrix, name)

class Calculation {
  constructor() {
    this.unknowns = 0;
    //this.matrixSize = 0;
    this.countNodes = 0;
    this.countCommonNodes = 0;
    this.stiffnessMatrix_Global = [];
    this.stiffnessMatrixEigen_Global = [];
    this.massMatrix_Global = [];
    this.lumedMassMatrix_Global = [];
    this.nodeResult = [];
    this.nodeResultDefY = [];
    this.storeGraphValues = [];
    this.storeGraphValuesReinforced = [];

    this.subDivideElement = 10;
    this.insertPoint = new p5.Vector(0, 0);

    //** Connection
    this.bolt_Max;
    this.bolt_min;

    //** For buffervisning af matrix på canvas - se this.DisplayMatrix
    this.matrixBuffer = null;
    this.matrixBufferRows = 0;
    this.matrixBufferCols = 0;
  }

  //** called from sketch
  CreateMatrices(array, supportMatrix, loadMatrix) {
    this.Unknowns(array);
    this.nodeResult = [];

    //**Build StiffnessMatrix
    this.StiffnessMatrixGlobal(array, supportMatrix);

    //** Reinforcement beam start
    if (button_BeamReinforced.state == 1) {
      this.StiffnessMatrixGlobalReinforcement(
        elementsReinforced,
        supportMatrix
      );
    } //** Reinforcement beam end

    this.StiffnessMatrixGlobalEigen(elements, supportMatrix);

    //**Build massMatrix
    this.MassMatrixGlobal(elements, loadPoints); //**LoadPoints added in nodes
    this.LumpedMassMatrixGlobal(elements, loadMatrix); //**LoadLumped in nodes from nodeMatrix
    //console.table(loadMatrix)
  }

  //**Nodes i connected with unknowns/results (in array)
  //**Matrix_x[i][0]
  Result(matrix_x, elements) {
    //**If matrix_x exist
    if (matrix_x) {
      for (let i = 0, length = this.countNodes; i < length; i++) {
        this.nodeResult[i] = [i, 0, matrix_x[i * 2][0], matrix_x[i * 2 + 1][0]];
        this.nodeResultDefY[i] = matrix_x[i * 2][0];
      }
      //console.log(this.nodeResultDefY)

      //** this.nodeResult[i][j] = [node,pos,x1,x2]
      //** pos determined
      for (let i = 0, length = this.countNodes; i < length; i++) {
        for (
          let j = 0, lengthElements = elements.length;
          j < lengthElements;
          j++
        ) {
          if (i == elements[j].startNodeId) {
            this.nodeResult[i][1] = elements[j].startPos;
            break;
          }
          if (i == elements[j].endNodeId) {
            this.nodeResult[i][1] = elements[j].endPos;
            break;
          }
        }
      }

      //**DisplayReult
      //this.ResultDisplay();
    }
  }
  ResultDisplay() {
    for (let i = 0, length = this.countNodes; i < length; i++) {
      circle(
        this.nodeResult[i][1].x,
        this.nodeResult[i][1].y + this.nodeResult[i][2],
        10
      );
    }
  }
  ResultMoment(matrix_x, elements, loadLines) {
    //**If matrix_x exist
    if (matrix_x) {
      for (let i = 0, length = elements.length; i < length; i++) {
        let temp1 = 0;
        let temp2 = 0;
        for (let j = 0; j < 4; j++) {
          //**z1 M1
          temp1 +=
            matrix_x[i * 2 + j][0] * elements[i].matrixMomentStiffStiff_1[j];
          temp2 +=
            matrix_x[i * 2 + j][0] * elements[i].matrixMomentStiffStiff_2[j];
        }

        //**z0 M0
        for (let k = 0; k < loadLines.length; k++) {
          if (i >= loadLines[k].elementStart && i <= loadLines[k].elementEnd) {
            //**No charniers
            if (
              elements[i].charnierLeft == false &&
              elements[i].charnierRight == false
            ) {
              temp1 +=
                (-1 / 12) *
                loadLines[k].PyStart *
                pow(elements[i].elementLength, 2);
              temp2 +=
                (-1 / 12) *
                loadLines[k].PyStart *
                pow(elements[i].elementLength, 2);
            }

            //**if charniersLeft
            if (elements[i].charnierLeft == true) {
              temp1 +=
                0 * loadLines[k].PyStart * pow(elements[i].elementLength, 2);
              temp2 +=
                (-1 / 8) *
                loadLines[k].PyStart *
                pow(elements[i].elementLength, 2);
            }

            /*
            //console.log(elements[i].charnierRight);
            //**if charniersLeft
            if (elements[i].charnierRight == true) {
              temp1 +=
                (-1 / 8) *
                loadLines[k].PyStart *
                pow(elements[i].elementLength, 2);
              temp2 +=
                0 * loadLines[k].PyStart * pow(elements[i].elementLength, 2);
            }
            */
          }
        }

        //console.log("inkl. po i: " + i + " Temp1: " + temp1)
        //console.log("inkl. po i: " + i + " Temp2: " + temp2)

        elements[i].m1 = temp1;
        elements[i].m2 = temp2;

        /*
        if (mouseIsPressed) {
          console.log("i: " + i + " Temp1: " + temp1);
          console.log("i: " + i + " Temp2: " + temp2);
        }
        */
      }
    }
  }

  ResultMomentReinforced(matrix_x, array, loadLines) {
    if (button_BeamReinforced.state == -1) return;
    //**If matrix_x exist
    if (matrix_x) {
      let start = 0;
      let end = array.length;

      //** Reduce matrix_x (to last part of matrix - Reinforced)
      let matrix_x_temp = [];
      arrayCopy(matrix_x, matrix_x_temp); //**arrayCopy(src, dst)
      matrix_x_temp.splice(0, 0.5 * this.unknowns);

      for (let i = 0, length = array.length; i < length; i++) {
        let temp1 = 0;
        let temp2 = 0;
        for (let j = 0; j < 4; j++) {
          //**z1 M1
          temp1 +=
            matrix_x_temp[i * 2 + j][0] * array[i].matrixMomentStiffStiff_1[j];
          temp2 +=
            matrix_x_temp[i * 2 + j][0] * array[i].matrixMomentStiffStiff_2[j];
        }

        array[i].m1 = temp1;
        array[i].m2 = temp2;
      }
    }
    //console.log("calc line 221 m []: " )
  }

  ResultShear(matrix_x, elements) {
    //**If matrix_x exist
    if (matrix_x) {
      for (let i = 0, length = elements.length; i < length; i++) {
        let temp1 = 0;
        let temp2 = 0;
        for (let j = 0; j < 4; j++) {
          //**PointLoad
          temp1 +=
            matrix_x[i * 2 + j][0] * elements[i].matrixShearStiffStiff_1[j];
          temp2 +=
            matrix_x[i * 2 + j][0] * elements[i].matrixShearStiffStiff_2[j];

          //**LineLoad
        }
        elements[i].v1 = temp1;
        elements[i].v2 = temp2;
      }
      //console.log("calculation.ResultShear line 106: " + elements[0].v2)
    }
  }
  ResultReactions(x, supports) {
    for (let i = 0; i < supports.length; i++) {
      supports[i].reaction = supports[i].Cy * x[supports[i].nodeId * 2];
      supports[i].reactionMoment =
        -supports[i].Cz * x[supports[i].nodeId * 2 + 1];
    }
  }
  ResultConecctions(x, array) {
    if (button_BeamReinforced.state == -1) return;
    //**If matrix_x exist
    if (matrix_x) {
      let nodesBeam = this.nodeResult.length;
      for (let i = 0; i < array.length; i++) {
        array[i].force =
          (array[i].C *
            (-x[array[i].nodeId * 2][0] + x[2 * nodesBeam + 2 * i][0])) /
          1000;
        // console.log("calc line 221 ********** matrix_X " + array[i].force );
      }
    }
  }
  ResultConnectionMaxMin(array) {
    if (button_BeamReinforced.state == -1) return;

    this.bolt_max = 0;
    //this.bolt_min = Infinity;

    for (let i = 0; i < array.length; i++) {
      //if(array[i].force < this.bolt_min) this.bolt_min = array[i].force;
      if (abs(array[i].force) > this.bolt_max)
        this.bolt_max = abs(array[i].force);
    }

    //console.log("calc line 252 min: " + this.bolt_min + " max: " + this.bolt_max)
  }

  //**Deformation differential equation when startcondition are known
  //**Store values in
  ResultDefLoad(matrix_x, array, pos) {
    if (matrix_x) {
      let ux;

      let start = 0;
      let end = array.length;

      /*
      if (button_BeamReinforced.state == 1) {
        start = elements.length;
        end = elements.length+array.length-2;
      }*/

      //** Mx = Ax2+Bx+C
      for (let i = start; i < end; i++) {
        let solution = [];

        solution = this.CharnierLeft(array[i], matrix_x);
        //if (elements[i].charnierRight) solution = this.CharnierRight(elements[i], matrix_x);

        let A = solution[0];
        let B = solution[1];
        let C = solution[2];
        let k1 = solution[3];
        let k2 = solution[4];
        //console.log("C: " + C)
        //** Vx = 2Ax+B
        for (let dx = 0; dx <= this.subDivideElement; dx++) {
          let x = (array[i].elementLength / this.subDivideElement) * dx;
          ux =
            (-1 / array[i].EI) *
            ((1 / 12) * A * pow(x, 4) +
              (1 / 6) * B * pow(x, 3) +
              (1 / 2) * C * pow(x, 2) +
              k1 * x +
              k2);

          let Mx = (A * pow(x, 2) + B * x + C) * 1;
          let Vx = 2 * A * x + B;

          //**StoreValues in elementArrays
          x = x / array[i].scaleGeo;
          array[i].elementDef.push(x, ux);
          array[i].elementMoment.push(x, Mx);
          array[i].elementShear.push(x, Vx);
        }

        //**f(x) Start
        if (array[i].startPos.x <= pos.x && pos.x <= array[i].endPos.x) {
          let x = (pos.x - array[i].startPos.x) * array[i].scaleGeo * 10;

          let Mx = (A * pow(x, 2) + B * x + C) * 1;
          let Vx = 2 * A * x + B;
          let ux =
            (-1 / array[i].EI) *
            ((1 / 12) * A * pow(x, 4) +
              (1 / 6) * B * pow(x, 3) +
              (1 / 2) * C * pow(x, 2) +
              k1 * x +
              k2);

          let x_graph = array[i].startPos.x + x / (array[i].scaleGeo * 10);
          let u_graph = graph.insertDef.y + (ux / graph.scaleDef) * 100;
          let M_graph = graph.insertMoment.y + Mx / (1e4 * graph.scaleMoment);
          let V_graph = graph.insertShear.y + Vx / (10 * graph.scaleShear);

          //**DisplayGraphValues (when 300 from elements so that elements can be changed)
          if (
            button_DisplayValuesAdd.state == 1 &&
            pos.y > graph.insertGeo.y + 300
          ) {
            let c = color(0, 0, 0);
            this.DisplayGraphResultValues(
              x_graph,
              M_graph,
              V_graph,
              u_graph,
              c
            );

            //**DisplayGraphStoredValues
            if (this.storeGraphValues.length > 0) {
              this.DisplayGraphStoredResultValues(c);
            }

            //**StoreGraphResultValues
            if (mouseIsPressed && mouseButtonIsClicked == false) {
              this.storeGraphValues.push([x_graph, M_graph, V_graph, u_graph]);
              mouseButtonIsClicked = true;
            }
          }
        } //**f(x) End
      }
    }

    if (button_DisplayValuesAdd.state == 1) {
      for (let i = 0; i < this.storeGraphValues.length; i++) {
        //**UpdateStoredValues in Array
        this.UpdateFx(matrix_x, elements, this.storeGraphValues[i][0], i);

        //**Delete StoredValues point out of last node
        if (
          this.storeGraphValues[i][0] > elements[elements.length - 1].endPos.x
        ) {
          this.storeGraphValues.splice(i, 1);
        }
        if (this.storeGraphValues.length > 0) {
          //**Diisplay StoredValues
          let c = color(0, 0, 0);
          this.DisplayGraphStoredResultValues(c);
        }
      }
    }
  }

  //**Deformation differential equation when startcondition are known
  ResultDefLoadReinforced(matrix_x, array, pos) {
    if (button_BeamReinforced.state == -1) return;

    if (matrix_x) {
      let ux;

      let start = 0;
      let end = array.length;

      //** Reduce matrix_x (to last part of matrix - Reinforced)
      let matrix_x_temp = [];
      arrayCopy(matrix_x, matrix_x_temp); //**arrayCopy(src, dst)
      matrix_x_temp.splice(0, 0.5 * this.unknowns);

      //console.table(matrix_x_temp)

      //console.log("calc line 304 - EI: " + array[0].EI)
      //** Mx = Ax2+Bx+C
      for (let i = start; i < end; i++) {
        let solution = [];
        solution = this.CharnierLeft(array[i], matrix_x_temp);
        //if (elements[i].charnierRight) solution = this.CharnierRight(elements[i], matrix_x);

        //console.log(array[i])
        let A = solution[0];
        let B = solution[1];
        let C = solution[2];
        let k1 = solution[3];
        let k2 = solution[4];

        //console.log("C: " + C)
        //** Vx = 2Ax+B
        for (let dx = 0; dx <= this.subDivideElement; dx++) {
          let x = (array[i].elementLength / this.subDivideElement) * dx;
          ux =
            (-1 / array[i].EI) *
            ((1 / 12) * A * pow(x, 4) +
              (1 / 6) * B * pow(x, 3) +
              (1 / 2) * C * pow(x, 2) +
              k1 * x +
              k2);

          let Mx = (A * pow(x, 2) + B * x + C) * 1;
          let Vx = 2 * A * x + B;

          //**StoreValues in elementArrays
          x = x / array[i].scaleGeo;
          array[i].elementDef.push(x, ux);
          array[i].elementMoment.push(x, Mx);
          array[i].elementShear.push(x, Vx);
        }

        //**f(x) Start
        if (array[i].startPos.x <= pos.x && pos.x <= array[i].endPos.x) {
          let x = (pos.x - array[i].startPos.x) * array[i].scaleGeo * 10;

          let Mx = (A * pow(x, 2) + B * x + C) * 1;
          let Vx = 2 * A * x + B;
          let ux =
            (-1 / array[i].EI) *
            ((1 / 12) * A * pow(x, 4) +
              (1 / 6) * B * pow(x, 3) +
              (1 / 2) * C * pow(x, 2) +
              k1 * x +
              k2);

          let x_graph = array[i].startPos.x + x / (array[i].scaleGeo * 10);
          let u_graph = graph.insertDef.y + (ux / graph.scaleDef) * 100;
          let M_graph = graph.insertMoment.y + Mx / (1e4 * graph.scaleMoment);
          let V_graph =
            graph.insertShearReinforced.y + Vx / (10 * graph.scaleShear);

          //**DisplayGraphValues (when 300 from elements so that elements can be changed)
          if (
            button_DisplayValuesAdd.state == 1 &&
            pos.y > graph.insertGeo.y + 300
          ) {
            let c = color(0, 0, 255);
            this.DisplayGraphResultValuesReinforced(
              x_graph,
              M_graph,
              V_graph,
              u_graph,
              c
            );

            //**DisplayGraphStoredValues
            if (this.storeGraphValuesReinforced.length > 0)
              this.DisplayGraphStoredResultValues(c);

            //**StoreGraphResultValues
            if (mouseIsPressed && mouseButtonIsClicked == false) {
              this.storeGraphValuesReinforced.push([
                x_graph,
                M_graph,
                V_graph,
                u_graph,
              ]);
              mouseButtonIsClicked = true;
            }
          }
        } //**f(x) End
      }
    }

    if (button_DisplayValuesAdd.state == 1) {
      for (let i = 0; i < this.storeGraphValues.length; i++) {
        //**UpdateStoredValues in Array
        this.UpdateFx(matrix_x, array, this.storeGraphValues[i][0], i);

        //**Delete StoredValues point out of last node
        if (this.storeGraphValues[i][0] > array[array.length - 1].endPos.x) {
          this.storeGraphValues.splice(i, 1);
        }
        if (this.storeGraphValues.length > 0) {
          //**Display StoredValues
          let c = color(0, 0, 0);
          this.DisplayGraphStoredResultValues(c);
        }
      }
    }
  }

  DeleteGraphValues() {
    if (button_DisplayValuesDelete.state == 1) {
      this.storeGraphValues = [];
      this.storeGraphValuesReinforced = [];
    }
  }
  //**Overwrite updated Values M(x),V(x),u(x) in Array
  UpdateFx(matrix_x, elements, posX, arrayPos) {
    if (matrix_x) {
      let ux;

      //** Mx = Ax2+Bx+C
      for (let i = 0, length = elements.length; i < length; i++) {
        let solution = [];
        solution = this.CharnierLeft(elements[i], matrix_x);

        let A = solution[0];
        let B = solution[1];
        let C = solution[2];
        let k1 = solution[3];
        let k2 = solution[4];

        //**f(x) Start
        if (elements[i].startPos.x <= posX && posX <= elements[i].endPos.x) {
          let x = (posX - elements[i].startPos.x) * elements[i].scaleGeo * 10;

          let Mx = (A * pow(x, 2) + B * x + C) * 1;
          let Vx = 2 * A * x + B;
          let ux =
            (-1 / elements[i].EI) *
            ((1 / 12) * A * pow(x, 4) +
              (1 / 6) * B * pow(x, 3) +
              (1 / 2) * C * pow(x, 2) +
              k1 * x +
              k2);

          let x_graph =
            elements[i].startPos.x + x / (elements[i].scaleGeo * 10);
          let u_graph = graph.insertDef.y + (ux / graph.scaleDef) * 100;
          let M_graph = graph.insertMoment.y + Mx / (1e4 * graph.scaleMoment);
          let V_graph = graph.insertShear.y + Vx / (10 * graph.scaleShear);

          //**StoreNewValue in Array
          this.storeGraphValues[arrayPos][0] = x_graph;
          this.storeGraphValues[arrayPos][1] = M_graph;
          this.storeGraphValues[arrayPos][2] = V_graph;
          this.storeGraphValues[arrayPos][3] = u_graph;
        } //**f(x) End
      }
    }
  }
  DisplayGraphStoredResultValues(color) {
    for (let i = 0; i < this.storeGraphValues.length; i++) {
      let x_graph = this.storeGraphValues[i][0];
      let M_graph = this.storeGraphValues[i][1];
      let V_graph = this.storeGraphValues[i][2];
      let u_graph = this.storeGraphValues[i][3];
      this.DisplayGraphResultValues(x_graph, M_graph, V_graph, u_graph, color);
    }
    //console.log("*");
  }

  DisplayGraphStoredResultValuesReinforced(color) {
    for (let i = 0; i < this.storeGraphValuesReinforced.length; i++) {
      let x_graph = this.storeGraphValuesReinforced[i][0];
      let M_graph = this.storeGraphValuesReinforced[i][1];
      let V_graph = this.storeGraphValuesReinforced[i][2];
      let u_graph = this.storeGraphValuesReinforced[i][3];
      this.DisplayGraphResultValuesReinforced(
        x_graph,
        M_graph,
        V_graph,
        u_graph,
        color
      );
    }
    //console.log("*");
  }

  //** called from this.ResultDefLoad();
  DisplayGraphResultValues(x_graph, M_graph, V_graph, u_graph, color) {
    //**DrawLine between points
    let maxY = max(M_graph, V_graph, u_graph);
    let minY = min(M_graph, V_graph, u_graph);
    let adjustTextPosM = -25;
    let adjustTextPosV = -25;
    let adjustTextPosU = -25;
    let textHeigth = 24;

    push();
    textAlign(CENTER, BOTTOM);
    textSize(textHeigth);
    noStroke();

    fill(color);

    //**Momnent
    let M_value = nf(
      ((M_graph - graph.insertMoment.y) * graph.scaleMoment) / 100,
      0,
      2
    );

    if (M_graph > graph.insertMoment.y) adjustTextPosM = 25 + textHeigth;
    text(M_value, x_graph, M_graph + adjustTextPosM);

    //**Shear
    let V_value = nf(
      ((V_graph - graph.insertShear.y) * graph.scaleShear) / 100,
      0,
      2
    );
    if (V_graph > graph.insertShear.y) adjustTextPosV = 25 + textHeigth;
    text(V_value, x_graph, V_graph + adjustTextPosV);

    //**Def
    let u_value = nf(
      ((u_graph - graph.insertDef.y) * graph.scaleDef) / 100,
      0,
      2
    );
    if (u_graph > graph.insertDef.y) adjustTextPosU = 25 + textHeigth;
    text(u_value, x_graph, u_graph + adjustTextPosU);

    //line(x_graph, minY, x_graph, maxY);
    fill(0);
    circle(x_graph, M_graph, 5);
    circle(x_graph, V_graph, 5);
    circle(x_graph, u_graph, 5);
    pop();
  }

  //** called from this.ResultDefLoad();
  DisplayGraphResultValuesReinforced(
    x_graph,
    M_graph,
    V_graph,
    u_graph,
    color
  ) {
    //** do not show if x outside reinforced area
    let xStart = bolts[changeSystem.startNodeReinforced].startPos.x;
    let xEnd = bolts[changeSystem.endNodeReinforced].startPos.x;
    if (x_graph < xStart || x_graph > xEnd) return;

    //**DrawLine between points
    let maxY = max(M_graph, V_graph, u_graph);
    let minY = min(M_graph, V_graph, u_graph);
    let adjustTextPosM = 50;
    let adjustTextPosV = 50;
    let adjustTextPosU = 50;
    let textHeigth = 24;

    push();
    textAlign(CENTER, BOTTOM);
    textSize(textHeigth);
    noStroke();

    fill(color);

    //**Momnent
    let M_value = nf(
      ((M_graph - graph.insertMoment.y) * graph.scaleMoment) / 100,
      0,
      2
    );

    if (M_graph > graph.insertMoment.y) adjustTextPosM = -50 + textHeigth;
    text(M_value, x_graph, M_graph + adjustTextPosM);

    //**Shear
    let V_value = nf(
      ((V_graph - graph.insertShearReinforced.y) * graph.scaleShear) / 100,
      0,
      2
    );
    if (V_graph > graph.insertShearReinforced.y)
      adjustTextPosV = -50 + textHeigth;
    text(V_value, x_graph, V_graph + adjustTextPosV);

    //**Def
    let u_value = nf(
      ((u_graph - graph.insertDef.y) * graph.scaleDef) / 100,
      0,
      2
    );
    if (u_graph > graph.insertDef.y) adjustTextPosU = -50 + textHeigth;
    text(u_value, x_graph, u_graph + adjustTextPosU);

    //line(x_graph, minY, x_graph, maxY);
    fill(0);
    circle(x_graph, M_graph, 5);
    circle(x_graph, V_graph, 5);
    circle(x_graph, u_graph, 5);
    pop();
  }

  CharnierLeft(element, matrix) {
    //**Diff. Equ.
    let L = element.elementLength;
    let mo = element.m1; //** calculated in
    let mL = element.m2; //** calculated in

    //console.log("mo: " + mo);
    //console.log("mL: " + mL);

    let uo = matrix[element.id * 2 + 0][0];
    let ao = matrix[element.id * 2 + 1][0];

    let uL = matrix[element.id * 2 + 2][0];
    let aL = matrix[element.id * 2 + 3][0];

    //console.log("uo: " + uo)
    //console.log("uL: " + uL)

    //console.log("ao: " + ao)
    //console.log("aL: " + aL)

    let k1 = 0;
    let k2 = -element.EI * uo;
    let C = mo;

    let A11 = (1 / 12) * pow(L, 4);
    let A12 = (1 / 6) * pow(L, 3);
    let A13 = L;

    let A21 = pow(L, 2);
    let A22 = L;
    let A23 = 0;

    let A31 = (1 / 3) * pow(L, 3);
    let A32 = (1 / 2) * pow(L, 2);
    let A33 = 1;

    let matrix_A = [
      [A11, A12, A13],
      [A21, A22, A23],
      [A31, A32, A33],
    ];

    let B11 = -element.EI * uL - k2 - (1 / 2) * mo * pow(L, 2);
    let B21 = mL - mo;
    let B31 = -element.EI * aL - mo * L;

    let matrix_B = [[B11], [B21], [B31]];

    let matrixSolve = new Matrix(); //** MatrixSolve Ax=B
    matrixSolve.InputData(matrix_A, matrix_B);
    matrixSolve.ForwardElimination();
    let x = matrixSolve.BackwardSubstitution();

    let A = x[0][0];
    let B = x[1][0];
    k1 = x[2][0];

    //console.log(A + " " + B + " " + C + " " + k1 + " " + k2)
    return [A, B, C, k1, k2];
  }

  /*
  CharnierRight(element, matrix_x) {
    //**Diff. Equ.
    let L = element.elementLength;
    let mo = element.m1;
    let mL = element.m2;

    //console.log("mo: " + mo)
    //console.log("mL: " + mL)

    let uo = matrix_x[element.id * 2 + 0][0];
    let ao = matrix_x[element.id * 2 + 1][0];

    let uL = matrix_x[element.id * 2 + 2][0];
    let aL = matrix_x[element.id * 2 + 3][0];

    let k1 = -element.EI * ao;
    let k2 = -element.EI * uo;
    let C = mo;

    let A11 = (1 / 12) * pow(L, 4);
    let A12 = (1 / 6) * pow(L, 3);

    let A21 = (1 / 3) * pow(L, 3);
    let A22 = (1 / 2) * pow(L, 2);

    let matrix_A = [
      [A11, A12],
      [A21, A22],
    ];

    let B11 = -element.EI * uL - (1 / 2) * C * pow(L, 2) - k1 * L - k2;
    let B21 = -element.EI * aL - C * L - k1;

    let matrix_B = [[B11], [B21]];

    let matrixSolve = new Matrix(); //** MatrixSolve Ax=B
    matrixSolve.InputData(matrix_A, matrix_B);
    matrixSolve.ForwardElimination();
    let x = matrixSolve.BackwardSubstitution();

    let A = x[0][0];
    let B = x[1][0];

    //console.log(A + " " + B + " " + C + " " + k1 + " " + k2)
    return [A, B, C, k1, k2];
  }
  */

  //**Determine unknowns (size of stiffnessMatrix_Global)
  Unknowns() {
    //console.log(" - 5.0 - calculation: " + this.unknowns + " ElementsLength: " + elements.length);
    this.unknowns = elements.length * 4;

    this.countCommonNodes = 0;
    this.countNodes = 0;
    //this.nodeArray = [];

    //**Test for fælles knuder => reducere ubekendte (2 stk. pr. fælles knude)
    //**ID on elements in order of location in elementsArray
    for (let i = 0; i < elements.length; i++) {
      elements[i].id = i;
      elements[i].startNodeId = i * 2;
      elements[i].endNodeId = i * 2 + 1;
    }

    //**sort elements by startPos.x
    //**byReferance so no need of variable
    this.BubbleSort(elements);

    //console.log("************************");

    for (let i = 0, length = elements.length; i < length; i++) {
      this.countNodes += 2;

      for (let j = i + 1; j < length; j++) {
        if (elements[i].startPos.x == elements[j].startPos.x) {
          elements[j].startNodeId = elements[i].startNodeId;
          this.countCommonNodes++;
          this.countNodes--;
          // console.log("1: " + elements[i].id);
        }
        if (elements[i].startPos.x == elements[j].endPos.x) {
          elements[j].endNodeId = elements[i].startNodeId;
          this.countCommonNodes++;
          this.countNodes--;
          /*
          console.log(
            "2 element j: " +
              elements[j].id +
              " element j endNode: " +
              elements[j].endNodeId
          );*/
        }
        if (elements[i].endPos.x == elements[j].startPos.x) {
          elements[j].startNodeId = elements[i].endNodeId;
          elements[j].endNodeId = elements[j].startNodeId + 1;
          this.countCommonNodes++;
          this.countNodes--;
          //console.log("3 element j: " + elements[j].id  + " element j startNode: " + elements[j].startNodeId )
        }
        if (elements[i].endPos.x == elements[j].endPos.x) {
          elements[j].endNodeId = elements[i].endNodeId;
          this.countCommonNodes++;
          this.countNodes--;
          //console.log("4 " + elements[i].id);
        }
      }
    }
    //console.log("nodes: " + this.countNodes)
    //console.log("nodesCommon: " + this.countCommonNodes)

    this.unknowns -= 2 * this.countCommonNodes;

    //** BeamReinforced
    //** Size of stifnessMatrix increased by factor 2
    if (button_BeamReinforced.state == 1) this.unknowns = this.unknowns * 2;
    //this.unknowns =elements.length*4
    //this.matrixSize = this.unknowns;

    /*
    for (let i = 0; i < elements.length; i++) {
      text(
        "element startNodeId: " +
          elements[i].startNodeId +
          " element endNodeId: " +
          elements[i].endNodeId,
        20,
        350 + 20 * i
      );
    }*/
    //console.log(this.nodeArray)
    //console.log(this.countCommonNodes);
    //console.log(" - 5.1 - calculation: " + this.unknowns + " ElementsLength: " + elements.length);
  }
  StiffnessMatrixGlobal(elements, supportMatrix) {
    //**Delete Matrix (otherwise size do not reduce when nodes are deleted)
    this.stiffnessMatrix_Global = [];

    //console.log("calculation line 583 - unknowns " + this.unknowns)

    //**Make ZeroMatrix
    //console.log("unknowns: " + this.unknowns)
    for (let row = 0, length = this.unknowns; row < length; row++) {
      this.stiffnessMatrix_Global[row] = [];
      for (let col = 0; col < length; col++) {
        this.stiffnessMatrix_Global[row][col] = 0;
      }
    }
    //console.table(this.stiffnessMatrix_Global)

    let matrixPosition = 0;

    //**Fill Matrix StiffnessMatrix_Local
    for (let i = 0, lengthElements = elements.length; i < lengthElements; i++) {
      //**startNode
      matrixPosition = elements[i].startNodeId * 2;

      this.stiffnessMatrix_Global[matrixPosition][matrixPosition + 0] +=
        elements[i].z11;
      this.stiffnessMatrix_Global[matrixPosition][matrixPosition + 1] +=
        elements[i].z12;
      this.stiffnessMatrix_Global[matrixPosition][matrixPosition + 2] +=
        elements[i].z13;
      this.stiffnessMatrix_Global[matrixPosition][matrixPosition + 3] +=
        elements[i].z14;

      this.stiffnessMatrix_Global[matrixPosition + 1][matrixPosition + 0] +=
        elements[i].z21;
      this.stiffnessMatrix_Global[matrixPosition + 1][matrixPosition + 1] +=
        elements[i].z22;
      this.stiffnessMatrix_Global[matrixPosition + 1][matrixPosition + 2] +=
        elements[i].z23;
      this.stiffnessMatrix_Global[matrixPosition + 1][matrixPosition + 3] +=
        elements[i].z24;

      //**endNode
      matrixPosition = elements[i].endNodeId * 2;
      this.stiffnessMatrix_Global[matrixPosition][matrixPosition + 0 - 2] +=
        elements[i].z31;
      this.stiffnessMatrix_Global[matrixPosition][matrixPosition + 1 - 2] +=
        elements[i].z32;
      this.stiffnessMatrix_Global[matrixPosition][matrixPosition + 2 - 2] +=
        elements[i].z33;
      this.stiffnessMatrix_Global[matrixPosition][matrixPosition + 3 - 2] +=
        elements[i].z34;

      this.stiffnessMatrix_Global[matrixPosition + 1][matrixPosition + 0 - 2] +=
        elements[i].z41;
      this.stiffnessMatrix_Global[matrixPosition + 1][matrixPosition + 1 - 2] +=
        elements[i].z42;
      this.stiffnessMatrix_Global[matrixPosition + 1][matrixPosition + 2 - 2] +=
        elements[i].z43;
      this.stiffnessMatrix_Global[matrixPosition + 1][matrixPosition + 3 - 2] +=
        elements[i].z44;
    }

    //**Fill Matrix Support Stiffness
    for (
      let i = 0, lengthSupports = supportMatrix.length;
      i < lengthSupports;
      i++
    ) {
      //**DiagonalElements
      this.stiffnessMatrix_Global[i][i] += supportMatrix[i][0];
    }
  }
  StiffnessMatrixGlobalReinforcement(elementsReinforced, supportMatrix) {
    if (button_BeamReinforced.state == -1) return;

    let matrixPosition = 0;

    this.CreateAndDisplayElementsReinforced();

    this.AssignStartEndNodeId();

    this.AdjustLengthReinforced();

    //**Fill rest of Matrix StiffnessMatrix_Global
    for (
      let i = 0, lengthElements = elementsReinforced.length;
      i < lengthElements;
      i++
    ) {
      //**startNode
      matrixPosition =
        0.5 * this.unknowns + elementsReinforced[i].startNodeId * 2;
      this.stiffnessMatrix_Global[matrixPosition][matrixPosition + 0] +=
        elementsReinforced[i].z11;
      this.stiffnessMatrix_Global[matrixPosition][matrixPosition + 1] +=
        elementsReinforced[i].z12;
      this.stiffnessMatrix_Global[matrixPosition][matrixPosition + 2] +=
        elementsReinforced[i].z13;
      this.stiffnessMatrix_Global[matrixPosition][matrixPosition + 3] +=
        elementsReinforced[i].z14;

      this.stiffnessMatrix_Global[matrixPosition + 1][matrixPosition + 0] +=
        elementsReinforced[i].z21;
      this.stiffnessMatrix_Global[matrixPosition + 1][matrixPosition + 1] +=
        elementsReinforced[i].z22;
      this.stiffnessMatrix_Global[matrixPosition + 1][matrixPosition + 2] +=
        elementsReinforced[i].z23;
      this.stiffnessMatrix_Global[matrixPosition + 1][matrixPosition + 3] +=
        elementsReinforced[i].z24;

      //**endNode
      matrixPosition =
        0.5 * this.unknowns + elementsReinforced[i].endNodeId * 2;
      this.stiffnessMatrix_Global[matrixPosition][matrixPosition + 0 - 2] +=
        elementsReinforced[i].z31;
      this.stiffnessMatrix_Global[matrixPosition][matrixPosition + 1 - 2] +=
        elementsReinforced[i].z32;
      this.stiffnessMatrix_Global[matrixPosition][matrixPosition + 2 - 2] +=
        elementsReinforced[i].z33;
      this.stiffnessMatrix_Global[matrixPosition][matrixPosition + 3 - 2] +=
        elementsReinforced[i].z34;

      this.stiffnessMatrix_Global[matrixPosition + 1][matrixPosition + 0 - 2] +=
        elementsReinforced[i].z41;
      this.stiffnessMatrix_Global[matrixPosition + 1][matrixPosition + 1 - 2] +=
        elementsReinforced[i].z42;
      this.stiffnessMatrix_Global[matrixPosition + 1][matrixPosition + 2 - 2] +=
        elementsReinforced[i].z43;
      this.stiffnessMatrix_Global[matrixPosition + 1][matrixPosition + 3 - 2] +=
        elementsReinforced[i].z44;

      //** Add bolts
      //** Node Position in StiffnessMatrix
      let nodeStart = 2 * i;
      let nodeEnd = 2 * i + this.unknowns / 2;

      this.stiffnessMatrix_Global[nodeStart][nodeStart] += bolts[i].C; //** Diagonal
      this.stiffnessMatrix_Global[nodeEnd][nodeEnd] += bolts[i].C; //** Diagonal
      this.stiffnessMatrix_Global[nodeStart][nodeEnd] += -bolts[i].C;
      this.stiffnessMatrix_Global[nodeEnd][nodeStart] += -bolts[i].C;
    }

    //** Last node
    let nodeStart = 2 * (elementsReinforced.length - 1);
    let nodeEnd = 2 * (elementsReinforced.length - 1) + this.unknowns / 2;
    let lastBolt = bolts.length - 1;

    this.stiffnessMatrix_Global[nodeStart + 2][nodeStart + 2] +=
      bolts[lastBolt].C; //** Diagonal
    this.stiffnessMatrix_Global[nodeEnd + 2][nodeEnd + 2] += bolts[lastBolt].C; //** Diagonal
    this.stiffnessMatrix_Global[nodeStart + 2][nodeEnd + 2] += -bolts[lastBolt]
      .C;
    this.stiffnessMatrix_Global[nodeEnd + 2][nodeStart + 2] += -bolts[lastBolt]
      .C;

    /*
    //** Node 1
    this.stiffnessMatrix_Global[2][2] += 1e3; //** Diagonal
    this.stiffnessMatrix_Global[8][8] += 1e3; //** Diagonal
    this.stiffnessMatrix_Global[2][8] = -1e3;
    this.stiffnessMatrix_Global[8][2] = -1e3;

    //** Node 2
    this.stiffnessMatrix_Global[4][4] += 1e3; //** Diagonal
    this.stiffnessMatrix_Global[10][10] += 1e3; //** Diagonal
    this.stiffnessMatrix_Global[4][10] = -1e3;
    this.stiffnessMatrix_Global[10][4] = -1e3;
    */

    //** Reinforcement
  }

  //** Reinforced ** START ** called from this.StiffnessMatrixGlobalReinforcement(supportMatrix)
  AssignStartEndNodeId() {
    //** Sort elements
    this.BubbleSort(elementsReinforced);

    for (let i = 0; i < elementsReinforced.length; i++) {
      elementsReinforced[i].id = i;
      elementsReinforced[i].startNodeId = i * 2;
      elementsReinforced[i].endNodeId = i * 2 + 1;
    }

    for (let i = 0, length = elementsReinforced.length; i < length; i++) {
      for (let j = i + 1; j < length; j++) {
        if (
          elementsReinforced[i].startPos.x == elementsReinforced[j].startPos.x
        ) {
          elementsReinforced[j].startNodeId = elementsReinforced[i].startNodeId;

          //console.log("1: " + elementsReinforced[i].id);
        }
        if (
          elementsReinforced[i].startPos.x == elementsReinforced[j].endPos.x
        ) {
          elementsReinforced[j].endNodeId = elementsReinforced[i].startNodeId;

          /*
          console.log(
            "2 element j: " +
              elementsReinforced[j].id +
              " element j endNode: " +
              elementsReinforced[j].endNodeId
          );
          */
        }
        if (
          elementsReinforced[i].endPos.x == elementsReinforced[j].startPos.x
        ) {
          elementsReinforced[j].startNodeId = elementsReinforced[i].endNodeId;
          elementsReinforced[j].endNodeId =
            elementsReinforced[j].startNodeId + 1;

          //console.log("3 element j: " + elementsReinforced[j].id  + " element j startNode: " + elementsReinforced[j].startNodeId )
        }
        if (elementsReinforced[i].endPos.x == elementsReinforced[j].endPos.x) {
          elementsReinforced[j].endNodeId = elementsReinforced[i].endNodeId;

          //console.log("4 " + elements[i].id);
        }
      }
    }
  }
  CreateAndDisplayElementsReinforced() {
    //** Create elementsReinforced
    //** Bolts are altered in changeSystem
    elementsReinforced = [];
    for (let i = 0, lengthElements = elements.length; i < lengthElements; i++) {
      let start_x = elements[i].startPos.x;
      let start_y = elements[i].startPos.y + 50;

      let end_x = elements[i].endPos.x;
      let end_y = elements[i].endPos.y + 50;

      let E = buttonRollor_E1.ReadValue() * 1000; //** x10^3
      let I = buttonRollor_I1.ReadValue() * 1000000; //** x10^6

      elementsReinforced.push(
        new Element(start_x, start_y, end_x, end_y, E, I, (Id = 0))
      );
    }

    /*
    for (let i = 0, lengthElements = elementsReinforced.length; i < lengthElements; i++) {
      elementsReinforced[i].DisplayReinforced();
    }
    */
  }
  AdjustLengthReinforced() {
    for (
      let i = 0, lengthElements = elementsReinforced.length;
      i < lengthElements;
      i++
    ) {
      //** need to adjust pos if update length
      elementsReinforced[i].startPos.x = elements[i].startPos.x;
      elementsReinforced[i].endPos.x = elements[i].endPos.x;
      elementsReinforced[i].DataUpdateReinforced();
      //console.log(elementsReinforced[i].elementLength)
    }
  }
  //** Reinforced ** END

  //***********************
  //**Units [m], [N/m2], [m4]
  StiffnessMatrixGlobalEigen(elements, supportMatrix) {
    //**Delete Matrix (otherwise size do not reduce when nodes are deleted)
    this.stiffnessMatrixEigen_Global = [];

    //**Make ZeroMatrix
    //console.log("unknowns: " + this.unknowns)
    for (let row = 0, length = this.unknowns; row < length; row++) {
      this.stiffnessMatrixEigen_Global[row] = [];
      for (let col = 0; col < length; col++) {
        this.stiffnessMatrixEigen_Global[row][col] = 0;
      }
    }

    let matrixPosition = 0;

    //**Fill Matrix StiffnessMatrix_Local
    for (let i = 0, lengthElements = elements.length; i < lengthElements; i++) {
      //**startNode
      matrixPosition = elements[i].startNodeId * 2;
      this.stiffnessMatrixEigen_Global[matrixPosition][matrixPosition + 0] +=
        elements[i].z11e;
      this.stiffnessMatrixEigen_Global[matrixPosition][matrixPosition + 1] +=
        elements[i].z12e;
      this.stiffnessMatrixEigen_Global[matrixPosition][matrixPosition + 2] +=
        elements[i].z13e;
      this.stiffnessMatrixEigen_Global[matrixPosition][matrixPosition + 3] +=
        elements[i].z14e;

      this.stiffnessMatrixEigen_Global[matrixPosition + 1][
        matrixPosition + 0
      ] += elements[i].z21e;
      this.stiffnessMatrixEigen_Global[matrixPosition + 1][
        matrixPosition + 1
      ] += elements[i].z22e;
      this.stiffnessMatrixEigen_Global[matrixPosition + 1][
        matrixPosition + 2
      ] += elements[i].z23e;
      this.stiffnessMatrixEigen_Global[matrixPosition + 1][
        matrixPosition + 3
      ] += elements[i].z24e;

      //**endNode
      matrixPosition = elements[i].endNodeId * 2;
      this.stiffnessMatrixEigen_Global[matrixPosition][
        matrixPosition + 0 - 2
      ] += elements[i].z31e;
      this.stiffnessMatrixEigen_Global[matrixPosition][
        matrixPosition + 1 - 2
      ] += elements[i].z32e;
      this.stiffnessMatrixEigen_Global[matrixPosition][
        matrixPosition + 2 - 2
      ] += elements[i].z33e;
      this.stiffnessMatrixEigen_Global[matrixPosition][
        matrixPosition + 3 - 2
      ] += elements[i].z34e;

      this.stiffnessMatrixEigen_Global[matrixPosition + 1][
        matrixPosition + 0 - 2
      ] += elements[i].z41e;
      this.stiffnessMatrixEigen_Global[matrixPosition + 1][
        matrixPosition + 1 - 2
      ] += elements[i].z42e;
      this.stiffnessMatrixEigen_Global[matrixPosition + 1][
        matrixPosition + 2 - 2
      ] += elements[i].z43e;
      this.stiffnessMatrixEigen_Global[matrixPosition + 1][
        matrixPosition + 3 - 2
      ] += elements[i].z44e;
    }

    //**Fill Matrix Support Stiffness
    for (
      let i = 0, lengthSupports = supportMatrix.length;
      i < lengthSupports;
      i++
    ) {
      //**DiagonalElements
      if (i == 0 || i % 2 == 0)
        this.stiffnessMatrixEigen_Global[i][i] += supportMatrix[i][0] * 1e3; //**force N/m
      if (i == 1 || i % 2 == 1)
        this.stiffnessMatrixEigen_Global[i][i] += supportMatrix[i][0] * 1e-3; //**moment Nm
    }
  }

  //**MassMatrix CMM
  MassMatrixGlobal(elements, loadPointArray) {
    //**Delete Matrix (otherwise size do not reduce when nodes are deleted)
    this.massMatrix_Global = [];

    //**Make ZeroMatrix
    //console.log("unknowns: " + this.unknowns)
    for (let row = 0, length = this.unknowns; row < length; row++) {
      this.massMatrix_Global[row] = [];
      for (let col = 0; col < length; col++) {
        this.massMatrix_Global[row][col] = 0;
      }
    }

    let matrixPosition = 0;

    //**Fill Matrix massMatrix_Local
    for (let i = 0, lengthElements = elements.length; i < lengthElements; i++) {
      //**startNode
      matrixPosition = elements[i].startNodeId * 2;
      this.massMatrix_Global[matrixPosition][matrixPosition + 0] +=
        elements[i].mass11;
      this.massMatrix_Global[matrixPosition][matrixPosition + 1] +=
        elements[i].mass12;
      this.massMatrix_Global[matrixPosition][matrixPosition + 2] +=
        elements[i].mass13;
      this.massMatrix_Global[matrixPosition][matrixPosition + 3] +=
        elements[i].mass14;

      this.massMatrix_Global[matrixPosition + 1][matrixPosition + 0] +=
        elements[i].mass21;
      this.massMatrix_Global[matrixPosition + 1][matrixPosition + 1] +=
        elements[i].mass22;
      this.massMatrix_Global[matrixPosition + 1][matrixPosition + 2] +=
        elements[i].mass23;
      this.massMatrix_Global[matrixPosition + 1][matrixPosition + 3] +=
        elements[i].mass24;

      //**endNode
      matrixPosition = elements[i].endNodeId * 2;
      this.massMatrix_Global[matrixPosition][matrixPosition + 0 - 2] +=
        elements[i].mass31;
      this.massMatrix_Global[matrixPosition][matrixPosition + 1 - 2] +=
        elements[i].mass32;
      this.massMatrix_Global[matrixPosition][matrixPosition + 2 - 2] +=
        elements[i].mass33;
      this.massMatrix_Global[matrixPosition][matrixPosition + 3 - 2] +=
        elements[i].mass34;

      this.massMatrix_Global[matrixPosition + 1][matrixPosition + 0 - 2] +=
        elements[i].mass41;
      this.massMatrix_Global[matrixPosition + 1][matrixPosition + 1 - 2] +=
        elements[i].mass42;
      this.massMatrix_Global[matrixPosition + 1][matrixPosition + 2 - 2] +=
        elements[i].mass43;
      this.massMatrix_Global[matrixPosition + 1][matrixPosition + 3 - 2] +=
        elements[i].mass44;
    }

    //**Fill Matrix PointLoads in diagonals
    for (
      let i = 0, lengthLoadPoints = loadSystem.loadPointsSum.length;
      i < lengthLoadPoints;
      i++
    ) {
      //**DiagonalElements
      //**DiagonalElements
      this.massMatrix_Global[i * 2][i * 2] += loadSystem.loadPointsSum[i] / 10; //** kg ... 1kN = 100kg
    }
  }

  //*****************************************************************************************
  //*****************************************************************************************

  //**MassMatrix LMM
  LumpedMassMatrixGlobal(elements, loadMatrix) {
    //**Delete Matrix (otherwise size do not reduce when nodes are deleted)
    this.lumpedMassMatrix_Global = [];

    //**Make ZeroMatrix
    //console.log("unknowns: " + this.unknowns)
    for (let row = 0, length = this.unknowns; row < length; row++) {
      this.lumpedMassMatrix_Global[row] = [];
      for (let col = 0; col < length; col++) {
        this.lumpedMassMatrix_Global[row][col] = 0;
      }
    }

    let matrixPosition = 0;

    //**Fill Matrix massMatrix_Local
    for (let i = 0, lengthElements = elements.length; i < lengthElements; i++) {
      //**startNode
      matrixPosition = elements[i].startNodeId * 2;
      this.lumpedMassMatrix_Global[matrixPosition][matrixPosition + 0] +=
        elements[i].lumpedMass11;

      //**endNode
      matrixPosition = elements[i].endNodeId * 2;
      this.lumpedMassMatrix_Global[matrixPosition][matrixPosition + 2 - 2] +=
        elements[i].lumpedMass33;
    }

    //**Fill load Matrix with lumped lineLoads and pointLoads
    for (let i = 0, lengthLoads = loadMatrix.length; i < lengthLoads; i++) {
      //**DiagonalElements
      //**DiagonalElements
      if (i == 0 || i % 2 == 0)
        this.lumpedMassMatrix_Global[i][i] += loadMatrix[i][0] / 10; //**force kg/m
      if (i == 1 || i % 2 == 1) this.lumpedMassMatrix_Global[i][i] += 0; //loadMatrix[i][0]*1e6;//**moment
    }
  }
  //*****************************************************************************************
  //*****************************************************************************************


DisplayMatrixBuffer(posX, posY, matrix, name) {

  let rows = matrix.length;
  let cols = matrix[0].length;

  if (
    this.matrixBuffer === null ||
    this.matrixBufferRows !== rows ||
    this.matrixBufferCols !== cols
  ) {
    this.matrixBuffer = createGraphics(
      cols * 100 + 120,
      rows * 25 + 100
    );

    this.matrixBufferRows = rows;
    this.matrixBufferCols = cols;
  }

  let g = this.matrixBuffer;

  g.clear();

  g.push();

  g.noStroke();
  g.textSize(20);
  g.textAlign(RIGHT);

  // Vigtigt:
  // Her bruger vi samme koordinater som i din oprindelige metode,
  // men med bufferens lokale koordinatsystem.

  for (let row = 0; row < rows; row++) {

    for (let col = 0; col < cols; col++) {

      let value = matrix[row][col];

      if (value != 0) {
        g.text(
          value.toExponential(2),
          100 * (col + 1) - 7.7,
          25 * row
        );
      } else {
        g.text(
          value,
          100 * (col + 1) - 7.5,
          25 * row
        );
      }
    }
  }

  // Header
  g.textAlign(LEFT);
  g.textSize(30);

  g.text(name, 0, -80 + 0);
  g.text("Matrix", 0, -50 + 0);

  // Lines
  g.stroke(0);
  g.strokeWeight(2);

  for (let i = 0; i < 2; i++) {
    g.line(
      i * cols * 100,
      0,
      i * cols * 100,
      25 * (rows - 1) + 10
    );
  }

  g.pop();

  // Bufferens position på det normale canvas
  image(
    this.matrixBuffer,
    posX - 100,
    posY - 80
  );
}

  
  
  DisplayMatrix(posX, posY, matrix, name) {
    //**Display matrix
    push();
    noStroke();
    textSize(20);
    textAlign(RIGHT);
    this.insertPoint = new p5.Vector(posX, posY);
    this.space = 100;

    let rows = matrix.length;
    let cols = matrix[0].length;

    //console.log("DisplayMatrix START, size =", rows);
    for (let row = 0; row < rows; row++) {
      //console.log("Display A row =", row);
      for (let col = 0; col < cols; col++) {
        
        let value = matrix[row][col];
        if (value != 0) {
          text(
            //nfp(matrix[row][col].toExponential(2)),
            matrix[row][col].toExponential(2),
            this.insertPoint.x + this.space * col - 7.7,
            this.insertPoint.y + 25 * row
          );
        } else {
          text(
            value,
            this.insertPoint.x + this.space * col - 7.5,
            this.insertPoint.y + 25 * row
          );
         
        } 
      }
    }
    //console.log("DisplayMatrix END, size =", rows);

    //**HeaderText
    textAlign(LEFT);
    textSize(30);
    text(name, this.insertPoint.x - 100, this.insertPoint.y - 80);
    text("Matrix", this.insertPoint.x - 100, this.insertPoint.y - 50);

    //**Lines
    stroke(0);
    strokeWeight(2);
    for (let i = 0; i < 2; i++) {
      line(
        i * cols * 100 + this.insertPoint.x - 100,
        this.insertPoint.y - 25,
        i * cols * 100 + this.insertPoint.x - 100,
        this.insertPoint.y + 25 * (rows - 1) + 10
      );
    }

    pop();
  }
  

  //**reference by pointer (so no need to return array)
  BubbleSort(array) {
    for (let i = array.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (array[j].startPos.x > array[j + 1].startPos.x) {
          // swap
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
  }
}
