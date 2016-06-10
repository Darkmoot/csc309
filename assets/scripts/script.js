window.onload = function() {
    debugger;
    
    /* Global variables */
    
    // Initiate the timer to 60, game level to 0, score to 200.
    window.ingame_time = 60;
    window.game_level = 0;
    window.game_score = 200;
    // Array which stores the functions to be drawn
    window.drawings = [moon, planet, spaceship];

    
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
    
}

/* Global Methods */
// Draw a new planet, spaceship, and moon every 1s
    
function drawSpaceObjects(){
    for(i = 0; i < 10; i++) {
        var x = Math.floor((Math.random() * 900) + 50);
        var y = Math.floor((Math.random() * 500) + 50);
        (window.drawings[Math.floor((Math.random() * 3))])(x, y);
    }
}


function start() {
    document.getElementById("start_page").style.display = "none";
    document.getElementById("level_one_page").style.display = "block";
    game_level = 1;
    ingame_time = 60;
    // Call the drawCanvas function every second (every 1000 milliseconds)
    // in order to decrement the game timer.
    drawCanvas();
    drawSpaceObjects();
    setInterval(drawTimer, 1000);
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
    //ctx.clearRect(0, 0, 1000, 40);
    //ctx.fillStyle = "#000000";
    //ctx.fillRect(0, 40, 1000, 640);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "1em Montserrat";
    ctx.textAlign = "center";
    ctx.fillText("Level " + game_level, 50, 30);
    ctx.fillText("Score: " + game_score, 300, 30);
    ctx.fillText("Pause", 700, 30);
}

function drawTimer() {
    ctx.fillStyle = "#FFFFFF";
    ctx.clearRect(850, 0, 1000, 40);
    ctx.font = "1em Montserrat";
    timer();
    ctx.fillText(window.ingame_time, 900, 30);
}

/*
 * Draw spacecraft.
 */
function spaceship(x, y) {
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
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
    
    //Thruster
    ctx.beginPath();
    ctx.moveTo(x+10, y+22);
    ctx.lineTo(x+5, y+20);
    ctx.lineTo(x+5, y+30);
    ctx.lineTo(x+10, y+28);
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
    
    //Thruster fire
    ctx.beginPath();
    ctx.moveTo(x+5, y+23);
    ctx.quadraticCurveTo(x+5, y+20, x, y+25);
    ctx.quadraticCurveTo(x+5, y+30, x+5, y+27);
    ctx.lineTo(x+5, y+23);
    ctx.closePath();
    ctx.fillStyle = 'blue';
    ctx.fill();
    
    ctx.font = 'normal 7pt Times New Roman';
    ctx.fillText('CSA', x+22, y+28);
}

//Draw planet with rings
function planet(x, y) {
	var mid_offset = 25;
	
	//Draw upper half of planet and clip
	ctx.beginPath();
	ctx.arc(x+mid_offset, y+mid_offset, 20, 0, Math.PI);
    
	var gradient = ctx.createLinearGradient(x, y, x, y+50);
    gradient.addColorStop(0,"#800000");
    gradient.addColorStop(1/5, '#DAA520');
    gradient.addColorStop(2/5,"#8B4513");
    gradient.addColorStop(3/5, '#DAA520');
    gradient.addColorStop(4/5, '#800000');
    ctx.fillStyle = gradient;
    
	ctx.stroke();
	ctx.fill();
	
	ctx.beginPath();
	//Ring #1
	var width = 40;
	var height = 5;
	ctx.moveTo(x+mid_offset, y+mid_offset-height);
	ctx.bezierCurveTo(
			x+mid_offset+width, y+mid_offset-height,
			x+mid_offset+width, y+mid_offset+height,
			x+mid_offset, y+mid_offset+height);
	ctx.bezierCurveTo(
			x+mid_offset-width, y+mid_offset+height,
			x+mid_offset-width, y+mid_offset-height,
			x+mid_offset, y+mid_offset-height);
	//Ring #2
	width = 42.5;
	height = 7.5;
	ctx.moveTo(x+mid_offset, y+mid_offset-height);
	ctx.bezierCurveTo(
			x+mid_offset+width, y+mid_offset-height,
			x+mid_offset+width, y+mid_offset+height,
			x+mid_offset, y+mid_offset+height);
	ctx.bezierCurveTo(
			x+mid_offset-width, y+mid_offset+height,
			x+mid_offset-width, y+mid_offset-height,
			x+mid_offset, y+mid_offset-height);	
	//Ring #2
	width = 45;
	height = 10;
	ctx.moveTo(x+mid_offset, y+mid_offset-height);
	ctx.bezierCurveTo(
			x+mid_offset+width, y+mid_offset-height,
			x+mid_offset+width, y+mid_offset+height,
			x+mid_offset, y+mid_offset+height);
	ctx.bezierCurveTo(
			x+mid_offset-width, y+mid_offset+height,
			x+mid_offset-width, y+mid_offset-height,
			x+mid_offset, y+mid_offset-height);
	
	ctx.stroke();	
	//Draw lower half of planet
	ctx.beginPath();
	ctx.arc(x+mid_offset, y+mid_offset, 20, Math.PI, 2*Math.PI);
	ctx.stroke();
	//Fill main body
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
}

function moon(x, y) {
	ctx.beginPath();
	//Outer Crescent
	ctx.arc(x+25, y+25, 20, 1.2*Math.PI, 0.8*Math.PI);
	     
    var gradient = ctx.createLinearGradient(x, y, x+50, y+50);
    gradient.addColorStop(0,"white");
    gradient.addColorStop(1,"gray");
    ctx.fillStyle = gradient;
    ctx.fill();
    
    //Inner crescent
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x+17, y+25, 15, 0.7*Math.PI, 1.3*Math.PI, true);
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
	//reset globalCompositeOperation to default
	ctx.globalCompositeOperation = 'source-over';
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

function secondSpaceship() {
    ctx.beginPath();
    ctx.moveTo(ctx.posX,20);
    ctx.lineTo(45, 40); // trying to draw a diamond
    ctx.lineTo(100, 30);
    ctx.lineTo(65, 10);
    ctx.lineTo(15, 20);
    
    
    // colour in with a gradient
    var grd=ctx.createLinearGradient(15, 10, 100, 50);
    grd.addColorStop(0, "#565695");
    grd.addColorStop(0.5, "#8080B3");
    grd.addColorStop(1, "#09093B");
    ctx.fillStyle=grd;
    ctx.fill();
    ctx.strokeStyle = "1A1A59";
    ctx.stroke();
    // add an arc
    // ctx.arc(x, y, r, startangle, endangle);
    ctx.beginPath();
    ctx.arc(48, 25, 15, ((Math.PI)*7/6), (Math.PI)/12, false);
    ctx.arc(52, 8, 20, ((Math.PI)/3), (Math.PI*11/13), false);
    var grd2=ctx.createLinearGradient(33, 5, 63, 40);
    grd2.addColorStop(0, "#565695");
    grd2.addColorStop(0.5, "white");
    grd2.addColorStop(1, "#09093B");
    ctx.fillStyle=grd2;
    ctx.fill();
    ctx.strokeStyle = "1A1A59";
    ctx.stroke();
    ctx.closePath();
}