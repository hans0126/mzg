/*time countdown*/
function countdown() {
    this.setTime = 3000;
    this.dateStart = new Date().getTime();
    this.dateEnd = null;
    this.percent = null;
    this.isInit = false;
    this.init = function() {
        this.dateEnd = new Date().getTime() + this.setTime;
        console.log(this.dateStart);
        console.log(this.dateEnd);
    }

    this.play = function() {

        if (!this.isInit) {
            this.init();
            this.isInit = true;
        }

        this.percent = ((new Date().getTime() - this.dateStart) / (this.dateEnd - this.dateStart)) * 100;

        this.process();

        if (this.percent > 100) {
            this.end();
            return true;
        }
    }

    this.process = function() {}

    this.end = function() {}

}



/* 隨機位置不重疊
    _target : 比對的對象
    _targetGroup : 比對的群組
    _roomObject:區域
    
 */

function locationCheck(_target, _targetGroup, _roomObject) {

    for (var i = 0; i < _targetGroup.length; i++) {
        if (_target.local == _targetGroup[i].local && _target != _targetGroup[i]) {
            if (hitTest(_target, _targetGroup[i])) {

                _target.x = randomDeploy(_roomObject.localX, blockHeight);
                _target.y = randomDeploy(_roomObject.localY, blockHeight);

                locationCheck(_target, _targetGroup, _roomObject);
                break;
            }
        }
    }
}


/* 
random depoly to room 
roomCount : 總房間數

return Object

*/

function getRandomRoom(roomCount) {

    var randomCount = Math.floor(Math.random() * roomCount);
    var count = 0;
    var roomObject;
    for (var i = 0; i < arrMap.length; i++) {
        for (var j = 0; j < arrMap[i].length; j++) {
            if (randomCount == count) {

                if (arrMap[i][j].visible == true) {
                    roomObject = arrMap[i][j];
                } else {
                    roomObject = getRandomRoom(roomCount);
                }
            }

            count++;
        }
    }
    return roomObject;
}


/*隨機
    level:倍數 
    space:寬

    return num
    
*/

function randomDeploy(level, space) {
    return (Math.random() * (space - 30) + 15) + (space * level);
}


function getRoomPassage(_roomId) {
    var _returnPassage = new Array();
    for (var i = 0; i < passageLayer.children.length; i++) {
        var _thisPassageIndex = passageLayer.children[i].passage.indexOf(_roomId)
        if (_thisPassageIndex > -1) {
            if (passageLayer.children[i].open == true) {
                if (_thisPassageIndex == 0) {
                    _thisPassageIndex = 1;
                } else {
                    _thisPassageIndex = 0;
                }

                _returnPassage.push(passageLayer.children[i].passage[_thisPassageIndex]);

            }
        }
    }

    return _returnPassage;
}


function removeAttackRangeArea() {

    for (var i = 0; i < attackButtom.length; i++) {
        attackButtom[i].clear();
    }

    attackButtom = [];
}


/**/
function languageCombination(event) {

    if (arrLanguage[event.keyCode] != "undefined" && arrLanguage[event.keyCode] != null) {

        if (arrLanguage[event.keyCode].level == 2 || tempLanguageCombination != '') {
            if (tempLanguageCombination != '') {
                tempLanguageCombination += arrLanguage[event.keyCode].code;

                if (arrLanguage[tempLanguageCombination] != "undefined" && arrLanguage[tempLanguageCombination] != null) {

                    console.log(arrLanguage[tempLanguageCombination].mean);
                }
            } else {
                console.log(arrLanguage[event.keyCode].mean);
            }

            tempLanguageCombination = '';
        } else {
            tempLanguageCombination = arrLanguage[event.keyCode].code;
        }

    } else {
        tempLanguageCombination = '';
    }


}


/*產生角色

 function create return: object
*/

