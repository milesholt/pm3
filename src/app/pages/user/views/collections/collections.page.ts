import { OnDestroy, Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterPage } from '../../../../classes/router.class'

@Component({
  selector: 'app-collections',
  templateUrl: './collections.page.html',
  styleUrls: ['./collections.page.scss'],
})
export class CollectionsPage extends RouterPage implements OnDestroy {

  constructor(private router: Router, private route: ActivatedRoute) {
        super(router, route);
    }

    onEnter() {
        console.log('Collections page');
    }

   onDestroy() {
      super.ngOnDestroy();
   }

}
