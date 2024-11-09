import { Component, Inject, OnInit } from '@angular/core';
import { ApisService } from './services/apis.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'WeatherApp';

  constructor(
    private apiServ: ApisService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.apiServ.isDay.subscribe((isDay) => {
      if (isDay) {
        this.document.querySelector('html')?.setAttribute('mode', 'day');
      } else {
        this.document.querySelector('html')?.setAttribute('mode', 'night');
      }
    });
  }
}
