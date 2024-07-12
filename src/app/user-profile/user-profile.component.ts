import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit{
  userData: any = {};
  FavoriteMovies: any[] = [];
  constructor(
    public fetchApiData: UserRegistrationService,
    public router: Router,
    public snackBar: MatSnackBar
  ) {
    this.userData = JSON.parse(localStorage.getItem("user") || "");
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.fetchApiData.getUserByUsername(this.userData.Username).subscribe((res: any) => {
      this.userData = {
        ...res,
        id: res.Username,
        password: this.userData.Password,
        token: this.userData.token
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
      this.getFavoriteMovies();
    })
  }

  getFavoriteMovies(): void{
    this.fetchApiData.getAllMovies().subscribe((res: any) => {
      this.FavoriteMovies = res.filter((movie: any) => {
        return this.userData.FavoriteMovies?.includes(movie._id)
      })
    }, (err: any) => {
      console.error(err);
    });
  }

  updateUser(): void {
    this.userData = JSON.parse(localStorage.getItem("user") || "");
    this.fetchApiData.editUser(this.userData).subscribe((res: any) => {
      this.userData.Username = {
        ...res,
        
        password: this.userData.password,
        token: this.userData.token,
      };
      
      localStorage.setItem("user", JSON.stringify(this.userData));
      this.getFavoriteMovies();
    }, (err: any) => {
      console.error(err)
    })
  }
  resetUser(): void {
    this.userData = JSON.parse(localStorage.getItem("user") || "");
  }
  backToMovie(): void {
    this.router.navigate(["movies"]);
  
  }

  removeFromFavorite(movie: any): void {
    this.fetchApiData.deleteFavoriteMovie(this.userData.id, movie).subscribe((res: any) => {
      this.userData.FavoriteMovies = res.FavoriteMovies;
      this.getFavoriteMovies();
    }, (err: any) => {
      console.error(err)
    })
  }

  deleteUserData(): void {
    this.fetchApiData.deleteUser(this.userData.Username).subscribe((resp: any) => {
      this.fetchApiData = resp;
      console.log(resp);
    });
    this.snackBar.open('Account deleted', 'Success', {
      duration: 2000,
    });
    this.router.navigate(['/welcome']);
  }

  logout(): void {
    this.router.navigate(["welcome"]);
    localStorage.removeItem("user");
  }
}
