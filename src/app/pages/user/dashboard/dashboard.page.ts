import { Component, ViewChild, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { NavController, Platform, MenuController } from '@ionic/angular';
import { MasterService } from '../../../services/master.service';
import { Library } from '../../../app.library';
//import { ActivatedRoute } from '@angular/router';
import { Router, NavigationStart, RoutesRecognized, ActivatedRouteSnapshot, ActivatedRoute, ParamMap } from '@angular/router';

import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  providers: [MasterService, Library],
  encapsulation: ViewEncapsulation.None
})
export class UserDashboardPage implements OnChanges  {

  params: any;

  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    private menu: MenuController,
    public service: MasterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.service.notification.notificationService(this.service);
  }

  async ngOnInit(){
    await this.service.user.authenticate();
    if(this.service.user.user.authorised){
      console.log('user has been authorised.');
    } else{
      console.log('not authorised');
      //redirect back to login
    }
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  changeView(alias){
    this.navCtrl.navigateForward('/dashboard/('+alias+':'+alias+')');
  }

}
