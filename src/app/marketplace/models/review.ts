import {User} from "./user";

export class Review {
  reviewId?: number;
  reviewText: string;
  rating: number;
  reviewDate: Date;
  idUser: number;
  user: User
  isEditing : boolean = false;

  constructor(reviewText: string, rating: number, reviewId?: number, user?: User, idUser?: number) {
    this.reviewId = reviewId;
    this.reviewText = reviewText;
    this.rating = rating;
    this.reviewDate = new Date();
    this.idUser = idUser || 1;
    this.user = user || new User(0, '', '', '', '', '', false, '', '');
  }
}
