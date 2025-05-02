import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Post } from '../models/Post'

import { PostService} from "../services/community/post.service";
import { TranslateService } from '@ngx-translate/core';
import {AuthenticationService} from "../../user/services/login/authentification.service";



@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent {

post: Post = {
  title: '',
  content: '',
  communityId: 1, // à adapter
  publisherId: this.authService.currentUserValue?.userId || 0 // Modifier ici
};


selectedFiles: File[] = [];

constructor( private postService: PostService, // Remplacer HttpClient
public authService: AuthenticationService, private translate: TranslateService) {
  translate.setDefaultLang('fr');
  translate.use('fr');
}


// Pour changer la langue
switchLanguage(lang: string) {
  this.translate.use(lang);
}


onFileChange(event: any): void {
  this.selectedFiles = Array.from(event.target.files);
}

onSubmit(): void {
  if (!this.authService.currentUserValue) {
    alert(this.translate.instant('ERRORS.LOGIN_REQUIRED'));
    return;
  }

  const postData = {
    title: this.post.title,
    content: this.post.content,
    communityId: this.post.communityId,
    publisherId: this.authService.currentUserValue.userId // Doit correspondre à l'ID utilisateur
  };

   // Vérifiez dans la console


  this.postService.createPost(this.post, this.selectedFiles[0]).subscribe({
    next: (res) => {
      alert(this.translate.instant('POST_FORM.SUCCESS'));
      this.resetForm();
    },
    error: (err) => {
      console.error('Erreur détaillée:', err);
      alert(this.translate.instant('ERRORS.POST_SUBMIT'));
    }
  });
}

resetForm(): void {
  this.post = {
    title: '',
    content: '',
    communityId: 1,
    publisherId: this.authService.currentUserValue?.userId || 0
  };
  this.selectedFiles = [];
}


isExtracting = false;

// Nouvelle méthode d'extraction de texte
extractTextFromImage(): void {
  if (!this.selectedFiles?.length) {
    alert(this.translate.instant('ERRORS.SELECT_IMAGE'));
    return;
  }

  this.isExtracting = true;
  const imageFile = this.selectedFiles[0];

  this.postService.extractTextFromImage(imageFile).subscribe({
    next: (text) => {
      this.post.content = text;
      this.isExtracting = false;
      alert(this.translate.instant('POST_FORM.TEXT_EXTRACTED'));
    },
    error: (err) => {
      console.error('Erreur:', err);
      this.isExtracting = false;
      alert(this.translate.instant('ERRORS.TEXT_EXTRACTION_FAILED'));
    }
  });
}
}
