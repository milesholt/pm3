export class ItemModel {
 item:{
   projects:{
     tasks:{}
     ideas:{}
     research:{}
     messages:{}
     calendar:{}
     work:{}
   }
 }

 document:{
   name:string,
   desc:string,
   date_created:string,
   date_updated:string
 };

 collection:{
   isCollection:boolean
 }

 event:{
   startdate:string,
   enddate:string
 };

 work:{
   content:string
   component:string
 };

 messageGroup:{
    messages:{}
 };

 message:{
   uid:string,
   sent:string,
   content:string
 }


 params:{}


  constructor(){

    this.event = {
      startdate: "",
      enddate: ""
    }

    this.work = {
      content: "",
      component: "work"
    }

    this.document = {
      name: "",
      desc: "",
      date_created: "",
      date_updated: "",
    }

    this.collection = {
      isCollection: true
    }

    this.message = {
      uid: "",
      sent: "",
      content: ""
    }

    this.messageGroup = {
      messages : {
        "message1": this.message,
        params: Object.assign({}, this.params, this.collection)
      }
    }

    const projects = {
      tasks : { "task1" : this.document, "params": Object.assign({}, this.params, this.collection) },
      ideas: { "idea1" : this.document, "params": Object.assign({}, this.params, this.collection) },
      research: { "board1" : this.document, "params": Object.assign({}, this.params, this.collection) },
      messages: { "group1" : Object.assign({}, this.document, this.messageGroup), "params": Object.assign({}, this.params, this.collection) },
      calendar: { "event1" : Object.assign({}, this.document, this.event), "params": Object.assign({}, this.params, this.collection) },
      work: { "work1" : Object.assign({}, this.document, this.work), "params": Object.assign({}, this.params, this.collection) }
    }

    this.item = {
      "projects": projects
    };

  }
}
