'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3}
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3}
var numJumps = 0;
//Scena de juego.
var PlayScene = {
    _rush: {},
    _player: {}, //player
    _speed: 300, //velocidad del player
    _jumpSpeed: 600, //velocidad de salto
    _jumpHight: 150, //altura máxima del salto.
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.

    //Método constructor...
  create: function () {

  	//Crear player:
  	this._player= this.game.add.sprite(96,1472, 'player_01');
  	//Crear mapa
  	this.map = this.game.add.tilemap('level_01');
  	this.map.addTilesetImage('patrones','tiles');
  	//Creación de layers
  	this.groundLayer = this.map.createLayer('Ground');
  	this.map.setCollisionBetween(0,5000, true, 'Ground');

  	this.configure();
  	// Crear cursores
  	this.cursors = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.jumpTimer = 0;
    
  },
    
    //IS called one per frame.
    update: function () {
        var collisionWithTilemap = this.game.physics.arcade.collide(this._player, this.groundLayer);
        this._player.body.velocity.x = 0; 

        if (this.cursors.left.isDown)
        {
           this._player.body.velocity.x = -150;
        }
        else if (this.cursors.right.isDown)
        {
           this._player.body.velocity.x = 150;
        }
        if (this.jumpButton.isDown && this._player.body.onFloor()&& this.game.time.now > this.jumpTimer)
        {
          this._player.body.velocity.y = -500;
          this.jumpTimer = this.game.time.now + 750;
        }
    },
    
    
    canJump: function(collisionWithTilemap){
        return this.isStanding() && collisionWithTilemap || this._jamping;
    },
    
    onPlayerFell: function(){
        //TODO 6 Carga de 'gameOver';
        this.destroy();
        this.game.state.start('gameOver');
    },
    
    checkPlayerFell: function(){
        if(this.game.physics.arcade.collide(this._player, this.death))
            this.onPlayerFell();
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
        
        this._player.body.bounce.y = 0.2;
        this._player.body.collideWorldBounds = true;
        this._player.body.gravity.y = 2000;
        this._player.body.gravity.x = 0;
        this._player.body.velocity.x = 0;
        this.game.camera.follow(this._player);
    },
    //move the player
    movement: function(point, xMin, xMax){
        this._player.body.velocity = point;// * this.game.time.elapseTime;
        
        if((this._player.x < xMin && point.x < 0)|| (this._player.x > xMax && point.x > 0))
            this._player.body.velocity.x = 0;

    },
    
    //TODO 9 destruir los recursos tilemap, tiles y logo.
    destroy: function(){
    this._player.destroy();
    this.map.destroy();
    }

};

module.exports = PlayScene;
