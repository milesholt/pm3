import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './pages/auth/login/login.module#AuthLoginPageModule' },
  { path: 'dashboard', loadChildren: './pages/user/dashboard/dashboard.module#UserDashboardPageModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
