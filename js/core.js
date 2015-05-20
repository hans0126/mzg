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


/* 隨機位置不重疊 */

function locationCheck(target, targetGroup, roomLocal) {

    for (var i = 0; i < targetGroup.length; i++) {
        if (target.local == targetGroup[i].local && target.objectName != targetGroup[i].objectName) {
            if (hitTest(target, targetGroup[i])) {

                target.x = randomDeploy(roomLocal.x, blockHeight);
                target.y = randomDeploy(roomLocal.y, blockHeight);

                locationCheck(target, targetGroup, roomLocal);
                break;
            }
        }
    }
}


/* random depoly to room */

function getRandomRoom(roomCount) {

    var randomCount = Math.floor(Math.random() * roomCount);

    var count = 0;
    var room_id;
    for (var i = 0; i < arrMap.length; i++) {
        for (var j = 0; j < arrMap[i].length; j++) {


            if (randomCount == count) {

                if (arrMap[i][j].visible == true) {
                    room_id = arrMap[i][j].room_id;
                } else {
                    room_id = getRandomRoom(roomCount);
                }
            }

            count++;
        }
    }

    return room_id;


}




/* get room local */

function getRoomLocal(room_id) {
    var getRoom = false;
    var returnObj = {};

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

/*隨機
    level:倍數 
    space:寬
    
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

function updateAttribute(arrGraphic, condition, attribute) {

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


/*產生角色*/

function createRole() {
    this._roleLocal;
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

        var _roomLocal = getRoomLocal(this._roleLocal);

        _role.x = randomDeploy(_roomLocal.x, blockWidth);
        _role.y = randomDeploy(_roomLocal.y, blockHeight);

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
        locationCheck(_role, arrRoleObj, getRoomLocal(this._roleLocal));
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

    currentRoomDoorActive(this.local);
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
    var targetRoom = false;
    for (var i = 0; i < this.passage.length; i++) {
        if (this.passage[i] != currentRole.local) {
            targetRoom = this.passage[i];
            break;
        }
    }

    if (targetRoom) {
        //search room location
        var roomLocal = getRoomLocal(targetRoom);

        currentRole.goalX = randomDeploy(roomLocal.x, blockWidth);
        currentRole.goalY = randomDeploy(roomLocal.y, blockWidth);
        currentRole.local = targetRoom;
        currentRole.actionMovement = true;
        //locationCheck(currentRole, arrRoleObj, roomLocal);

        updateAttribute(arrDoorsDisplayObj, null, {
            interactive: false,
            tint: 0x666666,
            buttonMode: false
        });

        currentRoomDoorActive(targetRoom);


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



function enemyMove() {
    var _canMovePlay = new Array();
    var _canMoveTargetRoom = new Array();
    var _player = updateAttribute(arrRoleObj, {
        faction: "player"
    });

    if (_player.length > 0) {
        _player = _player[0];
    }

    var _playerLocal = _player.local;

    for (var y = 0; y < arrMap.length; y++) {
        for (var x = 0; x < arrMap[y].length; x++) {

            var _roomId = arrMap[y][x].room_id;
            var _resultPaths;
            var _targetRoom;
            var _newRoomLocal;
            var _enemyCount = updateAttribute(arrRoleObj, {
                faction: "enemy",
                local: _roomId
            });

            console.log(_roomId + "->" + _enemyCount.length);

            if (_enemyCount.length > 0 && _playerLocal != _roomId) {
                _resultPaths = findPath(_playerLocal, _roomId);
                //array sort
                _resultPaths.sort(function(a, b) {
                    return a.length - b.length;
                })

                if (_resultPaths.length > 0) {
                    _targetRoom = _resultPaths[0][1];
                    _newRoomLocal = getRoomLocal(_targetRoom);

                    console.log("curremt:" + _roomId);
                    console.log("target:" + _targetRoom);
                    console.log(_newRoomLocal.x + "/" + _newRoomLocal.y);
                    for (var i = 0; i < _enemyCount.length; i++) {
                        _enemyCount[i].goalX = Math.floor(randomDeploy(_newRoomLocal.x, blockWidth));
                        _enemyCount[i].goalY = Math.floor(randomDeploy(_newRoomLocal.y, blockHeight));

                        _canMovePlay.push(_enemyCount[i]);
                        _canMoveTargetRoom.push(_targetRoom);
                    }

                }
            }

            console.log("--------------");

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

result: array[room id]
*/
function findEnemyByEyes(_currentRoomId, _roomGroup, _history) {

    var _currentRoom;

    if (typeof(_history) == "undefined") {
        _history = new Array();
    }

    _history.push(_currentRoomId);

    //目視十字
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

        var _temp = updateAttribute(arrRoleObj, {
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

/*
找尋全地圖噪音最大的點(暫)


*/


function findEnemyByNoise() {
    var _tempMap = new Array();

    for (var y = 0; y < arrMap.length; y++) {
        for (var x = 0; x < arrMap[y].length; x++) {
            /*查看該地圖是否有活人*/
            if (arrMap[y][x].visible == true) {
                var _mens = updateAttribute(arrRoleObj, {
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
    return  _tempMap.sort(function(a, b) {
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
