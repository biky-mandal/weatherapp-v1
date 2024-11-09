import { Component, OnInit } from '@angular/core';
import { ApisService } from '../../services/apis.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  weatherData: any = {};

  // Depenency Injection
  constructor(private apiServ: ApisService) {}

  ngOnInit(): void {
    // Subscribing to the Weather data
    this.apiServ.weatherData.subscribe((data: any) => {
      this.weatherData = data;
    });
  }
}
