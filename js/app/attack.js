define(['findpath','help'], function(findpath,help) { /**/


    function _attackEequence() {
        var _currentItem = arrItems[this.myItemId];

        if (_currentItem.category == "weapon") {
            _attack.call(_currentItem);
            disableAllRoomObj();

        } else {
            return false;
        }

    }


    function _attack() {

        currentRole.actionPoint--;
        // ui.updateAp(currentRole.actionPoint);
        var _range = false; //判斷是否為遠程武器 //跟攻擊模式有關    
        //current local
        var _currentLocal = currentRole.local; //腳色目前所在位置
        var _weaponObj = this; //武器

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

        //   _range = false;
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

        //雙持武器
        if (_weaponObj.dual) {
            if (currentRole.equip[0] == currentRole.equip[1]) {
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
            _tg.beginFill(0x3333FF);
            _tg.alpha = 0.7;
            _tg.buttonMode = true;
            _tg.on('mousedown', _randomAttack);
            _tg.local = _roomObj;
            _tg.btnClass = "attackArea";
            _tg.alpha = 0.5;

            var _x = (_roomObj.localX * blockWidth) + 10;
            var _y = (_roomObj.localY * blockHeight) + 10;

            _tg.drawRect(0, 0, blockWidth - 20, blockHeight - 20);

            _tg.x = (_currentLocal.localX * blockWidth);
            _tg.y = (_currentLocal.localY * blockHeight);

            new TweenMax(_tg, 0.3, {
                x: _x,
                y: _y,
                alpha: 0.5,
                onComplete: function(_self) {
                    var _target = _self.target;
                    _target.interactive = true;
                },
                onCompleteParams: ["{self}"]
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
            var _score = 0;

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
                    //display attack result
                    var _textObj = new desplayAttackText();

                    if (_arrAttackResult[_attackCount]) {
                        console.log(_weaponObj.name + " 對 " + _arrTemp[i].objectName + " 攻擊成功");
                        _success = true;
                        _textObj.setText = "KILL";
                        _score++;
                        _arrRemoveTemp.push(_arrTemp[i]);

                    } else {
                        console.log(_weaponObj.name + " 對 " + _arrTemp[i].objectName + " 攻擊失誤");
                        _textObj.setText = "MISS";
                    }

                    var _textObj = _textObj.create();
                    _textObj.alpha = 0;
                    actionUiLayer.addChild(_textObj);

                    _textObj.x = _arrTemp[i].x - _textObj.width / 2;
                    _textObj.y = _arrTemp[i].y - _textObj.height / 2;

                    var _ani = new TimelineMax().to(_textObj, 0.2, {
                        y: _textObj.y - 30,
                        alpha: 1,
                        delay: (_attackCount * 0.3),
                        onStart: function(_self) {
                            for (var i = 0; i < _arrRemoveTemp.length; i++) {
                                if (_arrRemoveTemp[i].myId == _self.myId) {
                                    shakeAnimation(_self);
                                    break;
                                }
                            }
                        },
                        onStartParams: [_arrTemp[i]]
                    }).to(_textObj, 0.1, {
                        alpha: 0,
                        onComplete: function(_obj, _obj2) {

                            actionUiLayer.removeChild(_obj.target);
                            // 判斷所有動畫都撥完畢之後再刪除物件

                            if (checkAllTweenComplete(_obj2)) {

                                console.log("A");
                                for (var i = 0; i < _arrRemoveTemp.length; i++) {
                                    for (var j = 0; j < enemyLayer.children.length; j++) {
                                        if (_arrRemoveTemp[i] == enemyLayer.children[j]) {
                                            // 淡出特效後移除
                                            _fadeOutRemoveObj(_arrRemoveTemp[i]);
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

            //  ui.updateScore(_score);
            //清除陣列
            _attackEnd(_range);
            // debugger;

            for (var i = 0; i < actionUiLayer.children.length; i++) {
                if (actionUiLayer.children[i].btnClass == "attackArea") {
                    if (actionUiLayer.children[i] == this) {
                        new TweenMax(actionUiLayer.children[i], 0.6, {
                            alpha: 0,
                            ease: RoughEase.ease.config({
                                points: 10,
                                randomize: false
                            }),
                            onComplete: _tweenComplete,
                            onCompleteParams: ["{self}"]
                        });
                    } else {
                        new TweenMax(actionUiLayer.children[i], 0.2, {
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
                var _target = obj.target;
                actionUiLayer.removeChild(_target);
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
            // $('#attack_count').html(_attackCounter);
            //
            var _textObj = new desplayAttackText().create();
            var _killedObj = null;
            var _score = 0;

            //判斷與目標的相對位置,並移動到目標旁
            if (_weaponObj.attackType == "melee") {
                var _np = moveToNearTarget(currentRole, this);
                var tween = new TweenMax(currentRole, 0.3, {
                    x: _np.x,
                    y: _np.y
                });
            }

            //  _textObj.myId = createRandomId();

            //計算攻擊
            if (_attackRoll() >= _successRange) {

                console.log(_weaponObj.name + " 對 " + this.objectName + " 攻擊成功");
                //
                _textObj.text = "KILL";

                _score++;

                this.interactive = false;

                _killedObj = this;

                for (var i = 0; i < _activeRole.length; i++) {
                    if (_activeRole[i] == this) {
                        _activeRole.splice(i, 1);
                    }
                }

            } else {
                _textObj.text = "MISS";
                console.log(_weaponObj.name + " 對 " + this.objectName + " 攻擊失誤");
            }

            actionUiLayer.addChild(_textObj);

            _textObj.x = this.x;
            _textObj.y = this.y - _textObj.height;

            new TweenMax(_textObj, 0.5, {
                y: _textObj.y - 30,
                alpha: 0,
                onStart: function(_self) {
                    _bladeAnime(_self.x, _self.y);
                    shakeAnimation(_self);
                },
                onStartParams: [this],
                onComplete: function(_obj, _removeObj) {
                    actionUiLayer.removeChild(_obj.target);
                    if (_removeObj) {
                        _fadeOutRemoveObj(_removeObj);
                    }

                    //  ui.updateScore(_score);
                },
                onCompleteParams: ["{self}", _killedObj]
            })

            console.log(_activeRole.length);

            if (_attackCounter == 0 || _activeRole.length <= 0) {
                _attackEnd(_range);
            }

        }

        function _attackEnd(attackType) {

            if (attackType) {

            } else {
                console.log("end");
                for (var i = 0; i < _activeRole.length; i++) {
                    _activeRole[i].interactive = false;
                    _activeRole[i].buttonMode = false;
                    _activeRole[i].off("mousedown", _attackClick);
                    _activeRole[i].tint = 0xFFFFFF;
                }
            }
            $('#attack_count').html(0);
            attackMode = false;

            currentRole.interactive = true;
            activeCurrentRoomObj(currentRole.local);
            help.checkActionPoint();


        }

        function _attackRoll() {
            return Math.floor(Math.random() * 6) + 1;
        }

        //讀取技能參數
        function _getSkillValue(_skillType) {

            var _returnValue = 0;
            for (var i = arrSkillType[_skillType][0]; i < arrSkillType[_skillType][1] + 1; i++) {

                if (currentRole.skill.indexOf(parseInt(i)) > -1) {
                    _returnValue += arrSkills[i].value;
                }
            }
            return _returnValue;
        }


        function _fadeOutRemoveObj(_obj) {
            new TweenMax(_obj, 0.3, {
                alpha: 0,
                onComplete: function() {

                    enemyLayer.removeChild(_obj);

                },
                onCompleteParams: [_obj]
            })
        }

        function _bladeAnime(_x, _y) {
            var _mc = new PIXI.extras.MovieClip(arrFrameManager['blade']);
            _mc.animationSpeed = 0.5;
            _mc.loop = false;
            _mc.x = _x;
            _mc.y = _y
            actionUiLayer.addChild(_mc);
            _mc.onComplete = function() {
                actionUiLayer.removeChild(this);
            }
            _mc.anchor.x = 0.5;
            _mc.anchor.y = 0.5;
            _mc.play();
        }

    }

    return {
        attackEequence: _attackEequence
    }

})
