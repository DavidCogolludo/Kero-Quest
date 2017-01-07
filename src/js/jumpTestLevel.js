'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
//var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3}
var Direction = {'LEFT':0, 'RIGHT':1, 'TOP':2, 'LOW':3}
var entities = require('./entities.js');

//////////////////////////////////////////////////ESCENA//////////////////////////////////////////////////
//Scene de juego.
var PlayScene = {
    gameState: {  //Valores predefinidos que seran cambiados al ir a pausa y reescritos al volver
      posX: 128,
      posY: 448,
      playerHP: 4,
      invincible: false,
      timeRecover: 80,
      },
    _player: {}, //Refinar esto con un creador de player.//player
    playerInfo: {name: 'player_01', life: 4, jump: -700, speedPower: true },
    level: 'jumpTestLevel',
    _resume: false,
    _maxYspeed: 0,
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.
    _numJumps: 0,
    _keys: 0,
    _maxTimeInvincible: 80, //Tiempo que esta invencible tras ser golpeado
    _maxInputIgnore: 30,   //Tiempo que ignora el input tras ser golpeado
    _ySpeedLimit: 800,   //El jugador empieza a saltarse colisiones a partir de 1500 de velocidad
      
  init: function (resume, playerInfo){
    // Lo que se carga da igual de donde vengas...
    if (!!playerInfo) this.playerInfo = playerInfo; //Si no recibe un spritePlayer carga el básico
    // Y ahora si venimos de pausa...
    if (resume)this._resume = true;
     //Activara las variables almacenadas en gameState a la hora de inicializar el personaje
    else{
      this.shutdown();
      this._keys = 0;
    } 
  },
  shutdown: function(){
  	if (this._resume){
  	  this.gameState= {  //Valores predefinidos que seran cambiados al ir a pausa y reescritos al volver
        posX: this._player.position.x,
        posY: this._player.position.y,
        playerHP: this._player.life,
        invincible: this._player.invincible,
        timeRecover: this._player.timeRecover,
      };

    }
    else this.gameState= {  //Valores predefinidos que seran cambiados al ir a pausa y reescritos al volver
      posX: 480,
      posY: 1184,
      playerHP: 4,
      invincible: false,
      timeRecover: 80,
      };
    this._resume = false;
  },
  //Método constructor...
  create: function () {
    var self = this;
    //Crear mapa;
    this.map = this.game.add.tilemap('jumpTestLevel');
  	this.map.addTilesetImage('patrones','tiles');
  	
    //Creación de layers
    this.backgroundLayer = this.map.createLayer('Background');
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
    this._player = new entities.Player(this.game,this.gameState.posX, this.gameState.posY,this.playerInfo);
    this.configure();

  	//Crear cursores
  	this.timeJump = 0;
  	this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.pauseButton = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);

  },
    
    //IS called one per frame.
    update: function () {
      var self=this;
    	//TEXTO DE DEBUG----------------------------------------------------
      this.game.debug.text('Y speed: '+this._player.body.velocity.y, this.game.world.centerX-400, 80);
      this.game.debug.text('MAX Y Speed: '+this._maxYspeed, this.game.world.centerX-400, 110);
    	this.game.debug.text('PLAYER HEALTH: '+this._player.life,this.game.world.centerX-400,50);
      this.game.debug.text('KEYS: '+this._keys, this.game.world.centerX-400,140);
      if (this._player.body.velocity.y > this._maxYspeed) this._maxYspeed = this._player.body.velocity.y;
      
      //cambiar la gravedad
    	//this._player.body.velocity.y += (this._gravity*this.game.time.elapsed/2);
    	this.checKPlayerTrigger();
      if (this._player.body.velocity.y > this._ySpeedLimit) this._player.body.velocity.y = this._ySpeedLimit; //Evitar bug omitir colisiones
    	var collisionWithTilemap = this.game.physics.arcade.collide(this._player, this.groundLayer);
      this.game.physics.arcade.collide(this._player, this.enemyGroup);
    	this.game.physics.arcade.collide(this.enemyGroup, this.groundLayer);
      
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
    				self.overLayer.vis = true;
            self.overLayer.layer.revive();
       			}
       			else if (self._player.overlap(item)){
       				self.collisionWithJumpThrough();			
       				
       			}
    		})
    	}
    },
    pauseMenu: function (){
      //Memorizamos el estado actual
      //Escena
      this._maxYspeed = 0;
      //Cambio escena
      this._resume= true;
    	this.destroy();
      this.game.world.setBounds(0,0,800,600);
      //Mandamos al menu pausa los 3 parametros necesarios (sprite, mapa y datos del jugador)
      this.game.state.start('menu_in_game', true, false, this.level);
    },
    jumpCheck: function (){
    	var jump = this._player._jumpSpeed*this.timeJump;
    	if( jump < this._player._maxJumpSpeed){
    		this._player.body.velocity.y=0;
    		this._player.jump(this._player._maxJumpSpeed);
    	}
    	else this._player.jump(jump);
    },
    
    onPlayerDeath: function(){
        //TODO 6 Carga de 'gameOver';
        this._keys = 0;
        this.destroy();
        this.game.world.setBounds(0,0,800,600);
        this.game.state.start('gameOver', true, false, this.level);
    },

    onPlayerEnd: function(){
        this._keys = 0;
        this.destroy();
        this.game.world.setBounds(0,0,800,600);
        this.game.state.start('endLevel', true, false, this.level);
    },
    
    checkPlayerDeath: function(){
        self = this;
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
        
    //configure the scene
    configure: function(){
        //Start the Arcade Physics system
        this.game.world.setBounds(0,0, 768, 736);
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
       this.enemyGroup.forEach(function(obj){
        obj.destroy();
      })
      this.cannonGroup.forEach(function(obj){
        obj.destroy();
      })
      this.bulletGroup.forEach(function(obj){
        obj.destroy();
      })
      this._player.destroy();
      this.map.destroy();
    }

};

module.exports = PlayScene;
