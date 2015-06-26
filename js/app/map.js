define(['role'], function(role) {

    function _createMap() {
        /*
            產生地圖以及連接路徑
        */

        for (var y = 0; y < arrMap.length; y++) {
            for (var x = 0; x < arrMap[y].length; x++) {
                totalRoom++;
                if (arrMap[y][x].visible == true) {

                    var _mapSpace = new PIXI.Container();
                    _mapSpace.x = x * blockWidth;
                    _mapSpace.y = y * blockWidth;
                    _mapSpace.zIndex = 20;

                    for (var i = 0; i < 4; i++) {
                        for (var j = 0; j < 4; j++) {
                            var _mTile = PIXI.Sprite.fromFrame("map" + arrMapType[arrMap[y][x].maptype][i][j]);

                            _mTile.x = (j * 50);
                            _mTile.y = (i * 50);
                            _mapSpace.addChild(_mTile);
                        }
                    }


                    mapLayer.addChild(_mapSpace);

                    arrMap[y][x].localX = x;
                    arrMap[y][x].localY = y;
                    arrMap[y][x].noise = 0;
                    arrMap[y][x].passage = [];

                    //房間文字
                    //var _textObj = new PIXI.Text(arrMap[y][x].room_id);
                    var _textObj = new PIXI.extras.BitmapText(arrMap[y][x].room_id, {font: "50px Crackhouse",tint:0x000000});
                    _textObj.x = blockWidth / 2 - _textObj.width / 2;
                    _textObj.y = blockHeight / 2 - _textObj.height / 2;
                    _textObj.alpha = 1;
                    _mapSpace.addChild(_textObj);

                    //門
                    for (var i = 0; i < arrDoors.length; i++) {
                        if (arrDoors[i].root_room == arrMap[y][x].room_id) {
                            var _doorGraphics = new PIXI.Sprite();

                            _doorGraphics.x = (x * blockWidth) + arrDoors[i].x;
                            _doorGraphics.y = (y * blockHeight) + arrDoors[i].y;                       
                           
                            _doorGraphics.passage = arrDoors[i].passage;
                            _doorGraphics.open = arrDoors[i].open;
                            _doorGraphics.visible = false;
                            _doorGraphics.on('mousedown', role.passageDoor);
                            _doorGraphics.zIndex = 10;
                            passageLayer.addChild(_doorGraphics);
                        }

                        //將passage 紀錄於map object
                        var _tempRoomId;
                        var _tempIndex;
                        if (arrDoors[i].passage.indexOf(arrMap[y][x].room_id) > -1) {
                            if (arrDoors[i].passage.indexOf(arrMap[y][x].room_id) == 0) {
                                _tempIndex = 1;
                            } else {
                                _tempIndex = 0;
                            }
                            arrMap[y][x].passage.push(arrDoors[i].passage[_tempIndex]);
                        }
                    }
                }
            }
        }
        //create Item Box
        for (var i = 0; i < 10; i++) {
            var _room = getRandomRoom(totalRoom);
            
            var _itemBox = new PIXI.Graphics();
            _itemBox.beginFill(0x000066, 1);
            _itemBox.drawRect(0, 0, 30, 30);
            _itemBox.x = randomDeploy(_room.localX, blockWidth);
            _itemBox.y = randomDeploy(_room.localY, blockHeight);
            _itemBox.local = _room;
            _itemBox.on('mousedown', role.searchItem);
            
            _itemBox.buttonMode = true;

            _itemBox.lineStyle(1, 0x0000FF, 1);
            itemLayer.addChild(_itemBox);
        }

    }



    return {
        createMap: _createMap
    }


})
