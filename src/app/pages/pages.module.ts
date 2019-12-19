import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

// import { BrowserModule }    from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

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
import { ModalComponent } from '../components/core/ModalComp/modal.component';
import { FormComponent } from '../components/core/FormComp/form.component';

//Internal components
import { TemplateComponent } from '../components/internal/TemplateComp/template.component';
import { WritingComponent, MarkupWritingComponent, EditorWritingComponent, GroupsWritingComponent, GroupsWritingModalComponent , SegmentsWritingModalComponent } from '../components/internal/WritingComp/writing.component';

//pipes
import { KeysPipe } from '../pipes/keys.pipe/keys.pipe';
import { SafeHtmlPipe } from '../pipes/safehtml.pipe/safehtml.pipe';
import { ElFormatPipe } from '../pipes/elformatter.pipe/elformatter.pipe';
import { SearchPipe } from '../pipes/search.pipe/search.pipe';

//directives
import { DynamicCompDirective } from '../directives/dynamiccomp.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

const routes: Routes = [
   {
    path: 'dashboard',
    component: UserDashboardPage,
    data: { title: 'Home' },
    children: [
      {
        path: 'home',
        data: { title: 'Home' },
        children: [{ path: '', component: HomePage }]
      },
      {
        path: 'items',
        data: { title: 'Items' },
        children: [{ path: '', component: ItemsPage }],
      },
      {
        path: 'about',
        data: { title: 'About' },
        children: [{ path: '', component: AboutPage }],
      },
      {
        path: 'contact',
        data: { title: 'Contact' },
        children: [{ path: '', component: ContactPage }],
      },
      {
        path: 'work',
        redirectTo: '/dashboard/work',
        pathMatch: 'full',
        data: { title: 'Work' }
      },
      {
        path: '',
        redirectTo: '/dashboard/home',
        pathMatch: 'full'
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
   },
   {
     path: '',
     redirectTo: '/dashboard/home',
     pathMatch: 'full'
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
    UserDashboardPage,
    ItemComponent,
    ModalComponent,
    FormComponent,
    TemplateComponent,
    WritingComponent,
    MarkupWritingComponent,
    EditorWritingComponent,
    GroupsWritingComponent,
    GroupsWritingModalComponent,
    SegmentsWritingModalComponent,
    KeysPipe,
    SafeHtmlPipe,
    ElFormatPipe,
    SearchPipe,
    DynamicCompDirective
  ],
  entryComponents: [ModalComponent,FormComponent,GroupsWritingModalComponent,SegmentsWritingModalComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    DragDropModule,
    PDFExportModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [RouterModule,FormComponent],
  providers: [ElFormatPipe],
  bootstrap: []
})
export class PagesModule {}
