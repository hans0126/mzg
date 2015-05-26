/**/
function attack() {
    closeAttackBtn();
    var _range = false; //判斷是否為遠程武器 //跟攻擊模式有關    
    //current local
    var _currentLocal = currentRole.local; //腳色目前所在位置
    var _weaponObj = arrItems[this.weaponId]; //武器
    console.log(_weaponObj);
    var _minRange = _weaponObj.minRange; //最小射程
    var _maxRange = _weaponObj.maxRange; //最大射程:起始值

    var _attackCounter = 0;
    var _activeRole = [];
    var _successRange = _weaponObj.successRange; //攻擊成功參數:起始值
    var _numberOfAttack = _weaponObj.numberOfAttack; //攻擊次數
    var _attackArea = [];
    var _activeRooms = [];


    //初始range
    if (_weaponObj.attackType == "range") {
        _range = true;
    }
    //處理skill    
    if (currentRole.skill.length > 0) {
        //combat traget
        _numberOfAttack += _getSkillValue("combatTarget");
        _successRange -= _getSkillValue("combatSuccessRange");

        if (!_range) {
            _numberOfAttack += _getSkillValue("meleeTarget");
            _successRange -= _getSkillValue("meleeSuccessRange");
        } else {
            _numberOfAttack += _getSkillValue("rangeTarget");
            _successRange -= _getSkillValue("rangeSuccessRange");
            _maxRange += _getSkillValue("rangeDistance");
        }
    }

    if (_range) {
        if (currentRole.skill.indexOf(parseInt(70)) > -1) {
            _range = false;

        }
    }



    if (_weaponObj.dual) {
        if (currentRole.equip.main[0] == currentRole.equip.main[1]) {
            _numberOfAttack = _numberOfAttack * 2;
            console.log('dual weapons');
        }
    }

    //get Range
    _activeRooms = getPanorama(_currentLocal.room_id, _minRange, _maxRange);
    console.log(_activeRooms);

    if (_range) {
        for (var i = 0; i < _activeRooms.length; i++) {
            attackButtom.push(_createAttackArea(_activeRooms[i]));
        }
    } else {
        for (var i = 0; i < _activeRooms.length; i++) {
            _showSingleTarget(_activeRooms[i]);
        }
    }

    function _createAttackArea(_roomObj) {
        var _tg = new PIXI.Graphics();
        _tg.beginFill(0xFFFFFF);
        _tg.alpha = 0.7;
        _tg.interactive = true;
        _tg.buttonMode = true;
        _tg.on('mousedown', _randomAttack);
        _tg.local = _roomObj;


        _tg.drawRect((_roomObj.localX * blockWidth) + 10, (_roomObj.localY * blockHeight) + 10, blockWidth - 20, blockHeight - 20);
        actionUiLayer.addChild(_tg);
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
        for (var i = 0; i < enemyLayer.children.length; i++) {
            if (enemyLayer.children[i].local == this.local && enemyLayer.children[i] != currentRole) {
                _arrTemp.push(enemyLayer.children[i]);
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
            for (var j = 0; j < enemyLayer.children.length; j++) {
                if (_arrRemoveTemp[i] == enemyLayer.children[j]) {
                    enemyLayer.children.splice(j, 1);
                    break;
                }
            }
        }
        //清除陣列
        _attackEnd(_range);
    }

    /*單體攻擊目標露出*/
    function _showSingleTarget(_roomObj) {

        for (var i = 0; i < enemyLayer.children.length; i++) {
            if (enemyLayer.children[i].local == _roomObj) {

                enemyLayer.children[i].interactive = true;
                enemyLayer.children[i].buttonMode = true;

                enemyLayer.children[i].on("mousedown", _attackClick);
                enemyLayer.children[i].tint = 0xFFF000;
                _activeRole.push(enemyLayer.children[i]);
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

            for (var i = 0; i < enemyLayer.children.length; i++) {
                if (enemyLayer.children[i].objectName == this.objectName) {
                    enemyLayer.children.splice(i, 1);
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
        currentRole.actionPoint--;
        currentRole.interactive = true;
        checkActionPoint();

    }

    function _attackRoll() {
        return Math.floor(Math.random() * 6) + 1;
    }

    //讀取技能參數

    function _getSkillValue(_skillType) {
        var _arrSkillType = new Array();
        var _returnValue = 0;
        _arrSkillType["combatTarget"] = [0, 9];
        _arrSkillType["combatSuccessRange"] = [10, 19];
        _arrSkillType["meleeTarget"] = [20, 29];
        _arrSkillType["meleeSuccessRange"] = [30, 39];
        _arrSkillType["rangeTarget"] = [40, 49];
        _arrSkillType["rangeSuccessRange"] = [50, 59];
        _arrSkillType["rangeDistance"] = [60, 69];

        for (var i = _arrSkillType[_skillType][0]; i < _arrSkillType[_skillType][1] + 1; i++) {

            if (currentRole.skill.indexOf(parseInt(i)) > -1) {
                _returnValue += arrSkills[i].value;
                console.log(arrSkills[i] + "/" + i);
            }

        }
        return _returnValue;
    }

}
