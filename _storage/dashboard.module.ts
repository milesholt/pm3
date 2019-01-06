import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Routes, RouterModule } from '@angular/router';
// import { IonicModule } from '@ionic/angular';
// import { UserDashboardPage } from './dashboard.page';

import { PagesModule, UserDashboardPage } from '../../pages.module';

// const routes: Routes = [
//   {
//     path: '',
//     component: UserDashboardPage
//   }
// ];

@NgModule({
  imports: [
    PagesModule
    // CommonModule,
    // FormsModule,
    // IonicModule,
    // RouterModule.forChild(routes)
  ],
  declarations: [UserDashboardPage]
})
export class UserDashboardPageModule {}
