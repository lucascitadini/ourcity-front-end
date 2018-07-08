import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewOcorrenciaPage } from './new-ocorrencia';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    NewOcorrenciaPage,
  ],
  imports: [
    IonicPageModule.forChild(NewOcorrenciaPage),
  ],
  providers: [
    Camera
  ]
})
export class NewOcorrenciaPageModule {}
