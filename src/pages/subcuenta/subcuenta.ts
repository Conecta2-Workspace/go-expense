import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { SubCuentaService } from '../../services/subcuenta.service'
import { DetalleMovimientosPage } from '../detalle-movimientos/detalle-movimientos'
import { RegistraCargoAbonoPage } from '../registra-cargo-abono/registra-cargo-abono'
import { GlobalService } from '../../services/GLOBAL.service'
import { MovimientoService } from '../../services/movimientos.service'

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
              private movimientoService: MovimientoService,
              public loadingController: LoadingController,
              public alertController : AlertController,
              private modalController: ModalController,
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
    let modal = this.modalController.create(DetalleMovimientosPage, {id:item, nombre:nombre, saldo:saldo, saldoRetenido:saldoRetenido, saldoDisponible:saldoDisponible, tipoCuenta:"SUBCTA"});
  
  
    modal.present();
    modal.onDidDismiss(data=>console.log(data));   
  }


  doRefresh(refresher) {
    
        console.log('Begin async operation', refresher);
    
        this.getSubcuentas(this.idCuentaBancoSelected);
    
        setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
        }, 1000);
  }

  realizarArrastreSaldos(idCuenta:string){

    let loader = this.loadingController.create();
    loader.present();

    this.movimientoService.realizaArrasteSaldos(Number(idCuenta), "SUBCTA")
    .then((subcuentas:any) => {
      
    
      // COnsulta nuevamente los saldos
      this.getSubcuentas(this.idCuentaBancoSelected);

      loader.dismiss();            
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


  gotoRegistraMov(idCuenta, nombre){
    let modal = this.modalController.create(RegistraCargoAbonoPage, {id:idCuenta, nombre:nombre, tipoCta: "SUBCTA"});
  
  
    modal.present();
    modal.onDidDismiss(data=>console.log(data));     
  }

  setFavorito(idSubcuenta){
    let loader = this.loadingController.create();
    loader.present();

    this.GLOBAL.pushSubCtaFavorito(idSubcuenta);
    console.log(this.GLOBAL.getSubCtaFavorito());


    loader.dismiss();

    
  }

}
