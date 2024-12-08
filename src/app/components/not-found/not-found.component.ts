import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  imports: [
    MatButton
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
