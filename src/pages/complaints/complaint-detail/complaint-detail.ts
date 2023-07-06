import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ModalController, AlertController } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { ViewProfilePage } from '../../view-profile/view-profile';
import { DomSanitizer  } from '@angular/platform-browser';
import { CancelComplaintPage } from '../../cancel-complaint/cancel-complaint';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { InspectionPage } from '../../inspection/inspection';
import { ConstantProvider } from '../../../providers/constant/constant';
import { AddComplaintRemarkPage } from '../../add-complaint-remark/add-complaint-remark';
import { CloseComplaintPage } from '../../close-complaint/close-complaint';
/**
* Generated class for the ComplaintDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-complaint-detail',
  templateUrl: 'complaint-detail.html',
})
export class ComplaintDetailPage {
  complaint_id:any='';
  complaint_detail:any={};
  complaint_remark:any=[];
  complaint_images:any=[];
  complaint_media:any=[];
  loading:Loading;
  rating_star:any='';
  star:any='';
  amount:any={};
  bannerURL: any;

  
  
  constructor( public sanitizer: DomSanitizer  , public navCtrl: NavController, public navParams: NavParams,public serve:DbserviceProvider,public loadingCtrl:LoadingController,public modalCtrl: ModalController,public alertCtrl:AlertController,public db: MyserviceProvider, public constant: ConstantProvider) {

    this.bannerURL = constant.upload_url1 + 'service_task/';
    this.complaint_id = this.navParams.get('id');
    this.getComplaintDetail(this.complaint_id);


  }
  
  
  photoURL(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  
  ionViewDidLoad() {
    
  }
  
  presentLoading() 
  {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
  }
  
  getComplaintDetail(id)
  {
    
    this.db.addData( {'complaint_id':id},'AppServiceTask/serviceComplaintDetail').then(response =>
      {
        console.log(response);
        // this.loading.dismiss();
        this.complaint_detail = response['result'];
        console.log(this.complaint_detail);
        this.complaint_remark = response['result']['log'];
        this.complaint_images = response['result']['image'];
        console.log(this.complaint_remark);
        

        

        // this.complaint_media = response['complaintDetails']['image'] ;              
        // for (let i = 0; i < this.complaint_media.length; i++) {
        //   this.complaint_media[i].file_name =  this.sanitizer.bypassSecurityTrustResourceUrl( this.serve.url+'app/uploads/'+this.complaint_media[i].file_name  );
          
        // }
        
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

    cancelComplaint(test)
    {

    }
    goToInspection(id) {
      this.navCtrl.push(InspectionPage,{ "id": id });
    }
    goToRemark(id) {
      this.navCtrl.push(AddComplaintRemarkPage,{ "id": id });
    }

    goToClose(id,customer_mobile) {
      this.navCtrl.push(CloseComplaintPage,{ "id": id ,"customer_mobile":customer_mobile});
    }

    imageModal(src)
    {
        console.log(src);
        
        this.modalCtrl.create(ViewProfilePage, {"Image": src}).present();
    }
    
  }
  