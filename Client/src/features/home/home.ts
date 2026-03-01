import { Component, Input, signal } from '@angular/core';
import { Register } from '../account/register/register';
import { User } from '../../types/user';

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected isRegisterMode = signal(false);

  showRegisterForm(value: boolean) {
    this.isRegisterMode.set(value);
  }
}
