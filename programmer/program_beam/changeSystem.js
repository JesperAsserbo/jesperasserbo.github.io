class ChangeSystem {
  constructor() {
    this.ElementsAdjustedPos = [];
    //this.saveId;
    //this.overlapCount = 0;
    //this.springSupports

    //** Reinforcement length
    this.startNodeReinforced;
    this.endNodeReinforced;
  }

  TestPan() {
    if (logPointLoadCaseNumber >= 0) movingObject = true; //** Move LoadPoint
    if (logMomentCaseNumber >= 0) movingObject = true; //** Move LoadMoment
    if (flagLoadLine) movingObject = true; //** Move LoadLine
    if (this.saveId >= 0) movingObject = true; //** Move Node
    if(tables.countLoggedInsertPoints > 0) movingObject = true; //** Move Table

    if (
      graph.moveMomentLocked ||
      graph.moveShearLocked ||
      graph.moveDefLocked ||
      graph.moveGeoLocked ||
      graph.moveConnectionLocked ||
      graph.moveShearReinforcedLocked
    )
      movingObject = true; //** Move graph
  }

  FlagMatrixChange(){
    if (this.saveId >= 0) flagMatrixChange = true; //** Move Node
  }

  ReadNode(pos) {
    //** ReadNode
    for (let i = elements.length - 1; i >= 0; i--) {
      if (elements[i].ReadNodeId(pos) != -1) {
        return elements[i].ReadNodeId(pos);
      }
    }
  }

  //** called from sketch
  BoltDelete(pos) {
    let nodeDeletedId;
    let nodeDeletedId_log = -1; //** no node

    for (let i = elements.length - 1; i >= 0; i--) {
      //**boltToRemove
      nodeDeletedId = elements[i].ReadNodeId(pos);

      if (nodeDeletedId != -1) {
        nodeDeletedId_log = nodeDeletedId;

        if (mouseIsPressed) bolts[nodeDeletedId_log].exist = -1;
      }
    }
  }

  //** called from sketch
  //** and called from this.NodeAdd
  BoltAdd(pos) {
    let nodeId;
    let nodeId_log = -1; //** no node

    for (let i = elements.length - 1; i >= 0; i--) {
      //**boltToAdd
      nodeId = elements[i].ReadNodeId(pos);

      if (nodeId != -1) {
        nodeId_log = nodeId;

        if (mouseIsPressed) bolts[nodeId_log].exist = 1;
      }
    }
  }

  //** called from sketch - used in graph.DisplayReinforced //** array => bolts
  ReinforcementLength(array) {
    if (button_BeamReinforced.state == -1) return;

    for (let i = 0; i < array.length; i++) {
      if (array[i].exist == 1) {
        this.startNodeReinforced = i;
        break;
      }
    }

    for (let i = array.length - 1; i >= 0; i--) {
      if (array[i].exist == 1) {
        this.endNodeReinforced = i;
        break;
      }
    }
  }

  DataUpdate(array) {
    for (let i = elements.length - 1; i >= 0; i--) {
      array[i].DataUpdate();
    }

    /*
    for (let i = supports.length - 1; i >= 0; i--) {
      supports[i].DataUpdate();
    }*/
  }

  DataUpdateReinforced(array) {
    if (button_BeamReinforced.state == -1) return;
    for (let i = array.length - 1; i >= 0; i--) {
      array[i].DataUpdateReinforced();
    }

    /*
    for (let i = supports.length - 1; i >= 0; i--) {
      supports[i].DataUpdate();
    }*/
  }

  UpdateButtonRollorText() {
    for (let i = 0; i < loadPoints.length; i++)
      loadPoints[i].buttonRollor_loadPoint.textPro = "Py," + i;
    for (let i = 0; i < loadMoments.length; i++)
      loadMoments[i].buttonRollor_loadMoment.textPro = "My," + i;
    for (let i = 0; i < loadLines.length; i++)
      loadLines[i].buttonRollor_loadLine.textPro = "Py," + i;
  }

  RoundTo5(val) {
    // round(test,0)%10
    // 0.0 ; 2.5 => roound(test,-1) + 0
    // 2.5 ; 5.0 => roound(test,-1) + 5
    // 5.0 ; 7.5 => roound(test,-1) - 5
    // 7.5 ; 0.0 => roound(test,-1) + 0

    let factor = 0;
    let test = round(val, 0) % 10;

    if (2.5 <= test && test < 5.0) factor = 1;
    if (5.0 <= test && test < 7.5) factor = -1;

    let roundVal = round(val, -1) + 5 * factor;

    // console.log(roundVal);
    return roundVal;
  }
  NodeDelete(pos, elements, loads, moments, loadLines, supports) {
    //console.log(" - 2")

    if (button_NodeDelete.state == 1) {
      //** Highligth possible loads in Red if delete
      for (let i = elements.length - 2; i >= 0; i--) {
        push();
        fill(255, 0, 0, 100);
        noStroke();
        circle(elements[i].endPos.x, elements[i].endPos.y, 20);
        pop();
      }

      if (mouseIsPressed && oneClickNodeDelete) {
        //**If Load or support or the delete load
        this.LoadDelete(pos, elements, loads); //** PointLoads
        this.LoadDelete(pos, elements, moments); //** Moments
        this.SupportDelete(pos, elements, supports);

        //**DeleteNode
        let startPosTemp = Infinity;
        let startPosTempY = elements[0].startPos.y;
        let endPosTemp = 0;
        let endPosTempY = elements[0].startPos.y;
        let nodeDeletedId;
        let nodeDeletedId_log = -1; //** no node
        let charnierLeftLog = false;

        let createNewElement = false;
        for (let i = elements.length - 1; i >= 0; i--) {
          //**NodeToRemove
          nodeDeletedId = elements[i].ReadNodeId(pos);
          if (nodeDeletedId != -1) nodeDeletedId_log = nodeDeletedId;

          if (elements[i].Overlap(pos)) {
            //**Store max/min
            if (elements[i].startPos.x < startPosTemp) {
              startPosTemp = elements[i].startPos.x;
            }
            if (elements[i].endPos.x > endPosTemp) {
              endPosTemp = elements[i].endPos.x;
            }

            //**Delete charnier if exist in node
            if (elements[i].OverlapLeftNode(mousePosWorld)) {
              if (elements[i].charnierLeft) elements[i].charnierLeft = false;
            }

            //**If charnier in left node then add charnier after push
            if (elements[i].charnierLeft) {
              charnierLeftLog = true;
            }

            //**Delete element if overlap
            elements.splice(i, 1);
            createNewElement = true;
          }
        }

        //**Delete bolt if node deleted
        if (nodeDeletedId_log != -1 && button_BeamReinforced.state == 1) {
          calculate.CreateAndDisplayElementsReinforced();
          bolts.splice(nodeDeletedId_log, 1);
          this.BubbleSort(bolts);
          for (let i = 0; i < bolts.length; i++) {
            bolts[i].nodeId = i;
          }
        }

        //console.log("elementsLength1: " + elements.length)
        //**New element
        if (createNewElement) {
          elements.push(
            new Element(
              startPosTemp,
              startPosTempY,
              endPosTemp,
              endPosTempY,
              (E = 200000),
              (I = 1000000),
              (Id = 0)
            )
          );

          //**No charnier in beamStart
          if (elements.length > 1)
            elements[elements.length - 1].charnierLeft = charnierLeftLog;

          //**Sort elements
          this.BubbleSort(elements);

          //**LoadLines Adjust when node Deleted
          for (let j = 0, length = loadLines.length; j < length; j++) {
            let tol = elements[0].fixPointsDiameter;

            //**Delete startNode do not effect loadLines
            if (pos.x > elements[0].startPos.x + tol) {
              //** If delete node left of loadLineStart => loadLine nodeIdStart & End -=1
              if (pos.x < loadLines[j].fixPointLeft.x - tol) {
                loadLines[j].nodeIdStart -= 1;
                loadLines[j].nodeIdEnd -= 1;
                //console.log("node < fixPointLeft");
              }

              //** If delete node after loadLineStart => loadLine nodeIdend -=1
              else if (
                pos.x > loadLines[j].fixPointLeft.x + tol &&
                pos.x < loadLines[j].fixPointRight.x - tol
              ) {
                //console.log("fixPointLeft < node < fixPointRigth");
                loadLines[j].nodeIdEnd -= 1;
              }

              //** If delete node == loadLineStart => loadLine nodeIdend -=1
              else if (
                pos.x <= loadLines[j].fixPointLeft.x + tol &&
                pos.x >= loadLines[j].fixPointLeft.x - tol
              ) {
                //console.log("fixPointLeft = node");
                if (loadLines[j].nodeIdStart > 0) {
                  //console.log("fixPointLeft < node");
                  loadLines[j].nodeIdStart -= 1;
                  loadLines[j].nodeIdEnd -= 1;
                }
              }
            }
          }
        }

        //console.log("elementsLength2: " + elements.length);
        oneClickNodeDelete = false;
      }
    }
  }
  LoadPointDelete(pos) {
    //console.log("LoadPointDelete")
    for (let i = loadPoints.length - 1; i >= 0; i--) {
      //** Highligth possible loads in Red if delete
      push();
      fill(255, 0, 0, 100);
      noStroke();
      circle(loadPoints[i].fixPoint.x, loadPoints[i].fixPoint.y, 20);
      pop();
      if (
        mouseIsPressed &&
        loadPoints[i].Overlap(pos) &&
        oneClickLoadPointDelete
      ) {
        //console.log("*" + loadLines[i].loadCaseNumber);
        loadPoints.splice(i, 1);

        oneClickLoadPointDelete = false;
      }
    }
  }
  LoadPointAdd(element) {
    if (
      button_AddLoadPoint.state == 1 &&
      oneClickLoadPoint &&
      element.Overlap(mousePosWorld)
    ) {
      //**Push LoadPoint
      let loadCaseNumber = loadPoints.length;

      loadPoints.push(new LoadPoint(mousePosWorld, loadCaseNumber));
      oneClickLoadPoint = false;
    }
  }
  HighligthLoadPointAdd() {
    if (button_AddLoadPoint.state == 1 || button_AddLoadMoment.state == 1) {
      push();
      for (let i = elements.length - 1; i >= 0; i--) {
        //** Highligth possible loads in Green if Add

        fill(0, 255, 0, 150);
        noStroke();
        circle(elements[i].endPos.x, elements[i].endPos.y, 20);
      }
      circle(elements[0].startPos.x, elements[0].startPos.y, 20);
      pop();
    }
  }
  HighligthCharnierAdd() {
    if (button_AddCharnier.state == 1) {
      push();
      for (let i = elements.length - 2; i >= 0; i--) {
        //** Highligth possible loads in Green if Add

        fill(0, 255, 0, 150);
        noStroke();
        circle(elements[i].endPos.x, elements[i].endPos.y, 20);
      }

      pop();
    }
  }

  //*******************************************
  //*********** Moment ************************
  //*******************************************
  LoadMomentDelete(pos) {
    for (let i = loadMoments.length - 1; i >= 0; i--) {
      //** Highligth possible loads in Red if delete
      push();
      fill(255, 0, 0, 100);
      noStroke();
      circle(loadMoments[i].fixPoint.x, loadMoments[i].fixPoint.y, 20);
      pop();

      //** Delete
      if (
        mouseIsPressed &&
        loadMoments[i].Overlap(pos) &&
        oneClickLoadMomentDelete
      ) {
        loadMoments.splice(i, 1);
        oneClickLoadMomentDelete = false;
      }
    }
  }
  LoadMomentAdd(element) {
    if (
      button_AddLoadMoment.state == 1 &&
      oneClickLoadMoment &&
      element.Overlap(mousePosWorld)
    ) {
      //**Push LoadMoment
      let loadCaseNumber = loadMoments.length;
      loadMoments.push(new LoadMoment(mousePosWorld, loadCaseNumber));
      oneClickLoadMoment = false;
    }
  }
  //*******************************************
  //*********** Moment ************************
  //*******************************************

  AddLoadLine(pos, element) {
    //**Add LoadLine
    if (button_AddLoadLine.state == 1) {
      //** Highligth elements for LoadLinesAdd -> see collision.HighligthElements()
      if (collisionDetect.LinePoint(element.startPos, element.endPos, pos)) {
        if (oneClickLoadLine) {
          //**Push LoadLine
          let loadCaseNumber = loadLines.length;

          loadLines.push(new LoadLine(element, loadCaseNumber));
          oneClickLoadLine = false;
        }
      }
    }
  }
  AddCharnier(pos, element, elementNext) {
    if (button_AddCharnier.state == 1 && oneClickCharnier) {
      let tol = 20;
      //**Not in first or last node
      if (
        mousePosWorld.x > elements[0].startPos.x + tol &&
        mousePosWorld.x < elements[elements.length - 1].endPos.x - tol &&
        element.Overlap(pos)
      ) {
        //element.charnierRight = true;
        elementNext.charnierLeft = true;
        oneClickCharnier = false;
      }
    }
  }
  DeleteCharnier(pos, element) {
    if (
      button_DeleteCharnier.state == 1 &&
      oneClickCharnierDelete &&
      element.OverlapLeftNode(pos)
    ) {
      if (element.charnierLeft) element.charnierLeft = false;
      //console.log("i: " + i + " " + elements[i].charnierLeft)

      oneClickCharnierDelete = false;
    }
  }

  //** Called from Sketch
  ChangeLoadPointPos(pos) {
    for (let i = loadPoints.length - 1; i >= 0; i--) {
      //** Global variable: logPointLoadCaseNumber - set in LoadPoint.MoveLoad();
      //** Reset to undefined when mouseButton is released
      if (loadPoints[i].loadCaseNumber == logPointLoadCaseNumber) {
        //**Push new LoadPoint (loadcaseNumber) when mouseReleased and if moved dist to new node
        //**Delete old LoadPoint
        if (mouseButtonIsReleased) {
          //**Splice(4,1,x) replace 1 element at position 4 with x
          loadPoints.splice(
            logPointLoadCaseNumber,
            1,
            new LoadPoint(mousePosWorld, logPointLoadCaseNumber)
          );

          let temp = Infinity;
          let nodeId;
          let pos;

          for (let i = 0; i < elements.length; i++) {
            let distToStart = dist(
              elements[i].startPos.x,
              loadPoints[logPointLoadCaseNumber].posLoadPoint.y,
              loadPoints[logPointLoadCaseNumber].posLoadPoint.x,
              loadPoints[logPointLoadCaseNumber].posLoadPoint.y
            );
            if (distToStart < temp) {
              temp = distToStart;
              nodeId = elements[i].startNodeId;
              pos = elements[i].startPos;
            }
          }

          //**Check endPoint of last element
          let distToEnd = dist(
            elements[elements.length - 1].endPos.x,
            loadPoints[logPointLoadCaseNumber].posLoadPoint.y,
            loadPoints[logPointLoadCaseNumber].posLoadPoint.x,
            loadPoints[logPointLoadCaseNumber].posLoadPoint.y
          );

          if (distToEnd < temp) {
            temp = distToEnd;
            nodeId = elements[elements.length - 1].endNodeId;
            pos = elements[elements.length - 1].endPos;
          }

          //**Assign new values
          loadPoints[logPointLoadCaseNumber].nodeId = nodeId;
          loadPoints[logPointLoadCaseNumber].posLoadPoint = pos;

          //**Determine nodeId and pos

          //** set to undefined
          logPointLoadCaseNumber = undefined;
        }
      }
      //let temp = logPointLoadCaseNumber
    }
  }
  ChangeLoadMomentPos(pos) {
    for (let i = loadMoments.length - 1; i >= 0; i--) {
      //** Global variable: logPointLoadCaseNumber - set in LoadMoment.MoveLoad();
      //** Reset to undefined when mouseButton is released
      if (loadMoments[i].loadCaseNumber == logMomentCaseNumber) {
        //**Push new LoadPoint (loadcaseNumber) when mouseReleased and if moved dist to new node
        //**Delete old LoadPoint
        if (mouseButtonIsReleased) {
          //**Splice(4,1,x) replace 1 element at position 4 with x
          loadMoments.splice(
            logMomentCaseNumber,
            1,
            new LoadMoment(mousePosWorld, logMomentCaseNumber)
          );

          let temp = Infinity;
          let nodeId;
          let pos;

          for (let i = 0; i < elements.length; i++) {
            let distToStart = dist(
              elements[i].startPos.x,
              loadMoments[logMomentCaseNumber].posLoadMoment.y,
              loadMoments[logMomentCaseNumber].posLoadMoment.x,
              loadMoments[logMomentCaseNumber].posLoadMoment.y
            );
            if (distToStart < temp) {
              temp = distToStart;
              nodeId = elements[i].startNodeId;
              pos = elements[i].startPos;
            }
          }

          //**Check endPoint of last element
          let distToEnd = dist(
            elements[elements.length - 1].endPos.x,
            loadMoments[logMomentCaseNumber].posLoadMoment.y,
            loadMoments[logMomentCaseNumber].posLoadMoment.x,
            loadMoments[logMomentCaseNumber].posLoadMoment.y
          );

          if (distToEnd < temp) {
            temp = distToEnd;
            nodeId = elements[elements.length - 1].endNodeId;
            pos = elements[elements.length - 1].endPos;
          }

          //**Assign new values
          loadMoments[logMomentCaseNumber].nodeId = nodeId;
          loadMoments[logMomentCaseNumber].posLoadMoment = pos;

          //**Determine nodeId and pos

          //** set to undefined
          logMomentCaseNumber = undefined;
        }
      }
      //let temp = logPointLoadCaseNumber
    }
  }

  LoadLineDelete(pos) {
    //**Delete LoadLine
    if (button_DeleteLoadLine.state == 1) {
      for (let i = loadLines.length - 1; i >= 0; i--) {
        //** Highligth possible loads in Red if delete
        push();
        fill(255, 0, 0, 100);
        noStroke();
        circle(loadLines[i].fixPointLeft.x, loadLines[i].fixPointLeft.y, 20);
        circle(loadLines[i].fixPointRight.x, loadLines[i].fixPointRight.y, 20);
        pop();

        //** Delete
        if (loadLines[i].Overlap(pos))
          if (
            mouseIsPressed &&
            loadLines[i].Overlap(pos) &&
            oneClickLoadLineDelete
          ) {
            //console.log("*" + loadLines[i].loadCaseNumber);
            //console.log("*" + loadLines[i].loadCaseNumber);
            loadLines.splice(i, 1);

            oneClickLoadLineDelete = false;
          }
      }
      this.BubbleSortLoad(loadLines);
    }
  }

  //**Delete loadPoint if Node is deleted
  //** Called from this.NodeDelete().
  LoadDelete(pos, elements, loads) {
    let nodeDeletedId;
    let node;
    for (let i = elements.length - 1; i >= 0; i--) {
      //**NodeToRemove
      nodeDeletedId = elements[i].ReadNodeId(pos); //**ReadNode() return -1 if no match
      if (nodeDeletedId != -1) node = nodeDeletedId;
    }

    for (let i = loads.length - 1; i >= 0; i--) {
      if (loads[i].nodeId == node) {
        loads.splice(i, 1);
      }
    }
  }
  NodeAdd(pos, elements, loadLines) {
    if (button_AddNode.state == -1) return;
    //**pos.x in multioplum of stapChange
    let stepChange = elements[0].stepChange;
    let remainder = int(pos.x) % stepChange;
    if (remainder > stepChange / 2)
      pos.x = int(pos.x) + (stepChange - remainder);
    if (remainder <= stepChange / 2) pos.x = int(pos.x) - remainder;

    let charnierLeftLog = false;

    //**AddNode
    if (button_AddNode.state == 1) {
      //** Highligth elements
      push();

      let startPos = elements[0].startPos;
      let endPos = elements[elements.length - 1].endPos;
      stroke(0, 255, 0, 100);
      strokeWeight(10);
      line(startPos.x, startPos.y, endPos.x, endPos.y);
      pop();

      for (let i = elements.length - 1; i >= 0; i--) {
        if (
          collisionDetect.LinePoint(
            elements[i].startPos,
            elements[i].endPos,
            mousePosWorld
          )
        ) {
          //**Restrict node on top of another
          if (
            pos.x > elements[i].startPos.x + 15 &&
            pos.x < elements[i].endPos.x - 15
          ) {
            collisionDetect.HighLight(pos, elements[i].startPos.y);

            //**AddNode
            if (mouseIsPressed) {
              //**If charnier in left node the add charnier
              if (elements[i].charnierLeft) {
                charnierLeftLog = true;
              }

              let startPosTemp = elements[i].startPos.copy();
              let endPosTemp = elements[i].endPos.copy();
              elements.splice(i, 1);

              elements.push(
                new Element(
                  startPosTemp.x,
                  startPosTemp.y,
                  pos.x,
                  startPosTemp.y,
                  (E = 200000),
                  (I = 10000000),
                  (Id = 0)
                )
              );

              //**No charnier in beamStart
              if (elements.length > 1)
                elements[elements.length - 1].charnierLeft = charnierLeftLog;

              elements.push(
                new Element(
                  pos.x,
                  endPosTemp.y,
                  endPosTemp.x,
                  endPosTemp.y,
                  (E = 200000),
                  (I = 10000000),
                  (Id = 0)
                )
              );

              //** Bolt Add if node Added
              bolts.push(new Bolt(0, pos));

              this.BubbleSort(bolts);
              for (let i = 0; i < bolts.length; i++) {
                bolts[i].nodeId = i;
              }

              //**LoadLines Adjusted when node Added
              for (let j = 0, length = loadLines.length; j < length; j++) {
                let tol = elements[0].fixPointsDiameter;

                //** If add node left of loadLineStart => loadLine nodeIdStart & End +=1
                if (pos.x < loadLines[j].fixPointLeft.x - tol) {
                  loadLines[j].nodeIdStart += 1;
                  loadLines[j].nodeIdEnd += 1;
                  //console.log("Add node < fixPointLeft");
                }

                //** If add node after loadLineStart => loadLine nodeIdend +=1
                else if (
                  pos.x > loadLines[j].fixPointLeft.x + tol &&
                  pos.x < loadLines[j].fixPointRight.x - tol
                ) {
                  //console.log("fixPointLeft < Add node < fixPointRigth");
                  loadLines[j].nodeIdEnd += 1;
                }
              }

              break;
            }

            /*
                  //**LoadLines Adjust FixpontNodes when node is added
      for(let j=0, length1 = loadLines.length;j<length1;j++){
              for(let i=0, length = elements.length;i<length;i++){
      if(loadLines[j].posLoadLineStart.x == elements[i].startPos.x) loadLines[j].nodeIdStart = elements[i].startNodeId;
      if(loadLines[j].posLoadLineEnd.x == elements[i].endPos.x) loadLines[j].nodeIdEnd = elements[i].endNodeId;
    }
      } */
          }
        }
      }
    }
  }
  AddSupport(element, supports) {
    if (
      button_AddSupport.state == 1 &&
      oneClickSupport &&
      element.Overlap(mousePosWorld)
    ) {
      //**Check if support exist in node
      let supportExist = false;
      let tol = 20;

      for (let i = 0; i < supports.length; i++) {
        if (
          mousePosWorld.x < supports[i].posSupport.x + tol &&
          mousePosWorld.x > supports[i].posSupport.x - tol
        ) {
          supportExist = true;
          supports[i].Cy = 1000e3; //**AddSupportCy if Cz exist

          //** Sets buttonRoller value to startValue
          //** otherwise old value pops up when created if deleted
          supports[i].buttonRollor_Cy.SetValue(1000); //************************
        }
      }

      //**If no support in node then add
      if (supportExist == false) {
        if (element.Overlap(mousePosWorld))
          supports.push(new Support(mousePosWorld, 2));
      }

      oneClickSupport = false;
    }
  }
  AddSupportFixed(element, supports) {
    if (
      button_AddSupportFixed.state == 1 &&
      oneClickSupportFixed &&
      element.Overlap(mousePosWorld)
    ) {
      //**Check if support exist in node
      let supportExist = false;
      let tol = 20;

      for (let i = 0; i < supports.length; i++) {
        if (
          mousePosWorld.x < supports[i].posSupport.x + tol &&
          mousePosWorld.x > supports[i].posSupport.x - tol //&& supports[i].Cz!=0
        ) {
          supportExist = true;
          supports[i].Cz = 1000e9; //**AddSupportCz if Cy exist

          //** Sets buttonRoller value to startValue
          //** otherwise old value pops up when created if deleted
          supports[i].buttonRollor_Cz.SetValue(1000); //************************
        }
      }

      //**If no support in node then add
      if (supportExist == false) {
        if (element.Overlap(mousePosWorld))
          supports.push(new Support(mousePosWorld, 3));
      }
      oneClickSupportFixed = false;
    }
  }
  SupportDelete(pos, elements, supports) {
    let nodeDeletedId;
    let node;
    for (let i = elements.length - 1; i >= 0; i--) {
      //**NodeToRemove
      nodeDeletedId = elements[i].ReadNodeId(pos); //**ReadNode() return -1 if no match
      if (nodeDeletedId != -1) node = nodeDeletedId;
    }

    for (let i = supports.length - 1; i >= 0; i--) {
      if (
        supports[i].nodeId == node &&
        mouseIsPressed &&
        oneClickSupportDelete
      ) {
        if (supports[i].Cz == 0) supports.splice(i, 1);
        else {
          supports[i].Cy = 0;
          //supports[i].buttonRollor_Cy.value = 0
          // console.log("*")
        }

        oneClickSupportDelete = false;
      }
    }
  }
  DeleteSupportFixed(pos, element, supports) {
    //console.log("changeSystem");

    //Cy
    //- => nothing

    //Cy
    //Cz => set Cz = 0

    //-
    //Cz => splice support

    let nodeDeletedId;
    let node;

    if (
      button_DeleteSupportFixed.state == 1 &&
      oneClickSupportFixedDelete &&
      element.Overlap(mousePosWorld)
    ) {
      for (let i = elements.length - 1; i >= 0; i--) {
        //**NodeToRemove
        nodeDeletedId = elements[i].ReadNodeId(pos); //**ReadNode() return -1 if no match
        if (nodeDeletedId != -1) node = nodeDeletedId;
      }

      for (let i = supports.length - 1; i >= 0; i--) {
        if (
          supports[i].nodeId == node &&
          mouseIsPressed &&
          oneClickSupportFixedDelete
        ) {
          if (supports[i].Cy != 0) {
            if (supports[i].Cz != 0) supports[i].Cz = 0;
            // supports[i].buttonRollor_Cz.SetValue(0)
            // console.log(supports[i].buttonRollor_Cz.value)
          }
          if (supports[i].Cy == 0 && supports[i].Cz != 0) supports.splice(i, 1);

          oneClickSupportFixedDelete = false;
        }
      }
    }
  }

  ElementChangeLength(pos, elements) {
    //** node do not move when changeSystem ** Start **
    if (
      button_AddSupport.state == 1 ||
      button_AddSupportFixed.state == 1 ||
      button_SupportDelete.state == 1 ||
      button_DeleteSupportFixed.state == 1 ||
      button_AddLoadMoment.state == 1 ||
      button_AddCharnier.state == 1 ||
      button_DeleteCharnier.state == 1 ||
      button_DisplayBoltAdd.state == 1 ||
      button_DisplayBoltDelete.state == 1
    )
      return;
    //** node do not move when changeSystem ** Endt **

    //let saveId;
    //let overlapCount = 0;
    for (let i = elements.length - 1; i >= 0; i--) {
      //**Find the lowest element.Id that overlaps pos

      //**FirstNode
      if (elements[0].OverlapLeftNode(pos)) {
        //console.log("startNode");
        this.saveId = elements.length - 1;
        this.overlapCount = 1;
      }

      //**LastNode
      else if (elements[elements.length - 1].OverlapRightNode(pos)) {
        //console.log("lasteNode");
        this.saveId = elements.length - 1;
        this.overlapCount = 1;
      }

      //**MiddleNodes
      else if (elements[i].Overlap(pos)) {
        //console.log("middleNode");
        this.saveId = i;
        this.overlapCount = 2;
        //console.log(this.saveId)
      }
    }

    if (oneTime) {
      this.saveId = undefined;
    }

    //**pos.x in multioplum of stapChange
    let stepChange = elements[0].stepChange;
    let remainder = int(pos.x) % stepChange;
    if (remainder > stepChange / 2)
      pos.x = int(pos.x) + (stepChange - remainder);
    if (remainder <= stepChange / 2) pos.x = int(pos.x) - remainder;

    //**Control that nodes do not overlap when moved
    if (
      mouseIsPressed &&
      this.saveId != undefined &&
      button_AddNode.state != 1
    ) {
      //**LastElement
      if (this.overlapCount == 1) {
        // if (this.saveId == elements.length - 1) {
        if (pos.x > elements[elements.length - 1].startPos.x + 20) {
          //elements[this.saveId].ChangePos(pos);
          elements[elements.length - 1].endPos.x = pos.x;
        }
        // }
      }

      //**Element
      if (this.overlapCount == 2) {
        if (
          pos.x > elements[this.saveId].startPos.x + 20 &&
          pos.x < elements[this.saveId + 1].endPos.x - 20
        ) {
          //elements[saveId].ChangePos(pos);
          //elements[saveId + 1].ChangePos(pos);

          elements[this.saveId].endPos.x = pos.x;
          elements[this.saveId + 1].startPos.x = pos.x;
        }
      }

      //** ElementReinforced
      if (button_BeamReinforced.state == 1) {
        for (
          let i = 0, lengthElements = elementsReinforced.length;
          i < lengthElements;
          i++
        ) {
          //** need to adjust pos if update length
          elementsReinforced[i].startPos.x = elements[i].startPos.x;
          elementsReinforced[i].endPos.x = elements[i].endPos.x;
          elementsReinforced[i].DataUpdateReinforced();
        }
      }

      /*
      //**FirstElement
      if (this.saveId == 0) {
        //**Do not move startNode
        // if (pos.x < elements[0].endPos.x - 20) elements[0].ChangePos(pos);
      }
      */
    }
  }
  HighligthChange() {
    //** Highligth possible supports in Green if AddSupport
    if (button_AddSupport.state == 1 || button_AddSupportFixed.state == 1) {
      push();
      for (let i = elements.length - 1; i >= 0; i--) {
        fill(0, 255, 0, 100);
        noStroke();
        circle(elements[i].endPos.x, elements[i].endPos.y, 20);
      }
      circle(elements[0].startPos.x, elements[0].startPos.y, 20);
      pop();
    }

    //** Highligth possible supports in Red if DeleteSupport
    if (button_SupportDelete.state == 1) {
      push();
      for (let i = supports.length - 1; i >= 0; i--) {
        if (supports[i].Cy != 0) {
          fill(255, 0, 0, 150);
          noStroke();
          circle(supports[i].posSupport.x, supports[i].posSupport.y, 20);
        }
      }
      pop();
    }

    //** Highligth possible supportsFixed in Red if DeleteSupport
    if (button_DeleteSupportFixed.state == 1) {
      push();
      for (let i = supports.length - 1; i >= 0; i--) {
        if (supports[i].Cz != 0) {
          fill(255, 0, 0, 150);
          noStroke();
          circle(supports[i].posSupport.x, supports[i].posSupport.y, 20);
        }
      }
      pop();
    }

    //**************** BOLTS START ***********************
    //** Highligth possible bolts
    if (button_DisplayBoltAdd.state == 1) {
      push();
      for (let i = bolts.length - 1; i >= 0; i--) {
        fill(0, 255, 0, 100);
        noStroke();
        if (bolts[i].exist == -1)
          circle(bolts[i].startPos.x, bolts[i].startPos.y, 30);
      }
      //circle(elements[0].startPos.x, elements[0].startPos.y, 20);
      pop();
    }

    if (button_DisplayBoltDelete.state == 1) {
      push();
      for (let i = bolts.length - 1; i >= 0; i--) {
        fill(255, 0, 0, 100);
        noStroke();
        if (bolts[i].exist == 1)
          circle(bolts[i].startPos.x, bolts[i].startPos.y, 30);
      }
      //circle(elements[0].startPos.x, elements[0].startPos.y, 20);
      pop();
    }
    //**************** BOLTS END ***********************

    //*********************** If overlap -> Highligth ************
    for (let i = 0, length = elements.length; i < length; i++) {
      if (elements[i].Overlap(mousePosWorld)) {
        elements[i].OverlapHighlight(mousePosWorld);

        //**HighLigth node ADD
        if (button_AddSupport.state == 1) {
          collisionDetect.HighLightSupportOn(
            mousePosWorld,
            elements[i],
            supports
          );
        }

        if (button_AddSupportFixed.state == 1)
          collisionDetect.HighLightSupportFixedOn(
            mousePosWorld,
            elements[i],
            supports
          );

        if (button_AddLoadMoment.state == 1)
          collisionDetect.HighLightLoadMomentOn(mousePosWorld, elements[i]);

        if (button_AddLoadPoint.state == 1)
          collisionDetect.HighLightLoadPointOn(mousePosWorld, elements[i]);

        if (button_AddCharnier.state == 1) {
          collisionDetect.HighLightCharnierOn(mousePosWorld, elements[i]);
        }

        //**Highligt node DELETE
        if (button_SupportDelete.state == 1)
          collisionDetect.HighLightSupportDelete(
            mousePosWorld,
            elements[i],
            supports
          );

        if (button_DeleteSupportFixed.state == 1)
          collisionDetect.HighLightSupportFixedDelete(
            mousePosWorld,
            elements[i],
            supports
          );

        if (button_NodeDelete.state == 1)
          collisionDetect.HighLightNodeDelete(mousePosWorld, elements[i]);

        if (button_DeleteCharnier.state == 1) {
          collisionDetect.HighLightCharnierDelete(mousePosWorld, elements[i]);
        }
      }

      //**Highligth ADD
      if (button_AddLoadLine.state == 1)
        collisionDetect.HighLightElement(mousePosWorld, elements[i]);

      //**Highligth DELETE
      if (button_DeleteLoadPoint.state == 1)
        collisionDetect.HighLightLoadPointDelete(mousePosWorld);

      if (button_DeleteLoadLine.state == 1)
        collisionDetect.HighLightLoadLineDelete(mousePosWorld);

      if (button_DeleteLoadMoment.state == 1)
        collisionDetect.HighLightLoadMomentDelete(mousePosWorld);
    }
  }

  //**reference by pointer (so no need to return array)
  BubbleSort(array) {
    //console.log(array)
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

  //**Sort loadPoints or loadLines if one is deleted
  //**Called from sketch
  BubbleSortLoad(array) {
    for (let i = array.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (array[j].loadCaseNumber > array[j + 1].loadCaseNumber) {
          // swap
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }

    //**Redefine loadCaseNumber
    for (let i = 0; i < array.length; i++) {
      array[i].loadCaseNumber = i;
      //console.log(array[i].loadCaseNumber)
    }
  }
}
