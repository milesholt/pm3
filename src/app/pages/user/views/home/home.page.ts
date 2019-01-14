import { OnDestroy, Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterPage } from '../../../../classes/router.class';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage extends RouterPage implements OnDestroy {

  constructor(private router: Router, private route: ActivatedRoute) {
        super(router, route);
    }

    ngOnInit() {
      //console.log(this.route);

   }

    onEnter() {
      console.log('Home page');
      this.route.queryParams.subscribe(params => {
        //  console.log(params);
      });
    }

   onDestroy() {
      super.ngOnDestroy();
   }

}
