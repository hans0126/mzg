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

                            console.log(_mTile.x + "/" + _mTile.x + _mTile.width);

                            _mapSpace.addChild(_mTile);
                        }
                    }


                    mapLayer.addChild(_mapSpace);
                    console.log(_mapSpace.width);
                    arrMap[y][x].localX = x;
                    arrMap[y][x].localY = y;
                    arrMap[y][x].noise = 0;
                    arrMap[y][x].passage = [];

                    //房間文字
                    var _textObj = new PIXI.Text(arrMap[y][x].room_id);
                    _textObj.x = x * blockWidth + 5;
                    _textObj.y = y * blockHeight + 5;
                    mapLayer.addChild(_textObj);

                    //門
                    for (var i = 0; i < arrDoors.length; i++) {
                        if (arrDoors[i].root_room == arrMap[y][x].room_id) {
                            var _doorGraphics = new PIXI.Graphics();
                            if (arrDoors[i].open) {
                                _doorGraphics.beginFill(0x666666, 1);
                            } else {
                                _doorGraphics.beginFill(0x99FFFF, 1);
                            }

                            _doorGraphics.drawRect((x * blockWidth) + arrDoors[i].x, (y * blockWidth) + arrDoors[i].y, arrDoors[i].width, arrDoors[i].height);
                            _doorGraphics.lineStyle(1, 0x0000FF, 1);

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
    }


    return {
        createMap: _createMap
    }


})
