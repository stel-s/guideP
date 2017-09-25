import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';
/////
import { LoadingController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { userName: string, password: string } = {
    userName: 'test@example.com',
    password: 'test'
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public loadingCtrl: LoadingController) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    let loading = this.loadingCtrl.create({content : "Logging in ,please wait..."});
    loading.present();
    // this.auth.login('basic', {'email':this.email, 'password':this.password}).then(()=>{
    //     loading.dismissAll();
    // });
    console.log(this.account.userName)
    this.user.login(this.account).subscribe((resp) => {
      console.log(resp)
      this.navCtrl.push(MainPage);
       loading.dismissAll();
    }, (err) => {
      //this.navCtrl.push(MainPage);
      // Unable to log in
      loading.dismissAll();
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}