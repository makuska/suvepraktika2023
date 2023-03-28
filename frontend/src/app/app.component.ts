import { Component } from '@angular/core';

// What are components?
// https://gist.github.com/makuska/84457e0b6f614301b14575aaeaa0d917#components-in-angular
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
}
