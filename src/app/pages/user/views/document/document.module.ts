import { NgModule } from '@angular/core';
import { DocumentPage } from './document.page';

import { ItemComponentModule } from '../../../../components/core/ItemComp/item.module';

@NgModule({
  imports: [ItemComponentModule],
  entryComponents: [],
  declarations: [DocumentPage]
})
export class DocumentPageModule {}
