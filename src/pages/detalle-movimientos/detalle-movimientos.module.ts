import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleMovimientosPage } from './detalle-movimientos';

@NgModule({
  declarations: [
    DetalleMovimientosPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleMovimientosPage),
  ],
})
export class DetalleMovimientosPageModule {}
