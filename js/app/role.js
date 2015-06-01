define(['attack'],function(attack) {

	
	
    function _createRole() {
        this._roleLocal; //Object
        this._roleTypeObj;
        this._faction;
        this._objectName;
        this.create = function() {
            var _role = new PIXI.Graphics();
            _role.beginFill(this._roleTypeObj.color, 1);
            _role.drawCircle(0, 0, 10);
            _role.endFill();

            if (this._roleLocal == "undefined" || this._roleLocal == null) {
                this._roleLocal = getRandomRoom(totalRoom);
            }

            //  var _roomLocal = getRoomObject(this._roleLocal);

            _role.x = randomDeploy(this._roleLocal.localX, blockWidth);
            _role.y = randomDeploy(this._roleLocal.localY, blockHeight);



            if (this._objectName == "undefined" || this._objectName == null) {
                _role.objectName = "z" + Math.floor(Math.random() * 999999) + "_" + new Date().getTime(); //亂數
            } else {
                _role.objectName = this._objectName;
            }

            _role.local = this._roleLocal;
            _role.faction = this._faction;

            _role.actionMovement = false;
            _role.goalX = null;
            _role.goalY = null;
            return _role;
        }
    }


    /*角色被選取時*/
    function _roleClick(event) {
        //console.log(this.objectName);
        this.interactive = false;
        this.tint = 0xFF0000;

        _currentRoomDoorActive(this.local.room_id);
        currentRole = this;

        updateAp(currentRole.actionPoint);

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

                _btn.on("mousedown", attack.attack);
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
                _obj.target.on('mousedown', _closeArrackBtn);
            },
            onCompleteParams: ["{self}"]
        });


        function _closeArrackBtn() {
            _closeAttackBtn();
            currentRole.interactive = true;
        }

    }

    /*關閉選項*/
    function _closeAttackBtn() {
        for (var i = 0; i < actionUiLayer.children.length; i++) {
            if (actionUiLayer.children[i].btnClass == "attackBtn") {

                actionUiLayer.children[i].interactive = false;
                var tween = new TweenMax(actionUiLayer.children[i], 0.3, {
                    x: currentRole.x,
                    y: currentRole.y,
                    alpha: 0,
                    onComplete: function() {
                        var _target = this.target;

                        for (var j = 0; j < actionUiLayer.children.length; j++) {
                            if (actionUiLayer.children[j].myId == _target.myId) {
                                actionUiLayer.children.splice(j, 1);
                            }
                        }

                    }
                });
            }
        }
    }

    /*通過房間*/
    function _passageDoor(event) {
        //currentRole
        _closeAttackBtn();
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
                        y: (displayHeight / 2) - currentRole.y
                    });
                }
            });

            //locationCheck(currentRole, arrRoleObj, roomLocal);

            objectHelp(passageLayer.children, null, {
                interactive: false,
                tint: 0x666666,
                buttonMode: false,
                visible: false

            });

            /*
                扣除Action
            */

            /**/
            var _currentPanorama = getPanorama(currentRole.local.room_id, 0, 5);

            currentRole.panorama = _currentPanorama;

            objectHelp(enemyLayer.children, {

            }, {
                visible: false
            });

            for (var i = 0; i < _currentPanorama.length; i++) {

                objectHelp(enemyLayer.children, {
                    local: _currentPanorama[i]
                }, {
                    visible: true
                });

            }

            currentRole.actionPoint--;
            updateAp(currentRole.actionPoint);
            if (currentRole.actionPoint > 0) {
                currentRole.interactive = true;
                _currentRoomDoorActive(_targetRoomId);
            }

            checkActionPoint();

        }

        //this.beginFill(0xFF0000);

        //this.tint = 0xFF0000;
    }

    /*被選取的腳色，啟用當下房間的門*/
    function _currentRoomDoorActive(room_id) {
        for (var i = 0; i < passageLayer.children.length; i++) {

            if (passageLayer.children[i].passage.indexOf(room_id) > -1) {
                passageLayer.children[i].interactive = true;
                passageLayer.children[i].buttonMode = true;
                passageLayer.children[i].tint = 0x00FF00;
                passageLayer.children[i].visible = true;
            }

        }
    }



    return {
        createRole: _createRole,
        roleClick: _roleClick,
        passageDoor:_passageDoor
    }

})
