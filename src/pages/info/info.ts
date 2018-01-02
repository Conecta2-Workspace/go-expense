import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalService } from '../../services/GLOBAL.service';


/**
 * Generated class for the InfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  private uuid: string;
  private services: string;
  constructor(  public navCtrl: NavController, 
                public navParams: NavParams,
                private GLOBAL: GlobalService
  ) {
  }

  ionViewDidLoad() {
    this.uuid = this.GLOBAL.getUUID();
    this.services = this.GLOBAL.getUrlKnt2();
  }

}
