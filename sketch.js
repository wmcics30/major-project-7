// State Variables and Arrays Assignment
// Mueez Rafiquie
// Sept 21, 2019
//
//The objective of this game is stay alive while getting the highest score possible. The "How to play" section has the instructions for the game.
//State Variables are used in this game to change between the different screens and game modes as well as shot types.
//Arrays are used to store information for the aliens and bullets making it easy to loop though them with functions.
//When playing the game, it works best to scale it to 75% on WMCI computers with chrome.
//
//For extra material I used youtube videos to teach myself about classes to make my system of bringing down aliens possible
//and also added some CSS to my website

//Global Variables

//time variables



let timeBetweenWaves;
let lastTimeWaveWasSent;

let singleWaveGap = 100;
let spacerBetweenAliens = 0;

//plane variables
let plane;
let planeX;
let planeY;
let canPlaneMove = true;
let scalar = 0.2;

//state variables: one that changes the type of bullets the plane shoots and the other
//which switches the game between screens
let shotType = "basic shot";
let gameMode = "hard mode";
let currentGameMode;

//arrays to store the data from the objects being used to push information into them
let basicShot = [];
let doubleShot = [];
let aliens = [];

let isShooting = false;
let direction = "right";

//running score which will get reset when replayed
let score = 0;
let counter = 0;

//Using the preload function to loading items before hand so there is no delay in displaying them
function preload() {
  //loading images
  plane = loadImage("assets/plane.png");
  background1 = loadImage("assets/background1.png");
  alienImage = loadImage("assets/alien.png");

  //loading sounds
  soundFormats("mp3");
  shootingSound = loadSound("assets/shootingsound.mp3");
}

//creating canvas and defining variables in setup()
function setup() {
  //creating canvas
  createCanvas(windowWidth, windowHeight);

  angleMode(DEGREES);

  //pushing the starting aliens into the aliens array
  createNewAliens();

  //defining variables
  lastTimeWaveWasSent = 0;
  planeX = width / 2;
  planeY = height / 1.1;
  canPlaneMove = true;
  //setting a volume for shooting sound
  shootingSound.setVolume(0.2);
}

//all put inside the draw loop so it is constantly being drawn keeps responding when input is continously given
function draw() {
  //using state variables to transition through different game screens and modes
  if (gameMode === "main menu") {
    showMenu();
    checkIfButtonClicked();
  } else if (gameMode === "easy mode") {
    runEasyModeGame();
  } else if (gameMode === "hard mode") {
    runHardModeGame();
  } else if (gameMode === "instructions menu") {
    showInstructions();
    checkIfBackButtonClicked();
  } else if (gameMode === "game over") {
    showGameOverScreen();
    checkIfAResetButtonsClicked();
  }
}

//added this so you can zoom in and out to fit the screen and don't have to refresh screen since it doesn't fit properly right now
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//combining all the function necessary to run the game
function runGame() {
  //drawing background
  image(background1, 0, 0, width * 2, height * 2);

  //displays score
  showScore();

  //enabling plane to move and shoot
  moveInsideCanvas();
  createContinousShots();
  shoot();

  //moving aliens down the screen in waves
  sendAlienWaves();
  moveAliens();

  //detecting if an alien is his by a bullet or if the plane is hit by and alien
  detectIfAlienHitByBulletAndDestroy();
  detectIfPlaneHitByAlien();

  //drawing the plane image
  image(plane, planeX, planeY, plane.width * scalar, plane.height * scalar);

  //these last two functions were used to help create the collision detection system but are not necessary for the game to run
  // drawHitBox();
  // drawPlaneHitBox();
}

//running easy version of game
function runEasyModeGame() {
  currentGameMode = "easy mode";
  timeBetweenWaves = 7000;
  runGame();
}

//running hard version of game
function runHardModeGame() {
  currentGameMode = "hard mode";
  //lowering time between waves to increase difficulty
  timeBetweenWaves = 7000;
  runGame();
}

