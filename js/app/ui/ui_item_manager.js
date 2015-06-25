define(['attack'], function(attack) {

    function _createItemStatusLayer() {
        //create global variable       
        var _row2BaseX;
        var _row2BaseY;
        var _itemLayer = new PIXI.Container();
        var _itemTouchLayer = new PIXI.Container();
        var _cardPositionTune = 6;

        _itemLayer.zIndex = 30;
        _itemTouchLayer.zIndex = 10;

        _itemTouchLayer.itemMode = '';
        _itemTouchLayer.itemSelected = [];
        _itemTouchLayer.itemSelectedTarget = [];
        _itemTouchLayer.cardPositionTune = _cardPositionTune;
        // 0:null 1:fight 2:item manager
        statusLayer.activeMode = 0;

        for (i = 0; i < 5; i++) {
            var _itemCaseParent = new PIXI.Container();
            var _itemBtn = new PIXI.Graphics();
            var _itemCase = new PIXI.Sprite.fromFrame("item_card.jpg");

            _itemBtn.beginFill(0x666666, 0.5);
            _itemBtn.drawRect(0, 0, 132, 191);
            _itemBtn.lineStyle(0, 0x0000FF, 0);
            _itemTouchLayer.addChild(_itemBtn);


            _itemCaseParent.zIndex = i;
            _itemCaseParent.addChild(_itemCase);
            _itemLayer.addChild(_itemCaseParent);

            if (i < 2) {
                _itemBtn.x = 74 + i * _itemCaseParent.width + 38 * i;
                _itemBtn.y = -60;
                _itemBtn.myRow = 0;
                _itemBtn.myId = i;

                if (i == 0) {
                    _row2BaseY = _itemBtn.y + _itemBtn.height + 10;
                }
            } else {
                _itemBtn.x = (i - 2) * _itemBtn.width + 24 * (i - 2);
                _itemBtn.y = _row2BaseY + 2;
                _itemBtn.myRow = 0;
                _itemBtn.myId = i;

                if (i == 5) {
                    arrCommonObj['trashCard'] = _itemBtn;
                }
            }

            _itemCaseParent.x = _itemBtn.x + _cardPositionTune;
            _itemCaseParent.y = _itemBtn.y + _cardPositionTune;
            _itemBtn.alpha = 0;

            var _textObj = new PIXI.extras.BitmapText("Empty", {
                font: "30px Crackhouse",
                tint: 0x000000
            });

            _textObj.x = 20;
            _textObj.y = 10;

            _itemCaseParent.addChild(_textObj);

            _itemCaseParent.visible = true;
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

            _itemBtn.mouseover = function() {
                if (statusLayer.activeMode == 1) {
                    new TweenMax(this.targetObj, 0.2, {
                        y: this.targetObj.y - 40
                    })
                }
            }

            _itemBtn.mouseout = function() {
                if (statusLayer.activeMode == 1) {
                   _attackCardHoming.call(this);
                }
            }

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

            switch (statusLayer.activeMode) {
                case 1:
                    attack.attack.call(this);
                    break;
                case 2:
                    _itemManagerMode.call(this);
                    break;
            }
        }

        function _onDragEnd() {

            clearTimeout(this.timer);

            if (_itemTouchLayer.itemMode == "drag") {

                this.targetObj.data = null;
                this.targetObj.dragging = false;
                _itemTouchLayer.itemSelected = [];

                _checkCombine(this.targetObj, this);
            }

            _itemTouchLayer.itemMode = '';

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
                    x: _parent.x + _cardPositionTune,
                    y: _parent.y + _cardPositionTune,
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

        function _itemManagerMode() {
            var _obj = this.targetObj;
            var _currentTouch = this;

            if (this.targetObj.visible) {
                this.timer = setTimeout(function() {
                    //combine mode
                    _itemTouchLayer.itemMode = "drag";
                    _zIndexUpFirst(_obj);
                    _obj.data = event.data;
                    _obj.dragging = true;
                    _obj.sx = _obj.data.getLocalPosition(_obj).x * _obj.scale.x;
                    _obj.sy = _obj.data.getLocalPosition(_obj).y * _obj.scale.y;
                    _obj.alpha = 0.8;

                    _clearSelectItem();

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

            if (_itemTouchLayer.itemSelected.length < 2) {
                if (_itemTouchLayer.itemSelected.indexOf(this) == -1) {
                    _obj.alpha = 0.5;
                    _itemTouchLayer.itemSelected.push(this);
                    _itemTouchLayer.itemSelectedTarget.push({
                        targetObj: _obj,
                        itemId: this.myItemId
                    });
                }
            }

            if (_itemTouchLayer.itemSelected.length == 2) {
                clearTimeout(this.timer);
                /**/
                for (var i = 0; i < _itemTouchLayer.itemSelected.length; i++) {
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

                    new TimelineLite().to(_itemTouchLayer.itemSelected[i].targetObj, 0.5, {
                        x: _itemTouchLayer.itemSelected[_target].x + _cardPositionTune,
                        y: _itemTouchLayer.itemSelected[_target].y + _cardPositionTune,
                        alpha: _alpha,
                        scaleX: _scaleX,
                        scaleY: _scaleY,

                        onComplete: function(_currentObj, _id) {
                            for (var j = 0; j < _itemTouchLayer.children.length; j++) {
                                if (_itemTouchLayer.children[j].myItemId != 99) {

                                    _itemTouchLayer.children[j].interactive = true;
                                }
                            }
                        },
                        onCompleteParams: [_itemTouchLayer.itemSelected[_target], _itemTouchLayer.itemSelected[_target].myId]
                    });

                    _itemTouchLayer.itemSelected[i].targetObj = _itemTouchLayer.itemSelectedTarget[_target].targetObj;
                    currentRole.equip[_itemTouchLayer.itemSelected[_target].myId] = _itemTouchLayer.itemSelected[i].myItemId;
                    _itemTouchLayer.itemSelected[i].myItemId = _itemTouchLayer.itemSelectedTarget[_target].itemId;

                }

                _clearSelectItem();

            }
        }
    }


    function _updateStatusItem() {
        if (currentRole == null) {
            console.log('non-role');
            return false;
        }

        var _item = currentRole.equip;
        var _itemLayer = arrCommonObj['itemLayer'].children;
        var _itemTouchLayer = arrCommonObj['itemTouchLayer'].children;

        for (var i = 0; i < _item.length; i++) {

            _itemLayer[i].x = _itemTouchLayer[i].x + arrCommonObj['itemTouchLayer'].cardPositionTune;
            _itemLayer[i].y = _itemTouchLayer[i].y + arrCommonObj['itemTouchLayer'].cardPositionTune;

            _itemTouchLayer[i].myItemId = _item[i];

            _itemTouchLayer[i].targetObj = _itemLayer[i];

            _itemLayer[i].visible = true;
            switch (_item[i]) {
                case 0:
                    _itemLayer[i].visible = false;
                    _itemLayer[i].children[1].text = 'Empty';
                    break;

                case 99:
                    _itemTouchLayer[i].interactive = false;
                    _itemLayer[i].children[0].texture = PIXI.Texture.fromFrame('wound_card.jpg');
                    _itemLayer[i].children[1].text = '';
                    break;

                default:
                    _itemLayer[i].children[1].text = arrItems[_item[i]].name;

            }
        }

    }

    function _attackCardHoming() {
        new TweenMax(this.targetObj, 0.2, {
            y: this.y + arrCommonObj['itemTouchLayer'].cardPositionTune
        })
    }

    function _clearSelectItem() {
        arrCommonObj['itemTouchLayer'].itemSelected = [];
        arrCommonObj['itemTouchLayer'].itemSelectedTarget = [];
    }

    return {
        createItemStatusLayer: _createItemStatusLayer,
        updateStatusItem: _updateStatusItem,
        clearSelectItem: _clearSelectItem
    }

})
