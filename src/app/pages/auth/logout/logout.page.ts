import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Library } from '../../../app.library';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-auth-logout',
  templateUrl: 'logout.page.html',
  styleUrls: ['logout.page.scss'],
  providers: [CoreService, Library]
})
export class AuthLogoutPage {

  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    public navCtrl: NavController,
    public service: CoreService
  ) {}

  ngOnInit() {
  }

  tryLogout(value){
    this.service.auth.doLogout()
     .then(res => {
       this.navCtrl.navigateRoot('/login');
     }, err => {
       this.errorMessage = err.message;
     })
  }

}
