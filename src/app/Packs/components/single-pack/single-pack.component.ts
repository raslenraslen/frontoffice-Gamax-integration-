import {Component, OnInit} from '@angular/core';
import {PacksService} from '../../services/packs.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-single-pack',
  templateUrl: './single-pack.component.html',
  styleUrls: ['./single-pack.component.css']
})
export class SinglePackComponent implements OnInit {
  games: any[] = [];
  game_pack: any[] = [];
  fullGamePack: any[] = [];
  PackName: any[] = [];
  PackImage: any[] = [];
  baseUrl: string= environment.apiUrlImg;

  packId!: number;

  constructor(private packService: PacksService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('idPack');
    console.log(idParam);
    if (idParam) {
      this.packId = +idParam;
      this.loadPack();
      this.loadGames();
    } else {
      console.error('No pack ID found in URL.');
    }
  }

  private loadGames(): void {
    //
    this.packService.getGames().subscribe({
      next: (games) => {
        this.games = games;
        console.log('Successfully loaded games:', this.games);

        // Si game_pack est déjà chargé, alors on peut filtrer
        if (this.game_pack.length > 0) {
          this.filterGames();
        }
      },
      error: (err) => {
        console.error('Game loading error:', err);
      }
    });
  }

  // private retrieveId() {
  //   if (id) {
  //     this.shopService.getArticleById(id).subscribe({
  //       next: (data: Article) => {
  //         console.log('Article récupéré :', data);
  //         this.article = data;
  //       },
  //       error: (err) => {
  //         console.error('Erreur lors de la récupération de l'
  //         article :', err);
  //       }
  //     });
  //   }
  // }

  private loadPack(): void {
    const id = Number(this.route.snapshot.paramMap.get('idPack'));

    this.packService.getPackById(id).subscribe({
      next: (pack: any) => {
          console.log('Received pack:', pack);
        this.game_pack = pack.packGames;
        this.PackName = pack.packName;
        this.PackImage = pack.image.imageUrl;
        console.log(this.PackImage);
        if (this.games.length > 0) {
          this.filterGames();
        }
      },
      error: (err) => {
        console.error('Error fetching pack:', err);
      },
    });
  }

  private filterGames(): void {
    const validGameIds = this.game_pack
      .filter((item: any) => item.state === true)
      .map((item: any) => item.gameId);
    this.fullGamePack = this.games.filter(game => validGameIds.includes(game.gameId));

    console.log('Full Game Pack:', this.fullGamePack);
  }

  goToSinglePack(gameId: number): void {
    this.router.navigate(['/singleGame'], {queryParams: {id: gameId}});
  }
}
