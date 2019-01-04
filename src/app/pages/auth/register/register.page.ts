import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-auth-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
  providers: [CoreService, Library]
})
export class AuthRegisterPage {

  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    public navCtrl: NavController,
    public service: CoreService,
    public formBuilder: FormBuilder
  ) {}

   ngOnInit() {
     this.registerForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
     });
  }

  tryRegister(value){
    this.service.auth.doRegister(value)
     .then(res => {
       this.errorMessage = "";
       this.successMessage = "Your account has been created. Please log in now.";
     }, err => {
       this.errorMessage = err.message;
       this.successMessage = "";
     })
  }

}
