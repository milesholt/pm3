import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';
import { UserDashboardPage } from './user/dashboard/dashboard.page';

//Main pages
import { HomePage } from './user/views/home/home.page';
import { AboutPage } from './user/views/about/about.page';
import { ItemsPage } from './user/views/items/items.page';
import { ContactPage } from './user/views/contact/contact.page';
import { AuthLoginPage } from './auth/login/login.page';
import { AuthLogoutPage } from './auth/logout/logout.page';
import { AuthRegisterPage } from './auth/register/register.page';
import { UserSettingsPage } from './user/settings/settings.page';
import { UserAccountPage } from './user/account/account.page';

//Core components
import { ItemComponent } from '../components/core/ItemComp/item.component';
import { ItemComponent2 } from '../components/core/ItemComp2/item.component';
import { ModalComponent } from '../components/core/ModalComp/modal.component';

//Internal components
import { TemplateComponent } from '../components/internal/TemplateComp/template.component';
import { WritingComponent, MarkupWritingComponent, GroupsWritingComponent, ItemsWritingComponent } from '../components/internal/WritingComp/writing.component';

//pipes
import { KeysPipe } from '../pipes/keys.pipe/keys.pipe';
import { SafeHtmlPipe } from '../pipes/safehtml.pipe/safehtml.pipe';
import { ElFormatPipe } from '../pipes/elformatter.pipe/elformatter.pipe';
import { SearchPipe } from '../pipes/search.pipe/search.pipe';


import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import {DragDropModule} from '@angular/cdk/drag-drop';

const routes: Routes = [
   {
    path: 'dashboard',
    component: UserDashboardPage,
    data: { title: 'Home' },
    children: [
      {
        path: '',
        redirectTo: '/dashboard/(home:home)',
        pathMatch: 'full',
        data: { title: 'Home' }
      },
      {
        path: 'home',
        outlet: 'home',
        component: HomePage,
        data: { title: 'Home' }
      },
      {
        path: 'items',
        outlet: 'items',
        component: ItemsPage,
        data: { title: 'Items' },
      },
      {
        path: 'about',
        outlet: 'about',
        component: AboutPage,
        data: { title: 'About' }
      },
      {
        path: 'contact',
        outlet: 'contact',
        component: ContactPage,
        data: { title: 'Contact' }
      },
      {
        path: 'work',
        redirectTo: '/dashboard/work',
        pathMatch: 'full',
        data: { title: 'Work' }
      }
    ]
  },
  {
    path: 'account',
    component: UserAccountPage,
    data: { title: 'Account' }
  },
  {
    path: 'settings',
    component: UserSettingsPage,
    data: { title: 'Settings' }
  },
  {
    path: 'register',
    component: AuthRegisterPage,
    data: { title: 'Register' }
  },
  {
    path: 'login',
    component: AuthLoginPage,
    data: { title: 'Login' }
  },
  {
    path: 'logout',
    component: AuthLogoutPage,
    data: { title: 'Logout' }
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard/work/:id',
    component: WritingComponent,
    data: { title: 'Work' },
  }
];

@NgModule({
  declarations: [
    HomePage,
    AboutPage,
    ContactPage,
    UserDashboardPage,
    UserSettingsPage,
    UserAccountPage,
    AuthLoginPage,
    AuthLogoutPage,
    AuthRegisterPage,
    ItemsPage,
    ItemComponent,
    ItemComponent2,
    ModalComponent,
    TemplateComponent,
    WritingComponent,
    MarkupWritingComponent,
    GroupsWritingComponent,
    ItemsWritingComponent,
    KeysPipe,
    SafeHtmlPipe,
    ElFormatPipe,
    SearchPipe
  ],
  entryComponents: [ModalComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatAutocompleteModule,
    DragDropModule
  ],
  exports: [RouterModule],
  providers: [ElFormatPipe],
  bootstrap: []
})
export class PagesModule {}
