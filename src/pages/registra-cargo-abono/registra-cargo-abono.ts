import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, AlertController, ViewController } from 'ionic-angular';
import { MovimientoService } from '../../services/movimientos.service'
import { GlobalService } from '../../services/GLOBAL.service'
import { InicioPage } from '../inicio/inicio'
import { DetalleMovimientosPage } from '../detalle-movimientos/detalle-movimientos'
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

  //~Entrada
  private nombre: string;
  private id: string;
  private tipoCta: string;

  //~Edicion
  private isModoEdicion: boolean= false;
  private idMovimientoEdicion: number = 0;
  private conceptoEdicion: string;
  private naturalezaEdicion: string;
  private montoEdicion: any;
  private notaEdicion: string;
  private idCuentaEdicion: number;
  private tipoCtaEdicion: string;

  //~Inputs
  private txtConcepto: string;
  private txtMonto: number;
  private txtNota: string="";
  private isNotaActivada;

  //~Eleccion cargo/abono
  private operacion: string; //C o A
  private estiloTextoBotonCargo: String="red";
  private estiloFondoBotonCargo: String="white";

  private estiloTextoBotonAbono: String="blue";
  private estiloFondoBotonAbono: String="white";
  

  constructor(  private navCtrl: NavController, 
                private navParams: NavParams, 
                private actionSheetController: ActionSheetController,
                private platform: Platform,
                private registraMovimientoService: MovimientoService,
                private GLOBAL: GlobalService,
                private toastCtrl: ToastController,
                public alertController : AlertController,
                private viewCtrl : ViewController) {
    
    this.id = this.navParams.get('id');
    this.nombre = this.navParams.get('nombre');
    this.tipoCta = this.navParams.get('tipoCta');
    
    //~Campos edicion
    this.idMovimientoEdicion = this.navParams.get('idMovimientoEdicion');
    this.conceptoEdicion = this.navParams.get('conceptoEdicion');
    this.naturalezaEdicion = this.navParams.get('naturalezaEdicion');
    this.montoEdicion = this.navParams.get('montoEdicion');
    this.notaEdicion = this.navParams.get('notaEdicion');
    this.idCuentaEdicion= this.navParams.get('idCuentaEdicion');
    this.tipoCtaEdicion= this.navParams.get('tipoCtaEdicion');

    if(this.idMovimientoEdicion>0){
      this.isModoEdicion= true;
    }else{
      this.idMovimientoEdicion=0;
    }

    this.isNotaActivada = false;

    //~Operacion default
    this.setOperacion('C');
  }

  ionViewDidLoad() {
    //~Precarga informacion si inicia modo edicion
    if(this.isModoEdicion){
      this.txtConcepto = this.conceptoEdicion;
      this.operacion = this.naturalezaEdicion;
      this.txtMonto = this.montoEdicion;
      this.txtNota = this.notaEdicion;
      this.id = this.idCuentaEdicion.toString();
      this.tipoCta = this.tipoCtaEdicion;
      this.nombre = "Editando #"+ this.idMovimientoEdicion;
      this.setOperacion(this.operacion);
    }
  }

  setOperacion(tipo){
    this.operacion = tipo;

    if(tipo=="C"){      
      this.estiloTextoBotonCargo="white";
      this.estiloFondoBotonCargo="red";
      this.estiloTextoBotonAbono="blue";
      this.estiloFondoBotonAbono="white";
    }else{
      this.estiloTextoBotonAbono="white";
      this.estiloFondoBotonAbono="blue";
      this.estiloTextoBotonCargo="red";
      this.estiloFondoBotonCargo="white";
    }
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
          text: 'Detalle de movimientos',
          icon: !this.platform.is('ios') ? 'list-box' : null,
          handler: () => {            
            this.navCtrl.push(DetalleMovimientosPage, {id:this.id, nombre:this.nombre, saldo:0, tipoCuenta:this.tipoCta});            
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
    let naturaleza = this.operacion;    
        
    this.registraMovimientoService.registraMovimiento(this.idMovimientoEdicion, 'evert.nicolas@gmail.com',this.GLOBAL.getUUID(),this.id,this.tipoCta,this.txtConcepto,naturaleza,this.txtMonto.toString(), this.txtNota)
    .then((data)=>{
      console.log(data);

      let today = new Date();
      let milliseconds = today.getTime();

      console.log(milliseconds);

      let etiquetaOperacion = "cargo";
      if(this.operacion=="A"){
        etiquetaOperacion = "abono";
      }

      let toast = this.toastCtrl.create({
        message: 'Se registro correctamente el '+etiquetaOperacion,
        duration: 3000,
        position: 'top'
      });
      toast.present();

      //this.navCtrl.push(InicioPage,{tipoOperacion:this.operacion, idCuenta:this.id});

      this.viewCtrl.dismiss({tipoOperacion:this.operacion, idCuenta:this.id});

    }).catch(error=>{      

      //~Mensaje de error
      this.alertController.create({
        title: 'ERROR',
        subTitle: error,
        buttons: ['OK']
      }).present();
    })



  }


  dismiss() {
    this.viewCtrl.dismiss({tipoOperacion:this.operacion, idCuenta:this.id});
  }

}
