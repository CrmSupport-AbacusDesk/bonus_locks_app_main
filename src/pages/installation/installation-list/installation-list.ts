import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddInstallationPage } from '../add-installation/add-installation';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InstallationListPage');
  }
  add_page(){
    this.navCtrl.push(AddInstallationPage, { "type": '' });
  }

}
