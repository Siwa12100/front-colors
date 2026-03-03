import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Router } from '@angular/router';
import { AccountService } from '../../services/account-service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  
  accountService : AccountService = new AccountService()
  username : string = ""
  password : string = ""
  errorMessage = ""
  hid = true

  constructor(private router : Router){}

  connexionForm : FormGroup = new FormGroup({
    user : new FormControl(this.username, Validators.required),
    passwd : new FormControl(this.password, Validators.required)
  });
  
  ngOnInit() : void
  {
    this.connexionForm.get('user')?.valueChanges.subscribe(value=>{this.username=value})
    this.connexionForm.get('passwd')?.valueChanges.subscribe(value=>{this.password=value})
  }


  async loginUser()
  {
    // TODO fonction de connection 
    const result = await this.accountService.loginUser(this.username, this.password);

    //TODO DECOMMENT WHEN loginUSer implemented
    // let res = JSON.parse(result)

    // if (res.code != 200)
    // {
    //   this.errorMessage = res.message
    // }
    if (0)
    {
      //TODO remove this part when connexion implem
    }
    else {
      //reinit the error message to be able to connect if the try is successful
      this.errorMessage = ""
    }

    if (this.errorMessage == "")
    {
      // TODO DECOMMENT, allows to store the token localStorage.setItem("token", res.param.token)
      this.router.navigateByUrl('/main')
      return
    }

    else {
      this.hid=false;
      return
    }

  }

}
