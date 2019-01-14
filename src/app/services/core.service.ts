import { Injectable, Inject } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { Definitions } from '../app.definitions';
import { Library } from '../app.library';
import { Platform } from '@ionic/angular';

//connect to default internal services
import { InternalService, ModalService } from './internal/internal.service';

//connect to default external services
import { ExternalService } from './external/external.service';

@Injectable()
export class CoreService {

  items; auth; user; notification; notificationExt; toast;

  constructor(
    private platform: Platform,
    public lib: Library,
    public internal: InternalService,
    public external: ExternalService,
    public modal: ModalService
  ){
    this.items = this.internal.items;
    this.auth = this.external.authFirebase;
    this.user = this.external.userFirebase;
    this.notification = this.internal.notification;
    this.notificationExt = this.external.notificationFirebase;
    this.toast = this.internal.toast;
  }

  //connects to a service
  async connectTo(connection,service){
    const type = connection[0];
    const connect = connection[1];
    const external = type === 'external' ? connection[2] : false;
    const newService = connect + (!external ? "" : this.lib.capitalise(external));
    this[service] = this[type][newService];
    console.log(this[service]);
  }

  //return definitions
  getDefinitions(){
  	 return Definitions;
  }

}

export { ModalService }
