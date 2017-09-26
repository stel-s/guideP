import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Jsonp } from '@angular/http';

import { Api } from '../api/api';

import { IAccountInfo } from "../../interfaces/interfaces";

import {JwtHelper} from "angular2-jwt";
import {Storage} from "@ionic/storage";

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;
  jwtHelper = new JwtHelper();

  constructor(public http: Http, public api: Api, private jsonp: Jsonp, public storage: Storage) {
  }

 search (term: string) {
  var search = new URLSearchParams()
  search.set('action', 'opensearch');
  search.set('search', term);
  search.set('format', 'json');
  return this.jsonp
              .get('http://en.wikipedia.org/w/api.php?callback=JSONP_CALLBACK', { search })
              .map((response) => response.json()[1]);
}

  isAvailable (term: string) {
    let USERNAME = term;
    //var search = new URLSearchParams()


    let seq = this.api.get(`gocore/user/isAvailable/email/${USERNAME}`).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        console.log(res);
        // If the API returned a successful response, mark the user as logged in
        if (res.status == 'success') {

        } else {
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this.api.post('gocore/authenticate', accountInfo).share();

    seq
      .map(res => res)
      .subscribe(res => {
        
        // If the API returned a successful response, mark the user as logged in
        // if (res.status == 'success') {
        //   this._loggedIn(res);
        // } else {
        // }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: IAccountInfo) {
    let seq = this.api.post('gocore/user/create/guide', accountInfo).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        if (res.status == 'success') {
          this._loggedIn(res);
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  getProfile(accountInfo: IAccountInfo) {
     // let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
     // let options = new RequestOptions({ headers: headers });
    let seq = this.api.post('signup', accountInfo).share();

    seq
      .map(res => res.json())
      .subscribe(res => {
        // If the API returned a successful response, mark the user as logged in
        if (res.status == 'success') {
          this._loggedIn(res);
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }
  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }

  authSuccess(token) {
    // this.error = null;
    this.storage.set('token', token);
    this._user = this.jwtHelper.decodeToken(token);
    this.storage.set('profile', this._user);
  }
}
