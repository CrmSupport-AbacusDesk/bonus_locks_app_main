import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, Loading, ModalController, Nav, Events } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import moment from 'moment';
import { ConstantProvider } from '../../../providers/constant/constant';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import * as jwt_decode from 'jwt-decode';
import { LoginserviceProvider } from '../../../providers/loginservice/loginservice';
import { Device } from '@ionic-native/device';
import { DealerHomePage } from '../../dealer-home/dealer-home';


@IonicPage()
@Component({
  selector: 'page-dealer-documents',
  templateUrl: 'dealer-documents.html',
})
export class DealerDocumentsPage {
  @ViewChild(Nav) nav: Nav;
  data: any = {};
  form: any = {};
  salesData: any = {};
  profile_data: any = '';
  loading: Loading;
  today_date: any;
  flag: boolean = true;
  bankImageFlag: boolean = false;
  documentImageFlag: boolean = false;
  documentBackImageFlag: boolean = false;
  panImageFlag: boolean = false;
  Influencer: any = []
  uploadurl: any
  cam: any = "Camera";
  gal: any = "Gallery";
  cancl: any = "Cancel";
  ok: any = "Ok";
  upl_file: any = "";
  token_info: any = "";
  save_succ: any = "";
  appVersion:any
  doc: any = [];
  savingFlag: boolean = false;
  DistId:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: DbserviceProvider,
    public myservice: MyserviceProvider,
    public constant: ConstantProvider,
    public alertCtrl: AlertController,
    private device: Device,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    public modalCtrl: ModalController,
    public storage: Storage,
    public events: Events,
    public serv: LoginserviceProvider,
    ){
      console.log(this.navParams);
      this.DistId = this.navParams.data.dr_id
      console.log(this.DistId,'id')
      this.appVersion = navParams.get('app_version');
      this.data['device_unique_id']  = this.device.uuid;
      this.data['app_version']  = this.appVersion;
      this.data['device_info'] = this.device.model + ',' + this.device.platform + ',' + this.device.version + ',' + this.device.manufacturer;
      this.uploadurl = constant.influencer_doc;
      // this.getInfluencer();
      // this.getUser();
      this.data.document_image = '';
      this.data.pan_img = '';
      this.data.bank_img = '';
      this.data.document_image_back = '';
      // this.getstatelist();
      // if (this.navParams.data.data.registerType == 'Other') {
      //   this.data.mobile_no = this.navParams.data.data.phone;
      // }
      // else {
      if (navParams.data.data) {
        console.log(this.navParams)
        this.data = navParams.data.data;
        this.data.panBase64 = false;
        this.data.bankImgBase64 =false;
        this.data.docFrontBase64 = false;
        this.data.docBackBase64 = false;
        this.data.exist_id = this.data.id;
        this.data.profile_edit_id = this.data.id;
        this.data.doc_back_edit_id = this.data.id;
        this.data.doc_pan_id = this.data.id;
        this.data.bank_img_id = this.data.id;
        this.data.doc_edit_id = this.data.id;
        if(this.data.bank_img == "" ||this.data.bank_img == null ||this.data.bank_img == undefined){
          this.bankImageFlag = false
        }else{
          this.bankImageFlag = true
        }
        if(this.data.document_image == "" ||this.data.document_image == null ||this.data.document_image == undefined){
          this.documentImageFlag = false
        }else{
          this.documentImageFlag = true
        }
        if(this.data.document_image_back == "" ||this.data.document_image_back == null ||this.data.document_image_back == undefined){
          this.documentBackImageFlag = false
        }else{
          this.documentBackImageFlag = true
        }
        if(this.data.pan_img == "" ||this.data.pan_img == null ||this.data.pan_img == undefined){
          this.panImageFlag = false
        }else{
          this.panImageFlag = true
        }
        
        // if (this.data.dob == '0000-00-00') {
        //   this.data.dob = '';
        // }
        // if (this.data.doa == '0000-00-00') {
        //   this.data.doa = '';
        // }
        // if (this.data.state) {
        //   this.getDistrictList(this.data.state);
        // }
        // this.getInfluencer();
        // setTimeout(() => {
        //   this.getRights(this.data.type);
        // }, 500);
        // }
      }
      this.today_date = new Date().toISOString().slice(0, 10);
      
    }
    
    
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad DealerDocumentsPage');
    }
    
    // getstatelist() {
    //   this.myservice.addData({}, 'AppInfluencerSignup/getStates').then(result => {
    //     if (result['statusCode'] == 200) {
    //       this.state_list = result['all_state'];
    //     }
    //     else {
    //       this.myservice.errorToast(result['statusMsg'])
    //     }
    //   });
    // }
    
    // getDistrictList(state_name) {
    //   this.service.post_rqst({ 'state_name': state_name }, 'AppInfluencerSignup/getDistrict').subscribe(result => {
    //     if (result['statusCode'] == 200) {
    //       this.district_list = result['all_district'];
    //     }
    //     else {
    //       this.myservice.errorToast(result['statusMsg'])
    //     }
    //   });
    // }
    getDecodedAccessToken(token: string): any {
      try {
        return jwt_decode(token);
      }
      catch (Error) {
        return null;
      }
    }
    onUploadChange(evt: any) {
      let actionsheet = this.actionSheetController.create({
        title: this.upl_file,
        cssClass: 'cs-actionsheet',
        buttons: [{
          cssClass: 'sheet-m',
          text: this.cam,
          icon: 'camera',
          handler: () => {
            this.takeDocPhoto();
          }
        },
        {
          cssClass: 'sheet-m1',
          text: this.gal,
          icon: 'image',
          handler: () => {
            this.getDocImage();
          }
        },
        {
          cssClass: 'cs-cancel',
          text: this.cancl,
          role: 'cancel',
          handler: () => {
            this.data.doc_edit_id = this.data.id;
          }
        }
      ]
    });
    actionsheet.present();
  }
  takeDocPhoto() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1050,
      targetHeight: 1000
    }
    this.camera.getPicture(options).then((imageData) => {
      this.flag = false;
      this.data.doc_edit_id = '',
      this.data.docFrontBase64 = true
      this.documentImageFlag = true
      this.data.document_image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
  }
  getDocImage() {
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    this.camera.getPicture(options).then((imageData) => {
      this.flag = false;
      this.data.doc_edit_id = '';
      this.documentImageFlag = true
      this.data.docFrontBase64 = true
      this.data.document_image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
  }
  onUploadBackChange(evt: any) {
    let actionsheet = this.actionSheetController.create({
      title: this.upl_file,
      cssClass: 'cs-actionsheet',
      buttons: [{
        cssClass: 'sheet-m',
        text: this.cam,
        icon: 'camera',
        handler: () => {
          this.backDocPhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: this.gal,
        icon: 'image',
        handler: () => {
          this.backDocImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: this.cancl,
        role: 'cancel',
        handler: () => {
          this.data.doc_back_edit_id = this.data.id;
        }
      }
    ]
  });
  actionsheet.present();
}
backDocPhoto() {
  const options: CameraOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.DATA_URL,
    targetWidth: 1050,
    targetHeight: 1000
  }
  
  this.camera.getPicture(options).then((imageData) => {
    this.flag = false;
    this.data.doc_back_edit_id = ''
    this.documentBackImageFlag = true
    this.data.docBackBase64 = true
    this.data.document_image_back = 'data:image/jpeg;base64,' + imageData;
  }, (err) => {
  });
}
backDocImage() {
  const options: CameraOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    saveToPhotoAlbum: false
  }
  this.camera.getPicture(options).then((imageData) => {
    this.flag = false;
    this.data.doc_back_edit_id = '';
    this.documentBackImageFlag = true
    this.data.docBackBase64 = true
    this.data.document_image_back = 'data:image/jpeg;base64,' + imageData;
  }, (err) => {
  });
}
onUploadPan(evt: any) {
  let actionsheet = this.actionSheetController.create({
    title: this.upl_file,
    cssClass: 'cs-actionsheet',
    buttons: [{
      cssClass: 'sheet-m',
      text: this.cam,
      icon: 'camera',
      handler: () => {
        this.panPhoto();
      }
    },
    {
      cssClass: 'sheet-m1',
      text: this.gal,
      icon: 'image',
      handler: () => {
        this.panImage();
      }
    },
    {
      cssClass: 'cs-cancel',
      text: this.cancl,
      role: 'cancel',
      handler: () => {
        this.data.doc_pan_id = this.data.id;
      }
    }
  ]
});
actionsheet.present();
}
panPhoto() {
  const options: CameraOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.DATA_URL,
    targetWidth: 1050,
    targetHeight: 1000
  }
  
  this.camera.getPicture(options).then((imageData) => {
    this.flag = false;
    this.data.doc_pan_id = ''
    this.panImageFlag = true
    this.data.panBase64 = true
    this.data.pan_img = 'data:image/jpeg;base64,' + imageData;
  }, (err) => {
  });
}
panImage() {
  const options: CameraOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    saveToPhotoAlbum: false
  }
  this.camera.getPicture(options).then((imageData) => {
    this.flag = false;
    this.data.doc_pan_id = '';
    this.panImageFlag = true
    this.data.panBase64 = true
    this.data.pan_img = 'data:image/jpeg;base64,' + imageData;
  }, (err) => {
  });
}
onUploadBankImg(evt: any) {
  let actionsheet = this.actionSheetController.create({
    title: this.upl_file,
    cssClass: 'cs-actionsheet',
    buttons: [{
      cssClass: 'sheet-m',
      text: this.cam,
      icon: 'camera',
      handler: () => {
        this.bankPhoto();
      }
    },
    {
      cssClass: 'sheet-m1',
      text: this.gal,
      icon: 'image',
      handler: () => {
        this.bankImage();
      }
    },
    {
      cssClass: 'cs-cancel',
      text: this.cancl,
      role: 'cancel',
      handler: () => {
        this.data.bank_img_id = this.data.id;
        
      }
    }
  ]
});
actionsheet.present();
}


bankPhoto() {
  const options: CameraOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.DATA_URL,
    targetWidth: 1050,
    targetHeight: 1000
  }
  
  this.camera.getPicture(options).then((imageData) => {
    this.flag = false;
    this.data.bank_img_id = '';
    this.bankImageFlag = true
    this.data.bankImgBase64 = true
    this.data.bank_img = 'data:image/jpeg;base64,' + imageData;
  }, (err) => {
  });
}
bankImage() {
  const options: CameraOptions = {
    quality: 75,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    saveToPhotoAlbum: false
  }
  this.camera.getPicture(options).then((imageData) => {
    this.flag = false;
    this.data.bank_img_id = '';
    this.bankImageFlag = true
    this.data.bankImgBase64 = true
    this.data.bank_img = 'data:image/jpeg;base64,' + imageData;
  }, (err) => {
  });
}
submit() {
  // if (this.data.dob) {
  //   this.data.dob = moment(this.data.dob).format('YYYY-MM-DD');
  // }
  // if (this.data.doa) {
  //   this.data.doa = moment(this.data.doa).format('YYYY-MM-DD');
  // }
  console.log(this.data);
  this.data.id=this.DistId
  this.savingFlag = true;
  this.myservice.addData({ 'data': this.data }, 'AppCustomerNetwork/uploadDocuments').then(result => {
    this.form.phone = this.data.mobile_no;
    // this.form.registerType = "Other";
    
    this.form.device_info = this.data.device_info;
    this.form.device_unique_id =this.data.device_unique_id;
    this.form.app_version = this.data.app_version;
    ;
    if (result['statusCode'] == 200) {
      this.serv.login_submit(this.form).then((result: any) => {
        
        this.myservice.successToast(result['statusMsg']);
        this.savingFlag = false;
        this.constant.setData();
        this.navCtrl.setRoot(DealerHomePage);
        
      })
      
    }
    else {
      this.myservice.errorToast(result['statusMsg'])
      this.savingFlag = false;
    }
  });
  
}
}
