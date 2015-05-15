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

        arrRoleObj.push(_role);
        locationCheck(_role, arrRoleObj, getRoomLocal(this._roleLocal));
        mapContainer.addChild(_role);

        return _role;
    }
}

/*產生地圖*/
function createMap() {

    var _graphics = new PIXI.Graphics();

    _graphics.beginFill(0xFF3300);

    _graphics.moveTo(0, 0);
    _graphics.lineStyle(1, 0x0000FF, 1);
    _graphics.beginFill(0xFF700B, 1);
    mapContainer.addChild(_graphics);
    mapContainer.interactive = true;
    /*
        產生地圖以及門
    */
    for (var y = 0; y < arrMap.length; y++) {
        for (var x = 0; x < arrMap[y].length; x++) {
            totalRoom++;
            if (arrMap[y][x].visible == true) {
                _graphics.drawRect(x * blockWidth, y * blockHeight, blockWidth, blockHeight);
                arrMap[y][x].localX = x;
                arrMap[y][x].localY = y;
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

                        arrDoorsDisplayObj.push(_doorGraphics);
                        mapContainer.addChild(_doorGraphics);
                    }
                }
            }
        }
    }
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

        currentRole.x = randomDeploy(roomLocal.x, blockWidth);
        currentRole.y = randomDeploy(roomLocal.y, blockWidth);
        currentRole.local = targetRoom;
        locationCheck(currentRole, arrRoleObj, roomLocal);

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

function init() {

    stage = new PIXI.Container();

    renderer = PIXI.autoDetectRenderer(displayWidth, displayHeight, {
        backgroundColor: 0x1099bb
    });

    document.getElementById("gameView").appendChild(renderer.view);

    //增加容器
    mapContainer = new PIXI.Container();
    createMap();
    /*
        var cR = new createRole();
        cR._roleTypeObj = arrRoleType[0];
        cR._faction = "enemy";
        for (var i = 0; i < 18; i++) {
            cR._roleLocal = null;
            cR.create();
        }


        cR._roleTypeObj = arrRoleType[1];
        cR._faction = "player";
        var newR = cR.create();

        newR.interactive = true;
        newR.buttonMode = true;

        newR.skill = [0, 10, 20, 30, 40, 50, 60, 70];
        newR.equip = {
            main: [0, 1],
            sub: []
        };



        newR.on('mousedown', roleClick);
    */
    //enemyMove();

    mapContainer.on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        // events for drag end
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        // events for drag move
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);

    animate();

    findPath("b", "g", null, new Array(), new Array(), new Array());
}




function enemyMove() {

    var _player = updateAttribute(arrRoleObj, {
        faction: "player"
    });

    if (_player.length > 0) {
        _player = _player[0];
    }

    var _playerLocal = getRoomLocal(_player);

    for (var y = 0; y < arrMap.length; y++) {
        for (var x = 0; x < arrMap[y].length; x++) {

            var _roomId = arrMap[y][x].room_id;

            var _enemyCount = updateAttribute(arrRoleObj, {
                faction: "enemy",
                local: _roomId
            });




            //找出這個房間的出口
            for (var i = 0; i < arrDoorsDisplayObj.length; i++) {
                var _indexOf = arrDoorsDisplayObj[i].passage.indexOf(_roomId);
                if (_indexOf > -1 && arrDoorsDisplayObj[i].open == true) {
                    if (_indexOf == 0) {
                        _indexOf = 1;
                    } else {
                        _indexOf = 0;
                    }
                    var _targetRoomId = arrDoorsDisplayObj[i].passage[_indexOf];

                    console.log(_roomId + "-->" + _targetRoomId);

                }
            }





        }

    }
}

function findPath(_targetLocalId, _currentLocalId, _lastLocalId, _arrPathRecord, _arrStamp, _doorMemory) {
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
    } else if (_thisRoomDoors.length == 0) {
        _arrStamp.push("-");
    }


    if (_thisRoomDoors.length > 0 && _arrPathRecord.indexOf(_thisRoomDoors[0]) < 0) {

        _getDoorTogo = _thisRoomDoors[0];
        _thisRoomDoors.splice(0, 1);

        _doorMemory.push(_thisRoomDoors);


        findPath(_targetLocalId, _getDoorTogo, _currentLocalId, _arrPathRecord, _arrStamp, _doorMemory);
    } else {
        _doorMemory.push(new Array());
        console.log("**");
        console.log(_arrPathRecord);
        console.log(_arrStamp);
        console.log("**");

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

                        findPath(_targetLocalId, _getDoorTogo, _arrPathRecord[i], _arrPathRecord, _arrStamp, _doorMemory);
                    }
                } else {

                }

            }
            _c++;
        }

    }

}

function iii() {
    var aa = ["h", "g", "d", "i", "f", "c", "b", "a", "j"];

    var map = ["r", 0, "-", 0, 0, "r", 0, "-", "-"];

    var result = [];

    var thisIndex = 0;
    var max = 0;
    for (var i = 0; i < map.length; i++) {
        if (map[i] == "-") {
            result.push(new Array());
            max++;
        }
    }





    for (var i = 0; i < aa.length; i++) {
        if (map[i] == "r") {
            for (var j = thisIndex; j < max; j++) {
                result[j].push(aa[i]);
            }
        }

        if (map[i] == 0) {
            for (var j = thisIndex; j < max; j++) {
                result[j].push(aa[i]);
            }
        }

        if (map[i] == "-") {
            result[thisIndex].push(aa[i]);
            thisIndex++;
        }


    }

    console.log(result);

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
