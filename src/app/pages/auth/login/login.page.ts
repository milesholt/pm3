import { forwardRef, Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

//import { switchMap } from 'rxjs/operators';

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
    private router: Router,
    private route:ActivatedRoute,
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
     this.router.navigate(['/register']);
  }


  tryLogin(value){
    this.service.auth.doLogin(value)
    .then(res => {
      console.log(res);
      this.router.navigate(['/dashboard']);
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
    })
  }

  socialLogin(social){
    eval('this.service.auth.do' + social + 'Login()')
    .then((res) => {
      console.log('logged in');
      this.router.navigate(['/dashboard']);
    }, (err) => {
      this.errorMessage = err.message;
    });
  }


}
