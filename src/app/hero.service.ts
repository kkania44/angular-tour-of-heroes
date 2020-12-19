import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of, pipe } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = "api/heroes"; // url to web api

  constructor(
    private messageService: MessageService,
    private httpClient: HttpClient) { }

  // enables getting data asynchronously (simulate fetching from server)
  getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log("Heroes fetched")),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  private log(message: String) {
    this.messageService.add(`Hero Service: ${message}`);
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.httpClient.get<Hero>(url).pipe(
      tap(_ => this.log(`Hero with id = ${id} fetched`),
        catchError(this.handleError<Hero>(`getHero id = ${id} failed`)))
    );
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application.json' })
  };

  updateHero(hero: Hero) {
    return this.httpClient.put(this.heroesUrl, hero, this.httpOptions)
  }

}


