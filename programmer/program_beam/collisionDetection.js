class CollisionDetection {
  constructor() {
    this.lineStart = new p5.Vector();
    this.lineEnd = new p5.Vector();
    this.point = new p5.Vector();
    this.tolerence = 20;
  }

  CollisionCirclePoint(node, point) {
    let distToNode = p5.Vector.dist(point, node.pos);
    if (distToNode < node.radius) {
      return true;
    }
    return false;
  }
  


  /*
  HighLightNodeAdd(pos, element) {
    push();
    noStroke();
    fill(0, 255, 0, 100);
    if (element.OverlapLeftNode(pos))
      circle(element.startPos.x, element.startPos.y, 40);

    if (element.OverlapRightNode(pos))
      circle(element.endPos.x, element.endPos.y, 40);
    pop();
  }
*/

  HighLightLoadPointOn(pos, element) {
    
 
        
    push();
    noStroke();
    fill(0, 255, 0, 100);
    if (element.OverlapLeftNode(pos))
      circle(element.startPos.x, element.startPos.y, 40);

    if (element.OverlapRightNode(pos))
      circle(element.endPos.x, element.endPos.y, 40);
    pop();
  }

  HighLightLoadMomentOn(pos, element) {
    push();
    noStroke();
    fill(0, 255, 0, 100);
    if (element.OverlapLeftNode(pos))
      circle(element.startPos.x, element.startPos.y, 40);

    if (element.OverlapRightNode(pos))
      circle(element.endPos.x, element.endPos.y, 40);
    pop();
  }

  HighLightCharnierOn(pos, element) {
    push();
    noStroke();
    fill(0, 255, 0, 100);

    //**Not in beamStart
    if (element.startNodeId != 0) {
      //**Highlight
      if (element.OverlapLeftNode(pos) && element.charnierLeft == false)
        circle(element.startPos.x, element.startPos.y, 40);
    }
    pop();
  }

  HighLightLoadPointDelete(pos) {
    push();
    noStroke();
    fill(255, 0, 0, 50);
    for (let i = loadPoints.length - 1; i >= 0; i--) {
      let distLoadPoint = dist(
        pos.x,
        pos.y,
        loadPoints[i].fixPoint.x,
        loadPoints[i].fixPoint.y
      );
      if (distLoadPoint < loadPoints[i].fixPointsDiameter)
        circle(loadPoints[i].fixPoint.x, loadPoints[i].fixPoint.y, 40);
    }
    pop();
  }

  HighLightLoadMomentDelete(pos) {
    push();
    noStroke();
    fill(255, 0, 0, 50);
    for (let i = loadMoments.length - 1; i >= 0; i--) {
      let distLoadPoint = dist(
        pos.x,
        pos.y,
        loadMoments[i].fixPoint.x,
        loadMoments[i].fixPoint.y
      );
      if (distLoadPoint < loadMoments[i].fixPointsDiameter)
        circle(loadMoments[i].fixPoint.x, loadMoments[i].fixPoint.y, 40);
    }
    pop();
  }

  HighLightLoadLineDelete(pos) {
    push();
    noStroke();
    fill(255, 0, 0, 50);
    for (let i = loadLines.length - 1; i >= 0; i--) {
      let distfixPointLeft = dist(
        pos.x,
        pos.y,
        loadLines[i].fixPointLeft.x,
        loadLines[i].fixPointLeft.y
      );

      if (distfixPointLeft < loadLines[i].fixPointsDiameter)
        circle(loadLines[i].fixPointLeft.x, loadLines[i].fixPointLeft.y, 40);

      let distfixPointRight = dist(
        pos.x,
        pos.y,
        loadLines[i].fixPointRight.x,
        loadLines[i].fixPointRight.y
      );

      if (distfixPointRight < loadLines[i].fixPointsDiameter)
        circle(loadLines[i].fixPointRight.x, loadLines[i].fixPointRight.y, 40);
    }

    pop();
  }

  HighLightNodeDelete(pos, element) {
    push();
    noStroke();
    fill(255, 0, 0, 100);
    if (element.startNodeId != 0) {
      //**Highlight
      if (element.OverlapLeftNode(pos)) {
        circle(element.startPos.x, element.startPos.y, 40);
      }
    }
    pop();
  }

  HighLightCharnierDelete(pos, element) {
    push();
    noStroke();
    fill(255, 0, 0, 100);

    //**Not in beamStart
    if (element.startNodeId != 0) {
      //**Highlight
      if (element.OverlapLeftNode(pos) && element.charnierLeft == true)
        circle(element.startPos.x, element.startPos.y, 40);
    }
    pop();
  }

  HighLightSupportOn(pos, element, supports) {
    push();
    noStroke();
    fill(0, 255, 0, 100);

    //**Check if support exist in node
    let supportExist = false;
    let tol = 20;

    for (let i = 0; i < supports.length; i++) {
      if (
        mousePosWorld.x < supports[i].posSupport.x + tol &&
        mousePosWorld.x > supports[i].posSupport.x - tol &&
        supports[i].Cy != 0
      )
        supportExist = true;
    }

    //**If no support in node then HighLight
    if (supportExist == false) {

      
      if (element.OverlapLeftNode(pos))
        circle(element.startPos.x, element.startPos.y, 40);

      //**Check beamEnd
      if (element.OverlapRightNode(pos) && element.id == elements.length - 1)
        circle(element.endPos.x, element.endPos.y, 40);
    }
    pop();
  }

  HighLightSupportFixedOn(pos, element, supports) {
    push();
    noStroke();
    fill(0, 255, 0, 100);

    //**Check if support exist in node
    let supportExist = false;
    let tol = 20;

    for (let i = 0; i < supports.length; i++) {
      if (
        mousePosWorld.x < supports[i].posSupport.x + tol &&
        mousePosWorld.x > supports[i].posSupport.x - tol &&
        supports[i].Cz != 0
      )
        supportExist = true;
    }

    //**If no support in node then HighLight
    if (supportExist == false) {
      if (element.OverlapLeftNode(pos))
        circle(element.startPos.x, element.startPos.y, 40);

      //**Check beamEnd
      if (element.OverlapRightNode(pos) && element.id == elements.length - 1)
        circle(element.endPos.x, element.endPos.y, 40);
    }
    pop();
  }

  HighLightSupportDelete(pos, element, supports) {
    push();
    noStroke();
    fill(255, 0, 0, 100);

    //**Check if support exist in node
    let supportExist = false;
    let tol = 20;

    for (let i = 0; i < supports.length; i++) {
      if (
        mousePosWorld.x < supports[i].posSupport.x + tol &&
        mousePosWorld.x > supports[i].posSupport.x - tol &&
        supports[i].Cy != 0
      )
        supportExist = true;
    }

    //**If support in node then HighLight
    if (supportExist == true) {
      if (element.OverlapLeftNode(pos))
        circle(element.startPos.x, element.startPos.y, 40);

      //**Check beamEnd
      if (element.OverlapRightNode(pos) && element.id == elements.length - 1)
        circle(element.endPos.x, element.endPos.y, 40);
    }
    pop();
  }

  HighLightSupportFixedDelete(pos, element, supports) {
    push();
    noStroke();
    fill(255, 0, 0, 100);

    //**Check if support exist in node
    let supportExist = false;
    let tol = 20;

    for (let i = 0; i < supports.length; i++) {
      if (
        mousePosWorld.x < supports[i].posSupport.x + tol &&
        mousePosWorld.x > supports[i].posSupport.x - tol &&
        supports[i].Cz != 0
      )
        supportExist = true;
    }

    //**If support in node then HighLight
    if (supportExist == true) {
      if (element.OverlapLeftNode(pos))
        circle(element.startPos.x, element.startPos.y, 40);

      //**Check beamEnd
      if (element.OverlapRightNode(pos) && element.id == elements.length - 1)
        circle(element.endPos.x, element.endPos.y, 40);
    }
    pop();
  }

  LinePoint(lineStart, lineEnd, point) {
    // get distance from the point to the two ends of the line
    let d1 = dist(point.x, point.y, lineStart.x, lineStart.y);
    let d2 = dist(point.x, point.y, lineEnd.x, lineEnd.y);

    // get the length of the line
    let lineLen = dist(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);

    // since floats are so minutely accurate, add
    // a little buffer zone that will give collision
    let buffer = 10; // higher # = less accurate

    // if the two distances are equal to the line's
    // length, the point is on the line!
    // note we use the buffer here to give a range,
    // rather than one #
    if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
      return true;
    }
    return false;
  }

  LineCircle(lineStart, lineEnd, point) {
    // get distance from the point to the two ends of the line
    let d1 = dist(point.x, point.y, lineStart.x, lineStart.y);
    let d2 = dist(point.x, point.y, lineEnd.x, lineEnd.y);

    // get the length of the line
    let lineLen = dist(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);

    // since floats are so minutely accurate, add
    // a little buffer zone that will give collision
    let buffer = 5; // higher # = less accurate

    // if the two distances are equal to the line's
    // length, the point is on the line!
    // note we use the buffer here to give a range,
    // rather than one #
    if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
      return true;
    }
    return false;
  }

  HighLight(point, y) {
    push();
    noFill();

    circle(point.x, y, 15);
    line(point.x - 10, y, point.x + 10, y);
    line(point.x, y - 10, point.x, y + 10);

    noStroke();

    //**pos.x in multioplum of stapChange
    let stepChange = 5;
    let remainder = int(point.x) % stepChange;
    if (remainder > stepChange / 2)
      pos.x = int(point.x) + (stepChange - remainder);
    if (remainder <= stepChange / 2) point.x = int(point.x) - remainder;

    fill(0, 250, 0, 100);
    circle(point.x, y, 40);
    pop();

    

  }

  HighLightElement(point, element) {
    push();
    let x_start = element.startPos.x;
    let x_end = element.endPos.x;
    let y = element.startPos.y;
    noFill();
    if (x_start < point.x && point.x < x_end) {
      if (y - 20 < point.y && point.y < y + 20) {
        //circle(point.x, y, 15);
        //line(point.x - 10, y, point.x + 10, y);
        //line(point.x, y - 10, point.x, y + 10);
        strokeWeight(20);
        stroke(0, 255, 0, 100);
        line(x_start, y, x_end, y);
      }
    }
    pop();

    //** Highligth elements
    push();
    let startPos = elements[0].startPos;
    let endPos = elements[elements.length - 1].endPos;
    stroke(0, 255, 0, 100);
    strokeWeight(10);
    line(startPos.x, startPos.y, endPos.x, endPos.y);
    pop();

    
  }
}
