import { Injectable } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { ModalComponent } from '../../../components/core/ModalComp/modal.component';


@Injectable()
export class ModalService {

  constructor(private modalCtrl:ModalController) {}

  //launches Modal Component and passes / returns data
  async openModal(params,comp)
  {
    console.log('modal test');
    const modal = await this.modalCtrl.create({
     component: ModalComponent,
     componentProps: {"params": params}
   });
   await modal.present();
   return await modal.onDidDismiss();
  }

}
