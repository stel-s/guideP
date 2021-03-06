import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
//////////////////////
import { User } from '../../providers/providers';
import { MainPage } from '../pages';
import { ItemCreatePage } from '../item-create/item-create';

///////////////
import { IAccountInfo } from "../../interfaces/interfaces";
import { UsernameValidator } from  '../../validators/userNameValidator';
import { LoadingController } from 'ionic-angular';
////
import {JwtHelper} from "angular2-jwt";


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
   styles: [
    `.glyphicon-refresh-animate {
      -animation: spin .7s infinite linear;
      -webkit-animation: spin2 .7s infinite linear;
    }`,
    `@-webkit-keyframes spin2 {
      from { -webkit-transform: rotate(0deg);}
      to { -webkit-transform: rotate(360deg);}
    }`
  ]
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: IAccountInfo = {
    firstName: 'Test Human',
    email: 'test@example.com',
    password: 'test',
   "guideNumber": null,
  };

  // Our translated text strings
    private signupErrorString: string;
    term = new FormControl();
    private todo : FormGroup;
    public loading = false;

    jwtHelper = new JwtHelper();




  constructor(public navCtrl: NavController,
    public user: User,
    public userNameValidator: UsernameValidator,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController) {
      this.loading = true;
      this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })

     this.todo = this.formBuilder.group({
      // title: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
       email: ['', Validators.compose([Validators.required, this.emailValidator]), this.userNameValidator.checkUsername.bind(this.userNameValidator)],


      password: [''],
      confPassword: [''],
      firstName: [''],
      lastName: [''],
    });

    this.term.valueChanges
           .debounceTime(400)
           .distinctUntilChanged()
           .subscribe(term => this.user.isAvailable(term).subscribe(()=> console.log('wtf')));

           //.subscribe(()=>console.log("wtf"));
          //  let loader = this.loadingCtrl.create({
          //   content: "Please wait...",
          //   duration: 3000
          // });
          // loader.present();
  }

 emailValidator(control) {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return {invalidEmail: true};
    }
  }
  logForm(){
      console.log(this.todo.value)
    }

  doSignup() {
    console.log(this.todo.value)
    // Attempt to login in through our User service
    this.user.signup(this.todo.value).subscribe((resp) => {
      this.navCtrl.push(MainPage);
    }, (err) => {
      let errors = '';
      for(let e of err.details) {
        console.log(e);
        if(e === 'required_email') errors += 'Email is required.<br/>';
        if(e === 'required_password') errors += 'Password is required.<br/>';
        if(e === 'conflict_email') errors += 'A user with this email already exists.<br/>';
        //don't need to worry about conflict_username
        if(e === 'invalid_email') errors += 'Your email address isn\'t valid.';
      }
      // let alert = this.alertCtrl.create({
      //   title:'Register Error',
      //   subTitle:errors,
      //   buttons:['OK']
      // });
      //this.navCtrl.push(MainPage);

      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

}


