import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, catchError, map} from 'rxjs';
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly apiUrl = `${environment.apiUrl}/community/posts`;
  private readonly apiurlComments = `${environment.apiUrl}/community/comments`;
  private readonly apiurlReactions = `${environment.apiUrl}/community/reactions`;

  constructor(private http: HttpClient) {
  }


  getReactions(postId: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiurlReactions}/post/${postId}`);
  }

  toggleReaction(postId: number, reactionType: string, userId: number): Observable<any> {
    const headers = new HttpHeaders().set('X-User-Id', userId.toString());
    return this.http.post<any>(
      `${this.apiurlReactions}/${postId}?type=${reactionType}`,
      null,
      {headers}
    );
  }

  getReactionsByPost(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiurlReactions}/${postId}`);
  }

  getReactionSummary(postId: number): Observable<any> {
    return this.http.get<any>(`${this.apiurlReactions}/${postId}/summary`);
  }

  updateComment(commentId: number, content: string): Observable<any> {
    return this.http.put(`${this.apiurlComments}/${commentId}`, {content});
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiurlComments}/${commentId}`);
  }


  createPost(postData: any, file?: File): Observable<any> {
    console.log('Création du post dans le service - Données:', postData);

    const formData = new FormData();
    const postBlob = new Blob([JSON.stringify(postData)], {type: 'application/json'});
    formData.append('post', postBlob);

    if (file) {
      console.log('Fichier joint détecté:', file.name);
      formData.append('file', file);
    }

    console.log('FormData préparé:', formData);

    return this.http.post(`${this.apiUrl}`, formData);
  }

  getPosts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getPostById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // //  Récupérer les commentaires d’un post
  // getCommentsByPostId(postId: number): Observable<any> {
  //   return this.http.get<any>(`${this.apiurlComments}/${postId}`);
  // }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiurlComments}/post/${postId}`);
  }


  //  Ajouter un commentaire à un post
  addCommentToPost(postId: number, userId: number, content: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('content', content);

    return this.http.post<any>(`${this.apiurlComments}/add/${postId}`, null, {params});
  }


  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

// post.service.ts
  addReaction(postId: number, reactionType: string): Observable<any> {
    return this.http.post(`${this.apiurlReactions}/add?postId=${postId}&reactionType=${reactionType}`, {});
  }

  removeReaction(postId: number, reactionType: string): Observable<any> {
    return this.http.delete(`${this.apiurlReactions}/remove?postId=${postId}&reactionType=${reactionType}`);
  }

  getUserReactions(userId: number): Observable<any> {
    return this.http.get(`${this.apiurlReactions}/user/${userId}/reactions`);
  }

  extractTextFromImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ text: string }>(`${this.apiUrl}/extract-text`, formData).pipe(
      map(response => response.text),
      catchError(err => {
        throw err.error?.error || 'Erreur inconnue';
      })
    );


  }


}
