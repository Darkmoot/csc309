window.onload = function() {
    debugger;
    
    /* Global variables */
    
    // Initialize the game canvas and context.
    window.canvas = document.getElementById("levelOneCanvas");
    window.ctx = canvas.getContext("2d");
    //Pause Canvas
    window.pauseCanvas = document.getElementById("pauseCanvas");
    window.pctx = pauseCanvas.getContext("2d");
    // Initialize the timer to 60, game level to 1, score to 200.
    window.ingameTime = 60;
    window.gameLevel = 1;
    window.gameScore = 200;
    //
    window.intervalID = null;
    window.spawnIntervalID = null;
    window.animationFrameID = null;
    // Store the functions to be drawn in an array.
    window.drawings = [moon, planet, spaceship, drawPurpleShip];
    // Store the offset positions of x and y.
    window.canvasLeft = canvas.offsetLeft;
    // Hard-coding this value since it's not giving me what I expect
    window.canvasTop = 120;
    window.parent = canvas.offsetParent;
    // Store the 10 space objects
    window.drawnDrawings = [];
    // Store any black holes which are drawn on the canvas.
    window.blackHoles = [];
    // Store number of objects left uneaten
    window.objectsLeft = 10;
    //Pause Button coords
    window.pauseXStart = 665;
    window.pauseXEdge = 735;
    window.pauseYStart = 8;
    window.pauseYEdge = 38;
    window.paused = 0;
    window.pausedDataURL = null;
    window.pausedImage = new Image();
    
    //
    updateHighScores();

    // By default, display the start page until the start button is clicked.
    document.getElementById("startPage").style.visibility = "visible";
    
    // Hide the level one and level two pages.
    document.getElementById("levelOnePage").style.display = "none";
    document.getElementById("levelTwoPage").style.display = "none";
    document.getElementById("pausePage").style.display = "none";
    
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
    
    // Detect mouse click events for pausing the game or destroying black holes.
    window.canvas.addEventListener('click', pauseOrDestroy, false);
    // Change the appearance of pause text on hover, so it looks like a button.
    window.canvas.addEventListener('mousemove', pauseButtonHover, false);
    // Detect mouse click events on the second canvas so the game can be unpaused.
    window.pauseCanvas.addEventListener('click', pauseOrDestroy, false);
    
};

/*
 * Store and retrieve high score to/from local storage.
 * 
 */
function updateHighScores() {
    if (typeof(Storage) !== "undefined") {
        // Store
        // create localStorage name/value pair, name="score", value="00:00"
        // note: name-value pairs always stored as strings
        if((localStorage.getItem("scoreBest") === null)) {
            localStorage.setItem("scoreBest", "0");
            localStorage.setItem("scoreSecond", "0");
            localStorage.setItem("scoreThird", "0");
        }
        // Retrieve value of "score" and insert it into element with id="high_score_value"
        
        document.getElementById("highScoreValue").innerHTML = '<li>' + localStorage.getItem("scoreBest") + '</li>' +
                                                            '<li>' + localStorage.getItem("scoreSecond") + '</li>' +
                                                            '<li>' + localStorage.getItem("scoreThird") + '</li>';
    } else {
        // no web storage support
    }
}

