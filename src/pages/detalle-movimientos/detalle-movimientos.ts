import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MovimientoService } from '../../services/movimientos.service'

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
  private listaMovimientosByCuenta: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public registraMovimientoService: MovimientoService) {
  }

  ionViewDidLoad() {
    this.idCuentaSelected = this.navParams.get('id');
    this.nombreCuentaSelected = this.navParams.get('nombre');
    this.saldoSelected = this.navParams.get('saldo');
    this.registraMovimientoService.getDetalleMovimientos(this.idCuentaSelected)
    .then((data)=>{
      console.log(data);
      this.listaMovimientosByCuenta = data;
      

    }).catch(error=>{
      console.log("super error root");
      console.log(error);
    })
  }

}
