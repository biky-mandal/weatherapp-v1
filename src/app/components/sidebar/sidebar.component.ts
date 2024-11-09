import { Component, OnInit } from '@angular/core';
import { ApisService } from '../../services/apis.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  weatherData: any = {};
  constructor(private apiServ: ApisService) {}

  ngOnInit(): void {
    console.log(
      this.apiServ.weatherData.subscribe((data: any) => console.log(data))
    );
  }
}
