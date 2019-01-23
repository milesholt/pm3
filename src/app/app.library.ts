import {Platform} from "@ionic/angular";
import {Component,Injectable, Inject} from "@angular/core";


/******************LIBRARY FUNCTIONS**********************/

@Injectable()
export class Library{

      test(){
        return 'test';
      }

      //prepare data that needs to be modified by user
      //converts data and binds it to structure in Definitions
      //any values that match keys are bound, otherwise value is blank
      prepareData(pri,sec){
        console.log(sec);
        let obj = {};
        Object.keys(pri).forEach(field => {
          console.log(field);
          if(sec.hasOwnProperty(field)) obj[field] = this.deepCopy(pri[field]);
          if(Object.keys(sec).includes(field)) obj[field].value = sec[field];
        });
        console.log(obj);
        return obj;
      }

      //compile data back to server friendly structure { key : value }
      compileData(data:any = false){
        if(!data) return;
        let obj = {};
        Object.keys(data).forEach(field => {
          obj[field] =  this.deepCopy(data[field].value);
        });
        return obj;
      }

      //returns length of keys in object
      objLength(object){
        return Object.keys(object).length;
      }

      //returns keys
      keys(object){
        return Object.keys(object);
      }

      //merge two objects with matching keys
      mergeObjs(obj, src) {
          for (var key in src) {
              if (src.hasOwnProperty(key)) obj[key] = src[key];
          }
          return obj;
      }

      //returns if object is empty, the one above is 10 times slower if there are properties
      isEmpty(obj) {
          for(var prop in obj) {
              if(obj.hasOwnProperty(prop))
                  return false;
          }

          return true;
      }


      //create a new instance of an object, avoids duplicate objects carrying same value
      newObj(object){
           return Object.assign({}, object);
      }

      //duplicates a new instance of an array
      duplicateArray(array) {
      let arr = [];
        array.forEach((x) => {
          arr.push(Object.assign({}, x));
        })
        return arr;
      }

      //delete index from array
      delete(index,array){
        return  array.splice(index,1);
       }

      //in case the above don't work, this is the solution for a deep copy, but is apparently quite slow?
      deepCopy(origObj){
        var newObj = origObj;
         if (origObj && typeof origObj === "object") {
             newObj = Object.prototype.toString.call(origObj) === "[object Array]" ? [] : {};
             for (var i in origObj) {
                 newObj[i] = this.deepCopy(origObj[i]);
             }
         }
         return newObj;
      }

      //returns true if it is an array
      isArray(value){
        return Array.isArray(value) && value.constructor === Array;
      }

      //returns true if it is an object
      isObject(value){
        return typeof value === 'object' && value.constructor !== Array;
      }

      //returns if objects has property
      isProperty(obj,prop){
        return obj.hasOwnProperty(prop);
      }

      //returns true if defined
      isDefined(object){
        if(typeof object === undefined || !object){
          return false;
        } else{
          return true;
        }
      }

      //get target element
      getTargetElement(event){
        return event.target.localName;
      }

      //capitalise
      capitalise(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      //get max id
      //build an array of all the ids
      //find the highest id
      //loop through items, if matching id, take highest id and increment
      updateIds(arr){
        if(arr.length > 1){
          let ids =  arr.map(item => item.id);
          const maxid = Math.max(...ids);
          let newid = parseInt(arr[arr.length-1].id);
          if(ids.includes(newid)) arr[arr.length-1].id = (maxid+1);
        }
      }


}
