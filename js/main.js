/**/
requirejs.config({
    baseUrl: "js",
    paths: {
        jquery: "https://code.jquery.com/jquery-2.1.4.min",
        pixi: "lib/pixi.js/bin/pixi",
        TweenLite: "lib/greensock-js/src/minified/TweenLite.min",
        TweenMax: "lib/greensock-js/src/minified/TweenMax.min",
        EasePack: "lib/greensock-js/src/minified/easing/EasePack.min",
        datas: "app/datas",
        help: "app/helps",
        attackModel: "app/attack_model",
        ui: "app/ui",
        init: "app/init",
        map: "app/map",
        role: "app/role",
        attack: "app/attack",
        findpath: "app/findpath",
        enemy: "app/enemy",
        meter: "lib/stats.js-master/build/stats.min"
    }
})


requirejs(['init', 'jquery', 'pixi', 'TweenMax', 'EasePack'], function(init) {

    PIXI.Container.prototype.updateLayersOrder = function() {
        this.children.sort(function(a, b) {
            a.zIndex = a.zIndex || 0;
            b.zIndex = b.zIndex || 0;
            return a.zIndex - b.zIndex
        });
    }

    loader = new PIXI.loaders.Loader();
    loader.add("map", "images/map.json");
    loader.add("police_bg","images/police_bg.jpg");
    loader.add("skill_bg","images/skill_bg.png");
    loader.add("crackhouse","images/crackhouse.fnt");
    loader.add("card_bg","images/card.jpg");
    loader.on("complete", complete);
    loader.load();


    function complete(loader,re) {
        resource = re; 
      
        
        init.init();
    }


})
