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
	return Controller.extend("Snake.Game.controller.Main", {

		bodySnake: function (x, y) {
			//Zeichnet ein Schlangen-Quadrat an die X,Y Stelle
			ctx.fillStyle = 'green';
			ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
			ctx.strokeStyle = 'darkgreen';
			ctx.strokeRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
		},

		pizza: function (x, y) {
			//Zeichnet ein Pizza-Quadrat an die X,Y Stelle
			ctx.fillStyle = 'yellow';
			ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
			ctx.fillStyle = 'red';
			ctx.fillRect(x * snakeSize + 1, y * snakeSize + 1, snakeSize - 2, snakeSize - 2);
		},

		scoreText: function () {
			//Erstellt den scoreText
			var score_text = "Score: " + score;
			ctx.fillStyle = 'blue';
			ctx.fillText(score_text, 145, h - 5);
		},

		drawSnake: function () {
			//Inital Draw Snake
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
			//Die Loopfunktion
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
			//Erstellt an einer zufälligen Position auf dem Spielfeld ein Food
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
			//Prüft ob die Schlange mit der Wand koolidiert
			for (var i = 0; i < array.length; i++) {
				if (array[i].x === x && array[i].y === y)
					return true;
			}
			return false;
		},
		addKeyListen: function() {
			//In diese Funktion wird ein Event hinzugefügt
			//Das Event wird bei jedem Tastendrück ausgelöst
			$(document).keydown(function(event) {

				var keyCode = window.event.keyCode;
				keyCode = event.keyCode;

				switch (keyCode) {
				//Tasten=> Empfehlung Pfeiltasten
				case :
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
			//Nicht Standard UI5 nur für dieses Projekt
			mycanvas = document.getElementById('mycanvas');
			ctx = mycanvas.getContext('2d');
			//Control für den button
			btn = this.byId('btn');
			this.addKeyListen();
			direction = 'down';
			//Startet das Spiel
			btn.attachEvent("press", function () {
				//Spiel initiieren
				this.drawSnake();
				this.createFood();
				var self = this;
				//Loop
				this.gameloop = setInterval(
					function () {
						//Loop Methode des Spiels
						self.paint();
					},
					120);
			}, this);
			
			//	gameloop = setInterval(this.paint, 80);
		}

	});
});