import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { GameService } from '../services/game.service';
import { Game } from '../models/game';

@Component({
  selector: 'app-crud',
  imports: [FormsModule],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css'
})
export class CrudComponent {
  game: Game = {
    title: '',
    genre: '',
    platform: '',
    price: 0,
    stock: 0
  };
  games: Game[] = [];
  private gameService = inject(GameService);

  onSaveGame(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const request = this.game.id ? this.gameService.updateGame(this.game)
      : this.gameService.createGame(this.game);

    request.subscribe(() => {
      this.loadGames();
      this.game = this.emptyGame();
      form.resetForm(this.game);
    });
  }

  emptyGame(): Game {
    return {
      title: '',
      genre: '',
      platform: '',
      price: 0,
      stock: 0
    };
  }

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames() {
    this.gameService.getGames().subscribe(game => {
      this.games = game;
    })
  }

  editGame(game: Game): void {
    this.game = { ...game };
  }

  cancelEdit(form: NgForm): void {
  this.game = this.emptyGame();
  form.resetForm(this.game);
}
}
