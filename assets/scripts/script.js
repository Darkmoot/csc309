window.onload = function() {
    
    /* Global variables */
    
    // Initiate the timer to 60, game level to 0, score to 200.
    window.ingame_time = 60;
    window.game_level = 0;
    window.game_score = 200;
    
    /* Global Methods */

    
// Store and retrieve high score to/from local storage.
if (typeof(Storage) !== "undefined") {
    // Store
    // create localStorage name/value pair, name="score", value="00:00"
    // note: name-value pairs always stored as strings
    localStorage.setItem("score", "00:00");
    // Retrieve value of "score" and insert it into element with id="high_score_value"
    document.getElementById("high_score_value").innerHTML = localStorage.getItem("score");
} else {
    // no web storage support
}

    // By default, display the start page until the start button is clicked.
    document.getElementById("start_page").style.visibility = "visible";
    
    // Hide the level one and level two pages.
    document.getElementById("level_one_page").style.display = "none";
    document.getElementById("level_two_page").style.display = "none";
    
    // Initialize the canvas context.
    var c = document.getElementById("level_one_canvas");
    window.ctx = c.getContext("2d");
    
    
    
 // Testing drawing
    Spaceship(10, 10);
}


function start() {
    document.getElementById("start_page").style.display = "none";
    document.getElementById("level_one_page").style.display = "block";
    game_level = 1;
    ingame_time = 60;
    // Call the drawCanvas function every second (every 1000 milliseconds)
    // in order to decrement the game timer.
    setInterval(drawCanvas, 1000);
    }
    
}

/*
 * Draw the next level.
 *
 */
function nextLevel() {
    // drawLevelTwo();
    game_level = 2;
}

/*
 * Draw the general parts of this game canvas.
 *
 */
function drawCanvas() {
    ctx.clearRect(0, 0, 1000, 640);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 40, 1000, 640);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "1em Montserrat";
    ctx.textAlign = "center";
    ctx.fillText("Level " + game_level, 50, 30);
    ctx.fillText("Score: " + game_score, 300, 30);
    ctx.fillText("Pause", 700, 30);
    timer();
    ctx.fillText(window.ingame_time, 900, 30);
}

/*
 * Draw spacecraft.
 */
function Spaceship(x, y) {
	ctx.beginPath();
	//Main body
    ctx.moveTo(x+10, y+20);
    ctx.lineTo(x+30, y+20);
    ctx.lineTo(x+30, y+30);
    ctx.lineTo(x+10, y+30);
    ctx.lineTo(x+10, y+20);
    ctx.arc(x+30, y+25, 5, 1.5*Math.PI, 0.5*Math.PI);
    //Top fin
    ctx.moveTo(x+10, y+20);
    ctx.lineTo(x+5, y+15);
    ctx.lineTo(x+15, y+20);
    //Bottom fin
    ctx.moveTo(x+10, y+30);
    ctx.lineTo(x+5, y+35);
    ctx.lineTo(x+15, y+30);
    //Stroke and fill with gradient
    ctx.stroke();
    var gradient = ctx.createLinearGradient(x, y, x+50, y+50);
    gradient.addColorStop(0,"red");
    gradient.addColorStop(1,"black");
    ctx.fillStyle = gradient;
    ctx.fill();
}

//Draw planet with rings
function Planet(x, y) {
	ctx.beginPath();
	//Ring #1
	ctx.moveTo(x+25, y+25-10/2);
	ctx.bezierCurveTo(
			x+25+80/2, y+25-10/2,
			x+25+80/2, y+25+10/2,
			x+25, y+25+10/2);
	ctx.bezierCurveTo(
			x+25-80/2, y+25+10/2,
			x+25-80/2, y+25-10/2,
			x+25, y+25-10/2);
	//Ring #2
	ctx.moveTo(x+25, y+25-15/2);
	ctx.bezierCurveTo(
			x+25+85/2, y+25-15/2,
			x+25+85/2, y+25+15/2,
			x+25, y+25+15/2);
	ctx.bezierCurveTo(
			x+25-85/2, y+25+15/2,
			x+25-85/2, y+25-15/2,
			x+25, y+25-15/2);	
	//Ring #2
	ctx.moveTo(x+25, y+25-20/2);
	ctx.bezierCurveTo(
			x+25+90/2, y+25-20/2,
			x+25+90/2, y+25+20/2,
			x+25, y+25+20/2);
	ctx.bezierCurveTo(
			x+25-90/2, y+25+20/2,
			x+25-90/2, y+25-20/2,
			x+25, y+25-20/2);
	
	ctx.stroke();	
	//Draw main body
	ctx.beginPath();
	ctx.arc(x+25, y+25, 20, 0, 2*Math.PI);
	ctx.stroke();
	//Fill main body
    var gradient = ctx.createLinearGradient(x, y, x+50, y+50);
    gradient.addColorStop(0,"red");
    gradient.addColorStop(1,"gray");
    ctx.fillStyle = gradient;
    ctx.fill();
}

function Moon(x, y) {
	ctx.beginPath();
	ctx.arc(x+25, y+25, 20, 1.75*Math.PI, 1.25*Math.PI);
	ctx.stroke();
    /* 
    var gradient = ctx.createLinearGradient(x, y, x+50, y+50);
    gradient.addColorStop(0,"white");
    gradient.addColorStop(1,"gray");
    ctx.fillStyle = gradient;
    ctx.fill();
    */
	ctx.closePath();
	ctx.beginPath();
	ctx.arc(x+25, y+16, 15, 1.9*Math.PI, 1.1*Math.PI);
	
	ctx.stroke();
}

/* Potentially necessary functions.
function drawLevelOne() {
}

function drawLevelTwo() {
}

function drawPauseOverlay() {
}

function pause() {
    
}

function transitionLevel() {
}
*/

/*
 * Decrement in-game time by 1.
 *
 */
function timer() {
    if(window.ingame_time > 0)  {
    window.ingame_time = window.ingame_time - 1;
    } else {
        // When the transiton level screen is implemented, call that instead of
        // nextLevel() when the timer hits 0.
        nextLevel();
    }
}