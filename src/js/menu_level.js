var aux;
var aux2;
var MenuLevel = {
    init: function (selection){
      console.log('selection = '+selection);
      aux = selection;
      console.log('aux ='+aux);
    },
    create: function () {
        /*
        var logo = this.game.add.sprite(this.game.world.centerX, 
                                        this.game.world.centerY, 
                                        'logo');
        logo.anchor.setTo(0.5, 0.5);
        */
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
    },
    
    actionOnClick: function(){
        aux2 = 'level_01';
        console.log ('Selected lvl 1');
        this.initLevel();
    },

    actionOnClick2: function(){
        aux2 = 'level_02';
        console.log ('Selected lvl 2');
        this.initLevel();
    },

    initLevel: function(){
      console.log('Se procede a iniciar el nivel: '+aux2 +' con jugador: '+aux);
      this.game.state.start('play', true, false, aux, aux2);
    }

};

module.exports = MenuLevel;