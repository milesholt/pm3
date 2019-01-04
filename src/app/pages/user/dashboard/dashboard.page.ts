import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { NavController, Platform, MenuController } from '@ionic/angular';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  providers: [CoreService]
})
export class UserDashboardPage {

  title:string = 'Home';
  @Output() callback = new EventEmitter();

  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    private menu: MenuController,
    public service: CoreService
  ) {
    this.service.notification.notificationService(this.service);
  }

  changeView(alias){
    this.title = alias;
    this.navCtrl.navigateForward('/dashboard/('+alias+':'+alias+')');
  }

  openFirstMenu() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openSecondMenu() {
    this.menu.enable(true, 'second');
    this.menu.open('second');
  }

  //Emit requested data back to Item Component
  emit(params){
    this.callback.emit(params);
  }


}
