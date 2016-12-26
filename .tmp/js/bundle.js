(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GameOver = {
    create: function () {
        console.log("Game Over");
        var button = this.game.add.button(400, 300, 
                                          'button', 
                                          this.actionOnClick, 
                                          this, 2, 1, 0);
        button.anchor.set(0.5);
        var goText = this.game.add.text(400, 100, "GameOver");
        var text = this.game.add.text(0, 0, "Reset Game");
        var text2 = this.game.add.text(0, 0, "Return Menu");
        text.anchor.set(0.5);
        goText.fill = '#43d637';
        goText.anchor.set(0.5);
        text2.anchor.set(0.5);
        goText.anchor.set(0.5);
        button.addChild(text);
        //TODO 8 crear un boton con el texto 'Return Main Menu' que nos devuelva al menu del juego.
        var button2 = this.game.add.button(400, 400, 
                                          'button', 
                                          this.actionOnClick2, 
                                          this, 2, 1, 0);
        button2.anchor.set(0.5);
        button2.addChild(text2);
    },
    
    //TODO 7 declarar el callback del boton.
    actionOnClick: function(){
        this.game.state.start('play');
    },
    actionOnClick2: function(){
       this.game.world.setBounds(0,0,800,600);
       this.game.stage.backgroundColor = '#000000';
       this.game.state.start('menu');
    }

};

module.exports = GameOver;


},{}],2:[function(require,module,exports){
'use strict';

//TODO 1.1 Require de las escenas, play_scene, gameover_scene y menu_scene.
var PlayScene = require('./play_scene.js');
var GameOver = require('./gameover_scene.js');
var MenuScene = require('./menu_scene.js');
var MenuInGame = require('./menu_in_game.js');
var SelectPlayer = require ('./select_player.js');
//  The Google WebFont Loader will look for this object, so create it before loading the script.

var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    this.game.load.spritesheet('button', 'images/buttons.png', 168, 70);
    this.game.load.image('logo', 'images/phaser.png');
  },

  create: function () {
    //this.game.state.start('preloader');
    this.game.state.start('menu');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(100,300, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5); 
    this.game.load.setPreloadSprite(this.loadingBar);
    this.game.stage.backgroundColor = "#000000";
    
    
    
    this.load.onLoadStart.add(this.loadStart, this);
    //TODO 2.1 Cargar el tilemap images/map.json con el nombre de la cache 'tilemap'.
      //la imagen 'images/simples_pimples.png' con el nombre de la cache 'tiles' y
      // el atlasJSONHash con 'images/rush_spritesheet.png' como imagen y 'images/rush_spritesheet.json'
      //como descriptor de la animación.
       this.game.load.tilemap('level_01', 'images/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
       this.game.load.tilemap('level_02', 'images/prueb.json', null, Phaser.Tilemap.TILED_JSON);
       this.game.load.image('tiles', 'images/TileSet.png');
       this.game.load.image('player_01', 'images/player.png');
       this.game.load.image('player_02', 'images/player2.png');
       this.game.load.image('player_03', 'images/player3.png');
       this.game.load.image('enemy_01', 'images/enemy.png');
       this.game.load.image('flechaIz', 'images/flechaIz.png');
       this.game.load.image('flechaDer', 'images/flechaDer.png');
       this.game.load.image('trigger', 'images/trigger.png');
       this.game.load.atlasJSONHash('rush_idle01', 'images/rush_spritesheet.png', 'images/rush_spritesheet.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
       
      //TODO 2.2a Escuchar el evento onLoadComplete con el método loadComplete que el state 'play'
        this.game.load.onLoadComplete.add(this.loadComplete, this);
  },

  loadStart: function () {
    console.log("Game Assets Loading ...");
  },
    
    
     //TODO 2.2b function loadComplete()
  loadComplete: function(){
    console.log("dentro");
		//this._ready = true;
    //this.game.state.start('play');
    this.game.state.start('select_player');
    },

  update: function(){
        this._loadingBar
    }
};


var wfconfig = {
 
    active: function() { 
        console.log("font loaded");
        init();
    },
 
    google: {
        families: ['Sniglet']
    }
 
};
 
//TODO 3.2 Cargar Google font cuando la página esté cargada con wfconfig.
//TODO 3.3 La creación del juego y la asignación de los states se hará en el método init().

window.onload = function () {
  WebFont.load(wfconfig);
};

function init (){
  var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game');
//TODO 1.2 Añadir los states 'boot' BootScene, 'menu' MenuScene, 'preloader' PreloaderScene, 'play' PlayScene, 'gameOver' GameOver.
 game.state.add('boot', BootScene);
 game.state.add('menu', MenuScene);
 game.state.add('preloader', PreloaderScene);
 game.state.add('select_player', SelectPlayer);
 game.state.add('play', PlayScene);
 game.state.add('menu_in_game',MenuInGame);
 game.state.add ('gameOver', GameOver);

//TODO 1.3 iniciar el state 'boot'. 
game.state.start('boot');
}
},{"./gameover_scene.js":1,"./menu_in_game.js":3,"./menu_scene.js":4,"./play_scene.js":5,"./select_player.js":6}],3:[function(require,module,exports){
var MenuInGame = {
    create: function () {

        var button = this.game.add.button(this.game.world.centerX, 
                                               0, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 1, 0);
        button.anchor.set(0.5);
        var text = this.game.add.text(0, 0, "RESUME");
        text.font = 'Sniglet';
        text.anchor.set(0.5);
        button.addChild(text);
    },
    
    actionOnClick: function(){
        this.game.state.resume('play');
    }, 
};

module.exports = MenuInGame;
},{}],4:[function(require,module,exports){
var MenuScene = {
  perro: 98,
    create: function () {
        
        var logo = this.game.add.sprite(this.game.world.centerX, 
                                        this.game.world.centerY, 
                                        'logo');
        logo.anchor.setTo(0.5, 0.5);
        var buttonStart = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 1, 0);
        buttonStart.anchor.set(0.5);
        var textStart = this.game.add.text(0, 0, "Start");
        textStart.font = 'Sniglet';
        textStart.anchor.set(0.5);
        buttonStart.addChild(textStart);
    },
    
    actionOnClick: function(){
        this.game.state.start('preloader');
    } 
};

module.exports = MenuScene;
},{}],5:[function(require,module,exports){
'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3}
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3}
var enemy= function(index,game, x,y){
		var detected = false;
		var delay = 0;
		this.enemy = game.add.sprite(x, y, 'enemy_01');
        this.enemy.name= 'enemy_'+ index.toString();
        this.enemy.elong = {
        	xMax : x+96,
            xMin : x-96,
        };
        this.enemy.vel = 75;
        game.physics.arcade.enable(this.enemy);
        this.enemy.body.collideWorldBounds = true;
        this.enemy.move = function(colliders){
        	var self = this;
        	var collision;
        	if(!detected){
       		  this.body.velocity.x =this.vel;
       		  colliders.forEach(function(trigger){
       		  	if(self.overlap(trigger) && delay === 0){
       		  		delay++;
       		  		setTimeout(function(){delay = 0;},1000);
       		  		self.body.velocity.x=0;
       		  		self.vel *= -1;
       		  		//console.log(self.vel);
       		  	}
       		  })
        	}
        };
        this.enemy.detected = function(target){
        	var positionTarget = target.body.position;
        	var positionEnemy= this.body.position;
        	var distance= Math.abs(positionTarget.x - positionEnemy.x);
        	if (positionTarget.y === positionEnemy.y && distance <= 128 ){
        		detected = true;
        		if (positionTarget.x > positionEnemy.x) this.body.velocity.x = +90;
        		else if (positionTarget.x < positionEnemy.x) this.body.velocity.x = -90;
        	}
        	else{
        		detected= false;
        		this.body.velocity.x=0;
        		//this.body.position.x = this.vel/2;
        	} 
        };
        return this.enemy;
    };
//Scena de juego.
var PlayScene = {
    _rush: {},
    gameState: { posX: 129,posY: 0},
    _player: {}, //player
    spritePlayer: 'player_01',
    _speed: 300, //velocidad del player
    _gravity: 9.8,
    _jumpSpeed: 600, //velocidad de salto
    _jumpHight: 150, //altura máxima del salto.
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.
    _numJumps: 0,
    //Método constructor...
  create: function () {
  	//Crear mapa;
  	this.map = this.game.add.tilemap('level_01');
  	this.map.addTilesetImage('patrones','tiles');
  	//Creación de layers
  	this.jumpThroughLayer = this.map.createLayer('JumpThrough');
  	this.groundLayer = this.map.createLayer('Ground');
  	this.deathLayer = this.map.createLayer('Death');
  	this.overLayer = {
  		layer: this.map.createLayer('OverLayer'),
  		vis: true,
  	};
  	this.collidersgroup = this.game.add.group();
  	this.collidersgroup.enableBody = true;
  	this.collidersgroup.alpha = 0;
   	this.map.createFromObjects('Colliders',8, 'trigger',0,true,false,this.collidersgroup);
   	var self = this;
   	this.collidersgroup.forEach(function(obj){
   		obj.body.allowGravity = false;
   		obj.body.immovable = true;
   	})
  	this.map.setCollisionBetween(0,5000, true, 'Ground');
  	this.map.setCollisionBetween(0,5000, true, 'Death');
  	this.map.setCollisionBetween(0,5000, true, 'OverLayer');
  	this.map.setCollisionBetween(0,5000, true, 'JumpThrough');
    //Crear player:
    this._player= this.game.add.sprite(480,1184, this.spritePlayer);
  	this.configure();
  	// Crear cursores
  	this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.pauseButton = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
   	//Funciones del player.
  	//this._player.body.allowGravity = false;
   	this._player.jump= function(y){
   		this.body.velocity.y = -y;
   	}
   	this._player.moveLeft = function(x){ this.body.velocity.x = -x;}
   	this._player.moveRight = function(x){this.body.velocity.x = x;}
    this.jumpTimer = 0;
    this._enemy = new enemy(0,this.game,320,1152);
  },
    
    //IS called one per frame.
    update: function () {
    	//cambiar la gravedad
    	//this._player.body.velocity.y += (this._gravity*this.game.time.elapsed/2);
    	this.checKPlayerTrigger();
    	var collisionWithTilemap = this.game.physics.arcade.collide(this._player, this.groundLayer);
    	this.game.physics.arcade.collide(this._enemy, this.groundLayer);
       
        this._player.body.velocity.x = 0; 
        if(this._player.body.onFloor())this._numJumps=0;
        this.movement(150);
        this.jumpButton.onDown.add(this.jumpCheck, this);
        this.pauseButton.onDown.add(this.pauseMenu, this);
        //----------------------------------ENEMY------------------
        this._enemy.detected(this._player);
        this._enemy.move(this.collidersgroup);
        //-----------------------------------DEATH----------------------------------
        this.checkPlayerDeath(); 
    },
    
    init: function (spritePlayer){
       if (!!spritePlayer)this.spritePlayer= spritePlayer;
    },
    collisionWithJumpThrough: function(){
    	var self = this;
    	self.game.physics.arcade.collide(self._player, self.jumpThroughLayer);
    },
    checKPlayerTrigger: function(){
    	
    	if(this.game.physics.arcade.collide(this._player,this.overLayer.layer)){
    		this.overLayer.vis= false;
    		this.overLayer.layer.kill();
    	}
    	else {
    		var self = this;
    		this.collidersgroup.forEach(function(item){
    			if(!self.overLayer.vis && self._player.overlap(item)){
    				console.log('revive');
    				self.overLayer.layer.revive();
       			}
       			else if (self._player.overlap(item)){
       				self.collisionWithJumpThrough();			
       				
       			}
    		})
    	}
    },
    pauseMenu: function (){
    	this.gameState.posX = this._player.position.x;
    	this.gameState.posY = this._player.position.y;
    	this.destroy();
       	this.game.state.start('menu_in_game');
    },
    jumpCheck: function (){
    	if(this._numJumps < 2){ 
    		this._player.jump(500);
    		this._numJumps++;
    	}
    },
    canJump: function(collisionWithTilemap){
        return this.isStanding() && collisionWithTilemap || this._jamping;
    },
    
    onPlayerDeath: function(){
        //TODO 6 Carga de 'gameOver';
        this.destroy();
        this.game.state.start('gameOver');
    },
    
    checkPlayerDeath: function(){
        if(this.game.physics.arcade.collide(this._player, this.deathLayer))
            this.onPlayerDeath();
    },

    isStanding: function(){
        return this._player.body.blocked.down || this._player.body.touching.down
    },
        
    isJumping: function(collisionWithTilemap){
        return this.canJump(collisionWithTilemap) && 
            this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
    },
        
    GetMovement: function(){
        var movement = Direction.NONE
        //Move Right
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            movement = Direction.RIGHT;
        }
        //Move Left
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            movement = Direction.LEFT;
        }
        return movement;
    },
    //configure the scene
    configure: function(){
        //Start the Arcade Physics systems
        this.game.world.setBounds(0, 0, 864, 1760);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
		//this.game.physics.arcade.gravity.y = 250;
        //this.game.stage.backgroundColor = '#a9f0ff';
        //this.game.physics.enable(this._player, Phaser.Physics.ARCADE);
        this.game.physics.arcade.enable(this._player);
        this.game.physics.arcade.gravity.y = 2000;

        this._player.body.bounce.y = 0.2;
        this._player.body.collideWorldBounds = true;
        this._player.body.velocity.x = 0;
        this.game.camera.follow(this._player);
    },
    //move the player
    movement: function(incrementoX){
         if (this.cursors.left.isDown) this._player.moveLeft(incrementoX);
        else if (this.cursors.right.isDown) this._player.moveRight(incrementoX);
    },
    
    //TODO 9 destruir los recursos tilemap, tiles y logo.
    destroy: function(){
    this._player.destroy();
    this.map.destroy();
    }

};

