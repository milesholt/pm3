import { forwardRef, NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router';
import { UserDashboardPage } from './user/dashboard/dashboard.page';

import { HomePage } from './user/views/home/home.page';
import { AboutPage } from './user/views/about/about.page';

import { CollectionsPage } from './user/views/collections/collections.page';
import { CollectionPage } from './user/views/collection/collection.page';
import { DocumentPage } from './user/views/document/document.page';
import { ItemsPage } from './user/views/items/items.page';

import { ContactPage } from './user/views/contact/contact.page';
import { AuthLoginPage } from './auth/login/login.page';
import { AuthLogoutPage } from './auth/logout/logout.page';
import { AuthRegisterPage } from './auth/register/register.page';
import { AuthService } from '../services/external/firebase/AuthService/auth.service';

import { ItemComponent } from '../components/core/ItemComp/item.component';
import { ModalComponent } from '../components/core/ModalComp/modal.component';

import { TemplateComponent } from '../components/internal/TemplateComp/template.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: UserDashboardPage,
    children: [
      {
        path: '',
        redirectTo: '/dashboard/(home:home)',
        pathMatch: 'full',
        data: { title: 'Home Page' }
      },
      {
        path: 'home',
        outlet: 'home',
        component: HomePage
      },
      {
        path: 'items',
        outlet: 'items',
        component: ItemsPage,
        //loadChildren: './user/views/collections/collections.module#collectionsPageModule'
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
    path: 'register',
    component: AuthRegisterPage
  },
  {
    path: 'login',
    component: AuthLoginPage
  },
  {
    path: 'logout',
    component: AuthLogoutPage
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    HomePage,
    AboutPage,
    ContactPage,
    CollectionsPage,
    UserDashboardPage,
    AuthLoginPage,
    AuthLogoutPage,
    ItemsPage,
    AuthRegisterPage,
    ItemComponent,
    ModalComponent,
    TemplateComponent
  ],
  entryComponents: [ModalComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: []
})
export class PagesModule {}
export { UserDashboardPage }
export { AuthService }
