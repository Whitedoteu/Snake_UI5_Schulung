sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	var mycanvas;
	var ctx;
	var snakeSize = 10;
	var w = 600;
	var h = 600;
	var score = 0;
	var snake;
	var snakeSize = 10;
	var food;
	var direction;
	var gameloop;
	var btn;
	return Controller.extend("test.test.controller.View1", {

		bodySnake: function (x, y) {
			ctx.fillStyle = 'green';
			ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
			ctx.strokeStyle = 'darkgreen';
			ctx.strokeRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
		},

		pizza: function (x, y) {
			ctx.fillStyle = 'yellow';
			ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
			ctx.fillStyle = 'red';
			ctx.fillRect(x * snakeSize + 1, y * snakeSize + 1, snakeSize - 2, snakeSize - 2);
		},

		scoreText: function () {
			var score_text = "Score: " + score;
			ctx.fillStyle = 'blue';
			ctx.fillText(score_text, 145, h - 5);
		},

		drawSnake: function () {
			var length = 4;
			snake = [];
			for (var i = length - 1; i >= 0; i--) {
				snake.push({
					x: i,
					y: 0
				});
			}
		},

		paint: function () {
			ctx.fillStyle = 'lightgrey';
			ctx.fillRect(0, 0, w, h);
			ctx.strokeStyle = 'black';
			ctx.strokeRect(0, 0, w, h);

			btn.setEnabled(false);

			var snakeX = snake[0].x;
			var snakeY = snake[0].y;

			if (direction == 'right') {
				snakeX++;
			} else if (direction == 'left') {
				snakeX--;
			} else if (direction == 'up') {
				snakeY--;
			} else if (direction == 'down') {
				snakeY++;
			}

			if (snakeX == -1 || snakeX == w / snakeSize || snakeY == -1 || snakeY == h / snakeSize || this.checkCollision(snakeX, snakeY, snake)) {
				//restart game
				btn.setEnabled(true);

				ctx.clearRect(0, 0, w, h);
				gameloop = clearInterval(gameloop);
				return;
			}

			if (snakeX == food.x && snakeY == food.y) {
				var tail = {
					x: snakeX,
					y: snakeY
				}; //Create a new head instead of moving the tail
				score++;

				this.createFood(); //Create new food
			} else {
				var tail = snake.pop(); //pops out the last cell
				tail.x = snakeX;
				tail.y = snakeY;
			}
			//The snake can now eat the food.
			snake.unshift(tail); //puts back the tail as the first cell

			for (var i = 0; i < snake.length; i++) {
				this.bodySnake(snake[i].x, snake[i].y);
			}

			this.pizza(food.x, food.y);
			this.scoreText();
		},

		createFood: function () {
			food = {
				x: Math.floor((Math.random() * 30) + 1),
				y: Math.floor((Math.random() * 30) + 1)
			};

			for (var i = 0; i > snake.length; i++) {
				var snakeX = snake[i].x;
				var snakeY = snake[i].y;

				if (food.x === snakeX && food.y === snakeY || food.y === snakeY && food.x === snakeX) {
					food.x = Math.floor((Math.random() * 30) + 1);
					food.y = Math.floor((Math.random() * 30) + 1);
				}
			}
		},

		checkCollision: function (x, y, array) {
			for (var i = 0; i < array.length; i++) {
				if (array[i].x === x && array[i].y === y)
					return true;
			}
			return false;
		},
		addKeyListen: function() {
			$(document).keydown(function(event) {

				var keyCode = window.event.keyCode;
				keyCode = event.keyCode;

				switch (keyCode) {

				case 37:
					if (direction != 'right') {
						direction = 'left';
					}
					console.log('left');
					break;

				case 39:
					if (direction != 'left') {
						direction = 'right';
						console.log('right');
					}
					break;

				case 38:
					if (direction != 'down') {
						direction = 'up';
						console.log('up');
					}
					break;

				case 40:
					if (direction != 'up') {
						direction = 'down';
						console.log('down');
					}
					break;
				}
			});
		},

		onAfterRendering: function () {
			mycanvas = document.getElementById('mycanvas');
			ctx = mycanvas.getContext('2d');
			btn = this.byId('btn');
			this.addKeyListen();
			btn.attachEvent("press", function () {
				this.drawSnake();
				this.createFood();
				var self = this;
				this.gameloop = setInterval(
					function () {
						self.paint();
					},
					120);
			}, this);
			direction = 'down';
			//	gameloop = setInterval(this.paint, 80);
		}

	});
});