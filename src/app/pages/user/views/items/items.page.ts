import { OnDestroy, Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterPage } from '../../../../classes/router.class';
import { CoreService } from '../../../../services/core.service';

@Component({
  selector: 'app-collections',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
  providers: [CoreService]
})
export class ItemsPage extends RouterPage implements OnDestroy {

  constructor(private router: Router, private route: ActivatedRoute, public service: CoreService) {
        super(router, route);
    }

    onEnter() {
        console.log('Items page');
    }

   onDestroy() {
      super.ngOnDestroy();
   }

}
