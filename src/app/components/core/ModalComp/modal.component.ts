import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, OnDestroy, Directive, ViewContainerRef } from '@angular/core';
import { NavController,ModalController } from '@ionic/angular';
import { Library } from '../../../app.library';

import { DynamicCompDirective } from '../../../directives/dynamiccomp.directive';


@Component({
  selector: 'comp-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [Library]
})
export class ModalComponent implements OnInit, OnDestroy {
  data:any;
  @Input() _t: any;
  @Input() comp:any = false;
  @ViewChild(DynamicCompDirective, {static: true}) dynamicComp: DynamicCompDirective;

  constructor(private modalCtrl:ModalController, private lib: Library, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.data = this._t.params.modalData;
    if(!!this.comp) this.loadComponent();
  }

  closeModal(d){
    this.modalCtrl.dismiss(d);
  }

  ngOnDestroy() {
  }

  loadComponent() {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.comp);
    let viewContainerRef = this.dynamicComp.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<any>componentRef.instance).fields = this.data.fields ? this.data.fields : [];
    (<any>componentRef.instance)._t = this._t;
  }

  handleCallback(e){
    console.log(e);
  }

}
