define(['findpath'], function(findpath) {

    /*
敵人移動
目前僅指向單人
*/
    function _enemyMove() {
        var _canMovePlay = new Array();
        var _canMoveTargetRoom = new Array();
        var _player = objectHelp(playerLayer.children);

        if (_player.length > 0) {
            _player = _player[0];
        }

        var _playerLocal = _player.local;

        for (var y = 0; y < arrMap.length; y++) {
            for (var x = 0; x < arrMap[y].length; x++) {

                var _roomObject = arrMap[y][x];
                var _resultPaths;
                var _targetRoom;
                var _newRoomLocal;
                var _enemyCount = objectHelp(enemyLayer.children, {
                    local: _roomObject
                });

                if (_enemyCount.length > 0 && _playerLocal != _roomObject) {
                    _resultPaths = findpath.getPath(_playerLocal.room_id, _roomObject.room_id);

                    //array sort
                    _resultPaths.sort(function(a, b) {
                        return a.length - b.length;
                    })

                    if (_resultPaths.length > 0) {
                        _targetRoom = _resultPaths[0][1];
                        _newRoomLocal = getMapInfo(arrMap, {
                            room_id: _targetRoom
                        })[0];


                        for (var i = 0; i < _enemyCount.length; i++) {
                            _enemyCount[i].goalX = Math.floor(randomDeploy(_newRoomLocal.localX, blockWidth));
                            _enemyCount[i].goalY = Math.floor(randomDeploy(_newRoomLocal.localY, blockHeight));

                            _canMovePlay.push(_enemyCount[i]);
                            _canMoveTargetRoom.push(_newRoomLocal);
                        }

                    }
                }
            }
        }

        for (var i = 0; i < _canMovePlay.length; i++) {
            _canMovePlay[i].local = _canMoveTargetRoom[i];
            //_canMovePlay[i].actionMovement = true;

            var tween = new TweenMax(_canMovePlay[i], ((Math.random() * 5) + 4) / 10, {
                x: _canMovePlay[i].goalX,
                y: _canMovePlay[i].goalY
            });
        }
        //取得所有玩家

        objectHelp(enemyLayer.children, {

        }, {
            visible: false
        });

        var _players = objectHelp(playerLayer.children, {
            faction: "player"
        });

        for (var i = 0; i < _players.length; i++) {
            for (var j = 0; j < _players[i].panorama.length; j++) {

                objectHelp(enemyLayer.children, {
                    local: _players[i].panorama[j]
                }, {
                    visible: true
                });
            }
        }

        objectHelp(playerLayer.children, {}, {
            interactive: true,
            actionPoint: 3,
            tint:0xFFFFFF
        });
    }

    return {
        enemyMove:_enemyMove
    }
})
