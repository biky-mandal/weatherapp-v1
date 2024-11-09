import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchDialogComponent } from '../../components/search-dialog/search-dialog.component';
import { ApisService } from '../../services/apis.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  location: string = 'Guwahati';
  weatherData: any = null;
  recentWeatherData: any = {};
  loading: boolean = false;

  // Dependency Injection
  constructor(
    private dialog: MatDialog,
    private apiServ: ApisService,
    private _snack: SnackbarService
  ) {}

  // When Component render this block of code will execute
  ngOnInit(): void {
    // Fecthnig data with default location Guwahati.
    this.fetchForcustDetails();

    // Subscribing to the recentsearched behavior subject
    // It will return recently searched data
    this.apiServ.recentWeatherData.subscribe((data: any) => {
      this.recentWeatherData = data;
    });

    // Subscribing to the loading behavior subject
    // It will return loading status true / false
    this.apiServ.waiting.subscribe((data: any) => {
      this.loading = data;
    });
  }

  // To Open Search daialog
  openDialog(): void {
    const dialogRef = this.dialog.open(SearchDialogComponent, {
      data: {},
      width: '80%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.location = result;
        if (this.location) {
          // After clicking search on dialog it will return location and then fetch
          this.fetchForcustDetails();
        }
      }
    });
  }

  // fetching forcast data handler
  fetchForcustDetails = (): void => {
    this.apiServ.waiting.next(true); // Loading set to true

    // This section is to generate recent searched data before new data arrives
    if (this.weatherData) {
      const obj: any = {
        text: this.weatherData?.current?.condition?.text,
        temp: this.weatherData?.current?.temp_c,
        location: this.weatherData?.location?.name,
        icon: this.weatherData?.current?.condition?.icon,
      };
      this.apiServ.addRecentSearch(obj); // Setting recent search obj to LS
    }

    this.weatherData = []; // Resetting data

    // Subscribing to API observable with proper Error handling
    this.apiServ.fetchForcustDetails(this.location).subscribe({
      next: (res: any[]) => {
        this.weatherData = res;

        // Setting all behaviour Subject Variable so that every component get the information ASAP
        this.apiServ.weatherData.next(this.weatherData);

        // Ssetting mode of the Application day/night
        this.apiServ.isDay.next(this.weatherData.current.is_day ? true : false);

        this.apiServ.waiting.next(false);
      },
      error: (err: any) => {
        console.log(err);
        this._snack.showError('Failed to fetch Weather Condition!');
        this.apiServ.waiting.next(false);
      },
    });
  };

  // When user clicks on recent location box it will fetch data based on location
  fetchFromRecentLocation = (locate: string): void => {
    this.location = locate;
    if (this.location) {
      this.fetchForcustDetails();
    }
  };
}
