import { OnDestroy, Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterPage } from '../../../../classes/router.class'

@Component({
  selector: 'app-collections',
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
})
export class DocumentPage extends RouterPage implements OnDestroy {

  constructor(private router: Router, private route: ActivatedRoute) {
        super(router, route);
    }

    onEnter() {
        console.log('Document page');
    }

   onDestroy() {
      super.ngOnDestroy();
   }

}
