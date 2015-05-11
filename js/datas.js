var arrMap = new Array(); //地圖
var arrDoors = new Array(); //門資訊
var arrRoleType = new Array(); //角色類別
var arrItems = new Array(); //武器資訊



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


arrItems[0] = {category:"weapon",name:"pistal",attackType:"range",power:1,minRange:0,maxRange:1,successRange:4,target:2};
arrItems[1] = {category:"weapon",name:"knife",attackType:"melee",power:1,minRange:0,maxRange:0,successRange:4,target:2};
arrItems[2] = {category:"item",name:"food",attackType:"null",power:null,minRange:null,maxRange:null,successRange:null,target:null};


