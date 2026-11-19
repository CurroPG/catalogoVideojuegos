import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { GameService } from '../services/game.service';
import { Game } from '../models/game';

@Component({
  selector: 'app-crud',
  imports: [ReactiveFormsModule],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css'
})
export class CrudComponent {
  gameForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    }),
    genre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    platform: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)]
    }),
    stock: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]
    })
  });
  games: Game[] = [];
  editId: number | undefined;
  message = '';
  private gameService = inject(GameService);

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.gameService.getGames().subscribe(games => {
      this.games = games;
    });
  }

  onSaveGame(form: FormGroupDirective): void {
    this.gameForm.markAllAsTouched();

    if (this.gameForm.invalid) {
      return;
    }

    const value = this.gameForm.getRawValue();

    const request = this.editId
      ? this.gameService.updateGame({ ...value, id: this.editId })
      : this.gameService.createGame(value);

    request.subscribe({
      next: () => {
        this.message = this.editId
          ? 'Videojuego actualizado correctamente.'
          : 'Videojuego creado correctamente.';
        this.loadGames();
        form.resetForm();
        this.editId = undefined;
      },
      error: () => {
        this.message = 'No se pudo guardar el videojuego. Revisa que JSON Server esté arrancado.';
      }
    });
  }

  editGame(game: Game): void {
    this.editId = game.id;
    this.gameForm.patchValue(game);
  }

  limpiar(form: FormGroupDirective): void {
    form.resetForm();
    this.editId = undefined;
  }
}
