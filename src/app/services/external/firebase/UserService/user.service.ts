import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import * as firebase from 'firebase/app';
import { FirebaseUserModel } from '../../../../models/providers/firebase/user.model';

@Injectable()
export class UserService {

  user: FirebaseUserModel = new FirebaseUserModel();

  constructor(){
    this.authenticate();
  }

  getCurrentUser(){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().onAuthStateChanged(function(user){
        let userModel = new FirebaseUserModel();
        if (user) {
          let pid =  user.providerData[0].providerId; //not sure what this is?
          let defaultPhoto = 'http://dsi-vd.github.io/patternlab-vd/images/fpo_avatar.png';
          userModel.image = pid == 'password' ? defaultPhoto : user.photoURL;
          userModel.name = user.displayName;
          userModel.provider = user.providerData[0].providerId;
          userModel.uid = user.uid;
          userModel.authorised = true;
          return resolve(userModel);
        } else {
          reject('No user logged in');
        }
      })
    })
  }

  authenticate(){
    this.getCurrentUser().then(user => {
      this.user = user;
      console.log(this.user);
      return true;
    }, err => console.log(err));
  }


}
