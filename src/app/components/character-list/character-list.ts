import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, catchError } from 'rxjs';
import { of } from 'rxjs';
import { Api } from '../../services/api';
import { Character } from '../../models/character';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule   
  ],
  templateUrl: './character-list.html',
  styleUrls: ['./character-list.scss']
})
export class CharacterListComponent implements OnInit {
  // Inyección del servicio Api
  private api = inject(Api);

  // Conexión con la señal pública de personajes del servicio
  public characters = this.api.characters;

  // Propiedades para el estado de la UI
  public searchTerm: string = '';
  public loading: boolean = false;
  public errorMessage: string = '';

  // Señal computada para verificar si hay personajes
  public hasCharacters = computed(() => this.characters().length > 0);

  ngOnInit(): void {
    this.loadInitialCharacters();
  }

  loadInitialCharacters(): void {
    // Establecer estado de carga y limpiar errores previos
    this.loading = true;
    this.errorMessage = '';

    // Llamar al servicio para obtener personajes
    this.api.getCharacters().pipe(
      finalize(() => {
        // Establecer loading a false al finalizar (exitoso o con error)
        this.loading = false;
      }),
      catchError((error) => {
        // Manejar errores
        this.errorMessage = 'Error al cargar los personajes. Por favor, inténtalo de nuevo.';
        console.error('Error loading characters:', error);
        return of({ results: [] }); // Retornar respuesta vacía para evitar errores
      })
    ).subscribe({
      next: (response) => {
        // El servicio ya actualiza la señal de personajes en tap()
        // No necesitamos hacer nada adicional aquí
      },
      error: (error) => {
        // Manejo adicional de errores si es necesario
        this.errorMessage = 'Error al cargar los personajes. Por favor, inténtalo de nuevo.';
        console.error('Error in subscription:', error);
      }
    });
  }

  onSearch(): void {
    // Establecer estado de carga y limpiar errores previos
    this.loading = true;
    this.errorMessage = '';

    // Llamar al servicio para buscar personajes
    this.api.searchCharacters(this.searchTerm).pipe(
      finalize(() => {
        // Establecer loading a false al finalizar (exitoso o con error)
        this.loading = false;
      }),
      catchError((error) => {
        // Manejar errores
        this.errorMessage = 'Error al buscar personajes. Por favor, inténtalo de nuevo.';
        console.error('Error searching characters:', error);
        return of({ results: [] }); // Retornar respuesta vacía para evitar errores
      })
    ).subscribe({
      next: (response) => {
        // El servicio ya actualiza la señal de personajes en tap()
        // No necesitamos hacer nada adicional aquí
      },
      error: (error) => {
        // Manejo adicional de errores si es necesario
        this.errorMessage = 'Error al buscar personajes. Por favor, inténtalo de nuevo.';
        console.error('Error in search subscription:', error);
      }
    });
  }

  onSearchKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}