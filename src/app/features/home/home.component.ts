import { Component } from '@angular/core';
import { VideodersListComponent } from "src/app/features/videoders/components/videoders-list/videoders-list.component";

@Component({
  selector: 'app-home',
  imports: [VideodersListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
