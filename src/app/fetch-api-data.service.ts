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

  private getToken(): string {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).token : '';
}


  
  /**Making the api call for the user registration endpoint
   *@param {Object} userDetails must include Username and Password
   * @return
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**Make the api call for the user login endpoint
  *@param {Object} userDetails must include Username and Password
  *@return
  */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login/', userDetails).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**Make the api call for the Get All Movies Endpoint
   * @return 401 status is token is false, returns array of movies if token is true
   */
  getAllMovies(): Observable<any> {
    
    return this.http.get(apiUrl + 'movies/', {headers: new HttpHeaders(
      {
        Authorization: `Bearer ${this.getToken()}`,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
    }

    /**Make the api call for the Get One Movie Endpoint
     * @param {string} title Movie's Title
     * @return 401 status is token is false, 200 status and movie object if true
     */
  getOneMovies(title: string): Observable<any> {
    
    return this.http.get(apiUrl + 'movies/' + title, {headers: new HttpHeaders(
      {
        Authorization: `Bearer ${this.getToken()}`,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**Make the api call for the Get Director Endpoint
   * @param {string} directorName Director's Name
   * @return 401 status is token is false, 200 status and Director object. If no Director, 400 satus
   */
  getDirector( directorName: string): Observable<any> {
  
    return this.http.get(apiUrl+ 'movies/directors/' + directorName, {headers: new HttpHeaders(
      {
        Authorization: `Bearer ${this.getToken()}`,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**Make the api call for the Get Genre Endpoint
   * @param {string} genreName Name of Genre
   * @return 401 status is token is false, 200 status and Genre object
   */
  getGenre( genreName: string): Observable<any> {
    
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {headers: new HttpHeaders(
      {
        Authorization: `Bearer ${this.getToken()}`,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**Make the api call for the Get User Endpoint
   * @param {string} Username Username
   * @returns 401 status is token is false, 200 status and user profile
   */
  getUserByUsername( Username: string): Observable<any> {
    
      return this.http.get(apiUrl + 'users/' + Username, {headers: new HttpHeaders(
        {
          Authorization: `Bearer ${this.getToken()}`,
        })}).pipe(
          map(this.extractResponseData),
          catchError(this.handleError)
        );
  }

  /**Make the api call for the Get Favorite Movie as a User Endpoint
   * @param {string} Username Username
   * @return 400 status if token is false, 200 status and array of favorite movie object
   */ 
  getFavoriteMovie(Username: string): Observable<any> {
   
    return this.http.get(apiUrl + 'users/' + Username, {headers: new HttpHeaders(
      {
        Authorization: `Bearer ${this.getToken()}`,
      })}).pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }

  /**Make the api call for the Add Movie to Favorites Endpoint
   * @param {string} Username Username
   * @param {string} movie Movie's Title
   * @return 400 status if token is false, 200 status if add succesfful and movie added to favorite movie array
   */
  addFavoriteMovies(Username: string, movie: string): Observable<any> {
    
    console.log(apiUrl +'users/' + Username + '/movies/' + movie);

    return this.http.post(apiUrl +'users/' + Username + '/movies/' + movie, {headers: new HttpHeaders(
      {
        Authorization: `Bearer ${this.getToken()}`,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**Make the api call for the Edit User Endpoint
   * @param {string} Username Username
   * @return 400 status if token is false, 200 status and user details updated
   */
  editUser(Username: string): Observable<any> {
  
    console.log(apiUrl + 'users/' +  Username)
    return this.http.put(apiUrl + 'users/' +  Username, {headers: new HttpHeaders(
      {
        Authorization: `Bearer ${this.getToken()}`,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**Make the api call for the Delete User Endpoint
   * @param {string} Username Username
   * @return status 400 if token is false, 200 status and user deleted, taken to welcome page
   */
  deleteUser(Username: string): Observable<any> {
    
    return this.http.delete( apiUrl + 'users/' + Username, {headers: new HttpHeaders(
      {
        Authorization: `Bearer ${this.getToken()}`,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  /**Make the api call for the Delete Movie From Favorites Endpoint
   * @param {string} Username Username
   * @param {string} movie Movie's Title
   * @return 400 status if token false, 200 status and movie removed from favorite movie array
   */
  deleteFavoriteMovie(Username: string, movie: string): Observable<any> {
    
    return this.http.delete(apiUrl + 'users/' + Username + '/movies/' + movie, {headers: new HttpHeaders(
      {
        Authrorization: `Bearer ${this.getToken()}`,
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
