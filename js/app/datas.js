var arrMap = new Array(); //地圖
var arrDoors = new Array(); //門資訊
var arrRoleType = new Array(); //角色類別
var arrItems = new Array(); //武器資訊
var arrSkills = new Array(); //人物技能
var arrSkillType = new Array(); //技能範圍區間
var arrLanguage = new Array(); //說話
var levelRange = new Array(); //等級區間
var arrMapType = new Array();



arrMap = [
    [{
        visible: true,
        room_id: "a",
        group: "1",
        maptype: 0,
    }, {
        visible: false,
        room_id: "b",
        group: null,
        maptype: 0,
    }, {
        visible: true,
        room_id: "c",
        group: "2",
        maptype: 6,
    }, {
        visible: true,
        room_id: "d",
        group: "2",
        maptype: 7,
    }],
    [{
        visible: true,
        room_id: "e",
        group: "3",
        maptype: 1,
    }, {
        visible: true,
        room_id: "f",
        group: "3",
        maptype: 2,
    }, {
        visible: true,
        room_id: "g",
        group: "2",
        maptype: 9,
    }, {
        visible: true,
        room_id: "h",
        group: "2",
        maptype: 8,
    }],
    [{
        visible: false,
        room_id: "i",
        group: null,
        maptype: 0,
    }, {
        visible: true,
        room_id: "j",
        group: "4",
        maptype: 0,
    }, {
        visible: false,
        room_id: "k",
        group: null,
        maptype: 0,
    }, {
        visible: true,
        room_id: "l",
        group: "5",
        maptype: 4,
    }],
    [{
        visible: true,
        room_id: "m",
        group: "6",
        maptype: 1,
    }, {
        visible: true,
        room_id: "o",
        group: "6",
        maptype: 3,
    }, {
        visible: true,
        room_id: "p",
        group: "6",
        maptype: 2,
    }, {
        visible: true,
        room_id: "q",
        group: "5",
        maptype: 5,
    }]
];

//口
arrMapType[0] = [
    [0, 1, 1, 2],
    [3, 4, 4, 5],
    [3, 4, 4, 5],
    [6, 7, 7, 8]
]

//|=
arrMapType[1] = [
    [0, 1, 1, 1],
    [3, 4, 4, 4],
    [3, 4, 4, 4],
    [6, 7, 7, 7]
];

//=|
arrMapType[2] = [
    [1, 1, 1, 2],
    [4, 4, 4, 5],
    [4, 4, 4, 5],
    [7, 7, 7, 8]
];

//=
arrMapType[3] = [
    [1, 1, 1, 1],
    [4, 4, 4, 4],
    [4, 4, 4, 4],
    [7, 7, 7, 7]
];

// ㄇ
arrMapType[4] = [
    [0, 1, 1, 2],
    [3, 4, 4, 5],
    [3, 4, 4, 5],
    [3, 4, 4, 5]
];

// 反ㄇ
arrMapType[5] = [
    [3, 4, 4, 5],
    [3, 4, 4, 5],
    [3, 4, 4, 5],
    [6, 7, 7, 8]
];

//|-
arrMapType[6] = [
    [0, 1, 1, 1],
    [3, 4, 4, 4],
    [3, 4, 4, 4],
    [3, 4, 4, 4]
];

//-|
arrMapType[7] = [
    [1, 1, 1, 2],
    [4, 4, 4, 5],
    [4, 4, 4, 5],
    [4, 4, 4, 5]
];

//_|
arrMapType[8] = [
    [4, 4, 4, 5],
    [4, 4, 4, 5],
    [4, 4, 4, 5],
    [7, 7, 7, 8]
];

//|_
arrMapType[9] = [
    [3, 4, 4, 4],
    [3, 4, 4, 4],
    [3, 4, 4, 4],
    [6, 7, 7, 7]
];











arrDoors = [{
        root_room: "a",
        passage: ["a", "e"],
        x: 80,
        y: 185,
        width: 30,
        height: 30,
        visible: true,
        open: true
    }, {
        root_room: "e",
        passage: ["e", "f"],
        x: 185,
        y: 85,
        width: 30,
        height: 30,
        visible: true,
        open: true
    }, {
        root_room: "f",
        passage: ["f", "j"],
        x: 80,
        y: 185,
        width: 30,
        height: 30,
        visible: true,
        open: true
    }, {
        root_room: "j",
        passage: ["j", "o"],
        x: 80,
        y: 185,
        width: 30,
        height: 30,
        visible: true,
        open: true
    }, {
        root_room: "o",
        passage: ["o", "m"],
        x: 0,
        y: 85,
        width: 30,
        height: 30,
        visible: true,
        open: true
    },

    {
        root_room: "o",
        passage: ["o", "p"],
        x: 185,
        y: 85,
        width: 30,
        height: 30,
        visible: true,
        open: true
    }, {
        root_room: "p",
        passage: ["p", "q"],
        x: 185,
        y: 85,
        width: 30,
        height: 30,
        visible: true,
        open: true
    }, {
        root_room: "q",
        passage: ["q", "l"],
        x: 85,
        y: 0,
        width: 30,
        height: 30,
        visible: true,
        open: true
    }, {
        root_room: "l",
        passage: ["h", "l"],
        x: 95,
        y: 0,
        width: 30,
        height: 30,
        visible: true,
        open: true
    }, {
        root_room: "h",
        passage: ["h", "d"],
        x: 95,
        y: 0,
        width: 30,
        height: 30,
        visible: true,
        open: true
    },

    {
        root_room: "h",
        passage: ["h", "g"],
        x: 0,
        y: 95,
        width: 30,
        height: 30,
        visible: true,
        open: true
    },

    {
        root_room: "c",
        passage: ["c", "d"],
        x: 185,
        y: 95,
        width: 30,
        height: 30,
        visible: true,
        open: true
    }, {
        root_room: "c",
        passage: ["c", "g"],
        x: 95,
        y: 185,
        width: 30,
        height: 30,
        visible: true,
        open: true
    }

]


