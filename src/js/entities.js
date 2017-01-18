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
