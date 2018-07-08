import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { OcorrenciaService } from '../../services/domain/ocorrencia.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriaDTO } from '../../models/categoria.dto';
import { CategoriaService } from '../../services/domain/categoria.service';
import { WelcomePage } from '../welcome/welcome';

@IonicPage()
@Component({
  selector: 'page-new-ocorrencia',
  templateUrl: 'new-ocorrencia.html',
})
export class NewOcorrenciaPage {

  categorias: CategoriaDTO[];
  formGroup: FormGroup;
  picture: string;
  cameraOn: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public ocorrenciaService: OcorrenciaService,
    public camera: Camera,
    public sanitizer: DomSanitizer,
    public categoriaService: CategoriaService
  ) {
    this.formGroup = this.formBuilder.group({
      enderecoCompleto: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(248)]],
      descricao: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(516)]],
      categoriaId : ['', [Validators.required]],
      statusId : [1, [Validators.required]],
      longitude : [-26.8680393, []],
      latitude : [-49.1506131, []]
    });
  }

  ionViewDidLoad() {
    this.getCategorias();
  }

  limpaValues() {
    this.formGroup.reset();
    this.picture = '';
  }

  getCategorias() {
    this.categoriaService.findAll()
      .subscribe(response => {
        this.categorias = response;
        this.formGroup.controls.categoriaId.setValue(null);
      },
      error => {}
    );
  }

  newOcorrencia() {
    if (this.formGroup.valid && this.picture) {
      let loader = this.presentLoading();
      let idOcorrencia;
      console.log(this.formGroup.value);
      this.ocorrenciaService.insertOcorrencia(this.formGroup.value)
        .subscribe(response => {
          idOcorrencia = this.extractId(response.headers.get('location'));

          this.ocorrenciaService.uploadPicture(idOcorrencia, this.picture)
            .subscribe(response => {
              this.limpaValues();
              loader.dismiss();
              this.navCtrl.parent.select(0);
            }, 
            error => {
              loader.dismiss();
              if (error.status == 403) {
                this.navCtrl.setRoot(WelcomePage);
              }
            }
          );
        },
        error => {
          loader.dismiss();
          if (error.status == 403) {
            this.navCtrl.setRoot(WelcomePage);
          }
        }
      );
      
    }
  }

  private extractId(location : string): string {
    let position = location.lastIndexOf('/');
    return location.substring(position + 1, location.length);
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  getCameraPicture() {
    this.cameraOn = true;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
    });
  }

  getGalleryPicture() {

    this.cameraOn = true;
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
    });
  }

  cancel() {
    this.picture = null;
  }

}