// Emphasize pause button
function pauseButtonHover(event) {
    x = event.pageX - canvasLeft;
    y = event.pageY - canvasTop;

    if ( (y > pauseYStart )&& (y < pauseYEdge) && (x > pauseXStart) && (x < pauseXEdge)) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "1em Montserrat";
        ctx.beginPath();
        ctx.moveTo(665, 8);
        ctx.lineTo(735, 8);
        ctx.lineTo(735, 38);
        ctx.lineTo(665, 38);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#ff6600";
        ctx.fillText("Pause", 700, 30);
    } else {
        drawPause();
    }
}
// Pause
function pauseOrDestroy(event) {
    // Use pageX and pageY to get x and y coords of mouse when clicked. 
    canvasX = event.pageX;
    canvasY = event.pageY;

    x = canvasX - canvasLeft;
    y = canvasY - canvasTop;
    
    alert("canvasX:" + canvasX + "\ncanvasY:" + canvasY + "\ncanvasLeft:" + canvasLeft + "\ncanvasTop:" + canvasTop +
          "\nx=" + x + "\ny=" + y + "\ncanvasParent = " + window.parent);
    if ( (y > pauseYStart )&& (y < pauseYEdge) && (x > pauseXStart) && (x < pauseXEdge)) {
        if (window.paused === 0) {
            window.pausedDataURL = canvas.toDataURL();
            pausedImage.src = pausedDataURL;
            pctx.drawImage(pausedImage, 0, 0);
            document.getElementById("pausePage").style.display = "block";
            document.getElementById("levelOnePage").style.display = "none";
            // Draw pause overlay
            pctx.textAlign = "center";
            pctx.globalAlpha = 0.7;
            pctx.fillStyle = "#FFFFFF";
            pctx.fillRect(40, 40, 920, 560);
            pctx.globalAlpha = 1;
            pctx.fillStyle = "#FF6600";
            pctx.font = "128px Montserrat";
            pctx.fillText("PAUSED", 500, 300);
            pctx.globalAlpha = 1;
            pctx.beginPath();
            pctx.moveTo(40, 40);
            pctx.lineTo(960, 40);
            pctx.lineTo(960, 600);
            pctx.lineTo(40, 600);
            pctx.closePath();
            pctx.strokeStyle = "#FFFFFF";
            pctx.stroke();
            window.paused = 1;
        } else if(window.paused === 1) {
            pctx.clearRect(665, 8, 70, 30);
            pctx.fillStyle = "#ff6600";
            pctx.fillRect(665, 8, 70, 30);
            pctx.fillStyle = "#FFFFFF";
            pctx.font = "1em Montserrat";
            pctx.textAlign = "center";
            pctx.fillText("Pause", 700, 30);
            document.getElementById("levelOnePage").style.display = "block";
            document.getElementById("pausePage").style.display = "none";
            window.paused = 0;
            pctx.clearRect(0, 0, 1000, 640);
        }
    } else {
        for(i = 0; i < blackHoles.length; i++) {
            if(blackHoles[i] !== null) {
                var tempX = blackHoles[i][1];
                var tempY = blackHoles[i][2];
                if (((x >= tempX + 25) && (x <= tempX + 75)) &&
                    ((y >= tempY + 25) && (y <= tempY + 75))) {
                    incrementScore(blackHoles[i][0]);
                    blackHoles[i] = null;
                    console.log("clicked a black hole at x: " + x + ", y: " + y);
                }
            }
        }
    }
}

/*
 *
 *
 */
function updateScore() {
    ctx.clearRect(200, 0, 200, 40);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "1em Montserrat";
    ctx.textAlign = "center";
    ctx.fillText("Score: " + gameScore, 300, 30);
}

/*
 *
 */
function decrementScore () {
    gameScore -= 50;
    updateScore();
}

/*
 *
 */
function incrementScore(blackHoleType) {
    if( blackHoleType === 1) {
        window.gameScore += 5;
    } else if (blackHoleType === 2) {
        window.gameScore += 10;
    } else if (blackHoleType === 3) {
        window.gameScore += 20;
    }
    // Update high scores whenever the current game score is updated
    if(parseInt(localStorage.getItem("scoreBest")) < gameScore) {
        localStorage.setItem("scoreBest", gameScore.toString());
    } else if(parseInt(localStorage.getItem("scoreSecond")) < gameScore) {
        (localStorage.setItem("scoreSecond", gameScore.toString()));
    } else if(parseInt(localStorage.getItem("scoreThird")) < gameScore) {
        localStorage.setItem("scoreThird", gameScore.toString());
    }
    updateScore();
}

//Create a class for space objects
function object(x, y, tx, ty, type, eaten) {
	this.x = x;
	this.y = y;
	this.tx = tx;
	this.ty = ty;
	this.type = type;
	this.eaten = eaten;
}

