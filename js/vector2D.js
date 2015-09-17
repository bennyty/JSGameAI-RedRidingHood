function Vector2D(x,y) {
	this.x = x;
	this.y = y;

	this.me = this;

	this.toString = function() {
		return "Vector2D_ x:" + this.x + ", " + "y:" + this.y;
	};

	this.zero = function() {
		this.x = 0;
		this.y = 0;
		return this.self;
	};

	this.normalize = function() {
		var l = this.length();
		if (l === 0) {
			this.x = 1;
			return this.me;
		} else {
			this.x /= l;
			this.y /= l;
			return this.me;
		}
	};

	this.clone = function() {
		return new Vector2D(this.x, this.y);
	};

	this.truncate = function(maxLength) {
		this.length(Math.min(this.length(), maxLength));
		return this.me;
	};

	this.length2 = function() {
		return this.x * this.x + this.y * this.y;
	};

	this.length = function(val) {
		if (val) {
			var a = this.angle();
			this.x = Math.cos(a) * val;
			this.y = Math.sin(a) * val;
			return this.me;
		} else {
			return Math.sqrt(this.length2());
		}
	};

	this.angle = function(val) {
		if (val) {
			var l = this.length();
			this.x = Math.cos(val) * l;
			this.y = Math.sin(val) * l;
		} else {
			return Math.atan2(this.y,this.x);
		}
	};

	this.reverse = function() {
		this.multiply(-1);
		return this.me;
	};

	this.add = function(vector) {
		this.x += vector.x;
		this.y += vector.y;
		return this.me;
	};

	this.subtract = function(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
		return this.me;
	};

	this.multiply = function(n) {
		this.x *= n;
		this.y *= n;
		return this.me;
	};

	this.divide = function(n) {
		this.x /= n;
		this.y /= n;
		return this.me;
	};

}