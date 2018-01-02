import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CuentaBancariaPage } from './cuenta-bancaria';

@NgModule({
  declarations: [
    CuentaBancariaPage,
  ],
  imports: [
    IonicPageModule.forChild(CuentaBancariaPage),
  ],
})
export class CuentaBancariaPageModule {}
