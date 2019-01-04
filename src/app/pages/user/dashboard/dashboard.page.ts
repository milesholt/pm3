import { Component, ViewChild } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  providers: [CoreService]
})
export class UserDashboardPage {

  title:string = 'Home';

  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    public service: CoreService
  ) {
    this.service.notification.notificationService(this.service);
  }

  changeView(alias){
    this.title = alias;
    this.navCtrl.navigateForward('/dashboard/('+alias+':'+alias+')');
  }

}
