import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
//todo - clean these up?
import * as firebase from 'firebase/app';
//import * as app from 'firebase';

//web notifications - to cleanup, there's alot of different firebase imports (above), what do we really need?
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFireFunctions } from '@angular/fire/functions';

//toast - for testing purpose at the moment, but we should use toast service
import { ToastController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

//user auth - to get user data
import { UserServiceFirebase } from '../UserService/user.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceFirebase {
  token;
  type;
  constructor(private nativeFirebase: Firebase,
              private afs: AngularFirestore,
              private userService: UserServiceFirebase,
              private afMessaging: AngularFireMessaging,
              private fun: AngularFireFunctions,
              private toastController: ToastController,
              private platform: Platform) {

      // Bind methods to fix temporary bug in AngularFire
      try {
        const _messaging = firebase.messaging();
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
      } catch(e){
      }
  }

  async getToken() {
    if (this.platform.is('android')) {
      this.type = 'device';
      this.token = await this.nativeFirebase.getToken();
    }
    if (this.platform.is('ios')) {
      this.type = 'device';
      this.token = await this.nativeFirebase.getToken();
      await this.nativeFirebase.grantPermission();
    }
    if (!this.platform.is('cordova')) {
      this.type = 'webapp';
      this.getWebAppPermission().subscribe();
    }

    this.saveToken(this.token,this.type);
  }

  private saveToken(token,type) {
    if (!token) return;
    const devicesRef = this.afs.collection('tokens');
    const data = {
      token,
      type: type,
      userId: this.userService.user.uid,
      registered: firebase.firestore.FieldValue.serverTimestamp()
    };
    return devicesRef.doc(token).set(data);
  }

  onNotifications() {
    return this.nativeFirebase.onNotificationOpen();
  }

  getWebAppPermission(): Observable<any>  {
    return this.afMessaging.requestToken.pipe(
      tap(token => (this.token = token)),
      tap(token => console.log(`token: ${token}`)),
      tap(token => this.saveToken(token,this.type))
    )
  }

}
