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
