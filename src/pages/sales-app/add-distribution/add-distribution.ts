import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Navbar, AlertController } from 'ionic-angular';
import { EnquiryserviceProvider } from '../../../providers/enquiryservice/enquiryservice';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
// import { IonicSelectableComponent } from 'ionic-selectable';
import { ViewChild } from '@angular/core';
import { DashboardPage } from '../../dashboard/dashboard';


/**
* Generated class for the AddDistributionPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-add-distribution',
  templateUrl: 'add-distribution.html',
})
export class AddDistributionPage {
  
  @ViewChild(Navbar) navBar: Navbar;
  
  
  lead_form:any = {};
  state_list:any=[];
  city_list:any=[];
  data:any={};
  contact_person={};
  city_name:any=[];
  
  validateForm: FormGroup;
  type:any = '';
  title:any = '';
  order:any = '';
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public service:EnquiryserviceProvider,public loadingCtrl: LoadingController, public serve: MyserviceProvider, public formBuilder: FormBuilder, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    
    this.type = this.navParams.get('type');
    console.log(this.type);
    
    if(this.type == 1)
    {
      this.title = 'Distributor';
    }
    
    if(this.type == 3)
    {
      this.title = 'Dealer';
    }
    
    if(this.type == 7)
    {
      this.title = 'Direct Dealer'
    }
    
    
    this.validateForm = formBuilder.group({
      companyName: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      email: [''],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      whatsapp: ['',Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      gst: [''],
      dob: [''],
      anniversary_date: [''],
      address: ['', Validators.compose([Validators.required])],
      stateName: ['', Validators.compose([Validators.required])],
      districtName: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      district: ['', Validators.compose([Validators.required])],
      pincode: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
      city: ['', Validators.compose([Validators.required])],
      cityName: ['', Validators.compose([Validators.required])],
      brand: ['', Validators.compose([Validators.required])],
      user: ['', Validators.compose([Validators.required])],
      country: ['India', Validators.compose([Validators.required])],
    });
    this.getState();
    // this.get_category();
  }
  
  ionViewDidLoad() {
    
    this.getBrandList();
    this.getSalesUserList();
    this.getCountryList();
    // this.data.country.country_name='India';
    console.log('ionViewDidLoad AddDistributionPage');
    
  }
  
  
  
  portChange(event: {
    // component: IonicSelectableComponent,
    value: any 
  }) {
    console.log('port:', event.value);
  }
  
  portChange1(event: {
    // component: SelectSearchableComponent,
    value: any 
  }) {
    console.log('port:', event.value);
  }
  
  getState() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
    });
    
    this.service.getState().then((response:any)=>{
      loading.dismiss();
      console.log(response);
      this.state_list = response;
      
    });
    loading.present();
  }
  
  district_list:any = [];
  
  
  getDistrict(state) {
    console.log(state);
    
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
    });
    
    this.service.getCity(state).then((response:any)=>{
      loading.dismiss();
      console.log(response);
      this.district_list = response;
      
    });
    loading.present();
  }
  
  check_gst:any = '';
  gst_details:any = [];
  check_mobile:any = '';
  
  
  
  check_mobile_existence(mobile)
  {
    
    this.serve.addData({'mobile':mobile},'Enquiry/check_mobile_existence').then((result)=>{
      console.log(result);
      
      this.check_mobile = result['check_mobile'];
      console.log(this.check_mobile);
      
      console.log(mobile.length);
      
    })
    
  }
  
  
  check_gst_existence(gst)
  {
    
    this.serve.addData({'gst':gst},'Enquiry/check_gst_existence').then((result)=>{
      console.log(result);
      
      this.check_gst = result['check_gst'];
      console.log(this.check_gst);
      this.gst_details = result['data'];
      console.log(this.gst_details);
    })
    
  }
  
  brandList:any=[];
  salesUserList:any=[];
  countryList:any=[];
  
  getBrandList()
  {
    this.serve.addData({},'Distributor/brands_list').then((result)=>{
      console.log(result);
      this.brandList=result;      
    })
  }
  
  getSalesUserList()
  {
    this.serve.addData({},'Distributor/sales_user_list').then((result)=>{
      console.log(result);
      this.salesUserList=result;      
    })
  }
  
  getCountryList()
  {
    this.serve.addData({},'Distributor/country_list').then((result)=>{
      console.log(result);
      this.countryList=result;      
    })
  }
  
  
  
  get_pincode_area_name(pincode)
  {
    this.service.get_pincode_city_name(pincode).then((response:any)=>{
      console.log(response);
      if(response=='' || response==null)
      {
        this.city_name = "Not Matched";
      }
      else
      {
        this.city_name = response.city;
        this.data.state = {'state_name':response.state_name};
        this.data.district = {'district_name':response.district_name};
        this.data.city = {'city':response.city};
        
      }
    });
  }
  
  
  getCity(state,district) {
    console.log(state);
    console.log(district);
    
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
    });
    
    this.service.getCity1({'state':state,'district':district}).then((response:any)=>{
      loading.dismiss();
      console.log(response);
      this.city_list = response;
      
    });
    loading.present();
  }
  
  getArea(state,district,city) {
    console.log(state);
    
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
    });
    
    this.service.getCity({'state':state,'district':district, 'city':city}).then((response:any)=>{
      loading.dismiss();
      console.log(response);
      this.city_list = response;
      
    });
    loading.present();
  }
  
  
  getPincode(state,district,city,area) {
    console.log(state);
    
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
    });
    
    this.service.getCity({'state':state,'district':district, 'city':city, 'area':area}).then((response:any)=>{
      loading.dismiss();
      console.log(response);
      this.city_list = response;
      
    });
    loading.present();
  }
  
  
  category_list:any = [];
  get_category()
  {
    this.serve.addData({'type':this.type},'Distributor/discount_category').then((result)=>{
      console.log(result);
      this.category_list = result;
      console.log(this.category_list);
    })
  }
  
  
  
  MobileNumber(event: any) 
  {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
  }
  
  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Lead Added Successfully',
      duration: 3000,
      position: 'bottom'
    });
    
    toast.present();
  }
  
  
  presentToast1() {
    let toast1 = this.toastCtrl.create({
      message: 'Dealer Added Successfully',
      duration: 3000,
      position: 'bottom'
    });
    
    toast1.present();
  }
  
  data1:any=[];
  
  loading:any = "0";
  order_data:any = [];
  
  
  submitDealer()
  {
    
    console.log(this.data);
    this.loading = "1";
    
    
    if(this.validateForm.invalid)
    {
      this.validateForm.get('companyName').markAsTouched();
      
      this.validateForm.get('name').markAsTouched();
      this.validateForm.get('mobile').markAsTouched();
      this.validateForm.get('stateName').markAsTouched();
      this.validateForm.get('districtName').markAsTouched();
      this.validateForm.get('pincode').markAsTouched();
      this.validateForm.get('city').markAsTouched();
      
      this.validateForm.get('address').markAsTouched();
      this.validateForm.get('gst').markAsTouched();
      // this.validateForm.get('whatsapp').markAsTouched();
      console.log(this.validateForm);
      
      
      // return;
    }
    
    // return false;
    
    if(this.data.country.country_name=='India')
    {
      this.data.state = this.data.state.state_name;
      this.data.district = this.data.district.district_name;
      this.data.city = this.data.city.cityName;
    }
    this.data.type = this.type;
    
    
    console.log(this.data);
    
    
    // if(this.data.mobile.length == 10 && this.check_mobile == 1)
    // {
    //   // this.data.pincode = {};
    //   this.presentAlert();
    // }
    
    
    
    // if(this.data.mobile.length == 10 && this.check_mobile == 0)
    // {
    this.serve.addData({'data':this.data},"Distributor/add_dealer").then(response=>{
      console.log(response);
      if(response['msg'] == 'success')
      {
        
        this.navCtrl.push(DashboardPage);
        this.presentToast1();        
      }
      
    });
    
    // }
    
    // return false;
    this.loading = "0"
    
    
  }
  
  
  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: 'Mobile No. Already Exists',
      buttons: ['Ok']
    });
    alert.present();
  }
  
}
