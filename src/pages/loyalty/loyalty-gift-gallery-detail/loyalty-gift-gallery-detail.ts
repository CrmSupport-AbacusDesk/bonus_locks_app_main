import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { App, IonicPage, Loading, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { RegistrationPage } from '../../login-section/registration/registration';
import { LoyaltyRedeemRequestPage } from '../loyalty-redeem-request/loyalty-redeem-request';
import {DealerDocumentsPage} from '../../login-section/dealer-documents/dealer-documents';


@IonicPage()
@Component({
  selector: 'page-loyalty-gift-gallery-detail',
  templateUrl: 'loyalty-gift-gallery-detail.html',
})
export class LoyaltyGiftGalleryDetailPage {
  gift_id: any = '';
  gift_detail: any = {};
  gift_detail2: any = {};
  balance_point: any = '';
  loading: Loading;
  star: any = '';
  rating_star: any = '';
  otp: '';
  offer_balance: any = ''
  karigar_detail: any = {};
  tokenInfo: any = {};
  lang: any = '';
  uploadUrl: any;
  influencer_point: any = {};
  data: any = {};
  contact: any = {};
  userTypeID: any;
  dr_id:any;
  type:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public service: MyserviceProvider, public loadingCtrl: LoadingController, private app: App, public storage: Storage, public db: DbserviceProvider, public constant: ConstantProvider, public toastCtrl: ToastController) {
    this.gift_id = this.navParams.get('id');
    this.uploadUrl = constant.upload_url1 + 'gift_gallery/';
    this.service.presentLoading();
    console.log(this.constant);
    this.userTypeID = this.constant.UserLoggedInData.type;
    console.log('Retailer ID - ' , this.userTypeID);
    this.getGiftDetail(this.gift_id);
      
  }
  
  ionViewDidLoad() {
    
    // this.storage.get('user_type').then((userType) => {
    //   this.userType = userType;
    //   if (userType == 'OFFICE') {
    //     this.data.networkType = 3;
    //     //   this.get_network_list(1)
    //   }
    //   console.log(this.userType);
    
    // });
  }
  
  ionViewWillEnter() {
  }
  
  
  getGiftDetail(gift_id) {
    this.service.addData({ 'id': gift_id }, 'AppGiftGallery/giftGalleryDetail').then((result) => {
      if (result['statusCode'] == 200) {
        this.service.dismissLoading();
        this.gift_detail = result['gift_master_list'];
        this.gift_detail2 = result['detail'];
        this.dr_id = this.gift_detail2.id;
        console.log(this.dr_id,' dealer id')
        this.type = this.gift_detail2.type;
        console.log(this.type,'type')
        this.influencer_point = result['detail'];
        console.log(this.influencer_point);
        
        // if(this.influencer_point.country=='india' || this.influencer_point.country=='India'){
        //   this.data.wallet_no = this.influencer_point.paytm_mobile_no.toString();
        // }
        this.data.payment_mode = 'Bank';
        this.data.cash_point = this.gift_detail.range_start;
        this.data.cash_value = Number(this.gift_detail.range_start) * Number(this.gift_detail.point_range_value);
        
        if (this.influencer_point.kyc_status != 'Verified') {
          this.contactDetails();
        }
      }
      else {
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
      
      
    }, error => {
      this.service.Error_msg(error);
      this.service.dismissLoading();
    });
  }
  
  getValue(value) {
    if (parseFloat(value) > parseFloat(this.influencer_point.wallet_point)) {
      this.service.errorToast('Insufficient Balance');
      return
    }
    else {
      this.data.cash_value = value * this.gift_detail.point_range_value;
    }
  }
  
  
  contactDetails() {
    this.service.addData({}, 'AppContactUs/contactDetail').then((result) => {
      if (result['statusCode'] == 200) {
        this.contact = result['contact_detail'];
      }
      else {
        this.service.errorToast(result['statusMsg']);
      }
    });
  }
  
  SendRequest() {
    console.log(this.data);
    
    if (this.gift_detail.gift_type == 'Cash') {
      if (this.data.cash_point == undefined) {
        this.service.errorToast('Please enter redeem points value');
        return
      }
      
      if (!this.data.payment_mode && (this.influencer_point.country && (this.influencer_point.country.toLowerCase() == 'india' || this.influencer_point.country.toLowerCase() == 'India'))) {
        this.service.errorToast('Please Select Payment Mode First');
        return
      }
      
      // if ( parseInt(this.data.wallet_no.length)!=10 && this.data.payment_mode!='Bank' ) {
      //   this.service.errorToast('Please Enter 10 Digit Mobile No.');
      //   return
      // }
      
      if (parseFloat(this.data.cash_point) > parseFloat(this.influencer_point.wallet_point)) {
        this.service.errorToast('Insufficient point in your wallet');
        return
      }
      else {
        this.navCtrl.push(LoyaltyRedeemRequestPage, { 'karigar_id': this.influencer_point.id, 'gift_id': this.gift_id, "mode": "reedeemPoint", 'offer_balance': this.offer_balance, 'cash_point': this.data.cash_point, 'gift_type': 'Cash', 'cash_value': this.data.cash_value, 'payment_mode': this.data.payment_mode })
        // this.navCtrl.push(LoyaltyRedeemRequestPage, { 'karigar_id': this.influencer_point.id, 'gift_id': this.gift_id, "mode": "reedeemPoint", 'offer_balance': this.offer_balance, 'cash_point': this.data.cash_point, 'gift_type': 'Cash', 'cash_value': this.data.cash_value, 'payment_mode': this.data.payment_mode || 'Khalti', 'wallet_no': this.data.wallet_no })
      }
    }
    if (parseFloat(this.influencer_point.wallet_point) < parseFloat(this.gift_detail.gift_point)) {
      this.service.errorToast('Insufficient point in your wallet');
      return
    }
    
    if (this.gift_detail.gift_type == 'Gift') {
      this.navCtrl.push(LoyaltyRedeemRequestPage, { 'karigar_id': this.influencer_point.id, 'gift_id': this.gift_id, "mode": "reedeemPoint", 'offer_balance': this.offer_balance, 'gift_type': 'Gift', 'payment_mode': this.data.payment_mode, 'wallet_no': this.data.wallet_no })
    }
    // }
  }
  
  mobileNoCheck(event) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
    
  }
  
  updateBankDetail() {
    this.influencer_point.edit_profile = 'edit_profile';
    this.navCtrl.push(RegistrationPage, { 'data': this.influencer_point, "mode": 'edit_page' })
  }
  
  updateDocs (){
    console.log('open Dealer Document uploader page')
    this.navCtrl.push(DealerDocumentsPage,{'id':this.gift_id ,'dr_id':this.dr_id ,'dr_type':'3'} )
    
  }
  
}
