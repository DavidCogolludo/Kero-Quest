var MenuScene = {
  player:'',
  cont: 0,
    create: function () {
      var goText = this.game.add.text(400, 100, "Select the player");
      goText.fill = '#43d637';
      goText.anchor.set(0.5);
      this.flechaDer = this.game.add.sprite(this.game.world.centerX+100, this.game.world.centerY,'flechaDer');
      this.flechaIz = this.game.add.sprite(this.game.world.centerX-100, this.game.world.centerY,'flechaIz');
      this.flechaIz.scale.set(2.5);
      this.flechaIz.anchor.set(0.5);
      this.flechaDer.scale.set(2.5);
      this.flechaDer.anchor.set(0.5);

      this.players = [
       p1= this.game.add.sprite(this.game.world.centerX, this.game.world.centerY,'player_01'),
       p2= this.game.add.sprite(this.game.world.centerX, this.game.world.centerY,'player_02'),
       p3 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY,'player_03'),
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
        this.flechaIz.scale.set(2.5);
        this.flechaDer.scale.set(2.5);
        this.cont = 0;
      }

       this.players[this._it].visible = true;
       this.cursors.left.onDown.add(this.prev, this);
       this.cursors.right.onDown.add(this.next, this);
       this.selectButton.onDown.add(this.selectPlayer, this);
    },
    selectPlayer: function(){
      var aux = this.players[this._it].key;
      this.game.state.start('level_select', true, false, aux);
    },
    next: function(){
      this.flechaDer.scale.set(3)
      this.players[this._it].visible = false;
      this._it = (this._it +1) % this.players.length;console.log(this._it);
    },
    prev: function(){
       this.flechaIz.scale.set(3);
       this.players[this._it].visible = false;
       if (!!this._it) this._it--;
       else this._it = this.players.length -1;
    },
};

module.exports = MenuScene;