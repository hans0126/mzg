var arrMap = new Array(); //地圖
var arrDoors = new Array(); //門資訊
var arrRoleType = new Array(); //角色類別
var arrItems = new Array(); //武器資訊
var arrSkills = new Array();//人物技能
var arrLanguage = new Array();//說話


arrMap = [
    [{
        visible: true,
        room_id: "a"
    }, {
        visible: true,
        room_id: "b"
    }, {
        visible: true,
        room_id: "c"
    }, {
        visible: true,
        room_id: "j"
    }],
    [{
        visible: true,
        room_id: "d"
    }, {
        visible: false,
        room_id: "e"
    }, {
        visible: true,
        room_id: "f"
    }],
    [{
        visible: true,
        room_id: "g"
    }, {
        visible: true,
        room_id: "h"
    }, {
        visible: true,
        room_id: "i"
    }]
];

arrDoors = [{
    "root_room": "a",
    passage: ["a", "b"],
    x: 95,
    y: 40,
    width: 10,
    height: 20,
    visible: true,
    open: true
}, {
    "root_room": "a",
    passage: ["a", "d"],
    x: 40,
    y: 95,
    width: 20,
    height: 10,
    visible: true,
    open: true
}, {
    "root_room": "d",
    passage: ["d", "g"],
    x: 40,
    y: 95,
    width: 20,
    height: 10,
    visible: true,
    open: true
}]


arrRoleType = [{
    typeName: "Zombie",
    color: 0x33FFCC
}, {
    typeName: "survivor",
    color: 0xFFFF00
}];


arrItems[0] = {category:"weapon",name:"pistal",attackType:"range",power:1,minRange:0,maxRange:1,successRange:4,numberOfAttack:5,dual:true};
arrItems[1] = {category:"weapon",name:"knife",attackType:"melee",power:1,minRange:0,maxRange:0,successRange:4,numberOfAttack:2,dual:true};
arrItems[2] = {category:"item",name:"food",attackType:"null",power:null,minRange:null,maxRange:null,successRange:null,numberOfAttack:null};



arrSkills[0] = {name:"+1 to dice roll: Combat",value:1};
arrSkills[1] = {name:"+1 to dice roll: Melee",value:1};
arrSkills[2] = {name:"+1 to dice roll: Ranged",value:1};
arrSkills[3] = {name:"+1 max Range",value:1};
arrSkills[4] = {name:"sniper",value:null};


arrLanguage["49"]={level:1,mean:"戰鬥",code:"a"};
arrLanguage["50"]={level:1,mean:"注意",code:"b"};
arrLanguage["51"]={level:1,mean:"物品",code:"c"};
arrLanguage["81"]={level:2,mean:"肯定",code:"1"};
arrLanguage["87"]={level:2,mean:"否定",code:"0"};
arrLanguage["aa"]={level:0,mean:"GOGOGO!!",code:null};
arrLanguage["a1"]={level:0,mean:"跟我來!!",code:null};
arrLanguage["a0"]={level:0,mean:"快跑!!",code:null};
arrLanguage["bb"]={level:0,mean:"有敵人!!",code:null};
arrLanguage["b1"]={level:0,mean:"警戒!!",code:null};
arrLanguage["b0"]={level:0,mean:"安全!!",code:null};
arrLanguage["cc"]={level:0,mean:"需要物品!!",code:null};
arrLanguage["c1"]={level:0,mean:"有多的物資!!",code:null};
arrLanguage["c0"]={level:0,mean:"沒有多的物資!!",code:null};







