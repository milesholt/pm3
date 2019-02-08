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
   name: any,
   desc: any
 };

 collection:{
   isCollection:boolean
 }

 event:{
   startdate:any,
   enddate:any
 };

 work:{
   content:any
   component:any
 };

 messageGroup:{
    messages:{}
 };

 message:{
   uid:any,
   date_sent:any,
   date_delivered:any,
   content:any
 }


 params:{}


  constructor(){

    this.event = {
      startdate: { value: "", type: "date" },
      enddate: { value: "", type: "date" }
    }

    this.work = {
      content: { value: "", type: "textarea" },
      component: { value: "work", type: "component" },
    }

    this.document = {
      name: { value: "", type: "text" },
      desc: { value: "", type: "text" }
    }

    this.collection = {
      isCollection: true
    }

    this.message = {
      uid: { value: "", type: "number" },
      date_sent: { value: "", type: "date" },
      date_delivered: { value: "", type: "date" },
      content: { value: "", type: "textarea" }
    }

    this.messageGroup = {
      messages : {
        "message1": this.message
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
