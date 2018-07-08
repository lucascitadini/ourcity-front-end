import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ComentarioOcorrencia } from '../../models/comentario.ocorrencia';
import { OcorrenciaService } from '../../services/domain/ocorrencia.service';
import { UsuarioService } from '../../services/domain/usuario.service';
import { API_CONFIG } from '../../config/api.config';
import { Ocorrencia } from '../../models/ocorrencia';
import { StorageService } from '../../services/storage.service';
import { UsuarioDTO } from '../../models/usuario.dto';
import { ComentarioOcorrenciaDTO } from '../../models/comentario.ocorrencia.dto';

@IonicPage()
@Component({
  selector: 'page-ocorrencia-comentario',
  templateUrl: 'ocorrencia-comentario.html',
})
export class OcorrenciaComentarioPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;
  ocorrencia: Ocorrencia;
  comments: ComentarioOcorrencia[] = [];
  usuario: UsuarioDTO;
  page : number = 0;
  ocorrencia_id: string;
  comentarioOcorrencia: ComentarioOcorrenciaDTO  = {
    ocorrenciaId: "",
    descricao: ""
  };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public ocorrenciaService: OcorrenciaService,
    public usuarioService: UsuarioService,
    public loadingCtrl: LoadingController,
    public storage: StorageService
  ) {
  }

  ionViewDidLoad() {
    this.ocorrencia_id = this.navParams.get('ocorrencia_id');
    this.ocorrenciaService.findById(this.ocorrencia_id)
      .subscribe(response => {
        this.ocorrencia = response;
        this.getImageUrlIfExists();
      },
      error => {
        
      }
    )
    this.loadUserCurrent();
    this.loadData();
  }

  loadUserCurrent() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      this.usuarioService.findByEmail(localUser.email)
        .subscribe(response => {
          this.usuario = response as UsuarioDTO;
          this.getImageUserIfExists();
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

  getImageUserIfExists() {
    this.usuarioService.getImageFromBucket(this.usuario.id)
      .subscribe(response => {
        this.usuario.imageUrl = `${API_CONFIG.bucketBaseUrl}/user${this.usuario.id}.jpg`;
      },
      error => {}
    );
  }

  loadData() {
    let loader = this.presentLoading();
    this.ocorrenciaService.findComentariosPageByIdOcorrencia(this.ocorrencia_id, this.page, 20)
      .subscribe(response => {
        let start = this.comments.length;
        this.comments = this.comments.concat(response['content']);
        let end = this.comments.length - 1;
        loader.dismiss();
        this.loadImageUrls(start, end);
      },
      error => {
        loader.dismiss();
      }
    );
  };

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  loadImageUrls(start: number, end: number) {
    for (var i=start; i<=end; i++) {
      let comment = this.comments[i];
      this.usuarioService.getImageFromBucket(comment.idUsuario)
        .subscribe(response => {
          comment.imageUrlUsuario  = `${API_CONFIG.bucketBaseUrl}/user${comment.idUsuario}.jpg`;
        },
        error => {}
      );
    };
  }

  getImageUrlIfExists() {
    this.usuarioService.getImageFromBucket(this.ocorrencia.idUsuario)
      .subscribe(response => {
        this.ocorrencia.imageUrlUsuario  = `${API_CONFIG.bucketBaseUrl}/user${this.ocorrencia.idUsuario}.jpg`;
      },
      error => {}
    );
  }

  comentar() {
    if (this.comentarioOcorrencia.descricao == "") {
      console.log("Passou aqui");
      return;
    }
    let loader = this.presentLoading();
    this.comentarioOcorrencia.ocorrenciaId = this.ocorrencia_id;
    console.log(this.comentarioOcorrencia);
    this.ocorrenciaService.insertComentario(this.comentarioOcorrencia)
      .subscribe(response => {
        this.comentarioOcorrencia = {
          ocorrenciaId: "",
          descricao: ""
        };
        loader.dismiss();
        this.comments = [];
        this.page = 0;
        this.loadData();
      },
      error => {
        loader.dismiss();
      }
    );
  }

  deleteComentario(comment ) {
    let loader = this.presentLoading();
    this.ocorrenciaService.deletaComentario(comment.id)
      .subscribe(response => {
        loader.dismiss();
        this.comments = [];
        this.page = 0;
        this.loadData();
      },
      error => {
        loader.dismiss();
      }
    );
  }

  doRefresh(refresher) {
    this.page = 0;
    this.comments = [];
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.loadData();
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }

}
