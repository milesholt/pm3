import { NgModule } from '@angular/core';
import { ProjectsPage } from './projects.page';

import { ItemComponentModule } from '../../../../components/ItemComp/item.module';

@NgModule({
  imports: [ItemComponentModule],
  entryComponents: [],
  declarations: [ProjectsPage]
})
export class ProjectsPageModule {}
