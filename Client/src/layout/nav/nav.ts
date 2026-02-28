import { Component, inject, signal } from '@angular/core';
import { APP_TITLE } from '../../app/app.config';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
  
export class Nav {
  readonly title = signal(inject(APP_TITLE))
  private accountService = inject(AccountService)
  protected creds: any = {}
  protected isLoggedIn = signal(false);

  login() {
    this.accountService.login(this.creds).subscribe({
      next: result => {
        console.log(result);
        this.isLoggedIn.set(true);
        this.creds = {}; //reset creds after login
      },
      error: error => alert(error.message)
    })
  }

  logout() {
    this.isLoggedIn.set(false);
  }
}
