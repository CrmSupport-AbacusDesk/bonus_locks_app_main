import { Component } from '@angular/core';
import { Events, IonicPage, LoadingController, ModalController, NavController, NavParams, Platform, ToastController, ViewController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
* Generated class for the InspectionPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-inspection',
  templateUrl: 'inspection.html',
})
export class InspectionPage {
  
  segment_list:any=[]
  segment_detail:any=[]
  segment_sub_list:any=[]
  
  
  constructor(public navCtrl: NavController,public db: MyserviceProvider,) {
    this.get_segment();
    this.get_sub_segment();
    this.get_sub_segmentDetail();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectionPage');
  }
  
  
  get_segment() {
    this.db.addData({}, "AppCustomerNetwork/segmentList")
    .then(resp => {
      if (resp['statusCode'] == 200) {
        this.segment_list = resp['result'];
        console.log(this.segment_list);
        
      } else {
        this.db.errorToast(resp['statusMsg'])
      }
    },
    err => {
    })
  }
  
  get_sub_segment() {
    this.db.addData({'cat_id': 2}, "AppCustomerNetwork/subSegmentList")
    .then(resp => {
      if (resp['statusCode'] == 200) {
        this.segment_sub_list = resp['result'];
        console.log(this.segment_sub_list);
        
      } else {
        this.db.errorToast(resp['statusMsg'])
      }
    },
    err => {
    })
  }
  
  get_sub_segmentDetail() {
    this.db.addData({'sub_cat_id':3}, "AppCustomerNetwork/segmentItems")
    .then(resp => {
      if (resp['statusCode'] == 200) {
        this.segment_detail = resp['result'];
        console.log(this.segment_detail);
        
      } else {
        this.db.errorToast(resp['statusMsg'])
      }
    },
    err => {
    })
  }
  
  
  
  
}
