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
    var strEquip = "<ul>";
    for (var i = 0; i < this.equip.main.length; i++) {
        strEquip += "<li item_id='" + this.equip.main[i] + "' item_category='" + arrItems[this.equip.main[i]].category + "'>" + arrItems[this.equip.main[i]].name + "</li>";
    }

    strEquip += "</ul>";

    $('#equip').html(strEquip).find('li').on('click', choseWeapon);

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
        

        _btn.myId = Math.floor(Math.random() * 1000) + "_" + Math.floor(Math.random() * 1000);
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



}

/*關閉選項*/
function closeAttackBtn() {
    for (var i = 0; i < actionUiLayer.children.length; i++) {
        if (actionUiLayer.children[i].btnClass == "attackBtn") {
            var tween = new TweenMax(actionUiLayer.children[i], 0.3, {
                x: currentRole.x,
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
                gameStage.x = (displayWidth / 2) - currentRole.x;
                gameStage.y = (displayWidth / 2) - currentRole.y;
            }
        });

        //locationCheck(currentRole, arrRoleObj, roomLocal);

        objectHelp(passageLayer.children, null, {
            interactive: false,
            tint: 0x666666,
            buttonMode: false
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

/*search path 

    _targetLocalId : target room id
    _currentLocalId : current room id

    return 
    
    all can arrive path

*/

function findPath(_targetLocalId, _currentLocalId, _lastLocalId, _arrPathRecord, _arrStamp, _doorMemory, _successPath) {

    if (typeof(_lastLocalId) == "undefined") {
        _lastLocalId = null;
    }

    if (typeof(_arrPathRecord) == "undefined") {
        _arrPathRecord = new Array();
    }

    if (typeof(_arrStamp) == "undefined") {
        _arrStamp = new Array();
    }

    if (typeof(_doorMemory) == "undefined") {
        _doorMemory = new Array();
    }

    if (typeof(_successPath) == "undefined") {
        _successPath = new Array();
    }

    //找出此房間的門，則可判斷出通往的房間
    var _thisRoomDoors = new Array();
    //search door
    for (var i = 0; i < passageLayer.children.length; i++) {
        var _indexOf = passageLayer.children[i].passage.indexOf(_currentLocalId);


        if (_indexOf > -1 && passageLayer.children[i].open == true) {
            if (_indexOf == 0) {
                _indexOf = 1;
            } else {
                _indexOf = 0;
            }

            _thisRoomDoors.push(passageLayer.children[i].passage[_indexOf]);
        }
    }

    _arrPathRecord.push(_currentLocalId);

    var _getDoorTogo;

    if (_thisRoomDoors.indexOf(_lastLocalId) > -1) {
        _thisRoomDoors.splice(_thisRoomDoors.indexOf(_lastLocalId), 1);
    }



    if (_thisRoomDoors.length >= 2) {
        _arrStamp.push("r");
    } else if (_thisRoomDoors.length == 1) {
        _arrStamp.push("0");
    } else if (_thisRoomDoors.length == 0 || _currentLocalId == _targetLocalId) {
        _arrStamp.push("-");
    }

    if (_thisRoomDoors.length > 0 && _arrPathRecord.indexOf(_thisRoomDoors[0]) < 0 && _currentLocalId != _targetLocalId) {

        _getDoorTogo = _thisRoomDoors[0];
        _thisRoomDoors.splice(0, 1);

        _doorMemory.push(_thisRoomDoors);


        findPath(_targetLocalId, _getDoorTogo, _currentLocalId, _arrPathRecord, _arrStamp, _doorMemory, _successPath);
    } else {
        _doorMemory.push(new Array());

        if (_currentLocalId == _targetLocalId) {
            _successPath.push(_arrPathRecord.slice());
        }

        var _c = 0
        for (var i = _arrStamp.length - 1; i > -1; i--) {

            if (_arrStamp[i] == "r") {
                if (_doorMemory.length > 0) {
                    if (_doorMemory[i].length > 0) {

                        _getDoorTogo = _doorMemory[i][0];

                        _doorMemory[i].splice(0, 1);

                        _arrPathRecord.splice(-1 * _c, _c);
                        _arrStamp.splice(-1 * _c, _c);
                        _doorMemory.splice(-1 * _c, _c);

                        findPath(_targetLocalId, _getDoorTogo, _arrPathRecord[i], _arrPathRecord, _arrStamp, _doorMemory, _successPath);
                    }
                } else {

                }

            }
            _c++;
        }

    }

    return _successPath;

}


/*
尋找目標:眼睛
_currentRoomId: 當下room
_roomGroup: 同一個空間
_history:紀錄歷程以免無限迴圈
---
result: array[room id]
*/
function findEnemyByEyes(_currentRoomId, _roomGroup, _history) {

    var _currentRoom;

    if (typeof(_history) == "undefined") {
        _history = new Array();
    }

    _history.push(_currentRoomId);

    //get current room
    _currentRoom = getMapInfo(arrMap, {
        room_id: _currentRoomId
    })[0];


    if (typeof(_roomGroup) == "undefined") {
        _roomGroup = _currentRoom.group;
    }

    _currentPassage = getRoomPassage(_currentRoomId);
    //判斷這個房間是否有玩家 
    var _tempHasPlayer = new Array();
    for (var i = 0; i < _currentPassage.length; i++) {

        var _temp = objectHelp(arrRoleObj, {
            faction: "player",
            local: _currentPassage[i]
        });

        if (_temp.length > 0) {
            _tempHasPlayer.push(_currentPassage[i]);
        }
    }

    if (_tempHasPlayer.length == 0) {

        for (var i = 0; i < _currentPassage.length; i++) {
            //查詢是不是同一個群組的
            if (_history.indexOf(_currentPassage[i]) == -1) {

                var _nextRoomGroup = getMapInfo(arrMap, {
                    room_id: _currentPassage[i]
                })[0].group;

                if (_currentRoom.group == _nextRoomGroup) {
                    _tempHasPlayer = findEnemyByEyes(_currentPassage[i], _roomGroup, _history);
                }
            }

        }
    }

    return _tempHasPlayer;
}

/*十字視野*/
function getPanorama(_currentRoomId, _minRange, _maxRange) {

    var _clockwise = [-1, 1, 1, -1]; //四方推演 順時針
    var _blockOff = [true, true, true, true]; //阻擋紀錄 
    var _arrReturn = [];
    var _mapGroupRecord = []; /*增加record*/
    var _passgeRecord = [];
    var _currentLocal = getMapInfo(arrMap, {
        room_id: _currentRoomId
    })[0];


    _mapGroupRecord[0] = _currentLocal.group;
    _passgeRecord[0] = _currentLocal.room_id;

    if (typeof(_minRange) == "undefined") {
        _minRange = 0;
    }

    if (typeof(_maxRange) == "undefined") {
        _maxRange = 2;
    }

    for (var i = _minRange; i < _maxRange + 1; i++) {

        var _tempArray = [];
        var _tempPassage = [];
        if (i < 1) {
            _arrReturn.push(_currentLocal);
        } else {
            //4方擴展 clockwise y-1 x+1 y+1 x-1 
            for (j = 0; j < 4; j++) {
                var _tempCurrentLocal = cloneObject(_currentLocal);
                var _quadrant;
                if (j % 2 == 0) {
                    _quadrant = "localY";
                } else {
                    _quadrant = "localX";
                }

                var _quadrantValue = (_clockwise[j] * i) + _currentLocal[_quadrant];

                _tempCurrentLocal[_quadrant] = _quadrantValue;
                if (_quadrantValue >= 0 && _blockOff[j] && _tempCurrentLocal.localY < arrMap.length) {

                    if (_tempCurrentLocal.localX < arrMap[_tempCurrentLocal.localY].length && arrMap[_tempCurrentLocal.localY][_tempCurrentLocal.localX].visible == true) {

                        var _tempTarget = arrMap[_tempCurrentLocal.localY][_tempCurrentLocal.localX];
                        var _lastGroup;
                        var _lastRoomId;

                        if (i == _minRange || (_minRange == 0 && i == 1)) { //先處理I>0的狀況，定位紀錄原始地點
                            _lastGroup = _mapGroupRecord[0][0];
                            _lastRoomId = _passgeRecord[0][0];
                        } else {
                            _lastGroup = _mapGroupRecord[i - 1][j];
                            _lastRoomId = _passgeRecord[i - 1][j];

                        }


                        _tempPassage.push(_tempTarget.room_id);
                        _tempArray.push(_tempTarget.group);
                        if (_tempTarget.passage.indexOf(_lastRoomId) > -1) {


                            _arrReturn.push(_tempTarget);


                            if (_tempTarget.group != _lastGroup) {
                                _blockOff[j] = false;
                            }

                        } else {
                            _blockOff[j] = false;
                        }

                    } else {
                        _blockOff[j] = false;
                        _tempArray.push(false);
                        _tempPassage.push(false);
                    }

                } else {
                    _blockOff[j] = false;
                    _tempArray.push(false);
                    _tempPassage.push(false);
                }
            }
        }

        if (i != 0) {
            _mapGroupRecord.push(_tempArray);
            _passgeRecord.push(_tempPassage);
        }
    }

    return _arrReturn;
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
