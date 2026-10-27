var currentProjection = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  setupBloodCells();
}

function draw() {
  if (currentProjection === 1) {
    drawProjection1();
  } else if (currentProjection === 2) {
    drawProjection2();
  } else if (currentProjection === 3) {
    drawProjection3();
  }

  drawInstructionsHUD();
}

function drawInstructionsHUD() {
  push();
  textAlign(CENTER, BOTTOM);
  textFont('Space Grotesk');
  textSize(12);
  
  let hintText = "Press [1] Entry Wall - [2] Bloodstream Corridor - [3] Triage Grid - Click anywhere to trigger interaction";
  let textW = textWidth(hintText) + 32;
  
  rectMode(CENTER);
  noStroke();
  fill(15, 23, 30, 210);
  rect(width / 2, height - 24, textW, 30, 15);
  
  fill(249, 250, 251, 200);
  text(hintText, width / 2, height - 19);
  pop();
}

function keyPressed() {
  if (key === '1') currentProjection = 1;
  if (key === '2') currentProjection = 2;
  if (key === '3') currentProjection = 3;
}

function mousePressed() {
  triggerInteraction(currentProjection);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}