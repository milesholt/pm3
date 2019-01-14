import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';

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

//Internal Services
import { InternalService, ItemsService, ToastService, ModalService, NotificationService } from './services/internal/internal.service';

//External Services
import { ExternalService, AuthServiceFirebase, DatabaseServiceFirebase, NotificationServiceFirebase, UserServiceFirebase } from './services/external/external.service';

//Library Service
import { Library } from './app.library';

/* Pipes */
// import { KeysPipe } from './pipes/keys.pipe/keys.pipe';
// import { SafeHtmlPipe } from './pipes/safehtml.pipe/safehtml.pipe';
//import { TestPipe } from './test.pipe';



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
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  providers: [
    Library,
    StatusBar,
    SplashScreen,
    Facebook,
    GooglePlus,
    TwitterConnect,
    InternalService,
    ExternalService,
    ItemsService,
    ToastService,
    AuthServiceFirebase,
    UserServiceFirebase,
    DatabaseServiceFirebase,
    NotificationServiceFirebase,
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
