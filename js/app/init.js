define(['ui', 'map', 'role', 'findpath', 'help', 'datas', 'meter'], function(ui, map, role, findpath) {

    function init() {

        PIXI.Container.prototype.updateLayersOrder = function() {
            this.children.sort(function(a, b) {
                a.zIndex = a.zIndex || 0;
                b.zIndex = b.zIndex || 0;
                return a.zIndex - b.zIndex
            });
        }

        stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms

        // align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.right = '0px';
        stats.domElement.style.top = '0px';

        document.body.appendChild(stats.domElement);


        /*   tempLanguageCombination = ''; //語言組合

           window.addEventListener('keydown', languageCombination);*/

        //常用物件 
        arrCommonObj = [];
        score = 0;

        arrTimer = new Array(); //時間倒數物件  

        arrLayerManager = [];

        totalRoom = 0; //總房間數

        currentRole = null; //目前操作的腳色
        attackButtom = new Array();

        attackMode = false;
        //block size
        blockWidth = 200;
        blockHeight = 200;
        t = 0;

        displayWidth = 750;
        displayHeight = 500;


        renderer = PIXI.autoDetectRenderer(displayWidth, displayHeight, {
            backgroundColor: 0x1099bb
        });

        document.getElementById("gameView").appendChild(renderer.view);
        // create the root of the scene graph

        //增加容器

        mapTexture = PIXI.Texture.fromImage('images/tilemap.png');
        cameraFollow = false;

        dragMap = false;
        stage = new PIXI.Container();
        /*game stage*/
        gameStage = new PIXI.Container(); //主場景
        mapLayer = new PIXI.Container(); //地圖
        enemyLayer = new PIXI.Container(); //敵人
        playerLayer = new PIXI.Container(); //玩家
        itemLayer = new PIXI.Container(); //物件
        passageLayer = new PIXI.Container(); //物件
        actionUiLayer = new PIXI.Container(); //人物ui

        /*main ui*/
        mainUiLayer = new PIXI.Container();
        statusLayer = new PIXI.Container();


        gameStage.interactive = true;

        statusLayer.visible = false;

        stage.addChild(gameStage);
        stage.addChild(mainUiLayer);
        stage.addChild(statusLayer);

        mapLayer.zIndex = 10;
        itemLayer.zIndex = 20;
        enemyLayer.zIndex = 30;
        playerLayer.zIndex = 40;
        passageLayer.zIndex = 50;
        actionUiLayer.zIndex = 60;

        gameStage.addChild(playerLayer);
        gameStage.addChild(itemLayer);
        gameStage.addChild(actionUiLayer);
        gameStage.addChild(enemyLayer);
        gameStage.addChild(passageLayer);
        gameStage.addChild(mapLayer);

        gameStage.updateLayersOrder();
        /*create ui*/
        ui.createUiBtn();
        ui.createAp();
        ui.createStatus();
        ui.createScore();
        ui.createMsgBox();
        /*create map*/
        map.createMap();



        //增加容器 


        var cR = new role.createRole();
        cR._roleTypeObj = arrRoleType[0];
        cR._faction = "enemy";
        for (var i = 0; i < 40; i++) {
            cR._roleLocal = null;
            var _enemy = cR.create();
            _enemy.visible = false;

            enemyLayer.addChild(_enemy);

        }

        var cR = new role.createRole();
        cR._roleTypeObj = arrRoleType[1];
        cR._faction = "player";
        cR._roleLocal = getMapInfo(arrMap, {
            room_id: "f"
        })[0];
        var newR = cR.create();
        newR.skillTree = arrRoleType[1].skillTree;
        playerLayer.addChild(newR);

        newR.interactive = true;
        newR.buttonMode = true;

        newR.skill = [];
        newR.skillHistory = levelRange[0];
        newR.skill.push(newR.skillTree[0][0]);

        console.log(newR.skill);

        newR.equip = [
            [1, 2],
            [1, 3, 0]
        ];
        //[0] = hand 
        //[1] = backpack
        newR.actionPoint = 3;
        //取得視野
        newR.panorama = findpath.getPanorama(newR.local.room_id, 0, 5);

        for (var i = 0; i < newR.panorama.length; i++) {

            objectHelp(enemyLayer.children, {

                local: newR.panorama[i]
            }, {
                visible: true
            });

        }

        currentRole = newR;
        newR.on('mousedown', role.roleClick);

        objectHelp(gameStage.children)


        /**/
        var getInitCurrentPlayer = objectHelp(playerLayer.children, {
            faction: "player"
        })[0];

        moveToTarget(getInitCurrentPlayer.x, getInitCurrentPlayer.y);

        $('#e_move').click(function() {
            enemyMove();
        })



        //enemyMove();
        if (dragMap) {
            gameStage.on('mousedown', onDragStart)
                .on('touchstart', onDragStart)
                // events for drag end
                .on('mouseup', onDragEnd)
                .on('mouseupoutside', onDragEnd)
                .on('touchend', onDragEnd)
                .on('touchendoutside', onDragEnd)
                // events for drag move
                .on('mousemove', onDragMove)
                .on('touchmove', onDragMove);
        }


        /*拖拉地圖*/

        //gameStage.on('mousewheel',onWheel);

        // document.getElementById('gameView').addEventListener("mousewheel", onWheel, false);

        // gridLayer.anchor.set(0.5);// graphics.pivot , sprite.anchor    


        function onDragStart(event) {
            // store a reference to the data
            // the reason for this is because of multitouch
            // we want to track the movement of this particular touch
            this.data = event.data;
            //this.alpha = 0.5;
            this.dragging = true;
            this.sx = this.data.getLocalPosition(this).x * this.scale.x;
            this.sy = this.data.getLocalPosition(this).y * this.scale.y;
        }

        function onDragEnd() {
            this.alpha = 1;

            this.dragging = false;

            // set the interaction data to null
            this.data = null;
        }

        function onDragMove() {

            if (this.dragging) {
                var newPosition = this.data.getLocalPosition(this.parent);
                this.position.x = newPosition.x - this.sx;
                this.position.y = newPosition.y - this.sy;

            }
        }

        function onWheel(event) {
            // console.log(event);
            if (event.wheelDelta < 1) {
                gameStage.scale.x -= 0.1;
                gameStage.scale.y -= 0.1;
            } else {
                gameStage.scale.x += 0.1;
                gameStage.scale.y += 0.1;
            }
        }


        //gameStage.addChild(mapLayer);
        animate();
    }

    function animate() {

        stats.begin();

        renderer.render(stage);

        stats.end();
        requestAnimFrame(animate);

        /*  tilingSprite.tilePosition.x += 1;
          tilingSprite.tilePosition.y += 1;*/

        /*for (var i = 0; i < arrTimer.length; i++) {
            //console.log(arrTimer.length);
            if (arrTimer[i].play()) {
                arrTimer.splice(i, 1);
            }

        }*/


    }


    return {
        init: init
    }

})
