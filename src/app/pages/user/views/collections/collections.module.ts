import { NgModule } from '@angular/core';
import { CollectionsPage } from './collections.page';

import { ItemComponentModule } from '../../../../components/core/ItemComp/item.module';

@NgModule({
  imports: [ItemComponentModule],
  entryComponents: [],
  declarations: [CollectionsPage]
})
export class CollectionsPageModule {}