//displaying main menu
function showMenu() {
  background(200);
  //easy Mode button
  rectMode(CENTER);
  fill(0, 255, 0, 125);
  rect(width / 2, height / 2 - 350, 400, 150);
  textAlign(CENTER, CENTER);
  textSize(50);
  fill(0);
  text("Easy Mode", width / 2, height / 2 - 350);

  //hard Mode button
  fill(255, 0, 0, 125);
  rect(width / 2, height / 2, 400, 150);
  fill(0);
  text("Hard Mode", width / 2, height / 2);

  //instructions button
  fill(0, 0, 0, 50);
  rect(width / 2, height / 2 + 350, 400, 150);
  fill(0);
  text("How to Play", width / 2, height / 2 + 350);
}

//checking if a button on the main meny is clicked
//changes colour when mouse is hovered over the button and changes gamemode depending on what's clicked
function checkIfButtonClicked() {
  if (
    mouseX > width / 2 - 200 &&
    mouseX < width / 2 + 200 &&
    mouseY > height / 2 - 350 - 75 &&
    mouseY < height / 2 - 350 + 75
  ) {
    //easy mode button
    fill(255);
    text("Easy Mode", width / 2, height / 2 - 350);
    if (mouseIsPressed) {
      gameMode = "easy mode";
    }
  }
  if (
    mouseX > width / 2 - 200 &&
    mouseX < width / 2 + 200 &&
    mouseY > height / 2 - 75 &&
    mouseY < height / 2 + 75
  ) {
    //hard mode button
    fill(255);
    text("Hard Mode", width / 2, height / 2);
    if (mouseIsPressed) {
      gameMode = "hard mode";
    }
  }
  if (
    mouseX > width / 2 - 200 &&
    mouseX < width / 2 + 200 &&
    mouseY > height / 2 + 350 - 75 &&
    mouseY < height / 2 + 350 + 75
  ) {
    //instructions button
    fill(255);
    text("How to Play", width / 2, height / 2 + 350);
    if (mouseIsPressed) {
      gameMode = "instructions menu";
    }
  }
}

//displaying instructions screen
function showInstructions() {
  background(200);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  textSize(100);
  fill(0);
  text("Instructions", width / 2, height / 2 - 350);

  //writing out instructions
  textSize(30);
  fill(0);
  text(
    "Use the WASD keys to control the plane and the Space Button to shoot",
    width / 2,
    height / 2 - 150
  );
  text(
    "Aliens will come down in waves to try and destroy you",
    width / 2,
    height / 2 - 80
  );
  text("Easy: Seven Seconds Per Wave", width / 2 - 300, height / 2 - 30);
  text("Hard: Two Seconds Per Wave", width / 2 + 300, height / 2 - 30);
  text(
    "If you are hit by an Alien or one reaches the bottom, it's GAME OVER",
    width / 2,
    height / 2 + 50
  );
  text(
    "Get the HIGHEST SCORE POSSIBLE before the Aliens win",
    width / 2,
    height / 2 + 135
  );
  text(
    "Press the L key to switch between basic and double shot",
    width / 2,
    height / 2 + 215
  );
  text(
    "To access the main menu at any time, press the m key",
    width / 2,
    height / 2 + 250
  );

  //back to main menu button
  textSize(80);
  fill(255);
  text("back", 250, 125);
}

//displaying a "back button" which changes colour when hovered over and sends you back to the
//main menu if clicked
function checkIfBackButtonClicked() {
  if (
    mouseX > 250 - 200 &&
    mouseX < 250 + 200 &&
    mouseY > 125 - 75 &&
    mouseY < 125 + 75
  ) {
    fill(0, 255, 0, 125);
    text("back", 250, 125);
    if (mouseIsPressed) {
      gameMode = "main menu";
    }
  }
}

