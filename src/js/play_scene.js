'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3}
var Direction = {'LEFT':0, 'RIGHT':1, 'TOP':2, 'LOW':3}

//CAÑONES 
var cannon = function(index, game, x,y, dir){
  var direction = dir || Direction.RIGHT;
  this.cannon = game.add.sprite(x,y, 'cannon_01');
  switch (direction){
    case 0: this.cannon.anchor.set(1);
            this.cannon.angle = 180;
            break;
    case 2: this.cannon.anchor.set(0,1);
            this.cannon.angle = 90;
            break;
    case 3: this.cannon.anchor.set(1,0);
            this.cannon.angle = -90;
            break;
  }
  
  this.cannon.name = 'cannon_'+index.toString();
  //Funciones
  this.cannon.shoot= function(bulletsGroup){
    console.log('PIUM');
    this.bullet = bulletsGroup.getFirstExists(false);
    if(this.bullet){
    this.bullet.reset(x,y);
    switch (direction){
      case 0: this.bullet.body.velocity.x = -300;
              break;
      case 1: this.bullet.body.velocity.x = 300;
              break;
      case 2: this.bullet.body.velocity.y = 300;
              break;
      case 3: this.bullet.body.velocity.y = -300;
              break;
    }
    
  }
  };
  return this.cannon;
};
//ENEMIGO
var enemy= function(index,game, x,y, destructor){
    //ATRIBUTOS
    var destructor = destructor || false //Booleano. Si es true, el enemigo te mata con tocarte ( de un golpe);
		var detected = false;
		var delay = 0;
		  this.enemy = game.add.sprite(x, y, 'enemy_01');
      this.enemy.name= 'enemy_'+ index.toString();
      this.enemy.vel = 75;
      game.physics.arcade.enable(this.enemy);
      this.enemy.body.collideWorldBounds = true;
    //FUNCIONES
        //MOVIMIENTO
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
       		  	}
       		  })
        	}
        };
        //DETECCIÓN DEL JUGADOR
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
        	if (this.overlap(target) && delay === 0){
        		delay++;
        		setTimeout(function(){delay = 0;}, 1000);
        		if (!destructor) target.life--;
        		else target.life = 0;
        	} 
        };
        return this.enemy;
    };


//Scene de juego.
var PlayScene = {
    //_rush: {},  ////////////////////////////////////////////////////////////////////////BORRAR?
    gameState: { posX: 129,posY: 0},
    _player: {}, //Refinar esto con un creador de player.//player
    spritePlayer: 'player_01',
    //_speed: 300, //velocidad del player
    //_gravity: 9.8,
    // _jumpSpeed: 600, //velocidad de salto
    //_jumpHight: 150, //altura máxima del salto.
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

    //Colisiones
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
    this._player.life=4;
    this._player._jumpSpeed= -80;
    this._player._maxJumpSpeed = -800;
    this._player.maxJumpReached = false;
    this.jumpTimer = 0;
    this._player.jump = function(y){
      this.body.velocity.y = y;
    }
    this._player.moveLeft = function(x){ this.body.velocity.x = -x; }
    this._player.moveRight = function(x){ this.body.velocity.x = x; }
    this.configure();


  	//Crear cursores
  	this.timeJump = 0;
  	this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.pauseButton = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);

   	//Crear enemigo
    this._enemy = new enemy(0,this.game,320,1152);
    //Crear cañones y balas
    this.bulletTime = 4;
    this.bulletGroup = this.game.add.group();
    this.bulletGroup.enableBody = true;
    this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.bulletGroup.createMultiple (20, 'bullet_01');
    this.bulletGroup.setAll('outOfBoundsKill', true);
    this.bulletGroup.setAll('checkWorldBounds', true);
    this.bulletGroup.forEach(function(obj){
      obj.body.allowGravity = false;
      obj.body.immovable = true;
    })
    //Hacer grupo de cañones y enemigos.
    this._cannon = new cannon(0,this.game, 94, 992);
    this._cannon2 = new cannon(0,this.game, 608, 1248, Direction.LOW);
   
  },
    
    //IS called one per frame.
    update: function () {
    	//TEXTO DE DEBUG----------------------------------------------------
    	this.game.debug.text('PLAYER LIFE: '+this._player.life,this.game.world.centerX-300,50);
        
        //cambiar la gravedad
    	//this._player.body.velocity.y += (this._gravity*this.game.time.elapsed/2);
    	this.checKPlayerTrigger();
    	var collisionWithTilemap = this.game.physics.arcade.collide(this._player, this.groundLayer);
    	this.game.physics.arcade.collide(this._enemy, this.groundLayer);
        //----------------------------------PLAYER-----------------
        this._player.body.velocity.x = 0;
        if(this._player.body.onFloor())this._numJumps=0;
        this.movement(150);

        //this.jumpButton.onDown.add(this.jumpCheck, this);
        if (this.jumpButton.isDown && this._player.body.onFloor()){
        	this.timeJump++;
        } 
        if(!this.jumpButton.isDown && this.timeJump != 0){
        	this.jumpCheck();
        	this.timeJump= 0;
        }
        
        this.pauseButton.onDown.add(this.pauseMenu, this);
        //----------------------------------ENEMY------------------
       
        this._enemy.detected(this._player);
        this._enemy.move(this.collidersgroup);

        //-----------------------------------CANNONS------------------------------
        if(this.game.time.now > this.bulletTime){
          this._cannon.shoot(this.bulletGroup);
          this._cannon2.shoot(this.bulletGroup);
          this.bulletTime = this.game.time.now + 2000;
        }
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
    	//ZONAS SECRETAS
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
    	
    	var jump = this._player._jumpSpeed*this.timeJump;
    	if( jump < this._player._maxJumpSpeed){
    		this._player.body.velocity.y=0;
    		this._player.jump(this._player._maxJumpSpeed);
    	}
    	else this._player.jump(jump);
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
        if (this._player.life<1) this.onPlayerDeath();
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
        this.game.physics.arcade.enable(this._player);
        //FISICAS DEL JUGADOR (¿DESACTIVAR?)    ////////////////////////////////////////////////////////////////////////////////////////////////
        //this.game.physics.arcade.gravity.y = 250;
        
        this.game.physics.arcade.gravity.y = 2000;  
        //this._player.body.allowGravity = false;
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
