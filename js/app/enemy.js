define(['findpath'], function(findpath) {

    /*
敵人移動
目前僅指向單人
*/
    function _enemyMove() {
        var _canMovePlay = [];
        var _canMoveTargetRoom = [];
        var _player = objectHelp(playerLayer.children, {
            live: true
        });
        var _playerLocal = [];
        var _attackUnit = [];

        for (var i = 0; i < _player.length; i++) {
            _playerLocal.push(_player[i].local);
        }


        if (_playerLocal.length > 0) {
            for (var y = 0; y < arrMap.length; y++) {
                for (var x = 0; x < arrMap[y].length; x++) {

                    var _roomObject = arrMap[y][x];
                    var _resultPaths;
                    var _targetRoom;
                    var _newRoomLocal;
                    var _enemyCount = objectHelp(enemyLayer.children, {
                        local: _roomObject
                    });

                    //move unit
                    if (_enemyCount.length > 0 && _playerLocal.indexOf(_roomObject) == -1) {

                        var _resultPaths = findpath.findEnemyByEyes(_roomObject);
                        // console.log(_resultPath);               

                        if (_resultPaths.length > 0) {
                            for (var i = 0; i < _enemyCount.length; i++) {
                                if (_canMovePlay.indexOf(_enemyCount[i]) == -1) {
                                    _enemyCount[i].goalX = Math.floor(randomDeploy(_resultPaths[0].localX, blockWidth));
                                    _enemyCount[i].goalY = Math.floor(randomDeploy(_resultPaths[0].localY, blockHeight));
                                    _canMovePlay.push(_enemyCount[i]);
                                    _canMoveTargetRoom.push(_resultPaths[0]);
                                }
                            }
                        } else {
                            /*
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
                            }*/
                        }
                    }

                    //attack unit
                    // console.log(_roomObject.room_id);
                    if (_enemyCount.length > 0 && _playerLocal.indexOf(_roomObject) > -1) {
                        _attackUnit[_roomObject.room_id] = [];
                        for (var i = 0; i < _enemyCount.length; i++) {
                            _attackUnit[_roomObject.room_id].push(_enemyCount[i]);
                        }

                    }
                }
            }

            for (var i = 0; i < _canMovePlay.length; i++) {
                _canMovePlay[i].local = _canMoveTargetRoom[i];
                //_canMovePlay[i].actionMovement = true;
                new TweenMax(_canMovePlay[i], ((Math.random() * 5) + 4) / 10, {
                    x: _canMovePlay[i].goalX,
                    y: _canMovePlay[i].goalY,
                    roundProps: "x,y"
                });
            }

        }
        //取得所有玩家
        /*
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
         */
        _enemyAttack(_attackUnit);
    }

    function _enemyAttack(_attackUnit) {

        /*change Layer*/
        enemyLayer.zIndex = 45;
        gameStage.updateLayersOrder();

        var _tProcess = [];
        var _arrDiePlayer = [];
        for (key in _attackUnit) {
            var _attackCount = _attackUnit[key].length;
            var _arrPlayer = [];


            for (var i = 0; i < playerLayer.children.length; i++) {
                if (playerLayer.children[i].local.room_id == key && playerLayer.children[i].live == true) {
                    _arrPlayer.push(playerLayer.children[i]);
                }
            }

            for (var i = 0; i < _attackUnit[key].length; i++) {

                var _targetPayer = _arrPlayer[Math.floor(Math.random() * _arrPlayer.length)];

                var _textObj = new desplayAttackText().create();
                _textObj.text = "Wound";
                _textObj.tint = 0xFF0000;
                actionUiLayer.addChild(_textObj);
                _textObj.x = _targetPayer.x;
                _textObj.y = _targetPayer.y - _textObj.height;
                _textObj.alpha = 0;
                _targetPayer.wound++;




                if (_targetPayer.wound < 6) {
                    _getWound(_targetPayer);

                } else {
                    if (_arrDiePlayer.indexOf(_targetPayer) == -1) {
                        _arrDiePlayer.push(_targetPayer);
                    }
                }

                var _np = moveToNearTarget(_attackUnit[key][i], _targetPayer);

                var _t = new TimelineMax()
                _tProcess.push(_t);

                _t.to(_attackUnit[key][i], 0.5, {
                    x: _np.x,
                    y: _np.y,
                    delay: Math.floor(Math.random() * 10) / 10,
                }).to(_attackUnit[key][i], 0.1, {
                    x: _targetPayer.x,
                    y: _targetPayer.y,
                    rotation: 0.5,
                    onStart: function(_tObj, _delay, _target) {

                        shakeAnimation(_target);

                        new TimelineMax().to(_tObj, 0, {
                            alpha: 1
                        }).to(_tObj, 0.5, {
                            y: _tObj.y - 30,
                            alpha: 0,
                            onComplete: function(_self) {
                                actionUiLayer.removeChild(_self.target);
                            },
                            onCompleteParams: ["{self}"]
                        })
                    },
                    onStartParams: [_textObj, i, _targetPayer]
                }).to(_attackUnit[key][i], 0.1, {
                    x: _np.x,
                    y: _np.y,
                    rotation: 0,
                    roundProps: "x,y",
                    onComplete: function(_tObj, _tp) {

                        if (checkAllTweenComplete(_tp)) {
                            if (_arrDiePlayer.length == 0) {
                                _endTurn();
                            } else {
                               // _killedPlayer();
                            }
                        }

                    },
                    onCompleteParams: [_textObj, _tProcess]
                })
            }
            //處理腳色死亡          
            /*
          
            */
        }



        if (_tProcess.length == 0) {
            _endTurn();
        }

        function _endTurn() {
            enemyLayer.zIndex = 30;
            gameStage.updateLayersOrder();
            objectHelp(playerLayer.children, {}, {
                interactive: true,
                actionPoint: 3,
                tint: 0xFFFFFF
            });
        }


        function _killedPlayer() {

            var _tp = [];

            for (var i = 0; i < _arrDiePlayer.length; i++) {

                var _textObj = new desplayAttackText().create();
                _textObj.text = "You Die!";
                _textObj.tint = 0xFF0000;
                actionUiLayer.addChild(_textObj);
                _textObj.x = _arrDiePlayer[i].x;
                _textObj.y = _arrDiePlayer[i].y - _textObj.height;
                _textObj.alpha = 0;
                console.log("die");
                _arrDiePlayer[i].live = false;

                var _t = new TimelineMax();
                _tp.push(_t)
                _t.to(_arrDiePlayer[i], 0.8, {
                    alpha: 0,
                    onStart: function(_tObj) {
                        new TimelineMax().to(_tObj, 0, {
                            alpha: 1
                        }).to(_tObj, 0.5, {
                            y: _tObj.y - 30,
                            alpha: 0,
                            onComplete: function(_self) {
                                actionUiLayer.removeChild(_self.target);
                            },
                            onCompleteParams: ["{self}"]
                        })
                    },
                    onStartParams: [_textObj],
                    onComplete: function(_self, _arrProcess) {
                        _self.target.visible = false;

                        if (checkAllTweenComplete(_arrProcess)) {
                            _endTurn();
                        }

                    },
                    onCompleteParams: ["{self}", _tp]
                })


                arrLayerManager[_arrDiePlayer[i].roleName + "_icon_btn"].children[0].tint = 0x333333;
                arrLayerManager[_arrDiePlayer[i].roleName + "_icon_btn"].interactive = false;

            }

        }

    }

    function _getWound(_playerObj) {
        //            _history = [];
        //初始掃描裝備欄是否有傷並做history標記 true:有傷 必須在找下一個
        var _history = [];
        for (var i = 0; i < _playerObj.equip.length; i++) {
          
                if (_playerObj.equip[i] != 99) {
                    _history.push([i]);
                }
            
        }

        var getRandom = Math.floor(Math.random() * _history.length);
        _playerObj.equip[_history[getRandom][0]] = 99;
    }


    return {
        enemyMove: _enemyMove
    }
})
