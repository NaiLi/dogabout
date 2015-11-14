var speed = 1;
var time = 0;
var points = 0;
var shots = 0;

var spawning = [];

// Groups
var carGroup;
var spitGroup;

// Dog
var dogX;
var dogY;
var dogAngle;
var dogSpeed;
var dogRadius;

// Cars 
var carSpeed;

// Sprites
var dogSprite;
var spitSpeed;
var spitAngle;
var pointsText;
var shotsText;

// Sounds
var spitSound;

// Input
var spaceKey;

var Game = {

  preload : function() {
  	console.log("preloading game");

  	// Load images
  	game.load.image('bg', 'assets/roundabout-bg.png');
  	game.load.image('car1', 'assets/car.png');
  	game.load.image('dog', 'assets/dog.png');
  	game.load.image('spit', 'assets/spit.png');

  	// Load sounds
  	game.load.audio('spit_sound', 'assets/sound/spitsound.m4a')

  	// Page settings
		game.scale.pageAlignHorizontally		= true;
		//game.scale.pageAlignVertically			= true;
		game.scale.scaleMode								= Phaser.ScaleManager.SHOW_ALL; //RESIZE? (better for desktop)
		game.scale.setScreenSize(true);
  },

  create : function () {

  	console.log("creating game");
  	game.stage.backgroundColor = '#2e9430';
  	game.add.sprite(0, 0, 'bg');

  	// Create groups
  	carGroup = game.add.group();
  	carGroup.enableBody = true;
    carGroup.physicsBodyType = Phaser.Physics.ARCADE;
  	spitGroup = game.add.group();
  	spitGroup.enableBody = true;
    spitGroup.physicsBodyType = Phaser.Physics.ARCADE;

    // Sound
    spitSound = game.add.audio('spit_sound');

  	// Create spawning
  	spawning.push([122, 0, -45, 45]);										// Top left
  	spawning.push([122, gameHeight, -135, -45]);				// Down left
  	spawning.push([gameWidth/2, 0, 0, 90]);							// Top middle
  	spawning.push([gameWidth/2, gameHeight, 180, -90]);	// Bottom middle
  	spawning.push([520, 0, 45, 135]);										// Top right
  	spawning.push([525, gameHeight, 135, -135]);				// Bottom right
  	spawning.push([0, gameHeight/2, -90, 0]);						// left
  	spawning.push([gameWidth, gameHeight/2, 90, 180]);	// right

		barStyle 					= { font: "14px Arial", fill: "#fff", align: "center" };
  	pointsText  = game.add.text(5, 20, "Points:", barStyle);
  	shotsText  = game.add.text(5, 40, "Shots:", barStyle);

  	// Initial values
		dogAngle 			= 0;
		spitAngle			= 90;
		dogSpeed 			= 2;
		dogRadius 		= 40;
  	dogX 					= gameWidth/2;
		dogY 					= gameHeight/2;
		spitSpeed 		= 110;
		carSpeed 			= 30;

		// Event
		spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.shootSpit, this); 

  	this.createDog();
  	this.spawnCar();
  },

	update : function() {
		
		time++;

		dogAngle += dogSpeed;
		dogX = (gameWidth/2)+Math.cos(dogAngle*(Math.PI/180))*dogRadius;
		dogY = (gameHeight/2)+Math.sin(dogAngle*(Math.PI/180))*dogRadius;
		spitAngle = dogAngle+110;
		dogAngle = dogAngle%360;
		spitAngle = spitAngle%360;
		dogSprite.angle = dogAngle+90;

		game.physics.arcade.overlap(carGroup, spitGroup, this.collisionHandler, null, this);
		if(time%100 == 0) {
			this.spawnCar();
		}
	},

	createDog: function() {
		console.log("creating dog");
		dogSprite = game.add.sprite(dogX, dogY, 'dog');
		dogSprite.angle = dogAngle;
		dogSprite.anchor.setTo(0.5);
	},

	spawnCar : function() {

		var i = Math.floor(Math.random() * spawning.length);
		var x 		= spawning[i][0];
		var y 		= spawning[i][1];
		var angle	= spawning[i][2];
		var velAngle = spawning[i][3];
		var carSprite = game.add.sprite(x, y, 'car1');
		carSprite.angle = angle;
		carSprite.anchor.setTo(0.5);
		carGroup.add(carSprite);

		game.physics.arcade.velocityFromAngle(velAngle, carSpeed, carSprite.body.velocity);
	},

	shootSpit: function() {

		spitSound.play();
		var spitSprite 	= spitGroup.getFirstExists(false);

		if(spitSprite) {
			spitSprite.revive();
			spitSprite.x = dogX;
			spitSprite.y = dogY;
		}	else {
			//spitTween 	= game.add.tween(spitSprite);
			spitSprite 	= game.add.sprite(dogX, dogY, 'spit');
			spitGroup.add(spitSprite);
		}

		spitSprite.anchor.setTo(0.5);
		spitSprite.events.onOutOfBounds.add(this.killSprite, this);
		game.physics.arcade.velocityFromAngle(spitAngle, spitSpeed, spitSprite.body.velocity);

		shots++;
		shotsText.text = "Shots: " + shots;
	},

	carInCenter: function(car) {
		console.log("Watch out! Car in center");
		car.kill();
	},

	collisionHandler: function(car, spit) {
		points += 10;
		pointsText.text = "Points: " + points;
		car.kill();
		spit.kill();
	},

	killSprite: function(sprite) {
		spitSprite.body.velocity = 0;
		sprite.kill();
	}
};