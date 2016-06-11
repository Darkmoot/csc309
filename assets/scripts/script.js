window.onload = function() {
    debugger;
    
    /* Global variables */
    
    // Initialize the canvas and context.
    window.canvas = document.getElementById("level_one_canvas");

    window.ctx = canvas.getContext("2d");
    // Initialize the timer to 60, game level to 0, score to 200.
    window.ingameTime = 60;
    window.gameLevel = 0;
    window.gameScore = 200;
    // Store the functions to be drawn in an array.
    window.drawings = [moon, planet, spaceship];
    // Store the offset positions of x and y. Not sure how to use this yet.
    window.canvasLeft = canvas.offsetLeft;
    // Temporarily hard-coding this value since it's not giving me what I expect
    window.canvasTop = 120;
    window.parent = canvas.offsetParent;
    /* Initialize an array to store 10 arrays (indexed 0-9) of
     * each of the drawings and their corresponding left and top coords.
     *
     * You can draw each object with the information in this array:
     * drawnDrawings[i][0](drawnDrawings[i][1], drawnDrawings[i][2]);
     */
    window.drawnDrawings = [];
    
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
    
    // Add event listener for click events.
    //ctx.addEventListener("click", pause, false);
        //var x = event.pageX - canvasLeft;
        //var y = event.pageY - canvasTop;

    //    drawings.forEach(function(element) {
    //		if ((y > element.top) && (y < (element.top + element.height) )&&
    //			(x > element.left) && (x < (element.left + element.width))) {
    //			alert("clicked on an element");
    //		}
    //    });
    
    // Detect mouse click events in the pause region.
    window.canvas.addEventListener('click', pause, false);
    
};

/* Global Methods */
// Pause
function pause(event) {
    // Use pageX and pageY to get x and y coords of mouse when clicked. 
    canvasX = event.pageX;
    canvasY = event.pageY;
    pauseXStart = 700;
    pauseXEdge =  900;
    pauseYStart =  0;
    pauseYEdge =  40;
    x = canvasX - canvasLeft;
    y = canvasY - canvasTop;
    
    alert("canvasX:" + canvasX + "\ncanvasY:" + canvasY + "\ncanvasLeft:" + canvasLeft + "\ncanvasTop:" + canvasTop +
          "\nx=" + x + "\ny=" + y + "\ncanvasParent = " + window.parent);
    if ( (y > pauseYStart )&& (y < pauseYEdge) && (x > pauseXStart) && (x < pauseXEdge)) {
        alert("Pause Game");
    }
}

/*
 * Draw either a planet, spacecraft, or moon 10 times
 * on a random position on the canvas.
 * 
 */    
function drawSpaceObjects(){
    for(i = 0; i < 10; i++) {
        var x = Math.floor((Math.random() * 900) + 50);
        var y = Math.floor((Math.random() * 500) + 50);
        // Choose the function to draw and store it in a local variable.
        var currDrawing = (window.drawings[Math.floor((Math.random() * 3))]);
        // Store the name of the function and its left and top values.
        window.drawnDrawings[i] = [currDrawing, x, y];
        // Draw.
        currDrawing(x, y);
    }
}

/*
 * Switch visibility from the start page to the game page and
 * draw the initial canvas elements.
 * 
 */
function start() {
    document.getElementById("start_page").style.display = "none";
    document.getElementById("level_one_page").style.display = "block";
    gameLevel = 1;
    ingameTime = 60;

    drawCanvas();
    drawSpaceObjects();
    // Call the drawTimer function every second (every 1000 milliseconds)
    // in order to decrement the game timer.
    setInterval(drawTimer, 1000);
    
}

/*
 * Draw the next level.
 *
 */
function nextLevel() {
    // drawLevelTwo();
    gameLevel = 2;
}

/*
 * Draw the level, score, pause button elements.
 *
 */
function drawCanvas() {
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "1em Montserrat";
    ctx.textAlign = "center";
    ctx.fillText("Level " + gameLevel, 50, 30);
    ctx.fillText("Score: " + gameScore, 300, 30);
    ctx.fillText("Pause", 700, 30);
}

/*
 * Draw the current ingame time.
 *
 */
function drawTimer() {
    ctx.fillStyle = "#FFFFFF";
    ctx.clearRect(850, 0, 1000, 40);
    ctx.font = "1em Montserrat";
    timer();
    ctx.fillText(window.ingameTime, 900, 30);
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

/*
 * Decrement in-game time by 1.
 *
 */
function timer() {
    if(window.ingameTime > 0)  {
    window.ingameTime = window.ingameTime - 1;
    } else {
        // When the transiton level screen is implemented, call that instead of
        // nextLevel() when the timer hits 0.
        nextLevel();
    }
}