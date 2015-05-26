/*clone Object*/

function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }

    return temp;
}


/* 碰撞測試 */

function hitTest(r1, r2) {

    if (r1.x + r1.width > r2.x &&
        r1.y + r1.height > r2.y &&
        r1.x < r2.x + r2.width &&
        r1.y < r2.y + r2.height) {
        return true;
    } else {
        return false;
    }
}


/*
--物件按鈕模式的啟用--
arrGraphic 物件陣列
condition 條件式 物件
status 變更狀態 interactiveSwitch
*/

function objectHelp(_arrGraphic, _condition, _attribute) {

        var returnObj = new Array();




        if (typeof(_arrGraphic) != "object") {
            return false;
        }


        for (var i = 0; i < _arrGraphic.length; i++) {

            var _currentMatch = true;

            if (typeof(_condition) != "undefined" || _condition != null) {
                for (var _key in _condition) {
                    if (_arrGraphic[i][_key] != _condition[_key]) {
                        _currentMatch = false;
                        break;
                    }
                }
            }




            if (_currentMatch) {

                if (typeof(_attribute) != "undefined") {

                    for (var _key in _attribute) {

                        _arrGraphic[i][_key] = _attribute[_key];
                    }
                }

                returnObj.push(_arrGraphic[i]);
            }
        }

        return returnObj;
    }
    //二維
function getMapInfo(_arrMap, _condition) {

    var _returnObj = new Array();

    if (status == "undefined") {
        status = true;
    }


    if (typeof(_arrMap) != "object") {
        return false;
    }

    for (var y = 0; y < _arrMap.length; y++) {
        for (var x = 0; x < _arrMap[y].length; x++) {
            var currentMatch = true;

            if (_condition != "undefined" || _condition != null) {
                for (var key in _condition) {
                    if (_arrMap[y][x][key] != _condition[key]) {
                        currentMatch = false;
                        break;
                    }
                }
            }

            if (currentMatch) {

                _returnObj.push(_arrMap[y][x]);
            }
        }
    }

    return _returnObj;
}


/*將畫面目標移動到中心點*/
function moveToTarget(_tx, _ty) {

    var _x = (displayWidth / 2) - mapLayer.x - _tx;
    var _y = (displayHeight / 2) - mapLayer.y - _ty

    var tween = new TweenLite(gameStage, 0.5, {
        x: _x,
        y: _y
    });


}


/* requestAnimFrame */
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
