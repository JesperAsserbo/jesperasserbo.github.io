//** for each node fill in stiffnessMatrix global

class NodeSystem {
  constructor() {
    this.nodeArray = [];
    this.overlapNode = false;
    this.overlapNodeID = null;
    this.overlappedNodePosInArray = null;
    this.logNodeForElement = false;

    this.tempNodeArray = [];
    this.overlapTempNode = false;
    this.overlapTempNodeID = null;
    this.overlappedTempNodePosInArray = null;
    this.logTempNodeForElement = false;

    //** Overlapped supportFixPoint
    this.supportNodeOverlap = null;
    this.supportNumber = null;
    //this.supportFixPointLogged = false; //** used to restrict pan and rotate support

    //** Array for create element
    this.tempNodeCreateElement = [];
  }

  UpdateNodeID() {
    for (let i = 0; i < this.nodeArray.length; i++) {
      this.nodeArray[i].ID = i;
    }

    for (let i = 0; i < this.tempNodeArray.length; i++) {
      this.tempNodeArray[i].ID = i;
    }
  }

  ConnectingTrusses(nodeNumber) {
    let connectingTrusses = [];
    {
      for (let i = 0; i < elementSystem.elementArray.length; i++) {
        if (elementSystem.elementArray[i].startNode.ID == nodeNumber)
          connectingTrusses.push(elementSystem.elementArray[i].id);
        if (elementSystem.elementArray[i].endNode.ID == nodeNumber)
          connectingTrusses.push(elementSystem.elementArray[i].id);
      }
      //console.log("nodeSystem line 41 - connectingTrusses " + connectingTrusses)

      return connectingTrusses;
    }
  }

  //** ChatGPT
  HighLigthElementAdd() {
  //console.log("HighLigth element add - NodeSystem line 52");
          for (let i = 0; i < this.tempNodeArray.length; i++) {
        this.tempNodeArray[i].HighLigthElementAdd();
      }

  //** No node selected: highlight all nodes
  if (this.tempNodeCreateElement.length == 0) {
    for (let node of this.nodeArray) {
      node.HighLigthElementAdd();
    }

    for (let node of this.tempNodeArray) {
      node.HighLigthElementAdd();
    }

    return;
  }

  //** One node selected
  if (this.tempNodeCreateElement.length == 1) {
    let nodeID = this.tempNodeCreateElement[0][1].ID;
    let connectingTrusses = this.ConnectingTrusses(nodeID);

    //** Find IDs of connected nodes
    let connectedNodeIDs = [];

    for (let i of connectingTrusses) {
      let element = elementSystem.elementArray[i];

      connectedNodeIDs.push(element.startNode.ID);
      connectedNodeIDs.push(element.endNode.ID);
    }

    //** Highlight nodes not connected to selected node
    for (let node of this.nodeArray) {
      if (
        node.ID != nodeID &&
        !connectedNodeIDs.includes(node.ID)
      ) {
        node.HighLigthElementAdd();
      }
    }
  }
}

  /*
  HighLigthElementAdd() {
    console.log("HighLigth element add - NodeSystem line 52");
    if (this.tempNodeCreateElement.length == 0) {
      for (let i = 0; i < this.nodeArray.length; i++) {
        this.nodeArray[i].HighLigthElementAdd();
      }
      for (let i = 0; i < this.tempNodeArray.length; i++) {
        this.tempNodeArray[i].HighLigthElementAdd();
      }
    }
   
    if (this.tempNodeCreateElement.length == 1){
      //** find connecting trusses and do not highligth
      let node = this.tempNodeCreateElement[0][1].ID;
      let connectingTrusses = this.ConnectingTrusses(node);
       

      for (let i = 0; i < this.nodeArray.length; i++) {
        for (let j = 0;j < connectingTrusses.length; j++) {
        
        //** if not connected => highligth
          let element = connectingTrusses[j]
          let node1_ID = elementSystem.elementArray[element].startNode.ID
          let node2_ID = elementSystem.elementArray[element].endNode.ID
          console.log(node1_ID + " " + node2_ID + " i " + i)
        if(this.nodeArray[i].ID != node1_ID){
          if(this.nodeArray[i].ID !=node2_ID ) this.nodeArray[i].HighLigthElementAdd();
        }
        
      }
      }
      
      
      console.log(connectingTrusses)
     
    } 
   
  }*/

  HighLigthNodeDelete() {
    for (let i = 0; i < this.nodeArray.length; i++) {
      this.nodeArray[i].HighLigthNodeDelete();
    }

    for (let i = 0; i < this.tempNodeArray.length; i++) {
      this.tempNodeArray[i].HighLigthNodeDelete();
    }
  }

