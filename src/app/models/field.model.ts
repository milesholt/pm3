export class FieldModel {

   field:{
     id:number;
     orderid:number;
     key:string
     value:string
     type:string
     type_options:any;
     label:string
     placeholder:string
     desc:string
   }

  constructor(){

    this.field = {
      id:0,
      orderid:0,
      key: 'newfield',
      value: '',
      type: 'text',
      type_options: {},
      label: '',
      placeholder: '',
      desc: ''
    }


  }
}