//Set an update function for space objects
object.prototype.update = function() {
	if ((paused === 0) && (this.eaten === 0) && (ingameTime >= 0)) {
		this.x = this.x+this.tx;
		this.y = this.y+this.ty;
		this.type(this.x, this.y);
		//Check that objects don't overshoot canvas boundaries
		//If they do, fix it and change direction of travel
		if (this.x <= 0) {
			this.x = 0;
			this.tx = Math.round(Math.random() * 2);
			this.ty = Math.round((Math.random() * 4) - 2);
		}
		if (this.x >= 950) {
			this.x = 950;
			this.tx = -Math.round(Math.random() * 2);
			this.ty = Math.round((Math.random() * 4) - 2);
		}
		if (this.y <= 40) {
			this.y = 40;
			this.tx = Math.round((Math.random() * 4) - 2);
			this.ty = Math.round(Math.random() * 2);
		}
		if (this.y >= 590) {
			this.y = 590;
			this.tx = Math.round((Math.random() * 4) - 2);
			this.ty = -Math.round(Math.random() * 2);
		}
		//Black hole detection and direction change would go here too
        // Check against black hole coords, increase speed and redirect the space object toward the center
        // of the black hole.
        for(i = 0; i < window.blackHoles.length; i++) {
            if (blackHoles[i] !== null) {
            	bHType = blackHoles[i][0];
            	bHX = blackHoles[i][1];
            	bHY = blackHoles[i][2];
                bCenter = [bHX + 50, bHY + 50];
            	//Check if right side of object is past the left horizon
            	if ((this.x + 50 >= bHX) && (this.x + 50 <= bHX + 50)) {
            		//Check if bottom of object is past top horizon
            		if ((this.y + 50 >= bHY) && (this.y + 50 <=bHY + 50)) {
            			//this.tx = Math.min(bHType, Math.round((bHX+50-this.x+25)/5));
            			//this.ty = Math.min(bHType, Math.round((bHY+50-this.y+25)/5));
            			this.tx = bHType;
            			this.ty = bHType;
            		}
            		//Check if top of object is past bottom horizon
            		else if ((this.y >= bHY + 50) && (this.y <= bHY + 100)) {
            			//this.tx = Math.min(bHType, Math.round((bHX+50-this.x+25)/5));
            			//this.ty = Math.min(-bHType, Math.round((bHY+50-this.y+25)/5));
            			this.tx = bHType;
            			this.ty = -bHType;
            		}
            	}
            	//Check if left side of object is past the right horizon
            	else if ((this.x >= bHX + 50) && (this.x <= bHX + 100)) {
            		//Bottom-object past top
            		if ((this.y + 50 >= bHY) && (this.y + 50 <=bHY + 50)) {
            			//this.tx = Math.min(-bHType, Math.round((bHX+50-this.x+25)/5));
            			//this.ty = Math.min(bHType, Math.round((bHY+50-this.y+25)/5));
            			this.tx = -bHType;
            			this.ty = bHType;
            		}
            		//Top-object past bottom
            		else if ((this.y >= bHY + 50) && (this.y <= bHY + 100)) {
            			//this.tx = Math.min(-bHType, Math.round((bHX+50-this.x+25)/5));
            			//this.ty = Math.min(-bHType, Math.round((bHY+50-this.y+25)/5));
            			this.tx = -bHType;
            			this.ty = -bHType;
            		}
            	}
            	//If object has reached middle of black hole, eat it
            	//eaten = 1 means it no longer gets drawn
            	if ((this.x + 25 >= bHX + 25) && (this.x + 25 <= bHX + 75)) {
            		if ((this.y + 25 >= bHY + 25) && (this.y + 25 <= bHY + 75)) {
            			this.eaten = 1;
                        window.objectsLeft -= 1;
            			//We'll want to update score and black hole counter for eaten objects here
                        decrementScore();
                        incrementFullness(i, bHType);
                        console.log("space object was eaten at x = " + this.x + "y = " +
                                    this.y + ", (" + (this.x - bCenter[0]) + ", " + (this.y - bCenter[1]) +
                                    ") from the center of the black hole.");
                        if(window.objectsLeft === 0) {
                            nextLevel();
                            
                        }
            		}
            	}
            }
        }
	}
}

/*
 *
 *
 */
function incrementFullness(i, type) {
    blackHoles[i][3] += 1;
    var fullness = blackHoles[i][3];
    console.log("black hole ate an object. this black hole's fullness is now " + blackHoles[i][3]);
    if(type == 1) {
        if(fullness == 3) {
            blackHoles[i] = null;
            console.log("blue black hole disappeared!");
        }
    } else if(type == 2) {
        if(fullness == 2) {
            blackHoles[i] = null;
            console.log("purple black hole disappeared!");
        }
    } else if(type == 3) {
        blackHoles[i] = null;
        console.log("black black hole disappeared!");
    }
}

function generateXY(array) {
    x = Math.floor((Math.random() * 900));
    y = Math.floor((Math.random() * 500) + 40);
    
    for(i = 0; i < window.blackHoles.length; i++) {
        if(blackHoles[i] !== null) {
            if(((x >= blackHoles[i][1]) && (x <= (blackHoles[i][1] + 100)) ||
                ((x + 100 >= blackHoles[i][1]) && (x + 100 <= (blackHoles[i][1] + 100)))) &&
               (((y >= blackHoles[i][2]) && (y <= (blackHoles[i][2] + 100))) ||
               ((y + 100 >= blackHoles[i][2]) && (y + 100 <= (blackHoles[i][2] + 100))))){
                generateXY(array);
            }
        }
    }
    array.push(x);
    array.push(y);
}

/*
 * 
 *
 */
