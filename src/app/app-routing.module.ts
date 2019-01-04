import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './pages/auth/login/login.module#AuthLoginPageModule', data: { title: 'Test1' }},
  { path: 'dashboard', loadChildren: './pages/user/dashboard/dashboard.module#UserDashboardPageModule', data: { title: 'Test2' } },
  { path: 'account', loadChildren: './pages/user/account/account.module#AccountPageModule', data: { title: 'Test3' } },
  { path: 'dashboard/(home:home)', loadChildren: './pages/user/dashboard/dashboard.module#UserDashboardPageModule', data: { title: 'Test4' } }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
