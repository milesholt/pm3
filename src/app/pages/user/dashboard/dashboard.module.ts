import { NgModule } from '@angular/core';

//dashboard component page
//import { UserDashboardPage } from './dashboard.page';

//master page module, which contains any components necessary for all pages
import { PagesModule, UserDashboardPage } from '../../pages.module';

//to use modules of specific pages, import them here
//import { ProjectsPageModule } from '../views/projects/projects.module';

@NgModule({
  imports: [
    PagesModule,
    //ProjectsPageModule
  ],
  declarations: [
    UserDashboardPage
  ]
})
export class UserDashboardPageModule {}
