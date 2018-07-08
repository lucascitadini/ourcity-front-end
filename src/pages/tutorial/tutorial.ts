import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  slides: Slide[];
  showSkip = true;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.slides = [
      {
        title: 'Bem-vindo',
        description: 'O <b>OutCity</b> é um aplicativo colaborativo que tem como intuito facilitar o mapeamento dos problemas da cidade, e facilitar ao orgão público ter visão dos mesmos.',
        image: 'assets/img/ica-slidebox-img-1.png',
      },
      {
        title: 'Como utilizar o OurCity',
        description: 'Reporte os problemas informando: endereço, categoria que melhor se encaixe e uma foto registrada.',
        image: 'assets/img/ica-slidebox-img-2.png',
      }
    ];
  }

  startApp() {
    this.navCtrl.setRoot('WelcomePage', {}, {
      animate: true,
      direction: 'forward'
    });
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    //this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    //this.menu.enable(true);
  }
}
