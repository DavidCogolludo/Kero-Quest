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

