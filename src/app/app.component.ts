import { Component } from '@angular/core';
import { NavController, Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module.ts';
import { Router, NavigationStart, RoutesRecognized, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  title:string = 'Home';

  constructor(
    private platform: Platform,
    private menu: MenuController,
    public navCtrl: NavController,
    private router: Router,
    private routerMod: AppRoutingModule,
    private route: ActivatedRoute,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
    this.statusBar.styleDefault();
    this.splashScreen.hide();
    this.detectRoutes();
    });
  }

  ionViewDidEnter(){
    console.log('view change');
  }

  changeView(alias,dash:boolean = false){
    this.title = alias;
    const path = dash ? '/dashboard/('+alias+':'+alias+')' : '/'+alias;
    this.navCtrl.navigateForward(path);
    this.menu.close('first');
    this.menu.close('second');
  }

  openFirstMenu() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openSecondMenu() {
    this.menu.enable(true, 'second');
    this.menu.open('second');
  }

  handleCallback(e){
    console.log(e);
  }

  onEnter() {
    console.log(this.activeComp.name);
  }

  detectRoutes(){

    this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        console.log(val.state.root.firstChild.data);
      }
    });

    // this.route.paramMap.subscribe(params => {
    //   console.log(params);
    // });

    // this.router.events.forEach((event) => {
    //   if(event instanceof NavigationStart) {
    //     console.log(event);
    //   }
    // });

  }


}
