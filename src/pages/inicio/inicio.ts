import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { SubCuentaService } from '../../services/subcuenta.service'
import { GlobalService } from '../../services/GLOBAL.service'
import { RegistraCargoAbonoPage } from '../registra-cargo-abono/registra-cargo-abono'


/**
 * Generated class for the InicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {
  private subcuentas: any;  
  private tipoOperacionRegMov: string;
  private idCuentaRegMov: string;  

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public subCuentaService: SubCuentaService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private GLOBAL:GlobalService
    ) {

  }

  ionViewDidLoad() {

    //~Arranca servicio de RED
    this.GLOBAL.iniciaServicioDatosRed();

    //~Parametros de regreso del registro de movimientos    
    this.tipoOperacionRegMov = this.navParams.get('tipoOperacion');
    this.idCuentaRegMov = this.navParams.get('idCuenta');

    let loader = this.loadingController.create();
    loader.present();

    this.subCuentaService.getSubCuentaByBanco(-1)//~Muestra todas las subcuentas
      .then((subcuentas: any) => {
        loader.dismiss();


        this.subcuentas = subcuentas;

        console.log(this.subcuentas);

      }
      ).catch(error => {
        loader.dismiss();

        //~Mensaje de error
        this.alertController.create({
          title: 'ERROR',
          subTitle: 'No fue posible leer los datos. ' + error,
          buttons: ['OK']
        }).present();
      });

  }


  gotoRegistraCargoAbono(id, nombre){
    this.navCtrl.push(RegistraCargoAbonoPage, {id:id, nombre:nombre, tipoCta:'SUBCTA'});
  }

  refreshInicio(){
    this.ionViewDidLoad();
  }
}
