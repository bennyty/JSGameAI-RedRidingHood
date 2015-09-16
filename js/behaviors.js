/* These algorithms are derived from
 * http://rocketmandevelopment.com/blog/category/steering/
 * originally written in actionscript
 */

function Seek(properties) {

	this.minDistance = properties.minDistance || 10;
	this.target = properties.target || new Vector2D(0,0);

	this.toString = function() {
		return "Seek";
	};

	this.steer = function(velocity, position, maxSpeed, mass) {
		var distance = this.target.clone().subtract(position);
		var targetPosition = this.target;

		if(Math.abs(distance.x) < this.minDistance && Math.abs(distance.y) < this.minDistance) {
			return new Vector2D(0,0);
		} else {
			// console.log(this.target);
			var desiredVelocity = targetPosition.clone().subtract(position).normalize().multiply(maxSpeed);
			var steeringForce = desiredVelocity.subtract(velocity);
			var outputForce = steeringForce.divide(mass);
			return outputForce;
		}		
	};
}

function Flee(properties){
	this.target = properties.target || new Vector2D(0,0);

	this.toString = function() {
		return "Flee";
	};

	this.steer = function(velocity, position, maxSpeed, mass) {
		var desiredVelocity = targetPosition.clone().subtract(position).normalize().multiply(maxSpeed);
		var steeringForce = desiredVelocity.subtract(velocity);
		var outputForce = steeringForce.divide(mass).reverse();
		return outputForce;
	};
}

function None(){
	this.steer = function() {
		return new Vector2D(0,0);
	};
}