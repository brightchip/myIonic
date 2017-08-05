/**
 * Created by Winjoy on 5/27/2017.
 */
import { Injectable } from '@angular/core';
import {Events, Platform} from 'ionic-angular';

import {SQLite, StatusBar} from "ionic-native";
import {NativeService} from "./mapUtil";

@Injectable()
export class DBHelper {

  arrMessages?: any;
  public testVar: string;
  hasInitialized = false;
  db:any;


  // vacabularys = [];
  vacabularys:any[] =
    [{vocabulary_id:1,pronunciation:"a-in-z",word:"Anz",mean:"安银子",audio:"",audio_url:"http://api.wordnik.com/v4/audioFile.mp3/3e7145666db9d2ddd47fb6402d26bb263abaf8b4c98ed5337bf0b16ed4d35cb1",explain_img:"assets/img/speakers/bear.jpg",recite_count:0,recite_wrong_times:0},
    {vocabulary_id:2,pronunciation:"bi-sho-jo",word:"lion",mean:"美少女",audio:"",audio_url:"http://api.wordnik.com/v4/audioFile.mp3/841109043745af50f206ca38d712e66b46c3d26075fcf28c575ed1b7cd99adee",explain_img:"assets/img/speakers/lion.jpg",recite_count:0,recite_wrong_times:0},
    {vocabulary_id:3,pronunciation:"c",word:"mouse",mean:"我顶",audio:"",audio_url:"http://api.wordnik.com/v4/audioFile.mp3/841109043745af50f206ca38d712e66b46c3d26075fcf28c575ed1b7cd99adee",explain_img:"assets/img/speakers/mouse.jpg",recite_count:0,recite_wrong_times:0},
    {vocabulary_id:4,pronunciation:"benglishjo",word:"english",mean:"英语",audio:"",audio_url:"http://api.wordnik.com/v4/audioFile.mp3/841109043745af50f206ca38d712e66b46c3d26075fcf28c575ed1b7cd99adee",explain_img:"assets/img/speakers/cheetah.jpg",recite_count:0,recite_wrong_times:0},
    {vocabulary_id:5,pronunciation:"fantasyo",word:"elephant",mean:"幻想",audio:"",audio_url:"http://api.wordnik.com/v4/audioFile.mp3/841109043745af50f206ca38d712e66b46c3d26075fcf28c575ed1b7cd99adee",explain_img:"assets/img/speakers/elephant.jpg",recite_count:0,recite_wrong_times:0},
    {vocabulary_id:6,pronunciation:"cat",word:"Cat",mean:"猫",audio:"",audio_url:"http://api.wordnik.com/v4/audioFile.mp3/f443d5d1ca81dbaf766d9f01e6a78d24045553f3d8b648ca8a2f1bc952b668b5",explain_img:"assets/img/speakers/duck.jpg",recite_count:0,recite_wrong_times:0}]

