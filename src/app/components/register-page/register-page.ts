import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Router } from '@angular/router';
import { AccountService } from '../../services/account-service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule,RouterModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {

  accountService : AccountService = new AccountService();
  errorMessage :string = ""
  hid = true
  username : string = ""
  password : string = ""
  confirmationPassword : string  = ""

  inscriptionForm : FormGroup = new FormGroup({
    user : new FormControl(this.username, Validators.required),
    passwd : new FormControl(this.password, Validators.required),
    confPasswd : new FormControl(this.confirmationPassword, Validators.required)
  });

  constructor(private router : Router){}

  ngOnInit() : void
  {
    this.inscriptionForm.get('user')?.valueChanges.subscribe(value=>{this.username=value})
    this.inscriptionForm.get('passwd')?.valueChanges.subscribe(value=>{this.password=value})
    this.inscriptionForm.get('confPasswd')?.valueChanges.subscribe(value=>{this.confirmationPassword=value})
  }


  public async registerUser()
  {
    if (!this.accountService.isNotEmptyUsername(this.username))
    {
      this.errorMessage = "The username should not be empty"
    }

    else if (!this.accountService.isSamePassword(this.password, this.confirmationPassword))
    {
      this.errorMessage = "The passwords do not match"
    }

    else if (!this.accountService.isStrongPassword(this.password))
    {
      this.errorMessage = "The password is too weak"
    }
    
    //TODO
  //   const result = await this.accountService.registerUser(this.username, this.password);
  //   let res = JSON.parse(result)

  //   if (res.code != 200)
  //   {
  //     this.errorMessage = res.message
  //   }

  //   if (this.errorMessage == "")
  //   {
  //     localStorage.setItem("token", res.param.token)
  //     this.router.navigateByUrl('/main')
  //     return
  //   }

  //   else {
  //     this.hid=false;
  //     return
  //   }    
  // }
  }

}
