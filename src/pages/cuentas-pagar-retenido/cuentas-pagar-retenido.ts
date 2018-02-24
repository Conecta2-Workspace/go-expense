import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { MovimientoService } from '../../services/movimientos.service'
import { GlobalService } from '../../services/GLOBAL.service'
import { VerMovimientoPage } from '../ver-movimiento/ver-movimiento'

/**
 * Generated class for the CuentasPagarRetenidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cuentas-pagar-retenido',
  templateUrl: 'cuentas-pagar-retenido.html',
})
export class CuentasPagarRetenidoPage {
  private listaMovimientosByCuenta: any;
  private subTotal: number;
  //~Forma de pago
  private listaFormaPago: any;
  private cmbFormaPago: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public registraMovimientoService: MovimientoService,
              public alertController : AlertController,
              private modalController: ModalController,
              private GLOBAL:GlobalService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CuentasPagarRetenidoPage');
    this.getFormasPago();
    
  }

  buscaMovRet(){
    this.subTotal = 0;
    this.getListaMovimientos(this.cmbFormaPago);
  }



  getListaMovimientos(idCuentaSelected){
    this.registraMovimientoService.getDetalleMovimientosRetenidos(idCuentaSelected)
    .then((data:any)=>{
      console.log(data);
      this.listaMovimientosByCuenta = data.movimientos;
      this.subTotal = data.subTotal;
      

    }).catch(error=>{
      console.log("super error root");
      console.log(error);
    })
  }

  getFormasPago(){
    this.registraMovimientoService.getMediosAcceso("evert.nicolas@gmail.com")
    .then((resp:any) => {     
      //console.log(resp);
      this.listaFormaPago = resp;
    }
    ).catch(error => {       

      //~Mensaje de error
      this.alertController.create({
        title: 'ERROR',
        subTitle: 'No fue posible leer los datos. '+error,
        buttons: ['OK']
      }).present();
    });
  }

  modalDetalleMovimiento(idMovimiento, concepto, monto, fechaAplicacion, fechaReg, usuario, nota, naturaleza, idCuenta, tipoCuenta){
    
    let modal = this.modalController.create(VerMovimientoPage, {
      idMovimiento:idMovimiento, 
      concepto:concepto, 
      monto:monto, 
      fechaAplicacion:fechaAplicacion, 
      fechaReg:fechaReg, 
      usuario:usuario, 
      nota:nota,
      naturaleza: naturaleza,
      idCuenta: idCuenta,
      tipoCuenta: tipoCuenta,
      permiteEdicion: false
    });

    modal.present();
    modal.onDidDismiss(data=>console.log(data));

  }

}
