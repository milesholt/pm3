import { Component, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { NavController, Platform, MenuController } from '@ionic/angular';
import { CoreService } from '../../../services/core.service';
import { Library } from '../../../app.library';
//import { ActivatedRoute } from '@angular/router';
import { Router, NavigationStart, RoutesRecognized, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  providers: [CoreService, Library]
})
export class UserDashboardPage implements OnChanges  {

  params: any;

  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    private menu: MenuController,
    public service: CoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.service.notification.notificationService(this.service);
  }

  ngOnInit() {
    //console.log(this.route);
    this.route.queryParams.subscribe(params => {
        console.log(params);
    });
    console.log(this.route.snapshot);
    //this.params = this.route.snapshot.paramMap.get('id');


      this.router.events.subscribe(val => {
        // if (val instanceof RoutesRecognized) {
        //   const rootData = val.state.root;
        //   console.log(rootData);
        // }
        if (val instanceof ActivatedRoute) {
          const rootData = val;
          console.log(rootData);
        }
        console.log(val);
      });

  }

  ngAfterContentInit(){
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
