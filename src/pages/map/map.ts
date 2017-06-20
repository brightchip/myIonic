import { Component, ViewChild, ElementRef } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';

import { Platform } from 'ionic-angular';
import {NativeService} from "../../providers/mapUtil";


declare var google: any;



@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('mapCanvas') mapElement: ElementRef;
  private map: any;
  hintMsg :any = "";
  toolBar: any;
  targetPosition:any = "";
  shouldShowCancel = false;

  arrSchoolPositions = ["湖南省长沙市雨花区圭塘湘核佳苑","湖南省长沙市雨花区万科金域华府","湖南省长沙市雨花区雨花广场"]
  constructor(public confData: ConferenceData, public platform: Platform,public nativeService:NativeService) {
  }

  ionViewDidLoad() {
    this.doAutoNav();
    this.loadMap()
    this.findSchools();
  }

  doAutoNav(){
    console.log("doAutoNav")
    this.nativeService.getUserLocation().then(location => {
      // if(!location){
      //   this.map.setCenter()
      //   return;
      // }
      console.log("getUserLocation autonav",location);
      this.regeocoder([location.lng,location.lat])
      this.map.setCenter([location.lng,location.lat])

    });
  }

  search(location){

    console.log("search",location)
    if(location.length <1){
      return;
    }
    this.geocoder(location).then( (data) => {
      console.log("geocoder result",data)
      this.map.setCenter([data[0].getLng(), data[0].getLat()])
    }, err => {
      console.error("geocoder",err);
    })
  }

  findSchools(){
    this.hintMsg = "在您所在城市发现" + this.arrSchoolPositions.length +  "座学校";
    console.log(this.hintMsg);
    this.markLocations(this.arrSchoolPositions);
    // console.log("findSchools",arrLanlat);
  }

  loadMap() {
    console.log("loadMap")

    var customMarker = new AMap.Marker({
      offset: new AMap.Pixel(-14, -34),//相对于基点的位置
      icon: new AMap.Icon({  //复杂图标
        size: new AMap.Size(27, 36),//图标大小
        image: "https://webapi.amap.com/images/custom_a_j.png", //大图地址
        imageOffset: new AMap.Pixel(-28, 0)//相对于大图的取图位置
      })
    });

    this.map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 11,
      // center: [location.lng,location.lat]
    });
    this.map.setMapStyle('amap://styles/light');


    let self = this;
    // //地图中添加地图操作ToolBar插件
    // this.map.plugin(["AMap.ToolBar"], function() {
    //   console.log("addControl toolBar")
    //   this.toolBar = new AMap.ToolBar({locationMarker: customMarker}); //设置地位标记为自定义标记
    //   self.map.addControl(this.toolBar);
    //
    // });

    AMap.plugin('AMap.Autocomplete',function(){//回调函数
      //实例化Autocomplete
      var autoOptions = {
        city: "", //城市，默认全国
        input:"tipinput"//使用联想输入的input的id
      };
      var autocomplete= new AMap.Autocomplete(autoOptions);
      //TODO: 使用autocomplete对象调用相关功能
      AMap.event.addListener(autocomplete, "select", function(e){
        //TODO 针对选中的poi实现自己的功能
        // console.log("autocomplete","targetPosition",e.poi.name);
        self.targetPosition = e.poi.name;
        self.search(e.poi.name);

      });
    })


    // var features = ["bg","road","building"];
    // this.map.setFeatures(features);

    // var cityName = "湖南省长沙市雨花区圭塘湘核佳苑" ;
    // this.map.setCity(cityName);
    // this.geocoder(cityName);
  }

  mkMap(lngLats){
    console.log("mkMap",lngLats)
    let self = this;
    AMapUI.loadUI(['overlay/AwesomeMarker'], (AwesomeMarker) => {
        //获取一批grid排布的经纬度
        for (var i = 0, len = lngLats.length; i < len; i++) {
          console.log("lngLats",i,lngLats[i])
          new AwesomeMarker({
            //设置awesomeIcon
            awesomeIcon:  'building',        //icon  https://fontawesome.io/icons/
            iconLabel: {
              style: {
                color: '#FFFFFF',
                fontSize: '20px'
              }
            },
            iconStyle: 'red',
            map: this.map,
            position: lngLats[i],
            title: 'awesomeIcon :' + 'building'
          });
        }
      });
  }

  markLocations(locations) {
     let self = this;
     this.map.plugin(["AMap.Geocoder"], function() {
       console.log("load geocoder");

       var geocoder = new AMap.Geocoder({

        radius: 1000 //范围，默认：500
      });
      //地理编码,返回地理编码结果
       for(let i =0;i<locations.length;i++){
         console.log("geocoder getLocation process",locations[i]);
         geocoder.getLocation(locations[i], function(status, result) {
           if (status === 'complete' && result.info === 'OK') {
             console.log("geocoder getLocation",result);
             self.mkMap(self.geocoder_CallBack(result));
           }
         });
       }
    });
   }

  geocoder(location):Promise<any> {//location text to lnglat
    return new Promise( (resolve,reject) => {
      let self = this;
      this.map.plugin(["AMap.Geocoder"], function() {
        console.log("load geocoder");
        var geocoder = new AMap.Geocoder({
          radius: 1000 //范围，默认：500
        });
        //地理编码,返回地理编码结果
        geocoder.getLocation(location, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            console.log("geocoder getLocation",result);
            resolve(self.geocoder_CallBack(result));
          }else {
            // reject( "error occur while retriving location");
          }
        });
      });
    })
  }

  //地理编码返回结果展示
   geocoder_CallBack(data) {
      var resultStr = [];
      //地理编码结果数组
      var geocode = data.geocodes;
      for (var i = 0; i < geocode.length; i++) {
        console.log("geocoder_CallBack",geocode[i].location)
        // let lanlat = this.map.pixelToLngLat(new AMap.Pixel(geocode[i].location.getLng(), geocode[i].location.getLat()));
        resultStr.push(geocode[i].location);
      }

      return resultStr;
    }

    regeocoder(lnglatXY) {  //逆地理编码
      let self = this;
        this.map.plugin(["AMap.Geocoder"], function() {
        var geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: "all"
        });
        geocoder.getAddress(lnglatXY, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            self.regeocoder_CallBack(result);
          }
        });
        var marker = new AMap.Marker({  //加点
          map: self.map,
          position: lnglatXY
        });
          self.map.setFitView();
      })
    }//lnglat to location text

    regeocoder_CallBack(data) {
        var address = data.regeocode.formattedAddress; //返回地址描述
      console.log("geocoder_CallBack your address is",address)
     }


  onInput($event){
    this.shouldShowCancel = true;
    console.log(this.shouldShowCancel )
  }

  onCancel($event) {
    this.shouldShowCancel = false;
    console.log(this.shouldShowCancel )
  }

}