module.exports = PlayScene;

},{}],6:[function(require,module,exports){
var MenuScene = {
  player:'',
  cont: 0,
    create: function () {
      var goText = this.game.add.text(400, 100, "Select the player");
      goText.fill = '#43d637';
      goText.anchor.set(0.5);
      this.flechaDer = this.game.add.sprite(this.game.world.centerX+100, this.game.world.centerY,'flechaDer');
      this.flechaIz = this.game.add.sprite(this.game.world.centerX-100, this.game.world.centerY,'flechaIz');
      this.flechaIz.scale.set(2.5);
      this.flechaIz.anchor.set(0.5);
      this.flechaDer.scale.set(2.5);
      this.flechaDer.anchor.set(0.5);

      this.players = [
       p1= this.game.add.sprite(this.game.world.centerX, this.game.world.centerY,'player_01'),
       p2= this.game.add.sprite(this.game.world.centerX, this.game.world.centerY,'player_02'),
       p3 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY,'player_03'),
      ]
      this._it=0;
      this.selectButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
      this.cursors = this.game.input.keyboard.createCursorKeys();
      for (var i =0; i < this.players.length; i++){
        this.players[i].anchor.set(0.5);
        this.players[i].scale.set(2.5);
        this.players[i].visible=false;
      }
    },
    update: function(){
       //this.players[this._it].anchor
       this.cont++;
      if (this.cont == 20) {
        this.flechaIz.scale.set(2.5);
        this.flechaDer.scale.set(2.5);
        this.cont = 0;
      }

       this.players[this._it].visible = true;
       this.cursors.left.onDown.add(this.prev, this);
       this.cursors.right.onDown.add(this.next, this);
       this.selectButton.onDown.add(this.selectPlayer, this);
    },
    selectPlayer: function(){
      var aux = this.players[this._it].key;
      this.game.state.start('play', true, false, aux);
    },
    next: function(){
      this.flechaDer.scale.set(3)
      this.players[this._it].visible = false;
      this._it = (this._it +1) % this.players.length;console.log(this._it);
    },
    prev: function(){
       this.flechaIz.scale.set(3);
       this.players[this._it].visible = false;
       if (!!this._it) this._it--;
       else this._it = this.players.length -1;
    },
};

module.exports = MenuScene;
},{}]},{},[2]);
