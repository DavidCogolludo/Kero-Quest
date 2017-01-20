(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ControlScene = {
    create: function () {

        var BG = this.game.add.sprite(this.game.world.centerX, 
                                      this.game.world.centerY, 
                                      'controlesBG');
        BG.anchor.setTo(0.5, 0.5);
        var button = this.game.add.button(this.game.world.centerX, this.game.world.centerY+250, 
                                          'button', 
                                          this.actionOnClick, 
                                          this, 2, 1, 0);
        button.anchor.set(0.5);
        var text = this.game.add.text(0, 0, "¡Buen Viaje!");
        text.anchor.set(0.5);
        button.addChild(text);
    },
    actionOnClick: function(){
       this.game.world.setBounds(0,0,800,600);
       this.game.stage.backgroundColor = '#000000';
       this.game.state.start('menu');
    }

};

module.exports = ControlScene;
},{}],2:[function(require,module,exports){
var aux;
var EndLevel = {
    init: function (actualLevel){
      aux = actualLevel;
    },
    create: function () {
       //SOUND---------------------------------------
      this.music = this.game.add.audio('menu_music');
      this.music.onDecoded.add(this.startMusic, this);
      //-----------------------------------------------
        console.log("Level Completed!");
        var BG = this.game.add.sprite(this.game.world.centerX, 
                                      this.game.world.centerY, 
                                      'creditsBG');
        BG.anchor.setTo(0.5, 0.5);

        //TEXTOS
        var text = this.game.add.text(0, 0, "Return Menu");
        text.anchor.set(0.5);

        //BOTONES
        var button = this.game.add.button(430, 410, 
                                          'button', 
                                          this.actionOnClick, 
                                          this, 2, 1, 0);
        button.anchor.set(0.5);
        button.addChild(text);
    },
     startMusic: function(){
      this.music.fadeIn(2000,true);
    },
    actionOnClick: function(){
        this.music.destroy();
        this.game.state.start('menu');
    },
};

module.exports = EndLevel;


},{}],3:[function(require,module,exports){
var aux;
var pInfo;
var EndLevel = {
    init: function (actualLevel, playerInfo, mute){
      aux = actualLevel;
      pInfo = playerInfo;
      console.log(mute);
      this.isMute= mute;
    },
    create: function () {
      this.fx = this.game.add.audio('victory_fx');
      console.log(this.isMute);
      if(!this.isMute)this.fx.play();
        console.log("Level Completed!");
        var BG = this.game.add.sprite(this.game.world.centerX, 
                                      this.game.world.centerY, 
                                      'winBG');
        BG.anchor.setTo(0.5, 0.5);

        //TEXTOS
        var text = this.game.add.text(0, 0, "Reset Level");
        var text2 = this.game.add.text(0, 0, "Return Menu");
        var text3 = this.game.add.text(0, 0, "Next Level");
        text.anchor.set(0.5);
        //goText.fill = '#43d637';
        //goText.anchor.set(0.5);
        text2.anchor.set(0.5);
        //goText.anchor.set(0.5);
        text3.anchor.set(0.5);

        //BOTONES
        var button = this.game.add.button(200, 320, 
                                          'button', 
                                          this.actionOnClick, 
                                          this, 2, 1, 0);
        button.anchor.set(0.5);
        button.addChild(text);

        var button2 = this.game.add.button(200, 420, 
                                          'button', 
                                          this.actionOnClick2, 
                                          this, 2, 1, 0);
        button2.anchor.set(0.5);
        button2.addChild(text2);

        var button3 = this.game.add.button(200, 520, 
                                          'button', 
                                          this.actionOnClick3, 
                                          this, 2, 1, 0);
        button3.anchor.set(0.5);
        button3.addChild(text3);
    },
    
    actionOnClick: function(){
      this.fx.destroy();
        this.game.state.start(aux, true, false, this.isMute, false);
    },
    actionOnClick2: function(){
      this.fx.destroy();
       this.game.world.setBounds(0,0,800,600);
       this.game.stage.backgroundColor = '#000000';
       this.game.state.start('menu');
    },
    actionOnClick3: function(){
        this.fx.destroy();
       this.game.world.setBounds(0,0,800,600);
       this.game.stage.backgroundColor = '#000000';
       if (aux === 'level_01') this.game.state.start('level_02',true, false, this.isMute,false, pInfo);
       else if (aux === 'level_02') this.game.state.start('level_03',true, false,this.isMute, false, pInfo);
       else if (aux === 'level_03') this.game.state.start('level_04',true, false, this.isMute,false, pInfo);
       else if (aux === 'level_04') this.game.state.start('credits');
    }

};

module.exports = EndLevel;


},{}],4:[function(require,module,exports){
'use strict';
var Direction = {'LEFT':0, 'RIGHT':1, 'TOP':2, 'LOW':3}
//PLAYER---------------------------------------------------------------------
function Player (game, x,y, playerInfo){
  this._player = game.add.sprite(x,y,playerInfo.name);

    this._player.animations.add('breathR',[0,1,2,3]);
    this._player.animations.add('breathL',[13,12,11,10]);
    this._player.animations.add('walkR',[3,4,5,6]);
    this._player.animations.add('walkL',[10,9,8,7]);
    this._player.animations.add('jumpR',[6]);
    this._player.animations.add('jumpL',[7]);

    this._player.sound = {};
    this._player.sound.jump = game.add.audio('jump_fx',0.5);
    this._player.sound.slap = game.add.audio('slap_fx', 0.20);
    this._player.direction = Direction.RIGHT;
  this._player.life = playerInfo.life || 4;
  this._player.invincible = false;
  this._player.timeRecover=80;
  this._player._jumpSpeed= -80;
  this._player._maxJumpSpeed = playerInfo.jump || -800;
  if(playerInfo.speedPower === 1) this._player._speed = 2;
  else if (playerInfo.speedPower === -1) this._player._speed = 0.6;
  else this._player._speed = 1;
  this._player.maxJumpReached = false;
  this._player.ignoraInput = false;
  this._player.hitDir = 0;
  this.jumpTimer = 0;

  this._player.mute = function(){
      for (var audio in this.sound){
        this.sound[audio].mute = true;
      }
  }
  this._player.jump = function(y){
          this.sound.jump.play();
          if(this.body.onFloor())this.body.velocity.y = y;
          if(this.direction == 1)this.animations.play('jumpR');
          else this.animations.play('jumpL');
  }
    this._player.health = function(){
      this.life++;
    }
    this._player.hit = function(){
      this.sound.slap.play();
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
    this._player.moveLeft = function(x){
      this.direction = Direction.LEFT;
      this.body.velocity.x = this._speed*(-x); 
    }
    this._player.moveRight = function(x){
      this.direction = Direction.RIGHT;
      this.body.velocity.x = this._speed*x; 
    }

    return this._player;
}

Player.prototype.constructor = Player;
    
//CAÑONES--------------------------------------------------------------------- 
function Cannon (index, game, x,y, dir){
  var direction = dir;
  if(dir === undefined) direction = Direction.RIGHT;
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
Cannon.prototype.constructor = Cannon;
//MOSCA---------------------------------------------------------------------------------------------------
function Fly (index,game,x,y){
   this.fly = game.add.sprite(x,y,'powerLife');
   this.fly.name = 'fly_'+index.toString();
   var initY = y;
   var initX = x;
   var cont = 0;
   var rnd = 0;
   var _mute = false;
   this.fly.sound = {};
   this.fly.sound.health = game.add.audio('life_fx');
  
   this.fly.getLive = function(target){
     if (this.overlap(target)){
            this.sound.health.play();
            target.health();
            this.destroy();
      } 

   };
   this.fly.move = function(target){
      if(cont === 0){
        rnd = Math.floor((Math.random() * 4));
      }
      switch (rnd){
        case 0: if ((initX +300) <= this.position.x)this.position.x --;
                cont++;
                break;
        case 1: if((initX + 300) >= this.position.x)this.position.x ++;
                cont++;
                break;
        case 2: if ((initY - 192)<= this.position.y) this.position.y --;
                cont++;
                break;
        case 3: if ((initY +192) >= this.position.y) this.position.y++;
                cont++;
                break;
      }
      if (cont === 6) cont = 0;
      this.getLive(target);
   }
   return this.fly;
};
Fly.prototype.constructor = Fly;
//TOPO----------------------------------------------------------------------------------------------------
function Mole (index,game, x,y, destructor){
    //ATRIBUTOS
    var destructor = destructor || false //Booleano. Si es true, el enemigo te mata con tocarte ( de un golpe);
    var detected = false;
    var initY = y;
    var delay = 0;
      this.mole = game.add.sprite(x,y,'enemy_02');
      this.mole.name= 'mole_'+ index.toString();
      this.mole.sound = {};
      this.mole.sound.pop = game.add.audio('mole_fx',0.75);
    //FUNCIONES
       this.mole.mute = function(){
        for (var audio in this.sound){
          this.sound[audio].mute = true;
        }
      }
        this.mole.hit = function(target){
          if (this.overlap(target) && delay === 0){
            delay++;
            setTimeout(function(){delay = 0;}, 1000);
            if (!destructor && !target.invincible) {
                target.hit();
              }
            else if (!target.invincible) target.life = 0;
          } 
        }
        //DETECCIÓN DEL JUGADOR
        this.mole.detect = function(target){
          var positionTarget = target.body.position;
          var positionMole= this.position;
          var distance= Math.abs(positionTarget.x - positionMole.x);
          //this.animate();
          if (distance <= 130 && distance >= 65){
            if(this.position.y > (initY -30)) this.position.y--;
          }
          else if (distance < 60){
            if(this.position.y > (initY-58)) this.position.y--;
            if (this.position.y === initY -58){
             this.sound.pop.play();
             this.position.y--;
           }
            this.hit(target);
          }
          else {
            if (this.position.y < initY) this.position.y++;
          }
        };
        return this.mole;
};
Mole.prototype.constructor = Mole;
//ENEMIGO------------------------------------------------------------------------------------------------
function Enemy (index,game, x,y, destructor){
    //ATRIBUTOS
    var destructor = destructor || false //Booleano. Si es true, el enemigo te mata con tocarte ( de un golpe);
		var detected = false;
		var delay = 0;
		  this.enemy = game.add.sprite(x,y,'limo_01');

      //this.enemy.animations.add('breath',[0,1,2,3]);
      this.enemy.animations.add('walkR',[1,4,5,6]);
      this.enemy.animations.add('walkL',[10,9,8,7]);

      this.enemy.name= 'enemy_'+ index.toString();
      this.enemy.vel = 75;
      game.physics.arcade.enable(this.enemy);
      this.enemy.body.collideWorldBounds = true;
    //FUNCIONES
        //ANIMACIÓN
        this.enemy.animate = function(){
          var self = this;
          if (self.body.velocity.x <= 0) this.animations.play('walkL', 8, true);
          else this.animations.play('walkR',8, true);
        };
        //MOVIMIENTO
        this.enemy.move = function(colliders){
        	var self = this;
        	var collision;
          //this.animate();
        	if(!detected){
       		  this.body.velocity.x = this.vel;
       		  colliders.forEach(function(trigger){
       		  	if(self.overlap(trigger) && delay === 0){
       		  		delay++;
       		  		setTimeout(function(){delay = 0;},1000);
       		  		self.body.velocity.x=0;
       		  		self.vel *= -1;
       		  	}
       		  })
        	}
          this.animate();
        };
        //DETECCIÓN DEL JUGADOR
        this.enemy.detected = function(target){
        	var positionTarget = target.body.position;
        	var positionEnemy= this.body.position;
        	var distance= Math.abs(positionTarget.x - positionEnemy.x);
          //this.animate();
        	if (positionTarget.y === positionEnemy.y && distance <= 128 ){
        		detected = true;
        		if (positionTarget.x > positionEnemy.x) this.body.velocity.x = +90;
        		else if (positionTarget.x < positionEnemy.x) this.body.velocity.x = -90;
        	}
        	else{
        		detected= false;
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
          this.animate();
        };
        return this.enemy;
};
Enemy.prototype.constructor = Enemy;
module.exports = {
  Enemy: Enemy,
  Cannon: Cannon,
  Player: Player,
  Mole: Mole,
  Fly: Fly,
};

},{}],5:[function(require,module,exports){
var aux;
var GameOver = {
    init: function (actualLevel,mute){
      console.log(actualLevel);
      aux = actualLevel;
      this.isMute =mute; 
    },
    create: function () {
        this.fx = this.game.add.audio('gameOver_fx');
        if(!this.isMute)this.fx.play();
        console.log("Game Over");
        var BG = this.game.add.sprite(this.game.world.centerX, 
                                      this.game.world.centerY, 
                                      'gameOverBG');
        BG.anchor.setTo(0.5, 0.5);
        var button = this.game.add.button(130, 280, 
                                          'button', 
                                          this.actionOnClick, 
                                          this, 2, 1, 0);
        button.anchor.set(0.5);
        //var goText = this.game.add.text(400, 100, "GameOver");
        var text = this.game.add.text(0, 0, "Reset Level");
        var text2 = this.game.add.text(0, 0, "Return Menu");
        text.anchor.set(0.5);
        //goText.fill = '#43d637';
        //goText.anchor.set(0.5);
        text2.anchor.set(0.5);
        //goText.anchor.set(0.5);
        button.addChild(text);
       
        var button2 = this.game.add.button(650, 280, 
                                          'button', 
                                          this.actionOnClick2, 
                                          this, 2, 1, 0);
        button2.anchor.set(0.5);
        button2.addChild(text2);
    },
    
    actionOnClick: function(){
        this.fx.destroy();
        this.game.state.start(aux, true, false, this.isMute,false);
    },
    actionOnClick2: function(){
        this.fx.destroy();
       this.game.world.setBounds(0,0,800,600);
       this.game.stage.backgroundColor = '#000000';
       this.game.state.start('menu');
    }

};

module.exports = GameOver;


},{}],6:[function(require,module,exports){
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

},{"./entities.js":4}],7:[function(require,module,exports){
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
    playerInfo: {name: 'player_01', life: 4, jump: -700, speedPower: true},
    level: 'level_01',
    sound: {},
    _mute: false,
    _resume: false,
    _maxYspeed: 0,
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.
    _numJumps: 0,
    _keys: 0,
    _maxTimeInvincible: 80, //Tiempo que esta invencible tras ser golpeado
    _maxInputIgnore: 30,   //Tiempo que ignora el input tras ser golpeado
    _ySpeedLimit: 800,   //El jugador empieza a saltarse colisiones a partir de 1500 de velocidad
      
  init: function (mute,resume, playerInfo){
    // Lo que se carga da igual de donde vengas...
    if (!!playerInfo) this.playerInfo = playerInfo; //Si no recibe un spritePlayer carga el básico
    if(mute)this._mute = true;
    else this._mute= false;
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
      this.playerInfo.life = this._player.life;
    }
    else this.gameState= {  //Valores predefinidos que seran cambiados al ir a pausa y reescritos al volver
      posX: 128,
      posY: 448,
      playerHP: 4,
      invincible: false,
      timeRecover: 80,
      };
    this._resume = false;
  },
  //Método constructor...
  create: function () {
    var self = this;
    //SOUND--------------------------------------------------------
    if(!this._resume){
      this.sound.music = this.game.add.audio('outside_music');
      this.sound.cannon = this.game.add.audio('cannon_fx', 0.20);
      this.sound.door = this.game.add.audio('door_fx', 0.20);
      this.sound.pause = this.game.add.audio('pause_fx');
      this.sound.fly = this.game.add.audio('fly_fx',0.35,true);
     
     
     this.sound.music.onDecoded.add(this.startMusic, this);
    }
    //Crear mapa;
    this.map = this.game.add.tilemap('map_01');
  	this.map.addTilesetImage('patrones','tiles');
  	 
    //Creación de BG
    this.backgroundLayer = this.map.createLayer('Background');
    //Crear topos------------------------------------------------------------------------------------------------
    this.molesGroup = this.game.add.group();

    this._moles = [];
    this._moles.push(new entities.Mole(0,this.game,577,542));
    this._moles.push(new entities.Mole(1,this.game,2017,736));
    for (var i = 0; i < this._moles.length; i++){
      this.molesGroup.add(this._moles[i]);
    }
    this.molesGroup.forEach(function(obj){
      if(self._mute)obj.mute(); 
    })
    //Crear layers-----------------------------------------------------------------------------------------------
  	this.jumpThroughLayer = this.map.createLayer('JumpThrough');
  	this.groundLayer = this.map.createLayer('Ground');
  	this.deathLayer = this.map.createLayer('Death');
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
    if(this._mute)this._player.mute();

    //Crear vidas---------------------------------------------------------------------------------------------------------------------s
    this.flyGroup = this.game.add.group();
    this._powerLife = [];
    this._powerLife.push(new entities.Fly(1,this.game,416,320));
    for (var i = 0; i < this._powerLife.length; i++){
      this.flyGroup.add(this._powerLife[i]);
    }

  	//Crear cursores
  	this.timeJump = 0;
  	this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.pauseButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

    //Crear Llaves
    this.keyGroup = this.game.add.group();
    this.keyGroup.enableBody = true;
    this.keyGroup.physicsBodyType = Phaser.Physics.ARCADE;
    if (this._keys === 0){  //Solo puede existir una llave por nivel, si se carga la pausa con una llave no generara una nueva.
        this.keyGroup.create(96, 608, 'llave_01');
    }
   
    this.keyGroup.forEach(function(obj){
      obj.body.allowGravity = false;
      obj.body.immovable = true;
    })

    //Crear Puertas (OJO DECISION DISEÑO: SOLO 1 PUERTA Y LLAVE POR NIVEL)
    this.doorGroup = this.game.add.group();
    this.doorGroup.enableBody = true;
    this.doorGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.doorGroup.create(2496, 160, 'puerta_01');
    
    this.doorGroup.forEach(function(obj){
      obj.body.allowGravity = false;
      obj.body.immovable = true;
    })

    //Hacer grupo de cañones y enemigos.
    this.enemyGroup = this.game.add.group();
    this.enemyGroup.enableBody = true;
    this.enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;

   	//Crear enemigos segun nivel
    this._enemy = [];
    this._enemy.push(new entities.Enemy(0,this.game,320,704));
    this._enemy.push(new entities.Enemy(0,this.game,2240,736));
    for (var i = 0; i < this._enemy.length; i++){
    	this.enemyGroup.add(this._enemy[i]);
    }
   
    this.enemyGroup.forEach(function(obj){
      obj.body.immovable = true;
    })
    
    this.overLayer = {
      layer: this.map.createLayer('OverLayer'),
      vis: true,
    };
    //Crear Cañones
    this.cannonGroup = this.game.add.group();
    this._cannons =[];
    this._cannons.push(new entities.Cannon(0,this.game, 736, 576,Direction.LOW));  //nivel1
    this._cannons.push(new entities.Cannon(1,this.game, 1152, 704, Direction.LOW));
    this._cannons.push(new entities.Cannon(2,this.game, 1245, 704, Direction.LOW));
    this._cannons.push(new entities.Cannon(3,this.game, 1344, 704, Direction.LOW));
    for (var i = 0; i < this._cannons.length; i++){
    	this.cannonGroup.add(this._cannons[i]);
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

    //--------------CANVAS-----------------------------
      this.canvasText = this.game.add.text(this.game.camera.x +50, this.game.camera.y+50,"Life: "+this._player.life+"\nKeys: "+this._keys);
      this.canvasText.fixedToCamera = true;  
  },
    
    //IS called one per frame.
    update: function () {
      var self=this;

      this.canvasText.setText('Life: '+this._player.life + '\nKeys: '+this._keys);
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
      
        //-------------------------------------FLY(LIFE)-------------------------------

         this.flyGroup.forEach(function(obj){
            if(!self._mute && Math.abs(obj.position.x - self._player.body.position.x)>80 && Math.abs(obj.position.y - self._player.body.position.y)>80) self.sound.fly.play();
            else if (self._mute || Math.abs(obj.position.x - self._player.body.position.x)<=80 && Math.abs(obj.position.y - self._player.body.position.y)<=80)self.sound.fly.stop();
            obj.move(self._player);
        })
         //--------------------------------------PAUSE-------------------------------
        this.pauseButton.onDown.add(this.pauseMenu, this);
        //-------------------------------------MOLES-------------------------------
         this.molesGroup.forEach(function(obj){
            obj.detect(self._player);
        })
        //----------------------------------ENEMY-------------------
        
       this.enemyGroup.forEach(function(obj){
            obj.detected(self._player);
            obj.move(self.collidersgroup);
        })
        
        //-----------------------------------CANNONS------------------------------
          if(this.game.time.now > this.bulletTime){
          	this.cannonGroup.forEach(function(obj){
            if (!self._mute && Math.abs(self._player.position.x-  obj.position.x) <= 300) self.sound.cannon.play();
            obj.shoot(self.bulletGroup);
        })
            this.bulletTime = this.game.time.now + 2000;
          }
        //-----------------------------------PUERTAS Y LLAVES-------------------------------
        this.checkKey();
        if (this._keys > 0) this.checkDoor();
        //-----------------------------------DEATH----------------------------------
        this.checkPlayerDeath();
        this.checkPlayerEnd();
    },
    startMusic: function (){
      if(!this._mute)this.sound.music.fadeIn(4000, true);
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
            if (!self._mute)self.sound.door.play();
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
      if(!this._mute)this.sound.pause.play();
    	this.destroy(true);
      this.game.world.setBounds(0,0,800,600);
      //Mandamos al menu pausa los 3 parametros necesarios (sprite, mapa y datos del jugador)
      this.game.state.start('menu_in_game', true, false, this.level, this.sound.music,this._mute);
    },
    jumpCheck: function (){
    	var jump = this._player._jumpSpeed*(this.timeJump/1.5);
    	if( jump < this._player._maxJumpSpeed){
    		this._player.body.velocity.y=0;
    		this._player.jump(this._player._maxJumpSpeed);
    	}
    	else{
        this._player.jump(jump);
      } 
    },
    
    onPlayerDeath: function(){
        this._keys = 0;
        this.destroy();
        this.game.world.setBounds(0,0,800,600);
        this.game.state.start('gameOver', true, false, this.level,this._mute);
    },

    onPlayerEnd: function(){
        this._keys = 0;
        this.destroy();
        this.game.world.setBounds(0,0,800,600);
        this.game.state.start('endLevel', true, false, this.level, this.playerInfo,this._mute);
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
        
    //configure the scene
    configure: function(){
        //Start the Arcade Physics system
        this.game.world.setBounds(0,0, 2560 , 800);
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
         if (this.cursors.left.isDown){
   		 	this._player.animations.play('walkL', 8, true);
    		this._player.moveLeft(incrementoX);
         }
        else if (this.cursors.right.isDown) {
        	this._player.animations.play('walkR', 8, true);
        	this._player.moveRight(incrementoX);
        }
        else if (this._player.body.onFloor()) {
        	if(this._player.direction == 1) this._player.animations.play('breathR',2,true);  
          else this._player.animations.play('breathL',2,true); 
        }
    },
    
    destroy: function(pause){
      var p = pause || false;
      this.sound.fly.stop();
      if (!p) this.sound.music.destroy();
       this.molesGroup.forEach(function(obj){
        obj.destroy();
      })
       this.flyGroup.forEach(function(obj){
        obj.destroy();
      })
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

},{"./entities.js":4}],8:[function(require,module,exports){
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
    level: 'level_02',
    sound: {},
    _mute: false,
    _resume: false,
    _maxYspeed: 0,
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.
    _numJumps: 0,
    _keys: 0,
    _maxTimeInvincible: 80, //Tiempo que esta invencible tras ser golpeado
    _maxInputIgnore: 30,   //Tiempo que ignora el input tras ser golpeado
    _ySpeedLimit: 800,   //El jugador empieza a saltarse colisiones a partir de 1500 de velocidad
      
  init: function (mute,resume, playerInfo){
    // Lo que se carga da igual de donde vengas...
    if (!!playerInfo) this.playerInfo = playerInfo; //Si no recibe un spritePlayer carga el básico
    if(mute)this._mute = true;
    else this._mute= false;
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
      this.playerInfo.life = this._player.life;

    }
    else this.gameState= {  //Valores predefinidos que seran cambiados al ir a pausa y reescritos al volver
      posX: 480,
      posY: 192,
      playerHP: 4,
      invincible: false,
      timeRecover: 80,
      };
    this._resume = false;
  },
  //Método constructor...
  create: function () {
    var self = this;
    //SOUND---------------------------------------------------------------------
    if(!this._resume){
      this.sound.music = this.game.add.audio('cave_music');
      this.sound.cannon = this.game.add.audio('cannon_fx', 0.20);
      this.sound.door = this.game.add.audio('door_fx', 0.20);
      this.sound.pause = this.game.add.audio('pause_fx');
      this.sound.life = this.game.add.audio('life_fx');
      this.sound.fly = this.game.add.audio('fly_fx',0.35,true);

      this.sound.music.onDecoded.add(this.startMusic, this);
    }
    //Crear mapa;
    this.map = this.game.add.tilemap('map_02');
    this.map.addTilesetImage('patrones','tiles');
    
    //Creación de layers
    this.backgroundLayer = this.map.createLayer('Background');
    this.jumpThroughLayer = this.map.createLayer('JumpThrough');
    this.groundLayer = this.map.createLayer('Ground');
    this.deathLayer = this.map.createLayer('Death');
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
     if(this._mute)this._player.mute();

    //Crear vidas---------------------------------------------------------------------------------------------------------------------
    this.flyGroup = this.game.add.group();
    this._powerLife = [];
    this._powerLife.push(new entities.Fly(0,this.game,448,480));
    this._powerLife.push(new entities.Fly(0,this.game,448,0));
    for (var i = 0; i < this._powerLife.length; i++){
      this.flyGroup.add(this._powerLife[i]);
    }

    //Crear cursores
    this.timeJump = 0;
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.pauseButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

    //Crear Llaves
    this.keyGroup = this.game.add.group();
    this.keyGroup.enableBody = true;
    this.keyGroup.physicsBodyType = Phaser.Physics.ARCADE;
    if (this._keys === 0){  //Solo puede existir una llave por nivel, si se carga la pausa con una llave no generara una nueva.
        this.keyGroup.create(0, 32, 'llave_01');
    }
    this.keyGroup.forEach(function(obj){
      obj.body.allowGravity = false;
      obj.body.immovable = true;
    })

    //Crear Puertas (OJO DECISION DISEÑO: SOLO 1 PUERTA Y LLAVE POR NIVEL)
    this.doorGroup = this.game.add.group();
    this.doorGroup.enableBody = true;
    this.doorGroup.physicsBodyType = Phaser.Physics.ARCADE;
    //Añadiendo puertas al grupo segun el nivel
    this.doorGroup.create(928, 544, 'puerta_01');
    
    this.doorGroup.forEach(function(obj){
      obj.body.allowGravity = false;
      obj.body.immovable = true;
    })

    //Hacer grupo de cañones y enemigos.
    this.enemyGroup = this.game.add.group();
    this.enemyGroup.enableBody = true;
    this.enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;

    //Crear enemigos segun nivel
    this._enemy = [];
    this._enemy.push(new entities.Enemy(0,this.game,480,390));
    this._enemy.push(new entities.Enemy (1,this.game, 480,32));
    this._enemy.push(new entities.Enemy (2,this.game, 660,580));  
    for (var i = 0; i < this._enemy.length; i++){
      this.enemyGroup.add(this._enemy[i]);
    }
   
    this.enemyGroup.forEach(function(obj){
      obj.body.immovable = true;
    })
    //Crear Cañones
    this.cannonGroup = this.game.add.group();
    this._cannons =[];
    this._cannons.push(new entities.Cannon(0,this.game, 128, 320));  //nivel1
    this._cannons.push(new entities.Cannon(1,this.game, 192, 576, Direction.LOW)); //nivel1
   for (var i = 0; i < this._cannons.length; i++){
      this.cannonGroup.add(this._cannons[i]);
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

    //Capa por encima de todo lo demás
    this.overLayer = {
      layer: this.map.createLayer('OverLayer'),
      vis: true,
    };
  //--------------CANVAS-----------------------------
      this.canvasText = this.game.add.text(this.game.camera.x +50, this.game.camera.y+50,"Life: "+this._player.life+"\nKeys: "+this._keys);
      this.canvasText.fixedToCamera = true;  
  },
    
    //IS called one per frame.
    update: function () {
      var self=this;

      this.canvasText.setText('Life: '+this._player.life + '\nKeys: '+this._keys);
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
        //-------------------------------------FLY(LIFE)-------------------------------
         //-------------------------------------FLY(LIFE)-------------------------------

         this.flyGroup.forEach(function(obj){
            if(!self._mute && Math.abs(obj.position.x - self._player.body.position.x)>80 && Math.abs(obj.position.y - self._player.body.position.y)>80) self.sound.fly.play();
            else if (self._mute || Math.abs(obj.position.x - self._player.body.position.x)<=80 && Math.abs(obj.position.y - self._player.body.position.y)<=80)self.sound.fly.stop();
            obj.move(self._player);
        })
         //--------------------------------------PAUSE-------------------------------
        this.pauseButton.onDown.add(this.pauseMenu, this);
        //----------------------------------ENEMY-------------------
        
       this.enemyGroup.forEach(function(obj){
            obj.detected(self._player);
            obj.move(self.collidersgroup);
        })
        
        //-----------------------------------CANNONS------------------------------
          if(this.game.time.now > this.bulletTime){
            this.cannonGroup.forEach(function(obj){
           if (!self._mute && Math.abs(self._player.position.x-  obj.position.x) <= 300) self.sound.cannon.play();
            obj.shoot(self.bulletGroup);
        })
            this.bulletTime = this.game.time.now + 2000;
          }
        //-----------------------------------PUERTAS Y LLAVES-------------------------------
        this.checkKey();
        if (this._keys > 0) this.checkDoor();
        //-----------------------------------DEATH----------------------------------
        this.checkPlayerDeath();
        this.checkPlayerEnd();
    },
    startMusic: function (){
      if(!this._mute)this.sound.music.fadeIn(4000, true);
    },
    collisionWithJumpThrough: function(){
      var self = this;
      console.log('col');
      self.game.physics.arcade.collide(self._player, self.jumpThroughLayer);
    },
    checkKey: function(){
      var self = this;
      this.keyGroup.forEach(function(obj){
          if(self.game.physics.arcade.collide(self._player, obj)){
          obj.kill();
          self._keys++;}
      })
    },
    checkDoor: function(){
      var self = this;
      this.doorGroup.forEach(function(obj){
            if(self.game.physics.arcade.collide(self._player, obj)){
             if (!self._mute)self.sound.door.play();
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
      this._resume = true;
      if(!this._mute)this.sound.pause.play();
      this.destroy(true);
      this.game.world.setBounds(0,0,800,600);
      //Mandamos al menu pausa los 3 parametros necesarios (sprite, mapa y datos del jugador)
      this.game.state.start('menu_in_game', true, false, this.level,this.sound.music,this._mute);
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
        this._keys = 0;
        this.destroy();
        this.game.world.setBounds(0,0,800,600);
        this.game.state.start('gameOver', true, false, this.level, this._mute);
    },

    onPlayerEnd: function(){
        this._keys = 0;
        this.destroy();
        this.game.world.setBounds(0,0,800,600);
        this.game.state.start('endLevel', true, false, this.level, this.playerInfo,this._mute);
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

    //configure the scene
    configure: function(){
        //Start the Arcade Physics system
        this.game.world.setBounds(0, 0, 960, 640); 
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
         if (this.cursors.left.isDown){
        this._player.animations.play('walkL', 8, true);
        this._player.moveLeft(incrementoX);
         }
        else if (this.cursors.right.isDown) {
          this._player.animations.play('walkR', 8, true);
          this._player.moveRight(incrementoX);
        }
        else if (this._player.body.onFloor()) {
          if(this._player.direction == 1) this._player.animations.play('breathR',2,true);  
          else this._player.animations.play('breathL',2,true); 
        }
    },
    
    //TODO 9 destruir los recursos tilemap, tiles y logo.
    destroy: function(pause){
      var p = pause || false;
      this.sound.fly.stop();
       if (!p) this.sound.music.destroy();
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

},{"./entities.js":4}],9:[function(require,module,exports){
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
    level: 'level_03',
    sound: {},
    _mute: false,
    _resume: false,
    _maxYspeed: 0,
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.
    _numJumps: 0,
    _keys: 0,
    _maxTimeInvincible: 80, //Tiempo que esta invencible tras ser golpeado
    _maxInputIgnore: 30,   //Tiempo que ignora el input tras ser golpeado
    _ySpeedLimit: 800,   //El jugador empieza a saltarse colisiones a partir de 1500 de velocidad
      
  init: function (mute,resume, playerInfo){
    // Lo que se carga da igual de donde vengas...
    if (!!playerInfo) this.playerInfo = playerInfo; //Si no recibe un spritePlayer carga el básico
    if(mute)this._mute = true;
    else this._mute= false;
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
       this.playerInfo.life = this._player.life;

    }
    else this.gameState= {  //Valores predefinidos que seran cambiados al ir a pausa y reescritos al volver
      posX: 96,
      posY: 512,
      playerHP: 4,
      invincible: false,
      timeRecover: 80,
      };
    this._resume = false;
  },
  //Método constructor...
  create: function () {
    var self = this;
    //SOUND--------------------------------------------------------
    if (!this._resume){
      this.sound.music = this.game.add.audio('outside_music');
      this.sound.cannon = this.game.add.audio('cannon_fx', 0.20);
      this.sound.door = this.game.add.audio('door_fx', 0.20);
      this.sound.pause = this.game.add.audio('pause_fx');
      this.sound.life = this.game.add.audio('life_fx');
      this.sound.fly = this.game.add.audio('fly_fx',0.35,true);
    
    this.sound.music.onDecoded.add(this.startMusic, this);
  }
    //Crear mapa;
    this.map = this.game.add.tilemap('map_03');
    this.map.addTilesetImage('patrones','tiles');
    
    //Creación de bg
    this.backgroundLayer = this.map.createLayer('Background');
    //Crear topos------------------------------------------------------------------------------------------------
    this.molesGroup = this.game.add.group();

    this._moles = [];
    this._moles.push(new entities.Mole(0,this.game,353,544));
    this._moles.push(new entities.Mole(1,this.game,769,544));
    this._moles.push(new entities.Mole(2,this.game,1633,544));
    this._moles.push(new entities.Mole(3,this.game,2401,544));
    this._moles.push(new entities.Mole(4,this.game,3649,448));
    for (var i = 0; i < this._moles.length; i++){
      this.molesGroup.add(this._moles[i]);
    }
    this.molesGroup.forEach(function(obj){
      if(self._mute)obj.mute();
    })
    //Crear layers-----------------------------------------------------------------------------------------------
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
    if(this._mute)this._player.mute();
//Crear vidas---------------------------------------------------------------------------------------------------------------------s
    this.flyGroup = this.game.add.group();
    this._powerLife = [];
    this._powerLife.push(new entities.Fly(0,this.game,2080,64));
    this._powerLife.push(new entities.Fly(1,this.game,3392,384));
    for (var i = 0; i < this._powerLife.length; i++){
      this.flyGroup.add(this._powerLife[i]);
    }

    //Crear cursores
    this.timeJump = 0;
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.pauseButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

    //Crear Llaves
    this.keyGroup = this.game.add.group();
    this.keyGroup.enableBody = true;
    this.keyGroup.physicsBodyType = Phaser.Physics.ARCADE;
   
    this.keyGroup.forEach(function(obj){
      obj.body.allowGravity = false;
      obj.body.immovable = true;
    })

    //Crear Puertas (OJO DECISION DISEÑO: SOLO 1 PUERTA Y LLAVE POR NIVEL)
    this.doorGroup = this.game.add.group();
    this.doorGroup.enableBody = true;
    this.doorGroup.physicsBodyType = Phaser.Physics.ARCADE;
    //Añadiendo puertas al grupo segun el nivel
    //this.doorGroup.create(510, 480, 'puerta_01');
    
    this.doorGroup.forEach(function(obj){
      obj.body.allowGravity = false;
      obj.body.immovable = true;
    })

    //Hacer grupo de cañones y enemigos.
    this.enemyGroup = this.game.add.group();
    this.enemyGroup.enableBody = true;
    this.enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;

    //Crear enemigos segun nivel
    this._enemy = [];
    this._enemy.push(new entities.Enemy (0,this.game,544,512));
    this._enemy.push(new entities.Enemy (1,this.game, 928,512));
    this._enemy.push(new entities.Enemy (2,this.game, 1952,288));
    this._enemy.push(new entities.Enemy (3,this.game, 2016,288)); 
    this._enemy.push(new entities.Enemy (4,this.game, 2368,512)); 
    this._enemy.push(new entities.Enemy (5,this.game, 2432,512)); 
    this._enemy.push(new entities.Enemy (6,this.game, 3168,512)); 
    this._enemy.push(new entities.Enemy (7,this.game, 3232,512)); 
    this._enemy.push(new entities.Enemy (8,this.game, 3296,512)); 
    this._enemy.push(new entities.Enemy (9,this.game, 3360,512)); 
    this._enemy.push(new entities.Enemy (10,this.game, 4800,512));
    this._enemy.push(new entities.Enemy (11,this.game, 4832,512));    
    for (var i = 0; i < this._enemy.length; i++){
      this.enemyGroup.add(this._enemy[i]);
    }
   
    this.enemyGroup.forEach(function(obj){
      obj.body.immovable = true;
    })
    //Crear Cañones
    this.cannonGroup = this.game.add.group();
    this._cannons =[];
    this._cannons.push(new entities.Cannon(0,this.game, 608, 480, Direction.LOW));  //nivel1
    this._cannons.push(new entities.Cannon(1,this.game, 832, 448, Direction.LOW)); //nivel1
    this._cannons.push(new entities.Cannon(2,this.game, 992, 416, Direction.LOW));
    this._cannons.push(new entities.Cannon(3,this.game, 1184, 416, Direction.LOW));
    this._cannons.push(new entities.Cannon(4,this.game, 4512, 480, Direction.LOW));
    this._cannons.push(new entities.Cannon(5,this.game, 4992, 480, Direction.LOW));
    this._cannons.push(new entities.Cannon(6,this.game, 5248, 288, Direction.LEFT));
   for (var i = 0; i < this._cannons.length; i++){
      this.cannonGroup.add(this._cannons[i]);
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
  //--------------CANVAS-----------------------------
      this.canvasText = this.game.add.text(this.game.camera.x +50, this.game.camera.y+50,"Life: "+this._player.life+"\nKeys: "+this._keys);
      this.canvasText.fixedToCamera = true;  
  },
    
    //IS called one per frame.
    update: function () {
      var self=this;

      this.canvasText.setText('Life: '+this._player.life + '\nKeys: '+this._keys);
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
        //-------------------------------------FLY(LIFE)-------------------------------

         this.flyGroup.forEach(function(obj){
            if(!self._mute && Math.abs(obj.position.x - self._player.body.position.x)>80 && Math.abs(obj.position.y - self._player.body.position.y)>80) self.sound.fly.play();
            else if (self._mute || Math.abs(obj.position.x - self._player.body.position.x)<=80 && Math.abs(obj.position.y - self._player.body.position.y)<=80)self.sound.fly.stop();
            obj.move(self._player);
        })
         //--------------------------------------PAUSE-------------------------------
        this.pauseButton.onDown.add(this.pauseMenu, this);
         //-------------------------------------MOLES-------------------------------
         this.molesGroup.forEach(function(obj){
            obj.detect(self._player);
        })
        //----------------------------------ENEMY-------------------
        
       this.enemyGroup.forEach(function(obj){
            obj.detected(self._player);
            obj.move(self.collidersgroup);
        })
        //-----------------------------------CANNONS------------------------------
          if(this.game.time.now > this.bulletTime){
            this.cannonGroup.forEach(function(obj){
            if (!self._mute && Math.abs(self._player.position.x-  obj.position.x) <= 300) self.sound.cannon.play();
            obj.shoot(self.bulletGroup);
        })
            this.bulletTime = this.game.time.now + 2000;
          }
        //-----------------------------------PUERTAS Y LLAVES-------------------------------
        this.checkKey();
        if (this._keys > 0) this.checkDoor();
        //-----------------------------------DEATH----------------------------------
        this.checkPlayerDeath();
        this.checkPlayerEnd();
    },
    startMusic: function (){
      if(!this._mute)this.sound.music.fadeIn(4000, true);
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
             if (!self._mute)self.sound.door.play();
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
      this._resume = true;
      if(!this._mute)this.sound.pause.play();
      this.destroy(true);
      this.game.world.setBounds(0,0,800,600);
      //Mandamos al menu pausa los 3 parametros necesarios (sprite, mapa y datos del jugador)
      this.game.state.start('menu_in_game', true, false, this.level, this.sound.music,this._mute);
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
        this.game.state.start('gameOver', true, false, this.level,this._mute);
    },

    onPlayerEnd: function(){
        this._keys = 0;
        this.destroy();
        this.game.world.setBounds(0,0,800,600);
       this.game.state.start('endLevel', true, false, this.level, this.playerInfo,this._mute);
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

    //configure the scene
    configure: function(){
        //Start the Arcade Physics system
        this.game.world.setBounds(0, 0, 5728 , 640);
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
         if (this.cursors.left.isDown){
        this._player.animations.play('walkL', 8, true);
        this._player.moveLeft(incrementoX);
         }
        else if (this.cursors.right.isDown) {
          this._player.animations.play('walkR', 8, true);
          this._player.moveRight(incrementoX);
        }
        else if (this._player.body.onFloor()) {
          if(this._player.direction == 1) this._player.animations.play('breathR',2,true);  
          else this._player.animations.play('breathL',2,true); 
        }
    },
    
    //TODO 9 destruir los recursos tilemap, tiles y logo.
    destroy: function(pause){
      this.sound.fly.stop();
      var p = pause || false;
       if (!p) this.sound.music.destroy();
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

},{"./entities.js":4}],10:[function(require,module,exports){
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
    level: 'level_04',
    sound: {},
    _mute: false,
    _resume: false,
    _maxYspeed: 0,
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.
    _numJumps: 0,
    _keys: 0,
    _maxTimeInvincible: 80, //Tiempo que esta invencible tras ser golpeado
    _maxInputIgnore: 30,   //Tiempo que ignora el input tras ser golpeado
    _ySpeedLimit: 800,   //El jugador empieza a saltarse colisiones a partir de 1500 de velocidad
      
  init: function (mute,resume, playerInfo){
    // Lo que se carga da igual de donde vengas...
    if (!!playerInfo) this.playerInfo = playerInfo; //Si no recibe un spritePlayer carga el básico
    if(mute)this._mute = true;
    else this._mute= false;
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
       this.playerInfo.life = this._player.life;

    }
    else this.gameState= {  //Valores predefinidos que seran cambiados al ir a pausa y reescritos al volver
      posX: 32,
      posY: 768,
      playerHP: 4,
      invincible: false,
      timeRecover: 80,
      };
    this._resume = false;
  },
  //Método constructor...
  create: function () {
    var self = this;
    //SOUND----------------------------------------------------------------
    if(!this._resume){
      this.sound.music = this.game.add.audio('cave_music');
      this.sound.cannon = this.game.add.audio('cannon_fx', 0.20);
      this.sound.door = this.game.add.audio('door_fx', 0.20);
      this.sound.pause = this.game.add.audio('pause_fx');
      this.sound.life = this.game.add.audio('life_fx');
      this.sound.fly = this.game.add.audio('fly_fx',0.35,true);
     
      this.sound.music.onDecoded.add(this.startMusic, this);
    }
    //Crear mapa;
    this.map = this.game.add.tilemap('map_04');
    this.map.addTilesetImage('patrones','tiles');
    
    //Creación de layers
    this.backgroundLayer = this.map.createLayer('Background');
    this.jumpThroughLayer = this.map.createLayer('JumpThrough');
    this.groundLayer = this.map.createLayer('Ground');
    this.deathLayer = this.map.createLayer('Death');
   
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
     if(this._mute)this._player.mute();
    //Crear vidas---------------------------------------------------------------------------------------------------------------------s
    this.flyGroup = this.game.add.group();
    this._powerLife = [];
    this._powerLife.push(new entities.Fly(0,this.game,2144,128));
    this._powerLife.push(new entities.Fly(1,this.game,2752,160));
    this._powerLife.push(new entities.Fly(2,this.game,3616,288));
    for (var i = 0; i < this._powerLife.length; i++){
      this.flyGroup.add(this._powerLife[i]);
    }

    //Crear cursores
    this.timeJump = 0;
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.pauseButton = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

    //Crear Llaves
    this.keyGroup = this.game.add.group();
    this.keyGroup.enableBody = true;
    this.keyGroup.physicsBodyType = Phaser.Physics.ARCADE;
    if (this._keys === 0){  //Solo puede existir una llave por nivel, si se carga la pausa con una llave no generara una nueva.
        this.keyGroup.create(2240, 128, 'llave_01');
    }
    this.keyGroup.forEach(function(obj){
      obj.body.allowGravity = false;
      obj.body.immovable = true;
    })

    //Crear Puertas (OJO DECISION DISEÑO: SOLO 1 PUERTA Y LLAVE POR NIVEL)
    this.doorGroup = this.game.add.group();
    this.doorGroup.enableBody = true;
    this.doorGroup.physicsBodyType = Phaser.Physics.ARCADE;
    //Añadiendo puertas al grupo segun el nivel
    this.doorGroup.create(1472, 896, 'puerta_01');
    
    this.doorGroup.forEach(function(obj){
      obj.body.allowGravity = false;
      obj.body.immovable = true;
    })

    //Hacer grupo de cañones y enemigos.
    this.enemyGroup = this.game.add.group();
    this.enemyGroup.enableBody = true;
    this.enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;

    //Crear enemigos segun nivel
    this._enemy = [];
    this._enemy.push(new entities.Enemy (0,this.game,544,832));
    this._enemy.push(new entities.Enemy (1,this.game, 1600,832));
    this._enemy.push(new entities.Enemy (2,this.game, 2080,608));
    this._enemy.push(new entities.Enemy (3,this.game, 2336,416)); 
    this._enemy.push(new entities.Enemy (4,this.game, 2496,608)); 
    this._enemy.push(new entities.Enemy (5,this.game, 2304,832)); 
    this._enemy.push(new entities.Enemy (6,this.game, 2816,832)); 
    this._enemy.push(new entities.Enemy (7,this.game, 2752,288)); 
    this._enemy.push(new entities.Enemy (8,this.game, 3680,608)); 
    this._enemy.push(new entities.Enemy (9,this.game, 3616,288)); 
    this._enemy.push(new entities.Enemy (10,this.game, 4640,512));

    for (var i = 0; i < this._enemy.length; i++){
      this.enemyGroup.add(this._enemy[i]);
    }
   
    this.enemyGroup.forEach(function(obj){
      obj.body.immovable = true;
    })
    //Crear Cañones
    this.cannonGroup = this.game.add.group();
    this._cannons =[];
    this._cannons.push(new entities.Cannon(0,this.game, 1344, 736, Direction.RIGHT));  //nivel1
    this._cannons.push(new entities.Cannon(1,this.game, 1312, 736, Direction.LEFT)); //nivel1
    this._cannons.push(new entities.Cannon(2,this.game, 1888, 800, Direction.LOW));
    this._cannons.push(new entities.Cannon(3,this.game, 2336, 224, Direction.TOP));
    this._cannons.push(new entities.Cannon(4,this.game, 4384, 192, Direction.LOW));
    this._cannons.push(new entities.Cannon(5,this.game, 4544, 192, Direction.LOW));
    this._cannons.push(new entities.Cannon(6,this.game, 4672, 256, Direction.LOW));
   for (var i = 0; i < this._cannons.length; i++){
      this.cannonGroup.add(this._cannons[i]);
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
     this.overLayer = {
      layer: this.map.createLayer('OverLayer'),
      vis: true,
    };
  //--------------CANVAS-----------------------------
      this.canvasText = this.game.add.text(this.game.camera.x +50, this.game.camera.y+50,"Life: "+this._player.life+"\nKeys: "+this._keys);
      this.canvasText.fixedToCamera = true;  
  },
    
    //IS called one per frame.
    update: function () {
      var self=this;

      this.canvasText.setText('Life: '+this._player.life + '\nKeys: '+this._keys);
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
       //-------------------------------------FLY(LIFE)-------------------------------

         this.flyGroup.forEach(function(obj){
            if(!self._mute && Math.abs(obj.position.x - self._player.body.position.x)>80 && Math.abs(obj.position.y - self._player.body.position.y)>80) self.sound.fly.play();
            else if (self._mute || Math.abs(obj.position.x - self._player.body.position.x)<=80 && Math.abs(obj.position.y - self._player.body.position.y)<=80)self.sound.fly.stop();
            obj.move(self._player);
        })
         //--------------------------------------PAUSE-------------------------------
        this.pauseButton.onDown.add(this.pauseMenu, this);
        //----------------------------------ENEMY-------------------
        
       this.enemyGroup.forEach(function(obj){
            obj.detected(self._player);
            obj.move(self.collidersgroup);
        })
        //-----------------------------------CANNONS------------------------------
          if(this.game.time.now > this.bulletTime){
            this.cannonGroup.forEach(function(obj){
            if (!self._mute && Math.abs(self._player.position.x-  obj.position.x) <= 300) self.sound.cannon.play();
            obj.shoot(self.bulletGroup);
        })
            this.bulletTime = this.game.time.now + 2000;
          }
        //-----------------------------------PUERTAS Y LLAVES-------------------------------
        this.checkKey();
        if (this._keys > 0) this.checkDoor();
        //-----------------------------------DEATH----------------------------------
        this.checkPlayerDeath();
        this.checkPlayerEnd();
    },
    startMusic: function (){
      if(!this._mute)this.sound.music.fadeIn(4000, true);
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
             if (!self._mute)self.sound.door.play();
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
      this._resume = true;
     if(!this._mute)this.sound.pause.play();
      this.destroy(true);
      this.game.world.setBounds(0,0,800,600);
      //Mandamos al menu pausa los 3 parametros necesarios (sprite, mapa y datos del jugador)
      this.game.state.start('menu_in_game', true, false, this.level,this.sound.music,this._mute);
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
        this.game.state.start('gameOver', true, false, this.level,this._mute);
    },

    onPlayerEnd: function(){
        this._keys = 0;
        this.destroy();
        this.game.world.setBounds(0,0,800,600);
        this.game.state.start('endLevel', true, false, this.level, this.playerInfo, this._mute); //Es el último nivel y llama a la pantalla de fin de juego.
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

    //configure the scene
    configure: function(){
        //Start the Arcade Physics system
        this.game.world.setBounds(0, 0, 6368, 928);
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
         if (this.cursors.left.isDown){
        this._player.animations.play('walkL', 8, true);
        this._player.moveLeft(incrementoX);
         }
        else if (this.cursors.right.isDown) {
          this._player.animations.play('walkR', 8, true);
          this._player.moveRight(incrementoX);
        }
        else if (this._player.body.onFloor()) {
          if(this._player.direction == 1) this._player.animations.play('breathR',2,true);  
          else this._player.animations.play('breathL',2,true); 
        }
    },
    
    //TODO 9 destruir los recursos tilemap, tiles y logo.
    destroy: function(pause){
      var p = pause || false;
      this.sound.fly.stop();
       if (!p) this.sound.music.destroy();
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

},{"./entities.js":4}],11:[function(require,module,exports){
'use strict';

//TODO 1.1 Require de las escenas, play_scene, gameover_scene y menu_scene.
var Level_01 = require('./level_01.js');
var Level_02 = require('./level_02.js');
var Level_03 = require('./level_03.js');
var Level_04 = require('./level_04.js');
var Credits = require('./credits.js');
var JumpTestLevel = require('./jumpTestLevel.js');
var GameOver = require('./gameover_scene.js');
var MenuScene = require('./menu_scene.js');
var MenuLevel = require('./menu_level.js')
var MenuInGame = require('./menu_in_game.js');
var SelectPlayer = require ('./select_player.js');
var EndLevel = require ('./end_level.js');
var ControlScene = require ('./controlScene.js');
//  The Google WebFont Loader will look for this object, so create it before loading the script.

var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    this.game.load.image('controlesBG', 'images/controles.png');
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
    
    this.spriteLogo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');

    this.spriteLogo.anchor.setTo(0.5, 0.5);
    this.spriteLogo.alpha = 0;
    var tween = this.game.add.tween(this.spriteLogo).to( { alpha: 1 }, 2000, "Linear", true, 0, -1);

    tween.yoyo(true, 3000);

    this.loadingBar = this.game.add.sprite(100,300, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5); 
    this.game.load.setPreloadSprite(this.loadingBar);
    this.game.stage.backgroundColor = "#000000";
    
    
    
    this.load.onLoadStart.add(this.loadStart, this);
    //TODO 2.1 Cargar el tilemap images/map.json con el nombre de la cache 'tilemap'.
      //la imagen 'images/simples_pimples.png' con el nombre de la cache 'tiles' y
      // el atlasJSONHash con 'images/rush_spritesheet.png' como imagen y 'images/rush_spritesheet.json'
      //como descriptor de la animación.
       this.game.load.tilemap('map_01', 'images/lvl_01.json', null, Phaser.Tilemap.TILED_JSON);
       this.game.load.tilemap('map_02', 'images/lvl_02.json', null, Phaser.Tilemap.TILED_JSON);
       this.game.load.tilemap('map_03', 'images/lvl_03.json', null, Phaser.Tilemap.TILED_JSON);
       this.game.load.tilemap('map_04', 'images/lvl_04.json', null, Phaser.Tilemap.TILED_JSON);
       this.game.load.tilemap('end_game_level', 'images/end_game_level.json', null, Phaser.Tilemap.TILED_JSON);
       this.game.load.tilemap('jumpTestLevel', 'images/JumpTestLevel.json', null, Phaser.Tilemap.TILED_JSON);
       this.game.load.image('tiles', 'images/TileSet.png');
       this.game.load.spritesheet('player_01', 'images/player_01.png',28,28,11);
       this.game.load.spritesheet('player_02', 'images/player_02.png',28,28,11);
       this.game.load.spritesheet('player_03', 'images/player_03.png',28,28,11);
       this.game.load.spritesheet('limo_01', 'images/limo_01.png',28,28,11);
       this.game.load.image('enemy_02', 'images/topo.png')
       this.game.load.image('player_info_01', 'images/player_info_01.png');
       this.game.load.image('player_info_02', 'images/player_info_02.png');
       this.game.load.image('player_info_03', 'images/player_info_03.png');
       this.game.load.image('powerLife', 'images/life.png');
       this.game.load.image('enemy_01', 'images/enemy.png');
       this.game.load.image('cannon_01', 'images/cannon.png');
       this.game.load.image('bullet_01', 'images/bullet.png');
       this.game.load.image('llave_01', 'images/llave.png');
       this.game.load.image('puerta_01', 'images/puerta.png')
       this.game.load.image('flechaIz', 'images/flechaIz.png');
       this.game.load.image('flechaDer', 'images/flechaDer.png');
       this.game.load.image('trigger', 'images/trigger.png');
       this.game.load.image('winBG', 'images/win.png');
       this.game.load.image('gameOverBG', 'images/gameover.png');
       this.game.load.image('creditsBG', 'images/creditsBG.png');
       this.game.load.spritesheet('sound', 'images/sound.png', 64,64,2);
       //SOUND-------------------------------------------------------------------------------------------
       this.game.load.audio('menu_music', ['sound/A Walk in the Park.mp3', 'sound/A_Walk_in_the_Park.ogg']);
       this.game.load.audio('outside_music', ['sound/Platform80kbps.mp3','sound/Platform80kbps.ogg']);
       this.game.load.audio('cave_music', ['sound/Craig Stern - Funky, Funky Spy.mp3','sound/Craig_Stern_-_Funky_Funky_Spy.ogg']);
       this.game.load.audio('jump_fx',['sound/Perplexe-xk-113_hifi.mp3','sound/Perplexe-xk-113_hifi.ogg']);
       this.game.load.audio('cannon_fx', ['sound/Swing_n-Aaron_Be-8767_hifi.mp3','sound/Swing_n-Aaron_Be-8767_hifi.ogg']);
       this.game.load.audio('door_fx', ['sound/Wooden_D-Doogens-8721_hifi.mp3','sound/Wooden_D-Doogens-8721_hifi.ogg']);
       this.game.load.audio('slap_fx',['sound/Slap-Michael-8688_hifi.mp3','sound/Slap-Michael-8688_hifi.ogg']);
       this.game.load.audio('pause_fx', ['sound/BubblePo-Benjamin-8920_hifi.mp3','sound/BubblePo-Benjamin-8920_hifi.ogg']);
       this.game.load.audio('select_fx',['sound/Switch19-intermed-5260_hifi.mp3','sound/Switch19-intermed-5260_hifi.ogg']);
       this.game.load.audio('life_fx',['sound/EFECTOS DE SONIDO - LVL UP.mp3','sound/EFECTOS DE SONIDO - LVL UP.ogg']);
       this.game.load.audio('gameOver_fx',['sound/Fallo- Efecto de Sonido.mp3','sound/Fallo- Efecto de Sonido.ogg']);
       this.game.load.audio('victory_fx', ['sound/Victory-Efecto de Sonido.mp3','sound/Victory-Efecto de Sonido.ogg']);
       this.game.load.audio('fly_fx', ['sound/ANIMALFLY_6049_60.mp3','sound/ANIMALFLY_6049_60.ogg']);
       this.game.load.audio('mole_fx', ['sound/Pop_2-Texavery-8930_hifi.mp3','sound/Pop_2-Texavery-8930_hifi.ogg']);
       //this.game.load.atlasJSONHash('rush_idle01', 'images/rush_spritesheet.png', 'images/rush_spritesheet.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
       
      //TODO 2.2a Escuchar el evento onLoadComplete con el método loadComplete que el state 'play'
        this.game.load.onLoadComplete.add(this.loadComplete, this);
  },

  loadStart: function () {
    console.log("Game Assets Loading ...");
  },
    
    
  loadComplete: function(){
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
//TODO 1.2 Añadir los states 'boot' BootScene, 'menu, 'preloader' PreloaderScene, 'play' PlayScene, 'gameOver' GameOver.
 game.state.add('boot', BootScene);
 game.state.add('menu', MenuScene);
 game.state.add('controls', ControlScene);
 game.state.add('level_select', MenuLevel);
 game.state.add('preloader', PreloaderScene);
 game.state.add('select_player', SelectPlayer);
 game.state.add('level_01', Level_01);
 game.state.add('level_02', Level_02);
 game.state.add('level_03', Level_03);
 game.state.add('level_04', Level_04);
 game.state.add('jumpTestLevel', JumpTestLevel);
 game.state.add('menu_in_game',MenuInGame);
 game.state.add ('gameOver', GameOver);
 game.state.add('endLevel', EndLevel);
 game.state.add('credits', Credits);

//TODO 1.3 iniciar el state 'boot'. 
game.state.start('boot');
}
},{"./controlScene.js":1,"./credits.js":2,"./end_level.js":3,"./gameover_scene.js":5,"./jumpTestLevel.js":6,"./level_01.js":7,"./level_02.js":8,"./level_03.js":9,"./level_04.js":10,"./menu_in_game.js":12,"./menu_level.js":13,"./menu_scene.js":14,"./select_player.js":15}],12:[function(require,module,exports){
var mute = false;
var MenuInGame = {
	//METODOS
	init: function (gameState, mus, mut){
		this.prevState = gameState;
    this.music = mus;
    if(mut)this.numFrame = 1;
    else this.numFrame = 0;
	},

    create: function () {
      this.game.stage.backgroundColor = "#4488AA";
      this.muteButn = this.game.add.button(this.game.world.centerX+150,300,'sound',this.muteOnCLick,this,this.numFrame,this.numFrame);
        var button = this.game.add.button(this.game.world.centerX, 
                                               250, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 1, 0);
        button.anchor.set(0.5);
        var text = this.game.add.text(0, 0, "RESUME");
        text.font = 'Sniglet';
        text.anchor.set(0.5);
        button.addChild(text);

        var button2 = this.game.add.button(this.game.world.centerX, 
                                               340, 
                                               'button', 
                                               this.actionOnClick2, 
                                               this, 2, 1, 0);
        button2.anchor.set(0.5);
        var text2 = this.game.add.text(0, 0, "RESET");
        text2.font = 'Sniglet';
        text2.anchor.set(0.5);
        button2.addChild(text2);

        var button3 = this.game.add.button(this.game.world.centerX, 
                                               430, 
                                               'button', 
                                               this.actionOnClick3, 
                                               this, 2, 1, 0);
        button3.anchor.set(0.5);
        var text3 = this.game.add.text(0, 0, "EXIT");
        text3.font = 'Sniglet';
        text3.anchor.set(0.5);
        button3.addChild(text3);
    },
    muteOnCLick: function(){
      if(mute){
        mute = false;
        this.music.mute = false;
        this.muteButn.setFrames(0);
      }
      else {
        mute = true;
        this.music.mute = true;
        this.muteButn.setFrames(1);
      }

    },
    actionOnClick: function(){
    	console.log('Boton RESUME pulsado');
    	this.game.state.start(this.prevState, true, false, mute,true);
        //this.game.state.resume('play', true, false, this._sprite, this._level, this.pauseGameState, true);
    },

    actionOnClick2: function(){
    	console.log('Boton RESET pulsado');
      this.music.destroy();
    	this.game.state.start(this.prevState, true, false, mute,false);
    },

    actionOnClick3: function(){
       this.music.destroy();
       this.game.world.setBounds(0,0,800,600);
       this.game.stage.backgroundColor = '#000000';
       this.game.state.start('menu');
    },
};

module.exports = MenuInGame;
},{}],13:[function(require,module,exports){
var aux;
var aux2;
var musica;
var MenuLevel = {
    init: function (selection, music){
      aux = selection;
      musica = music;
    },
    create: function () {
       var selectText = this.game.add.text(400, 100, "Select the level");
       selectText.fill = '#43d637';
       selectText.anchor.set(0.5);
        var buttonLvl1 = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY - 100, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 1, 0);
        buttonLvl1.anchor.set(0.5);
        var textLvl1 = this.game.add.text(0, 0, "Level_01");
        textLvl1.font = 'Sniglet';
        textLvl1.anchor.set(0.5);
        buttonLvl1.addChild(textLvl1);

        var buttonLvl2 = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY, 
                                               'button', 
                                               this.actionOnClick2, 
                                               this, 2, 1, 0);
        buttonLvl2.anchor.set(0.5);
        var textLvl2 = this.game.add.text(0, 0, "Level_02");
        textLvl2.font = 'Sniglet';
        textLvl2.anchor.set(0.5);
        buttonLvl2.addChild(textLvl2);

        var buttonLvl3 = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY + 100, 
                                               'button', 
                                               this.actionOnClick3, 
                                               this, 2, 1, 0);
        buttonLvl3.anchor.set(0.5);
        var textLvl3 = this.game.add.text(0, 0, "Level_03");
        textLvl3.font = 'Sniglet';
        textLvl3.anchor.set(0.5);
        buttonLvl3.addChild(textLvl3);

        var buttonLvl4 = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY + 200, 
                                               'button', 
                                               this.actionOnClick4, 
                                               this, 2, 1, 0);
        buttonLvl4.anchor.set(0.5);
        var textLvl4 = this.game.add.text(0, 0, "Level_04");
        textLvl4.font = 'Sniglet';
        textLvl4.anchor.set(0.5);
        buttonLvl4.addChild(textLvl4);


    },
    
    actionOnClick: function(){
        aux2 = 'level_01';
        this.initLevel();
    },

    actionOnClick2: function(){
        aux2 = 'level_02';
        this.initLevel();
    },

    actionOnClick3: function(){
        aux2 = 'level_03';
        this.initLevel();
    },

    actionOnClick4: function(){
        aux2 = 'level_04';
        this.initLevel();
    },

    initLevel: function(){
      musica.destroy();
      this.game.state.start(aux2, true, false, false,false, aux);
    }

};

module.exports = MenuLevel;
},{}],14:[function(require,module,exports){
var MenuScene = {
  perro: 98,
    create: function () {
        
        var logo = this.game.add.sprite(this.game.world.centerX, 
                                        this.game.world.centerY, 
                                        'logo');
        logo.anchor.setTo(0.5, 0.5);
        var buttonStart = this.game.add.button(this.game.world.centerX-200, 
                                               this.game.world.centerY+200, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 1, 0);
        buttonStart.anchor.set(0.5);
        var textStart = this.game.add.text(0, 0, "Start");
        textStart.font = 'Sniglet';
        textStart.anchor.set(0.5);
        buttonStart.addChild(textStart);
         var buttonControls = this.game.add.button(this.game.world.centerX+200, 
                                               this.game.world.centerY+200, 
                                               'button', 
                                               this.actionOnClick2, 
                                               this, 2, 1, 0);
        buttonControls.anchor.set(0.5);
        var textControls = this.game.add.text(0, 0, "Controles");
        textControls.font = 'Sniglet';
        textControls.anchor.set(0.5);
        buttonControls.addChild(textControls);
    },
    
    actionOnClick: function(){
        this.game.state.start('preloader');
    },
    actionOnClick2: function(){
       this.game.world.setBounds(0,0,800,600);
       this.game.state.start('controls');
    },
};

module.exports = MenuScene;
},{}],15:[function(require,module,exports){
var MenuScene = {
  player:'',
  cont: 0,
    create: function () {

      //SOUND---------------------------------------
      this.music = this.game.add.audio('menu_music');
      this.select_fx= this.game.add.audio('select_fx');
      this.music.onDecoded.add(this.startMusic, this);
      //---------------------------------------------
       this.game.stage.backgroundColor = "#4488AA";
      var selectText = this.game.add.text(400, 100, "Select the player");
      selectText.fill = '#43d637';
      selectText.anchor.set(0.5);
      var auxText = this.game.add.text(400, 500, "Press INTRO to select");
      auxText.fill = '#43d637';
      auxText.anchor.set(0.5);
      this.flechaDer = this.game.add.sprite(this.game.world.centerX+300, this.game.world.centerY,'flechaDer');
      this.flechaIz = this.game.add.sprite(this.game.world.centerX-300, this.game.world.centerY,'flechaIz');
      this.flechaIz.anchor.set(0.5);
      this.flechaDer.anchor.set(0.5);

      this.players = [
       p1 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY,'player_info_01'),
       p2= this.game.add.sprite(this.game.world.centerX, this.game.world.centerY,'player_info_02'),
       p3 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY,'player_info_03'),
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
        this.flechaIz.scale.set(1);
        this.flechaDer.scale.set(1);
        this.cont = 0;
      }

       this.players[this._it].visible = true;
       this.cursors.left.onDown.add(this.prev, this);
       this.cursors.right.onDown.add(this.next, this);
       this.selectButton.onDown.add(this.selectPlayer, this);
    },
    startMusic: function(){
      this.music.fadeIn(2000,true);
    },
    selectPlayer: function(){
      switch (this._it){
        case 0: aux = { name: 'player_01', life: 5, jump: -750, speedPower: 1 }; // 1 aumenta la velocidad.
                break;
        case 1: aux = { name: 'player_02', life: 4, jump: -800, speedPower: 0 }; // 0 la mantiene.
                break; 
        case 2: aux = { name: 'player_03', life: 5, jump: -900, speedPower: -1 }; // -1 la decrementa.
                break; 
      }
       this.select_fx.play();
       var self = this;
       setTimeout(function(){self.select_fx.destroy();},2000);
      this.game.state.start('level_select', true, false, aux,this.music);
    },
    next: function(){
      this.select_fx.play();
      this.flechaDer.scale.set(1.25)
      this.players[this._it].visible = false;
      this._it = (this._it +1) % this.players.length;//console.log(this._it);
    },
    prev: function(){
       this.select_fx.play();
       this.flechaIz.scale.set(1.25);
       this.players[this._it].visible = false;
       if (!!this._it) this._it--;
       else this._it = this.players.length -1;
    },
};

module.exports = MenuScene;
},{}]},{},[11]);