function spawnBlackHole() {
    debugger;
    // Probability of spawning blue: 4/7; purple: 2/7; black: 1/7
    var spawnArray = [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3];
    
    if(window.ingameTime > 0 && window.paused === 0) {    
        // Randomly choose the type of black hole to be drawn
        var blackHoleColour = spawnArray[(Math.floor(Math.random() * 14))];
        console.log("going to draw a new black hole of type: " + blackHoleColour);
        var xy = [];
        generateXY(xy);
        
        var curr = [blackHoleColour, xy[0], xy[1], 0];
        blackHole(x, y, blackHoleColour);
        window.blackHoles.push(curr);
        console.log("pushed a new black hole onto the array, with x = " + xy[0] + ", y = " + xy[1]);
    }
}

function drawBlackHoles() {
    for(i = 0; i < window.blackHoles.length; i++) {
        if(blackHoles[i] !== null) {
            x = blackHoles[i][1];
            y = blackHoles[i][2];
            colour = blackHoles[i][0];
            blackHole(x, y, colour);
        }
    }
}

function drawObjects() {
	for (var i = 0; i < 10; i++) {
        var randomX = Math.floor((Math.random() * 900) + 50);
        var randomY = Math.floor((Math.random() * 500) + 50);
		var randomTX = Math.round((Math.random() * 4) - 2);
		var randomTY = Math.round((Math.random() * 4) - 2);
		if (randomTX === 0) {
			if (randomTY === 0) {
				randomTX = 1;
			}
		}
		 // Choose the function to draw and store it in a local variable.
		var currDrawing = (window.drawings[Math.floor((Math.random() * 4))]);
		// Create the object and push onto array
		var obj = new object(randomX, randomY, randomTX, randomTY, currDrawing, 0);
		window.drawnDrawings.push(obj);
	}
	drawAndUpdate();
}

function drawAndUpdate() {
	ctx.clearRect(0, 40, 1000, 600);
	//Update each object's position
	for (var i = 0; i < window.drawnDrawings.length; i++) {
		var myObject = window.drawnDrawings[i];
		myObject.update();
	}
    drawBlackHoles();
	animationFrameID = requestAnimationFrame(drawAndUpdate);
}


/*
 * Switch visibility from the start page to the game page and
 * draw the initial canvas elements.
 * 
 */
function start() {
    document.getElementById("startPage").style.display = "none";
    document.getElementById("levelOnePage").style.display = "block";
    ingameTime = 60;
    blackHoles = [];
    drawnDrawings = [];
    objectsLeft = 10;
    drawCanvas();
    //initSpaceObjects();
    drawObjects();
    //setInterval(drawSpaceObjects, 33);
    //requestAnimationFrame(drawSpaceObjects);
    // Call the drawTimer function every second (every 1000 milliseconds)
    // in order to decrement the game timer.
    intervalID = setInterval(drawTimer, 1000);
    if(gameLevel === 1) {
        // Spawn a new black hole every 3 seconds
        spawnIntervalID = setInterval(spawnBlackHole, 3000);
    } else if(gameLevel === 2) {
        spawnIntervalID = setInterval(spawnBlackHole, 1500);
    }
}

/*
 *
 *
 */
function finish() {
    gameScore = 200;
    gameLevel = 1;
    gameTime = -1;
    document.getElementById("startPage").style.display = "block";
    document.getElementById("levelOnePage").style.display = "none";
    document.getElementById("gameTitle").innerHTML = "Black Hole Game";
    document.getElementById("highScore").innerHTML = "High Scores" +
    '<ul id="highScoreValue">0</ul>';
    updateHighScores();
    document.getElementById("button").innerHTML =
    '<button type="button" id="startButton" onclick=start();> Start </button>';
}

/*
 * Draw the next level.
 *
 */
function nextLevel() {
    cancelAnimationFrame(animationFrameID);
    clearInterval(intervalID);
    clearInterval(spawnIntervalID);
    document.getElementById("startPage").style.display = "block";
    document.getElementById("levelOnePage").style.display = "none";
    if(gameLevel == 1) {
        document.getElementById("startButton").innerHTML = "Next";
        // Change start page to look like transitional page
        document.getElementById("gameTitle").innerHTML = "Level 1";
        document.getElementById("highScore").innerHTML = "Score" +
            "<ul id='highScoreValue'><li>" + gameScore + "</li></ul></section>";    
        gameLevel = 2;
    } else if(gameLevel == 2) {
        document.getElementById("gameTitle").innerHTML = "Level 2";
        document.getElementById("highScore").innerHTML = "Score" +
            "<ul id='highScoreValue'><li>" + gameScore + "</li></ul>";
        document.getElementById("button").innerHTML =
        '<button type="button" id="startButton" onclick=finish();> Finish </button>';
    }
}


