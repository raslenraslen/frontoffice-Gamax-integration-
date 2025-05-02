import { Component ,OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { PostService} from "../services/community/post.service";
import { AuthenticationService} from "../../user/services/login/authentification.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: any[] = [];  // Tableau pour stocker les posts
  currentUrl: string = '';

  // Ajoute dans ta classe PostListComponent

postsPerPage: number = 3;
currentPage: number = 1;
paginatedPosts: any[] = [];
totalPages: number = 0;
userId :any;
baseUrl: string = environment.apiUrlImg;

constructor(private postService: PostService, private authService: AuthenticationService) {
  console.log('Constructor - authService.currentUserValue:', this.authService.currentUserValue);
}

  ngOnInit(): void {
    /////////////////// this.userId = this.authService.getUserId();  // Récupère l'ID de l'utilisateur////////////
    // Tu peux charger ton post ici, si tu veux afficher un post en particulier


    // Appel du service pour obtenir les posts lors du chargement du composant
    console.log('ngOnInit start - authService state:', this.authService.currentUserValue);

    if (this.authService.currentUserValue) {
      this.userId = this.authService.currentUserValue.userId;
      console.log('User ID récupéré:', this.userId);
      this.loadUserReactions();
    } else {
      console.warn('Aucun utilisateur connecté détecté');
    }

    this.getPosts();
    this.currentUrl = window.location.href;
    // this.loadUserReactions();
    // Par :
    this.loadPosts();
    if (this.authService.currentUserValue) {
      this.userId = this.authService.currentUserValue.userId;
      this.loadUserReactions();
    }


  }



  showPostForm = false;
newPost = {
  title: '',
  content: '',

};
previewImage: string | null = null;

// Ajoute ces modifications
selectedFile: File | undefined; // Au lieu de null

// Ajoutez ces variables dans votre classe
searchTerm = '';
filteredPosts: any[] = [];
allPosts: any[] = []; // Pour garder une copie de tous les posts
// Modifie onFileSelected

userReactions: Map<number, string> = new Map();

// Ajouter ces propriétés
isExtracting = false;
extractionError: string | null = null;
// Ajouter ces variables
isListening = false;
recognition: any;

  reactionTypes = ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'];
  localStorageKey = 'post_reactions';
  private loadPosts() {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.allPosts = posts.map((post: any) => ({
          ...post,
          reactionSummary: post.reactionSummary || { counts: {}, total: 0 }
        }));
        this.filterPosts();

         // Charger les réactions APRÈS avoir reçu les posts
      if (this.authService.currentUserValue) {
        this.userId = this.authService.currentUserValue.userId;
        this.loadUserReactions();
      }
    }
  });

  }

  private loadUserReactions() {
    if (!this.userId || this.allPosts.length === 0) return;

    const requests = this.allPosts.map(post =>
      this.postService.getReactionsByPost(post.postId).pipe(
        map(reactions => ({
          postId: post.postId,
          userReaction: reactions.find(r => r.user.id === this.userId)?.type
        }))
      )
    );

    forkJoin(requests).subscribe(results => {
      results.forEach(result => {
        if (result.userReaction) {
          this.userReactions.set(result.postId, result.userReaction);
        }
      });
    });
  }
  getReactionEmoji(type: string): string {
    const emojis: { [key: string]: string } = {
      LIKE: '👍',
      LOVE: '❤️',
      HAHA: '😆',
      WOW: '😮',
      SAD: '😢',
      ANGRY: '😡'
    };
    return emojis[type] || '';
  }

  isReactionActive(postId: number, type: string): boolean {
    const reactions = JSON.parse(localStorage.getItem(this.localStorageKey) || '{}');
    return !!reactions[`${postId}_${type}`];
  }

  toggleReaction(post: any, type: string) {
    if (!this.userId) {
      alert('Veuillez vous connecter pour réagir');
      return;
    }

    this.postService.toggleReaction(post.postId, type, this.userId).subscribe({
      next: (updatedReaction) => {
        const currentReaction = this.userReactions.get(post.postId);

        // Mise à jour des compteurs
        if (currentReaction) {
          post.reactionSummary.counts[currentReaction]--;
          post.reactionSummary.total--;
        }

        if (currentReaction !== type) {
          post.reactionSummary.counts[type] = (post.reactionSummary.counts[type] || 0) + 1;
          post.reactionSummary.total++;
          this.userReactions.set(post.postId, type);
        } else {
          this.userReactions.delete(post.postId);
        }
      },
      error: (err) => console.error('Erreur de réaction', err)
    });
  }