//displaying the screen which will come up when you lose
function showGameOverScreen() {
  background(0);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  //game over text
  textSize(200);
  fill(255, 0, 0);
  text("GAME OVER", width / 2, height / 4);

  //displaying score
  fill(0, 0, 0, 50);
  rect(width / 2 - 400, height / 2 + 350, 400, 150);
  textSize(80);
  fill(255);
  text("Score: " + score, width / 2, height / 2);

  //main menu button
  fill(0, 0, 0, 50);
  rect(width / 2 - 400, height / 2 + 350, 400, 150);
  textSize(80);
  fill(255);
  text("Main Menu", width / 2 - 400, height / 2 + 350);

  //play again button
  fill(0, 0, 0, 50);
  rect(width / 2 + 400, height / 2 + 350, 400, 150);
  textSize(80);
  fill(255);
  text("Play Again", width / 2 + 400, height / 2 + 350);
}

//checking if buttons on the game over screen are clicked, changing colours when hovered over
function checkIfAResetButtonsClicked() {
  if (
    mouseX > width / 2 + 400 - 200 &&
    mouseX < width / 2 + 400 + 200 &&
    mouseY > height / 2 + 350 - 75 &&
    mouseY < height / 2 + 350 + 75
  ) {
    //play again button
    fill(0, 255, 0, 125);
    text("Play Again", width / 2 + 400, height / 2 + 350);
    if (mouseIsPressed) {
      score = 0;
      if (currentGameMode === "easy mode") {
        gameMode = "easy mode";
      } else if (currentGameMode === "hard mode") {
        gameMode = "hard mode";
      }
    }
  } else if (
    mouseX > width / 2 - 400 - 200 &&
    mouseX < width / 2 - 400 + 200 &&
    mouseY > height / 2 + 350 - 75 &&
    mouseY < height / 2 + 350 + 75
  ) {
    //main menu button
    fill(0, 255, 0, 125);
    text("Main Menu", width / 2 - 400, height / 2 + 350);
    if (mouseIsPressed) {
      score = 0;
      gameMode = "main menu";
    }
  }
}

//displaying score with the score variable while the game is running in the top right
function showScore() {
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(80);
  fill(255);
  text(score, width - 90, 90);
}

//since this loops the createaliens function in setup it messes with the game
// function windowResized() {
//   setup();
// }

//adding mouseWheel function which will use the same scalar variable to control the size of the plane
//this doesn't have a practical use in the game yet but will in a future version
function mouseWheel() {
  if (canPlaneMove === true) {
    if (event.delta > 0) {
      scalar *= 1.8;
    } else if (event.delta < 0) {
      scalar /= 1.8;
    }
  }
}

//allowing plane to move within a defined space in the canvas
function movePlane() {
  //same application as the mousewheel function but with arrow keys
  if (canPlaneMove === true) {
    if (keyCode === UP_ARROW) {
      scalar *= 1.02;
    } else if (keyCode === DOWN_ARROW) {
      scalar /= 1.02;
    }
    //changing x and y cords with WASD keys to move image
    if (keyIsDown(87)) {
      imageMode(CENTER);
      image(background1, 0, 0, width * 2, height * 2); //w
      showScore();
      planeY -= 10;
    } else if (keyIsDown(65)) {
      image(background1, 0, 0, width * 2, height * 2); //a
      showScore();
      planeX -= 10;
    } else if (keyIsDown(83)) {
      image(background1, 0, 0, width * 2, height * 2); //s
      showScore();
      planeY += 10;
    } else if (keyIsDown(68)) {
      image(background1, 0, 0, width * 2, height * 2); //d
      showScore();
      planeX += 10;
    }
  }
}

//changes the x or y cord to move the plane back toward the inside of canvas when it hits the edge to keep it in
function keepInsideCanvas() {
  if (keyIsPressed && isInsideCanvas() === "over west") {
    planeX += 10;
  } else if (keyIsPressed && isInsideCanvas() === "over east") {
    planeX -= 10;
  } else if (keyIsPressed && isInsideCanvas() === "over north") {
    planeY += 10;
  } else if (keyIsPressed && isInsideCanvas() === "over south") {
    planeY -= 10;
  }
}

