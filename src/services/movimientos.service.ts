import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ProxyService } from './PROXY.service';
import { GlobalService } from './GLOBAL.service';

@Injectable()
export class MovimientoService {
  private movimientosAPI: string;

  constructor(private BD: Storage, public http: Http, public PROXY: ProxyService, private GLOBAL:GlobalService) {    
    this.movimientosAPI = this.GLOBAL.getUrlKnt2()+"goexpense/MovimientosService.php";    
  }


  /**
   * Registra el movimiento via POST
   * @param idEmpresa 
   * @param idUsuario 
   * @param idCuenta 
   * @param tipoCuenta SUBCTA | CTA
   * @param concepto Maximo 50 caracteres
   * @param naturaleza A | C
   * @param monto 
   */
  public registraMovimiento(
    idMovimiento: number,
    idEmpresa: string,
    idMedioAcceso: number,
    uuid: string,
    idCuenta: string,
    tipoCuenta: string,
    concepto: string,
    naturaleza: string,
    monto: string,
    nota: string) {

    let fechaAplicacion: String = new Date().toISOString();

    let dataPost = JSON.stringify({ idEmpresa: idEmpresa, uuid: uuid, idCuenta: idCuenta, tipoCuenta: tipoCuenta, concepto: concepto, naturaleza: naturaleza, monto: monto, fechaAplicacion: fechaAplicacion, nota: nota, idMovimiento: idMovimiento.toString(), idMedioAcceso: idMedioAcceso.toString()});
    let promise = new Promise((resolve, reject) => {

      this.PROXY.postHTTP(this.movimientosAPI+"?do=registrarMovimiento", dataPost)
        .then((respRegMovimiento: any) => {

          //~Actualiza saldo de la cuenta en LOCAL
          this.actualizaSaldoLocal(tipoCuenta, idCuenta, respRegMovimiento.saldoDespues);

          resolve(respRegMovimiento); //~Recupera datos de Internet                                      
        })
        .catch((err) => { //~Cualquier error de conexion a Internet busca en BD          
          reject(err);

        })

    });
    return promise;

  }

  //~Recupera el listado de movimientos
  public getDetalleMovimientos(idCuenta:number){
    let dataPost = JSON.stringify({ idCuenta: idCuenta});
    let promise = new Promise((resolve, reject) => {

      this.PROXY.postHTTP(this.movimientosAPI+"?do=getDetalleMovimientos", dataPost)
        .then((respRegMovimiento: any) => {         

          resolve(respRegMovimiento); //~Recupera datos de Internet                                      
        })
        .catch((err) => { //~Cualquier error de conexion a Internet busca en BD          
          reject(err);

        })

    });
    return promise;
  }

  //~Recupera el listado de movimientos
  public getDetalleMovimientosRetenidos(idMedioAcceso:number){
    let dataPost = JSON.stringify({ idMedioAcceso: idMedioAcceso});
    let promise = new Promise((resolve, reject) => {

      this.PROXY.postHTTP(this.movimientosAPI+"?do=doGetMovimientosRetenidos", dataPost)
        .then((respRegMovimiento: any) => {         

          resolve(respRegMovimiento); //~Recupera datos de Internet                                      
        })
        .catch((err) => { //~Cualquier error de conexion a Internet busca en BD          
          reject(err);

        })

    });
    return promise;
  }

  //~Actualiza el campo saldo de la cuenta / subcuenta afectada
  public actualizaSaldoLocal(tipoCuenta: string, idCuenta: any, nuevoSaldo: any) {
    let resultArray: any;

    if(tipoCuenta=="SUBCTA"){
      this.BD.get('SUBCUENTA').then((subcuentasBD) => {
        resultArray = subcuentasBD;

        for (let i = 0; i < subcuentasBD.length; i++) {
          let data = resultArray[i];

          if (data.idSubCuenta == idCuenta) {

            data.saldo = nuevoSaldo;

            resultArray[i] = data;
          }
        }

        this.BD.set('SUBCUENTA', resultArray);

      });

    }else{

      this.BD.get('CUENTA_BANCO').then((cuentasBD) => {
        resultArray = cuentasBD;

        for (let i = 0; i < cuentasBD.length; i++) {
          let data = resultArray[i];

          if (data.idCuentaBanco == idCuenta) {

            data.saldo = nuevoSaldo;

            resultArray[i] = data;
          }
        }

        this.BD.set('CUENTA_BANCO', resultArray);

      });

    }

  }


  /**
   * 
   * @param idEmpresa 
   */
  public getMediosAcceso(idEmpresa:string){
    let dataPost = JSON.stringify({ idEmpresa: idEmpresa});
    let promise = new Promise((resolve, reject) => {

      this.PROXY.postHTTP(this.movimientosAPI+"?do=doGetListaMediosAcceso", dataPost)
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
   * Realiza el arrastre de saldos por subcuenta o cuenta
   * @param idCuenta 
   * @param tipoCuenta CTA º SUBCTA
   */
  public realizaArrasteSaldos(idCuenta: number, tipoCuenta: string){
    let dataPost = JSON.stringify({ idCuenta: idCuenta, tipoCuenta:tipoCuenta});
    let promise = new Promise((resolve, reject) => {

      this.PROXY.postHTTP(this.movimientosAPI+"?do=doArrastreSaldos", dataPost)
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