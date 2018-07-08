import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { Ocorrencia } from '../../models/ocorrencia';
import { OcorrenciaService } from '../../services/domain/ocorrencia.service';
import { UsuarioService } from '../../services/domain/usuario.service';

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;
  items: Ocorrencia[] = [];
  page : number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public ocorrenciaService: OcorrenciaService,
    public usuarioService: UsuarioService,
    public app: App
  ) {
  }

  ionViewDidLoad() {
    
    this.loadData();
  }

  loadData() {
    let loader = this.presentLoading();
    this.ocorrenciaService.findAll(this.page, 20)
      .subscribe(response => {
        let start = this.items.length;
        this.items = this.items.concat(response['content']);
        let end = this.items.length - 1;
        loader.dismiss();
        this.loadImageUrls(start, end);
      },
      error => {
        loader.dismiss();
      }
    );
  };

  loadImageUrls(start: number, end: number) {
    for (var i=start; i<=end; i++) {
      let item = this.items[i];
      this.ocorrenciaService.getImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${this.bucketUrl}/ocr${item.id}.jpg`;
        },
        error => {}
      );
      this.usuarioService.getImageFromBucket(item.idUsuario)
        .subscribe(response => {
          item.imageUrlUsuario  = `${this.bucketUrl}/user${item.idUsuario}.jpg`;
        },
        error => {}
      );
    };
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  openItem(ocorrencia_id: string) {
    this.navCtrl.push('OcorrenciaDetailPage', {ocorrencia_id: ocorrencia_id});
  }

  openComentarios(ocorrencia_id: string) {
    this.app.getRootNav().push('OcorrenciaComentarioPage', {ocorrencia_id: ocorrencia_id});
  }

  doRefresh(refresher) {
    this.page = 0;
    this.items = [];
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
