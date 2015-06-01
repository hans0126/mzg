
/**/
function attackRange(weapon) {
    var _range = false;
    //current local
    var _currentLocal = getRoomLocal(currentRole.local); //腳色目前所在位置
    var _weaponObj = weapon; //武器
    var _minRange = _weaponObj.minRange; //最小射程
    var _maxRange = _weaponObj.maxRange; //最大射程
    var _clockwise = [-1, 1, 1, -1]; //四方推演 順時針
    var _blockOff = [true, true, true, true]; //阻擋紀錄   
    var _attackCounter = 0;
    var _activeRole = [];//攻擊範圍內的角色

    for (var i = _minRange; i < _maxRange + 1; i++) {

        if (i < 1) {
            if (_range) { //是否為範圍攻擊
                attackButtom.push(createAttackArea(_currentLocal.x, _currentLocal.y));
            } else {
                showSingleTarget(currentRole.local);
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
                if (_quadrantValue >= 0) {
                    if (_blockOff[j]) {
                        if (_tempCurrentLocal.y < arrMap.length) {
                            if (_tempCurrentLocal.x < arrMap[_tempCurrentLocal.y].length) {
                                var _tempTarget = arrMap[_tempCurrentLocal.y][_tempCurrentLocal.x];
                                if (_tempTarget.visible == true) {
                                    console.log("A");
                                    if (_range) { //是否為範圍攻擊
                                        var _targetLocal = getRoomLocal(_tempTarget.room_id);
                                        attackButtom.push(createAttackArea(_targetLocal.x, _targetLocal.y));
                                    }else{
                                        showSingleTarget(_tempTarget.room_id);
                                    }
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
        _tg.on('mousedown', randomAttack);
        _tg.local = localToRoom(_localX, _localY).room_id;
        container.addChild(_tg);

        _tg.drawRect((_localX * blockWidth) + 10, (_localY * blockHeight) + 10, blockWidth - 20, blockHeight - 20);

        return _tg;
    }

    /*範圍內亂數攻擊目標*/
    function randomAttack() {

        var _countRole = 0; //該房間算出人數
        var _target = 0;
        var _arrTemp = []; //此房間的敵人
        var _arrRemoveTemp = []; //被殺死的敵人
        var _arrAttackResult = [];
        var _attackCount = 0;
        var _attackEnd = false;

        //判斷攻擊次數以及成功
        for (var i = 0; i < _weaponObj.target; i++) {
            var _attackResult = Math.floor(Math.random() * 6);
            if (_attackResult >= _weaponObj.successRange) {
                _arrAttackResult.push(true);
            } else {
                _arrAttackResult.push(false);
            }
        }
        //該房間的敵人
        for (var i = 0; i < arrRole.length; i++) {
            if (arrRole[i].local == this.local) {
                _countRole++;
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
                    console.log(_weaponObj.name + " 對 " + _arrTemp[i].objectName + " 攻擊失敗");

                }

                _attackCount++;

                if (_success) {
                    break;
                }
            }
        }

        for (var i = 0; i < _arrRemoveTemp.length; i++) {
            _arrRemoveTemp[i].clear();
            arrRole.splice(_arrRemoveTemp[i], 1);
        }


        //清除陣列


        removeAttackRangeArea();
    }

    /*單體攻擊目標露出*/
    function showSingleTarget(room_id) {
        console.log(room_id);
        for (var i = 0; i < arrRole.length; i++) {
            if (arrRole[i].local == room_id && arrRole[i].faction == "enemy") {

                arrRole[i].interactive = true;
                arrRole[i].on("mousedown", attackClick);
                arrRole[i].tint = 0xFFF000;
                _activeRole.push(arrRole[i]);
            }

        }

        _attackCounter = _weaponObj.target;
        $('#attack_count').html(_attackCounter);

    }

    function attackClick() {

        _attackCounter--;;
        $('#attack_count').html(_attackCounter);

        //計算攻擊

        var _attackResult = Math.floor(Math.random() * 6);
        if (_attackResult >= _weaponObj.successRange) {
             console.log(_weaponObj.name + " 對 " + this.objectName + " 攻擊成功");
             this.clear();
            console.log(arrRole.length);
           for(var i=0;i<arrRole.length;i++){
                if(arrRole[i].objectName==this.objectName){
                    arrRole.splice(i,1);
                    break;
                }
           }
           console.log(arrRole.length);


        } else {
             console.log(_weaponObj.name + " 對 " + this.objectName + " 攻擊失敗");
        }

        if (_attackCounter == 0 || _activeRole.length <= 0) {
            showSingleEnd();
        }





        //this.off("mousedown", testaaa);

    }

    function showSingleEnd() {
        console.log("end");

        for (var i = 0; i < _activeRole.length; i++) {
            _activeRole[i].interactive = false;
            _activeRole[i].off("mousedown", attackClick);
            _activeRole[i].tint = arrRoleType[0].color;
        }



    }

}
