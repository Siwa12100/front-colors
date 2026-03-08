import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account-service';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

  constructor(
    private accountService: AccountService,
    private router: Router,
  ) {}

  get isLoggedIn(): boolean {
    return this.accountService.isLoggedIn();
  }

  get userInfo() {
    return this.accountService.getUserInfo();
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/login');
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
