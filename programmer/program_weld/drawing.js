class Drawing {
  constructor() {
    this.insertPos = new p5.Vector(400, 1010);
  }

  Display() {
    //** Side View ************************
    push();

    translate(this.insertPos.x, this.insertPos.y);
    
     
    scale(0.75)
    //circle(0, 0, 20);

    //** Bottom
    strokeWeight(4);
    stroke(0, 0, 0, 200);
    line(0, 0, 600, 0);
    line(0, 100, 600, 100);
    noStroke();
    fill(50, 25);
    rect(0, 0, 600, 100);

    //** Top
    strokeWeight(4);
    stroke(0, 0, 0, 200);
    line(50, -6, 50, -150);
    line(50, -6, 100, -6);
    line(500, -6, 550, -6);
    line(550, -6, 550, -150);
    noStroke();
    beginShape();
    vertex(50, -150);
    vertex(550, -150);
    vertex(550, -6);
    vertex(500, -6);
    vertex(500, -50);
    vertex(100, -50);
    vertex(100, -6);
    vertex(50, -6);
    endShape();

    //** Weld
    stroke(0);
    fill(100, 100, 100, 150);
    strokeWeight(3);
    rect(100, -50, 400, 50);

    //** Mesure
    strokeWeight(2);
    line(100, 10, 100, 235);
    line(150, 10, 150, 160);
    line(450, 10, 450, 160);
    line(500, 10, 500, 235);

    line(90, 150, 510, 150);
    line(90, 225, 510, 225);

    //** Force
    push();
    fill(0);
    circle(300, -25, 4);
    circle(150, -25, 4);//** 1
    circle(450, -25, 4);//** 2
    strokeWeight(6);

    //** V
    line(285, -25, 185, -25);
    triangle(185, -25, 205, -35, 205, -25);
    //** N
    line(300, -40, 300, -140);
    triangle(300, -140, 290, -115, 310, -115);
    //**M
    noFill();
    arc(300, -30, 100, 100, (-3* PI) / 4, -PI / 4);
    translate(246, -47.5);
    fill(0);
    rotate(radians(135));
    triangle(0, 0, -25, -10, -25, 10);
    pop();

    //** Text
    textSize(40);
    textAlign(CENTER, CENTER);
    fill(0);
    noStroke();
    text("a", 125, 175);
    text("L", 300, 175 + 2);
    text("L", 320, 250 + 2);
    text("a", 475, 175);
    textSize(30);
    text("eff",330,185)
    
    pop();

    //** Front View ************************
    push();
    translate(this.insertPos.x + 550, this.insertPos.y);
    scale(0.75)
    //circle(0, 0, 20);

    //** Bottom
    strokeWeight(4);
    stroke(0, 0, 0, 200);
    line(0, 0, 300, 0);
    line(0, 100, 300, 100);
    noStroke();
    fill(50, 25);
    rect(0, 0, 300, 100);

    //** Top
    strokeWeight(4);
    stroke(0, 0, 0, 200);
    line(100, -6, 100, -150);
    line(100, -6, 200, -6);
    line(200, -6, 200, -150);
    noStroke();
    fill(50, 25);
    rect(100, -150, 100, 144);

    //** Weld
    strokeWeight(3);
    fill(100, 100, 100, 150);
    stroke(0);
    triangle(50, 0, 100, 0, 100, -50);
    triangle(250, 0, 200, 0, 200, -50);

    //** Mesure
    strokeWeight(2);
    line(207, 7, 257, 57);
    line(257, 7, 282, 32);
    line(243, 57, 275 + 7, 25 - 7);

    //** Text
    textSize(40);
    textAlign(CENTER, CENTER);
    fill(0);
    noStroke();
    text("a", 282, 57);

    //** Force
    push();
    stroke(0);
    fill(0);
    circle(150, -25, 4);
    strokeWeight(6);

    //** N
    line(150, -40, 150, -140);
    triangle(150, -140, 140, -115, 160, -115);
    pop();

    pop();
    
    
    /*
        //** Detail ************************
    push();
    translate(this.insertPos.x + 1200, this.insertPos.y);
       scale(0.75) 
        strokeWeight(4);
    stroke(0, 0, 0, 200);
    line(0, 0, 600, 0);
    line(0, 100, 600, 100);
    noStroke();
    fill(50, 25);
    rect(0, 0, 600, 100);
    pop();
    */
  }
}
