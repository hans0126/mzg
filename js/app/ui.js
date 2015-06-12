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
        _createStatusCloseBtn();


        /*create bg*/

        var _bg = new PIXI.Sprite(resource.police_bg.texture);
        _bg.zIndex = 0;
        statusLayer.addChild(_bg);
        statusLayer.updateLayersOrder();

        //updateStatusItem();
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

        var _bg = new PIXI.Sprite(resource.skill_bg.texture);
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


    function _createItemStatusLayer() {
        //create global variable
        itemSelected = [];
        itemSelectedTarget = []
        itemMode = '';
        var _row2BaseX;
        var _row2BaseY;
        var _itemLayer = new PIXI.Container();
        var _itemTouchLayer = new PIXI.Container();

        _itemLayer.zIndex = 30;
        _itemTouchLayer.zIndex = 10;

        _itemLayer.zIndex = 60;

        for (i = 0; i < 6; i++) {
            var _itemCaseParent = new PIXI.Container();
            var _itemBtn = new PIXI.Graphics();
            var _itemCase = new PIXI.Sprite(resource.card_bg.texture);


            _itemBtn.beginFill(0x666666, 0.5);
            _itemBtn.drawRect(0, 0, 150, 225);
            _itemBtn.lineStyle(0, 0x0000FF, 1);
            _itemTouchLayer.addChild(_itemBtn);

            _itemCase.width = 150;
            _itemCase.height = 225;

            _itemCaseParent.zIndex = i;
            _itemCaseParent.addChild(_itemCase);
            _itemLayer.addChild(_itemCaseParent);


            if (i < 3) {
                _itemBtn.x = i * _itemCaseParent.width + 20 * i;
                _itemBtn.y = 20;
                _itemBtn.myRow = 1;
                _itemBtn.myId = i;

                if (i == 0) {

                    _row2BaseY = _itemBtn.y + _itemBtn.height + 10;
                }
            } else {
                _itemBtn.x = (i - 3) * _itemBtn.width + 20 * (i - 3);
                _itemBtn.y = _row2BaseY;
                _itemBtn.myRow = 0;
                _itemBtn.myId = i - 3;

                if (i == 5) {
                    //   _itemCaseParent.children[0].tint = 0xFF0000;
                    arrCommonObj['trashCard'] = _itemBtn;
                }
            }

            _itemCaseParent.x = _itemBtn.x;
            _itemCaseParent.y = _itemBtn.y;


            var _textObj = new PIXI.extras.BitmapText("Empty", {
                font: "30px Crackhouse",
                tint: 0x000000
            });

            _textObj.x = 20;
            _textObj.y = 10;

            _itemCaseParent.addChild(_textObj);

            _itemCaseParent.visible = false;
            _itemBtn.interactive = true;
            _itemBtn.buttonMode = true;

            _itemBtn.targetObj = _itemCaseParent;
            _itemBtn.myItemId = 0;

            _itemBtn.on("mousedown", _onItemClick)
                // events for drag end
                .on('mouseup', _onDragEnd)
                .on('mouseupoutside', _onDragEnd)
                // events for drag move
                .on('mousemove', _onDragMove);

        }

        statusLayer.addChild(_itemLayer);
        statusLayer.addChild(_itemTouchLayer);

        _itemLayer.x = 250;
        _itemTouchLayer.x = _itemLayer.x;
        //record layer index   
        arrCommonObj['itemLayer'] = _itemLayer;
        arrCommonObj['itemTouchLayer'] = _itemTouchLayer;

        statusLayer.updateLayersOrder();

        /*click process*/
        function _onItemClick(event) {
            //has rwo mode 1.traslate  2. combine item

            var _obj = this.targetObj;
            var _currentTouch = this;

            if (this.targetObj.visible) {
                this.timer = setTimeout(function() {
                    //combine mode
                    itemMode = "drag";
                    _zIndexUpFirst(_obj);
                    _obj.data = event.data;
                    _obj.dragging = true;
                    _obj.sx = _obj.data.getLocalPosition(_obj).x * _obj.scale.x;
                    _obj.sy = _obj.data.getLocalPosition(_obj).y * _obj.scale.y;
                    _obj.alpha = 0.8;
                    itemSelected = [];
                    itemSelectedTarget = [];

                    for (var i = 0; i < _itemTouchLayer.children.length; i++) {
                        if (_itemTouchLayer.children[i].myRow != _currentTouch.myRow || _itemTouchLayer.children[i].myId != _currentTouch.myId) {
                            _itemTouchLayer.children[i].interactive = false;
                        }
                    }

                    var tween = new TweenMax(_obj, 0.2, {
                        scaleX: 1.1,
                        scaleY: 1.1,
                        ease: Back.easeInOut
                    });

                }, 300);
            }

            if (itemSelected.length < 2) {
                if (itemSelected.indexOf(this) == -1) {
                    _obj.alpha = 0.5;
                    itemSelected.push(this);
                    itemSelectedTarget.push({
                        targetObj: _obj,
                        itemId: this.myItemId
                    });
                }
            }

            if (itemSelected.length == 2) {
                clearTimeout(this.timer);
                /**/
                for (var i = 0; i < itemSelected.length; i++) {
                    // i = current
                    // convers i
                    var _target;
                    if (i == 0) {
                        _target = 1;
                    } else {
                        _target = 0
                    }

                    var _alpha = 1;
                    var _scaleX = 1;
                    var _scaleY = 1;
                    //進到垃圾桶
                    if (itemSelected[_target].myRow == 0 && itemSelected[_target].myId == 2) {
                        _alpha = 0;
                        _scaleX = 0.5;
                        _scaleY = 0.5;
                    }

                    new TimelineLite().to(itemSelected[i].targetObj, 0.5, {
                        x: itemSelected[_target].x,
                        y: itemSelected[_target].y,
                        alpha: _alpha,
                        scaleX: _scaleX,
                        scaleY: _scaleY,

                        onComplete: function(_currentObj, _row, _id) {
                            for (var j = 0; j < _itemTouchLayer.children.length; j++) {
                                if (_itemTouchLayer.children[j].myItemId != 99) {

                                    _itemTouchLayer.children[j].interactive = true;
                                }
                            }

                            if (_row == 0 && _id == 2) {
                                //                         
                                _currentObj.targetObj.alpha = 1;
                                _currentObj.targetObj.visible = false;
                                _currentObj.targetObj.scale.x = 1;
                                _currentObj.targetObj.scale.y = 1;
                            }
                        },
                        onCompleteParams: [itemSelected[_target], itemSelected[_target].myRow, itemSelected[_target].myId]
                    });


                    itemSelected[i].targetObj = itemSelectedTarget[_target].targetObj;
                    currentRole.equip[itemSelected[_target].myRow][itemSelected[_target].myId] = itemSelected[i].myItemId;
                    itemSelected[i].myItemId = itemSelectedTarget[_target].itemId;

                    if (itemSelected[_target].myRow == 0 && itemSelected[_target].myId == 2) {
                        itemSelected[_target].myItemId = 0;
                    }
                }

                itemSelected = [];
                itemSelectedTarget = [];
                currentRole.equip[0].splice(2, 1);
                arrCommonObj['trashCard'].myItemId = 0;

            }
        }

        function _onDragEnd() {

            clearTimeout(this.timer);

            if (itemMode == "drag") {

                this.targetObj.data = null;
                this.targetObj.dragging = false;
                itemSelected = [];

                _checkCombine(this.targetObj, this);
            }

            itemMode = '';

        }

        function _onDragMove() {

            if (this.targetObj.dragging) {
                var newPosition = this.targetObj.data.getLocalPosition(this.targetObj.parent);
                this.targetObj.position.x = newPosition.x - this.targetObj.width / 2;
                this.targetObj.position.y = newPosition.y - this.targetObj.height / 2;
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
        function _checkCombine(_obj, _parent) {

            var _iL = _itemTouchLayer.children;
            var _getItemId;
            var _targetObj;

            for (var i = 0; i < _iL.length; i++) {
                if (hitTest(_iL[i], _obj) && _iL[i] != _obj) {
                    _targetObj = _iL[i];
                    var _recWidth = ((_obj.width - Math.abs(_obj.x - _targetObj.x)) / _obj.width) * 100;
                    var _recHeight = ((_obj.height - Math.abs(_obj.y - _targetObj.y)) / _obj.height) * 100;

                    if (_recWidth > 60 && _recHeight > 60) {

                        //match element
                        var _targetItemId = _targetObj.myItemId;
                        var _currentItemId = _parent.myItemId;

                        for (_key in arrItems) {
                            var _martch1 = arrItems[_key].combineElement.indexOf(_targetItemId);
                            var _martch2 = arrItems[_key].combineElement.indexOf(_currentItemId);
                            if (_martch1 > -1 && _martch2 > -1 && _martch1 != _martch2) {
                                _getItemId = _key;
                                break;
                            }
                        }

                        break;
                    }
                }
            }

            if (_getItemId) {
                _parent.myItemId = 0;
                _obj.visible = 0;
                _obj.x = _parent.x;
                _obj.y = _parent.y;

                currentRole.equip[_parent.myRow][_parent.myId] = 0;

                _targetObj.myItemId = _getItemId;
                _targetObj.targetObj.children[1].text = arrItems[_getItemId].name;

                currentRole.equip[_targetObj.myRow][_targetObj.myId] = _getItemId;

                //  _itemTouchLayer.children[i].interactive = true;

            } else {
                new TimelineLite().to(_parent.targetObj, 0.1, {
                    x: _parent.x,
                    y: _parent.y,
                    alpha: 1,
                    scaleX: 1,
                    scaleY: 1,
                    onComplete: function() {
                        /* for (var i = 0; i < _itemTouchLayer.children.length; i++) {
                             _itemTouchLayer.children[i].interactive = true;
                         }*/
                    }
                });
            }

            for (var i = 0; i < _itemTouchLayer.children.length; i++) {
                if (_itemTouchLayer.children[i].myItemId != 99) {
                    _itemTouchLayer.children[i].interactive = true;
                }
            }
        }
    }


    function _updateStatusItem() {

        if (currentRole == null) {
            return false;
        }

        var _item = currentRole.equip;
        var _itemLayer = arrCommonObj['itemLayer'].children;
        var _itemTouchLayer = arrCommonObj['itemTouchLayer'].children;

        for (var i = 0; i < _item.length; i++) {
            for (var j = 0; j < _item[i].length; j++) {
                for (var k = 0; k < _itemTouchLayer.length; k++) {

                    if (_itemTouchLayer[k].myRow == i && _itemTouchLayer[k].myId == j) {

                        _itemTouchLayer[k].myItemId = _item[i][j];

                        // _itemLayer[k].children[1].text = arrItems[_item[i][j]].name;
                        _itemTouchLayer[k].targetObj.children[1].text = arrItems[_item[i][j]].name;
                        if (_item[i][j] > 0) {
                            _itemTouchLayer[k].targetObj.visible = true;

                            if (_item[i][j] == 99) {
                                _itemTouchLayer[k].interactive = false;

                                //_itemTouchLayer[k].targetObj.children[0].texture(resource.card_bg.texture);

                                _itemTouchLayer[k].targetObj.children[0].texture = resource.wound.texture;
                                _itemTouchLayer[k].targetObj.children[1].text = '';


                            }
                        }

                        break;
                    }
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
        /*     arrCommonObj['trashCard'].myItemId = 0;
             arrCommonObj['trashCard'].children[1].text = "empty";*/
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
        createMsgBox: _createMsgBox,
        statusOpen: _statusOpen,
        statusClose: _statusClose
    }
})
