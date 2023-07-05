import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CloseComplaintPage } from './close-complaint';

@NgModule({
  declarations: [
    CloseComplaintPage,
  ],
  imports: [
    IonicPageModule.forChild(CloseComplaintPage),
  ],
})
export class CloseComplaintPageModule {}
