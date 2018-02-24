import { Injectable } from "@angular/core";
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';

@Injectable()
export class GlobalService {  
  public estatusRed: string = "/";
  public tipoRed: string = "/";  

  constructor(private device: Device,
              private network:Network) {
  }

  /**
   * Recupera el UUID del dispositivo
   */
  public getUUID(){
    let uuid = this.device.uuid;

    if(uuid==null){
      uuid="uuid-generico";
    }
    return uuid;
  }

  /**
   * Recupera segun el ambiente la url de los servicios
   */
  public getUrlKnt2(){
    //~Produccion     
    //return "http://knt2.com/app/";

    //~Pruebas
    return "http://localhost/";
  }
  
  public iniciaServicioDatosRed(){
    this.network.onConnect().subscribe(
      (data)=> {
        console.log(data);
        this.estatusRed = "CONECTADO";
        this.actualizaEstatusRed();
      }
        ,
      error=> console.log(error)
    );


    this.network.onDisconnect().subscribe(
      (data)=> {
        console.log(data);
        this.estatusRed = "FUERA";        
      },
      error=> console.log(error)
    );
  }



  /**
   * Recupera el estado de la red
   */
  private actualizaEstatusRed(){
    this.tipoRed= this.network.type;   
  }


  public formatNumeroMoneda(valString) {
    if (!valString) {
        return '';
    }
    let val = valString.toString();
    const parts = this.unFormat(val).split(".");
    return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, ",") + (!parts[1] ? '' : "." + parts[1]);
    
  }

  private unFormat(val) {
    if (!val) {
        return '';
    }
    val = val.replace(/^0+/, '');

    if ("," === ',') {
        return val.replace(/,/g, '');
    } else {
        return val.replace(/\./g, '');
    }
  }  


}