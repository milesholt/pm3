import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ItemsPage } from './items.page';

import { ItemComponentModule } from '../../../../components/core/ItemComp/item.module';
//import { ItemComponent } from '../../../../components/core/ItemComp/item.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ItemComponentModule,
    RouterModule.forChild([{ path: '', component: ItemsPage }])
  ],
  entryComponents: [],
  declarations: [ItemsPage ]
})
export class ItemsPageModule {}