  HighLigthNodeAddSupport() {
    for (let i = 0; i < this.nodeArray.length; i++) {
      this.nodeArray[i].HighLigthNodeAddSupport();
    }
  }
  

  //** Display
  DisplayNodeID() {
    for (let i = 0; i < this.nodeArray.length; i++) {
      this.nodeArray[i].DisplayNodeID();
    }
  }

  NodeDef(matrix) {
    for (let i = 0; i < this.nodeArray.length; i++) {
      this.nodeArray[i].posDef.x = matrix[2 * i][0];
      this.nodeArray[i].posDef.y = matrix[2 * i + 1][0];
    }
  }
  DisplayNodeDef() {
    for (let i = 0; i < this.nodeArray.length; i++) {
      push();
      let scale = 1;
      let x = this.nodeArray[i].pos.x + scale * this.nodeArray[i].posDef.x;
      let y = this.nodeArray[i].pos.y + scale * this.nodeArray[i].posDef.y;
      fill(255, 0, 0, 200);
      circle(x, y, 10);
      pop();

      //console.log(this.nodeArray[i].posDef)
    }
  }
  DisplayTempNode() {
    if (!nodeSystem.tempNodeArray.length) return;
    for (let i = 0; i < this.tempNodeArray.length; i++) {
      this.tempNodeArray[i].DisplayTempNode();
    }
  }
  DisplayNodeSupport() {
    for (let i = 0; i < this.nodeArray.length; i++) {
      this.nodeArray[i].DisplayNodeSupport();
    }
  }

  DisplaySupportReaction(){
     for (let i = 0; i < this.nodeArray.length; i++) {
      this.nodeArray[i].DisplaySupportReaction();
    }   
  }

  //** test if Overlap support Fixpoint
  //** called from changeSystem.DeleteSupport(pos)
  OverlapNodeSupportFixpoint(pos) {
    //console.log("nodeSystem line 78 og 85 " + supportFixPointLogged);
    for (let i = 0; i < this.nodeArray.length; i++) {
      if (this.nodeArray[i].nodeSupportArray.length > 0) {
        //** support [overlap true/false, nodeNumber, supportNumber]
        let support = this.nodeArray[i].OverlapNodeSupportFixpoint(pos);

        if (support[0] == true) {
          this.supportNodeOverlap = support[1]; //** nodeNumber
          this.supportNumber = support[2]; //** supportNumber in node

          if (mouseIsPressed) {
            supportFixPointLogged = true;
            supportNodeLogged = this.supportNodeOverlap;
            supportNumberLogged = this.supportNumber;
          }

          break;
        } else {
          this.supportNodeOverlap = null;
          this.supportNumber = null;
        }
      }
    }
  }

  //** test if log Node
  OverlapNodeTest(pos) {
    if (logNode) return; //** Do not test if already node logged
    if (logTempNode && button_Element_Add == -1) return; //** Do not test if already nodeTemp logged except if try to make element

    for (let i = 0; i < this.nodeArray.length; i++) {
      let distFromMousePosToNode = dist(
        pos.x,
        pos.y,
        this.nodeArray[i].pos.x,
        this.nodeArray[i].pos.y
      );

      if (distFromMousePosToNode < 20) {
        this.overlapNode = true;
        this.overlapNodeID = this.nodeArray[i].ID;
        this.overlappedNodePosInArray = i;
        if (mouseIsPressed) {
          logNode = true;
          logNodePosInArray = i;
          this.logNodeForElement = true;
        } // only set to false if in mouseReleased
        break;
      } else {
        this.overlapNode = false;
        this.overlapNodeID = null;
        this.overlappedNodePosInArray = null;
      }
    }
  }
  OverlapTempNodeTest(pos) {
    if (this.tempNodeArray.length == 0) return;
    if (logTempNode) return; //** Do not test if already nodeTemp logged
    if (logNode && button_Element_Add == -1) return; //** Do not test if already node logged except if try to make element

    // console.log("overLap TempNode Test");
    for (let i = 0; i < this.tempNodeArray.length; i++) {
      let distFromMousePosToNode = dist(
        pos.x,
        pos.y,
        this.tempNodeArray[i].pos.x,
        this.tempNodeArray[i].pos.y
      );

      if (distFromMousePosToNode < 20) {
        this.overlapTempNode = true;
        this.overlapTempNodeID = this.tempNodeArray[i].ID;
        this.overlappedTempNodePosInArray = i;
        if (mouseIsPressed) {
          logTempNode = true;
          logTempNodePosInArray = i;
          this.logTempNodeForElement = true;
        } // only set to false if in mouseReleased
        break;
      } else {
        this.overlapTempNode = false;
        this.overlapTempNodeID = null;
        this.overlappedTempNodePosInArray = null;
      }
    }
  }