// Méthode de reconnaissance vocale
startListening(field: 'title' | 'content') {
  const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

  if (!SpeechRecognition) {
    alert("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
    return;
  }

  this.recognition = new SpeechRecognition();
  this.recognition.lang = this.getBrowserLanguage();
  this.recognition.interimResults = false;
  this.recognition.maxAlternatives = 1;

  this.recognition.start();
  this.isListening = true;

  this.recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    if (field === 'title') {
      this.newPost.title = transcript;
    } else {
      this.newPost.content = transcript;
    }
    this.isListening = false;
  };

  this.recognition.onerror = (event: any) => {
    console.error('Erreur de reconnaissance vocale:', event.error);
    this.isListening = false;
  };
}

// Méthode de lecture vocale
readSelectedText() {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();

  if (selectedText) {
    const utterance = new SpeechSynthesisUtterance(selectedText);
    utterance.lang = this.getBrowserLanguage();
    speechSynthesis.speak(utterance);
  } else {
    alert("Veuillez sélectionner du texte à lire.");
  }
}

// Méthode utilitaire pour la langue
private getBrowserLanguage(): string {
  return navigator.language || 'fr-FR'; // Fallback en français
}
// Ajouter cette méthode
extractTextFromImage() {
  if (!this.selectedFile) {
    this.extractionError = 'Veuillez sélectionner une image';
    return;
  }

  this.isExtracting = true;
  this.extractionError = null;

  this.postService.extractTextFromImage(this.selectedFile).subscribe({
    next: (text) => {
      this.newPost.content = text;
      this.isExtracting = false;
    },
    error: (err) => {
      console.error('Erreur extraction:', err);
      this.extractionError = 'Échec de l\'extraction du texte';
      this.isExtracting = false;
    }
  });
}





hasReacted(post: any, type: string): boolean {
  return this.userReactions.get(post.postId) === type;
}

// post-list.component.ts


private refreshPostData(postId: number) {
  this.postService.getPostById(postId).subscribe(updatedPost => {
    const index = this.posts.findIndex(p => p.postId === postId);
    if (index > -1) {
      this.posts[index] = updatedPost;
      this.setPaginatedPosts();
    }
  });
}


onFileSelected(event: any) {
  const file = event.target.files[0];
  this.selectedFile = file || undefined; // Utilise undefined au lieu de null
  this.extractionError = null;


  // Prévisualisation
  if (this.selectedFile) {
    const reader = new FileReader();
    reader.onload = () => this.previewImage = reader.result as string;
    reader.readAsDataURL(this.selectedFile);
  }
}

// Modifie submitPost
submitPost() {
console.log('Début de submitPost - User:', this.authService.currentUserValue);

    if (!this.authService.currentUserValue) {
      console.error('Tentative de post sans utilisateur connecté');
      alert('Connectez-vous d\'abord !');
      return;
    }

    const publisherId = this.authService.currentUserValue.userId;
    console.log('Création du post avec publisherId:', publisherId);

    const postData = {
      title: this.newPost.title,
      content: this.newPost.content,
      communityId: 1,
      publisherId: publisherId // Ajout critique ici
    };

    console.log('Données du post à envoyer:', JSON.stringify(postData));

    this.postService.createPost(postData, this.selectedFile).subscribe({
      next: (res) => {
      console.log('Post créé avec succès !', res);
      this.showPostForm = false;
      this.resetForm();
      // this.getPosts(); // Recharge la liste des posts
      this.postService.getPosts().subscribe(posts => {
        this.allPosts = posts;
        this.posts = [...this.allPosts];
        this.filterPosts();
        this.paginatedPosts = this.posts.slice(0, this.postsPerPage);
      });
    },
    error: (err) => {
      console.error('Erreur complète:', err);
      console.error('Message d\'erreur:', err.message);
      console.error('Erreur de validation:', err.error?.errors);
      this.showPostForm = false;
    }
  });
}

