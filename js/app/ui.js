define(['enemy'], function(enemy) {

    function _createUiBtn() {

        var _mouseEvent = [enemy.enemyMove, _statusOpen];
        var _btnName = ['End Turn', 'Status'];
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


    function _createScore() {
        var _graphic = new PIXI.Graphics();
        _graphic.beginFill(0x99FFFF, 1);
        _graphic.drawRect(10, 10, displayWidth - 20, 15);

        mainUiLayer.addChild(_graphic);

        var _graphicSpace = _graphic.width / 4;

        for (var i = 0; i < 5; i++) {

            var _textObj = new PIXI.Text(i + '0', {
                font: '15px Arial',
                fill: 0x000000
            });

            _textObj.x = _graphic.x + (i * _graphicSpace);
            _textObj.y = 25;
            mainUiLayer.addChild(_textObj);
        }

        var _arrow = new PIXI.Graphics();

        _arrow.beginFill(0xFF0000);

        // draw a triangle using lines
        _arrow.moveTo(0, 0);

        _arrow.lineTo(-7, -10);
        _arrow.lineTo(7, -10);

        _arrow.x = 10;
        _arrow.y = 20;
        // end the fill
        _arrow.endFill();
        arrCommonObj['arrow'] = _arrow;
        mainUiLayer.addChild(_arrow);
    }


    function _updateScore(num) {
        var _scoreWidth = (displayWidth - 20) / 40;

        var tween = new TweenMax(arrCommonObj['arrow'], 0.5, {
            x: (_scoreWidth * num) + 10,
            ease: Elastic.easeOut
        });

        /*判斷有沒有升級*/
        var _targetLevel;
        var _levelRange;
        var _currentLevel;


        for (var i = 0; i < levelRange.length; i++) {
            var _levelUp = false;
            if (i != levelRange.length - 1) {
                if (score >= levelRange[i] && score < levelRange[i + 1] && currentRole.level != i + 1) {
                    _levelUp = true;
                }
            } else {
                if (score >= levelRange[i] && currentRole.level != i + 1) {
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


        _createItemStatusLayer();
        _createSkillStatusLayer();

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


        function _createSkillStatusLayer() {
            var _skillLayer = new PIXI.Container();
            _skillLayer.y = 30;
            arrCommonObj['skillLayer'] = _skillLayer;
            statusLayer.addChild(_skillLayer);
        }





        function _createItemStatusLayer() {
            var _cardBaseX = 0;
            var _row2BaseX;
            var _row2BaseY;
            var _itemLayer = new PIXI.Container();


            for (i = 0; i < 5; i++) {
                var _itemCaseParent = new PIXI.Container();
                var _itemCase = new PIXI.Graphics();
                _itemCase.beginFill(0x666666, 1);
                _itemCase.drawRect(0, 0, 150, 225);
                _itemCase.lineStyle(0, 0x0000FF, 1);
                _itemCaseParent.zIndex = i;
                _itemCaseParent.addChild(_itemCase);
                _itemLayer.addChild(_itemCaseParent);

                if (i < 3) {
                    _itemCaseParent.x = _cardBaseX + i * _itemCaseParent.width + 20 * i;
                    _itemCaseParent.y = 20;
                    _itemCaseParent.myRow = 1;
                    _itemCaseParent.myId = i;
                    if (i == 0) {
                        _row2BaseX = _itemCaseParent.x + _itemCaseParent.width / 2 + 10;
                        _row2BaseY = _itemCaseParent.y + _itemCaseParent.height + 10;
                    }
                } else {
                    _itemCaseParent.x = _row2BaseX + (i - 3) * _itemCaseParent.width + 20 * (i - 3);
                    _itemCaseParent.y = _row2BaseY;
                    _itemCaseParent.myRow = 0;
                    _itemCaseParent.myId = i - 3;
                }

                var _textObj = new PIXI.Text("empty", {
                    font: '30px Arial',
                    fill: 0xffffff
                });
                _textObj.x = 0;
                _textObj.y = 0;

                _itemCaseParent.addChild(_textObj);

                _itemCaseParent.originX = _itemCaseParent.x;
                _itemCaseParent.originY = _itemCaseParent.y;

                /*bind drag event*/
                _itemCaseParent.interactive = true;
                _itemCaseParent.buttonMode = true;

                _itemCaseParent.on('mousedown', _onDragStart)
                    // events for drag end
                    .on('mouseup', _onDragEnd)
                    .on('mouseupoutside', _onDragEnd)
                    // events for drag move
                    .on('mousemove', _onDragMove)

            }

            statusLayer.addChild(_itemLayer);
            _itemLayer.myId = "itemLayer";
            _itemLayer.x = displayWidth - _itemLayer.width - 20;
            //record layer index   
            arrLayerManager['itemLayer'] = statusLayer.getChildIndex(_itemLayer);

            function _onDragStart(event) {
                _zIndexUpFirst(this);
                this.data = event.data;
                this.dragging = true;
                this.sx = this.data.getLocalPosition(this).x * this.scale.x;
                this.sy = this.data.getLocalPosition(this).y * this.scale.y;
            }

            function _onDragEnd() {
                this.alpha = 1;
                this.dragging = false;
                // set the interaction data to null
                this.data = null;
                _checkHit(this)
                var tween = new TweenMax(this, 0.5, {
                    x: this.originX,
                    y: this.originY,
                    alpha: 1
                });
            }

            function _onDragMove() {
                if (this.dragging) {
                    var newPosition = this.data.getLocalPosition(this.parent);
                    this.position.x = newPosition.x - this.sx;
                    this.position.y = newPosition.y - this.sy;
                }
            }

            /*
                current drag obj zindex go to top
            */
            function _zIndexUpFirst(_obj) {
                for (var i = 0; i < _itemLayer.children.length; i++) {
                    _itemLayer.children[i].zIndex = 1;
                }

                _obj.zIndex = 10;
                _itemLayer.updateLayersOrder();
            }

            /*
            touch area 60%+ triggle change
            */
            function _checkHit(_obj) {
                var _iL = _itemLayer.children;

                for (var i = 0; i < _iL.length; i++) {
                    if (hitTest(_iL[i], _obj) && _iL[i] != _obj) {

                        var _recWidth = ((_obj.width - Math.abs(_obj.x - _iL[i].x)) / _obj.width) * 100;
                        var _recHeight = ((_obj.height - Math.abs(_obj.y - _iL[i].y)) / _obj.height) * 100;

                        if (_recWidth > 60 && _recHeight > 60) {
                            var _targetObj = _iL[i];
                            var _currentItemId = _obj.myItemId;
                            var _changeElement = [];

                            _obj.children[1].text = arrItems[_targetObj.myItemId].name;
                            _obj.myItemId = _targetObj.myItemId;

                            _targetObj.children[1].text = arrItems[_currentItemId].name;
                            _targetObj.myItemId = _currentItemId;
                            console.log(_targetObj.children);
                            _changeElement.push(_obj, _targetObj);

                            for (j = 0; j < _changeElement.length; j++) {
                                currentRole.equip[_changeElement[j].myRow][_changeElement[j].myId] = _changeElement[j].myItemId;
                            }
                            console.log(currentRole.equip[0]);
                            console.log(currentRole.equip[1]);
                            return true;
                            break;

                        }
                    }
                }
            }
        }

        //updateStatusItem();
    }

    function _updateStatusItem() {
        if (currentRole == null) {
            return false;
        }
        var _item = currentRole.equip;
        var _itemLayer = statusLayer.children[0].children;

        for (var i = 0; i < _item.length; i++) {
            for (var j = 0; j < _item[i].length; j++) {
                for (var k = 0; k < _itemLayer.length; k++) {
                    if (_itemLayer[k].myRow == i && _itemLayer[k].myId == j) {

                        _itemLayer[k].children[1].text = arrItems[_item[i][j]].name;
                        _itemLayer[k].myItemId = _item[i][j];

                        break;
                    }
                }
            }
        }
    }

    function _updateSkill() {
        for (var i = 0; i < currentRole.skill.length; i++) {

            var _textObj = new PIXI.Text(arrSkills[currentRole.skill[i]].name, {
                font: '20px Arial',
                fill: 0x00ff00
            });

            _textObj.y = i * _textObj.height + 10 * i;

            arrCommonObj['skillLayer'].addChild(_textObj);

        }
    }

    /*statusOpen*/
    function _statusOpen() {
            gameStage.visible = false;
            _updateStatusItem();
            _updateSkill();
            statusLayer.visible = true;
            mainUiLayer.visible = false;

        }
        /*statusClose*/
    function _statusClose() {
        gameStage.visible = true;
        statusLayer.visible = false;
        mainUiLayer.visible = true;
    }


    /*關閉選項*/
    function _closeAttackBtn() {
        for (var i = 0; i < actionUiLayer.children.length; i++) {
            if (actionUiLayer.children[i].btnClass == "attackBtn") {

                actionUiLayer.children[i].interactive = false;
                var tween = new TweenMax(actionUiLayer.children[i], 0.3, {
                    x: currentRole.x,
                    y: currentRole.y,
                    alpha: 0,
                    onComplete: function() {
                        var _target = this.target;

                        for (var j = 0; j < actionUiLayer.children.length; j++) {
                            if (actionUiLayer.children[j].myId == _target.myId) {
                                actionUiLayer.children.splice(j, 1);
                            }
                        }

                    }
                });
            }
        }
    }

    return {
        createUiBtn: _createUiBtn,
        createAp: _createDisplayAp,
        updateAp: _updateAp,
        createStatus: _createStatus,
        updateStatusItem: _updateStatusItem,
        closeAttackBtn: _closeAttackBtn,
        createScore: _createScore,
        updateScore: _updateScore,
        createMsgBox: _createMsgBox
    }
})
