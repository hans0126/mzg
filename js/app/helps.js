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


/*
--物件按鈕模式的啟用--
arrGraphic 物件陣列
condition 條件式 物件
status 變更狀態 interactiveSwitch
*/

function objectHelp(_arrGraphic, _condition, _attribute) {

    var returnObj = new Array();

    if (typeof(_arrGraphic) != "object") {
        return false;
    }


    for (var i = 0; i < _arrGraphic.length; i++) {

        var _currentMatch = true;

        if (typeof(_condition) != "undefined" || _condition != null) {
            for (var _key in _condition) {
                if (_arrGraphic[i][_key] != _condition[_key]) {
                    _currentMatch = false;
                    break;
                }
            }
        }

        if (_currentMatch) {

            if (typeof(_attribute) != "undefined") {

                for (var _key in _attribute) {

                    _arrGraphic[i][_key] = _attribute[_key];
                }
            }

            returnObj.push(_arrGraphic[i]);
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


/*將畫面目標移動到中心點*/
function moveToTarget(_tx, _ty) {

    var _x = (displayWidth / 2) - mapLayer.x - _tx;
    var _y = (displayHeight / 2) - mapLayer.y - _ty

    var tween = new TweenMax(gameStage, 0.5, {
        x: _x,
        y: _y
    });
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


function removeAttackRangeArea() {

    for (var i = 0; i < attackButtom.length; i++) {
        attackButtom[i].clear();
    }

    attackButtom = [];
}


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



/*產生地圖*/








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



/* requestAnimFrame */
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
