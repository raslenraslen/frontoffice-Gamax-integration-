import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-payement-succes',
  templateUrl: './payement-succes.component.html',
  styleUrls: ['./payement-succes.component.css']
})
export class PayementSuccesComponent implements OnInit {

  currentUserId: number = (() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser);
      return parsedUser.userId || null;
    }
    return null;
  })();

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    const gameId = localStorage.getItem('gameId');

    if (gameId) {
      this.shopService.addUserArticle(this.currentUserId, Number(gameId)).subscribe({
        next: (response) => {
          console.log('Article ajouté avec succès :', response);
          localStorage.removeItem('gameId');
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de l\'article :', err);
        }
      });
    } else {
      console.error('gameId non trouvé dans le localStorage.');
    }
  }
}
