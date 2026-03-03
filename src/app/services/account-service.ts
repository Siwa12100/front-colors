import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  constructor() { }

  public isNotEmptyUsername(username: string): boolean
  {
    return username.trim().length != 0;//check if not just spaces
  }

  public isSamePassword(pass1 : string, pass2: string): boolean
  {
    return pass1 == pass2;
  }
  
  public isStrongPassword(password: string): boolean
  {
    if (password.length < 8)
    {
      return false;
    }
    let weak = ["1234", "123456", "admin", "user", "password"] //we can add more to the list
    weak.forEach(function (weakValue) { if (password.includes(weakValue)) return false; return true;})
    return true;
  }

  public async registerUser(username: string, password: string)//: Promise<string> TO DECOMMENT WHEN API WORKING
  {
    //TODO
  }
  
  public async loginUser(username: string, password: string)//: Promise<string> TO DECOMMENT WHEN API WORKING
  {
    //TODO
  }


   public async logoutUser(username: string, password: string)//: Promise<string> TO DECOMMENT WHEN API WORKING
  {
    //TODO
  }

}
