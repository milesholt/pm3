import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserDashboardPageRoutingModule } from './dashboard.router.module';

import { UserDashboardPage } from './dashboard.page';
import { ContactPageModule } from '../views/contact/contact.module';
import { AboutPageModule } from '../views/about/about.module';
import { HomePageModule } from '../views/home/home.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    UserDashboardPageRoutingModule,
    HomePageModule,
    AboutPageModule,
    ContactPageModule
  ],
  declarations: [UserDashboardPage]
})
export class UserDashboardPageModule {}
