define(['findpath'],function(findpath) {
    /**/
    function _attack() {
        closeAttackBtn();
        currentRole.actionPoint--;
        updateAp(currentRole.actionPoint);
        var _range = false; //判斷是否為遠程武器 //跟攻擊模式有關    
        //current local
        var _currentLocal = currentRole.local; //腳色目前所在位置
        var _weaponObj = arrItems[this.weaponId]; //武器

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
            if (currentRole.equip[0][0] == currentRole.equip[0][1]) {
                _numberOfAttack = _numberOfAttack * 2;
                console.log('dual weapons');
            }
        }

        //get Range
        _activeRooms = findpath.getPanorama(_currentLocal.room_id, _minRange, _maxRange);


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
            _tg.btnClass = "attackArea";
            _tg.alpha = 0.5;
            _tg.myId = Math.floor(Math.random() * 1000) + "_" + Math.floor(Math.random() * 1000);

            var _x = (_roomObj.localX * blockWidth) + 10;
            var _y = (_roomObj.localY * blockHeight) + 10;

            _tg.drawRect(0, 0, blockWidth - 20, blockHeight - 20);

            _tg.x = (_currentLocal.localX * blockWidth);
            _tg.y = (_currentLocal.localY * blockHeight);

            var tween = new TweenMax(_tg, 0.3, {
                x: _x,
                y: _y,
                alpha: 0.5,
                onComplete: function() {
                    var _target = this.target;
                    for (var j = 0; j < actionUiLayer.children.length; j++) {
                        if (actionUiLayer.children[j].myId == _target.myId) {
                            actionUiLayer.children[j].interactive = true;
                        }
                    }

                }
            });
            actionUiLayer.addChild(_tg);

            return _tg;
        }

        /*範圍內亂數攻擊目標*/
        function _randomAttack() {
            var _arrTemp = []; //此房間的敵人
            var _arrRemoveTemp = []; //被殺死的敵人
            var _arrAttackResult = []; //攻擊結果
            var _attackCount = 0; //算攻擊次數
            var _anime = [];

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

                    var _textObj = new PIXI.Text('', {
                        font: '20px Arial',
                        fill: 0x000000
                    });

                    _textObj.myId = Math.floor(Math.random() * 1000) + "_" + Math.floor(Math.random() * 1000);




                    if (_arrAttackResult[_attackCount]) {
                        console.log(_weaponObj.name + " 對 " + _arrTemp[i].objectName + " 攻擊成功");
                        _success = true;
                        _textObj.text = "KILL";
                        _arrRemoveTemp.push(_arrTemp[i]);






                    } else {
                        console.log(_weaponObj.name + " 對 " + _arrTemp[i].objectName + " 攻擊失誤");
                        _textObj.text = "MISS";

                    }

                    actionUiLayer.addChild(_textObj);
                    _textObj.x = _arrTemp[i].x - _textObj.width / 2;
                    _textObj.y = _arrTemp[i].y - _textObj.height / 2;
                    _textObj.alpha = 0;
                    /*  new TweenMax(_textObj, 0.3, {
                          y: _textObj.y - 30,
                          alpha: 0,
                          delay: (_attackCount * 0.3)

                      })*/

                    var _ani = new TimelineLite().to(_textObj, 0.2, {
                        y: _textObj.y - 30,
                        alpha: 1,
                        delay: (_attackCount * 0.3)
                    }).to(_textObj, 0.1, {
                        alpha: 0,
                        onComplete: function(_obj, _obj2) {

                            for (var i = 0; i < actionUiLayer.children.length; i++) {
                                if (actionUiLayer.children[i].myId == _obj.target.myId) {
                                    actionUiLayer.children.splice(i, 1);
                                }
                            }

                            // 判斷所有動畫都撥完畢之後再刪除物件
                            var _allComplete = false;
                            for (var i = 0; i < _obj2.length; i++) {

                                if (_obj2[i].progress() != 1) {
                                    _allComplete = false;
                                    break;
                                } else {
                                    _allComplete = true;
                                }
                            }

                            //console.log(_obj2);

                            if (_allComplete) {
                                for (var i = 0; i < _arrRemoveTemp.length; i++) {
                                    _arrRemoveTemp[i].clear();
                                    for (var j = 0; j < enemyLayer.children.length; j++) {
                                        if (_arrRemoveTemp[i] == enemyLayer.children[j]) {
                                            enemyLayer.children.splice(j, 1);
                                            break;
                                        }
                                    }
                                }
                            }


                        },
                        onCompleteParams: ["{self}", _anime]
                    });

                    _anime.push(_ani);


                    _attackCount++;

                    if (_success) {
                        break;
                    }
                }
            }


            //清除陣列
            _attackEnd(_range);
            /*
                    var tween = new TweenMax(this, 0.5, {
                        alpha: 0,
                        ease: RoughEase.ease.config({
                            points: 10,
                            randomize: false
                        }),
                        onComplete: function() {
                         

                        }
                    });

            */

            for (var i = 0; i < actionUiLayer.children.length; i++) {
                if (actionUiLayer.children[i].btnClass == "attackArea") {
                    if (actionUiLayer.children[i].myId == this.myId) {
                        var tween = new TweenMax(actionUiLayer.children[i], 0.6, {
                            alpha: 0,
                            ease: RoughEase.ease.config({
                                points: 10,
                                randomize: false
                            }),
                            onComplete: _tweenComplete,
                            onCompleteParams: ["{self}"]
                        });
                    } else {

                        var tween = new TweenMax(actionUiLayer.children[i], 0.2, {
                            alpha: 0,
                            x: (_currentLocal.localX * blockWidth) + 10,
                            y: (_currentLocal.localY * blockWidth) + 10,
                            onComplete: _tweenComplete,
                            onCompleteParams: ["{self}"]
                        });
                    }
                }
            }

            function _tweenComplete(obj) {
                console.log(obj);
                var _target = obj.target;

                for (var j = 0; j < actionUiLayer.children.length; j++) {
                    if (actionUiLayer.children[j].myId == _target.myId) {
                        actionUiLayer.children.splice(j, 1);
                    }
                }
            }




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
            //
            var _textObj = new PIXI.Text('', {
                font: '20px Arial',
                fill: 0x000000
            });

            _textObj.myId = Math.floor(Math.random() * 1000) + "_" + Math.floor(Math.random() * 1000);

            //計算攻擊
            if (_attackRoll() >= _successRange) {
                console.log(_weaponObj.name + " 對 " + this.objectName + " 攻擊成功");
                this.clear();
                _textObj.text = "KILL";

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
                _textObj.text = "MISS";
                console.log(_weaponObj.name + " 對 " + this.objectName + " 攻擊失誤");
            }

            actionUiLayer.addChild(_textObj);
            _textObj.x = this.x - _textObj.width / 2;
            _textObj.y = this.y - _textObj.height / 2;

            new TweenMax(_textObj, 0.5, {
                y: _textObj.y - 30,
                alpha: 0,
                onComplete: function(_obj) {

                    for (var i = 0; i < actionUiLayer.children.length; i++) {
                        if (actionUiLayer.children[i].myId == _obj.target.myId) {
                            actionUiLayer.children.splice(i, 1);
                        }
                    }

                },
                onCompleteParams: ["{self}"]
            })

            if (_attackCounter == 0 || _activeRole.length <= 0) {
                _attackEnd(_range);
            }
            //this.off("mousedown", testaaa);

        }

        function _attackEnd(attackType) {

            if (attackType) { //is range true
                /*  for (var i = 0; i < attackButtom.length; i++) {
                      attackButtom[i].clear();
                  }

                  attackButtom = [];*/

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

            currentRole.interactive = true;
            checkActionPoint();

        }

        function _attackRoll() {
            return Math.floor(Math.random() * 6) + 1;
        }

        //讀取技能參數

        function _getSkillValue(_skillType) {

            var _returnValue = 0;


            for (var i = arrSkillType[_skillType][0]; i < arrSkillType[_skillType][1] + 1; i++) {

                if (currentRole.skill.indexOf(parseInt(i)) > -1) {
                    returnValue += arrSkills[i].value;
                    console.log(arrSkills[i] + "/" + i);
                }

            }
            return _returnValue;
        }

    }

    return {
    	attack:_attack
    }

})
