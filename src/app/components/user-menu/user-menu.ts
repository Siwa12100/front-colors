import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account-service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
})
export class UserMenuComponent {
  open = signal(false);

  constructor(
    private accountService: AccountService,
    private router: Router
  ) { }

  get user() {
    // TODO : à link
    //return this.accountService.getUserInfo();
    return {
      fullName: 'Monsieur Test',
      email: 'test@gmail.com',
      role: 'admin'
    };
  }

  toggle() {
    this.open.update(v => !v);
  }

  logout() {
    // TODO : à link
    //this.accountService.logout();
    this.router.navigateByUrl('/login');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('app-user-menu')) {
      this.open.set(false);
    }
  }
}