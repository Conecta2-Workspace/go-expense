import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ProxyService } from './PROXY.service';
import { GlobalService } from './GLOBAL.service';

@Injectable()
export class MainService {
  private mainAPI: string;

  constructor(public http: Http, public PROXY: ProxyService, private GLOBAL:GlobalService) {    
    this.mainAPI = this.GLOBAL.getUrlKnt2()+"goexpense/MainService.php";    
  }



  /**
   * Registra UUID asociandolo a un usuario
   * @param idUsuario 
   * @param uuid 
   */
  public registraUUID(idUsuario: number) {

    let uuid: string = this.GLOBAL.getUUID();
   
    let dataPost = JSON.stringify({ idUsuario: idUsuario, uuid: uuid});
    let promise = new Promise((resolve, reject) => {

      this.PROXY.postHTTP(this.mainAPI+"?do=registraUuid", dataPost)
        .then((resp: any) => {
         
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        })

    });
    return promise;

  }

  
  /**
   * Recupera lista de usuario registrados por empresa
   * @param idEmpresa 
   */
  public getUsuariosApp(idEmpresa:string){
    let dataPost = JSON.stringify({ idEmpresa: idEmpresa});
    let promise = new Promise((resolve, reject) => {

      this.PROXY.postHTTP(this.mainAPI+"?do=consultaUsuarios", dataPost)
        .then((resp: any) => {         

          resolve(resp);
        })
        .catch((err) => {
          reject(err);

        })

    });
    return promise;
  }
  
}