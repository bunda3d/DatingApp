import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Nav } from '../layout/nav/nav';
import { APP_TITLE } from './app.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected router = inject(Router);
  protected readonly title = signal(inject(APP_TITLE));
}
