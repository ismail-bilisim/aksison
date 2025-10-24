import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // Compenent tek başına NgModule bağlı olmadan çalışabilir.
  imports: [RouterOutlet],
  // templateUrl: './app.component.html',
  template: `<router-outlet />`, // inline template ile sadeleştirme
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'aksison';
}
