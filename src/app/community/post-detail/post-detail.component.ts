import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PostService} from "../services/community/post.service";

import {Comment} from "../models/Comment";
import {AuthenticationService} from "../../user/services/login/authentification.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post?: any;

  postId!: number;
  Comments: Comment[] = [];
  newComment = {
    content: '',
    name: ''
  };

  currentUserId = this.authService.currentUserValue?.userId || 0;
  comments: any[] = [];
  baseUrl: string = environment.apiUrlImg;

  constructor(private route: ActivatedRoute, private ps: PostService, public authService: AuthenticationService // Ajouter ceci
  ) {
  }

  ngOnInit() {

    this.postId = +this.route.snapshot.paramMap.get('id')!;
    console.log('Post ID récupéré depuis l\'URL:', this.postId);

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ps.getPostById(id).subscribe(
      data => {
        this.post = data;
        console.log('Post récupéré:', this.post);
      },
      error => {
        console.error('Erreur lors de la récupération du post:', error);
      }
    );


    this.loadComments();
  }


  // Modifiez la méthode loadComments
  loadComments(): void {
    this.ps.getCommentsByPostId(this.postId).subscribe({
      next: (data: any) => {
        this.comments = data.map((comment: any) => ({
          ...comment,
          isEditing: false,
          editedContent: comment.content,
          blocked: comment.blocked // Ajout crucial
        }));
      },
      error: (err) => console.error(err)
    });
  }

// Ajoutez ces nouvelles méthodes
  toggleEdit(comment: any): void {
    comment.isEditing = !comment.isEditing;
    if (!comment.isEditing) {
      comment.editedContent = comment.content;
    }
  }

  cancelEdit(comment: any): void {
    comment.isEditing = false;
    comment.editedContent = comment.content;
  }

  saveComment(comment: any): void {
    if (!comment.editedContent.trim()) return;

    this.ps.updateComment(comment.id, comment.editedContent).subscribe({
      next: () => {
        comment.content = comment.editedContent;
        comment.isEditing = false;
      },
      error: (err) => console.error('Erreur mise à jour', err)
    });
  }

  deleteComment(commentId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      this.ps.deleteComment(commentId).subscribe({
        next: () => {
          this.comments = this.comments.filter(c => c.id !== commentId);
        },
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }


  submitComment() {
    console.log("Tentative d'envoi du commentaire...");

    if (!this.newComment.content.trim()) return;

    this.ps.addCommentToPost(this.postId, this.currentUserId, this.newComment.content).subscribe(
      () => {
        console.log('Commentaire ajouté avec succès');
        this.newComment.content = '';
        this.newComment.name = "";
        this.loadComments();  // Recharge les commentaires
      },
      error => console.error('Erreur ajout commentaire', error)
    );
  }


}


//  <a [routerLink]="['/post', post?.postId]" class="edgtf-post-info-author-link">

// <h3 class="edgtf-page-title entry-title">{{ post.publisher.firstName }}</h3></a>
