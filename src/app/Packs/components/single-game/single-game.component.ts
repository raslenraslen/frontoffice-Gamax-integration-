import {Component, OnInit} from '@angular/core';
import {PacksService} from "../../services/packs.service";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-single-game',
  templateUrl: './single-game.component.html',
  styleUrls: ['./single-game.component.css']
})
export class SingleGameComponent implements OnInit {
  games: any[] = [];
   gameData: any; // ✅ Declare gameData correctly!

  game_pack: any[] = [];
  fullGamePack: any[] = [];
  baseUrl: string= environment.apiUrlImg;


  packId!: number;

  constructor(private packService: PacksService, private route: ActivatedRoute,private router: Router) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('idGame');

    if (idParam) {
      this.packId = +idParam;
       console.log('Pack ID:', this.packId);
      this.loadGames();
    } else {
      console.error('No pack ID found in URL.');
    }
  }
  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  private loadGames(): void {
    this.packService.getGames().subscribe({
      next: (games) => {
        this.games = games;
        console.log('Successfully loaded games:', this.games);
         this.gameData = this.games.find(game => game.gameId === this.packId);
        console.log(this.gameData);

      },
      error: (err) => {
        console.error('Game loading error:', err);
      }
    });
  }

}