//checks if the plane is inside canvas and if not returns which direction it is over
function isInsideCanvas() {
  if (planeX + 150 * scalar > width) {
    return "over east";
  } else if (planeX - 130 * scalar < 0) {
    return "over west";
  } else if (planeY + 210 * scalar > height) {
    return "over south";
  } else if (planeY - 210 * scalar < height * 0.65) {
    return "over north";
  } else {
    return true;
  }
}

//combining the two plane movement functions
function moveInsideCanvas() {
  if (keyIsPressed && isInsideCanvas() === true) {
    //controlling the image with WASD keys
    movePlane();
  } else {
    //keeping image inside cavas if at the edge
    keepInsideCanvas();
  }
}

function resetArrays() {
  basicShot = [];
  doubleShot = [];
  aliens = [];
}

//allowing plane to shoot
function keyPressed() {
  if (keyCode === 32 && shotType === "basic shot") {
    //playing sound and created the object for the basic shot
    shootingSound.play();
    let basicShotValues = {
      x: planeX,
      y: planeY - 210 * scalar,
      r: 5,
      dy: -5
    };
    basicShot.push(basicShotValues);
  } else if (keyCode === 32 && shotType === "double shot") {
    //playing sound and created the object for the double shot
    shootingSound.play();
    let doubleShotValues = {
      x: planeX,
      y: planeY - 210 * scalar,
      r: 5,
      dy: -5
    };
    doubleShot.push(doubleShotValues);
  }

  if (shotType === "basic-continuous shot") {
    if (keyCode === 32) {
      isShooting = true;
    }
  }

  //allowing you to switch between shot types
  if (keyCode === 76) {
    if (shotType === "basic shot") {
      shotType = "double shot";
    } else if (shotType === "double shot") {
      shotType = "basic shot";
    }
  }
  //allowing the menu to be accessed at any time by using the "m" key
  else if (keyCode === 77) {
    gameMode = "main menu";
    score = 0;
    resetArrays();
  }
}

function keyReleased() {
  if (keyCode === 32) {
    isShooting = false;
  }
}

function createContinousShots() {
  //creating objects in which information about the bullets is stored to be pushed into arrays
  if (keyIsDown) {
    if (frameCount % 8 === 0) {
      if (isShooting && shotType === "basic shot") {
        //playing sound and created the object for the basic shot
        shootingSound.play();
        let basicShotValues = {
          x: planeX,
          y: planeY - 210 * scalar,
          r: 5,
          dy: -5
        };
        basicShot.push(basicShotValues);
      } else if (isShooting && shotType === "double shot") {
        //playing sound and created the object for the double shot
        shootingSound.play();
        let doubleShotValues = {
          x: planeX,
          y: planeY - 210 * scalar,
          r: 5,
          dy: -5
        };
        doubleShot.push(doubleShotValues);
      }
    }
  }
}

//looping through the basicShot array to create a bullet for every value entered when the space key is hit
function shootBasicShot() {
  for (let i = basicShot.length - 1; i >= 0; i--) {
    basicShot[i].y += basicShot[i].dy;
    noStroke();
    fill(180);
    ellipse(
      basicShot[i].x,
      basicShot[i].y,
      basicShot[i].r * 2,
      basicShot[i].r * 2
    );
    //getting rid of bullets once they are off the screen
    if (basicShot[i].y < 0) {
      basicShot.shift();
    }
  }
}

//looping through the doubleShot array to create a bullet for every value entered when the space key is hit
//DOUBLE SHOT BULLETS CANNOT BE DETECTED YET THEY WILL NOT KILL THE ALIENS
function shootDoubleShot() {
  for (let i = doubleShot.length - 1; i >= 0; i--) {
    doubleShot[i].y += doubleShot[i].dy;
    noStroke();
    fill(180);
    ellipse(
      doubleShot[i].x - 5,
      doubleShot[i].y,
      doubleShot[i].r * 2,
      doubleShot[i].r * 2
    );
    ellipse(
      doubleShot[i].x + 5,
      doubleShot[i].y,
      doubleShot[i].r * 2,
      doubleShot[i].r * 2
    );
    //getting rid of bullets once they are off the screen
    if (doubleShot[i].y < 0) {
      doubleShot.shift();
    }
  }
}

