import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';

import { ProxyService } from '../services/PROXY.service';
import { GlobalService } from '../services/GLOBAL.service';
import { CuentaBancoService } from '../services/cuentaBanco.service';
import { SubCuentaService } from '../services/subcuenta.service';
import { MovimientoService } from '../services/movimientos.service';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { InicioPageModule } from '../pages/inicio/inicio.module';
import { InfoPageModule } from '../pages/info/info.module';
import { CuentaBancariaPageModule } from '../pages/cuenta-bancaria/cuenta-bancaria.module';
import { SubcuentaPageModule } from '../pages/subcuenta/subcuenta.module';
import { RegistraCargoAbonoPageModule } from '../pages/registra-cargo-abono/registra-cargo-abono.module';
import { DetalleMovimientosPageModule } from '../pages/detalle-movimientos/detalle-movimientos.module';
import { VerMovimientoPageModule } from '../pages/ver-movimiento/ver-movimiento.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
	  HttpModule,
    InicioPageModule,
    InfoPageModule,
    CuentaBancariaPageModule,
    SubcuentaPageModule,
    RegistraCargoAbonoPageModule,
    DetalleMovimientosPageModule,
    VerMovimientoPageModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__goexpense',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage    
  ],
  providers: [
    Network,
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProxyService, GlobalService,
    CuentaBancoService, SubCuentaService, MovimientoService
  ]
})
export class AppModule {}
