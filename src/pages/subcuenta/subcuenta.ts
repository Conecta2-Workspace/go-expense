import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { SubCuentaService } from '../../services/subcuenta.service'
import { DetalleMovimientosPage } from '../detalle-movimientos/detalle-movimientos'
import { GlobalService } from '../../services/GLOBAL.service'

/**
 * Generated class for the SubcuentaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subcuenta',
  templateUrl: 'subcuenta.html',
})
export class SubcuentaPage {
  private idCuentaBancoSelected;
  private nombreBancoSelected;
  private subcuentas: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public subCuentaService: SubCuentaService,
              public loadingController: LoadingController,
              public alertController : AlertController,
              private GLOBAL:GlobalService) {

    
  }

  ionViewDidLoad() {
    this.idCuentaBancoSelected = this.navParams.get('id');
    this.nombreBancoSelected = this.navParams.get('nombre');
    this.getSubcuentas(this.idCuentaBancoSelected);
    
    
  }

  getSubcuentas(idCuentaBancoSelected){
    let loader = this.loadingController.create();
    loader.present();

    this.subCuentaService.getSubCuentaByBanco(idCuentaBancoSelected)
    .then((subcuentas:any) => {
      loader.dismiss();            
      

      this.subcuentas = subcuentas.filter(function(e,i){ return e.cuentaEje = 1 }) || {};

      console.log(this.subcuentas);

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


  gotoDetalleMovimientosPage(item, nombre, saldo, saldoRetenido, saldoDisponible){
    this.navCtrl.push(DetalleMovimientosPage, {id:item, nombre:nombre, saldo:saldo, saldoRetenido:saldoRetenido, saldoDisponible:saldoDisponible, tipoCuenta:"SUBCTA"});
  }


  doRefresh(refresher) {
    
        console.log('Begin async operation', refresher);
    
        this.getSubcuentas(this.idCuentaBancoSelected);
    
        setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
        }, 1000);
  }

}