//combining the shooting functions so that bullets are shot depending on what the state is
function shoot() {
  if (shotType === "basic shot") {
    shootBasicShot();
  } else if (shotType === "double shot") {
    shootDoubleShot();
  }
}

//detects if an any alien is hit by any bullet by looping throught both arrays

function detectIfAlienHitByBulletAndDestroy() {
  if (shotType === "basic shot") {
    
    for (let i = basicShot.length - 1; i >= 0; i--) {
      for (let j = aliens.length - 1; j >= 0; j--) {
        //checking is a bullet hits an aliens hitbox
        if (
          basicShot[i].x + basicShot[i].r > aliens[j].x - 28 &&
          basicShot[i].x + basicShot[i].r < aliens[j].x + 28 &&
          basicShot[i].y + basicShot[i].r > aliens[j].y - 25 &&
          basicShot[i].y + basicShot[i].r < aliens[j].y + 25
        ) {
          //getting rid of aliens that are hit
          basicShot.splice(i, 1);
          aliens.splice(j, 1);
          //adding one to the score for every alien that is killed
          counter += 1;
          score += 1;
          return;
        }
        // if (counter = 2) {
        //   aliens.splice(j, 1);
        //   counter = 0;
        // }
      }
    }
  }

  // DOUBLE SHOT BULLETS CANNOT BE DETECTED YET THEY WILL NOT KILL THE ALIENS
  else if (shotType === "double shot") {
    for (let i = doubleShot.length - 1 - 1; i >= 0; i--) {
      for (let j = aliens.length - 1; j >= 0; j--) {
        if (
          doubleShot[i].x > aliens[j].x - 28 &&
          doubleShot[i].x < aliens[j].x + 25 &&
          doubleShot[i].y > aliens[j].y - 25 &&
          doubleShot[i].y < aliens[j].y + 25
        ) {
          //getting rid of aliens that are hit
          aliens.splice(j, 1);
          //adding one to the score for every alien that is killed
          score += 1;
        }
      }
    }
  }
}

// DOUBLE SHOT BULLETS CANNOT BE DETECTED YET THEY WILL NOT KILL THE ALIENS

//draws a hitbox around the palne
function drawPlaneHitBox() {
  fill(255);
  rect(planeX - 20 * scalar, planeY - 190 * scalar, 40 * scalar, 250 * scalar);
  rect(planeX - 125 * scalar, planeY + 1 * scalar, 255 * scalar, 200 * scalar);
}

//detects if the plane is hit by an alien by comparing the hitboxes of both
function detectIfPlaneHitByAlien() {
  for (let i = aliens.length - 1; i >= 0; i--) {
    if (
      aliens[i].x + 25 >= planeX - 20 * scalar &&
      aliens[i].x - 28 <= planeX + 20 * scalar &&
      aliens[i].y + 25 >= planeY - 190 * scalar &&
      aliens[i].y + 25 <= planeY + 60 * scalar
    ) {
      gameMode = "game over";
      //wipes current aliens off the screen
      resetArrays();
    } else if (
      aliens[i].x + 25 >= planeX - 125 * scalar &&
      aliens[i].x - 28 <= planeX + 130 * scalar &&
      aliens[i].y + 25 >= planeY + 1 * scalar &&
      aliens[i].y - 25 <= planeY + 201 * scalar
    ) {
      gameMode = "game over";
      //wipes current aliens off the screen
      resetArrays();
    }
  }
}

//creating a class to store basic information from which all aliens will be made
class Alien {
  //sample alien coordinate values
  constructor(x, y, path) {
    this.x = x;
    this.y = y;
    this.path = path;
    this.dx = 15;
    this.dy = 1;
    this.theta = -91;
  }

