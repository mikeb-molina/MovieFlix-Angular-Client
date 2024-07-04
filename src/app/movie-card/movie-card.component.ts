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
  dialog: any;
  router: any;

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
    // Show/hide left arrow
    this.showLeftArrow = container.scrollLeft > 0;

    // Show/hide right arrow
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    this.showRightArrow = container.scrollLeft < maxScrollLeft;
  }
  constructor(
    public fetchApiData: UserRegistrationService
    
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void{
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies= resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  modifyFavoriteMovies(movie: any): void {
    let user = JSON.parse(localStorage.getItem("user") || "");
    let icon = document.getElementById(`${movie._id}-favorite-icon`);

    if (user.favoriteMovies.includes(movie._id)) {
        this.fetchApiData.deleteFavoriteMovie(user.id, movie.title).subscribe(res => {
            icon?.setAttribute("fontIcon", "favorite_border");

            console.log("del success")
            console.log(res);
            user.favoriteMovies = res.favoriteMovies;
            localStorage.setItem("user", JSON.stringify(user));
        }, err => {
            console.error(err)
        })
    } else {
        // icon?.setAttribute("fontIcon", "favorite");
        // user.favoriteMovies.push(movie._id);
        // addFavoriteMovie return unauth, debugging
        this.fetchApiData.addFavoriteMovies(user.id, movie.title).subscribe(res => {
            icon?.setAttribute("fontIcon", "favorite");

            console.log("add success")
            console.log(res);
            user.favoriteMovies = res.favoriteMovies;
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
          title: String(movie.genre.type).toUpperCase(),
          content: movie.genre.description
      },
      width: "400px"
  })
}

showDirector(movie: any): void {
  this.dialog.open(MovieInfoComponent, {
      data: {
          title: movie.director.name,
          content: movie.genre.description
      },
      width: "400px"
  })
}

showDetail(movie: any): void {
  this.dialog.open(MovieInfoComponent, {
      data: {
          Title: movie.title,
          Description: movie.description
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
