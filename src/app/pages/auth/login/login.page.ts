import { forwardRef, Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
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
    .then(async res => {
      console.log(res);
      await this.service.user.authenticate();
      let test:any = {'data': 'test'};
      this.router.navigate(['/dashboard'],{queryParams:{ page: 1}, relativeTo: this.route});
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
