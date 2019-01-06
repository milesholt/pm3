import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, MenuController } from '@ionic/angular';
import { CoreService } from '../../../services/core.service';
import { Library } from '../../../app.library';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  providers: [CoreService, Library]
})
export class UserDashboardPage {

  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    private menu: MenuController,
    public service: CoreService
  ) {
    this.service.notification.notificationService(this.service);
  }

  changeView(alias){
    this.navCtrl.navigateForward('/dashboard/('+alias+':'+alias+')');
  }

}
