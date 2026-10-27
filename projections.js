// Projection 1: Entry logo
var intensePulse = false;
var intensity = 0;
var titleImg;

function preload() {
  titleImg = loadImage('the-unseen-title.png');
}

function drawProjection1() {
  intensity = lerp(intensity, intensePulse ? 1 : 0, 0.04);
  background('#0F171E');

  push();
  drawingContext.filter = 'blur(100px)';
  noStroke();
  fill(0, 30, 79, 200 * (1 - intensity * 0.5));
  ellipse(width / 2, height / 2, 1000, 1000);

  fill(180, 0, 42, 120 + intensity * 100);
  ellipse(width / 2 - 180, height / 2, 450 + intensity * 200, 450 + intensity * 200);
  fill(255, 122, 0, 90 + intensity * 120);
  ellipse(width / 2 - 180, height / 2, 300 + intensity * 150, 300 + intensity * 150);
  pop();

  let beat = pow(sin(frameCount * (0.04 + intensity * 0.04)), 8);
  let warpAmp = 14 + intensity * 28 + beat * 18;

  push();
  translate(width * 0.32, height * 0.5);
  let armLength = 180, armWidth = 60, step = 15;

  noFill();
  for (let layer = 1; layer <= 6; layer++) {
    strokeWeight(2);
    stroke(layer % 2 === 0 ? color(255, 122, 0, 190 - layer * 20) : color(180, 0, 42, 220 - layer * 20));
    drawWarpedCrossOutline(armLength + layer * 6, armWidth + layer * 6, warpAmp + layer * 4, layer * 10);
  }

  stroke('#F9FAFB');
  strokeWeight(1);
  for (let x = -armLength; x <= armLength; x += step) {
    for (let y = -armLength; y <= armLength; y += step) {
      if (isInsideCross(x, y, armLength, armWidth) && isInsideCross(x + step, y + step, armLength, armWidth)) {
        let p1 = getWarpedPoint(x, y, warpAmp);
        let p2 = getWarpedPoint(x + step, y, warpAmp);
        let p3 = getWarpedPoint(x + step, y + step, warpAmp);
        let p4 = getWarpedPoint(x, y + step, warpAmp);

        fill(0, 30, 79, 140);
        beginShape();
        vertex(p1.x, p1.y); vertex(p2.x, p2.y); vertex(p3.x, p3.y); vertex(p4.x, p4.y);
        endShape(CLOSE);
      }
    }
  }
  pop();

  // Title Image
  push();
  let imgWidth = 480;
  let imgHeight = (titleImg.height / titleImg.width) * imgWidth;
  imageMode(CENTER);
  image(titleImg, width * 0.65, height * 0.46, imgWidth, imgHeight);
  pop();
}

function isInsideCross(x, y, L, W) {
  return (abs(x) <= W && abs(y) <= L) || (abs(y) <= W && abs(x) <= L);
}

function getWarpedPoint(x, y, amp) {
  let nX = noise(x * 0.01 + 50, y * 0.01 + 50, frameCount * 0.015) - 0.5;
  let nY = noise(x * 0.01 + 150, y * 0.01 + 150, frameCount * 0.015) - 0.5;
  return createVector(x + nX * amp * 2, y + nY * amp * 2);
}

function drawWarpedCrossOutline(L, W, amp, seedOffset) {
  let pts = [
    createVector(-W, -L), createVector(W, -L), createVector(W, -W), createVector(L, -W),
    createVector(L, W), createVector(W, W), createVector(W, L), createVector(-W, L),
    createVector(-W, W), createVector(-L, W), createVector(-L, -W), createVector(-W, -W)
  ];
  beginShape();
  for (let i = 0; i < pts.length; i++) {
    let next = pts[(i + 1) % pts.length];
    for (let t = 0; t < 1; t += 0.1) {
      let bx = lerp(pts[i].x, next.x, t);
      let by = lerp(pts[i].y, next.y, t);
      let nX = (noise(bx * 0.01 + seedOffset, by * 0.01, frameCount * 0.02) - 0.5) * amp * 2;
      let nY = (noise(bx * 0.01, by * 0.01 + seedOffset, frameCount * 0.02) - 0.5) * amp * 2;
      vertex(bx + nX, by + nY);
    }
  }
  endShape(CLOSE);
}

