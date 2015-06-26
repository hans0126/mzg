define(['ui', 'findpath','help'], function(ui, findpath,help) {

    function _createRole() {
        this._roleLocal = null; //Object
        this._roleTypeObj;
        this._faction;
        this._objectName;
        this._spriteName
        this.create = function() {

            var _role = PIXI.Sprite.fromFrame(this._spriteName);

            if (this._roleLocal == "undefined" || this._roleLocal == null) {
                this._roleLocal = getRandomRoom(totalRoom);
            }

            _role.x = randomDeploy(this._roleLocal.localX, blockWidth);
            _role.y = randomDeploy(this._roleLocal.localY, blockHeight);

            _role.pivot.x = 0.5;
            _role.pivot.y = 0.5;
            _role.anchor.x = 0.5;
            _role.anchor.y = 0.5;


            if (this._objectName == "undefined" || this._objectName == null) {
                _role.myId = "z" + Math.floor(Math.random() * 999999) + "_" + new Date().getTime(); //亂數
            } else {
                _role.myId = this._objectName;
            }


            _role.local = this._roleLocal;
            _role.faction = this._faction;

            _role.actionMovement = false;
            _role.goalX = null;
            _role.goalY = null;
            return _role;
        }
    }

    function _createEnemy() {
        for (var i = 0; i < appearEnemy.length; i++) {
            for (j = 0; j < appearEnemy[i].count; j++) {
                var cR = new _createRole();
                cR._roleTypeObj = arrRoleType[appearEnemy[i].id];
                // cR._spriteName = "role_zombie_" + Math.floor(Math.random() * 2);
                cR._spriteName = arrRoleType[appearEnemy[i].id].spriteName;
                var _enemy = cR.create();
                _enemy.visible = true;
                enemyLayer.addChild(_enemy);
            }
        }
    }

    function _createPlayer() {
        for (var i = 0; i < appearPlayer.length; i++) {
            var cR = new _createRole();
            cR._roleTypeObj = arrRoleType[appearPlayer[i]];
            cR._spriteName = arrRoleType[appearPlayer[i]].spriteName;
            cR._roleLocal = null;
            var newR = cR.create();
            newR.skillTree = arrRoleType[appearPlayer[i]].skillTree;

            playerLayer.addChild(newR);

            newR.interactive = true;
            newR.buttonMode = true;

            newR.skill = [];
            newR.level = 1;
            newR.skill.push(newR.skillTree[0][0]);
            newR.live = true;
            //[0] = hand 
            //[1] = backpack
            newR.equip = [0, 0, 0, 0, 0];

            newR.wound = 0;
            newR.actionPoint = 3;
            newR.on('mousedown', help.openAttackMenu);
            newR.roleName = arrRoleType[appearPlayer[i]].name;
            newR.score = 0;

            arrLayerManager[arrRoleType[appearPlayer[i]].name + "_token"] = newR;

            //取得視野
            newR.panorama = findpath.getPanorama(newR.local.room_id, 0, 5);
            /*
                        for (var j = 0; j < newR.panorama.length; j++) {

                            objectHelp(enemyLayer.children, {
                                local: newR.panorama[j]
                            }, {
                                visible: true
                            });

                        }*/
        }
    }


    /*角色被選取時*/
    function _roleClick(event) {
        //console.log(this.objectName);
        currentRole = this;


        _closeAttackBtn();
        this.interactive = false;

        _activeCurrentRoomObj(this.local.room_id);


        ui.updateAp(currentRole.actionPoint);

        for (var i = 0; i < currentRole.equip[0].length; i++) {
            if (arrItems[currentRole.equip[0][i]].category == "weapon") {
                var _btn = new PIXI.Graphics();
                _btn.beginFill(0x990000, 1);
                _btn.drawCircle(0, 0, 50);
                _btn.endFill();
                _btn.x = currentRole.x;
                _btn.y = currentRole.y;
                _btn.alpha = 0;
                _btn.interactive = true;
                _btn.buttonMode = true;
                _btn.weaponId = currentRole.equip[0][i];
                _btn.btnClass = "attackBtn";


                _btn.myId = createRandomId();
                // console.log( _btn );
                var _textObj = new PIXI.Text(arrItems[_btn.weaponId].name, {
                    fill: 0xffffff
                });

                _textObj.anchor = {
                    x: 0.5,
                    y: 0.5
                };

                _btn.addChild(_textObj);

                if (i % 2 != 0) {
                    var _x = currentRole.x - 70;
                } else {
                    var _x = currentRole.x + 70;
                }

                var tween = new TweenMax(_btn, 0.5, {
                    x: _x,
                    alpha: 1
                });

                actionUiLayer.addChild(_btn);

                //_btn.on("mousedown", attack.attack);
            }
        }

        var _btn = new PIXI.Graphics();
        _btn.beginFill(0x990000, 1);
        _btn.drawCircle(0, 0, 15);
        _btn.endFill();
        _btn.btnClass = "attackBtn";

        var _textObj = new PIXI.Text("X", {
            fill: 0xffffff,
            font: '24px Arial'
        });

        _textObj.anchor = {
            x: 0.5,
            y: 0.5
        };

        _btn.addChild(_textObj);

        _btn.x = currentRole.x;
        _btn.y = currentRole.y;
        _btn.alpha = 0;

        actionUiLayer.addChild(_btn);

        var tween = new TweenMax(_btn, 0.5, {
            y: _btn.y + 50,
            alpha: 1,
            onComplete: function(_obj) {

                _obj.target.interactive = true;
                _obj.target.buttonMode = true;
                _obj.target.on('mousedown', _closeAttackBtn);
            },
            onCompleteParams: ["{self}"]
        });
    }

    function _closeAttackBtn() {
        ui.closeAttackBtn();
        objectHelp(playerLayer.children, {}, {
            interactive: true
        });
    }


    /*通過房間*/
    function _passageDoor(event) {
        //currentRole
        ui.closeAttackBtn();
        var _targetRoomId = false;
        for (var i = 0; i < this.passage.length; i++) {
            if (this.passage[i] != currentRole.local.room_id) {
                _targetRoomId = this.passage[i];
                break;
            }
        }

        if (_targetRoomId) {
            //search room location
            var _roomLocal = getMapInfo(arrMap, {
                room_id: _targetRoomId
            })[0];

            var _x = randomDeploy(_roomLocal.localX, blockWidth);
            var _y = randomDeploy(_roomLocal.localY, blockWidth);
            currentRole.local = _roomLocal;

            var tween = new TweenMax(currentRole, 0.5, {
                x: _x,
                y: _y,
                onUpdate: function() {
                    TweenLite.to(gameStage, 0.5, {
                        x: (displayWidth / 2) - currentRole.x,
                        y: (displayHeight / 2) - currentRole.y,
                        roundProps: "x,y"
                    });
                }
            });

            //locationCheck(currentRole, arrRoleObj, roomLocal);

            disableAllRoomObj();

            /*
                扣除Action
            */

            /**/
            currentRole.panorama = findpath.getPanorama(currentRole.local.room_id, 0, 5);

            // _displayPanorama();

            currentRole.actionPoint--;
            ui.updateAp(currentRole.actionPoint);
            if (currentRole.actionPoint > 0) {
                currentRole.interactive = true;
                activeCurrentRoomObj(_roomLocal);
            }

            help.checkActionPoint();

        }

        //this.beginFill(0xFF0000);

        //this.tint = 0xFF0000;
    }

    /*被選取的腳色，啟用當下房間的門*/
    function _activeCurrentRoomObj(room_id) {


        for (var i = 0; i < passageLayer.children.length; i++) {

            if (passageLayer.children[i].passage.indexOf(room_id) > -1) {
                passageLayer.children[i].interactive = true;
                passageLayer.children[i].buttonMode = true;
                passageLayer.children[i].tint = 0x00FF00;
                passageLayer.children[i].visible = true;
            }

        }



        for (var i = 0; i < itemLayer.children.length; i++) {
            if (itemLayer.children[i].local.room_id == room_id) {

                itemLayer.children[i].interactive = true;
            }
        }
    }

    function _disableObj() {

        objectHelp(passageLayer.children, null, {
            interactive: false,
            tint: 0x666666,
            visible: false
        });

        objectHelp(itemLayer.children, null, {
            interactive: false
        });

    }

    /*search Item*/
    function _searchItem() {
        var _getItem = Math.floor(Math.random() * arrItems.length);
        _closeAttackBtn();
        arrCommonObj['msgbox'].visible = true;
        arrCommonObj['msgbox'].children = [];

        itemLayer.removeChild(this);


        var _textObj = new PIXI.Text(arrItems[_getItem].name, {
            fill: 0x000000,
            font: '24px Arial'
        });

        _textObj.interactive = true;
        _textObj.buttonMode = true;
        _textObj.itemId = _getItem;
        _textObj.on('mousedown', _enterToItemStatus);

        arrCommonObj['msgbox'].addChild(_textObj);

        function _enterToItemStatus() {

            arrCommonObj['msgbox'].chidren = [];
            arrCommonObj['msgbox'].visible = false;

            if (this.itemId == 0) {
                return false;
            }

            ui.statusOpen();

            arrCommonObj['trashCard'].myItemId = this.itemId;
            arrCommonObj['trashCard'].targetObj.children[1].text = arrItems[this.itemId].name;
            arrCommonObj['trashCard'].targetObj.visible = true;

        }

    }

    function _displayPanorama() {
        objectHelp(enemyLayer.children, {}, {
            visible: false
        });
        var _players = playerLayer.children;
        for (var i = 0; i < _players.length; i++) {
            for (var j = 0; j < _players[i].panorama.length; j++) {
                objectHelp(enemyLayer.children, {
                    local: _players[i].panorama[j]
                }, {
                    visible: true
                });
            }
        }
    }

    return {
        createRole: _createRole,
        roleClick: _roleClick,
        passageDoor: _passageDoor,
        searchItem: _searchItem,
        createEnemy: _createEnemy,
        createPlayer: _createPlayer
    }

})
