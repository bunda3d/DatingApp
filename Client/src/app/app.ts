import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Nav } from '../layout/nav/nav';
import { APP_TITLE } from './app.config';
import { AccountService } from '../core/services/account-service';
import { User } from '../types/user';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly accountService = inject(AccountService);
  protected router = inject(Router);
  private readonly http = inject(HttpClient);
  protected readonly title = signal(inject(APP_TITLE));
  protected members = signal<User[]>([]);

  // initialization
  async ngOnInit() {
    this.members.set(await this.getMembers());
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }

  async getMembers() {
    try {
      return lastValueFrom(this.http.get<User[]>('https://localhost:5001/api/members'));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
