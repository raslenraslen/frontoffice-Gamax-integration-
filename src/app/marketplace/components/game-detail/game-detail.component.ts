import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Article} from "../../models/article";
import {Review} from "../../models/review";
import {ShopService} from "../../services/shop.service";
import {ActivatedRoute} from '@angular/router';
import {EdenaiService} from "../../services/edenai.service";
import {environment} from "../../../environments/environment";


@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css'],
})
export class GameDetailComponent implements OnInit {
  article: Article = new Article(0, new Date(), 0, 0, 0, {
    gameId: 0,
    gameName: '',
    gameType: '',
    gameDescription: '',
    publisher: '',
    releaseDate: new Date(),
    platform: '',
    imageUrls: []
  });
  reviews: Review[] = [];
  reviewForm: FormGroup;
  isUplodable: boolean = true;

  isBuyed: boolean = false;

  baseUrl: string = environment.apiUrlImg;

  currentUserId: number | null = (() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser);
      return parsedUser.userId || null;
    }
    return null;
  })();

  constructor(
    private route: ActivatedRoute,
    private shopService: ShopService,
    private fb: FormBuilder,
    private edenaiService: EdenaiService
  ) {
    this.reviewForm = this.fb.group({
      rating: ['', [Validators.required]],
      reviewText: ['', [Validators.required, Validators.minLength(5)]],
      idUser: ['']
    });
  }


  ngOnInit(): void {
    this.article = new Article(0, new Date(), 0, 0, 0, {
      gameId: 0,
      gameName: '',
      gameType: '',
      gameDescription: '',
      publisher: '',
      releaseDate: new Date(),
      platform: '',
      imageUrls: []
    });
    this.loadArticle();
    this.loadReviews();


    const userId = this.currentUserId;
    const gameId = Number(this.route.snapshot.paramMap.get('idArticle'));

    if (userId && gameId) {
      this.shopService.existsByUserIdAndGameId(userId, gameId).subscribe({
        next: (exists: boolean) => {
          this.isBuyed = exists;
        },
        error: (err) => {
          console.error('Erreur lors de la vérification de l\'achat :', err);
        }
      });
    }

    console.log(this.isBuyed);

  }

  private loadArticle(): void {
    const id = Number(this.route.snapshot.paramMap.get('idArticle'));
    if (id) {
      this.shopService.getArticleById(id).subscribe({
        next: (data: Article) => {
          console.log('Article récupéré :', data);
          this.article = data;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de l\'article :', err);
        }
      });
    } else {
      console.error('ID invalide ou manquant dans l\'URL.');
    }
  }

  private loadReviews(): void {
    const id = Number(this.route.snapshot.paramMap.get('idGame'));
    if (id) {
      this.shopService.getArticleReviews(id).subscribe({
        next: (data: Review[]) => {
          this.reviews = data;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des reviews :', err);
        }

      });
    } else {
      console.error('ID invalide ou manquant dans l\'URL.');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }


  onSubmitReview(): void {
    if (this.reviewForm.valid) {
      const gameId = this.article?.gameId;
      if (gameId) {
        const reviewText = this.reviewForm.get('reviewText')?.value;

        // Appel à la fonction moderateText
        this.edenaiService.moderateText(reviewText).subscribe({
          next: (moderationResult) => {
            console.log('Résultat de la modération :', moderationResult);

            const nsfwScore = moderationResult.openai?.nsfw_likelihood_score;
            console.log('NSFW Score:', nsfwScore);
            if (nsfwScore > 0.6) {
              this.isUplodable = false;
              this.reviewForm.reset();
            } else {

              const currentUser = localStorage.getItem('currentUser'); // Récupère l'objet currentUser
              if (currentUser) {
                const parsedUser = JSON.parse(currentUser); // Parse la chaîne JSON en objet
                const userId = parsedUser.userId; // Récupère l'userId
                this.reviewForm.patchValue({idUser: userId}); // Met à jour le formulaire
              }
              console.log('User ID:', this.reviewForm.get('idUser')?.value);
              this.isUplodable = true;
              this.shopService.addReview(this.reviewForm.value, gameId).subscribe({
                next: (review: Review) => {
                  this.reviews.push(review);
                  this.reviewForm.reset();
                },
                error: (err) => {
                  console.error('Erreur lors de l\'ajout du review :', err);
                }
              });
            }
          },
          error: (err) => {
            console.error('Erreur lors de la modération du texte :', err);
          }
        });
      } else {
        console.error('Impossible d\'ajouter un review : gameId manquant.');
      }
    } else {
      this.markFormGroupTouched(this.reviewForm); // Marque tous les champs comme touchés
      console.error('Formulaire invalide.');
    }
  }

  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;

    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return parseFloat((total / this.reviews.length).toFixed(1));
  }


  onSelectChange(event: Event, review: Review): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === 'update') {
      this.reviews.forEach(r => r.isEditing = false);
      review.isEditing = true;
    } else if (selectedValue === 'delete') {
      this.deleteReview(review.reviewId!);
    }

    // Réinitialise la sélection
    selectElement.value = '';
  }

  toggleEdit(review: Review): void {
    review.isEditing = review.isEditing = false;
  }

  updateReview(review: Review): void {
    if (review.reviewText.trim().length < 5) {
      console.error('Le texte du review doit contenir au moins 5 caractères.');
      return;
    }

    this.shopService.updateReview(review.reviewId!, review).subscribe({
      next: (updatedReview: Review) => {
        review.isEditing = false;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du review :', err);
      }
    });
  }

  deleteReview(reviewId: number): void {
    this.shopService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.reviewId !== reviewId);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du review :', err);
      }
    });
  }

  toggleoffreviews(): void {
    this.reviews.forEach(r => r.isEditing = false);
  }

}
