function drawCanvas() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var raf;
	var running = false;
	var padThickness = 4;
	var padLenthRatio = 1 / 5;
	var canvasSizeToPadSpeedRatio = 1 / 100;
	var canvasSizeToBallSpeedRatio = 1 / 200;

	var validKeys = {
		arrrowLeft: {
			keyCode: 37,
			pressed: false
		},
		arrrowUp: {
			keyCode: 38,
			pressed: false
		},
		arrrowRight: {
			keyCode: 39,
			pressed: false
		},
		arrrowDown: {
			keyCode: 40,
			pressed: false
		}
	}

	var ball = {
		x: 100,
		y: 100,
		vx: canvas.width * canvasSizeToBallSpeedRatio,
		vy: canvas.height * canvasSizeToBallSpeedRatio,
		radius: 25,
		color: 'blue',
		draw: function() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fillStyle = this.color;
			ctx.fill();
		},
		onRightEdge: function() {
			return this.x + this.radius + padThickness >= canvas.width;
		},
		onLeftEdge: function() {
			return this.x - this.radius - padThickness <= 0;
		},
		onTopEdge: function() {
			return this.y - this.radius - padThickness <= 0;
		},
		onBottomEdge: function() {
			return this.y + this.radius + padThickness >= canvas.height;
		}
	};

	var leftPad = {
		y: 0,
		vy: canvas.height * canvasSizeToPadSpeedRatio,
		height: canvas.height * padLenthRatio,
		color: 'blue',
		draw: function() {
			ctx.fillStyle = this.color;
			ctx.fillRect(0, this.y, padThickness, this.height);
		}
	};

	function ballOnLeftPad() {
		return ball.onLeftEdge() && (ball.y > leftPad.y && ball.y < (leftPad.y + leftPad.height))
	}

	var rightPad = {
		y: 0,
		vy: canvas.height * canvasSizeToPadSpeedRatio,
		height: canvas.height * padLenthRatio,
		color: 'blue',
		draw: function() {
			ctx.fillStyle = this.color;
			ctx.fillRect(canvas.width - padThickness, this.y, padThickness, this.height);
		}
	};

	function ballOnRightPad() {
		return ball.onRightEdge() && (ball.y > rightPad.y && ball.y < (rightPad.y + rightPad.height))
	}

	var topPad = {
		x: 0,
		vx: canvas.width * canvasSizeToPadSpeedRatio,
		width: canvas.width * padLenthRatio,
		color: 'red',
		draw: function() {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, 0, this.width, padThickness);
		}
	};

	function ballOnTopPad() {
		return ball.onTopEdge() && (ball.x > topPad.x && ball.x < (topPad.x + topPad.width))
	}

	var bottomPad = {
		x: 0,
		vx: canvas.width * canvasSizeToPadSpeedRatio,
		width: canvas.width * padLenthRatio,
		color: 'red',
		draw: function() {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, canvas.height - padThickness, this.width, padThickness);
		}
	};

	function ballOnBottomPad() {
		return ball.onBottomEdge() && (ball.x > bottomPad.x && ball.x < (bottomPad.x + bottomPad.width))
	}

	function clear() {
		ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	function applyKeyPressToPads() {
		if (validKeys.arrrowLeft.pressed) {
			topPad.x -= topPad.vx;
			bottomPad.x -= bottomPad.vx;
		}

		if (validKeys.arrrowRight.pressed) {
			topPad.x += topPad.vx;
			bottomPad.x += bottomPad.vx;
		}

		if (validKeys.arrrowUp.pressed) {
			leftPad.y -= leftPad.vy;
			rightPad.y -= rightPad.vy;
		}

		if (validKeys.arrrowDown.pressed) {
			leftPad.y += leftPad.vy;
			rightPad.y += rightPad.vy;
		}
	}

	function ballOnEdge() {
		return ball.onRightEdge() ||
			ball.onLeftEdge() ||
			ball.onTopEdge() ||
			ball.onBottomEdge();
	}

	function ballOut() {
		return ballOnEdge() && !ballOnLeftPad() && !ballOnRightPad() && !ballOnTopPad() && !ballOnBottomPad();
	}

	function draw() {
		clear();
		leftPad.draw();
		rightPad.draw();
		topPad.draw();
		bottomPad.draw();
		ball.draw();

		applyKeyPressToPads();

		ball.x += ball.vx;
		ball.y += ball.vy;

		if (ballOut()) {
			window.cancelAnimationFrame(raf);
			return;
		}

		if (ballOnTopPad() || ballOnBottomPad()) {
			ball.vy *= -1;
		}

		if (ballOnRightPad() || ballOnLeftPad()) {
			ball.vx *= -1;
		}

		// if (ball.bottomEdge() > canvas.height || ball.topEdge() < 0) {
		// 	ball.vy = -ball.vy;
		// }
		// if (ball.rightEdge() > canvas.width || ball.leftEdge() < 0) {
		// 	ball.vx = -ball.vx;
		// }

		raf = window.requestAnimationFrame(draw);
	}

	document.addEventListener('keydown', function(e) {
		switch (e.keyCode) {
			case validKeys.arrrowLeft.keyCode:
				validKeys.arrrowLeft.pressed = true;
				break;

			case validKeys.arrrowUp.keyCode:
				validKeys.arrrowUp.pressed = true;
				break;

			case validKeys.arrrowRight.keyCode:
				validKeys.arrrowRight.pressed = true;
				break;

			case validKeys.arrrowDown.keyCode:
				validKeys.arrrowDown.pressed = true;
				break;
		}
	}, false);

	document.addEventListener('keyup', function(e) {
		switch (e.keyCode) {
			case validKeys.arrrowLeft.keyCode:
				validKeys.arrrowLeft.pressed = false;
				break;

			case validKeys.arrrowUp.keyCode:
				validKeys.arrrowUp.pressed = false;
				break;

			case validKeys.arrrowRight.keyCode:
				validKeys.arrrowRight.pressed = false;
				break;

			case validKeys.arrrowDown.keyCode:
				validKeys.arrrowDown.pressed = false;
				break;
		}
	}, false);

	// canvas.addEventListener('click', function(e) {
	// 	if (!running) {
	// 		raf = window.requestAnimationFrame(draw);
	// 		running = true;
	// 	}
	// });

	// canvas.addEventListener('mouseout', function(e) {
	// 	window.cancelAnimationFrame(raf);
	// 	running = false;
	// });

	raf = window.requestAnimationFrame(draw);
	running = true;

	ball.draw();
}