class ChangeSystem {
  constructor() {
    this.tempNodeArray = [];

    this.endNodeIsTemp = false;
    this.startNodeIsTemp = false;

    //** TempElement
    this.elementTempStarted = false; //** set to false in mouseReleased()
    this.elementStartX = null;
    this.elementStartY = null;
  }

  //**********************************
  //********* ADD ********************
  //**********************************
  AddNode(pos) {
    if (button_Node_Add.state == -1) return;
    if (pos.y < 800) return;

    //** Test
    //** Can not create node if already overlap node
    if (nodeSystem.overlapTempNode || logTempNode) return;
    if (nodeSystem.overlapNode || logNode) return;

    //** Create TempNode (only one)
    if (oneTime) {
      if (mouseIsPressed) {
        let ID = nodeSystem.tempNodeArray.length;
        let tempPos = pos.copy();
        nodeSystem.tempNodeArray.push(new Node(ID, tempPos));
        oneTime = false;
        //console.log("changeSystem line 10: " + nodeSystem.tempNodeArray.length);
      }
    }
  }
  AddElement(pos) {  
    if (button_Element_Add.state == -1) {
      //** Reset tempArray
      nodeSystem.tempNodeCreateElement = [];
      return;
    }

    nodeSystem.HighLigthElementAdd();
    //** Draw temp Element
    //** tempNodeCreateElement[] = ["Type",node]
    if (nodeSystem.tempNodeCreateElement.length == 1) {
      push();
      strokeWeight(1);
      let x = nodeSystem.tempNodeCreateElement[0][1].pos.x;
      let y = nodeSystem.tempNodeCreateElement[0][1].pos.y;
      line(x, y, pos.x, pos.y);
      circle(x, y, 5);
      pop();
    }

    //** Create Element //** Add element if 2 nodes in tempArray
    else if (nodeSystem.tempNodeCreateElement.length == 2) {
      let startNodeType = nodeSystem.tempNodeCreateElement[0][0];
      let startNode = nodeSystem.tempNodeCreateElement[0][1];

      let endNodeType = nodeSystem.tempNodeCreateElement[1][0];
      let endNode = nodeSystem.tempNodeCreateElement[1][1];

      //** test if element already exist between 2 nodes
      if (
        !nodeSystem.ElementExists(startNode, endNode) ||
        startNodeType == "TempNode" ||
        endNodeType == "TempNode"
      ) {
        //** StartNode
        if (startNodeType == "TempNode") {
          startNode.ID = nodeSystem.nodeArray.length;
          nodeSystem.nodeArray.push(startNode);

          //** Delete tempNode
          //** Find pos in tempArray and delete TempNode
          for (let i = 0; i < nodeSystem.tempNodeArray.length; i++) {
            if (startNode.ID == nodeSystem.tempNodeArray[i].ID) {
              nodeSystem.tempNodeArray.splice(i, 1);
              break;
            }
          }
        }

        //** EndNode
        if (endNodeType == "TempNode") {
          endNode.ID = nodeSystem.nodeArray.length;
          nodeSystem.nodeArray.push(endNode);

          //** Delete tempNode
          //** Find pos in tempArray and delete TempNode
          for (let i = 0; i < nodeSystem.tempNodeArray.length; i++) {
            if (endNode.ID == nodeSystem.tempNodeArray[i].ID) {
              nodeSystem.tempNodeArray.splice(i, 1);
              break;
            }
          }
        }

        //** CreateElement
        let element_new = new Element(startNode, endNode, 10000, 1000, 0);
        elementSystem.elementArray.push(element_new);
      }
      //** Reset tempArray
      nodeSystem.tempNodeCreateElement = [];
    }

    //** 1 ** test overlap
  }
  AddSupport(pos) {
    if (button_Support_Add.state == -1) return;
    nodeSystem.HighLigthNodeAddSupport();
    
    if (nodeSystem.overlapNode == false) return;
    if (pos.y < 800) return;

    //** Test
    //** Can not create node if already overlap node
    //** Add support (only one)
    if (oneTime) {
      //** Test number of supports In node
      let supportsInNode =
        nodeSystem.nodeArray[nodeSystem.overlappedNodePosInArray]
          .nodeSupportArray.length;
      //console.log("SuportsInNode: " + supportsInNode);
      if (mouseIsPressed) {
        let nodeNumber =
          nodeSystem.nodeArray[nodeSystem.overlappedNodePosInArray];

        if (supportsInNode == 0) {
          //** If 0 -> add
          let angle = PI / 2;

          nodeNumber.nodeSupportArray.push(new Support(nodeNumber.pos, angle,nodeNumber.ID));
        } else if (supportsInNode == 1) {
          //** If 1 -> add with angle[0] + 90 grader
          let angle = nodeNumber.nodeSupportArray[0].C_angle - PI / 2;

          nodeNumber.nodeSupportArray.push(new Support(nodeNumber.pos, angle,nodeNumber.ID));
        } else if (supportsInNode == 2) {
          return;
        } //** If 2 -> nothing

        oneTime = false;
      }
    }
  }
  //**********************************
  //********* DELETE *****************
  //**********************************
  DeleteNode(pos) {
    if (button_Node_Delete.state == -1) return;
    nodeSystem.HighLigthNodeDelete();

    if (nodeSystem.overlapNode == false) return;
    if (nodeSystem.nodeArray.length < 2) return;
    if (pos.y < 800) return;

    if (logNodePosInArray != null) {
      if (oneTime) {
        //** connecting Trusses
        let connectingTrusses = nodeSystem.ConnectingTrusses(logNodePosInArray);

        //** Trusses - Delete
        for (let i = connectingTrusses.length - 1; i >= 0; i--) {
          elementSystem.elementArray.splice(connectingTrusses[i], 1);
        }

        //** node - Delete
        //** 1 ** Test element nodes and
        for (let i = 0; i < elementSystem.elementArray.length; i++) {}

        //** Update nodeArray and elementArray
        nodeSystem.nodeArray.splice(logNodePosInArray, 1);
        logNodePosInArray = null;
        logNode = false;

        nodeSystem.UpdateNodeID();
        elementSystem.UpdateID();
        elementSystem.DataUpdate();

        //** Reconnect elements to existing nodes
        for (let j = 0; j < elementSystem.elementArray.length; j++) {
          let element = elementSystem.elementArray[j];
          for (let i = 0; i < nodeSystem.nodeArray.length; i++) {
            let node = nodeSystem.nodeArray[i];

            //** Start node
            if (
              node.pos.x == element.startPos.x &&
              node.pos.y == element.startPos.y
            ) {
              element.startNode = node;
            }

            //** End node
            if (
              node.pos.x == element.endPos.x &&
              node.pos.y == element.endPos.y
            ) {
              element.endNode = node;
            }
          }
        }

        //** Update
        elementSystem.DataUpdate();
        oneTime = false;
      }
    }
  }
  DeleteTempNode(pos) {
    if (button_Node_Delete.state == -1) return;
    if (pos.y < 800) return;

    for (let i = nodeSystem.tempNodeArray.length - 1; i >= 0; i--) {
      let distToTempNode = dist(
        pos.x,
        pos.y,
        nodeSystem.tempNodeArray[i].pos.x,
        nodeSystem.tempNodeArray[i].pos.y
      );
      if (distToTempNode < 20) {
        if (oneTime) {
          if (mouseIsPressed) {
            nodeSystem.tempNodeArray.splice(i, 1);
            oneTime = false;
          }

          //** Reset otherwise cant create new node
          nodeSystem.overlapTempNode = false;
          logTempNode = false;
        }
        break;
      }
    }
  }
  DeleteElement(pos) {
    if (button_Element_Delete.state == -1) return;
    if (elementSystem.elementArray.length < 2) return;
    //if (pos.y < 800) return;

    //** test for overlap (sets nodeSystem.supportNodeOverlap & nodeSystem.supportNumber)
    elementSystem.OverlapElement(pos);
    if (elementSystem.elementCenterOverlap == null) return;

    //** Delete element (only one)
    if (oneTime) {
      if (mouseIsPressed) {
        let elementNumber = elementSystem.elementCenterOverlap;

        elementSystem.elementArray.splice(elementNumber, 1);

        //** update id
        elementSystem.UpdateID();

        //** Reset after DELETE
        elementSystem.elementCenterOverlap = null;
        oneTime = false;
      }
    }

    //** Delete node if no elements
    //** connecting Trusses
    // let connectingTrusses = nodeSystem.ConnectingTrusses(logNodePosInArray);
    for (let i = 0; i < nodeSystem.nodeArray.length; i++) {
      let connectingTrusses = nodeSystem.ConnectingTrusses(i);
      if (connectingTrusses.length == 0) {
        nodeSystem.nodeArray.splice(i, 1);
        break;
      }
    }

    //** update id
    elementSystem.UpdateID();
    nodeSystem.UpdateNodeID();
  }
  DeleteSupport(pos) {
    if (button_Support_Delete.state == -1) return;
    if (pos.y < 800) return;

    //** test for overlap (sets nodeSystem.supportNodeOverlap & nodeSystem.supportNumber)
    if (nodeSystem.supportNodeOverlap == null) return;
    if (nodeSystem.supportNumber == null) return;

    //** Delete support (only one)
    if (oneTime) {
      if (mouseIsPressed) {
        let nodeNumber = nodeSystem.supportNodeOverlap;
        let supportNumber = nodeSystem.supportNumber;

        nodeSystem.nodeArray[nodeNumber].nodeSupportArray.splice(
          supportNumber,
          1
        );

        oneTime = false;
      }
    }
  }
  //**********************************
  //********* MOVE *******************
  //**********************************
  AdjustSupportAngle(pos) {
    if (button_Support_Delete.state == 1) return;
    if (button_TestLoad.state == 1 && logNode) return; //** can still adjust if logNode == false
    if (supportFixPointLogged == false) return;

    nodeSystem.nodeArray[supportNodeLogged].nodeSupportArray[
      supportNumberLogged
    ].AdjustSupport(pos, nodeSystem.nodeArray[supportNodeLogged]);

    //** if 2 supports (adjust both)
    if (nodeSystem.nodeArray[supportNodeLogged].nodeSupportArray.length == 2) {
      if (supportNumberLogged == 0) {
        nodeSystem.nodeArray[supportNodeLogged].nodeSupportArray[1].C_angle =
          nodeSystem.nodeArray[supportNodeLogged].nodeSupportArray[0].C_angle -
          PI / 2;
      } else if (supportNumberLogged == 1) {
        nodeSystem.nodeArray[supportNodeLogged].nodeSupportArray[0].C_angle =
          nodeSystem.nodeArray[supportNodeLogged].nodeSupportArray[1].C_angle +
          PI / 2;
      }
    }

    /*
    console.log(
      "changeSystem line 104 - nodeOverlap: " + nodeSystem.supportNodeOverlap
    );
    console.log("changeSystem line 105 - supportOverlap: " + nodeSystem.supportNumber);
    */
  }
  MoveNode(pos) {
    if (logNode == false) return;
    if (logTempNode) return; //** cant move both
    if (button_Element_Add.state == 1) return; //** dont move node when create element
    if (button_Support_Add.state == 1) return; //** dont move node when create support

    this.MoveInSteps(pos);
    nodeSystem.nodeArray[logNodePosInArray].pos.x = pos.x;
    nodeSystem.nodeArray[logNodePosInArray].pos.y = pos.y;
  }
  MoveTempNode(pos) {
    if (logTempNode == false) return;
    if (logNode) return; //** cant move both
    if (button_Element_Add.state == 1) return; //** dont move node when create element

    this.MoveInSteps(pos);
    nodeSystem.tempNodeArray[logTempNodePosInArray].pos.x = pos.x;
    nodeSystem.tempNodeArray[logTempNodePosInArray].pos.y = pos.y;
  }
  MoveInSteps(pos) {
    //**pos.y in multioplum of stepChange
    //let stepChange = 10; //*scaleGeo;
    pos.x = round(pos.x / stepSize) * stepSize;
    pos.y = round(pos.y / stepSize) * stepSize;
    return pos;
  }

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
  }
}
