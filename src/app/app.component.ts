import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './core/components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true, // Compenent tek başına NgModule bağlı olmadan çalışabilir.
  imports: [RouterOutlet, ToastContainerComponent],
  // templateUrl: './app.component.html',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'aksison';
}
