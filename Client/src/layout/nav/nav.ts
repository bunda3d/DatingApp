import { Component, inject, signal } from '@angular/core';
import { APP_TITLE } from '../../app/app.config';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  readonly title = signal(inject(APP_TITLE));
  protected accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  protected creds: any = {};

  login() {
    this.accountService.login(this.creds).subscribe({
      next: (result) => {
        console.log(result);
        this.toast.success('Login successful');
        this.router.navigateByUrl('/members');
        this.creds = {}; //reset creds after login
      },
      error: (error) => {
        console.log(error);
        this.toast.error(error.error);
      },
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
