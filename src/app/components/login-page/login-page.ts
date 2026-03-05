import { Component } from '@angular/core';
import { AccountService } from '../../services/account-service';

@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

  constructor(private accountService: AccountService) {}

  loginWithGoogle(): void {
    this.accountService.loginWithGoogle();
  }
}