  // //moving the individual alien according to difficulty
  // moveIndividualAliens() {
  //   if (this.path === "simple top-down") {
  //     let movementValue = 15;
  //     for (let i = aliens.length - 1; i >= 0; i--) {
  //       this.x = this.x + movementValue;
  //       this.y = this.y + 0.5;
  //       if (aliens[i].x + 50 > width) {
  //         aliens.shift();
  //         // gameMode = "game over";
  //         // resetArrays();
  //       }
  //     }

  //     imageMode(CENTER);
  //     image(alienImage, this.x, this.y, 50, 50);
  //   }
  // }

  moveIndividualAliens() {
    push();
    if (this.path === "simple top-down") {
      // for (let i = aliens.length - 1; i >= 0; i--) {
      this.y += this.dy;
      // if (aliens[i].x > height) {
      // aliens.shift();
      // gameMode = "game over";
      // resetArrays();
      // }
      // }
    } else if (this.path === "simple zigzag") {
      this.x += this.dx;
      this.y += this.dy;
      if (this.x >= width - 100 || this.x <= 25) {
        this.dx *= -1;
      }
    } else if (this.path === "tight-left zigzag") {
      this.x += this.dx;
      this.y += this.dy;
      if (this.x >= 400 || this.x <= 25) {
        this.dx *= -1;
      }
    } else if (this.path === "tight-right zigzag") {
      this.x += this.dx;
      this.y += this.dy;
      if (this.x >= width - 25 || this.x <= width - 400) {
        this.dx *= -1;
      }
    } else if (this.path === "circle thing") {
      
      this.x = cos(this.theta) * 150;
      this.y = (sin(this.theta) * 150);
      this.theta -= 5

      // if (this.x > 50) {
      //   this.x = 50;
      // }

      // display

      translate(this.x + width/2, this.y + 300);
      
      // translate(width/2, 200);
    }
    imageMode(CENTER);
    image(alienImage, this.x, this.y, 50, 50);
    pop();
  }

  //creating a hitbox for an individual aliens
  individualHitBox() {
    noStroke();
    noFill();
    rect(this.x - 28, this.y - 25, 53, 50);
  }
}

//pushing alien values into the aliens array to be created
function createNewAliens() {
  let lastStager = 0 
  let startingXPositions = [0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1, 0.05];
  let startingXPositions1 = [0.70, 0.65, 0.60, 0.55, 0.50, 0.45, 0.4, 0.35];

  for (i = 0; i <= 8; i++) {
    aliens.push(new Alien(width * startingXPositions[i], -19, "simple zigzag"));
    // aliens.push(new Alien(width * startingXPositions[i], 50, "simple top-down"));

    // aliens.push(new Alien(width * startingXPositions1[i], 0, "simple top-down"));
  }
  // for (i = 0; i <= 8; i++) { 
  //   aliens[i].path = "circle thing"

  // }
  // aliens.push(new Alien(width * 0.75, 50, "simple top-down"));
  aliens.push(new Alien(50, 0, "tight-left zigzag"));
  aliens.push(new Alien(width - 370, 0, "tight-right zigzag"));
  // aliens.push(new Alien(0, 0, "circle thing"));
}





//create serperate time between wave numbers for different paths so that there are 
//more things for zigzags and it's not so spaced out








//using millis to continously send waves of aliens over time
function sendAlienWaves() {
  if (millis() >= lastTimeWaveWasSent + timeBetweenWaves) {
    createNewAliens();

    moveAliens();
    lastTimeWaveWasSent = millis();
  }
}

//looping through all the aliens created to apply the movement function to each of them
function moveAliens() {
  for (let i = aliens.length - 1; i >= 0; i--) {
    aliens[i].moveIndividualAliens();
    // if (aliens[i].y - 25 > height) {
    //   aliens.shift();
    // gameMode = "game over";
    // resetArrays();
    // }
  }
}

//looping through all aliens to draw a hitbox
function drawHitBox() {
  for (let i = aliens.length - 1; i >= 0; i--) {
    aliens[i].individualHitBox();
  }
}
