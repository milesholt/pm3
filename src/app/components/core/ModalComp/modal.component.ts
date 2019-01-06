import { Component, OnInit, Input } from '@angular/core';
import { NavController,ModalController } from '@ionic/angular';

@Component({
  selector: 'comp-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  fields:any = [];
  @Input() params: any;
  @Input() _t: any;

  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {
    this.fields = Object.keys(this.params);
  }

  closeModal(d){
    this.modalCtrl.dismiss(d);
  } 

}
