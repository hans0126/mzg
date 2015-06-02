define(function() {

    /*search path 

    _targetLocalId : target room id
    _currentLocalId : current room id

    return 
    
    all can arrive path

*/

    function _getPath(_targetLocalId, _currentLocalId, _lastLocalId, _arrPathRecord, _arrStamp, _doorMemory, _successPath) {

        if (typeof(_lastLocalId) == "undefined") {
            _lastLocalId = null;
        }

        if (typeof(_arrPathRecord) == "undefined") {
            _arrPathRecord = new Array();
        }

        if (typeof(_arrStamp) == "undefined") {
            _arrStamp = new Array();
        }

        if (typeof(_doorMemory) == "undefined") {
            _doorMemory = new Array();
        }

        if (typeof(_successPath) == "undefined") {
            _successPath = new Array();
        }

        //找出此房間的門，則可判斷出通往的房間
        var _thisRoomDoors = new Array();
        //search door
        for (var i = 0; i < passageLayer.children.length; i++) {
            var _indexOf = passageLayer.children[i].passage.indexOf(_currentLocalId);


            if (_indexOf > -1 && passageLayer.children[i].open == true) {
                if (_indexOf == 0) {
                    _indexOf = 1;
                } else {
                    _indexOf = 0;
                }

                _thisRoomDoors.push(passageLayer.children[i].passage[_indexOf]);
            }
        }

        _arrPathRecord.push(_currentLocalId);

        var _getDoorTogo;

        if (_thisRoomDoors.indexOf(_lastLocalId) > -1) {
            _thisRoomDoors.splice(_thisRoomDoors.indexOf(_lastLocalId), 1);
        }



        if (_thisRoomDoors.length >= 2) {
            _arrStamp.push("r");
        } else if (_thisRoomDoors.length == 1) {
            _arrStamp.push("0");
        } else if (_thisRoomDoors.length == 0 || _currentLocalId == _targetLocalId) {
            _arrStamp.push("-");
        }

        if (_thisRoomDoors.length > 0 && _arrPathRecord.indexOf(_thisRoomDoors[0]) < 0 && _currentLocalId != _targetLocalId) {

            _getDoorTogo = _thisRoomDoors[0];
            _thisRoomDoors.splice(0, 1);

            _doorMemory.push(_thisRoomDoors);


            _getPath(_targetLocalId, _getDoorTogo, _currentLocalId, _arrPathRecord, _arrStamp, _doorMemory, _successPath);
        } else {
            _doorMemory.push(new Array());

            if (_currentLocalId == _targetLocalId) {
                _successPath.push(_arrPathRecord.slice());
            }

            var _c = 0
            for (var i = _arrStamp.length - 1; i > -1; i--) {

                if (_arrStamp[i] == "r") {
                    if (_doorMemory.length > 0) {
                        if (_doorMemory[i].length > 0) {

                            _getDoorTogo = _doorMemory[i][0];

                            _doorMemory[i].splice(0, 1);

                            _arrPathRecord.splice(-1 * _c, _c);
                            _arrStamp.splice(-1 * _c, _c);
                            _doorMemory.splice(-1 * _c, _c);

                            _getPath(_targetLocalId, _getDoorTogo, _arrPathRecord[i], _arrPathRecord, _arrStamp, _doorMemory, _successPath);
                        }
                    } else {

                    }

                }
                _c++;
            }

        }

        return _successPath;

    }

    /*十字視野*/

    function _getPanorama(_currentRoomId, _minRange, _maxRange) {

        var _clockwise = [-1, 1, 1, -1]; //四方推演 順時針
        var _blockOff = [true, true, true, true]; //阻擋紀錄 
        var _arrReturn = [];
        var _mapGroupRecord = []; /*增加record*/
        var _passgeRecord = [];
        var _currentLocal = getMapInfo(arrMap, {
            room_id: _currentRoomId
        })[0];


        _mapGroupRecord[0] = _currentLocal.group;
        _passgeRecord[0] = _currentLocal.room_id;

        if (typeof(_minRange) == "undefined") {
            _minRange = 0;
        }

        if (typeof(_maxRange) == "undefined") {
            _maxRange = 2;
        }

        for (var i = _minRange; i < _maxRange + 1; i++) {

            var _tempArray = [];
            var _tempPassage = [];
            if (i < 1) {
                _arrReturn.push(_currentLocal);
            } else {
                //4方擴展 clockwise y-1 x+1 y+1 x-1 
                for (j = 0; j < 4; j++) {
                    var _tempCurrentLocal = cloneObject(_currentLocal);
                    var _quadrant;
                    if (j % 2 == 0) {
                        _quadrant = "localY";
                    } else {
                        _quadrant = "localX";
                    }

                    var _quadrantValue = (_clockwise[j] * i) + _currentLocal[_quadrant];

                    _tempCurrentLocal[_quadrant] = _quadrantValue;
                    if (_quadrantValue >= 0 && _blockOff[j] && _tempCurrentLocal.localY < arrMap.length) {

                        if (_tempCurrentLocal.localX < arrMap[_tempCurrentLocal.localY].length && arrMap[_tempCurrentLocal.localY][_tempCurrentLocal.localX].visible == true) {

                            var _tempTarget = arrMap[_tempCurrentLocal.localY][_tempCurrentLocal.localX];
                            var _lastGroup;
                            var _lastRoomId;

                            if (i == _minRange || (_minRange == 0 && i == 1)) { //先處理I>0的狀況，定位紀錄原始地點
                                _lastGroup = _mapGroupRecord[0][0];
                                _lastRoomId = _passgeRecord[0][0];
                            } else {
                                _lastGroup = _mapGroupRecord[i - 1][j];
                                _lastRoomId = _passgeRecord[i - 1][j];

                            }


                            _tempPassage.push(_tempTarget.room_id);
                            _tempArray.push(_tempTarget.group);
                            if (_tempTarget.passage.indexOf(_lastRoomId) > -1) {


                                _arrReturn.push(_tempTarget);


                                if (_tempTarget.group != _lastGroup) {
                                    _blockOff[j] = false;
                                }

                            } else {
                                _blockOff[j] = false;
                            }

                        } else {
                            _blockOff[j] = false;
                            _tempArray.push(false);
                            _tempPassage.push(false);
                        }

                    } else {
                        _blockOff[j] = false;
                        _tempArray.push(false);
                        _tempPassage.push(false);
                    }
                }
            }

            if (i != 0) {
                _mapGroupRecord.push(_tempArray);
                _passgeRecord.push(_tempPassage);
            }
        }

        return _arrReturn;
    }



    return {
        getPath: _getPath,
        getPanorama: _getPanorama
    }

})
