import { Injectable, Inject } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import { Definitions } from '../../app.definitions';
import { Library } from '../../app.library';

import { Platform } from '@ionic/angular';

//connect to default external services
import { AuthServiceFirebase } from './firebase/AuthService/auth.service';
import { UserServiceFirebase } from './firebase/UserService/user.service';
import { DatabaseServiceFirebase } from './firebase/DatabaseService/database.service';
import { NotificationServiceFirebase } from './firebase/NotificationService/notification.service';

@Injectable()
export class ExternalService {

  constructor(
    private platform: Platform,
    public lib: Library,
    public authFirebase: AuthServiceFirebase,
    public databaseFirebase: DatabaseServiceFirebase,
    public notificationFirebase : NotificationServiceFirebase,
    public userFirebase: UserServiceFirebase
  ){
  }

}

export { AuthServiceFirebase, DatabaseServiceFirebase, NotificationServiceFirebase, UserServiceFirebase }
