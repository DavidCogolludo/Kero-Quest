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
        	/*
        	if(!detected){
        		colliders.forEach(function(item){
  		        	if (self.overlap(item)){
                  	self.vel = -self.vel;
                  	self.body.position.x += self.vel/5;
  		        	} 
  	        	})
  	        	this.body.velocity.x = this.vel;
        	}*/
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
  	//Crear player:
  	//this.aux = this.game.state.states['play'];
  	//this.spritePlayer=this.game.state.states['select_player'].player;
    this._player= this.game.add.sprite(480,1184, this.spritePlayer);
  	//Crear mapa;
  	this.map = this.game.add.tilemap('level_01');
  	this.map.addTilesetImage('patrones','tiles');
  	//Creación de layers
  	this.groundLayer = this.map.createLayer('Ground');
  	this.deathLayer = this.map.createLayer('Death');
  	this.overLayer = {
  		layer: this.map.createLayer('OverLayer'),
  		vis: true,
  	};
  	this.collidersgroup = this.game.add.group();
  	this.collidersgroup.alpha = 0;
   	this.map.createFromObjects('Colliders',8, 'trigger',0,true,false,this.collidersgroup);

  	this.map.setCollisionBetween(0,5000, true, 'Ground');
  	this.map.setCollisionBetween(0,5000, true, 'Death');
  	this.map.setCollisionBetween(0,5000, true, 'OverLayer');

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
        if(this._player.body.onFloor()) this._numJumps=0;
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
    checKPlayerTrigger: function(){
    	if(this.game.physics.arcade.collide(this._player,this.overLayer.layer)){
    		this.overLayer.vis= false;
    		this.overLayer.layer.kill();	
    	}
    	else {
    		var self = this;
    		this.collidersgroup.forEach(function(item){
    			if(!self.overLayer.vis && self._player.overlap(item)){
    				self.overLayer.layer.revive();
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
