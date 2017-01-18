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