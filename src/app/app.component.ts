import { Component } from '@angular/core';
import {Router,RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crypto';

  public constructor(private router: Router) {}

  public routeTo(target: string):void {
    console.log('routeTo', target);
    this.router.navigate([target]);
  }
}