/*
 * Draw the level, score, pause button elements.
 *
 */
function drawCanvas() {
    ctx.clearRect(0, 0, 1000, 40);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "1em Montserrat";
    ctx.textAlign = "center";
    ctx.fillText("Level " + gameLevel, 50, 30);
    ctx.fillText("Score: " + gameScore, 300, 30);
    drawPause();
}

function drawPause(){
    ctx.clearRect(665, 8, 70, 30);
    ctx.fillStyle = "#ff6600";
    ctx.beginPath();
    ctx.moveTo(665, 8);
    ctx.lineTo(735, 8);
    ctx.lineTo(735, 38);
    ctx.lineTo(665, 38);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "1em Montserrat";
    ctx.textAlign = "center";
    ctx.fillText("Pause", 700, 30);
}

/*
 * Draw the current ingame time.
 *
 */
function drawTimer() {
    if (window.paused === 0) {
        ctx.fillStyle = "#FFFFFF";
        ctx.clearRect(850, 0, 1000, 40);
        ctx.font = "1em Montserrat";
        timer();
        ctx.fillText(window.ingameTime, 900, 30);
    } 
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
	var width = 30;
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
	width = 32.5;
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
	//Ring #3
	width = 35;
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

function blackHole(x, y, colour) {
    // Draw the invisible event horizon
    ctx.globalAlpha = 0;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 100, y);
    ctx.lineTo(x + 100, y + 100);
    ctx.lineTo(x, y + 100);
    ctx.closePath();
    ctx.fill();
    
    ctx.globalAlpha = 1;
    // Draw the center of the black hole
    var gradient = ctx.createRadialGradient(x + 50, y + 50, 25, x + 50, y + 50, 15);
    if(colour == 1) {
        gradient.addColorStop(0, "#1778ff");
        gradient.addColorStop(3/4, "white");
        gradient.addColorStop(6/7, "#1778ff");
        gradient.addColorStop(1, "black");
    } else if(colour == 2) {
        gradient.addColorStop(0, "#b71089");
        gradient.addColorStop(3/4, "white");
        gradient.addColorStop(6/7, "#b71089");
        gradient.addColorStop(1, "black");
        
    } else if(colour == 3) {
        gradient.addColorStop(0, "black");
        gradient.addColorStop(3/4, "white");
        gradient.addColorStop(1, "black");
    }
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x + 50, y + 50, 25, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.fill();
    
    // Draw the outer area of the black hole
    //outerGradient = ctx.createRadialGradient(x + 50, y + 50, 50, x + 50, y + 50, 35);
    //if(colour == 1) { //blue
    //    gradient.addColorStop(0, "grey");
    //    //gradient.addColorStop(1/2, "grey");
    //    gradient.addColorStop(1, "blue");
    //}
    //    ctx.fillStyle = outerGradient;
    //    ctx.beginPath();
    //    ctx.arc(x + 30, y + 30, 10, (Math.PI)/2, 3*(Math.PI)/2, false);
    //    ctx.closePath();
    //    ctx.fill();
    //console.log("drew a black hole");

}

function drawPurpleShip(x, y) {
    ctx.beginPath();
    ctx.moveTo(x + 0, y + 20);
    ctx.lineTo(x + 10, y + 40); // trying to draw a diamond
    ctx.lineTo(x + 50, y + 30);
    ctx.lineTo(x + 20, y + 10);
    ctx.lineTo(x + 0, y + 20);
    
    
    // colour in with a gradient
    var grd=ctx.createLinearGradient(x + 0, y + 10, x + 50, y + 20);
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
    ctx.arc(x + 15, y + 23, 10, ((Math.PI)*7/6), (Math.PI)/12, false);
    ctx.arc(x + 19, y + 12, 15, ((Math.PI)/3), (Math.PI*11/13), false);
    grd=ctx.createLinearGradient(x + 15, y + 5, x + 45, y + 40);
    grd.addColorStop(0, "#565695");
    grd.addColorStop(0.5, "white");
    grd.addColorStop(1, "#09093B");
    ctx.fillStyle=grd;
    ctx.fill();
    ctx.strokeStyle = "1A1A59";
    ctx.stroke();
}

/*
 * Decrement in-game time by 1.
 *
 */
function timer() {
    if(window.ingameTime > 0)  {
        window.ingameTime = window.ingameTime - 1;
    } else if(ingameTime === 0){
            nextLevel();
    }

}