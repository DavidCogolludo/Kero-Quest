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