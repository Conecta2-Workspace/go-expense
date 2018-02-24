import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { GlobalService } from '../../services/GLOBAL.service';
import { Camera, CameraOptions } from '@ionic-native/camera';


/**
 * Generated class for the InfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})



export class InfoPage {
  private uuid: string;
  private services: string;
  private base64Image: string;
  


  constructor(  public navCtrl: NavController, 
                public navParams: NavParams,
                private GLOBAL: GlobalService,
                public alertController : AlertController,
                private camera: Camera
  ) {
  }

  ionViewDidLoad() {
    this.uuid = this.GLOBAL.getUUID();
    this.services = this.GLOBAL.getUrlKnt2();
  }


  tomaFoto(){
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,      
      targetWidth: 300,
      targetHeight: 300,      
      saveToPhotoAlbum: false,
      allowEdit: true,
      sourceType: 1
    }


  


    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
    this.base64Image = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
      //~Mensaje de error
      this.alertController.create({
        title: 'ERROR',
        subTitle: err,
        buttons: ['OK']
      }).present();
     });
  }

}
