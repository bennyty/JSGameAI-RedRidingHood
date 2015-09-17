/* These algorithms are derived from
 * http://rocketmandevelopment.com/blog/category/steering/
 * originally written in actionscript
 *
 * and gamedevelopment.tutsplus.com
 * also orginally in actionscript
 */

 function drawCircle(properties) {
	ctx.fillStyle = properties.color;
	ctx.beginPath();
	ctx.arc(properties.center.x, properties.center.y, properties.radius, 0, Math.PI * 2);
	ctx.closePath();
	if (properties.filled) {
		ctx.fill();
	}
}


function Seek(properties) {

	this.minDistance = properties.minDistance || 10;
	this.target = properties.target || new Vector2D(0,0);

	this.toString = function() {
		return "Seek";
	};

	this.steer = function(velocity, position, maxSpeed, mass) {
		var distance = this.target.clone().subtract(position);
		if(Math.abs(distance.x) < this.minDistance && Math.abs(distance.y) < this.minDistance) {
			return new Vector2D(0,0);
		} else {
			return this.target.clone().subtract(position).normalize().multiply(maxSpeed).subtract(velocity).divide(mass);
		}		
	};
}

function Flee(properties){
	this.target = properties.target || new Vector2D(0,0);

	this.toString = function() {
		return "Flee";
	};

	this.steer = function(velocity, position, maxSpeed, mass) {
		var desiredVelocity = this.target.clone().subtract(position).normalize().multiply(maxSpeed);
		var steeringForce = desiredVelocity.subtract(velocity);
		var outputForce = steeringForce.divide(mass).reverse();
		return outputForce;
	};
}

function Wander(properties) {
	this.radius = properties.radius || 30;
	this.offset = properties.offset || 50;
	this.angleChange = properties.angleChange || 0.5;
	this.wanderAngle = 0;


	this.steer = function (velocity, position, maxSpeed, mass) {
		var circleMidde = velocity.clone().normalize().multiply(this.offset);
		// drawCircle({center: circleMidde, radius: this.radius, color: "#FF5C40" });
		var displacement = new Vector2D(0,-1);
		displacement.multiply(this.radius);
		this.wanderAngle += (Math.random() * this.angleChange) - (this.angleChange * 0.5);
		displacement.angle(this.wanderAngle);
		var steering = circleMidde.add(displacement);
		return steering;
	};

	// this.steer = function (velocity, position, maxSpeed, mass) {
	// 	var offsetVector = new Vector2D(0,1);
	// 	offsetVector.length(this.offset).angle(velocity.angle());
	// 	var circleMidde = position.add(offsetVector);
	// 	drawCircle({center: circleMidde, radius: this.radius, color: "#FF5C40" });
	// 	var displacement = new Vector2D(0,-1);
	// 	displacement.multiply(this.radius);
	// 	this.wanderAngle += (Math.random() * this.angleChange) - (this.angleChange * 0.5);
	// 	displacement.angle(this.wanderAngle);
	// 	var steering = circleMidde.add(displacement);
	// 	return steering;
	// };

	this.toString = function() {
		return "Wander";
	};
}

function Stop(properties) {
	this.drag = properties.drag || 0.06;

	this.steer = function(velocity, position, maxSpeed, mass) {
		console.log(velocity.length());
		if (velocity.length() < 0.05) {
			velocity.multiply(0.00000001);
			return new Vector2D(0,0);
		}
		return velocity.clone().reverse().normalize().multiply(this.drag);
	};
}

function followPath(properties) {
	this.path = properties.path;
	this.tightness = properties.tightness || 20;
	this.pathIndex = 0;
	this.seeker = function(){};	

	this.steer = function (velocity, position, maxSpeed, mass) {
		if (this.pathIndex >= this.path.length) {
			seeker = new Stop({});
			return seeker.steer(velocity, position, maxSpeed, mass);
		} else {
			if (position.clone().subtract(this.path[this.pathIndex]).length() < this.tightness) {
				this.pathIndex++;
			}
			seeker = new Seek({target: this.path[this.pathIndex], minDistance: this.tightness});
			return seeker.steer(velocity, position, maxSpeed, mass);
		}
	};

	this.toString = function() {
		return "Path Follow";
	};
}

function None(){
	this.steer = function() {
		return new Vector2D(0,0);
	};
}




