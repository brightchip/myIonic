/**
 * Created by Winjoy on 5/27/2017.
 */
import { Injectable } from '@angular/core';
import {Events, Platform} from 'ionic-angular';

import {SQLite, StatusBar} from "ionic-native";

@Injectable()
export class DBHelper {

  arrMessages?: any;
  public testVar: string;
  hasInitialized = false;
  db:any;

  vacabularys:any[] =
    [{vocabulary_id:1,pronunciation:"a-in-z",word:"Anz",mean:"安银子",audio:"",audio_url:"http://api.wordnik.com/v4/audioFile.mp3/3e7145666db9d2ddd47fb6402d26bb263abaf8b4c98ed5337bf0b16ed4d35cb1",img_url:"assets/img/speakers/bear.jpg",recite_count:0,recite_wrong_times:0},
    {vocabulary_id:2,pronunciation:"bi-sho-jo",word:"lion",mean:"美少女",audio:"",audio_url:"http://api.wordnik.com/v4/audioFile.mp3/841109043745af50f206ca38d712e66b46c3d26075fcf28c575ed1b7cd99adee",img_url:"assets/img/speakers/lion.jpg",recite_count:0,recite_wrong_times:0},
    {vocabulary_id:3,pronunciation:"c",word:"mouse",mean:"我顶",audio:"",audio_url:"http://api.wordnik.com/v4/audioFile.mp3/841109043745af50f206ca38d712e66b46c3d26075fcf28c575ed1b7cd99adee",img_url:"assets/img/speakers/mouse.jpg",recite_count:0,recite_wrong_times:0},
    {vocabulary_id:4,pronunciation:"benglishjo",word:"english",mean:"英语",audio:"",audio_url:"http://api.wordnik.com/v4/audioFile.mp3/841109043745af50f206ca38d712e66b46c3d26075fcf28c575ed1b7cd99adee",img_url:"assets/img/speakers/cheetah.jpg",recite_count:0,recite_wrong_times:0},
    {vocabulary_id:5,pronunciation:"fantasyo",word:"elephant",mean:"幻想",audio:"",audio_url:"http://api.wordnik.com/v4/audioFile.mp3/841109043745af50f206ca38d712e66b46c3d26075fcf28c575ed1b7cd99adee",img_url:"assets/img/speakers/elephant.jpg",recite_count:0,recite_wrong_times:0},
    {vocabulary_id:6,pronunciation:"cat",word:"Cat",mean:"猫",audio:"",audio_url:"http://api.wordnik.com/v4/audioFile.mp3/f443d5d1ca81dbaf766d9f01e6a78d24045553f3d8b648ca8a2f1bc952b668b5",img_url:"assets/img/speakers/duck.jpg",recite_count:0,recite_wrong_times:0}]

