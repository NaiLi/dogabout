
var gameWidth = 640;//window.innerWidth;
var gameHeight = 400;//window.innerHeight;

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, '');

game.state.add('Game', Game);
game.state.start('Game');