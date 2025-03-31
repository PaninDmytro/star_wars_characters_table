import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { ICharacter } from "../interfaces/character.interface";
import { IPlanet } from "../interfaces/planet.interface";

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private http: HttpClient = inject(HttpClient);

  public getCharacters(): Observable<ICharacter[]> {
    return this.http.get<ICharacter[]>('https://swapi.info/api/people')
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error, 'Failed to fetch characters'))
      );
  }

  public getPlanet(homeworld: string): Observable<IPlanet> {
   return this.http.get<IPlanet>(homeworld)
     .pipe(
       catchError((error: HttpErrorResponse) => this.handleError(error, `Failed to fetch planet data for ${homeworld}`))
     );
  }

  private handleError(error: HttpErrorResponse, message: string): Observable<never> {
    let errorMessage = message;

    if (error.error instanceof ErrorEvent) {
      errorMessage = `${message}: ${error.error.message}`;
    } else {
      errorMessage = `${message}: ${error.status} - ${error.statusText || 'Unknown Error'}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
