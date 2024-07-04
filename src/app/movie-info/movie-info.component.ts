import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrl: './movie-info.component.scss'
})
export class MovieInfoComponent implements OnInit{
  constructor(@Inject(MAT_DIALOG_DATA)
        public data: {
            title: string,
            content: string
        },
        public dialogRef: MatDialogRef<MovieInfoComponent>
    ) {}

    ngOnInit(): void {}

    closeMovieInfo(): void {
      this.dialogRef.close();
    }
}


