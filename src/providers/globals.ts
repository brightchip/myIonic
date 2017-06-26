
// ===== File globals.ts
//
// 'use strict';

export const baseUrl = 'http://192.168.0.107:3000';
export const wsUrl = 'ws://192.168.0.107:3000';

export const IMAGE_DIR_NAME = 'user_data';
export const AUDIO_DIR_NAME = 'audios';


 export enum
  AgentStatus {
  available = 1
,
  busy = 2
,
  away = 3
,
  offline = 0
}
export enum UserType {  // userType: number= 1;//1-student ,2-parents , 3-teacher ,
   student = 1,
     parent = 2,
   teacher = 3,
   admin = 110
}


export const HomeData:any []= [{title:"I1",content:"iiii",img:"assets/img/news/Untitled.png"},
  {title:"I2",content:"iii1",img:"assets/img/news/Untitled1.png"},
  {title:"I3",content:"iii3",img:"assets/img/news/Untitled2.png"}];

export const Logos:any []= [{title:"特色英语",logo:"assets/img/logos/se.png",page_id:1},
  {title:"度假游学",logo:"assets/img/logos/se.png",page_id:2},
  {title:"爱侑教育",logo:"assets/img/logos/se.png",page_id:3},
  {title:"哎呦社区",logo:"assets/img/logos/se.png",page_id:4},
  {title:"在下课程",logo:"assets/img/logos/se.png",page_id:5},
  {title:"商城",logo:"assets/img/logos/se.png",page_id:6},
  {title:"名校推荐",logo:"assets/img/logos/se.png",page_id:7},
];

export const iuInfo:any []= [{title:"title1",logo:"assets/img/logos/se.png",page_id:1},
  {title:"title2",logo:"assets/img/logos/se.png",page_id:2},
];




