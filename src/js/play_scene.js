'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3}
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3}
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
    this._player= this.game.add.sprite(this.gameState.posX,1472, this.spritePlayer);
  	//Crear mapa;
  	this.map = this.game.add.tilemap('level_01');
  	this.map.addTilesetImage('patrones','tiles');
  	//Creación de layers
  	this.groundLayer = this.map.createLayer('Ground');
  	this.deathLayer = this.map.createLayer('Death');
  	this.map.setCollisionBetween(0,5000, true, 'Ground');
  	this.map.setCollisionBetween(0,5000, true, 'Death');

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
    
  },
    
    //IS called one per frame.
    update: function () {
    	//cambiar la gravedad
    	//this._player.body.velocity.y += (this._gravity*this.game.time.elapsed/2);
        var collisionWithTilemap = this.game.physics.arcade.collide(this._player, this.groundLayer);

        this._player.body.velocity.x = 0; 
        if(this._player.body.onFloor()) this._numJumps=0;
        this.movement(150);
         this.checkPlayerDeath();
        this.jumpButton.onDown.add(this.jumpCheck, this);
        this.pauseButton.onDown.add(this.pauseMenu, this);
    },
    
    init: function (spritePlayer){
       if (!!spritePlayer)this.spritePlayer= spritePlayer;
    },
    pauseMenu: function (){
    	this.gameState.posX = this._player.position.x;
    	this.gameState.posY = this._player.position.y;
    	this.destroy();
       	this.game.state.start('menu_in_game');
    },
    jumpCheck: function (){
    	console.log(this.aux);
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