arrRoleType = [{
    typeName: "Zombie",
    color: 0x33FFCC,
    skillTree: []
}, {
    typeName: "survivor",
    color: 0xFFFF00,
    skillTree: [
        [0],
        [10],
        [20, 30],
        [40, 50, 70]
    ]
}];

arrItems[0] = { //空物件
    category: "item",
    name: "empty",
    attackType: null,
    power: null,
    minRange: null,
    maxRange: null,
    successRange: null,
    numberOfAttack: null,
    dual: null
};

arrItems[1] = {
    category: "weapon",
    name: "pistal",
    attackType: "range",
    power: 1,
    minRange: 0,
    maxRange: 1,
    successRange: 4,
    numberOfAttack: 5,
    dual: true
};
arrItems[2] = {
    category: "weapon",
    name: "knife",
    attackType: "melee",
    power: 1,
    minRange: 0,
    maxRange: 0,
    successRange: 4,
    numberOfAttack: 2,
    dual: true
};
arrItems[3] = {
    category: "item",
    name: "food",
    attackType: "null",
    power: null,
    minRange: null,
    maxRange: null,
    successRange: null,
    numberOfAttack: null
};

/*
skill 狀態區分 0-10 一種狀態(range 加成) ......
0-9   | all combat  target
10-19 | all combat  success range
20-29 | melee  target
30-39 | melee  success range
40-49 | range  target
50-59 | range  success range
60-69 | range  max distance
70+   | sp attributes
*/
//combat target
arrSkills[0] = {
    name: "+1 target: Combat",
    value: 1
};
//combat success range
arrSkills[10] = {
    name: "+1 success range: Combat",
    value: 1
};
//melee target
arrSkills[20] = {
    name: "+1 target: Melee",
    value: 1
};
//melee success range
arrSkills[30] = {
    name: "+1 success range: Range",
    value: 1
};
//range  target
arrSkills[40] = {
    name: "+1 target: Range",
    value: 1
};
//range success range
arrSkills[50] = {
    name: "+1 success range: Range",
    value: 1
};
//range max distance 
arrSkills[60] = {
    name: "+1 max distance : Range",
    value: 1
};
//other
arrSkills[70] = {
    name: "sniper",
    value: null
};

/*技能範圍區間*/

arrSkillType["combatTarget"] = [0, 9];
arrSkillType["combatSuccessRange"] = [10, 19];
arrSkillType["meleeTarget"] = [20, 29];
arrSkillType["meleeSuccessRange"] = [30, 39];
arrSkillType["rangeTarget"] = [40, 49];
arrSkillType["rangeSuccessRange"] = [50, 59];
arrSkillType["rangeDistance"] = [60, 69];

/*level Range*/
levelRange = [0, 6, 18, 38];
/**/


arrLanguage["49"] = {
    level: 1,
    mean: "戰鬥",
    code: "a"
};
arrLanguage["50"] = {
    level: 1,
    mean: "注意",
    code: "b"
};
arrLanguage["51"] = {
    level: 1,
    mean: "物品",
    code: "c"
};
arrLanguage["81"] = {
    level: 2,
    mean: "肯定",
    code: "1"
};
arrLanguage["87"] = {
    level: 2,
    mean: "否定",
    code: "0"
};
arrLanguage["aa"] = {
    level: 0,
    mean: "GOGOGO!!",
    code: null
};
arrLanguage["a1"] = {
    level: 0,
    mean: "跟我來!!",
    code: null
};
arrLanguage["a0"] = {
    level: 0,
    mean: "快跑!!",
    code: null
};
arrLanguage["bb"] = {
    level: 0,
    mean: "有敵人!!",
    code: null
};
arrLanguage["b1"] = {
    level: 0,
    mean: "警戒!!",
    code: null
};
arrLanguage["b0"] = {
    level: 0,
    mean: "安全!!",
    code: null
};
arrLanguage["cc"] = {
    level: 0,
    mean: "需要物品!!",
    code: null
};
arrLanguage["c1"] = {
    level: 0,
    mean: "有多的物資!!",
    code: null
};
arrLanguage["c0"] = {
    level: 0,
    mean: "沒有多的物資!!",
    code: null
};
