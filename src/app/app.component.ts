import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { InicioPage } from '../pages/inicio/inicio';
import { InfoPage } from '../pages/info/info';
import { CuentaBancariaPage } from '../pages/cuenta-bancaria/cuenta-bancaria';
import { CuentasPagarRetenidoPage } from '../pages/cuentas-pagar-retenido/cuentas-pagar-retenido'


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('NAV') nav: Nav;     
  public rootPage:any;
  public pages: Array<{titulo:string, component:any, icon:string}>;  

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
      this.rootPage = InicioPage; 
      
      this.pages = [
            {titulo: 'Inicio', component: InicioPage, icon:'home'},
            {titulo: 'Cuentas de Banco', component: CuentaBancariaPage, icon:'ribbon'},
            {titulo: 'Cuentas por pagar', component: CuentasPagarRetenidoPage, icon:'card'},
            {titulo: 'Info', component: InfoPage, icon:'bowtie'}
     ];
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
goToPage(page){
    this.nav.setRoot(page);
}

}

