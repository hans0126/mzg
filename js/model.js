/*time countdown*/
function countdown() {
    this.setTime = 3000;
    this.dateStart = new Date().getTime();
    this.dateEnd = null;
    this.percent = null;
    this.isInit = false;
    this.init = function() {
        this.dateEnd = new Date().getTime() + this.setTime;
        console.log(this.dateStart);
        console.log(this.dateEnd);
    }

    this.play = function() {

        if (!this.isInit) {
            this.init();
            this.isInit = true;
        }

        this.percent = ((new Date().getTime() - this.dateStart) / (this.dateEnd - this.dateStart)) * 100;

        this.process();

        if (this.percent > 100) {
            this.end();
            return true;
        }
    }

    this.process = function() {}

    this.end = function() {}

}

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


/* 隨機位置不重疊 */

function locationCheck(target, targetGroup, roomLocal) {

    for (var i = 0; i < targetGroup.length; i++) {
        if (target.local == targetGroup[i].local && target.objectName != targetGroup[i].objectName) {
            if (hitTest(target, targetGroup[i])) {

                target.x = randomDeploy(roomLocal.x, blockHeight);
                target.y = randomDeploy(roomLocal.y, blockHeight);

                locationCheck(target, targetGroup, roomLocal);
                break;
            }
        }
    }
}


/* random depoly to room */

function getRandomRoom(roomCount){
    
    var randomCount = Math.floor(Math.random()*roomCount);
   
    var count = 0;
    var room_id;
    for(var i=0;i<arrMap.length;i++){
        for(var j=0;j<arrMap[i].length;j++){
           

            if(randomCount==count){

                if(arrMap[i][j].visible==true){
                    room_id = arrMap[i][j].room_id;
                }else{
                   room_id = getRandomRoom(roomCount);
                }
            }

            count++;
        }
    }

    return room_id;
   

}




/* get room local */

function getRoomLocal(room_id) {
    var getRoom = false;
    var returnObj = {};

    for (var y = 0; y < arrMap.length; y++) {

        for (var x = 0; x < arrMap[y].length; x++) {
            if (arrMap[y][x].room_id == room_id) {
                getRoom = true;
                returnObj = {
                    x: x,
                    y: y
                };
                break;
            }
        }

        if (getRoom) {
            break;
        }
    }

    return returnObj;

}

/*隨機
    level:倍數 
    space:寬
    
*/

function randomDeploy(level, space) {
    return (Math.random() * (space - 30) + 15) + (space * level);
}


/*
--物件按鈕模式的啟用--
arrGraphic 物件陣列
condition 條件式 物件
status 變更狀態 interactiveSwitch
*/

function updateAttribute(arrGraphic, condition, attribute) {
    if (status == "undefined") {
        status = true;
    }


    if (typeof(arrGraphic) != "object") {
        return false;
    }

    for (var i = 0; i < arrGraphic.length; i++) {

        var currentMatch = true;

        if (condition != "undefined" || condition != null) {
            for (var key in condition) {
                if (arrGraphic[i][key] != condition[key]) {
                    currentMatch = false;
                    break;
                }
            }
        }

        if (currentMatch) {
            for (var key in attribute) {
                arrGraphic[i][key] = attribute[key];
            }
        }
    }
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
