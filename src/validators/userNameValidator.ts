import { FormControl } from '@angular/forms';
 
export class UsernameValidator {
 
  static checkUsername(control: FormControl): any {
 
    return new Promise(resolve => {
 
      //Fake a slow response from server
 
      setTimeout(() => {
        if(control.value.toLowerCase() === "greg"){
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