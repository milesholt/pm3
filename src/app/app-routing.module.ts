import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';


const routes: Routes = [
  { path: '', loadChildren: './pages/pages.module#PagesModule' },
  { path: 'login', loadChildren: './pages/pages.module#PagesModule' },
  { path: 'logout', loadChildren: './pages/pages.module#PagesModule' },
  { path: 'register', loadChildren: './pages/pages.module#PagesModule' },
  { path: 'account', loadChildren: './pages/pages.module#PagesModule' },
  { path: 'settings', loadChildren: './pages/pages.module#PagesModule' },
  { path: 'dashboard', loadChildren: './pages/pages.module#PagesModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes),IonicModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
