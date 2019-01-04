import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable()
export class NotificationService {

  constructor(private platform: Platform) {}

  notificationService(service) {
    service.notificationExt.getToken();
    if (this.platform.is('cordova')) {
      service.notificationExt.onNotifications().subscribe(
        (msg) => {
          if (this.platform.is('ios')) {
            service.toast.presentToast(msg.aps.alert);
          } else {
            service.toast.presentToast(msg.body);
          }
      });
    }
  }

}