  constructor(public events: Events,
              public nativeServic:NativeService,
              public platform: Platform,) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
      this.db = new SQLite();
      this.db.openDatabase({
        name: "data.db",
        location: "default"
      }).then(() => {
      this.initDb().then( _ => {
        this.events.publish('db:init');
      })

      }, (error) => {
        console.error("Unable to open database", error);
      });
    }).catch( err => {
      console.error("create table",err);
    })
  }


  initDb():Promise<any>{
    let arrPromise = [];
    let promise1 =   this.createTable("CREATE TABLE IF NOT EXISTS tb_user (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER UNIQUE, avatar TEXT,user_name TEXT,phone TEXT)")
      .then( result => Promise.resolve(result) )
      .catch( error => Promise.resolve( [] ) );
    arrPromise.push(promise1);
    let promise2 =    this.createTable("CREATE TABLE IF NOT EXISTS tb_chat (id INTEGER PRIMARY KEY AUTOINCREMENT, sender_id INTEGER, receiver_id INTEGER,chatdatas VARCHAR(255))")
      .then( result => Promise.resolve(result) )
      .catch( error => Promise.resolve( [] ) );
    arrPromise.push(promise2);
    let promise3 =    this.createTable("CREATE TABLE IF NOT EXISTS tb_lesson (id INTEGER PRIMARY KEY AUTOINCREMENT, lesson_id INTEGER UNIQUE,created_date DATETIME, lesson_name TEXT,teacher_id INTEGER,modified_date DATETIME,lesson_order INTEGER,book_id INTEGER,vocabulary VARCHAR(255))")
      .then( result => Promise.resolve(result) )
      .catch( error => Promise.resolve( [] ) );
    arrPromise.push(promise3);
    let promise4 =   this.createTable("CREATE TABLE IF NOT EXISTS tb_vocabulary (id INTEGER PRIMARY KEY AUTOINCREMENT, vocabulary_id INTEGER UNIQUE,word TEXT,mean TEXT, pronunciation TEXT,lesson_id INTEGER,explain TEXT,explain_img TEXT,audio TEXT,audio_url TEXT,recite_wrong_times INTEGER DEFAULT 0)")
      .then( result => Promise.resolve(result) )
      .catch( error => Promise.resolve( [] ) );
    arrPromise.push(promise4);
    let promise5 =   this.createTable("CREATE TABLE IF NOT EXISTS tb_book (id INTEGER PRIMARY KEY AUTOINCREMENT, book_id  INTEGER UNIQUE,book_name TEXT,book_profile TEXT, book_author TEXT,book_remark TEXT,timespan INTEGER,created_date DATETIME,modified_date DATETIME,intro_video TEXT)")
      .then( result => Promise.resolve(result) )
      .catch( error => Promise.resolve( [] ) );
    arrPromise.push(promise5);
    let promise6 =   this.createTable("CREATE TABLE IF NOT EXISTS tb_vocabulary_result (id INTEGER PRIMARY KEY AUTOINCREMENT, lesson_id  INTEGER UNIQUE,wrong_times INTEGER,created_date DATETIME)")
      .then( result => Promise.resolve(result) )
      .catch( error => Promise.resolve( [] ) );
    arrPromise.push(promise6);

    return   Promise.all(arrPromise).then(data => {
      console.log("initDb",)
      return true;
    }, err => {
      console.error("initDb" , err);
      return false;
    });
  }

  getUserInfo(user_id):Promise<any>{
    return this.platform.ready().then(() => {

      if(!this.nativeServic.isMobile()){
        return {};
      }

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

      if(!this.nativeServic.isMobile()){
        return [];
      }

      let query = "SELECT * FROM tb_vocabulary WHERE lesson_id = ?";
      return this.db.openDatabase({
        name: "data.db",
        location: "default"
      }).then(() => {
        return this.db.executeSql(query, [lesson_id])
          .then(function (res) {
            let vocabulary = [];
            if (res.rows.length > 0) {
              for (var i = 0; i < res.rows.length; i++) {
                vocabulary.push(res.rows.item(i));
              }
              console.log("SELECTED -> " + res.rows);
            } else {
              console.log("No results found");
            }

            return vocabulary;
          }, function (err) {
            // console.error(err);
            throw err;
          });
      }).catch(err => {
        throw err;
      })
    }).catch( err => {
      // console.error(err);
      throw err;
    })
  }

  getCoolPlayVocabularys(lesson_id):Promise<any>{
    return this.platform.ready().then(() => {

      if(!this.nativeServic.isMobile()){
        return [];
      }

      let query = "SELECT * FROM tb_vocabulary WHERE lesson_id = ?";
      return this.db.openDatabase({
        name: "data.db",
        location: "default"
      }).then(() => {
        return this.db.executeSql(query, [lesson_id])
          .then(function (res) {
            let vocabulary = [];
            if (res.rows.length > 0) {
              for (var i = 0; i < res.rows.length; i++) {
                vocabulary.push(res.rows.item(i));
              }
              console.log("SELECTED -> " , vocabulary);
            } else {
              console.log("No results found");
            }

            return vocabulary;
          }, function (err) {
            // console.error(err);

            throw err;
          });
      }).catch(err => {
        throw err;
      })
    }).catch( err => {
      // console.error(err);
      throw err;
    })
  }

  getRandomRows(vocabulary):Promise<any>{
    console.log("getRandomRows")
    return this.platform.ready().then(() => {
      if(!this.nativeServic.isMobile()){
        return [this.vacabularys[0],this.vacabularys[1],this.vacabularys[2],this.vacabularys[3]];
      }

      let query = "SELECT *  FROM tb_vocabulary  WHERE vocabulary_id != ?  ORDER BY RANDOM() LIMIT 3";
      return this.db.openDatabase({
        name: "data.db",
        location: "default"
      }).then(() => {
        let self = this;
        return this.db.executeSql(query, [vocabulary.vocabulary_id])
          .then(function (res) {
            let vocabularies = [];
            vocabularies.push(vocabulary);
            if (res.rows.length > 0) {
              for (var i = 0; i < res.rows.length; i++) {
                vocabularies.push(res.rows.item(i));
              }
              console.log("getRandomRows SELECTED -> " ,vocabularies);
            } else {
              console.log("getRandomRows No results found");
            }

            return self.shuffle(vocabularies);
          }, function (err) {
            // console.error(err);
            // throw err;
            let tmp = [this.vacabularys[0], this.vacabularys[3], this.vacabularys[5], vocabulary]
            return self.shuffle(tmp);
          });
      }).catch( err => {
        // console.error(err);
        // throw err;
        let tmp =  [this.vacabularys[0],this.vacabularys[3],this.vacabularys[5],vocabulary]
        console.log("getRandomRows error occured then return default",err)
        return this.shuffle(tmp);
      })
    }).catch( err => {
      // console.error(err);
      // throw err;
      let tmp =  [this.vacabularys[0],this.vacabularys[3],this.vacabularys[5],vocabulary]
      console.log("getRandomRows error occured then return default",err)
      return this.shuffle(tmp);
    })
  }

  getVocabulary(vocabulary_id):Promise<any>{
    console.log("getVocabulary")
    return this.platform.ready().then(() => {
      if(!this.nativeServic.isMobile()){
        return;
      }
      let query = "SELECT * FROM tb_vocabulary WHERE vocabulary_id=?";
      return this.db.openDatabase({
        name: "data.db",
        location: "default"
      }).then(() => {
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
    }).catch( err => {
      // console.error(err);
      throw err;
    })
  }

  getTestResult(lesson_id) {
    console.log("getTestResult,update in local sqlite")
    return this.platform.ready().then(() => {
      if(!this.nativeServic.isMobile()){
        return;
      }
      let query = "SELECT * FROM tb_vocabulary_result  WHERE lesson_id=? ORDER BY created_date DESC";
      return this.db.openDatabase({
        name: "data.db",
        location: "default"
      }).then(() => {
        return this.db.executeSql(query, [lesson_id])
          .then(function (res) {
            let results = [];
            if (res.rows.length > 0) {
              for (var i = 0; i < res.rows.length; i++) {
                results.push(res.rows.item(i));
              }
            } else {
              console.log("No results found");
            }
            return results;
          }, function (err) {
            // console.error(err);
            throw err;
          }).catch(err => {
            console.error(err);
            throw err;
            // throw err;
          })
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
        if(!this.nativeServic.isMobile()){
          return;
        }
         let query = "INSERT INTO tb_vocabulary_result (lesson_id,created_date,wrong_times) VALUES (?,?,?)";
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
        if(!this.nativeServic.isMobile()){
          return;
        }
      return this.getVocabulary(vocabulary.vocabulary_id)
        .then( (vocabularyOld) => {
          let query = "";
          let parameters = [];
          if (Object.keys(vocabularyOld).length === 0 && vocabularyOld.constructor === Object) {
            query = "INSERT INTO tb_vocabulary (vocabulary_id, word,pronunciation,lesson_id,audio,explain,explain_img) VALUES (?,?,?,?,?,?,?) ";
            parameters = [vocabulary.vocabulary_id, vocabulary.word, vocabulary.pronunciation, vocabulary.lesson_id, vocabulary.audio, vocabulary.explain, vocabulary.explain_img]
          } else {
            query = "UPDATE tb_vocabulary SET vocabulary_id=?,word=?,pronunciation=?,lesson_id=?,audio=?,explain=?,explain_img=?  where vocabulary_id=?"
            parameters = [vocabulary.vocabulary_id, vocabulary.word, vocabulary.pronunciation, vocabulary.lesson_id, vocabulary.audio, vocabulary.explain, vocabulary.explain_img,vocabulary.vocabulary_id]

          }
          return this.db.openDatabase({
            name: "data.db",
            location: "default"
          }).then(() => {
            this.db.executeSql(query,parameters )
              .then(function (res) {
                console.log("updateVocabulary", res.rows.item(0))
                return true;
              }, function (err) {
                // console.error(err);

                console.error(err);
              });
          })
        }).catch( err => {
            console.error(err);
            // throw err;
          })

    }).catch( err => {
      console.error(err);
      // throw err;
    })
  }

  updateUserInfo(userInfo):Promise<any>{
    console.log("updateUserInfo,update in local sqlite")
    return this.platform.ready().then(() => {
      if(!this.nativeServic.isMobile()){
        return;
      }
     return this.getUserInfo(userInfo.user_id)
       .then( (userInfoOld) => {
        let query = "";
        let parameters = [];
         if(Object.keys(userInfoOld).length === 0 && userInfoOld.constructor === Object){
          query = "INSERT INTO tb_user (user_id, user_name,avatar,phone) VALUES (?,?,?,?)";
          parameters =  [userInfo.user_id,userInfo.user_name,userInfo.avatar,userInfo.phone]
        }else {
          query = "UPDATE tb_user SET user_id=?,user_name=?,avatar=?,phone=? where user_id=?"
           parameters =  [userInfo.user_id,userInfo.user_name,userInfo.avatar,userInfo.phone,userInfo.user_id]
        }

        this.db.executeSql( query,parameters )
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

  createTable(sqlStatement):Promise<any>{
   return this.db.executeSql(sqlStatement, {}).then((data) => {
      console.log("TABLE CREATED: ", data);
     return data;
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


  updateLesson(lessonInfo):Promise<any>{
    console.log("updateLesson,update in local sqlite")
    return this.platform.ready().then(() => {
      if(!this.nativeServic.isMobile()){
        return;
      }
      return this.getLessonInfo(lessonInfo.lesson_id)
        .then( (lessonInfoOld) => {
          let query = "";
          let parameters = [];
          if(Object.keys(lessonInfoOld).length === 0 && lessonInfoOld.constructor === Object){
            query = "INSERT INTO tb_lesson(lesson_id,book_id,lesson_name,lesson_order,created_date) VALUES(?,?,?,?,?)";
            parameters = [lessonInfo.lesson_id,lessonInfo.book_id,lessonInfo.lesson_name,lessonInfo.lesson_order,lessonInfo.date]
          }else {
            query = "UPDATE tb_lesson SET lesson_id=?,book_id=?,lesson_name=?,lesson_order=?,modified_date=? where lesson_id=?"
            parameters = [lessonInfo.lesson_id,lessonInfo.book_id,lessonInfo.lesson_name,lessonInfo.lesson_order,lessonInfo.date,lessonInfo.lesson_id]

          }
          console.log("updateLesson,executeSql",query)
          this.db.executeSql( query,parameters )
            .then(function(res) {
              console.log("updateLesson,executeSql",res)
              return true;
            }, function (err) {
              console.error("updateLesson,executeSql",err)
              // console.error(err);
              throw err;
            });
        })
    }).catch( err => {
      console.error(err);
      // throw err;
    })

  }

  updateBook(bookInfo):Promise<any>{
    return this.platform.ready().then(() => {
      if(!this.nativeServic.isMobile()){
        return;
      }
      return this.db.openDatabase({
        name: "data.db",
        location: "default"
      }).then(() => {
        return this.getBookInfo(bookInfo.book_id)
          .then((lessonInfoOld) => {
            let query = "";
            if (Object.keys(lessonInfoOld).length === 0 && lessonInfoOld.constructor === Object) {
              query = "INSERT INTO tb_book(book_id,book_name,book_profile, book_author,book_remark,timespan,created_date,intro_video) values(?, ?, ?, ?,?,?,?,?) RETURNING *";
            } else {
              query = "UPDATE tb_book SET book_id=$1,book_name=$2,book_profile=$3,book_author=$4,book_remark=$5,timespan=$6,modified_date=$7,intro_video=$8 where book_id=$1"
            }

            console.log("updateBook,update in local sqlite",query)
            this.db.executeSql(query, [bookInfo.book_id, bookInfo.book_name, bookInfo.book_profile, bookInfo.book_author, bookInfo.book_remark, bookInfo.timespan, bookInfo.modified_date, bookInfo.intro_video])
              .then(function (res) {
                console.log("updateBook,update in local sqlite", res)
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
    }).catch( err => {
      console.error(err);
      // throw err;
    })
  }

  getLessons(book_id: any):Promise<any> {
    return this.platform.ready().then(() => {
      if(!this.nativeServic.isMobile()){
        return [];
      }
      let query = "SELECT * FROM tb_lesson where book_id=? ORDER BY lesson_order";
      return this.db.executeSql(query,[book_id])
        .then(function (res) {
          console.log("getLessons",res);
          let lessons = [];
          if (res.rows.length > 0) {
            for(var i = 0; i < res.rows.length; i++) {
              lessons.push(res.rows.item(i));
            }
            console.log("SELECTED -> " + res.rows);
          } else {
            console.log("No results found");
          }

          return lessons;
        }, function (err) {
          // console.error(err);
          throw err;
        });
    }).catch( err => {
      // console.error(err);
      throw err;
    })
  }

  getBooks() :Promise<any>{
    return this.platform.ready().then(() => {
      if(!this.nativeServic.isMobile()){
        return [];
      }else{
        let query = "SELECT * FROM tb_book";
        console.log("getBooks",query);
        // this.db = new SQLite();
        return this.db.openDatabase({
          name: "data.db",
          location: "default"
        }).then(() => {
          return this.db.executeSql(query, [])
            .then(function (res) {
              let books = [];
              if (res.rows.length > 0) {

                  for(var i = 0; i < res.rows.length; i++) {
                    books.push(res.rows.item(i));
                  }

                // books = res.rows;
                console.log("SELECTED -> " + books);
              } else {
                console.log("No results found");
              }
              return books;
            }, function (err) {
              // console.error(err);
              throw err;
            });
        }).catch( e => {
          console.error("getBooks",e);
        })
      }
    }).catch( err => {
      // console.error(err);
      throw err;
    })
  }


  getBookInfo(book_id: any) :Promise<any>{
    return this.platform.ready().then(() => {
      if(!this.nativeServic.isMobile()){
        return {};
      }
      let query = "SELECT * FROM tb_book WHERE book_id = ?";
      return this.db.executeSql(query, [book_id])
        .then(function (res) {
          let bookInfo = {};
          if (res.rows.length > 0) {
            bookInfo = res.rows.item(0);
            console.log("SELECTED -> " + res.rows.item(0));
          } else {
            console.log("No results found");
          }

          return bookInfo;
        }, function (err) {
          // console.error(err);
          throw err;
        });
    }).catch( err => {
      // console.error(err);
      throw err;
    })
  }

   getLessonInfo(lesson_id: any) :Promise<any>{
    return this.platform.ready().then(() => {
      if(!this.nativeServic.isMobile()){
        return {};
      }
      let query = "SELECT * FROM tb_lesson WHERE lesson_id = ?";
      return this.db.executeSql(query, {lesson_id})
        .then(function (res) {
          let lessonInfo = {};
          if (res.rows.length > 0) {
            lessonInfo = res.rows.item(0);
            console.log("SELECTED -> " + res.rows.item(0));
          } else {
            console.log("No results found");
          }

          return lessonInfo;
        }, function (err) {
          // console.error(err);
          throw err;
        });
    }).catch( err => {
      // console.error(err);
      throw err;
    })
  }


  deleteItem(tableName,data: any) {
    return this.platform.ready().then(() => {
      let query = "";
      if (tableName == "tb_book") {
        query = "DELETE FROM " + tableName + " WHERE book_id = " + data.book_id;
      } else if (tableName == "tb_lesson") {
        query = "DELETE FROM " + tableName + " WHERE lesson_id = " + data.lesson_id;
      } else if (tableName == "tb_vocabulary") {
        query = "DELETE FROM " + tableName + " WHERE vocabulary_id = " + data.vocabulary_id;
      } else {
        return;
      }
      console.log("deleteItem", query)
      return this.db.openDatabase({
        name: "data.db",
        location: "default"
      }).then(() => {
      return this.db.executeSql(query, [])
        .then(function (res) {

          return true;
        }, function (err) {
          // console.error(err);
          console.error("deleteItem", err)
          // throw err;
        });
    }).catch( err => {
      console.error(err);
      // throw err;
    })
    }).catch( err => {
      // console.error(err);
      console.error("deleteItem",err)
      // throw err;
    })
  }


}
