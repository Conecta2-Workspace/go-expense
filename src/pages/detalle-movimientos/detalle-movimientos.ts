import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { MovimientoService } from '../../services/movimientos.service'
import { VerMovimientoPage } from '../ver-movimiento/ver-movimiento'
import { asTextData } from '@angular/core/src/view';

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
  private tipoCuentaSelected: string;
  private listaMovimientosByCuenta: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public registraMovimientoService: MovimientoService,
              private modalController: ModalController) {
  }

  ionViewDidLoad() {
    this.idCuentaSelected = this.navParams.get('id');
    this.nombreCuentaSelected = this.navParams.get('nombre');
    this.saldoSelected = this.navParams.get('saldo');
    this.tipoCuentaSelected = this.navParams.get('tipoCuenta');

    this.registraMovimientoService.getDetalleMovimientos(this.idCuentaSelected)
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
      tipoCuenta: this.tipoCuentaSelected
  });
  
  
  modal.present();
  modal.onDidDismiss(data=>console.log(data));

  }

}
