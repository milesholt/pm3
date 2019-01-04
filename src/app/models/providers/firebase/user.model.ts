export class FirebaseUserModel {
  image: string;
  name: string;
  provider: string;
  uid:string;
  authorised:boolean;

  constructor(){
    this.image = "";
    this.name = "";
    this.provider = "";
    this.uid = "";
    this.authorised = false;
  }
}
