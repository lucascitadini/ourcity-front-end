import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OcorrenciaDetailPage } from './ocorrencia-detail';

@NgModule({
  declarations: [
    OcorrenciaDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(OcorrenciaDetailPage),
  ],
})
export class OcorrenciaDetailPageModule {}
