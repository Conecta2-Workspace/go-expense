import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InicioPage } from './inicio';
import { Device } from '@ionic-native/device';

@NgModule({
  declarations: [
    InicioPage,
  ],
  imports: [
    IonicPageModule.forChild(InicioPage),
  ],
  exports: [
    InicioPage
  ],
  providers: [
    Device
  ]
})
export class InicioPageModule {}
