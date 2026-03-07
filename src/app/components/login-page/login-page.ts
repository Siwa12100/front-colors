import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/account-service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-login-page',
  imports: [ToastComponent],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})

export class LoginPage implements OnInit {
  toastMessage = '';

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['error']) {
        this.toastMessage = decodeURIComponent(params['msg'] ?? 'Une erreur est survenue.');
      }
    });
  }

  loginWithGoogle(): void {
    this.accountService.loginWithGoogle();
  }
}
