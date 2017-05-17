// ===== File globals.ts
//
// 'use strict';
"use strict";
(function (AgentStatus) {
    AgentStatus[AgentStatus["available"] = 1] = "available";
    AgentStatus[AgentStatus["busy"] = 2] = "busy";
    AgentStatus[AgentStatus["away"] = 3] = "away";
    AgentStatus[AgentStatus["offline"] = 0] = "offline";
})(exports.AgentStatus || (exports.AgentStatus = {}));
var AgentStatus = exports.AgentStatus;
(function (UserType) {
    UserType[UserType["teacher"] = 1] = "teacher";
    UserType[UserType["student"] = 2] = "student";
})(exports.UserType || (exports.UserType = {}));
var UserType = exports.UserType;
exports.HomeData = [{ title: "I1", content: "iiii", img: "assets/img/news/Untitled.png" },
    { title: "I2", content: "iii1", img: "assets/img/news/Untitled1.png" },
    { title: "I3", content: "iii3", img: "assets/img/news/Untitled2.png" }];
exports.Logos = [{ title: "SE", logo: "assets/img/logos/se.png", page_id: 1 },
    { title: "VT", logo: "assets/img/logos/se.png", page_id: 2 },
    { title: "IUE", logo: "assets/img/logos/se.png", page_id: 3 },
    { title: "IUC", logo: "assets/img/logos/se.png", page_id: 4 },
    { title: "OC", logo: "assets/img/logos/se.png", page_id: 5 },
    { title: "M", logo: "assets/img/logos/se.png", page_id: 6 },
    { title: "SR", logo: "assets/img/logos/se.png", page_id: 7 },
];
exports.iuInfo = [{ title: "title1", logo: "assets/img/logos/se.png", page_id: 1 },
    { title: "title2", logo: "assets/img/logos/se.png", page_id: 2 },
];
