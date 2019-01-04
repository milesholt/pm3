import { NgModule } from '@angular/core';

import { ItemComponent } from './item.component';
//import { TemplateComponent } from '../TemplateComp/template.component';

@NgModule({
  declarations: [ItemComponent],
  exports: [ItemComponent],
  providers: []
})
export class ItemComponentModule {}
