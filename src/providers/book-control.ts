/**
 * Created by Winjoy on 5/19/2017.
 */
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import {httpEntity} from "./httpEntity";
import * as Enums from "./globals";
import {UserData} from "./user-data";
import {Events} from "ionic-angular";
import {Tools} from "./tools";
import {Auth} from "./auth";


@Injectable()
export class BookControl {

  BASE_URL = Enums.baseUrl + "/userRouter/";

  constructor(public httpTools: httpEntity, public storage: Storage,public events:Events,private tools:Tools,public auth:Auth) {

  }





}
