/**
 * Created by Winjoy on 4/20/2017.
 */
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class httpEntity{
  http:any;
  baseUrl: String;

  constructor(http:Http){
    this.http = http;
    // this.baseUrl = 'https://www.reddit.com/r';
  }

  sendGet(url,headers){
    return this.http.get(url, headers) .timeout(5000).map(res => res.json());
  }

  sendPost(url,data,headers){
    return  this.http.post(url,data,  headers) .timeout(5000);
  }





}
