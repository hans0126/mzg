define(['ui'], function(ui) {

    function _activeCurrentRoomObj(_room) {

        for (var i = 0; i < passageLayer.children.length; i++) {
            var _passageIndex = passageLayer.children[i].passage.indexOf(_room.room_id);
            if (_passageIndex > -1) {
                // get Map
                if (_passageIndex == 0) {
                    _passageIndex = 1;
                } else {
                    _passageIndex = 0;
                }

                _targetRoom = getMapInfo(arrMap, {
                    room_id: passageLayer.children[i].passage[_passageIndex]
                })[0];

                _currentPassage = passageLayer.children[i];

                if (_targetRoom.localX == _room.localX) {

                    if (_targetRoom.localY > _room.localY) {
                        _currentPassage.texture = new PIXI.Texture.fromFrame("arrow_bottom.png");
                    } else {
                        _currentPassage.texture = new PIXI.Texture.fromFrame("arrow_top.png");
                    }


                } else if (_targetRoom.localY == _room.localY) {
                    if (_targetRoom.localX > _room.localX) {
                        _currentPassage.texture = new PIXI.Texture.fromFrame("arrow_right.png");
                    } else {
                        _currentPassage.texture = new PIXI.Texture.fromFrame("arrow_left.png");
                    }
                }
                _currentPassage.interactive = true;
                _currentPassage.buttonMode = true;
                _currentPassage.tint = 0x00FF00;
                _currentPassage.visible = true;
            }
        }

        for (var i = 0; i < itemLayer.children.length; i++) {
            if (itemLayer.children[i].local.room_id == _room.room_id) {

                itemLayer.children[i].interactive = true;
            }
        }
    }

    function _disableAllRoomObj() {

        objectHelp(passageLayer.children, null, {
            interactive: false,
            tint: 0x666666,
            visible: false
        });

        objectHelp(itemLayer.children, null, {
            interactive: false
        });

    }

    /*
    判斷是否還有action process.inherits();
    */

    function _checkActionPoint() {
        if (currentRole.actionPoint == 0) {
            currentRole.interactive = false;
            currentRole.tint = 0x999999;
            _disableAllRoomObj();
        }
    }

    function _openAttackMenu() {

        _activeCurrentRoomObj(this.local);
        statusLayer.visible = true;
        currentRole = this;
        statusLayer.activeMode = 1;

        _updateStatusItem();
        new TweenMax(statusLayer, 0.5, {
            y: statusLayer.positionMode[1]
        })
    }

    //更新物品資料

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

    function _openBackpack() {
        statusLayer.visible = true;
        statusLayer.activeMode = 2;
        new TweenMax(statusLayer, 0.5, {
            y: statusLayer.positionMode[2]

        })
    }

    function _dropMode() {

    }

    function _closeMenu() {
        statusLayer.activeMode = 0;
        _clearSelectItem();
        _disableAllRoomObj();
        new TweenMax(statusLayer, 0.5, {
            y: statusLayer.positionMode[0],
            onComplete: function(_self) {
                _self.target.visible = false;
            },
            onCompleteParams: ["{self}"]
        })
    }

    function _clearSelectItem() {
        arrCommonObj['itemTouchLayer'].itemSelected = [];
        arrCommonObj['itemTouchLayer'].itemSelectedTarget = [];
    }


    return {
        activeCurrentRoomObj: _activeCurrentRoomObj,
        disableAllRoomObj: _disableAllRoomObj,
        checkActionPoint: _checkActionPoint,
        openAttackMenu: _openAttackMenu,
        updateStatusItem: _updateStatusItem,
        openBackpack: _openBackpack,
        dropMode: _dropMode,
        closeMenu: _closeMenu,
        clearSelectItem: _clearSelectItem
    }

})
