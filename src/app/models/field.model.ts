export class FieldModel {

   field:{
     key:string;
     value:string;
     type: string,
     type_options: any
   }

  constructor(){

    this.field = {
      key: '',
      value: '',
      type: 'custom',
      type_options: []
    }


  }
}
