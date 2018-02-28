import { Injectable } from "@angular/core";
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';

@Injectable()
export class GlobalService {  
  public estatusRed: string = "/";
  public tipoRed: string = "/";
  private selectSubcuentasFavorito: any = [];

  constructor(private device: Device,
              private network:Network,
              private BD: Storage) {

              this.BD.get('FAV_SUBCTA')
              .then((resp)=>{ this.selectSubcuentasFavorito = resp; });
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
    //return "http://localhost/";
    return "http://192.168.100.9/";
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


  public pushSubCtaFavorito(idSubCuenta){
    let index = this.selectSubcuentasFavorito.indexOf(idSubCuenta);
    if (index > -1) {
      this.selectSubcuentasFavorito.splice(index, 1);
    }

    this.selectSubcuentasFavorito.push(idSubCuenta);

    this.BD.set('FAV_SUBCTA', this.selectSubcuentasFavorito);
  }

  public getSubCtaFavorito(){
    let concatID: string ="";
    for(let i=0; i<this.selectSubcuentasFavorito.length; i++){
      let id = this.selectSubcuentasFavorito[i];

      if(i<(this.selectSubcuentasFavorito.length)-1){
        concatID=concatID+id+",";
      }else{
        concatID=concatID+id;
      }
    }   
    
    return concatID;
  }




}