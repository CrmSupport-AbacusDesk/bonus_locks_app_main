import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';
import { ComplaintDetailPage} from '../../complaints/complaint-detail/complaint-detail';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { AddNewComplaintPage } from '../add-new-complaint/add-new-complaint';
import { MyserviceProvider } from '../../../providers/myservice/myservice';


/**
* Generated class for the ComplaintHistoryPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-complaint-history',
  templateUrl: 'complaint-history.html',
})
export class ComplaintHistoryPage {
  complaint_list : any=[];
  loading:Loading;
  filter:any={};
  flag:any='';
  complaint_count:any=[];
  data:any={};
  start: any;
  dr_id: any;
  complaint_type: any = 'Pending'


  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public alertCtrl:AlertController,public loadingCtrl:LoadingController,public db: MyserviceProvider)
  {
    console.log(this.navParams);
    this.data.type  =this.navParams.data.type;
    console.log(this.data.type);
    this.presentLoading();
    this.getComplaintHistory()

    if (this.navParams.get('dr_id')) {
      this.dr_id = this.navParams.get('dr_id');
    }
    
  }
  
  ionViewDidLoad() {
    this.filter.status='';
    console.log('ionViewDidLoad ComplaintHistoryPage');
  }
  
  onComplaintdetail(id)
  {
    this.navCtrl.push(ComplaintDetailPage,{'id':id});
  }
  
  presentLoading() 
  {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
  }
  
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.getComplaintHistory(); 
    refresher.complete();
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
        this.complaint_count = result['tab_count'];
        console.log(this.complaint_list); 
        console.log(this.complaint_count); 
      });
    }

    loadData(infiniteScroll) {
      this.start = this.complaint_list.length
      this.db.addData({ 'dr_id': this.dr_id, 'limit': this.filter, 'start': this.start, 'Status': this.complaint_type }, 'AppServiceTask/serviceComplaintList').then(resp => {
        if (['result']['tab_count'] == '') {
          this.flag = 1;
        }
        else {
          setTimeout(() => {
            this.complaint_list = this.complaint_list.concat(resp['result']['tab_count']);
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

      addComplaint() {
        this.navCtrl.push(AddNewComplaintPage);
      }

      goCompalintDetail(id) {
        this.navCtrl.push(ComplaintDetailPage,{ id: id})
      }
      
    }
    