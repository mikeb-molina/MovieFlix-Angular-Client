import { Injectable } from '@angular/core';
import { catchError } from 'rxjs'
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';


//Declaring the api url that will provide data for the client app
const apiUrl = 'https://mikes-movie-flix-5278ac249606.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})

export class UserRegistrationService {
   // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http:HttpClient) { 
    
  }
  
  //Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users/', userDetails).pipe(
    catchError(this.handleError)
    );
  }

  //Make the api call for the user login endpoint
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login/', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  //Make the api call for the Get All Movies Endpoint
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
    }

    //Make the api call for the Get One Movie Endpoint
  getOneMovies(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  //Make the api call for the Get Director Endpoint
  getDirector( directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl+ 'movies/directors/' + directorName, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  //Make the api call for the Get Genre Endpoint
  getGenre( genreName: string): Observable<any> {
    const token=localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  //Make the api call for the Get User Endpoint
  getUser( username: string): Observable<any> {
    const token= localStorage.getItem('token');
      return this.http.get(apiUrl + 'users' + username, {headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })}).pipe(
          map(this.extractResponseData),
          catchError(this.handleError)
        );
  }

  //Make the api call for the Get Favorite Movie as a User Endpoint
  getFavoriteMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }

  //Make the api call for the Add Movie to Favorites Endpoint
  addFavoriteMovies(username: string, title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + `/users/${username}/${title}`, {}, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  //Make the api call for the Edit User Endpoint
  editUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  //Make the api call for the Delete User Endpoint
  deleteUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete( apiUrl + 'users/' + username, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' +  token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  //Make the api call for the Delete Movie From Favorites Endpoint
  deleteFavoriteMovie(username: string, title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `/users/${username}/${title}`, {headers: new HttpHeaders(
      {
        Authrorization: 'Bearer ' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
    'Something bad happened; please try again later.');
  }  

   //Non-typed response extraction
   private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }
}
