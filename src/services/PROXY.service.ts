import { AlertController } from 'ionic-angular';
import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ProxyService {


  constructor(private http: Http, public alertController: AlertController) {
  }


  /**
   * Realizar un GET via URL + Parametros
   * @param API 
   */
  public getHTTP(API: string) {
    //let msg = this.alertController;

    let promise = new Promise((resolve, reject) => {

      this.http.get(API)
        .toPromise()
        .then(
        res => { // Success
          res.json();

          if (res.json().exito == 1) {
            resolve(res.json().data);
          } else {
            reject(res.json().error);
          }

        },
        err => { // Error


          /*  msg.create({
          title: 'ERROR',
          subTitle: 'No fue posible  leer los datos. '+API+err,
          buttons: ['OK']
        }).present();*/

          reject(err);
        }
        );
    });

    return promise;
  }

  /**
   * Envia peticion POST al servidor
   * @param API 
   * @param data 
   */
  public postHTTP(API: string, data: any) {
    var dataTo = JSON.stringify(data);

    let promise = new Promise((resolve, reject) => {

      this.http.post(API, dataTo)
        .toPromise()
        .then(
        res => { // Success
          res.json();

          if (res.json().exito == 1) {
            resolve(res.json().data);
          } else {
            reject(res.json().error);
          }

        },
        err => { // Error


          /*  msg.create({
          title: 'ERROR',
          subTitle: 'No fue posible  leer los datos. '+API+err,
          buttons: ['OK']
        }).present();*/

          reject(err);
        }
        );
    });

    return promise;
  }

}