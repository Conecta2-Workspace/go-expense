import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, AlertController } from 'ionic-angular';
import { MovimientoService } from '../../services/movimientos.service'
import { GlobalService } from '../../services/GLOBAL.service'
import { InicioPage } from '../inicio/inicio'
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the RegistraCargoAbonoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registra-cargo-abono',
  templateUrl: 'registra-cargo-abono.html',
})
export class RegistraCargoAbonoPage {
  private colorFooterTipoOperacion: string;
  private etiquetaTipoOperacion: string = " ";

  private warmth: number = 2;
  private nombre: string;
  private id: string;
  private tipoCta: string;
  private zoomIconRangeAbono: number;
  private zoomIconRangeCargo: number = 1;

  private isNotaActivada;

  //~Inputs
  private txtConcepto: string;
  private txtMonto: number;
  private txtNota: string;


  constructor(  private navCtrl: NavController, 
                private navParams: NavParams, 
                private actionSheetController: ActionSheetController,
                private platform: Platform,
                private registraMovimientoService: MovimientoService,
                private GLOBAL: GlobalService,
                private toastCtrl: ToastController,
                public alertController : AlertController) {
    this.colorFooterTipoOperacion="cargo";
    this.id = this.navParams.get('id');
    this.nombre = this.navParams.get('nombre');
    this.tipoCta = this.navParams.get('tipoCta');

    this.isNotaActivada = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistraCargoAbonoPage');
  }

  tipoOperacion(tipo){
    if(tipo==1){
      this.colorFooterTipoOperacion="abono";
      this.warmth = 1;
      this.zoomIconRangeAbono = 1;
      this.zoomIconRangeCargo = 0;
      this.etiquetaTipoOperacion = "$ Abono(+)";
    }else if (tipo==2){
      this.colorFooterTipoOperacion="cargo";
      this.warmth = 2;
      this.zoomIconRangeAbono = 0;
      this.zoomIconRangeCargo = 1;
      this.etiquetaTipoOperacion = "$ Cargo(-)";
    }else if (tipo==3){      
      this.tipoOperacion(this.warmth);
    }
  }

  activaMontoField(e){
    this.tipoOperacion(this.warmth);
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetController.create({
      title: 'Que deseas agregar ?',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Nota',          
          icon: !this.platform.is('ios') ? 'clipboard' : null,
          handler: () => {
            this.isNotaActivada = true;
          }
        },{
          text: 'Imagen o Foto',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            console.log('Archive clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'arrow-back' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  /**
   * Consume servicio para registrar el movimiento
   */
  registraMovimiento(){
    let naturaleza = 'A';
    if(this.warmth == 2){
      naturaleza = 'C';
    }
        
    this.registraMovimientoService.registraMovimiento('evert.nicolas@gmail.com',this.GLOBAL.getUUID(),this.id,this.tipoCta,this.txtConcepto,naturaleza,this.txtMonto.toString(), this.txtNota)
    .then((data)=>{
      console.log(data);

      let today = new Date();
      let milliseconds = today.getTime();

      console.log(milliseconds);

      let toast = this.toastCtrl.create({
        message: 'Se registro correctamente el '+this.colorFooterTipoOperacion,
        duration: 3000,
        position: 'top'
      });
      toast.present();

      this.navCtrl.push(InicioPage);

    }).catch(error=>{      

      //~Mensaje de error
      this.alertController.create({
        title: 'ERROR',
        subTitle: error,
        buttons: ['OK']
      }).present();
    })



  }

}
