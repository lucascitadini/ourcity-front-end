import { Component } from '@angular/core';

import { IonicPage, NavController } from 'ionic-angular';
import { Tab1Root, Tab2Root, Tab3Root, Tab4Root } from '../pages';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;
  tab4Root: any = Tab4Root;
  tab1Title = " ";
  tab2Title = " ";
  tab3Title = " ";
  tab4Title = " ";
  constructor(public navCtrl: NavController) {
    this.tab1Title = '';
    this.tab2Title = '';
    this.tab3Title = '';
    this.tab4Title = '';
  }
}
