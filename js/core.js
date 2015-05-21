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

/*clone Object*/

function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }

    return temp;
}


/* 碰撞測試 */

function hitTest(r1, r2) {

    if (r1.x + r1.width > r2.x &&
        r1.y + r1.height > r2.y &&
        r1.x < r2.x + r2.width &&
        r1.y < r2.y + r2.height) {
        return true;
    } else {
        return false;
    }
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




/* get room local */
/*
function getRoomObject(room_id) {
    var _getRoom = false;
    var _returnObj ;

    for (var y = 0; y < arrMap.length; y++) {

        for (var x = 0; x < arrMap[y].length; x++) {
            if (arrMap[y][x].room_id == room_id) {
                getRoom = true;
                returnObj = {
                    x: x,
                    y: y
                };
                break;
            }
        }

        if (getRoom) {
            break;
        }
    }

    return returnObj;

}
*/
/*隨機
    level:倍數 
    space:寬

    return num
    
*/

function randomDeploy(level, space) {
    return (Math.random() * (space - 30) + 15) + (space * level);
}


/*
--物件按鈕模式的啟用--
arrGraphic 物件陣列
condition 條件式 物件
status 變更狀態 interactiveSwitch
*/

function objectHelp(arrGraphic, condition, attribute) {

        var returnObj = new Array();

        if (status == "undefined") {
            status = true;
        }


        if (typeof(arrGraphic) != "object") {
            return false;
        }

        for (var i = 0; i < arrGraphic.length; i++) {

            var currentMatch = true;

            if (condition != "undefined" || condition != null) {
                for (var key in condition) {
                    if (arrGraphic[i][key] != condition[key]) {
                        currentMatch = false;
                        break;
                    }
                }
            }

            if (currentMatch) {
                for (var key in attribute) {
                    arrGraphic[i][key] = attribute[key];
                }

                returnObj.push(arrGraphic[i]);
            }
        }

        return returnObj;
    }
    //二維
function getMapInfo(_arrMap, _condition) {

    var _returnObj = new Array();

    if (status == "undefined") {
        status = true;
    }


    if (typeof(_arrMap) != "object") {
        return false;
    }

    for (var y = 0; y < _arrMap.length; y++) {
        for (var x = 0; x < _arrMap[y].length; x++) {
            var currentMatch = true;

            if (_condition != "undefined" || _condition != null) {
                for (var key in _condition) {
                    if (_arrMap[y][x][key] != _condition[key]) {
                        currentMatch = false;
                        break;
                    }
                }
            }

            if (currentMatch) {

                _returnObj.push(_arrMap[y][x]);
            }
        }
    }

    return _returnObj;
}

function getRoomPassage(_roomId) {
    var _returnPassage = new Array();
    for (var i = 0; i < arrDoorsDisplayObj.length; i++) {
        var _thisPassageIndex = arrDoorsDisplayObj[i].passage.indexOf(_roomId)
        if (_thisPassageIndex > -1) {
            if (arrDoorsDisplayObj[i].open == true) {
                if (_thisPassageIndex == 0) {
                    _thisPassageIndex = 1;
                } else {
                    _thisPassageIndex = 0;
                }

                _returnPassage.push(arrDoorsDisplayObj[i].passage[_thisPassageIndex]);

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





/*座標推房間ID*/

function localToRoom(lx, ly) {
    var _room;
    var _match = false;
    for (var y = 0; y < arrMap.length; y++) {
        for (var x = 0; x < arrMap[y].length; x++) {
            if (ly == y && lx == x) {
                _room = arrMap[y][x];
                _match = true;
                break;
            }
        }

        if (_match) {
            break;
        }
    }

    return _room;
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

        arrRoleObj.push(_role);
        locationCheck(_role, arrRoleObj, this._roleLocal);
        mapContainer.addChild(_role);

        return _role;
    }
}

/*產生地圖*/
function createMap() {

    mapContainer.interactive = true;
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
                mapContainer.addChild(_tilingSprite);
                arrMap[y][x].localX = x;
                arrMap[y][x].localY = y;
                arrMap[y][x].noise = 0;

                //房間文字
                var _textObj = new PIXI.Text(arrMap[y][x].room_id);
                _textObj.x = x * blockWidth + 5;
                _textObj.y = y * blockHeight + 5;
                mapContainer.addChild(_textObj);

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
                        arrDoorsDisplayObj.push(_doorGraphics);
                        mapContainer.addChild(_doorGraphics);
                    }
                }
            }
        }
    }
    //z-index排序
    mapContainer.updateLayersOrder = function() {
        mapContainer.children.sort(function(a, b) {
            a.zIndex = a.zIndex || 0;
            b.zIndex = b.zIndex || 0;
            return b.zIndex - a.zIndex
        });
    };

    mapContainer.updateLayersOrder();

}


