import { Injectable, Inject } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { Definitions } from '../../app.definitions';
import { Library } from '../../app.library';

import { Platform } from '@ionic/angular';

//connect to default internal services
import { HttpService } from './HttpService/http.service';
import { FileService } from './FileService/file.service';
import { ItemsService } from './ItemsService/items.service';
import { ToastService } from './ToastService/toast.service';
import { ModalService } from './ModalService/modal.service';
import { NotificationService } from './NotificationService/notification.service';


@Injectable()
export class CoreService {

  constructor(
    private platform: Platform,
    public lib: Library,
    public items: ItemsService,
    public modal:ModalService,
    public notification: NotificationService,
    public toast: ToastService,
    public http: HttpService,
    public file: FileService
  ){
  }

}

export { ItemsService, ModalService, NotificationService, ToastService, HttpService, FileService }
