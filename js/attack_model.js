/**/
function attack(weapon) {
    var _range = false; //判斷是否為遠程武器
    //current local
    var _currentLocal = getRoomLocal(currentRole.local); //腳色目前所在位置
    var _weaponObj = weapon; //武器
    var _minRange = _weaponObj.minRange; //最小射程
    var _maxRange = _weaponObj.maxRange; //最大射程:起始值
    var _clockwise = [-1, 1, 1, -1]; //四方推演 順時針
    var _blockOff = [true, true, true, true]; //阻擋紀錄   
    var _attackCounter = 0;
    var _activeRole = [];
    var _successRange = _weaponObj.successRange;//攻擊成功參數:起始值
    var _numberOfAttack = _weaponObj.numberOfAttack;//攻擊次數

    if (_weaponObj.dual) {
        if (currentRole.equip.main[0] == currentRole.equip.main[1]) {
            _numberOfAttack = _numberOfAttack * 2;
            console.log('dual weapons');
        }
    }


    if (_weaponObj.attackType == "range") {        
        _range = true;
        if(currentRole.skill.indexOf(4)>-1){
            _range = false;
        }
    }


    for (var i = _minRange; i < _maxRange + 1; i++) {

        if (i < 1) {
            if (_range) { //是否為範圍攻擊
                attackButtom.push(_createAttackArea(_currentLocal.x, _currentLocal.y));
            } else {
                _showSingleTarget(currentRole.local);
            }

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
                if (_quadrantValue >= 0 && _blockOff[j]) {
                    if (_tempCurrentLocal.y < arrMap.length) {
                        if (_tempCurrentLocal.x < arrMap[_tempCurrentLocal.y].length) {
                            var _tempTarget = arrMap[_tempCurrentLocal.y][_tempCurrentLocal.x];
                            if (_tempTarget.visible == true) {

                                if (_range) { //是否為範圍攻擊
                                    var _targetLocal = getRoomLocal(_tempTarget.room_id);
                                    attackButtom.push(_createAttackArea(_targetLocal.x, _targetLocal.y));
                                } else {
                                    _showSingleTarget(_tempTarget.room_id);
                                }
                            } else {
                                _blockOff[j] = false;
                            }
                        }
                    }

                } else {
                    _blockOff[j] = false;
                }
            }
        }
    }


    function _createAttackArea(_localX, _localY) {
        var _tg = new PIXI.Graphics();
        _tg.beginFill(0xFFFFFF);
        _tg.alpha = 0.7;
        _tg.interactive = true;
        _tg.buttonMode = true;
        _tg.on('mousedown', _randomAttack);
        _tg.local = localToRoom(_localX, _localY).room_id;
        container.addChild(_tg);

        _tg.drawRect((_localX * blockWidth) + 10, (_localY * blockHeight) + 10, blockWidth - 20, blockHeight - 20);

        return _tg;
    }

    /*範圍內亂數攻擊目標*/
    function _randomAttack() {
        var _arrTemp = []; //此房間的敵人
        var _arrRemoveTemp = []; //被殺死的敵人
        var _arrAttackResult = []; //攻擊結果
        var _attackCount = 0; //算攻擊次數

        //判斷攻擊次數以及成功
        for (var i = 0; i < _numberOfAttack; i++) {

            if (_attackRoll() >= _successRange) {
                _arrAttackResult.push(true);
            } else {
                _arrAttackResult.push(false);
            }
        }
        //該房間的敵人
        for (var i = 0; i < arrRole.length; i++) {
            if (arrRole[i].local == this.local && arrRole[i] != currentRole) {

                _arrTemp.push(arrRole[i]);
            }
        }

        for (var i = 0; i < _arrTemp.length; i++) {

            while (_attackCount < _arrAttackResult.length) {

                var _success = false;

                if (_arrAttackResult[_attackCount]) {
                    console.log(_weaponObj.name + " 對 " + _arrTemp[i].objectName + " 攻擊成功");
                    _success = true;
                    _arrRemoveTemp.push(_arrTemp[i]);

                } else {
                    console.log(_weaponObj.name + " 對 " + _arrTemp[i].objectName + " 攻擊失誤");

                }

                _attackCount++;

                if (_success) {
                    break;
                }
            }
        }

        for (var i = 0; i < _arrRemoveTemp.length; i++) {
            _arrRemoveTemp[i].clear();
            for (var j = 0; j < arrRole.length; j++) {
                if (_arrRemoveTemp[i] == arrRole[j]) {
                    arrRole.splice(j, 1);
                    break;
                }
            }
        }
        //清除陣列
        _attackEnd(_range);
    }

    /*單體攻擊目標露出*/
    function _showSingleTarget(room_id) {

        for (var i = 0; i < arrRole.length; i++) {
            if (arrRole[i].local == room_id && arrRole[i].faction == "enemy") {

                arrRole[i].interactive = true;
                arrRole[i].buttonMode = true;
                

                arrRole[i].on("mousedown", _attackClick);
                arrRole[i].tint = 0xFFF000;
                _activeRole.push(arrRole[i]);
            }

        }

        _attackCounter = _numberOfAttack;
        $('#attack_count').html(_attackCounter);

    }

    function _attackClick() {

        _attackCounter--;;
        $('#attack_count').html(_attackCounter);

        //計算攻擊
        if (_attackRoll() >= _successRange) {
            console.log(_weaponObj.name + " 對 " + this.objectName + " 攻擊成功");
            this.clear();

            for (var i = 0; i < arrRole.length; i++) {
                if (arrRole[i].objectName == this.objectName) {
                    arrRole.splice(i, 1);
                    break;
                }
            }

            for (var i = 0; i < _activeRole.length; i++) {
                if (_activeRole[i].objectName == this.objectName) {
                    _activeRole.splice(i, 1);
                    break;
                }
            }

        } else {
            console.log(_weaponObj.name + " 對 " + this.objectName + " 攻擊失誤");
        }

        

        if (_attackCounter == 0 || _activeRole.length <= 0) {
            _attackEnd(_range);
        }
        //this.off("mousedown", testaaa);

    }

    function _attackEnd(attackType) {

        if (attackType) { //is range true
            for (var i = 0; i < attackButtom.length; i++) {
                attackButtom[i].clear();
            }

            attackButtom = [];

        } else {
            console.log("end");
            for (var i = 0; i < _activeRole.length; i++) {
                _activeRole[i].interactive = false;
                _activeRole[i].buttonMode = false;
                _activeRole[i].off("mousedown", _attackClick);
                _activeRole[i].tint = arrRoleType[0].color;
            }
        }
         $('#attack_count').html(0);
        attackMode = false;
    }

    function _attackRoll() {
        return Math.floor(Math.random() * 6) + 1;
    }


}
