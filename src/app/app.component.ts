import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Game } from './models/game';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'catalogoVideojuegos';
  games: Game[] = [];
  private gameService = inject(GameService);

  selectedGame: Game | undefined;

  buscarPorId(id: string): void {
    this.gameService.getGamesById(Number(id)).subscribe(game => {
      this.selectedGame = game;
    });
  }

  ngOnInit(): void {
    this.gameService.getGames().subscribe(games => {
      this.games = games;
    });
  }
}
