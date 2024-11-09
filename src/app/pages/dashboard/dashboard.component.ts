import { Component, OnInit, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
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

  constructor(
    private dialog: MatDialog,
    private apiServ: ApisService,
    private _snack: SnackbarService
  ) {}

  ngOnInit(): void {
    this.fetchForcustDetails();
    this.apiServ.recentWeatherData.subscribe((data: any) => {
      this.recentWeatherData = data;
      console.log(data);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SearchDialogComponent, {
      data: {},
      width: '40%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.location = result;
        if (this.location) {
          this.fetchForcustDetails();
        }
      }
    });
  }

  fetchForcustDetails = (): void => {
    this.loading = true;
    if (this.weatherData) {
      const obj: any = {
        text: this.weatherData?.current?.condition?.text,
        temp: this.weatherData?.current?.temp_c,
        location: this.weatherData?.location?.name,
        icon: this.weatherData?.current?.condition?.icon,
      };
      this.apiServ.addRecentSearch(obj);
    }

    this.weatherData = [];
    this.apiServ.fetchForcustDetails(this.location).subscribe({
      next: (res: any[]) => {
        this.weatherData = res;
        this.apiServ.weatherData.next(this.weatherData);
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
        this._snack.showError('Failed to fetch Weather Condition!');
        this.loading = false;
      },
    });
  };

  fetchFromRecentLocation = (locate: string): void => {
    this.location = locate;
    if (this.location) {
      this.fetchForcustDetails();
    }
  };
}
