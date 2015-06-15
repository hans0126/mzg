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
            new TweenMax(_canMovePlay[i], ((Math.random() * 5) + 4) / 10, {
                x: _canMovePlay[i].goalX,
                y: _canMovePlay[i].goalY
            });
        }

        //取得所有玩家
        objectHelp(enemyLayer.children, {}, {
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
            tint: 0xFFFFFF
        });

        _enemyAttack();
    }

    function _enemyAttack() {

        var _players = playerLayer.children;
        var _enemys = enemyLayer.children;

        for (var i = 0; i < _players.length; i++) {
            var _local = _players[i].local;
            var _count = 0;

            for (var j = 0; j < _enemys.length; j++) {

                if (_enemys[j].local == _local) {
                    _count++;

                    if (_players[i].wound < 5) {
                      

                        //random equip block 0:hand 1:backpack
                        _getWound(_players[i]);                       
                         _players[i].wound++;




                    } else {
                        console.log("playre die!!");
                    }
                }

            }
        }
    }

    function _getWound(_playerObj, _type, _block, _history) {
       
        if (typeof(_history) == "undefined") {
            //            _history = [];
            //初始掃描裝備欄是否有傷並做history標記 true:有傷 必須在找下一個
            _history = []

            for (var i = 0; i < _playerObj.equip.length; i++) {             
                for (var j = 0; j < _playerObj.equip[i].length; j++) {
                    if (_playerObj.equip[i][j] != 99) {
                        _history.push([i,j]);
                    } 
                }

            }
        }

        var getRandom = Math.floor(Math.random()*_history.length);
        _playerObj.equip[_history[getRandom][0]][_history[getRandom][1]] = 99;
    }


    return {
        enemyMove: _enemyMove
    }
})
