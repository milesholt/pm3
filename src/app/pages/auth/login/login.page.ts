import { forwardRef, Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  providers: [CoreService, Library]
})
export class AuthLoginPage {

  user:any;
  signedIn:any;
  greeting:string;
  loginForm: any;
  errorMessage: string = '';

  constructor(
    public navCtrl: NavController,
    public service: CoreService,
    public formBuilder: FormBuilder
  ) {}

   ngOnInit() {
     this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
     });
  }

  registerAccount(){
     this.navCtrl.navigateForward('/register');
  }

  tryLogin(value){
    this.service.auth.doLogin(value)
    .then(res => {
      console.log(res);
      this.navCtrl.navigateForward('/dashboard');
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
    })
  }

  socialLogin(social){
    eval('this.service.auth.do' + social + 'Login()')
    .then((res) => {
      console.log('logged in');
      this.navCtrl.navigateForward('/dashboard');
    }, (err) => {
      this.errorMessage = err.message;
    });
  }


}
