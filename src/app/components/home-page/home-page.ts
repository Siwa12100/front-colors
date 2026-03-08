import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account-service';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
})
export class HomePage implements OnInit {

  constructor(
    private accountService: AccountService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // Si l'utilisateur est déjà connecté, on le redirige vers le dashboard
    if (this.accountService.isLoggedIn()) {
      this.router.navigateByUrl('/home');
    }
  }

  loginWithGoogle(): void {
    this.accountService.loginWithGoogle();
  }
}
