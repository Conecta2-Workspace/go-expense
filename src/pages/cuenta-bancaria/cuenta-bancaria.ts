import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { CuentaBancoService } from '../../services/cuentaBanco.service'
import { SubcuentaPage } from '../../pages/subcuenta/subcuenta';

/**
 * Generated class for the CuentaBancariaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cuenta-bancaria',
  templateUrl: 'cuenta-bancaria.html',
})
export class CuentaBancariaPage {
  @ViewChild('myNav') nav: NavController

  private cuentasBanco: any;
  

  constructor(  public navCtrl: NavController, 
                public navParams: NavParams, 
                public cuentaBancoService: CuentaBancoService,
                public loadingController: LoadingController,
                public alertController : AlertController ) {
    
  }

  ionViewDidLoad() {
    let loader = this.loadingController.create();
    loader.present();

    this.cuentaBancoService.getCuentasBanco()
    .then((cuentasBanco) => {
      loader.dismiss();            
      this.cuentasBanco = cuentasBanco;   

    }
    ).catch(error => {       
      loader.dismiss();

      //~Mensaje de error
      this.alertController.create({
        title: 'ERROR',
        subTitle: 'No fue posible leer los datos. '+error,
        buttons: ['OK']
      }).present();
    });        
  }


  gotoSubcuentaListPage(item, nombre){
    this.navCtrl.push(SubcuentaPage, {id:item, nombre:nombre});
  }

}
