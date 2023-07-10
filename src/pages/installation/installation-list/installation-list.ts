import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AddInstallationPage } from '../add-installation/add-installation';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { InstallationDetailPage } from '../installation-detail/installation-detail';

/**
* Generated class for the InstallationListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-installation-list',
  templateUrl: 'installation-list.html',
})
export class InstallationListPage {

  complaint_list : any=[];
  loading:any;
  filter:any={};
  flag:any='';
  count:any=[];
  total_count:any=[];
  data:any={};
  start: any;
  dr_id: any;
  complaint_type: any = 'Pending'
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public alertCtrl:AlertController,public loadingCtrl:LoadingController,public db: MyserviceProvider) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad InstallationListPage');
  }
  add_page(){
    this.navCtrl.push(AddInstallationPage, { "type": '' });
  }
  
  getCatalogueData() {
    this.db.presentLoading();
    this.filter.limit = 20;
    this.filter.start = 0;
    this.db.addData({'filter':this.filter}, 'AppCustomerNetwork/segmentList').then((result) => {
        if (result['statusCode'] == 200) {
            this.db.dismissLoading();
        } else {
            this.db.errorToast(result['statusMsg']);
            this.db.dismissLoading();
        }
    }, error => {
        this.db.Error_msg(error);
        this.db.dismissLoading();
    });
  }
  
  getComplaintHistory()
  {
    // console.log(type)
    this.flag=0;
    this.filter.limit = 0;
    this.db.addData( {'dr_id': this.dr_id, 'limit': this.filter, start: this.start,'Status': this.complaint_type},'AppServiceTask/serviceComplaintList').then((result) =>
    {
      console.log(result);
      this.loading.dismiss();
      this.complaint_list = result['result'];
      this.count = result['tab_count'];
      this.total_count = result['tab_count'];
    });
  }
  
  loadData(infiniteScroll) {
    this.start = this.total_count.length
    this.db.addData({ 'dr_id': this.dr_id, 'limit': this.filter, 'start': this.start, 'Status': this.complaint_type }, 'AppServiceTask/serviceComplaintList').then(resp => {
      if (['result']['tab_count'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.total_count = this.total_count.concat(resp['result']['tab_count']);
          infiniteScroll.complete();
        }, 1000);
      }
    });
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
  
  goCompalintDetail(id) {
    this.navCtrl.push(InstallationDetailPage,{ id: id})
  }
  
}