// Ajoute cette méthode pour réinitialiser le formulaire
resetForm() {
  this.newPost = { title: '', content: '' };
  this.previewImage = null;
  this.selectedFile = undefined; // Réinitialise à undefined

}

// Modifiez la méthode getPosts()
getPosts(): void {
  this.postService.getPosts().subscribe({
    next: (data) => {
      this.allPosts = data;
      this.posts = data;
      this.totalPages = Math.ceil(this.posts.length / this.postsPerPage);
      this.setPaginatedPosts();
    },
    error: (error) => console.error('Erreur lors de la récupération des posts', error)
  });
}

// Ajoutez ces nouvelles méthodes
filterPosts(): void {
  if (!this.searchTerm) {
    this.posts = [...this.allPosts];
  } else {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.posts = this.allPosts.filter(post =>
      post.title.toLowerCase().includes(searchTermLower) ||
      post.content.toLowerCase().includes(searchTermLower))
  }

  this.currentPage = 1;
  this.totalPages = Math.ceil(this.posts.length / this.postsPerPage);
  this.setPaginatedPosts();
}

clearSearch(): void {
  this.searchTerm = '';
  this.filterPosts();
}


 // Modifiez setPaginatedPosts() pour prendre en compte la recherche
setPaginatedPosts(): void {
  const startIndex = (this.currentPage - 1) * this.postsPerPage;
  const endIndex = startIndex + this.postsPerPage;
  this.paginatedPosts = this.posts.slice(startIndex, endIndex);
  }


  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.setPaginatedPosts();
    }
  }


  likePost(postId: number): void {
    // Appelle ton backend pour enregistrer le like
    console.log('Liked post ID:', postId);
  }

  share(platform: string, post: any): void {
    const postUrl = `https://ton-domaine.com/post/${post.postId}`;
    const title = encodeURIComponent(post.title);
    const description = encodeURIComponent(post.content);
    const image = post.assets?.length ? encodeURIComponent(post.assets[0].asset_url) : '';

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `http://www.facebook.com/sharer.php?u=${postUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title} ${postUrl}`;
        break;
      case 'vk':
        shareUrl = `http://vkontakte.ru/share.php?url=${postUrl}&title=${title}&description=${description}&image=${image}`;
        break;
    }

    window.open(shareUrl, '_blank', 'toolbar=0,status=0,width=800,height=400');
  }

// Exemple de userId, à remplacer par celui récupéré via un service d'authentification
// userId = 1;
post: any; // Tu devras définir un type pour post en fonction de tes données




  // Mettre à jour le compteur local des réactions
  updateReactionCount(reactionType: string): void {
    // Si la réaction existe déjà dans reactionCounts, on l'incrémente
    if (this.post.reactionCounts[reactionType] !== undefined) {
      this.post.reactionCounts[reactionType] += 1;  // Incrémente le compteur pour cette réaction
    } else {
      this.post.reactionCounts[reactionType] = 1;  // Si la réaction n'existe pas, on l'initialise à 1
    }
  }
  }



  // reactToPost(postId: number, type: string) {
  //   const reaction = {
  //     postId: postId,
  //     type: type,
  //     userId: this.currentUserId  // ou prends le user depuis ton AuthService
  //   };

  //   this.postService.addReactionToPost(reaction).subscribe({
  //     next: (res) => {
  //       console.log("Réaction ajoutée !");
  //       this.getPosts(); // pour recharger les données
  //     },
  //     error: (err) => console.error("Erreur:", err)
  //   });
  // }



