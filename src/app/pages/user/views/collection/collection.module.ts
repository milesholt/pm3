import { NgModule } from '@angular/core';
import { CollectionPage } from './collection.page';

import { ItemComponentModule } from '../../../../components/core/ItemComp/item.module';

@NgModule({
  imports: [ItemComponentModule],
  entryComponents: [],
  declarations: [CollectionPage]
})
export class CollectionPageModule {}