// Projection 2: Sickle cells
var isSickleCrisis = false;
var morphState = 0;
var cells = [];
var numCells = 80;

function setupBloodCells() {
  for (let i = 0; i < numCells; i++) {
    cells.push({
      x: random(width), y: random(height * 0.22, height * 0.78),
      baseSpeed: random(2.5, 5.2), radius: random(30, 46),
      angle: random(TWO_PI), rotSpeed: random(-0.02, 0.02), noiseSeed: random(1000)
    });
  }
}

function drawProjection2() {
  morphState = lerp(morphState, isSickleCrisis ? 1 : 0, 0.025);
  background(lerpColor(color('#0F171E'), color('#1F030B'), morphState));

  push();
  drawingContext.filter = 'blur(90px)';
  noStroke();
  fill(0, 30, 79, 230 * (1 - morphState));
  rect(0, height * 0.18, width, height * 0.64);

  if (morphState > 0.01) {
    let pulse = sin(frameCount * 0.06) * 60;
    fill(180, 0, 42, 220 * morphState);
    ellipse(width * 0.55, height * 0.5, (750 + pulse) * morphState, 480 * morphState);
    fill(255, 122, 0, 170 * morphState);
    ellipse(width * 0.55, height * 0.5, (420 + pulse) * morphState, 300 * morphState);
  }
  pop();

  noFill();
  stroke(249, 250, 251, 35);
  strokeWeight(1.5);
  for (let side of [-1, 1]) {
    beginShape();
    for (let x = 0; x <= width; x += 40) {
      let baseY = side === -1 ? height * 0.16 : height * 0.84;
      let warp = (noise(x * 0.005, frameCount * 0.01, side) - 0.5) * (20 + morphState * 50);
      vertex(x, baseY + warp);
    }
    endShape();
  }

  for (let c of cells) {
    let distToBlockage = abs(c.x - width * 0.55);
    let jamFactor = 1;
    if (morphState > 0.2 && c.x < width * 0.68 && distToBlockage < 340) {
      jamFactor = map(distToBlockage, 0, 340, 0.03, 0.55) * (1 - morphState * 0.8);
      c.y = lerp(c.y, height * 0.5 + (noise(c.noiseSeed, frameCount * 0.008) - 0.5) * 280, 0.025 * morphState);
    }

    c.x += c.baseSpeed * lerp(1, jamFactor, morphState);
    c.y += sin(frameCount * 0.03 + c.noiseSeed) * (1.2 * (1 - morphState * 0.7));
    c.angle += c.rotSpeed * (1 - morphState * 0.65);

    if (c.x > width + 80) {
      c.x = -80;
      c.y = random(height * 0.22, height * 0.78);
    }

    push();
    translate(c.x, c.y);
    rotate(c.angle);
    let cellCol = lerpColor(color('#B4002A'), color('#FF7A00'), morphState * 0.6);
    stroke('#F9FAFB');
    strokeWeight(lerp(0.6, 1.6, morphState));
    fill(red(cellCol), green(cellCol), blue(cellCol), 220);

    beginShape();
    for (let i = 0; i < 48; i++) {
      let theta = map(i, 0, 48, 0, TWO_PI);
      let rx = cos(theta) * c.radius, ry = sin(theta) * c.radius;
      let phi = cos(theta) * 1.95;
      let thickness = sin(theta) * pow(abs(sin(theta)), 0.35) * (c.radius * 0.36);
      let sx = cos(phi) * (c.radius * 1.15 + thickness) - (c.radius * 1.15 * 0.45);
      let sy = sin(phi) * (c.radius * 1.15 + thickness);
      let fx = lerp(rx, sx, morphState), fy = lerp(ry, sy, morphState);
      vertex(fx, fy);
    }
    endShape(CLOSE);
    pop();
  }
}


