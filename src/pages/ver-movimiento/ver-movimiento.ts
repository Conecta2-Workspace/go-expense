import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { RegistraCargoAbonoPage } from '../registra-cargo-abono/registra-cargo-abono'
import { GlobalService } from '../../services/GLOBAL.service'

/**
 * Generated class for the VerMovimientoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ver-movimiento',
  templateUrl: 'ver-movimiento.html',
})
export class VerMovimientoPage {
  private idMovimiento: any;
  private concepto: any;
  private monto: any; 
  private fechaAplicacion: any;
  private fechaReg: any;
  private usuario: any;
  private nota: any;
  private naturaleza: any;

  private idCuenta: number;
  private tipoCuenta: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl : ViewController, private GLOBAL:GlobalService ) {

    this.idMovimiento = this.navParams.get('idMovimiento');
    this.concepto = this.navParams.get('concepto');
    this.monto = this.navParams.get('monto');
    this.fechaAplicacion = this.navParams.get('fechaAplicacion');
    this.fechaReg = this.navParams.get('fechaReg');
    this.usuario = this.navParams.get('usuario');
    this.nota = this.navParams.get('nota');
    this.naturaleza = this.navParams.get('naturaleza');

    this.idCuenta= this.navParams.get('idCuenta');
    this.tipoCuenta= this.navParams.get('tipoCuenta');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerMovimientoPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  editarMovimiento(){

    if(this.monto<0){
      this.monto = this.monto *-1;
    }

    this.navCtrl.push(RegistraCargoAbonoPage, { idMovimientoEdicion:this.idMovimiento, 
                                                conceptoEdicion:this.concepto, 
                                                naturalezaEdicion: this.naturaleza,
                                                montoEdicion: this.monto,
                                                notaEdicion: this.nota,
                                                idCuentaEdicion: this.idCuenta,
                                                tipoCtaEdicion:this.tipoCuenta});
  }  

}
