import { Component, Inject, model } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApisService } from '../../services/apis.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.scss',
})
export class SearchDialogComponent {
  name: string = '';
  searchedString: string = '';
  options: string[] = [];
  timerExec: any = '';
  constructor(
    private dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiServ: ApisService,
    private _snack: SnackbarService
  ) {}

  inputChangeHandler = (e: any) => {
    this.searchedString = e.target.value;

    // If the minimum length of searched string is 3 It will set timer of 300 ms to call the API.
    // user continue typing it will clear the previous timer and set a new time for 300 ms
    // It will reduce frequent API calls

    if (this.searchedString.length >= 3) {
      clearTimeout(this.timerExec);

      this.timerExec = setTimeout(() => {
        this.searchLocationHandler();
      }, 300);
    }
  };

  searchLocationHandler = () => {
    console.log('Calling!');
    this.apiServ.fetchSearchedLocations(this.searchedString).subscribe({
      next: (res: any[]) => {
        res.map((loc: any) => {
          this.options.push(loc.name);
        });
      },
      error: (err: any) => {
        console.log(err);
        this._snack.showError('API Failed!');
      },
    });
  };

  onNoClick(): void {
    this.dialogRef.close();
  }
}