// Projection 3: Triage grid
var isCrisis = false;
var transition = 0;
var cellSize = 200;

function drawProjection3() {
  if (isCrisis) {
    transition = lerp(transition, 1, 0.015);
  } else {
    transition = lerp(transition, 0, 0.03);
  }

  let currentBg = lerpColor(color('#0F171E'), color('#B4002A'), transition);
  background(currentBg);

  if (transition > 0.01) {
    push();
    drawingContext.filter = 'blur(120px)'; 
    noStroke();
    
    for (let i = 0; i < 4; i++) {
      let x = noise(frameCount * 0.003, i * 10) * width;
      let y = noise(frameCount * 0.003, i * 20) * height;
      let blobSize = noise(frameCount * 0.002, i * 30) * 800 + 400;
      
      if (i % 2 === 0) {
        fill(255, 122, 0, 160 * transition);
      } else {
        fill(150, 0, 30, 210 * transition);
      }
      ellipse(x, y, blobSize, blobSize);
    }
    pop();
  }

  if (transition < 0.99) {
    let gridOpacity = 255 * (1 - transition); 
    let warpFactor = transition * 200;

    for (let x = 40; x < width - 100; x += cellSize) {
      for (let y = 40; y < height - 100; y += cellSize) {
        let nx = noise(x * 0.01, y * 0.01, frameCount * 0.01) * warpFactor;
        let ny = noise(x * 0.02, y * 0.02, frameCount * 0.01) * warpFactor;
        
        fill(0, 30, 79, gridOpacity * 0.85); 
        stroke(249, 250, 251, gridOpacity * 0.35);
        strokeWeight(1);
        
        beginShape();
        vertex(x - nx, y - ny);
        vertex(x + (cellSize - 15) + nx, y - ny);
        vertex(x + (cellSize - 15) + nx, y + (cellSize - 15) + ny);
        vertex(x - nx, y + (cellSize - 15) + ny);
        endShape(CLOSE);
        
        noStroke();
        fill(249, 250, 251, gridOpacity * 0.08);
        rect(x - nx, y - ny, cellSize - 15, 32);

        textFont('Space Grotesk'); 
        let roomNum = (x + y) / 10;
        let heartRate = 60 + ((x / 10) % 30);
        
        fill(249, 250, 251, gridOpacity);
        textAlign(LEFT, TOP);
        textSize(15);
        text("RM-" + roomNum, x + 12 - nx, y + 8 - ny);
        
        fill(249, 250, 251, gridOpacity * 0.65);
        textSize(10);
        text("PROTOCOL: STANDARD", x + 12 - nx, y + 44 - ny);
        text("STATUS: STABLE", x + 12 - nx, y + 60 - ny);
        
        fill(255, 122, 0, gridOpacity);
        textSize(22);
        text("♥ " + heartRate, x + 12 - nx, y + cellSize - 48 + ny);
      }
    }
  }

  if (transition > 0.05) {
    let textOpacity = 255 * transition;
    fill(249, 250, 251, textOpacity);
    textAlign(CENTER, CENTER);
    textFont('Cormorant Garamond');
    let pulse = sin(frameCount * 0.05) * (5 * transition);
    
    textSize(64 + pulse);
    text("ROOM B4-02 : MARCUS VANCE", width / 2, height / 2 - 60);
    
    textSize(32);
    text("Patient reports sudden, severe radiating pain\nin the chest and lower back.\n\nVitals fluctuating rapidly.", width / 2, height / 2 + 50);
  }
}


function triggerInteraction(proj) {
  if (proj === 1) intensePulse = !intensePulse;
  if (proj === 2) isSickleCrisis = !isSickleCrisis;
  if (proj === 3) isCrisis = !isCrisis;
}