import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ComplaintDetailPage } from '../complaints/complaint-detail/complaint-detail';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
* Generated class for the AddComplaintRemarkPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-add-complaint-remark',
  templateUrl: 'add-complaint-remark.html',
})
export class AddComplaintRemarkPage {
  
  formData:any={};
  loading:any={}
  id: any;
  
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public serve : MyserviceProvider ,public loadingCtrl:LoadingController,public alertCtrl:AlertController ) {
    
    console.log(this.navParams);
    this.id  =this.navParams.data.id;
    console.log(this.id);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddComplaintRemarkPage');
  }
  
  showSuccess(text)
  {
    let alert = this.alertCtrl.create({
      title:'Success!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  
  
  addRemark()
  {  
    this.serve.addData( {"complaint_id":this.id,"msg": this.formData.msg },'AppServiceTask/addComplaintRemark').then(result =>
      {
        if (result['statusCode'] == 200) {
          this.serve.dismissLoading();
          this.showSuccess("Remark Added Successfully!");
          this.navCtrl.setRoot(ComplaintDetailPage,{ id: this.id});
        }
        else {
          this.serve.errorToast(result['statusMsg'])
        }
        console.log(result); 
        
      });
    }
    
  }
  