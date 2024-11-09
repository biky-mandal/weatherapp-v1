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
  location: string = '';
  weatherData: any = {};

  constructor(
    private dialog: MatDialog,
    private apiServ: ApisService,
    private _snack: SnackbarService
  ) {}

  ngOnInit(): void {
    this.fetchForcustDetails();
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
    this.weatherData = [];
    this.apiServ.fetchForcustDetails(this.location).subscribe({
      next: (res: any[]) => {
        console.log(res);
        this.weatherData = res;
        this.apiServ.weatherData.next(this.weatherData);
      },
      error: (err: any) => {
        console.log(err);
        this._snack.showError('Failed to fetch Weather Condition!');
      },
    });
  };
}
