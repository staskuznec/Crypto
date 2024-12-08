import { Component } from '@angular/core';
import {Router,RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';
import {Routers} from './constants/routers';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbar, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crypto';
  routers = Routers;
  public constructor(private router: Router) {}

  public routeTo(target: string):void {
    console.log('routeTo', target);
    this.router.navigate([target]);
  }
}
