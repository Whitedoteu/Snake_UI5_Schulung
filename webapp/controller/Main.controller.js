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
	var food; // JSON aus x und y position
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

			//TODO move snakeX or snakeY according to the direction

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
			//TODO fülle die Food-Variable mit neuen Koordinaten
			//TODO kein Food unter der Schlange erstellen
			//TODO Kein Rückgabe wert notwendig da globale Variable
		},

		checkCollision: function (x, y, array) {
			//Prüft ob die Schlange mit der Wand koolidiert
			//TODO Prüfe auf Kollision mit der Wand
		},
		addKeyListen: function () {
			//In diese Funktion wird ein Event hinzugefügt
			//Das Event wird bei jedem Tastendrück ausgelöst
			$(document).keydown(function (event) {

				var keyCode = window.event.keyCode;
				keyCode = event.keyCode;

				switch (keyCode) {
					//Tasten=> Empfehlung Pfeiltasten
					//TODO Cases pro KeyCode
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