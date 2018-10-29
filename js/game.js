// canvas
const gameCanvas = document.getElementById('game'); // get the canvas
const ctx = gameCanvas.getContext('2d'); // get the context
const canvasWidth = gameCanvas.width; // canvas width
const canvasHeight = gameCanvas.height; // canvas height

// start button
const startButton = document.querySelector('.startButton');
let startAnimateEverythink = null;

// snake
let snake = [{ x: 40, y: 20 }, { x: 30, y: 20 }]; // initial snake coordinates
const snakeSpeed = 10; // speed of the snake
let direction = 'right' // snake moving direction

// score 
let lastScoreInput = document.querySelector('#lastScoreInput');
let maxScoreInput = document.querySelector('#maxScoreInput');
let lastScore = 0;
let maxScore = 0;

// box
const boxSize = 10; // size of the box
const boxStroke = 'black'; // border color of the box
const boxFill = 'white'; // fill color of the box

// food
let foodCor = []; // food coordinates
let foodEatn = 0; // 1 means created but yet not eated, 0 menas eated need to create new food

// style canvas
ctx.fillStyle = 'black'; // fill color
ctx.fillRect(0, 0, canvasWidth, canvasHeight); // fill the canvas

function drawBox(x, y, strokeColor, fillColor, size) {
    // drawing box with border
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, size, size)
    ctx.strokeStyle = strokeColor;
    ctx.strokeRect(x, y, size, size)
}

// reset the game
function resetGame() {
    clearInterval(startAnimateEverythink);
    snake = [{ x: 40, y: 20 }, { x: 30, y: 20 }];
    direction = 'right';
    foodEatn = 0;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    startButton.classList.remove('hidden');
}

// // draw start button
// function drawStartButton(text) {
//     ctx.fillStyle = 'white';
//     ctx.fillRect()
// }

// animate the snake
function animateSnake(direction, snake, speed) {
    // checks
    function check() {
        // if snake touched to the borders reset the game
        if (snake[0].x > canvasWidth - boxSize || snake[0].x < 0 || snake[0].y > canvasHeight - boxSize || snake[0].y < 0) {
            resetGame();
            if (lastScore > maxScore) {
                maxScore = lastScore;
            }
            lastScore = 0;
            return false;
        }

        // checks is the snake eated the food
        if (snake[0].x === foodCor[0].x && snake[0].y === foodCor[0].y) {
            lastScore += 10;
            foodEatn = 0;
        } else {
            snake.pop();
        }

        // ckechs is snake head touches its body
        snake.map((coordinate, index) => {
            if (index > 0) {
                let x = coordinate.x;
                let y = coordinate.y;
                let x_ = snake[0].x;
                let y_ = snake[0].y;

                if (x === x_ && y === y_) {
                    resetGame();
                    return false;
                }
            }
        })
    }

    // depends on direction change snake body coodrinates
    if (direction === 'right') {
        snake.unshift({ x: snake[0].x + speed, y: snake[0].y });
        check();
    } else if (direction === 'left') {
        snake.unshift({ x: snake[0].x - speed, y: snake[0].y });
        check();
    } else if (direction === 'down') {
        snake.unshift({ x: snake[0].x, y: snake[0].y + speed });
        check();
    } else if (direction === 'up') {
        snake.unshift({ x: snake[0].x, y: snake[0].y - speed });
        check();
    }
}

// food create function
function food(food_) {
    let x;
    let y;

    function createCoordinates() {
        x = (Math.floor((Math.random() * canvasWidth) / boxSize)) * boxSize;
        y = (Math.floor((Math.random() * canvasWidth) / boxSize)) * boxSize;
    }

    createCoordinates()

    // checks is food generated under body
    snake.map((coordinate) => {
        let x_ = coordinate.x;
        let y_ = coordinate.y;

        if (x === x_ && y === y_) {
            createCoordinates();
        } else {
            food_[0] = { x, y };
        }
    })
}

function startGame() {
    startButton.classList.add('hidden');
    startAnimateEverythink = setInterval(animateEverythink, 1000 / 6);
}

function animateEverythink() {
    // listen keyboard events
    window.addEventListener('keydown', (e) => {
        let pressedKey = e.key; // pressed key
        if (pressedKey === 'ArrowUp' && direction !== 'down') {
            direction = 'up'
        } else if (pressedKey === 'ArrowDown' && direction !== 'up') {
            direction = 'down'
        } else if (pressedKey === 'ArrowRight' && direction !== 'left') {
            direction = 'right'
        } else if (pressedKey === 'ArrowLeft' && direction !== 'right') {
            direction = 'left'
        }
    })

    // style canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // check if food was eat or not
    if (!foodEatn) {
        food(foodCor);
        foodEatn = 1; // set as 1 for waiting eat 
    }

    // render the food
    drawBox(foodCor[0].x, foodCor[0].y, 'black', '#fbc531', boxSize)

    // animate snake
    animateSnake(direction, snake, snakeSpeed);

    // render snake
    snake.map((snake_) => {
        let x = snake_.x;
        let y = snake_.y;
        drawBox(x, y, boxStroke, boxFill, boxSize)
    });

    // assign scores
    lastScoreInput.innerText = lastScore;
    maxScoreInput.innerText = maxScore;
}

startButton.addEventListener('click', function () {
    startGame();
});