  constructor(public events: Events,
              public platform: Platform,) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
      this.db = new SQLite();
      this.db.openDatabase({
        name: "data.db",
        location: "default"
      }).then(() => {
        this.createTable("CREATE TABLE IF NOT EXISTS tb_user (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER UNIQUE, avatar TEXT,user_name TEXT,phone TEXT)");
        this.createTable("CREATE TABLE IF NOT EXISTS tb_chat (id INTEGER PRIMARY KEY AUTOINCREMENT, sender_id INTEGER, receiver_id INTEGER,chatdatas VARCHAR(255))");
        this.createTable("CREATE TABLE IF NOT EXISTS tb_lesson (id INTEGER PRIMARY KEY AUTOINCREMENT, lesson_id INTEGER,created_date DATETIME, lesson_name TEXT,teacher_id INTEGER,book_id INTEGER,vocabulary VARCHAR(255))");
        this.createTable("CREATE TABLE IF NOT EXISTS tb_vocabulary (id INTEGER PRIMARY KEY AUTOINCREMENT, vocabulary_id INTEGER,word TEXT,mean TEXT, pronunciation TEXT,lesson_id INTEGER,audio TEXT,audio_url TEXT)");
      }, (error) => {
        console.error("Unable to open database", error);
      });
    }).catch( err => {
      console.error(err);
    })

  }

  getUserInfo(user_id):Promise<any>{
    return this.platform.ready().then(() => {
      let query = "SELECT * FROM tb_user WHERE user_id = ?";
      return this.db.executeSql(query, [user_id])
        .then(function (res) {
          let userInfo = {};
          if (res.rows.length > 0) {
            userInfo = res.rows.item(0);
            console.log("SELECTED -> " + res.rows.item(0));
          } else {
            console.log("No results found");
          }

          return userInfo;
        }, function (err) {
          // console.error(err);
          throw err;
        });
    }).catch( err => {
      // console.error(err);
      throw err;
    })
  }

  getVocabularys(lesson_id):Promise<any>{
    return this.platform.ready().then(() => {
      return this.vacabularys;
    //   let query = "SELECT * FROM tb_vocabulary WHERE lesson_id = ?";
    //   return this.db.executeSql(query, [lesson_id])
    //     .then(function (res) {
    //       let vocabulary = [];
    //       if (res.rows.length > 0) {
    //         vocabulary = res.rows;
    //         console.log("SELECTED -> " + res.rows);
    //       } else {
    //         console.log("No results found");
    //       }
    //
    //       return vocabulary;
    //     }, function (err) {
    //       // console.error(err);
    //       throw err;
    //     });
    }).catch( err => {
      // console.error(err);
      throw err;
    })
  }

  getCoolPlayVocabularys(lesson_id):Promise<any>{
    return this.platform.ready().then(() => {
      return this.vacabularys;
      //   let query = "SELECT * FROM tb_vocabulary WHERE lesson_id = ?";
      //   return this.db.executeSql(query, [lesson_id])
      //     .then(function (res) {
      //       let vocabulary = [];
      //       if (res.rows.length > 0) {
      //         vocabulary = res.rows;
      //         console.log("SELECTED -> " + res.rows);
      //       } else {
      //         console.log("No results found");
      //       }
      //
      //       return vocabulary;
      //     }, function (err) {
      //       // console.error(err);
      //       throw err;
      //     });
    }).catch( err => {
      // console.error(err);
      throw err;
    })
  }

  getRandomRows(vocabulary):Promise<any>{
    console.log("getRandomRows")
    return this.platform.ready().then(() => {
     let tmp =  [this.vacabularys[0],this.vacabularys[3],this.vacabularys[5],vocabulary]

      return this.shuffle(tmp);

    //   let query = "SELECT *  FROM tb_vocabulary ORDER BY RAND() LIMIT 3 WHERE vocabulary_id != ?";
    //   return this.db.executeSql(query, [vocabulary_id])
    //     .then(function (res) {
    //       let vocabularies = {};
    //       if (res.rows.length > 0) {
    //         vocabularies = res.rows;
    //         console.log("SELECTED -> " + vocabularies);
    //       } else {
    //         console.log("No results found");
    //       }
    //
    //       return vocabularies;
    //     }, function (err) {
    //       // console.error(err);
    //       throw err;
    //     });
    // }).catch( err => {
    //   // console.error(err);
    //   throw err;
    })
  }

  getVocabulary(vocabulary_id):Promise<any>{
    console.log("getVocabulary")
    return this.platform.ready().then(() => {
      let query = "SELECT * FROM tb_vocabulary WHERE vocabulary_id=$1";
      return this.db.executeSql(query, [vocabulary_id])
        .then(function (res) {
          let vocabulary = {};
          if (res.rows.length > 0) {
            vocabulary = res.rows.item(0);
            console.log("SELECTED -> " + res.rows.item(0));
          } else {
            console.log("No results found");
          }

          return vocabulary;
        }, function (err) {
          // console.error(err);
          throw err;
        });
    }).catch( err => {
      // console.error(err);
      throw err;
    })
  }

  getTestResult(lesson_id) {
    console.log("getTestResult,update in local sqlite")
    return this.platform.ready().then(() => {
      let query = "SELECT * FROM tb_vocabulary_result  WHERE lesson_id=$1 ORDER BY created_date DESC";
      return  this.db.executeSql( query, [lesson_id])
        .then(function(res) {
          return res.rows.item(0);
        }, function (err) {
          // console.error(err);
          throw err;
        }).catch( err => {
        console.error(err);
        throw err;
        // throw err;
      })
    })
  }

  addTestResult(result: { lesson_id: number; created_date: Date; wrong_times: (number | any) }) {
    console.log("addTestResult",result)
    return this.platform.ready().then(() => {
         let query = "INSERT INTO tb_vocabulary_result (lesson_id,created_date,wrong_times) VALUES ($1,$2,$3)";
          this.db.executeSql( query, [result.lesson_id,result.created_date,result.wrong_times])
            .then(function(res) {
              return true;
            }, function (err) {
              // console.error(err);
              throw err;
      }).catch( err => {
        console.error(err);
        // throw err;
      })
    })
  }

  updateVocabulary(vocabulary):Promise<any>{
    console.log("updateVocabulary,update in local sqlite")
    return this.platform.ready().then(() => {
      return this.getUserInfo(vocabulary.vocabulary_id)
        .then( (vocabularyOld) => {
          let query = "";
          if(vocabularyOld.length <0){
            query = "INSERT INTO tb_vocabulary (vocabulary_id, word,pronunciation,lesson_id,audio) VALUES ($1,$2,$3,$4,$5)";
          }else {
            query = "UPDATE tb_vocabulary SET vocabulary_id=$1,word=$2,pronunciation=$3,lesson_id=$4,audio=$5 where vocabulary_id=$1"
          }

          this.db.executeSql( query, [vocabulary.vocabulary_id,vocabulary.word,vocabulary.pronunciation,vocabulary.lesson_id,vocabulary.audio])
            .then(function(res) {

              return true;
            }, function (err) {
              // console.error(err);

              throw err;
            });
        })
    }).catch( err => {
      console.error(err);
      // throw err;
    })
  }

  updateUserInfo(userInfo):Promise<any>{
    console.log("updateUserInfo,update in local sqlite")
    return this.platform.ready().then(() => {
     return this.getUserInfo(userInfo.user_id)
       .then( (userInfoOld) => {
        let query = "";
        if(userInfoOld.length <0){
          query = "INSERT INTO tb_user (user_id, user_name,avatar,phone) VALUES ($1,$2,$3,$4)";
        }else {
          query = "UPDATE tb_user SET user_id=$1,user_name=$2,avatar=$3,phone=$4 where user_id=$1"
        }

        this.db.executeSql( query, [userInfo.user_id,userInfo.user_name,userInfo.avatar,userInfo.phone])
          .then(function(res) {

            return true;
          }, function (err) {
            // console.error(err);

            throw err;
          });
      })
    }).catch( err => {
    console.error(err);
      // throw err;
  })

  }

  createTable(sqlStatement){
    this.db.executeSql(sqlStatement, {}).then((data) => {
      console.log("TABLE CREATED: ", data);
    }, (error) => {
      console.error("Unable to execute sql", error);
      throw error;
    })
  }



  shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }



}
