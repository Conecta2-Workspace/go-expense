import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { MovimientoService } from '../../services/movimientos.service'
import { VerMovimientoPage } from '../ver-movimiento/ver-movimiento'
import { RegistraCargoAbonoPage } from '../registra-cargo-abono/registra-cargo-abono'
import { GlobalService } from '../../services/GLOBAL.service'
//import { asTextData } from '@angular/core/src/view';

/**
 * Generated class for the DetalleMovimientosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-movimientos',
  templateUrl: 'detalle-movimientos.html',
})
export class DetalleMovimientosPage {
  private nombreCuentaSelected: string;
  private idCuentaSelected: number;
  private saldoSelected: string;
  private saldoRetenidoSelected: string;
  private saldoDisponibleSelected: string;
  private tipoCuentaSelected: string;
  private listaMovimientosByCuenta: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public registraMovimientoService: MovimientoService,
              private modalController: ModalController,
              private GLOBAL:GlobalService) {
  }

  ionViewDidLoad() {
    this.idCuentaSelected = this.navParams.get('id');
    this.nombreCuentaSelected = this.navParams.get('nombre');
    this.saldoSelected = this.navParams.get('saldo');
    this.saldoRetenidoSelected = this.navParams.get('saldoRetenido');
    this.saldoDisponibleSelected = this.navParams.get('saldoDisponible');
    this.tipoCuentaSelected = this.navParams.get('tipoCuenta');

    this.getListaMovimientos(this.idCuentaSelected);
    
  }

  getListaMovimientos(idCuentaSelected){
    this.registraMovimientoService.getDetalleMovimientos(idCuentaSelected)
    .then((data)=>{
      console.log(data);
      this.listaMovimientosByCuenta = data;
      

    }).catch(error=>{
      console.log("super error root");
      console.log(error);
    })
  }


  modalDetalleMovimiento(idMovimiento, concepto, monto, fechaAplicacion, fechaReg, usuario, nota, naturaleza){
    let modal = this.modalController.create(VerMovimientoPage, {
      idMovimiento:idMovimiento, 
      concepto:concepto, 
      monto:monto, 
      fechaAplicacion:fechaAplicacion, 
      fechaReg:fechaReg, 
      usuario:usuario, 
      nota:nota,
      naturaleza: naturaleza,
      idCuenta: this.idCuentaSelected,
      tipoCuenta: this.tipoCuentaSelected,
      permiteEdicion: true
  });
  
  
  modal.present();
  modal.onDidDismiss(data=>console.log(data));

  }

  gotoRegistraMov(){
    this.navCtrl.push(RegistraCargoAbonoPage, {id:this.idCuentaSelected, nombre:this.nombreCuentaSelected, tipoCta: this.tipoCuentaSelected});
  }


  doRefresh(refresher) {

    console.log('Begin async operation', refresher);

    this.getListaMovimientos(this.idCuentaSelected);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 1000);
  }

}
