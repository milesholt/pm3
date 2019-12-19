import { OnDestroy, Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterPage } from '../../../../classes/router.class';
import { MasterService } from '../../../../services/master.service';

import { FormComponent } from '../../../../components/core/FormComp/form.component';


@Component({
  selector: 'app-collections',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
  providers: [MasterService]
})
export class ItemsPage extends RouterPage implements OnDestroy {

  comp:any;

  constructor(private router: Router, private route: ActivatedRoute, public service: MasterService) {
        super(router, route);
    }

    onEnter() {
      console.log(this.activeComp.name);
      this.comp = FormComponent;
    }

   onDestroy() {
      super.ngOnDestroy();
   }

   handleCallback(e){
     const action = e.action;
     let item = e.item;
     console.log(e);
     console.log(e.action);
     switch(action){
       case 'component':
        console.log('routing');
        this.router.navigateByUrl(`/dashboard/${item.data.component}/${item.id}`)
       break;
     }
   }

}
