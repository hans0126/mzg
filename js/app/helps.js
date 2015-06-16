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
        y: _y,
        roundProps: "x,y" //最後值為整數地圖才不會破格

    });
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
        currentRole.tint = 0x999999;
        //16777215
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
    return (Math.random() * (space - 45) + 15) + (space * level);
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



function getRoomPassage(_roomId) {
    var _returnPassage = [];
    var _returnRoom = [];
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

    for (var i = 0; i < _returnPassage.length; i++) {
        for (var y = 0; y < arrMap.length; y++) {
            var _match = false;
            for (var x = 0; x < arrMap[y].length; x++) {
                if(arrMap[y][x].room_id == _returnPassage[i]){
                    _match =true;
                    _returnRoom.push(arrMap[y][x]);
                    break;
                }
            }

            if(_match){
                break;
            }
        }
    }

    return _returnRoom;
}

/*取得目標相近座標*/

function moveToNearTarget(_current, _target) {
    var _dx = _target.x - _current.x;
    var _dy = _target.y - _current.y;

    if (Math.abs(_dx) > _target.width) {
        if (_dx > 0) {
            _dx = _target.x - _target.width;
        } else {
            _dx = _target.x + _target.width;
        }
    } else {
        _dx = _current.x;
    }

    if (Math.abs(_dy) > _target.height) {
        if (_dy > 0) {
            _dy = _target.y - _target.height;
        } else {
            _dy = _target.y + _target.height;
        }
    } else {
        _dy = _current.y;
    }

    return {
        x: _dx,
        y: _dy
    }
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


function findGameObjfromMouse(_x, _y, _gameObj) {

    var _match = false;

    if (_x > _gameObj.x &&
        _x < _gameObj.x + _gameObj.width &&
        _y > _gameObj.y &&
        _y < _gameObj.y + _gameObj.height) {

        _match = true;

    }

    return _match;

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

/*震動效果*/
function shakeAnimation(_obj) {
    new TweenMax.fromTo(_obj, 0.2, {
        x: _obj.x - 1
    }, {
        x: _obj.x,
        ease: RoughEase.ease.config({
            strength: 18,
            points: 20,
            template: Linear.easeNone,
            randomize: false
        }),
        clearProps: "x"
    })
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
