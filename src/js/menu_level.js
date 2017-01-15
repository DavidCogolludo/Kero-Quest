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