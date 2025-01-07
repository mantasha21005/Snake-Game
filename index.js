const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0; 
let setIntervalId;
let score = 0;


//Getting high score from the local storage
let highScore = localStorage.getItem("high-score")|| 0;
highScoreElement.innerText = `High Score: ${highScore}`;

    //passing a random 0 -30 value as food position
    const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

    //Clearing the timer and reloading the page on game over
    const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

    //changing velocity value based on key press
    const changeDirection = (e) => {
    if ((e.key === "ArrowUp" && velocityY !== 1) || 
        (e.key === "ArrowDown" && velocityY !== -1) || 
        (e.key === "ArrowLeft" && velocityX !== 1) || 
        (e.key === "ArrowRight" && velocityX !== -1)) {
        if (e.key === "ArrowUp") {
            velocityX = 0;
            velocityY = -1; 
        } else if (e.key === "ArrowDown") {
            velocityX = 0;
            velocityY = 1; 
        } else if (e.key === "ArrowLeft") {
            velocityX = -1;
            velocityY = 0; 
        } else if (e.key === "ArrowRight") {
            velocityX = 1;
            velocityY = 0; 
        }
    }
}



const initGame = () => {
    if (gameOver) return handleGameOver();

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    //Updating if the snake hit the food
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);//Pushing food position to snake body array
        score++;//incriment score by 1
        highScore = score > highScore ? score : highScore;
        localStorage.setItem("high-score",highScore);
        scoreElement.innerText =`Score: ${score}`;
        highScoreElement.innerText =`High Score: ${highScore}`;

    }

    //Shifting forward the values of the element in the snake body by one 
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    //Updating the snake 's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    //Checking if the snake head is out of wall, if so setting gameOver to true
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

        //Adding a div for each part of the snake body 
        for (let i = 1; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            gameOver = true;
            break;
        }
    }
    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
     //Checking if the snake head hit the body , if so set gameOver to true
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1]  && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
setIntervalId = setInterval(initGame, 125); // Adjust speed here
document.addEventListener("keydown", changeDirection);