import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponent } from '../movie-info/movie-info.component';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit{
  movies: any[] = [];
  users: [] = [];

  showLeftArrow: boolean = false;
  showRightArrow: boolean = true;

  scroll(direction: number): void {
    const container = document.querySelector('.movie-grid');
    if (container) {
      const scrollAmount = direction * 300;
      container.scrollLeft += scrollAmount;

      this.updateArrowVisibility(container);
    }
  }
  updateArrowVisibility(container: any): void {
    
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    this.showRightArrow = container.scrollLeft < maxScrollLeft;
  }
  constructor(
    public fetchApiData: UserRegistrationService,
    public router: Router,
    public dialog: MatDialog
    
  ) { }

  ngOnInit(): void {
    this.getMovies();

  }

  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieId) >= 0;
  }


  getMovies(): void{
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies= resp;
      let user = JSON.parse(localStorage.getItem("user") || "");
            this.movies.forEach((movie: any) => {
                movie.isFavorite = user.FavoriteMovies?.includes(movie._id);
            })
      console.log(this.movies);
      return this.movies;
    });
  }

  modifyFavoriteMovies(movie: any): void {
    let user = JSON.parse(localStorage.getItem("user") || "");
    let icon = document.getElementById(`${movie._id}-favorite-icon`);
    
    if (user.FavoriteMovies?.includes(movie)) {
        this.fetchApiData.deleteFavoriteMovie(user.Username, movie).subscribe(res => {
            icon?.setAttribute("fontIcon", "favorite_border");

            console.log("del success")
            console.log(res);
            user.FavoriteMovies = res.FavoriteMovies;
            localStorage.setItem("user", JSON.stringify(user));
        }, err => {
            console.error(err)
        })
    } else {
        this.fetchApiData.addFavoriteMovies(user.Username, movie).subscribe(res => {
            icon?.setAttribute("fontIcon", "favorite");

            console.log("add success")
            console.log(res);
            user.FavoriteMovies = res.FavoriteMovies;
            localStorage.setItem("user", JSON.stringify(user));
        }, err => {
            console.error(err)
        })
    }
    localStorage.setItem("user", JSON.stringify(user));
}

showGenre(movie: any): void {
  this.dialog.open(MovieInfoComponent, {
      data: {
          title: String(movie.Genre.Name).toUpperCase(),
          content: movie.Genre.Description
      },
      width: "400px"
  })
}

showDirector(movie: any): void {
  this.dialog.open(MovieInfoComponent, {
      data: {
          title: movie.Director.Name,
          content: movie.Director.Bio
      },
      width: "400px"
  })
}

showDetail(movie: any): void {
  this.dialog.open(MovieInfoComponent, {
      data: {
          title: movie.Title,
          content: movie.Description
      },
      width: "400px"
  })
}

logout(): void {
  this.router.navigate(["welcome"]);
  localStorage.removeItem("user");
}

redirectProfile(): void {
  this.router.navigate(["profile"]);
}

}