  //** Test Overlap for CreateElement
  OverlapNodeTestForCreateElement(pos) {
    if (!mouseIsPressed || !oneTime) return;

    for (let node of this.nodeArray) {
      if (dist(pos.x, pos.y, node.pos.x, node.pos.y) >= 20) continue;

      if (this.tempNodeCreateElement.length == 0) {
        this.tempNodeCreateElement.push(["Node", node]);
      } else if (
        this.tempNodeCreateElement.length == 1 &&
        dist(
          this.tempNodeCreateElement[0][1].pos.x,
          this.tempNodeCreateElement[0][1].pos.y,
          pos.x,
          pos.y
        ) > 20
      ) {
        this.tempNodeCreateElement.push(["Node", node]);
      }

      oneTime = false;
      return;
    }
  }

  //** Test Overlap for CreateElement
  OverlapTempNodeTestForCreateElement(pos) {
    if (!mouseIsPressed || !oneTime) return;

    for (let node of this.tempNodeArray) {
      if (dist(pos.x, pos.y, node.pos.x, node.pos.y) >= 20) continue;

      if (this.tempNodeCreateElement.length == 0) {
        this.tempNodeCreateElement.push(["TempNode", node]);
      } else if (
        this.tempNodeCreateElement.length == 1 &&
        dist(
          this.tempNodeCreateElement[0][1].pos.x,
          this.tempNodeCreateElement[0][1].pos.y,
          pos.x,
          pos.y
        ) > 20
      ) {
        this.tempNodeCreateElement.push(["TempNode", node]);
      }

      oneTime = false;
      return;
    }
  }

  //** Test if element already exists between 2 nodes
  //** returns true if find element otherwise return false.
  //** Used in changeSystem to create element
  ElementExists(node1, node2) {
    return elementSystem.elementArray.some(
      (element) =>
        (element.startNode.ID == node1.ID && element.endNode.ID == node2.ID) ||
        (element.startNode.ID == node2.ID && element.endNode.ID == node1.ID)
    );
  }

  BubbleSortLoad(array) {
    for (let i = array.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (array[j].ID > array[j + 1].ID) {
          // swap
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
  }
}

//***************** UDGÅET **********************
/*
  //** Test Overlap for CreateElement
  OverlapNodeTestForCreateElement(pos) {
    for (let i = 0; i < this.nodeArray.length; i++) {
      let distFromMousePosToNode = dist(
        pos.x,
        pos.y,
        this.nodeArray[i].pos.x,
        this.nodeArray[i].pos.y
      );

      if (distFromMousePosToNode < 20) {
        if (oneTime) {
          if (mouseIsPressed) {
            //** push 1. node
            if (this.tempNodeCreateElement.length == 0) {
              this.tempNodeCreateElement.push(["Node", this.nodeArray[i]]);
            }
            //** push 2. node if not the same
            else if (this.tempNodeCreateElement.length == 1) {
              //** test
              let distFromTempNode = dist(
                this.tempNodeCreateElement[0][1].pos.x,
                this.tempNodeCreateElement[0][1].pos.y,
                pos.x,
                pos.y
              );

              if (distFromTempNode > 20) {
                this.tempNodeCreateElement.push(["Node", this.nodeArray[i]]);
              }
            }
            oneTime = false;
          }
        }
      }
    }
  }
  */
/*
  //** Test Overlap for CreateElement
  OverlapTempNodeTestForCreateElement(pos) {
    for (let i = 0; i < this.tempNodeArray.length; i++) {
      let distFromMousePosToNode = dist(
        pos.x,
        pos.y,
        this.tempNodeArray[i].pos.x,
        this.tempNodeArray[i].pos.y
      );

      if (distFromMousePosToNode < 20) {
        if (oneTime) {
          if (mouseIsPressed) {
            //** push 1. node
            if (this.tempNodeCreateElement.length == 0) {
              this.tempNodeCreateElement.push([
                "TempNode",
                this.tempNodeArray[i],
              ]);
            }
            //** push 2. node if not the same
            else if (this.tempNodeCreateElement.length == 1) {
              //** test
              let distFromTempNode = dist(
                this.tempNodeCreateElement[0][1].pos.x,
                this.tempNodeCreateElement[0][1].pos.y,
                pos.x,
                pos.y
              );

              if (distFromTempNode > 20) {
                this.tempNodeCreateElement.push([
                  "TempNode",
                  this.tempNodeArray[i],
                ]);
              }
            }
            oneTime = false;
          }
        }
      }
    }
  }
*/
