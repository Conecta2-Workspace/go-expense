import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ProxyService } from './PROXY.service';
import { GlobalService } from './GLOBAL.service';

@Injectable()
export class CuentaBancoService{
    private cuentasBancoAPI : string;

    constructor(private BD: Storage, public http: Http, public PROXY: ProxyService, private GLOBAL:GlobalService) {               
        this.cuentasBancoAPI = this.GLOBAL.getUrlKnt2()+"goexpense/CuentaBancoService.php";    
    }


      public getCuentasBanco(){

        let promise = new Promise((resolve, reject)=>{

          this.PROXY.getHTTP(this.cuentasBancoAPI)              
          .then( (cuentasBanco: any)=>{  
            
            let arrCuentasBanco = [];
            arrCuentasBanco.push(cuentasBanco);            
            if(arrCuentasBanco[0].length>0){              
              //~Guarda en BD el resultado                            
              this.BD.set('CUENTA_BANCO', cuentasBanco);
              
              console.log('Resuelve internet');
              resolve(cuentasBanco); //~Recupera datos de Internet              
            }else{ //~Al no encontrar datos en Internet busca en BD
              this.BD.get('CUENTA_BANCO').then((cuentasBancoBD) => {            
                console.log('Resuelve BD local');
                resolve(cuentasBancoBD);
              });
            }            
            
            
          } )
          .catch( (err) => { //~Cualquier error de conexion a Internet busca en BD
            this.BD.get('CUENTA_BANCO').then((cuentasBancoBD) => {            
              console.log('Resuelve BD local');
              resolve(cuentasBancoBD);
            });                     
          })

        });   
        return promise;
        
      }
}