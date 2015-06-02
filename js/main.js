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
        role:"app/role",
        attack:"app/attack",
        findpath:"app/findpath",
        enemy:"app/enemy",
        meter:"lib/stats.js-master/build/stats.min"
    }
})


requirejs(['init', 'jquery', 'pixi', 'TweenMax', 'EasePack'], function(init) {
   
    init.init();
    /*
    var t2 = new countdown();
    t2.process = function(){
        console.log(this.percent);
    }

    arrTimer.push(t2);

    */

})
