import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiResponse, Character } from '../models/character';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly API_URL = 'https://rickandmortyapi.com/api/character';
  private readonly http = inject(HttpClient);

  private charactersSignal = signal<Character[]>([]);
  public readonly characters = this.charactersSignal.asReadonly();

  getCharacters(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.API_URL).pipe(
      tap(response => this.charactersSignal.set(response.results))
    );
  }

  searchCharacters(name: string): Observable<ApiResponse> {
    // Verificar si el name está vacío o solo contiene espacios en blanco
    if (!name || name.trim().length === 0) {
      return this.getCharacters();
    }

    // Construir la URL de búsqueda con el parámetro name
    const searchUrl = `${this.API_URL}?name=${encodeURIComponent(name.trim())}`;
    
    return this.http.get<ApiResponse>(searchUrl).pipe(
      tap(response => this.charactersSignal.set(response.results))
    );
  }
}
