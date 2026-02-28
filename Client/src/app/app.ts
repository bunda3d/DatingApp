import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Nav } from "../layout/nav/nav";
import { APP_TITLE } from './app.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private http = inject(HttpClient);
  protected readonly title = signal(inject(APP_TITLE));
  protected members = signal<any>([]);

  // initialization
  async ngOnInit() {
    this.members.set(await this.getMembers());
  }

  async getMembers() {
    try { 
      return lastValueFrom(this.http.get('https://localhost:5001/api/members'));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }


}
