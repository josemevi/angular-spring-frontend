import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Welcome to angular';
  curso: string = 'Spring 5 con angular 7';
  teacher: string = 'uruguasho';
}
