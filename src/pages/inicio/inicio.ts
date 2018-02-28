import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { SubCuentaService } from '../../services/subcuenta.service'
import { GlobalService } from '../../services/GLOBAL.service'
import { RegistraCargoAbonoPage } from '../registra-cargo-abono/registra-cargo-abono'
import { LoginPage } from '../login/login'
import { Storage } from '@ionic/storage';


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
  private montoRegMov: number = 0;  

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public subCuentaService: SubCuentaService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private GLOBAL:GlobalService,
    private modalController: ModalController,
    private BD: Storage
    ) {

  }

  /**
   * 
   */
  ionViewDidLoad() {

    //~Arranca servicio de RED
    this.GLOBAL.iniciaServicioDatosRed();

    //~Parametros de regreso del registro de movimientos        
    this.cargaListaActualizadaSubCta(this.navParams.get('tipoOperacion'), this.navParams.get('idCuenta'));

    this.BD.get('ID_USUARIO_APP')
    .then((resp)=>{

      if(resp==null){
        this.registraSesion();
      }

    });

  }

  /**
   * 
   * @param tipoOperacionRegMov 
   * @param idCuentaRegMov 
   */
  cargaListaActualizadaSubCta(tipoOperacionRegMov, idCuentaRegMov){       
        //~Parametros de regreso del registro de movimientos    
        this.tipoOperacionRegMov = tipoOperacionRegMov;
        this.idCuentaRegMov = idCuentaRegMov;
    
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


  /**
   * 
   * @param id 
   * @param nombre 
   */
  gotoRegistraCargoAbono(id, nombre){
    //this.navCtrl.push(RegistraCargoAbonoPage, {id:id, nombre:nombre, tipoCta:'SUBCTA'});

    let modal = this.modalController.create(RegistraCargoAbonoPage, {
      id:id, 
      nombre:nombre, 
      tipoCta:'SUBCTA'
    });
  
  
    modal.present();
    modal.onDidDismiss(data=>{

    this.cargaListaActualizadaSubCta(data.tipoOperacion, data.idCuenta);

  });



  }

  /**
   * 
   */
  refreshInicio(){
    this.ionViewDidLoad();
  }

  /**
   * Valida que este registrado el usuario, de lo contrario consume el servicio
   * para consultar los usuarios disponibles
   */
  public registraSesion(){

    console.log(1);
    let modal = this.modalController.create(LoginPage);  
  
    modal.present();
  }

  
}
