import { OnDestroy, Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterPage } from '../../../../classes/router.class'

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss']
})
export class AboutPage extends RouterPage implements OnDestroy {

  constructor(private router: Router, private route: ActivatedRoute) {
        super(router, route);
    }

    onEnter() {
        console.log('About page');
    }

   onDestroy() {
      super.ngOnDestroy();
   }

}