/*角色被選取時*/
function roleClick(event) {
    //console.log(this.objectName);
    this.tint = 0xFF0000;

    currentRoomDoorActive(this.local.room_id);
    currentRole = this;


    $('#name').html(this.objectName);
    var strEquip = "<ul>";
    for (var i = 0; i < this.equip.main.length; i++) {
        strEquip += "<li item_id='" + this.equip.main[i] + "' item_category='" + arrItems[this.equip.main[i]].category + "'>" + arrItems[this.equip.main[i]].name + "</li>";
    }

    strEquip += "</ul>";

    $('#equip').html(strEquip).find('li').on('click', choseWeapon);

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

        currentRole.goalX = randomDeploy(_roomLocal.localX, blockWidth);
        currentRole.goalY = randomDeploy(_roomLocal.localY, blockWidth);
        currentRole.local = _roomLocal;
        currentRole.actionMovement = true;
        //locationCheck(currentRole, arrRoleObj, roomLocal);

        objectHelp(arrDoorsDisplayObj, null, {
            interactive: false,
            tint: 0x666666,
            buttonMode: false
        });

        currentRoomDoorActive(_targetRoomId);


    }

    //this.beginFill(0xFF0000);

    //this.tint = 0xFF0000;
}

/*被選取的腳色，啟用當下房間的門*/
function currentRoomDoorActive(room_id) {
    for (var i = 0; i < arrDoorsDisplayObj.length; i++) {

        if (arrDoorsDisplayObj[i].passage.indexOf(room_id) > -1) {
            arrDoorsDisplayObj[i].interactive = true;
            arrDoorsDisplayObj[i].buttonMode = true;
            arrDoorsDisplayObj[i].tint = 0x00FF00;
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
    var _player = objectHelp(arrRoleObj, {
        faction: "player"
    });

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
            var _enemyCount = objectHelp(arrRoleObj, {
                faction: "enemy",
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
        _canMovePlay[i].actionMovement = true;
    }
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
    for (var i = 0; i < arrDoorsDisplayObj.length; i++) {
        var _indexOf = arrDoorsDisplayObj[i].passage.indexOf(_currentLocalId);
        if (_indexOf > -1 && arrDoorsDisplayObj[i].open == true) {
            if (_indexOf == 0) {
                _indexOf = 1;
            } else {
                _indexOf = 0;
            }

            _thisRoomDoors.push(arrDoorsDisplayObj[i].passage[_indexOf]);
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

/*未完成XD~*/
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
            _arrReturn.push(_currentRoomId);
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
                        var lastGroup;
                        var lastRoomId;

                        if (i == _minRange) { //先處理I>0的狀況，定位紀錄原始地點
                            lastGroup = _mapGroupRecord[0][0];
                            lastRoomId = _passgeRecord;
                        } else {
                            if (i == _minRange + 1) {
                                lastGroup = _mapGroupRecord[0][0];
                                lastRoomId = _passgeRecord;
                            } else {
                                lastGroup = _mapGroupRecord[i - 1][j];
                                lastRoomId = _passgeRecord[i - 1][j];
                            }
                        }

                        //取得passage
                        console.log(lastRoomId+"/"+_tempTarget.room_id);

                        var _thisPassage = [];
                   
                        //比對group
                        console.log(_thisPassage.length);


                        console.log(_tempTarget.room_id);

                        console.log(lastRoomId);
                        console.log("-+-");

                        if (_thisPassage.length > 0) {
                            console.log("A");
                            _tempArray.push(_tempTarget.group);
                            _arrReturn.push(_tempTarget.room_id);
                            _tempPassage.push(_tempTarget.room_id);

                        } else {

                            _blockOff[j] = false;
                            _tempArray.push(false);
                            _tempPassage.push(false);
                        }

                        //if (_thisPassage.indexOf(_tempTarget.room_id) > -1 || _tempTarget.group == lastGroup || _tempTarget.group != lastGroup) {

                        /* if (_thisPassage.indexOf(lastRoomId) > -1) {
                            _tempArray.push(_tempTarget.group);
                            _arrReturn.push(_tempTarget.room_id);
                            _tempPassage.push(_tempTarget.room_id);

                            if (_tempTarget.group != lastGroup) {
                                _blockOff[j] = false;
                            }
                        } else {
                            _blockOff[j] = false;
                        }
*/

                        /*  } else {
                              _blockOff[j] = false;
                              _tempArray.push(false);
                          }*/
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



        if (i > _minRange) {
            _mapGroupRecord.push(_tempArray);
            _passgeRecord.push(_tempPassage);
        }
    }

    console.log(_arrReturn);
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


/*拖拉地圖*/

//stage.on('mousewheel',onWheel);

document.getElementById('gameView').addEventListener("mousewheel", onWheel, false);

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
    console.log(event);
    if (event.wheelDelta < 1) {
        mapContainer.scale.x -= 0.1;
        mapContainer.scale.y -= 0.1;
    } else {
        mapContainer.scale.x += 0.1;
        mapContainer.scale.y += 0.1;
    }
}


/* requestAnimFrame */
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
