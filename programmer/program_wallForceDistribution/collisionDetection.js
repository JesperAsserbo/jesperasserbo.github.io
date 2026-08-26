class CollisionDetection{
  constructor(){
    this.lineStart = new p5.Vector();
    this.lineEnd = new p5.Vector();
    this.point = new p5.Vector();
    
  }
  
    CollisionCirclePoint(node,point) {
    let distToNode = p5.Vector.dist(point, node.pos);
    if (distToNode < node.radius) {
      return true;
    }
    return false;
  }
  
  LinePoint(lineStart,lineEnd,point){

  // get distance from the point to the two ends of the line
  let d1 = dist(point.x,point.y, lineStart.x,lineStart.y);
  let d2 = dist(point.x,point.y, lineEnd.x,lineEnd.y);

  // get the length of the line
  let lineLen = dist(lineStart.x,lineStart.y, lineEnd.x,lineEnd.y);

  // since floats are so minutely accurate, add
  // a little buffer zone that will give collision
  let buffer = 0.1;    // higher # = less accurate

  // if the two distances are equal to the line's 
  // length, the point is on the line!
  // note we use the buffer here to give a range, 
  // rather than one #
  if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
    return true;
  }
  return false;
  }
  
    LineCircle(lineStart,lineEnd,point){

  // get distance from the point to the two ends of the line
  let d1 = dist(point.x,point.y, lineStart.x,lineStart.y);
  let d2 = dist(point.x,point.y, lineEnd.x,lineEnd.y);
      


  // get the length of the line
  let lineLen = dist(lineStart.x,lineStart.y, lineEnd.x,lineEnd.y);

  // since floats are so minutely accurate, add
  // a little buffer zone that will give collision
  let buffer = 5;    // higher # = less accurate

  // if the two distances are equal to the line's 
  // length, the point is on the line!
  // note we use the buffer here to give a range, 
  // rather than one #
  if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
    return true;
  }
  return false;
  }
}