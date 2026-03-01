import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { Observable, of } from 'rxjs';

// service to initialize the application before the components
// in order to authorize users before loading guarded components

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService);

  init() {
    const userString = localStorage.getItem('user');
    if (!userString) return of(null);
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);

    // need to return any value to subscribers to indicate initialization is complete
    return of(null); // 'of' formerly 'Observable.of'
  }
}
