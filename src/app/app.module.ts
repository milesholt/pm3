import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

//Social Login imports
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { TwitterConnect } from '@ionic-native/twitter-connect/ngx';

//BaaS provider imports
import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFireFunctions } from '@angular/fire/functions';

//Main Services
import { AuthService } from './services/external/firebase/AuthService/auth.service';
import { UserService } from './services/external/firebase/UserService/user.service';
import { DatabaseService } from './services/external/firebase/DatabaseService/database.service';
import { NotificationServiceExt } from './services/external/firebase/NotificationService/notification.service';
import { ToastService } from './services/internal/ToastService/toast.service';
import { ModalService } from './services/internal/ModalService/modal.service';
import { NotificationService } from './services/internal/NotificationService/notification.service';

//Library Service
import { Library } from './app.library';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    RouterModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [
    Library,
    StatusBar,
    SplashScreen,
    Facebook,
    GooglePlus,
    TwitterConnect,
    ToastService,
    AuthService,
    UserService,
    DatabaseService,
    NotificationServiceExt,
    NotificationService,
    ModalService,
    AngularFirestore,
    AngularFireMessaging,
    AngularFireFunctions,
    Firebase,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
