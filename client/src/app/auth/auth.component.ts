import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService, SignInRequest } from '../services/login.service';
import { User } from '../models/user';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  public pageTitle: string;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('');
  name = new FormControl('', [Validators.required]);
  phone = new FormControl('', [Validators.required]);
  public loginPage: boolean;
  public linkText: string;
  public link: string;
  public signUpError: boolean;
  public invalidLogin: boolean;
  public hide: boolean;

  getNameErrorMessage() {
    return this.name.hasError('required') ? 'You must enter a name' : '';
  }

  getPhoneErrorMessage() {
    return this.phone.hasError('required') ? 'You must enter a phone number' : '';
  }

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' : this.email.hasError('email') ? 'Not a valid email' : '';
  }

  constructor(
    private route: ActivatedRoute,
    private login: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    const path = this.route.snapshot.url;
    if (path[0].toString() === 'login') {
      this.loginPage = true;
      this.pageTitle = 'Login';
      this.linkText = 'Sign Up';
      this.link = '/signup';
    } else if (path[0].toString() === 'signup') {
      this.loginPage = false;
      this.pageTitle = 'Sign Up';
      this.linkText = 'Login';
      this.link = '/login';
    }
  }

  submitForm() {
    if (this.loginPage) {
      const credentials: SignInRequest = {
        email: this.email.value,
        password: this.password.value
      };

      this.login.login(credentials)
        .subscribe(result => {
          if(result) {
            this.router.navigate(['/']);
          } else {
            this.invalidLogin = true;
          }
        });
    } else {
      // TODO: add code to submit new User
      const user = new User();
      user.name = this.name.value;
      user.email = this.email.value;
      user.password = this.password.value;
      user.phone = this.phone.value;

      this.login.signup(user)
        .subscribe(result => {
          if(result) {
            this.router.navigate(['/']);
          } else {
            this.signUpError = true;
          }
        });
    }
  }
}
