import { FormControl } from '@angular/forms';
import { User } from '../providers/providers';
import { Injectable } from '@angular/core';


@Injectable()
export class UsernameValidator {


  constructor(public user: User){
  }
   checkUsername(control: FormControl): any {

     this.user.isAvailable(control.value).subscribe(()=> console.log('wtf'))

    return new Promise(resolve => {

      //Fake a slow response from server

      setTimeout(() => {
        if(control.value.toLowerCase() === "stel"){
                console.log("WTF")

          resolve({
            "username taken": true
          });

        } else {
          resolve();
        }
      }, 2000);

    });
  }

}

