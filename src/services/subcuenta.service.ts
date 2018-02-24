import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ProxyService } from './PROXY.service';
import { GlobalService } from './GLOBAL.service';

@Injectable()
export class SubCuentaService {
  private subCuentaAPI: string;

  constructor(private BD: Storage, public http: Http, public PROXY: ProxyService, private GLOBAL: GlobalService) {
    this.subCuentaAPI = this.GLOBAL.getUrlKnt2() + "goexpense/SubCuentaService.php";
  }




  public getSubCuentaByBanco(idCuentaBanco) {
    if (idCuentaBanco == -1) {
      this.subCuentaAPI = this.GLOBAL.getUrlKnt2() + "goexpense/SubCuentaService.php";
    } else {
      this.subCuentaAPI = this.GLOBAL.getUrlKnt2() + "goexpense/SubCuentaService.php";
      this.subCuentaAPI = this.subCuentaAPI + "?idCuentaBanco=" + idCuentaBanco;
    }

    let promise = new Promise((resolve, reject) => {

      this.PROXY.getHTTP(this.subCuentaAPI)
        .then((subcuentas: any) => {

          let arrAux = [];
          arrAux.push(subcuentas);
          if (arrAux[0].length > 0) {
            //~Guarda en BD el resultado                            
            this.BD.set('SUBCUENTA', subcuentas);

            console.log('Resuelve internet');
            resolve(subcuentas); //~Recupera datos de Internet              
          } else { //~Al no encontrar datos en Internet busca en BD

            //~Solo aplica para INICIO
            if (idCuentaBanco == -1) {
              this.BD.get('SUBCUENTA').then((subcuentasBD) => {
                console.log('Resuelve BD local');
                resolve(subcuentasBD);
              });
            }else{
              resolve(subcuentas);
            }
          }
        })
        .catch((err) => { //~Cualquier error de conexion a Internet busca en BD
          this.BD.get('SUBCUENTA').then((subcuentasBD) => {
            console.log('Resuelve BD local');
            resolve(subcuentasBD);
          });
        })

    });

    return promise;


  }
}