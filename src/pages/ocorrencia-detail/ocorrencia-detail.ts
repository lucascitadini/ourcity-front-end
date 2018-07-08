import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { OcorrenciaService } from '../../services/domain/ocorrencia.service';
import { UsuarioService } from '../../services/domain/usuario.service';
import { Ocorrencia } from '../../models/ocorrencia';
import { API_CONFIG } from '../../config/api.config';
import { UsuarioDTO } from '../../models/usuario.dto';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-ocorrencia-detail',
  templateUrl: 'ocorrencia-detail.html',
})
export class OcorrenciaDetailPage {

  item: Ocorrencia;
  usuario: UsuarioDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public ocorrenciaService: OcorrenciaService,
    public usuarioService: UsuarioService,
    public loadingCtrl: LoadingController,
    public app: App,
    public storage: StorageService
  ) {
  }

  ionViewDidLoad() {
    let ocorrencia_id = this.navParams.get('ocorrencia_id');
    console.log("passou aqui")
    this.ocorrenciaService.findById(ocorrencia_id)
      .subscribe(response => {
        console.log(response);
        this.item = response;
        this.getImageUrlIfExists();
      },
      error => {}
    );
    this.loadUserCurrent();
  }

  remover( ) {
    this.ocorrenciaService.removerOcorrencia(this.item.id)
      .subscribe(response => {
        this.navCtrl.pop();
      },
      error => {
      }
    );
  }

  loadUserCurrent() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      this.usuarioService.findByEmail(localUser.email)
        .subscribe(response => {
          this.usuario = response as UsuarioDTO;
        },
        error => {
          if (error.status == 403) {
            this.navCtrl.setRoot('WelcomePage');
          }
        }
      );
    } else {
      this.navCtrl.setRoot('WelcomePage');
    }
  }

  getImageUrlIfExists() {
    this.ocorrenciaService.getImageFromBucket(this.item.id)
      .subscribe(response => {
        this.item.imageUrl = `${API_CONFIG.bucketBaseUrl}/ocr${this.item.id}.jpg`;
      },
      error => {}
    );
    this.usuarioService.getImageFromBucket(this.item.idUsuario)
      .subscribe(response => {
        this.item.imageUrlUsuario  = `${API_CONFIG.bucketBaseUrl}/user${this.item.idUsuario}.jpg`;
      },
      error => {}
    );
  }

  openComentarios(ocorrencia_id: string) {
    this.app.getRootNav().push('OcorrenciaComentarioPage', {ocorrencia_id: ocorrencia_id});
  }

}
