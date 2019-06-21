import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserDashboardPage } from './dashboard.page';

@NgModule({
  imports:[
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule],
  declarations: [UserDashboardPage],
  exports: [UserDashboardPage]
})
export class UserDashboardPageModule {}
