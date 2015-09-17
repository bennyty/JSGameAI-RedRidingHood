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
			agents.push(new Agent({
				x:mouseVector.x,
				y:mouseVector.y,
				radius: 1,
				sprite: -1,
				color: "rgb(255, 237, 102)"}));
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
		ctx.stroke();
		if (properties.filled) {
			ctx.fill();
		}
	}

	function drawType(text,x,y,color) {
		ctx.fillStyle = color;
		ctx.font = "16px Arial";
		ctx.fillText(text, x, y);
	}

	Agent.prototype.update = function () {
		// State logic
		var woodWolfDist = wolf.position.clone().subtract(woodsman.position).length();
		if (woodWolfDist < wolf.fleeRange) {
			wolf.state = new Flee({target: woodsman.position});
		} else {
			wolf.state = new Seek({target: player.position, mindistance: 10});
		}
		if (woodWolfDist < woodsman.seekRange) {
			woodsman.state = new Seek({target: wolf.position});
		} else {
			woodsman.state = new Wander({});
		}




		// Movement
		this.position.add(this.velocity);
		if (this.velocity.length() !== 0) {
			this.heading = -Math.atan2(this.velocity.x, this.velocity.y);
		}
		this.velocity.add(this.state.steer(this.velocity, this.position, this.maxVelocity, this.mass));
		this.velocity.truncate(this.maxVelocity);

		// Stay on the stage
		if (this.position.x < 0) {this.position.x = 0;// this.velocity.reverse();
			if (this == woodsman)
				this.velocity.reverse();
		}
		if (this.position.y < 0) {this.position.y = 0;// this.velocity.reverse();
			if (this == woodsman)
				this.velocity.reverse();
		}
		if (this.position.x > width-0) {this.position.x = width-0;// this.velocity.reverse();
			if (this == woodsman)
				this.velocity.reverse();
		}
		if (this.position.y > height-0) {this.position.y = height-0;// this.velocity.reverse();
			if (this == woodsman)
				this.velocity.reverse();
		}
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

		drawCircle({center: wolf.position, radius: wolf.fleeRange, color: "#00FF00"});
		drawCircle({center: woodsman.position, radius: woodsman.seekRange, color: "#FF0000"});
		drawType("Click to set new markers for Little Red to follow", 10, 20, "#2F101B");
		drawType("Initial path is a backwards C, markers are invisible for unknown reasons.", 10, 35, "#2F101B");
		
	};

	var player = new Agent({
		x: width/2,
		y: height/2,
		mass: 20,
		maxVelocity: 3,
		// state: new Seek({target: mouseVector,mindistance: 0}),
		// state: new Wander({}),
		state: new followPath({path: pathToGrannys}),
		sprite: 0});
	var woodsman = new Agent({
		x: width/2,
		y: height/2,
		mass: 50,
		maxVelocity: 1,
		// state: new Seek({target: mouseVector,mindistance: 0}),
		state: new Wander({}),
		// state: new followPath({path: pathToGrannys}),
		sprite: 1});
		woodsman.seekRange = 100;
	var wolf = new Agent({
		x: width * 0.1,
		y: height * 0.1,
		mass: 50,
		maxVelocity: 4.2,
		state: new Seek({target: player.position, mindistance: 0}),
		// state: new Wander({}),
		// state: new followPath({path: pathToGrannys}),
		sprite: 2});
		wolf.fleeRange = 70;
	var	dot1 = new Agent({
		x:width/2,
		y:height/2,
		radius: 2,
		color: "rgb(255,0,0)"});
	agents.push(dot1);
	agents.push(woodsman);
	agents.push(wolf);
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