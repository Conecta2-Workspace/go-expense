import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { MainService } from '../../services/main.service'
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private cmbUsuario: string = "0";
  private listUsuarios: any;

  constructor(  public navCtrl: NavController, 
                public navParams: NavParams, 
                private mainService: MainService, 
                private alertController : AlertController,
                private BD: Storage,
                private viewCtrl : ViewController) {
  }

  ionViewDidLoad() {
    this.getUsuarioApp();
  }

  /**
   * 
   */
  registraUUID(){
    console.log(this.cmbUsuario);

    if(Number(this.cmbUsuario)<=0){      
      this.alertController.create({
        title: 'ERROR',
        subTitle: 'Se requiere elegir un usuario',
        buttons: ['OK']
      }).present();

      return;
    }
    
    this.mainService.registraUUID(Number(this.cmbUsuario))
    .then((resp:any) => {     
      console.log(resp);

      this.BD.set('ID_USUARIO_APP', this.cmbUsuario);

      this.viewCtrl.dismiss();
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

  /**
   * 
   */
  getUsuarioApp(){
    this.mainService.getUsuariosApp("evert.nicolas@gmail.com")
    .then((resp:any) => {     
      //console.log(resp);
      this.listUsuarios = resp;
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

}