function createRole() {
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

/*產生地圖*/
function createMap() {

    /* mapLayer.interactive = true;
     mapLayer.goalX = null;
     mapLayer.goalY = null;
     mapLayer.actionMovement = false;*/
    /*
        產生地圖以及連接路徑
    */
    for (var y = 0; y < arrMap.length; y++) {
        for (var x = 0; x < arrMap[y].length; x++) {
            totalRoom++;
            if (arrMap[y][x].visible == true) {
                //   _graphics.drawRect(x * blockWidth, y * blockHeight, blockWidth, blockHeight);
                var _tilingSprite = new PIXI.extras.TilingSprite(mapTexture, blockWidth, blockWidth);
                _tilingSprite.x = x * blockWidth;
                _tilingSprite.y = y * blockWidth;
                _tilingSprite.tilePosition.x = (blockWidth * arrMap[y][x].tx) * -1;
                _tilingSprite.tilePosition.y = (blockWidth * arrMap[y][x].ty) * -1;
                _tilingSprite.zIndex = 20;
                mapLayer.addChild(_tilingSprite);
                arrMap[y][x].localX = x;
                arrMap[y][x].localY = y;
                arrMap[y][x].noise = 0;
                arrMap[y][x].passage = [];

                //房間文字
                var _textObj = new PIXI.Text(arrMap[y][x].room_id);
                _textObj.x = x * blockWidth + 5;
                _textObj.y = y * blockHeight + 5;
                mapLayer.addChild(_textObj);

                //門
                for (var i = 0; i < arrDoors.length; i++) {
                    if (arrDoors[i].root_room == arrMap[y][x].room_id) {
                        var _doorGraphics = new PIXI.Graphics();
                        if (arrDoors[i].open) {
                            _doorGraphics.beginFill(0x666666, 1);
                        } else {
                            _doorGraphics.beginFill(0x99FFFF, 1);
                        }

                        _doorGraphics.drawRect((x * blockWidth) + arrDoors[i].x, (y * blockWidth) + arrDoors[i].y, arrDoors[i].width, arrDoors[i].height);
                        _doorGraphics.lineStyle(1, 0x0000FF, 1);

                        _doorGraphics.passage = arrDoors[i].passage;
                        _doorGraphics.open = arrDoors[i].open;
                        _doorGraphics.visible = false;
                        _doorGraphics.on('mousedown', passageDoor);
                        _doorGraphics.zIndex = 10;
                        passageLayer.addChild(_doorGraphics);
                    }

                    //將passage 紀錄於map object
                    var _tempRoomId;
                    var _tempIndex;
                    if (arrDoors[i].passage.indexOf(arrMap[y][x].room_id) > -1) {
                        if (arrDoors[i].passage.indexOf(arrMap[y][x].room_id) == 0) {
                            _tempIndex = 1;
                        } else {
                            _tempIndex = 0;
                        }
                        arrMap[y][x].passage.push(arrDoors[i].passage[_tempIndex]);
                    }
                }
            }
        }
    }
}


/*角色被選取時*/
function roleClick(event) {
    //console.log(this.objectName);
    this.interactive = false;
    this.tint = 0xFF0000;

    currentRoomDoorActive(this.local.room_id);
    currentRole = this;

    updateAp(currentRole.actionPoint);
    $('#name').html(this.objectName);


    for (var i = 0; i < currentRole.equip.main.length; i++) {
        var _btn = new PIXI.Graphics();
        _btn.beginFill(0x990000, 1);
        _btn.drawCircle(0, 0, 50);
        _btn.endFill();
        _btn.x = currentRole.x;
        _btn.y = currentRole.y;
        _btn.alpha = 0;
        _btn.interactive = true;
        _btn.buttonMode = true;
        _btn.weaponId = currentRole.equip.main[i];
        _btn.btnClass = "attackBtn";


        _btn.myId = createRandomId();
        // console.log( _btn );
        var _textObj = new PIXI.Text(arrItems[currentRole.equip.main[i]].name, {
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

        _btn.on("mousedown", attack);
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
        closeAttackBtn();
        currentRole.interactive = true;
    }

}

/*關閉選項*/
function closeAttackBtn() {
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

/*選擇武器*/

function choseWeapon() {
    if (!attackMode) {
        if ($(this).attr('item_category') == "weapon") {
            attack(arrItems[$(this).attr('item_id')]);
            attackMode = true;
        }
    }
}


/*通過房間*/
function passageDoor(event) {
    //currentRole
    closeAttackBtn();
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
                //console.log(currentRole.x+"/"+currentRole.y);
                /*
                gameStage.x = (displayWidth / 2) - currentRole.x;
                gameStage.y = (displayHeight / 2) - currentRole.y;
*/
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
            currentRoomDoorActive(_targetRoomId);
        }

        checkActionPoint();

    }

    //this.beginFill(0xFF0000);

    //this.tint = 0xFF0000;
}

/*被選取的腳色，啟用當下房間的門*/
function currentRoomDoorActive(room_id) {
    for (var i = 0; i < passageLayer.children.length; i++) {

        if (passageLayer.children[i].passage.indexOf(room_id) > -1) {
            passageLayer.children[i].interactive = true;
            passageLayer.children[i].buttonMode = true;
            passageLayer.children[i].tint = 0x00FF00;
            passageLayer.children[i].visible = true;
        }

    }
}

/*
敵人移動
目前僅指向單人
*/

function enemyMove() {
    var _canMovePlay = new Array();
    var _canMoveTargetRoom = new Array();
    var _player = objectHelp(playerLayer.children);

    if (_player.length > 0) {
        _player = _player[0];
    }



    var _playerLocal = _player.local;

    for (var y = 0; y < arrMap.length; y++) {
        for (var x = 0; x < arrMap[y].length; x++) {

            var _roomObject = arrMap[y][x];
            var _resultPaths;
            var _targetRoom;
            var _newRoomLocal;
            var _enemyCount = objectHelp(enemyLayer.children, {
                local: _roomObject
            });

            if (_enemyCount.length > 0 && _playerLocal != _roomObject) {
                _resultPaths = findPath(_playerLocal.room_id, _roomObject.room_id);

                //array sort
                _resultPaths.sort(function(a, b) {
                    return a.length - b.length;
                })

                if (_resultPaths.length > 0) {
                    _targetRoom = _resultPaths[0][1];
                    _newRoomLocal = getMapInfo(arrMap, {
                        room_id: _targetRoom
                    })[0];


                    for (var i = 0; i < _enemyCount.length; i++) {
                        _enemyCount[i].goalX = Math.floor(randomDeploy(_newRoomLocal.localX, blockWidth));
                        _enemyCount[i].goalY = Math.floor(randomDeploy(_newRoomLocal.localY, blockHeight));

                        _canMovePlay.push(_enemyCount[i]);
                        _canMoveTargetRoom.push(_newRoomLocal);
                    }

                }
            }
        }
    }

    for (var i = 0; i < _canMovePlay.length; i++) {
        _canMovePlay[i].local = _canMoveTargetRoom[i];
        //_canMovePlay[i].actionMovement = true;

        var tween = new TweenMax(_canMovePlay[i], ((Math.random() * 5) + 4) / 10, {
            x: _canMovePlay[i].goalX,
            y: _canMovePlay[i].goalY
        });


    }


    //取得所有玩家

    objectHelp(enemyLayer.children, {

    }, {
        visible: false
    });

    var _players = objectHelp(playerLayer.children, {
        faction: "player"
    });




    for (var i = 0; i < _players.length; i++) {
        for (var j = 0; j < _players[i].panorama.length; j++) {

            objectHelp(enemyLayer.children, {
                local: _players[i].panorama[j]
            }, {
                visible: true
            });
        }

    }



    objectHelp(playerLayer.children, {}, {
        interactive: true,
        actionPoint: 3
    });




}




/*
找尋全地圖噪音最大的點(暫)


*/


function findEnemyByNoise() {
    var _tempMap = new Array();

    for (var y = 0; y < arrMap.length; y++) {
        for (var x = 0; x < arrMap[y].length; x++) {
            /*查看該地圖是否有活人*/
            if (arrMap[y][x].visible == true) {
                var _mens = objectHelp(arrRoleObj, {
                    faction: "player",
                    local: arrMap[y][x].room_id
                });
                console.log(arrMap[y][x].room_id + "/" + (arrMap[y][x].noise + _mens.length));
                //  _tempMap[arrMap[y][x].room_id] =  arrMap[y][x].noise +  _mens.length;
                _tempMap.push({
                    room_id: arrMap[y][x].room_id,
                    noise: arrMap[y][x].noise + _mens.length
                });
            }

        }
    }
    return _tempMap.sort(function(a, b) {
        return b.noise - a.noise;
    });

}

/*create current ap at main layer*/
function displayAp() {

    var _textObj = new PIXI.Text('AP:', {
        font: '50px Arial',
        fill: 0xff1010,
        dropShadow: true
    });

    _textObj.x = 10;
    _textObj.y = displayHeight - _textObj.height - 10;
    var _apWidth = _textObj.width + 10;
    mainUiLayer.addChild(_textObj);

    var _textObj = new PIXI.Text('0', {
        font: '100px Arial',
        fill: 0xff1010,
        dropShadow: true
    });
    _textObj.myId = "num";
    _textObj.x = _apWidth;
    _textObj.y = displayHeight - _textObj.height;
    mainUiLayer.addChild(_textObj);

}

function updateAp(_num) {

    var _obj = objectHelp(mainUiLayer.children, {
        myId: "num"
    })[0];

    _obj.text = _num;
    _obj.alpha = 0.5;
    _obj.scale.x = 0.5;
    _obj.scale.y = 0.5;


    new TimelineLite().to(_obj.scale, 0.2, {
        x: 1,
        y: 1
    }).to(_obj, 0.2, {
        alpha: 1
    });
}

/*create ui menu*/

function createUiBtn() {

    /*turn end*/

    var _textObj = new PIXI.Text('End Turn', {
        font: '30px Arial',
        fill: 0xff1010
    });
    _textObj.x = displayWidth - _textObj.width - 10;
    _textObj.y = displayHeight - _textObj.height - 10;
    _textObj.interactive = true;
    _textObj.buttonMode = true;
    _textObj.on("mousedown", enemyMove);
    var _tempHeight = _textObj.height;
    _textObj.mouseover = function() {
        this.style = {
            fill: 0xffffff
        };
    }

    _textObj.mouseout = function() {
        this.style = {
            fill: 0xff1010
        };
    }

    mainUiLayer.addChild(_textObj);

    /*status*/

    var _textObj = new PIXI.Text('Status', {
        font: '30px Arial',
        fill: 0xff1010
    });
    _textObj.x = displayWidth - _textObj.width - 10;
    _textObj.y = displayHeight - _textObj.height - 10 - _tempHeight - 10;
    _textObj.interactive = true;
    _textObj.buttonMode = true;
    //_textObj.on("mousedown", enemyMove);

    _textObj.mouseover = function() {
        this.style = {
            fill: 0xffffff
        };
    }

    _textObj.mouseout = function() {
        this.style = {
            fill: 0xff1010
        };
    }

    mainUiLayer.addChild(_textObj);

}

/*create status interface*/
function createStatus() {
    var _cardBaseX = 220;
    var _row2BaseX;
    var _row2BaseY;
    for (i = 0; i < 3; i++) {
        var _itemCaseParent = new PIXI.Container();
        var _itemCase = new PIXI.Graphics();
        _itemCase.beginFill(0x666666, 1);
        _itemCase.drawRect(0, 0, 150, 225);
        _itemCase.lineStyle(0, 0x0000FF, 1);
        _itemCaseParent.addChild(_itemCase);
        statusLayer.addChild(_itemCaseParent);
        _itemCaseParent.x = _cardBaseX + i * _itemCaseParent.width + 20 * i;
        _itemCaseParent.y = 20;

        _itemCaseParent.myId = "item" + i;

        if (i == 0) {
            _row2BaseX = _itemCaseParent.x + _itemCaseParent.width / 2 + 10;
            _row2BaseY = _itemCaseParent.y + _itemCaseParent.height + 10;
        }

    }

    for (i = 0; i < 2; i++) {
        var _itemCaseParent = new PIXI.Container();
        var _itemCase = new PIXI.Graphics();
        _itemCase.beginFill(0x666666, 1);
        _itemCase.drawRect(0, 0, 150, 225);
        _itemCase.lineStyle(0, 0x0000FF, 1);
        _itemCaseParent.myId = "weapon" + i;
        _itemCaseParent.addChild(_itemCase);
        statusLayer.addChild(_itemCaseParent);
        _itemCaseParent.x = _row2BaseX + i * _itemCaseParent.width + 20 * i;
        _itemCaseParent.y = _row2BaseY;
    }


    var _item = currentRole.equip;

    for (var i = 0; i < _item.main.length; i++) {

        for (var j = 0; j < statusLayer.children.length; j++) {
            if (statusLayer.children[j].myId == "weapon" + i) {
                var _textObj = new PIXI.Text(arrItems[_item.main[i]].name, {
                    font: '30px Arial',
                    fill: 0xffffff
                });
                _textObj.x = 0;
                _textObj.y = 0;
                console.log(_textObj);
                statusLayer.children[j].addChild(_textObj);

                break;
            }
        }

    }


    /*newR.equip = {
        main: [0, 1],
        sub: []
    };*/

}

/*create random id*/

function createRandomId() {
    return Math.floor(Math.random() * 1000) + "_" + Math.floor(Math.random() * 1000);
}




/*
判斷是否還有action process.inherits();
*/

function checkActionPoint() {
    if (currentRole.actionPoint == 0) {
        currentRole.interactive = false;
        currentRole.tint = arrRoleType[1].color;

        objectHelp(passageLayer.children, null, {
            interactive: false,
            tint: 0x666666,
            buttonMode: false
        });

        //currentRole = null;
    }
}
