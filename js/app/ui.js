define(['enemy', 'ui_item','help'], function(enemy, ui_item,help) {

    function _createUiBtn() {

        var _mouseEvent = [enemy.enemyMove];
        var _btnName = ['End Turn'];
        var _tempHeight = 0;

        /*turn end*/
        for (var i = 0; i < _mouseEvent.length; i++) {
            var _textObj = new PIXI.Text(_btnName[i], {
                font: '30px Arial',
                fill: 0xff1010
            });
            _textObj.x = displayWidth - _textObj.width - 10;
            _textObj.y = displayHeight - _textObj.height - 10 - _tempHeight;
            _textObj.interactive = true;
            _textObj.buttonMode = true;
            _textObj.on("mousedown", _mouseEvent[i]);
            _textObj.mouseover = function() {
                this.style = {
                    fill: 0xffffff
                };
            }

            _textObj.mouseout = function() {
                this.style = {
                    fill: 0xff1010
                };
            }

            mainUiLayer.addChild(_textObj);

            if (i == 0) {
                _tempHeight = _textObj.height + 10;
            }
        }
    }



    function _createDisplayAp() {

        var _textObj = new PIXI.Text('AP:', {
            font: '50px Arial',
            fill: 0xff1010,
            dropShadow: true
        });

        _textObj.x = 10;
        _textObj.y = displayHeight - _textObj.height - 10;
        var _apWidth = _textObj.width + 10;
        mainUiLayer.addChild(_textObj);

        var _textObj = new PIXI.Text('0', {
            font: '100px Arial',
            fill: 0xff1010,
            dropShadow: true
        });

        _textObj.myId = "num";
        _textObj.x = _apWidth;
        _textObj.y = displayHeight - _textObj.height;
        mainUiLayer.addChild(_textObj);

    }


    function _updateAp(_num) {

        var _obj = objectHelp(mainUiLayer.children, {
            myId: "num"
        })[0];

        _obj.text = _num;
        _obj.alpha = 0.5;
        _obj.scale.x = 0.5;
        _obj.scale.y = 0.5;


        new TimelineLite().to(_obj.scale, 0.2, {
            x: 1,
            y: 1
        }).to(_obj, 0.2, {
            alpha: 1
        });

    }

    function _createRoleStatus() {

        for (var i = 0; i < appearPlayer.length; i++) {

            var _c = new PIXI.Container();
            var _spriteIcon = new PIXI.Sprite.fromFrame("icon_" + arrRoleType[appearPlayer[i]].name + ".png");
            var _textObj = new PIXI.extras.BitmapText("00", {
                font: "50px Crackhouse",
                tint: 0xFF0000
            });

            _c.addChild(_spriteIcon);
            mainUiLayer.addChild(_c);

            _c.x = 10;
            _c.y = (i * _spriteIcon.height + i * 15) + 10;

            _c.addChild(_textObj);
            _textObj.x = 140;
            _textObj.y = 30;

            _c.interactive = true;
            _c.buttonMode = true;

            arrLayerManager[arrRoleType[appearPlayer[i]].name + "_icon_btn"] = _c;

            _c.roleName = arrRoleType[appearPlayer[i]].name;

            _c.mouseover = function() {
                //this.children[0].tint = 0x999999;                
            }

            _c.on("mousedown", _moveToTargetRole);


        }

        function _moveToTargetRole() {
            moveToTarget(arrLayerManager[this.roleName + "_token"].x, arrLayerManager[this.roleName + "_token"].y);
            currentRole = arrLayerManager[this.roleName + "_token"];
            //console.log(currentRole);
            help.openAttackMenu.call(currentRole);
        }



    }

    function _updateScore(num) {
     
        var _currentValue = currentRole.score + num;
        currentRole.score = _currentValue;
        if (_currentValue < 10) {
            _currentValue = "0" + _currentValue;
        }

        arrLayerManager[currentRole.roleName + "_icon_btn"].children[1].text = _currentValue;
        console.log(_currentValue);

        /*判斷有沒有升級*/
        var _targetLevel;
        var _levelRange;
        var _currentLevel;


        for (var i = 0; i < levelRange.length; i++) {
            var _levelUp = false;
            if (i != levelRange.length - 1) {
                if (currentRole.score >= levelRange[i] && currentRole.score < levelRange[i + 1] && currentRole.level != i + 1) {
                    _levelUp = true;
                }
            } else {
                if (currentRole.score >= levelRange[i] && currentRole.level != i + 1) {
                    _levelUp = true;
                }
            }

            if (_levelUp) {
                _targetLevel = i + 1;
                break;
            }
        }

        if (_levelUp) {
            var _messageSequence = [];
            //深及幅度、有可能一次跳兩級
            _currentLevel = currentRole.level;
            _levelRange = _targetLevel - currentRole.level;

            for (var i = 0; i < _levelRange; i++) {
                _messageSequence.push(currentRole.skillTree[_currentLevel + i]);
            }

            currentRole.level = _targetLevel;

            _renderMsgBox(_messageSequence);

        }

        function _renderMsgBox(_sequence, idx) {
            if (typeof(idx) == "undefined") {
                idx = 0;
            }

            arrCommonObj['msgbox'].children = [];

            for (var i = 0; i < _messageSequence[idx].length; i++) {
                _skillId = _messageSequence[idx][i];

                var _textObj = new PIXI.Text(arrSkills[_skillId].name, {
                    fill: 0x000000,
                    font: '24px Arial'
                });

                _textObj.y = _textObj.height * i + 10 * i;

                _textObj.interactive = true;
                _textObj.buttonMode = true;

                _textObj.skillId = _skillId;

                _textObj.on('mousedown', _addSkillToRole)

                arrCommonObj['msgbox'].addChild(_textObj);

            }

            arrCommonObj['msgbox'].visible = true;

            function _addSkillToRole() {
                console.log(this.skillId);
                currentRole.skill.push(this.skillId);
                arrCommonObj['msgbox'].visible = false;
                idx++;
                if (idx < _sequence.length) {
                    _renderMsgBox(_sequence, idx);
                }
            }
        }
    }

    /*create message Box*/

    function _createMsgBox() {
        var _graphic = new PIXI.Graphics();
        _graphic.beginFill(0x99FFFF, 1);
        _graphic.lineStyle(2, 0x660000);
        _graphic.drawRect(0, 0, displayWidth / 2, displayHeight / 2);

        arrCommonObj['msgbox'] = _graphic;
        mainUiLayer.addChild(_graphic);

        _graphic.x = _graphic.width / 2;
        _graphic.y = _graphic.height / 2;

        _graphic.visible = false;
    }

    /*create status interface*/
    function _createStatus() {

        /*  _createItemStatusLayer();
          _createSkillStatusLayer();
          _createStatusCloseBtn();*/

        /*create bg*/

        var _bg = new PIXI.Sprite.fromFrame("item_bg.jpg");
        _bg.zIndex = 0;
        statusLayer.addChild(_bg);
        statusLayer.updateLayersOrder();
        statusLayer.y = displayHeight - statusLayer.height;
        //statusLayer.visible = true;

        statusLayer.positionMode = [displayHeight + 60, displayHeight - 75, displayHeight - 350];

        //create btn
        var _btnImg = ["cancel_btn", "backpack_btn", "drop_item_btn"];
        var _btnEvent = [help.closeMenu, help.openBackpack, help.dropMode];
        var _btnGroup = new PIXI.Container();

        for (var i = 0; i < 3; i++) {
            var _btn = new PIXI.Sprite.fromFrame(_btnImg[i] + ".png");
            _btn.y = i * _btn.height + 5 * i;
            _btnGroup.addChild(_btn);
            _btn.interactive = true;
            _btn.buttonMode = true;
            _btn.myId = i;
            _btn.on('mousedown', _btnEvent[i]);

            _btn.mouseover = function() {
                this.texture = new PIXI.Texture.fromFrame(_btnImg[this.myId] + "_hover.png");
            }
            _btn.mouseout = function() {
                this.texture = new PIXI.Texture.fromFrame(_btnImg[this.myId] + ".png");
            }
        }


        _btnGroup.x = displayWidth - _btnGroup.width - 5;
        _btnGroup.y = 10;

        statusLayer.addChild(_btnGroup);

        statusLayer.y = displayHeight + 60;
        statusLayer.visible = false;
        ui_item.createItemStatusLayer();

    }

 

   


    function _createStatusCloseBtn() {
        var _closeBtn = new PIXI.Graphics();
        _closeBtn.beginFill(0x990000, 1);
        _closeBtn.drawCircle(0, 0, 15);
        _closeBtn.endFill();
        _closeBtn.btnClass = "attackBtn";

        var _textObj = new PIXI.Text("X", {
            fill: 0xffffff,
            font: '24px Arial'
        });

        _textObj.anchor = {
            x: 0.5,
            y: 0.5
        };

        _closeBtn.addChild(_textObj);
        _closeBtn.interactive = true;
        _closeBtn.buttonMode = true;
        _closeBtn.on("mousedown", _statusClose);
        statusLayer.addChild(_closeBtn);
        _closeBtn.x = 15;
        _closeBtn.y = 15;
        _closeBtn.zIndex = 99;
    }

    function _createSkillStatusLayer() {
        var _skillLayer = new PIXI.Container();

        arrCommonObj['skillLayer'] = _skillLayer;

        var _bg = new PIXI.Sprite.fromFrame("skill_bg.png");
        _bg.zIndex = 0;
        _skillLayer.addChild(_bg);

        statusLayer.addChild(_skillLayer);
        _skillLayer.zIndex = 50;
        _skillLayer.x = 10;
        _skillLayer.y = displayHeight - _skillLayer.height - 20;

        var _skillList = new PIXI.Container();
        var _skillMask = new PIXI.Graphics();
        var _touchArea = new PIXI.Graphics();
        _skillMask.beginFill(0x006666, 1); //first important
        _skillMask.drawRect(0, 0, 190, 150);

        _skillMask.x = 12;
        _skillMask.y = 47;
        _skillMask.lineStyle(1, 0x000000, 1);

        _skillLayer.addChild(_skillMask);
        _skillLayer.addChild(_skillList);

        _skillList.x = _skillMask.x;
        _skillList.y = _skillMask.y;
        _skillList.zIndex = 30;
        _skillList.mask = _skillMask;

        arrCommonObj['skillList'] = _skillList;
        // _updateSkill();

        _touchArea.beginFill(0x000000, 0); //first important
        _touchArea.drawRect(0, 0, 190, 150);
        _touchArea.maskHeight = _touchArea.height;
        _touchArea.x = _skillList.x;
        _touchArea.y = _skillList.y;

        _touchArea.interactive = true;
        _touchArea.buttonMode = true;

        _touchArea.zIndex = 40;

        arrCommonObj['skillTouchArea'] = _touchArea;
        _touchArea.mask = _skillMask;
        _touchArea.maskHeight = 150;


        _skillLayer.addChild(_touchArea);

        _skillLayer.updateLayersOrder();

        _touchArea.on('mousedown', _onDragStart)
            // events for drag end
            .on('mouseup', _onDragEnd)
            .on('mouseupoutside', _onDragEnd)
            // events for drag move
            .on('mousemove', _onDragMove);

        /*scroll*/
        function _onDragStart(event) {
            this.data = event.data;
            this.dragging = true;
            this.sy = this.data.getLocalPosition(this).y * this.scale.y;
            this.sx = this.data.getLocalPosition(this).x * this.scale.x;
            var _cB = this;

            this.oy = this.y;

            this.timeOut = setTimeout(function() {
                if (_cB.oy == _cB.y) {
                    _getSkillDetail(_cB.data.getLocalPosition(arrCommonObj['skillList']));
                } else {
                    console.log("Move");
                }
            }, 1500);
        }

        function _onDragEnd() {
            this.alpha = 1;
            this.dragging = false;
            // set the interaction data to null
            this.data = null;
            clearTimeout(this.timeOut);
        }

        function _onDragMove() {

            //this.y+this.height > _skillMask.y+_skillMask.height 
            if (this.dragging) {
                var newPosition = this.data.getLocalPosition(this.parent);

                this.position.y = newPosition.y - this.sy;


                if (this.y > _skillMask.y) {
                    this.y = _skillMask.y;
                }

                if (this.y + this.height <= parseInt(_skillMask.y + this.maskHeight)) {

                    this.y = _skillMask.y + this.maskHeight - this.height;
                }
                this.ny = this.y;

                _skillList.y = this.position.y;

            }
        }

        function _getSkillDetail(_position) {
            var _sk = arrCommonObj['skillList'].children
            for (var i = 0; i < _sk.length; i++) {
                if (findGameObjfromMouse(_position.x, _position.y, _sk[i])) {
                    console.log(i);
                    break;
                }
            }
        }
    }



    function _updateSkill() {
        for (var i = 0; i < currentRole.skill.length; i++) {

            var _textObj = new PIXI.Text(arrSkills[currentRole.skill[i]].name, {
                font: '16px Arial',
                fill: 0xFFFFFF
            });

            _textObj.y = i * _textObj.height + 10 * i;
            _textObj.skill = arrSkills[currentRole.skill[i]];
            arrCommonObj['skillList'].addChild(_textObj);

        }

        arrCommonObj['skillTouchArea'].height = arrCommonObj['skillList'].height;

        if (arrCommonObj['skillTouchArea'].height > arrCommonObj['skillTouchArea'].maskHeight) {
            arrCommonObj['skillTouchArea'].interactive = true;
        } else {
            arrCommonObj['skillTouchArea'].interactive = false;
        }

    }

    /*statusOpen*/
    function _statusOpen() {
            gameStage.visible = false;
            ui_item.updateStatusItem();
            _updateSkill();
            statusLayer.visible = true;
            mainUiLayer.visible = false;

        }
        /*statusClose*/
    function _statusClose() {
        gameStage.visible = true;
        statusLayer.visible = false;
        mainUiLayer.visible = true;
        /*     arrCommonObj['trashCard'].myItemId = 0;
             arrCommonObj['trashCard'].children[1].text = "empty";*/
    }


    /*關閉選項*/
    function _closeAttackBtn() {
        for (var i = 0; i < actionUiLayer.children.length; i++) {
            if (actionUiLayer.children[i].btnClass == "attackBtn") {
                actionUiLayer.children[i].interactive = false;
                new TweenMax(actionUiLayer.children[i], 0.3, {
                    x: currentRole.x,
                    y: currentRole.y,
                    alpha: 0,
                    onComplete: function(_self) {
                        var _target = _self.target;
                        actionUiLayer.removeChild(_target);
                    },
                    onCompleteParams: ["{self}"]
                });
            }
        }
    }

    return {
        createUiBtn: _createUiBtn,
        createAp: _createDisplayAp,
        updateAp: _updateAp,
        createStatus: _createStatus,
        updateStatusItem: ui_item.updateStatusItem,
        closeAttackBtn: _closeAttackBtn,      
        updateScore: _updateScore,
        createMsgBox: _createMsgBox,
        statusOpen: _statusOpen,
        statusClose: _statusClose,
        createRoleStatus: _createRoleStatus
    }
})
