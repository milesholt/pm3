import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ItemComponent } from './item.component';

@NgModule({
  imports:[
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule],
  declarations: [ItemComponent],
  exports: [ItemComponent]
})
export class ItemComponentModule {}
