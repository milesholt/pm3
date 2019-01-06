import { Component } from '@angular/core';
import { NavController, Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
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

  detectRoutes(){
    this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        const rootData = val.state.root.children[0].firstChild ? val.state.root.children[0].firstChild : val.state.root.children[0];
        console.log(val.state.root);
        const title = rootData.data.title === 'Home' && rootData.children.length > 0 ? rootData.children[0].data.title : rootData.data.title;
        this.title = title;
      }
    });
  }

}
