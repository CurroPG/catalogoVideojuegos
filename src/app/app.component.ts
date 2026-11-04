import { Component, inject } from '@angular/core';
import { Game } from './models/game';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'catalogoVideojuegos';
  games: Game[] = [];
  private gameService = inject(GameService);

  selectedGame: Game | undefined;
  selectedGenre = '';
  selectedPlatform = '';
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;
  searchedText = '';
  minPrice = '';
  maxPrice = '';

  buscarPorId(id: string): void {
    this.gameService.getGamesById(Number(id)).subscribe(game => {
      this.selectedGame = game;
    });
  }

  ngOnInit(): void {
    this.loadGames();
  }

  onGenreChange(genre: string): void {
    this.currentPage = 1;
    this.selectedGenre = genre;
    this.loadGames();
  }

  onPlatformChange(platform: string): void {
    this.currentPage = 1;
    this.selectedPlatform = platform;
    this.loadGames();
  }

  loadGames(): void {
    this.gameService.getFilteredGames(this.currentPage,this.pageSize, this.selectedGenre, this.selectedPlatform, this.searchedText, this.minPrice, this.maxPrice).subscribe(response => {
      this.games = response.body??[];
      this.totalItems = Number(response.headers.get('X-Total-Count') ?? 0);
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    });
  }

  onSearch(text: string) {
    this.currentPage = 1;
    this.searchedText = text;
    this.loadGames();
  }

  onPriceFilter(min: string, max: string) {
    this.currentPage = 1;
    this.minPrice = min;
    this.maxPrice = max;
    this.loadGames();
  }

  previousPage() {
    if(this.currentPage > 1){
      this.currentPage--;
      this.loadGames();
    }
  }

  nextPage() {
    if(this.currentPage < this.totalPages){
      this.currentPage++;
      this.loadGames();
    }
  }

}
