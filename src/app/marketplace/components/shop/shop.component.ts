import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../services/shop.service';
import { Article } from '../../models/article';
import {DeepSeekServiceService} from "../../services/deep-seek-service.service";
import { environment } from 'src/app/environments/environment';

declare var $: any;

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  articles: Article[] = [];
  isGridCol8: boolean = false;
  filteredArticle: Article[] = [];
  description: string = '';
  gameNames: string[] = [];
  isLoading: boolean = false;
  baseUrl: string = environment.apiUrlImg;



  constructor(private shopService: ShopService, private deepSeekService: DeepSeekServiceService) {}

  ngOnInit(): void {
    this.loadArticles();
    this.initPriceSlider();
  }

  searchGames(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value.toLowerCase();
    this.filteredArticle = this.articles.filter(game =>
      game.game.gameName.toLowerCase().includes(query)
    );
  }

  private loadArticles(): void {
    this.shopService.getArticles().subscribe({
      next: (data: Article[]) => {
        this.articles = data;
        this.filteredArticle = data;
        this.gameNames = data.map(article => article.game.gameName);
        console.log(this.articles);

      },
      error: (err) => {
        console.error('Error loading articles:', err);
      }
    });
  }

  toggleClass(): void {
    this.isGridCol8 = !this.isGridCol8;
    if (this.isGridCol8) {
      setTimeout(() => {
        this.initPriceSlider();
      }, 100); // Attendre un peu que le DOM se mette à jour
    }
  }

  private initPriceSlider(): void {
    if ($ && $.fn.slider) {
      const $minInput = $('#min_price');
      const $maxInput = $('#max_price');
      const $slider = $('.price_slider');

      const min = parseInt($minInput.data('min')) || 10;
      const max = parseInt($maxInput.data('max')) || 120;
      const currentMin = parseInt($minInput.val()) || min;
      const currentMax = parseInt($maxInput.val()) || max;

      // Détruire le slider existant pour éviter les conflits
      if ($slider.hasClass('ui-slider')) {
        $slider.slider('destroy');
      }

      // Initialiser le slider
      $slider.slider({
        range: true,
        min: min,
        max: max,
        values: [currentMin, currentMax],
        slide: (_event: any, ui: any) => {
          $minInput.val(ui.values[0]);
          $maxInput.val(ui.values[1]);
          $('.price_label .from').text(`$${ui.values[0]}`);
          $('.price_label .to').text(`$${ui.values[1]}`);
          $('.price_label').show();

          // Filtrer les articles en fonction des valeurs du slider
          this.filterArticles(ui.values[0], ui.values[1]);
        }
      });

      // Afficher les valeurs actuelles du slider
      $('.price_label .from').text(`$${currentMin}`);
      $('.price_label .to').text(`$${currentMax}`);
      $('.price_label').show();

      // Appliquer le filtre initial
      this.filterArticles(currentMin, currentMax);
    } else {
      console.error('jQuery UI slider is not available');
    }
  }

  private filterArticles(minPrice: number, maxPrice: number): void {
    this.filteredArticle = this.articles.filter(article => {
      return article.price >= minPrice && article.price <= maxPrice;
    });
  }

  filterByCategory(category: string | null): void {
    if (!category) {
      this.filteredArticle = this.articles; // Affiche tous les articles
    } else {
      this.filteredArticle = this.articles.filter(
        (article) => article.game.gameType === category
      );
    }
  }

  guessGame(): void {
    if (!this.description.trim()) {
      alert('Veuillez entrer une description.');
      return;
    }
    this.isLoading = true;
    this.deepSeekService.getGameDetails(this.description, this.gameNames).subscribe({
      next: (result: string) => {
        this.isLoading = false;
        this.filteredArticle = [];
        const listgames = this.parseGameNames(result);
        console.log('Jeux retournés par l\'API :', listgames);

        this.filteredArticle = this.articles.filter(article =>
          listgames.some(gameName => article.game.gameName.includes(gameName))
        );

        console.log('Articles filtrés :', this.filteredArticle);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur lors de la récupération des détails du jeu :', err);
        alert('Erreur lors de la récupération des détails du jeu.');
      }
    });
  }

  parseGameNames(jsonResult: string): string[] {
    try {
      const cleanedJson = jsonResult.replace(/```json|```/g, '').trim();
      const parsedResult = JSON.parse(cleanedJson);
      return parsedResult.games.map((game: { name: string }) => game.name);
    } catch (error) {
      console.error('Erreur lors du parsing du JSON :', error);
      return [];
    }
  }

  clearDescription(): void {
    this.description = '';
    this.filteredArticle = this.articles;
  }

}
