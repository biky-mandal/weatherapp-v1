import { Component, OnInit } from '@angular/core';
import { ApisService } from '../../services/apis.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  dayBG: string = 'assets/Sunny2.jpg';
  nightBG: string = 'assets/Rainy.jpg';
  activeBG: string = this.dayBG;
  loading: boolean = false;

  constructor(private apiServ: ApisService) {}

  ngOnInit(): void {
    // Depending on mode day/night it will change the BG
    this.apiServ.waiting.subscribe((isLoading) => (this.loading = isLoading));
    this.apiServ.isDay.subscribe((isDay) => {
      this.activeBG = isDay ? this.dayBG : this.nightBG;
    });
  }
}
