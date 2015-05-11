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
        }
    }
}

/**/
function attackRange(item_id) {

    //current local
    var _currentLocal = getRoomLocal(currentRole.local); //腳色目前所在位置
    var _weaponObj = item_id; //武器
    var _minRange = _weaponObj.minRange; //最小射程
    var _maxRange = _weaponObj.maxRange; //最大射程
    var _clockwise = [-1, 1, 1, -1]; //四方推演 順時針
    var _blockOff = [true, true, true, true]; //阻擋紀錄      

    for (var i = _minRange; i < _maxRange + 1; i++) {

        if (i < 1) {

            attackButtom.push(createAttackArea(_currentLocal.x, _currentLocal.y));

        } else {
            //4方擴展 clockwise y-1 x+1 y+1 x-1 
            for (j = 0; j < 4; j++) {
                var _tempCurrentLocal = cloneObject(_currentLocal);
                var _quadrant;
                if (j % 2 == 0) {
                    _quadrant = "y";
                } else {
                    _quadrant = "x";
                }

                var _quadrantValue = (_clockwise[j] * i) + _currentLocal[_quadrant];
                _tempCurrentLocal[_quadrant] = _quadrantValue;
                if (_quadrantValue >= 0) {
                    if (_blockOff[j]) {
                        if (_tempCurrentLocal.y < arrMap.length) {
                            if (_tempCurrentLocal.x < arrMap[_tempCurrentLocal.y].length) {
                                var _tempTarget = arrMap[_tempCurrentLocal.y][_tempCurrentLocal.x];
                                if (_tempTarget.visible == true) {
                                    var _targetLocal = getRoomLocal(_tempTarget.room_id);
                                    attackButtom.push(createAttackArea(_targetLocal.x, _targetLocal.y));
                                } else {
                                    _blockOff[j] = false;
                                }
                            }
                        }
                    }

                } else {
                    _blockOff[j] = false;
                }
            }
        }
    }


    function createAttackArea(_localX, _localY) {
        var _tg = new PIXI.Graphics();
        _tg.beginFill(0xFFFFFF);
        _tg.alpha = 0.7;
        _tg.interactive = true;
        _tg.on('mousedown', attackStart);
        _tg.local = localToRoom(_localX, _localY).room_id;
        container.addChild(_tg);

        _tg.drawRect((_localX * blockWidth) + 10, (_localY * blockHeight) + 10, blockWidth - 20, blockHeight - 20);

        return _tg;
    }

    /*攻擊開始*/
    function attackStart() {
    
        var _countRole = 0;    //該房間算出人數
        var _target = 0; 
        var _arrTemp = []; //此房間的敵人
        var _arrRemoveTemp = [];//被殺死的敵人
    
        for (var i = 0; i < arrRole.length; i++) {

            if (arrRole[i].local == this.local) {
                _countRole++;
                _arrTemp.push(i);
            }
        }
        /*需改變為，一次判定所有成功次數，再將傷害賦予敵人*/
        if (_countRole > _weaponObj.target) {
            _target = _weaponObj.target;
        } else {
            _target = _countRole;
        }

        for (var i = 0; i < _target; i++) {
            var _attackResult = Math.floor(Math.random() * 6);
            if (_attackResult >= _weaponObj.successRange) {
                console.log(_attackResult + "_攻擊成功");
                //_arrTemp[i].clear();
                container.removeChild(arrRole[_arrTemp[i]]);
                _arrRemoveTemp.push(_arrTemp[i]);
            } else {
                console.log(_attackResult + "_攻擊失敗");
            }
        }

        for(var i=0;i<_arrRemoveTemp.length;i++){
             arrRole.splice(_arrRemoveTemp[i],1);  
        }
       
        console.log(arrRole.length);

        //清除陣列


        removeAttackRangeArea();
    }

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


/* requestAnimFrame */
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
