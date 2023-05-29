import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class ConstantProvider {
    public UserLoggedInData: any = {}
    public deviceId: any
    public tabSelectedOrder: any
    constructor(public http: Http, public storage: Storage) {
        this.storage.get('loginData').then((res) => {
            if (res.loggedInUserType != '"Employee"') {
                this.UserLoggedInData = res
            }
        })
        storage.get('loggedInUserType')
            .then((loggedInUserType) => {
                var data = {
                    'loggedInUserType': loggedInUserType
                }
                Object.assign(this.UserLoggedInData, data)
            });
        storage.get('token_value')
            .then((val) => {
                var data
                if (val == '' || val == null || val == undefined) {
                    data = {
                        'userLoggedInChk': false
                    }
                }
                else {
                    data = {
                        'userLoggedInChk': true
                    }
                }
                Object.assign(this.UserLoggedInData, data)
            });
    }
    public connectionChk = ''
    public networkType = ''


    //Test URL //
    public rootUrl2: string ='https://bonus.basiq360.com/api/index.php/'
    public rootUrl: string =  'https://bonus.basiq360.com/api/index.php/app/'
    public rootUrl1: string =  'https://bonus.basiq360.com/'
    public rootUrl3: string =  'https://bonus.basiq360.com/api/index.php/'
    public rootUrlSfa: string =  'https://bonus.basiq360.com/api/index.php/app/'
    public server_url: string = this.rootUrl1 + 'index.php/app/';
    public upload_url: string = this.rootUrl1 + 'uploads/';
    public upload_url1: string = 'https://bonus.basiq360.com/api/uploads/';
    public upload_url2: string = 'https://bonus.basiq360.com/uploads/order-invoice/';
    public img_url: string =  'https://bonus.basiq360.com/api/';
    public loyaltyUrl: string =  'https://bonus.basiq360.com/api/';
    public influencer_doc: string =  'https://bonus.basiq360.com/api/uploads/influencer_doc/';
    public support_url : string ='https://bonus.basiq360.com/api/uploads/support/';

 
    //Live URL //
    // public rootUrl2: string = 'http://bonus.basiq360.com/api/index.php/'
    // public rootUrl: string = 'http://bonus.basiq360.com/api/index.php/app/'
    // public rootUrl1: string = 'http://bonus.basiq360.com/'
    // public rootUrl3: string = 'http://bonus.basiq360.com/api/index.php/'
    // public rootUrlSfa: string = 'http://bonus.basiq360.com/api/index.php/app/'
    // public server_url: string = this.rootUrl1 + 'index.php/app/';
    // public upload_url: string = this.rootUrl1 + 'uploads/';
    // public upload_url1: string = 'http://bonus.basiq360.com/api/uploads/';
    // public upload_url2: string = 'http://bonus.basiq360.com/uploads/order-invoice/';
    // public img_url: string = 'http://bonus.basiq360.com/api/';
    // public loyaltyUrl: string = 'http://bonus.basiq360.com/api/';
    // public influencer_doc: string = 'http://bonus.basiq360.com/api/uploads/influencer_doc/';
    // public support_url: string = 'http://bonus.basiq360.com/api/uploads/support/';



    // public backButton = 0;

    public backButton = 0;

    setData() {
        this.storage.get('loginData').then((res) => {
            if (res.loggedInUserType != '"Employee"') {
                this.UserLoggedInData = res
            }
        })
        this.storage.get('loggedInUserType')
            .then((loggedInUserType) => {
                var data = {
                    'loggedInUserType': loggedInUserType
                }
                Object.assign(this.UserLoggedInData, data)
            });
        this.storage.get('token_value')
            .then((val) => {
                var data
                if (val == '' || val == null || val == undefined) {
                    data = {
                        'userLoggedInChk': false
                    }
                }
                else {
                    data = {
                        'userLoggedInChk': true
                    }
                }
                Object.assign(this.UserLoggedInData, data)
            });
    }
}
