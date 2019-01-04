import { NgModule } from '@angular/core';
import { ItemsPage } from './items.page';

import { ItemComponentModule } from '../../../../components/core/ItemComp/item.module';

@NgModule({
  imports: [ItemComponentModule],
  entryComponents: [],
  declarations: [ItemsPage]
})
export class ItemsPageModule {}
