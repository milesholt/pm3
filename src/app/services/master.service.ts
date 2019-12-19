import { Injectable, Inject } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { Definitions } from '../app.definitions';
import { Library } from '../app.library';
import { Platform } from '@ionic/angular';

//connect to default core services
import { CoreService, ModalService} from './core/core.service';

//connect to default internal services
import { InternalService } from './internal/internal.service';

//connect to default external services
import { ExternalService } from './external/external.service';

//import compile service
import { CompileService } from './compile.service';

@Injectable()
export class MasterService {

  items; auth; user; notification; notificationExt; toast; file;

  constructor(
    private platform: Platform,
    public lib: Library,
    public core: CoreService,
    public internal: InternalService,
    public external: ExternalService,
    public modal: ModalService,
    public compile: CompileService
  ){
    this.items = this.core.items;
    this.file = this.core.file;
    this.auth = this.external.authFirebase;
    this.user = this.external.userFirebase;
    this.notification = this.core.notification;
    this.notificationExt = this.external.notificationFirebase;
    this.toast = this.core.toast;
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
