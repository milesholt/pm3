export class NodeModel {

   node:{
     id:any;
     orderid:number;
     date_created: string,
     date_updated: string,
     fields: any,
     nest: any,
     params: any
   }

  constructor(){

    this.node = {
      id:false,
      orderid:0,
      date_created: '',
      date_updated: '',
      fields: [],
      nest: [],
      params: {}
    }


  }
}
