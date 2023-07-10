import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { BarcodeScanner ,BarcodeScannerOptions} from '@ionic-native/barcode-scanner';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { IonicSelectableComponent } from 'ionic-selectable';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { ComplaintDetailPage } from '../complaints/complaint-detail/complaint-detail';
import { DomSanitizer } from '@angular/platform-browser';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Camera ,CameraOptions} from '@ionic-native/camera';



/**
* Generated class for the CloseComplaintPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-close-complaint',
  templateUrl: 'close-complaint.html',
})
export class CloseComplaintPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent
  formData:any={}
  qr_code: any = '';
  sendOTP:boolean=false
  Otp_verify:boolean=false
  OTP_flag:boolean=false
  mobile_number: any = {};
  btnDisableSave: boolean = false;
  btnDisableDraft: boolean = false;
  id: any;
  customer_mobile: any;
  btndisable: boolean = false;
  isCameraEnabled:boolean= false;

  
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public service: MyserviceProvider,public loadingCtrl: LoadingController,private barcodeScanner: BarcodeScanner,public alertCtrl: AlertController,public serve : MyserviceProvider,public platform: Platform,public openNativeSettings: OpenNativeSettings,public actionSheetController: ActionSheetController, public diagnostic  : Diagnostic, public androidPermissions: AndroidPermissions,public dom:DomSanitizer,private camera: Camera) {
    console.log(this.navParams);
    this.id  =this.navParams.data.id;
    this.customer_mobile  =this.navParams.data.customer_mobile;
    console.log(this.id);
    console.log(this.customer_mobile);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CloseComplaintPage');
  }
  Scaning() {
    this.platform.ready().then(() => {
      const options: BarcodeScannerOptions = {
        prompt: ""
      };
      this.barcodeScanner.scan(options).then(resp => {
        console.log(resp.text);
        
        this.formData.new_serial_no = resp.text;
        
        
      }, err => {
        console.log(err)
        this.serve.dismissLoading()
        this.selectComponent.close()
        this.presentConfirm('Turn On Camera permisssion !', 'please go to <strong>Settings</strong> -> Camera to turn on <strong>Camera permission</strong>')
      })
      
    });
  }
  presentConfirm(title, msg) {
    let alert = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: title,
      message: msg,
      cssClass: 'alert-modal',
      
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Settings',
          handler: () => {
            this.openSettings()
          }
        }
      ]
    });
    alert.present();
  }
  openSettings() {
    this.openNativeSettings.open("application_details")
  }
  
  showAlert(text) {
    let alert = this.alertCtrl.create({
      title:'Alert!',
      cssClass:'action-close',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  
  isCameraAvailable()
  {
    this.diagnostic.isCameraPresent()
    .then((isAvailable : any) =>
    {
      this.isCameraEnabled = true;
    })
    .catch((error :any) =>
    {
      console.dir('Camera is:' + error);
    });
  }
  
  
  
  captureMedia()
  {
    if(this.videoId)
    {
      this.captureImageVideo();
    }
    else
    {
      let actionsheet = this.actionSheetController.create({
        title:"Upload",
        cssClass: 'cs-actionsheet',
        
        buttons:[{
          cssClass: 'sheet-m',
          text: 'Image',
          icon:'camera',
          handler: () => {
            console.log("Image Clicked");
            this.captureImageVideo();
          }
        },
        // {
        //   cssClass: 'sheet-m1',
        //   text: 'Video',
        //   icon:'image',
        //   handler: () => {
        //     console.log("Video Clicked");
        //     this.onGetCaptureVideoPermissionHandler();
        //   }
        // },
        {
          cssClass: 'cs-cancel',
          text: 'Cancel',
          role: 'cancel',
          icon:'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionsheet.present();
    
  }
  
}

showLimit() {
  console.log('Image Data', this.image_data)
  let alert = this.alertCtrl.create({
    title: 'Alert',
    subTitle: "You can upload only 5 bill images",
    cssClass: 'alert-modal',
    
    buttons: [{
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        
      }
    }
  ]
});
alert.present();
}


captureImageVideo()
{
  let actionsheet = this.actionSheetController.create({
    title:"Complaint Media",
    cssClass: 'cs-actionsheet',
    
    buttons:[{
      cssClass: 'sheet-m',
      text: 'Camera',
      icon:'camera',
      handler: () => {
        console.log("Camera Clicked");
        
        this.takePhoto();
      }
    },
    {
      cssClass: 'sheet-m1',
      text: 'Gallery',
      icon:'image',
      handler: () => {
        console.log("Gallery Clicked");         
        this.getImage();
      }
    },
    {
      cssClass: 'cs-cancel',
      text: 'Cancel',
      role: 'cancel',
      icon:'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }
  ]
});
actionsheet.present();
}



image:any='';
takePhoto()
{
  console.log("i am in camera function");
  const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    targetWidth : 500,
    targetHeight : 400
  }
  
  console.log(options);
  this.camera.getPicture(options).then((imageData) => {
    this.image = 'data:image/jpeg;base64,' + imageData;
    // this.image=  imageData;
    // this.image= imageData.substr(imageData.lastIndexOf('/') + 1);
    console.log(this.image);
    if(this.image)
    {
      this.fileChange(this.image);
    }
  }, (err) => {
  });
}
getImage() 
{
  const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    saveToPhotoAlbum:false
  }
  console.log(options);
  this.camera.getPicture(options).then((imageData) => {
    this.image= 'data:image/jpeg;base64,' + imageData;
    // this.image=  imageData;
    // this.image= imageData.substr(imageData.lastIndexOf('/') + 1);
    console.log(this.image);
    if(this.image)
    {
      this.fileChange(this.image);
    }
  }, (err) => {
  });
}

videoId: any;
flag_upload = true;
flag_play = true;
// getVideo()
// {
//   this.fileChooser.open()
//   .then(uri => {
//     this.videoId = uri;
//     this.flag_play = false;
//     this.flag_upload = false;
//   })
//   .catch(e => console.log(e));
// }




image_data:any=[];


fileChange(img)
{
  
  this.image_data.push({"image":img});
  console.log(this.image_data);
  this.image = '';
}

remove_image(i:any)
{
  this.image_data.splice(i,1);
}

send_otp(){
  console.log('send otp')
  console.log(this.customer_mobile,'customer_mobile');
  console.log(this.formData)
  if (this.mobile_number==8287803853) {
    console.log('if')
    this.formData.otp = 123456;
    this.btndisable = true;
    
  }
  else {
    this.formData.otp = Math.floor(100000 + Math.random() * 900000);
    // this.form.otp = 123456;
  }
  let data={'phone':this.customer_mobile,'otp':this.formData.otp}
  this.service.addData(data, 'AppServiceTask/sendOtp').then((response) => {
    
    if (response['statusCode'] == 200) {
      this.Otp_verify=true
      this.sendOTP=true
      this.service.successToast(response['statusMsg'])
    }
  })
  
}
verify_otp(value){
  console.log('confirm otp',value)
  if(value.length ==6){
    if(value==this.formData.otp){
      console.log('if case')
      
      this.service.successToast('OTP Verified Succesfully')
      this.OTP_flag=true
      setTimeout(() => {
        this.Otp_verify=false
      }, 2000);
      //    this.btndisable=true
    }
    else{
      this.service.errorToast('Please Enter Correct OTP.')
      
    }
  }
  
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

closeComplaint(){
  
  
  this.formData.complaint_id=this.id
  this.formData.image = this.image_data?this.image_data:[];
  console.log(this.formData);
  
  this.serve.addData( {"data": this.formData },'AppServiceTask/complaintStatus').then(result =>
    {
      if (result['statusCode'] == 200) {
        this.serve.dismissLoading();
        this.showSuccess("Inspection Successfully!");
        this.navCtrl.setRoot(ComplaintDetailPage,{ id: this.id});
      }
      else {
        this.serve.errorToast(result['statusMsg'])
      }
      console.log(result); 
    });
  }
}
