import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';

/**
* Generated class for the InstallationDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-installation-detail',
  templateUrl: 'installation-detail.html',
})
export class InstallationDetailPage {

  complaint_id:any='';
  installtion_detail:any={};
  complaint_remark:any=[];
  complaint_images:any=[];
  complaint_media:any=[];
  loading:any;
  rating_star:any='';
  star:any='';
  amount:any={};
  bannerURL: any;
  installation_type: any = 'Details'
  id:any;
  data:any={}
  
  constructor(public sanitizer: DomSanitizer  , public navCtrl: NavController, public navParams: NavParams,public serve:DbserviceProvider,public loadingCtrl:LoadingController,public modalCtrl: ModalController,public alertCtrl:AlertController,public db: MyserviceProvider, public constant: ConstantProvider) {

    console.log(this.navParams);
    this.id  =this.navParams.data.id;
    console.log(this.id);
    this.bannerURL = constant.upload_url1 + 'service_task/';
    this.complaint_id = this.navParams.get('id');
    this.getInstallationDetail(this.complaint_id);
  }
  
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad InstallationDetailPage');
  }

  getInstallationDetail(id)
  {
    
    this.db.addData( {'complaint_id':id},'AppServiceTask/serviceComplaintDetail').then(response =>
      {
        console.log(response);
        // this.loading.dismiss();
        this.installtion_detail = response['result'];
        console.log(this.installtion_detail);
        this.complaint_remark = response['result']['log'];
        this.complaint_images = response['result']['image'];
        console.log(this.complaint_remark);
      });
      
    }
  
  showSuccess(text)
  {
    let alert = this.alertCtrl.create({
      title:'Success!',
      cssClass:'action-close',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  goToClose(id,customer_mobile) {
    this.navCtrl.push(this.installtion_detail,{ "id": id ,"customer_mobile":customer_mobile});
  }
}
