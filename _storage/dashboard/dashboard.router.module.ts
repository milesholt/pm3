import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserDashboardPage } from './dashboard.page';
import { HomePage } from '../views/home/home.page';
import { AboutPage } from '../views/about/about.page';
import { ContactPage } from '../views/contact/contact.page';

const routes: Routes = [
  {
    path: 'dashboard',
    component: UserDashboardPage,
    children: [
      {
        path: '',
        redirectTo: '/dashboard/(home:home)',
        pathMatch: 'full',
      },
      {
        path: 'home',
        outlet: 'home',
        component: HomePage
      },
      {
        path: 'about',
        outlet: 'about',
        component: AboutPage
      },
      {
        path: 'contact',
        outlet: 'contact',
        component: ContactPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/dashboard/(home:home)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDashboardPageRoutingModule {}
