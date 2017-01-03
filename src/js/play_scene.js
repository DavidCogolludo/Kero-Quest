'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3}
var Direction = {'LEFT':0, 'RIGHT':1, 'TOP':2, 'LOW':3}
var level;

////////////////////////////////ENTIDADES////////////////////////////////////////////
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
    //console.log('PIUM');
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
        		if (!destructor && !target.invincible) {
                target.hit();
              }
        	  else if (!target.invincible) target.life = 0;
        	} 
        };
        return this.enemy;
    };


//////////////////////////////////////////////////ESCENA//////////////////////////////////////////////////
//Scene de juego.
var PlayScene = {
    //_rush: {},  ////////////////////////////////////////////////////////////////////////BORRAR?
    gameState: { posX: 129,posY: 0},
    _player: {}, //Refinar esto con un creador de player.//player
    spritePlayer: 'player_01',
    level: 'level_01',
    //_speed: 300, //velocidad del player
    //_gravity: 9.8,
    // _jumpSpeed: 600, //velocidad de salto
    //_jumpHight: 150, //altura máxima del salto.
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.
    _numJumps: 0,
    _keys: 0,
    _maxTimeInvincible: 80, //Tiempo que esta invencible tras ser golpeado
    _maxInputIgnore: 30,   //Tiempo que ignora el input tras ser golpeado
      
  init: function (spritePlayer, levelSelected){
    if (!!spritePlayer)this.spritePlayer = spritePlayer;
    this.level = levelSelected;
  },
  //Método constructor...
  create: function () {
    //Crear mapa;
    if (this.level === 'level_02') this.map = this.game.add.tilemap('level_02');
    else this.map = this.game.add.tilemap('level_01');
  	

  	this.map.addTilesetImage('patrones','tiles');
  	
    //Creación de layers
  	this.jumpThroughLayer = this.map.createLayer('JumpThrough');
  	this.groundLayer = this.map.createLayer('Ground');
  	this.deathLayer = this.map.createLayer('Death');
  	this.overLayer = {
  		layer: this.map.createLayer('OverLayer'),
  		vis: true,
  	};
    this.endLayer = this.map.createLayer('EndLvl');

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
    this.map.setCollisionBetween(0,5000, true, 'EndLvl');

    //Crear player:
    //Posición de inicio de nivel
    if (this.level === 'level_02') this._player= this.game.add.sprite(480, 576, this.spritePlayer); //nivel2
    else this._player = this.game.add.sprite(480,1184, this.spritePlayer); //nivel1
    //Atributos
    this._player.life=4;
    this._player._jumpSpeed= -80;
    this._player._maxJumpSpeed = -800;
    this._player.maxJumpReached = false;
    this._player.timeRecover = 0;
    this._player.ignoraInput = false;
    this._player.hitDir = 0;
    this.jumpTimer = 0;
    this._player.invincible = false;
    this._player.jump = function(y){
      this.body.velocity.y = y;
    }
    this._player.hit = function(){
      if (this.body.velocity.x > 0) this.hitDir = 1;
      else if (this.body.velocity.x < 0) this.hitDir = -1;
      else this.hitDir = 0;
      this.ignoraInput = true;
      this.jump(-500);
      if (!this.invincible) this.damage();
    }
    this._player.damage = function(){
      this.life--;
      this.invincible = true;
    }
    this._player.recover = function(){
      this.tint = 0xffffff;
      this.invincible = false;
    }
    this._player.moveLeft = function(x){ this.body.velocity.x = -x; }
    this._player.moveRight = function(x){ this.body.velocity.x = x; }
    this.configure();

  	//Crear cursores
  	this.timeJump = 0;
  	this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.pauseButton = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);

    //Crear Llaves
    this.keyGroup = this.game.add.group();
    this.keyGroup.enableBody = true;
    this.keyGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.keyGroup.create(416, 480, 'llave_01');
    this.keyGroup.forEach(function(obj){
      obj.body.allowGravity = false;
      obj.body.immovable = true;
    })

    //Crear Puertas
    this.doorGroup = this.game.add.group();
    this.doorGroup.enableBody = true;
    this.doorGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.doorGroup.create(510, 480, 'puerta_01');
    this.doorGroup.forEach(function(obj){
      obj.body.allowGravity = false;
      obj.body.immovable = true;
    })

    //Hacer grupo de cañones y enemigos.
    this.enemyGroup = this.game.add.group();
    this.enemyGroup.enableBody = true;
    this.enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;

   	//Crear enemigos segun nivel
    if (this.level === 'level_02') {  //nivel2
      this.enemyGroup.add(this._enemy = new enemy(0,this.game, 480, 390));    //nivel2 : Con este comando creamos a la vez que agregamos al grupo
      this.enemyGroup.add(this._enemy2 = new enemy(0,this.game, 480, 32));    //nivel2
      this.enemyGroup.add(this._enemy3 = new enemy(0,this.game, 660, 580));   //nivel2
    } else this._enemy = new enemy(0,this.game,320,1152);  //nivel1

    this.enemyGroup.forEach(function(obj){
      obj.body.allowGravity = false;
      obj.body.immovable = true;
    })

    //Crear Cañones
    if (this.level === 'level_02') {  //nivel2
     this._cannon = new cannon(0,this.game, 128, 320);  //nivel2
     this._cannon2 = new cannon(0,this.game, 192, 576, Direction.LOW); //nivel2
    } else {
      this._cannon = new cannon(0,this.game, 94, 992);  //nivel1
      this._cannon2 = new cannon(0,this.game, 608, 1248, Direction.LOW); //nivel1
    }

    //Crear balas
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
  },
    
    //IS called one per frame.
    update: function () {
    	//TEXTO DE DEBUG----------------------------------------------------
    	this.game.debug.text('PLAYER HEALTH: '+this._player.life,this.game.world.centerX-400,50);
      this.game.debug.text('KEYS: '+this._keys, this.game.world.centerX-400,80);
      /*
      this.game.debug.text('X Velocity: '+this._player.body.velocity.x, this.game.world.centerX-400,110);
      this.game.debug.text('Y Velocity: '+this._player.body.velocity.y, this.game.world.centerX-400,140);
      this.game.debug.text('Invincible: '+this._player.invincible, this.game.world.centerX-400,170);
      this.game.debug.text('Recovery time: '+this._player.timeRecover, this.game.world.centerX-400,200);
      this.game.debug.text('Ignore input: '+this._player.ignoraInput, this.game.world.centerX-200,170);
      this.game.debug.text('Direccion impacto:'+this._player.hitDir, this.game.world.centerX-200,200);        
      */
      //cambiar la gravedad
    	//this._player.body.velocity.y += (this._gravity*this.game.time.elapsed/2);
    	this.checKPlayerTrigger();
    	var collisionWithTilemap = this.game.physics.arcade.collide(this._player, this.groundLayer);
      this.game.physics.arcade.collide(this._player, this._enemy);
    	this.game.physics.arcade.collide(this._enemy, this.groundLayer);
      this.game.physics.arcade.collide(this._enemy2, this.groundLayer);
      if (this._keys <= 0) this.game.physics.arcade.collide(this._player, this.doorGroup);
        //----------------------------------PLAYER-----------------
        this._player.body.velocity.x = 0;
        if(this._player.body.onFloor()){this._numJumps=0;}
        if(!this._player.ignoraInput) this.movement(150);
        if(this._player.ignoraInput){
          if (this._player.hitDir === -1) this._player.body.velocity.x = 50;
          else if (this._player.hitDir === 1) this._player.body.velocity.x = -50;
          else this._player.body.velocity.x = 0;
        }

        //this.jumpButton.onDown.add(this.jumpCheck, this);
        if (this.jumpButton.isDown && this._player.body.onFloor()){
        	this.timeJump++;
        } 
        if(!this.jumpButton.isDown && this.timeJump != 0){
        	this.jumpCheck();
        	this.timeJump= 0;
        }

        //Frames de invencibilidad
        if(this._player.invincible){
          this._player.tint = Math.random() * 0xffffff;
          this._player.timeRecover++; //Frames de invencibilidad
        }

        if(this._player.timeRecover >= this._maxInputIgnore){
          this._player.ignoraInput = false;
        }
        if(this._player.timeRecover >= this._maxTimeInvincible){  //Fin invencibilidad
          this._player.timeRecover = 0;
          this._player.recover();
        }
        
        this.pauseButton.onDown.add(this.pauseMenu, this);
        //----------------------------------ENEMY-------------------
        /*
        this.enemyGroup.forEach(function(obj){
            self.obj.detected(this._player);
            self.obj.move(this.collidersgroup);
        })*/
        if (this.level === 'level_02'){
          //Esto lo suyo sería que simplemente recorriera los elementos en el grupo enemigos
          this._enemy.detected(this._player);
          this._enemy.move(this.collidersgroup);

          this._enemy2.detected(this._player);
          this._enemy2.move(this.collidersgroup);
        
          this._enemy3.detected(this._player);
          this._enemy3.move(this.collidersgroup);
        } else {
          this._enemy.detected(this._player);
          this._enemy.move(this.collidersgroup);
        }
        
        //-----------------------------------CANNONS------------------------------
        if(this.game.time.now > this.bulletTime){
          this._cannon.shoot(this.bulletGroup);
          this._cannon2.shoot(this.bulletGroup);
          this.bulletTime = this.game.time.now + 2000;
        }
        //-----------------------------------PUERTAS Y LLAVES-------------------------------
        this.checkKey();
        if (this._keys > 0) this.checkDoor();
        //-----------------------------------DEATH----------------------------------
        this.checkPlayerDeath();
        this.checkPlayerEnd();
    },

    collisionWithJumpThrough: function(){
    	var self = this;
    	self.game.physics.arcade.collide(self._player, self.jumpThroughLayer);
    },
    checkKey: function(){
      var self = this;
      this.keyGroup.forEach(function(obj){
          if(self.game.physics.arcade.collide(self._player, obj)){
          obj.destroy();
          self._keys++;}
      })
    },
    checkDoor: function(){
      var self = this;
      this.doorGroup.forEach(function(obj){
            if(self.game.physics.arcade.collide(self._player, obj)){
            obj.destroy();
            self._keys--;}
      })
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
      this.game.world.setBounds(0,0,800,600);
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
        this.game.world.setBounds(0,0,800,600);
        this.game.state.start('gameOver', true, false, this.spritePlayer, this.level);
    },

    onPlayerEnd: function(){
        this.destroy();
        this.game.world.setBounds(0,0,800,600);
        this.game.state.start('endLevel', true, false, this.spritePlayer, this.level);
    },
    
    checkPlayerDeath: function(){
        self = this;
        //Collision with bullet
        this.bulletGroup.forEach(function(obj){
          if(self.game.physics.arcade.collide(self._player, obj)){
          obj.destroy();
          self._player.hit();}
        })
        //Death Layer
        if(this.game.physics.arcade.collide(this._player, this.deathLayer))
            this.onPlayerDeath();
        //No HP left
        if (this._player.life<1) this.onPlayerDeath();
    },

    checkPlayerEnd: function(){
      if(this.game.physics.arcade.collide(this._player, this.endLayer))
          this.onPlayerEnd();
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
        //Start the Arcade Physics system
        if (this.level === "level_02") this.game.world.setBounds(0, 0, 960, 640); //Lvl2
        else this.game.world.setBounds(0,0, 864, 1760);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
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
