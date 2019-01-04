import { SimpleChanges, OnDestroy, OnChanges, Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter, tap } from 'rxjs/operators';
//import { ItemComponent } from '../../../../components/ItemComp/item.component';

import { RouterPage } from '../../../../classes/router.class'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage extends RouterPage implements OnDestroy {

  //@ViewChild(ItemComponent) itemComp: ItemComponent

  // constructor() {}
  // ngOnChanges(changes: SimpleChanges) {}
  // ngOnInit(){}
  // ngAfterContentInit(){}
  // ngAfterViewInit(){}
  // ngDoCheck(){}
  // ngAfterViewChecked(){}
  // ngOnDestroy(){}

  constructor(private router: Router, private route: ActivatedRoute) {
        super(router, route);
    }

    onEnter() {
        console.log('My page enter');
    }

   onDestroy() {
      super.ngOnDestroy();
   }

}
