import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root shell component that hosts the router outlet.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
