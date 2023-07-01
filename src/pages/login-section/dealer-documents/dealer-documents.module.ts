import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerDocumentsPage } from './dealer-documents';

@NgModule({
  declarations: [
    DealerDocumentsPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerDocumentsPage),
  ],
})
export class DealerDocumentsPageModule {}
