import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Injectable()
export class HttpService {

  constructor(private http: HttpClient,) {}

  //post
  async post(data:any = false, user:any = {}, headers:any = {})
  {
    if(!!data && user.authorised){
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': user.uid
        })
      };
      const server = 'http://localhost:84/pm3server/index.php';
      return new Promise(resolve => {
        this.http.post(server, data, httpOptions).subscribe(
          data  => {
            resolve(data);
          },
          error  => {
            this.handleError(error);
        });
      });
    } else {
      return 'http request not allowed';
    }


  }

  private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
      // return an observable with a user-facing error message
      return throwError(
        'Something bad happened; please try again later.');
  };

}
