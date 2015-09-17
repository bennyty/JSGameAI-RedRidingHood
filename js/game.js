function game() {
	var canvas = document.getElementById("gameCanvas"),
	ctx = canvas.getContext("2d"),
	width = window.innerWidth,
	height = window.innerHeight,
	mouseVector = new Vector2D(width/2, height/2),
	tileSize = 33,
	running = false,
	agents = [],
	pathToGrannys = [],
	TO_RADIANS = Math.PI/180,
	spritesheet = new Image(),
	c=0;

	spritesheet.src = './img/sprites.png';
	spritesheet.onload = spriteLoaded;

	canvas.width = width;
	canvas.height = height;


	// function Wander(properties) {
	// 	this.radius = properties.radius || 30;
	// 	this.offset = properties.offset || 50;
	// 	this.angleChange = properties.angleChange || 0.5;
	// 	this.wanderAngle = 0;

	// 	this.steer = function (velocity, position, maxSpeed) { //Position is unused;
	// 		var circleMidde = velocity.clone().normalize().multiply(this.offset);
	// 		drawCircle({center: circleMidde, radius: this.radius, color: "#FF5C40" });
	// 		var displacement = new Vector2D(0,-1);
	// 		displacement.multiply(this.radius);
	// 		this.wanderAngle += (Math.random() * this.angleChange) - (this.angleChange * 0.5);
	// 		displacement.angle(this.wanderAngle);
	// 		var steering = circleMidde.add(displacement);
	// 		steering.truncate((maxSpeed/40));
	// 		return steering;
	// 	};

	// 	this.toString = function() {
	// 		return "Wander";
	// 	};
	// }

	function spriteLoaded () {
		pathToGrannys.push(new Vector2D(width * 0.3,height * 0.8));
		pathToGrannys.push(new Vector2D(width * 0.8,height * 0.8));
		pathToGrannys.push(new Vector2D(width * 0.9,height * 0.1));
		pathToGrannys.push(new Vector2D(width * 0.6,height * 0.3));


		render();

		canvas.addEventListener("mousemove", function (e) {
			mouseVector.x = e.pageX;
			mouseVector.y = e.pageY;
		});


		canvas.addEventListener("mouseenter", function (e) {
			if(!running){
				running = true;
				render();
			}
		});

		canvas.addEventListener("mouseleave", function (e) {
			running = false;
		});

		canvas.addEventListener("click", function (e) {
			// c++;
			// console.log(c + " " + c%3);
			// if (c%3 == 1) {
			// 	player.state = new Flee({target: mouseVector});
			// } else if (c%3 == 2) {
			// 	player.state = new Wander({});
			// } else {
			// 	player.state = new Seek({target: mouseVector,mindistance: 0});
			// }
			pathToGrannys.push(mouseVector.clone());
		});
	}

	function rotateAndPaintImage ( context, spriteNum, angleInRad, axisX, axisY ) {
		context.translate( axisX, axisY );
		context.rotate( angleInRad );
		context.drawImage(spritesheet,
			spriteNum*tileSize,
			0,
			tileSize,
			tileSize,
			-((1+tileSize)/2),
			-((1+tileSize)/2),
			tileSize,
			tileSize);
		context.rotate( -angleInRad );
		context.translate( -axisX, -axisY );
	}


	var Agent = function (properties) {
		this.position = new Vector2D(properties.x,properties.y);
		this.velocity = properties.velocity || new Vector2D(0,0);
		this.mass = properties.mass || 10;
		this.radius = properties.radius || 10;
		this.heading = properties.heading || 0;
		this.maxVelocity = properties.maxVelocity || 5;
		this.maxAcceleration = properties.maxAcceleration || 10;
		this.color = properties.color || "rgb(0,0,255)";
		this.state = properties.state || new None();
		this.sprite = (typeof properties.sprite === 'undefined') ? -1 : properties.sprite;

		this.getVector = function() {
			return this.position();
		};

		console.log(this);
	};


	// Debug helper function
	function crosshairAt(x,y) {
		ctx.beginPath();
		ctx.moveTo(x,0);
		ctx.lineTo(x, height);
		ctx.moveTo(0,y);
		ctx.lineTo(width, y);
		ctx.stroke();
	}

	// Debug helper function
	function drawVector(x,y,vX,vY,color) {
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x+vX,y+vY);
		ctx.strokeStyle = color;
		ctx.stroke();
	}

	function drawCircle(properties) {
		ctx.fillStyle = properties.color;
		ctx.beginPath();
		ctx.arc(properties.center.x, properties.center.y, properties.radius, 0, Math.PI * 2);
		ctx.closePath();
		if (properties.filled) {
			ctx.fill();
		}
	}

	function drawType(text,x,y,color) {
		// ctx.fillStyle = color;
		ctx.font = "16px Arial";
		ctx.fillText(text, x, y);
	}

	Agent.prototype.update = function () {
		// if (c%2==1) {
		// 	var bul = new Agent({
		// 		x: player.x,
		// 		y: player.y,
		// 		velocity: player.velocity.clone().normalize().multiply(2),
		// 		radius: 2,
		// 		color: "rgb(255,0,0)",
		// 		sprite: -1});
		// 	crosshairAt(bul.x,bul.y);
		// 	agents.push(bul);
		// }
	    this.velocity.truncate(this.maxVelocity);
		this.position.add(this.velocity);
		this.heading = -Math.atan2(this.velocity.x, this.velocity.y);
		this.velocity.add(this.state.steer(this.velocity, this.position, this.maxVelocity, this.mass));
		



		// Stay on the stage
		// if (this.position.x < 10) {
		// 	this.position.x = 10;
		// 	this.velocity.reverse();
		// }
		// if (this.position.y < 10) {
		// 	this.position.y = 10;
		// 	this.velocity.reverse();
		// }
		// if (this.position.x > width-10) {
		// 	this.position.x = width-10;
		// 	this.velocity.reverse();
		// }
		// if (this.position.y > height-10) {
		// 	this.position.y = height-10;
		// 	this.velocity.reverse();
		// }
	};

	Agent.prototype.render = function () {
		if (this.sprite === -1) {
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
		} else {
			rotateAndPaintImage(ctx, this.sprite, this.heading, this.position.x, this.position.y);
			drawVector(this.position.x,this.position.y,this.velocity.x*10,this.velocity.y*10,'#9CDD05');
			drawType(this.state.toString(), this.position.x+10,this.position.y+10, "#A3D3E9");
		}
		
	};

	var player = new Agent({
		x: width/2,
		y: height/2,
		mass: 20,
		maxVelocity: 6,
		// state: new Seek({target: mouseVector,mindistance: 0}),
		// state: new Wander({}),
		state: new followPath({path: pathToGrannys}),
		sprite: 0});
	var woodsman = new Agent({
		x: width/2,
		y: height/2,
		mass: 50,
		maxVelocity: 2,
		// state: new Seek({target: mouseVector,mindistance: 0}),
		state: new Wander({}),
		// state: new followPath({path: pathToGrannys}),
		sprite: 1});
	var wolf = new Agent({
		x: width * 0.1,
		y: height * 0.1,
		mass: 50,
		maxVelocity: 5,
		state: new Seek({target: player.position, mindistance: 0}),
		// state: new Wander({}),
		// state: new followPath({path: pathToGrannys}),
		sprite: 1});
	var	dot1 = new Agent({
		x:width/2,
		y:height/2,
		radius: 2,
		color: "rgb(255,0,0)"});
	agents.push(dot1);
	agents.push(player);

	function render() {
		ctx.clearRect(0, 0, width, height);
		for (var i = agents.length - 1; i >= 0; i--) {
			agents[i].update();
			agents[i].render();
		}
		if (running) {
			requestAnimationFrame(render);
		}
	}
	render();
}