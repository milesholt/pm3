import {Pipe} from '@angular/core';

@Pipe({
  name: 'keys',
  pure: true
})
export class KeysPipe {
  transform(value, args, impure:boolean = false) {

      let keys = [];
      //let disallowed = ['id','lid','eid'];
      let disallowed:any = []; let matchtarget:any = ''; let matchsource:any = '';
      if(args.length > 0){
        disallowed = args[0];
        matchtarget = args[1] ? args[1] : false;
        matchsource = args[2] ? args[2].trim() : false;
      }

      for (let key in value) {
        if(disallowed !== false && disallowed.length > 0){
          if(disallowed.indexOf(key) == -1){
              keys.push({key: key, value: value[key]});
          }
        }
        if(matchtarget !== false && matchtarget !== '' && matchsource !== false && matchsource !== ''){
            let t = eval('value[key].' + matchtarget);
            if(matchsource == t){
              keys.push({key: key, value: value[key]});
            }
        }

        if(args.length == 0){
          keys.push({key: key, value: value[key]});
        }
      }

      return keys;

  }
}
