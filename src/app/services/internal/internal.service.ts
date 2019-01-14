import { Injectable, Inject } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { Definitions } from '../../app.definitions';
import { Library } from '../../app.library';

import { Platform } from '@ionic/angular';

//connect to default internal services
import { ItemsService } from './ItemsService/items.service';
import { ToastService } from './ToastService/toast.service';
import { ModalService } from './ModalService/modal.service';
import { NotificationService } from './NotificationService/notification.service';


@Injectable()
export class InternalService {

  constructor(
    private platform: Platform,
    public lib: Library,
    public items: ItemsService,
    public modal:ModalService,
    public notification: NotificationService,
    public toast: ToastService
  ){
  }

}

export { ItemsService, ModalService, NotificationService, ToastService }
