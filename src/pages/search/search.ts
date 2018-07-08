import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { Ocorrencia } from '../../models/ocorrencia';
import { OcorrenciaService } from '../../services/domain/ocorrencia.service';
import { UsuarioService } from '../../services/domain/usuario.service';
import { App } from 'ionic-angular/components/app/app';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  enderecoSearch: string;
  bucketUrl: string = API_CONFIG.bucketBaseUrl;
  items: Ocorrencia[] = [];
  page : number = 0;
  usuarioLogado : boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public ocorrenciaService: OcorrenciaService,
    public usuarioService: UsuarioService,
    public storage: StorageService,
    public app: App) {
  }

  ionViewDidLoad() {
    if (this.storage.getLocalUser()) {
      this.usuarioLogado = true;
    }
    console.log('ionViewDidLoad SearchPage');
  }

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

  loadData() {
    let loader = this.presentLoading();
    this.ocorrenciaService.findByEnderecoCompleto(this.page, 20, this.enderecoSearch)
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

  procurar() {
    this.page = 0;
    this.items = [];
    this.loadData();
  }

  openItem(ocorrencia_id: string) {
    if (this.usuarioLogado) {
      this.navCtrl.push('OcorrenciaDetailPage', {ocorrencia_id: ocorrencia_id});
    }
  }

}
