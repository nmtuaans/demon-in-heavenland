document.addEventListener('DOMContentLoaded', () => {

// ----- GLOBAL VARIABLES ----- //

// caching HTML references to shorten code
const grid = document.querySelector(".grid");
const player = document.querySelector('.player');
const menu = document.getElementById('menu');
const body = document.querySelector('body');
const heading = document.getElementById('heading');
const insts = document.getElementById("inst");
const gameOver = document.getElementById("gameOver");

// for background
const background1 = document.querySelector('.background1');
const background2 = document.querySelector('.background2');


let backgroundMoveSpeed = 0.09;


const scoresHTML = document.querySelector('.scores');
const scoreHTML = document.getElementById('score');
const highScoreHTML = document.getElementById('highScore');

let highScore = localStorage.getItem('highScore');
let score = 0;
let scoreSpeed = 0.01;

// for sound
var mySound;
var myMusic;
var myEffect;

player.style.backgroundImage = "url(player_01.png)";

let playerPosition = 0;
let ground = playerPosition;
let isMenu = true;
let isJumping = false;
let isGameOver = false;


// PLAYER MOVEMENT
let frame = 1;
let jumpHeight = playerPosition;
let jumpTimeInterval = 10.5; // jump Speed (higher  slower jump) (ms)
let jumpSpeed = 1.5; // how much % per jumpTimeInterval (px)
let downSpeed = 0.2;
let gravity = 0.94; // how geometric the jumps
jumpHeight += 55; // how high player jump (%)

let playerAnimationSpeed = 200; // how fast running animation runs (ms)


let obstacleSpeed = 1.8;


// ----- INPUT CHECK ----- //

document.addEventListener('keydown', (e)=>{

// Listen for Spacebar key (desktop)

    if (!isGameOver && e.code === "Space"){

        input();
        console.log("Touched");
    }

    else if (isGameOver && e.code === "Space"){
      
        location.reload();
    }
})


// Listen for Tap on screen (mobile)

document.addEventListener('touchstart', (e)=>{
    if(isGameOver) {
        location.reload();
    }
    else {
        input();
        console.log("Touched");
    }

})


// ----- MENU TRANSITIONS ----- //

function menuTransitions(){

    console.log("Menu switched off.");
    
    heading.style.visibility = "hidden";

    insts.style.visibility = "hidden";

}


// ----- MAIN GAME LOGIC ----- //

function input(e) {

    if (isMenu)
    {
        isMenu = false;
        menuTransitions(); // Hide Menu
        playerRun();
        console.log("Start");
        manageObstacles();
        scrollBackground();
        addScore();
    }

    // when menu is gone AND player is not already jumping
    if (!isMenu && !isJumping && !isGameOver)
    {
            isJumping = true;
            jump();
            console.log("Jumping");
    }

}


// ----- PLAYER ANIMATION ----- //

function playerRun() {

myMusic = new sound("holy_music.wav");

myMusic.play();


    setInterval(runningLoop, playerAnimationSpeed);

    function runningLoop()
    {
        console.log("Running");

        if (frame === 1  && !isJumping && !isGameOver)
        {
            player.style.backgroundImage = "url(player_02.png)";
            frame = 2;
        }

        else if (frame === 2  && !isJumping && !isGameOver)
        {
            player.style.backgroundImage = "url(player_01.png)";
            frame = 1;
        }
        else if (isGameOver)
        {
            player.style.backgroundImage = "url(player_died.png)";
            myMusic.stop();
        }
    }

}


// ----- PLAYER JUMP ----- //

function jump()
{ mySound = new sound("wings.wav");
  mySound.play ()

  let timer = setInterval( function()
  {

    if (isGameOver)
    {
        clearInterval(timer);
    }

    console.log("UP");

    // ----- GOING UP ----- //

    // 1. changing background image
    player.style.backgroundImage = "url(player_jump.png)";

    // 2. calculating jumping up
    jumpSpeed = 1
    playerPosition += jumpSpeed;
    jumpSpeed = jumpSpeed * gravity;
    if (jumpSpeed <= 0.17 ) { jumpSpeed = 0.2;}

    // 3. feeding new position to CSS
    player.style.bottom = playerPosition + '%';

            // if jumping player reacher max height...
            if (playerPosition >=  jumpHeight) {

                console.log("DOWN");

                clearInterval(timer);

                let downTimer = setInterval ( function() { // start falling down

                    // calculating falling motion
                    playerPosition -= downSpeed;
                    downSpeed = downSpeed + (downSpeed*0.08);

                    // feeding calculated result to CSS
                    player.style.bottom = playerPosition  + '%';

                    // changing background image
                    player.style.backgroundImage = "url(player_land.png)" // Replace the player sprite

                    // if player reaches ground variable ...
                    if (playerPosition <= ground)
                    {
                        console.log("Ground");

                        clearInterval(downTimer); //stop falling down

                        // reset variables
                        jumpSpeed = 1;
                        downSpeed = 0.3;
                        isJumping = false;
                        playerPosition = ground;
                        player.style.bottom = playerPosition  + '%';
                    }

                }, jumpTimeInterval)

            }

    }, jumpTimeInterval)
}


// ----- OBSTACLES ----- //

function manageObstacles()
{
  
    randomCall();
}


// ----- RANDOM OBSTACLE CALL ----- //

var randomTime;

 function changeTime(){
    // assigning random number within certain minimum and maximum range
    randomTime = Math.floor(Math.random() * (3000 - 1000) + 1000); // generates number between and including 1000 and 5000
 }


 function randomCall(){

    console.log("RANDOM CALL at " + randomTime + " milliseconds");

    changeTime();

    setTimeout(randomCall, randomTime); // call this very function after time passed = random number within certain range

    generateObstacle();

 }


// ----- GENERATE AND MOVE OBSTACLE ----- //

function generateObstacle()
{
    console.log("OBSTACLE CREATION");

    // Initialize variable for X value of obstacle position
    let obstacleXPosition = 1920;

    // Create Obstacle
    const obstacle = document.createElement('div');

    // only if game is not over add "obstacle" from CSS to created div

    if (!isGameOver) {obstacle.classList.add('obstacle');}

    grid.appendChild(obstacle); // add obstacle div to "grid" HTML element
    obstacle.style.left = obstacleXPosition + "px"; // assign above position variable to CSS left property


    // Move Obstacle
   let moveObstacle = setInterval(() =>
   {
       // ----- MOVE ----- //

       if(!isGameOver)
       {
            obstacleXPosition -= obstacleSpeed;

            obstacle.style.left = obstacleXPosition + 'px';
       }

       // ----- DELETE WHEN OFF SCREEN ----- //

        if (obstacleXPosition <= -50)
        {
            obstacle.classList.remove('obstacle');
            try{grid.removeChild(obstacle)}
            catch(error){}
        }

        // ----- DETECT COLLISION WITH PLAYER ----- //
        // if obstacle position comes within a certain range ....
        if (obstacleXPosition > 5 &&
            obstacleXPosition < 50 &&
            playerPosition < 40)
        {
            // then ...
            console.log("Collision!");
            clearInterval(moveObstacle);
            myEffect = new sound("church_bell.wav");
            myEffect.play();
            GameOver();
        }

   }, 1);    
}


// ----- BACKGROUND ----- //

function scrollBackground(){

    let background1Pos = 0; // position of first background
    let background2Pos = 99.9; // position of second background


    setInterval(() => {

        if (!isGameOver){

            // ----- MOVE BACKGROUND ----- //

            background1Pos = background1Pos - backgroundMoveSpeed;

            background1.style.left = background1Pos + '%';

            background2Pos = background2Pos - backgroundMoveSpeed;

            background2.style.left = background2Pos + '%';
        }

        // ----- RESET BACKGROUND ----- //

        if (background1Pos <= -9999999999)
        {
            background1Pos = 10000000000000000;
        }

        if (background2Pos <= -99)
        {
            background2Pos = 100;
        }

    }, 1);

}


// | -------- SCORE SYSTEM-------- |

function addScore() {

    setInterval( () => {

        if (!isGameOver)
        {
            score += 1;

            if (score > highScore)
            {
                highScore = score;
            }
            
            scoreHTML.innerHTML =  score;

            highScoreHTML.innerHTML = "High Score: " + highScore;

            if (score%1000 == 0) { // Increase difficulty and score rate at every 1000 score

                backgroundMoveSpeed += 0.01;
               
                obstacleSpeed += 0.3;

            }
        }

        if (isGameOver) {
            localStorage.setItem("highScore", highScore);
        }

    }, scoreSpeed);

}


// ----- GAME OVER ----- //

function GameOver()
{
    gameOver.style.visibility = "visible";
    body.style.backgroundColor = "#060203";
    isGameOver = true;
}


// ----- SOUND ----- //

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

})