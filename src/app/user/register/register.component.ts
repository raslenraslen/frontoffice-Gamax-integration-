import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/login/authentification.service';
import { AbstractControl } from '@angular/forms';

import { AiService } from '../services/ai/ai.service';

declare var grecaptcha: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  usernameCheckLoading: boolean = false;
  usernameAvailability: 'available' | 'taken' | 'error' | null = null;
  usernameAvailabilityMessage: string | null = null;
  usernameTakenError: boolean = false;
  takenUsername: string = '';
  suggestedUsernames: string[] = [];
  isLoadingSuggestions: boolean = false;
  suggestionError: string | null = null;
  takenUsernameForSuggestion: string = '';
  showAiGenerator: boolean = false;



  get f() { return this.registerForm.controls; }
  get usernameControl(): AbstractControl | null {
    return this.registerForm.get('username');
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,

    private aiService: AiService


  ) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      username: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      birthday: ['', Validators.required]
    });
    this.usernameControl?.valueChanges.subscribe(() => {
      this.resetUsernameCheckState();
  });

    this.registerForm.get('username')?.valueChanges.subscribe(() => {
        this.resetSuggestionState();
    });
  }

  ngAfterViewInit() {

    const video = document.getElementById('bg-video') as HTMLVideoElement;
    if (video) {
      video.play().catch(error => {
        console.error('Error attempting to play video:', error);
      });
    }
     if (typeof grecaptcha !== 'undefined') {
         // Logique reCAPTCHA ici si nécessaire (ex: grecaptcha.render(...))
     } else {
         console.warn('reCAPTCHA script not loaded');
     }
  }


  onSubmit() {
    this.submitted = true;
    this.resetUsernameCheckState();
    this.resetSuggestionState();


    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = ''; // Réinitialiser l'erreur générique du formulaire

    // Appeler votre service d'authentification pour l'inscription
    this.authenticationService.register(this.registerForm.value)
      .subscribe({
        next: () => {
          console.log('Inscription réussie.');
          // Optionnel: afficher un message de succès avant de rediriger
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Erreur d\'inscription:', err);
          this.loading = false;

           // --- NOUVEAU: Gérer l'erreur spécifique "nom d'utilisateur pris" ---
           // La manière d'obtenir le message exact dépend de votre service d'authentification
           // Si votre service propage l'erreur HttpErrorResponse, vous pourriez vérifier error.status ou error.error
           // Si votre service retourne un Observable qui émet une erreur avec un message, vérifiez error.message
           const errorMessage = err.message || JSON.stringify(err); // Adaptez cette ligne si nécessaire

           if (errorMessage.includes('Le nom d\'utilisateur') && errorMessage.includes('est déjà pris') /* Exemple basé sur un message clair */) {
               this.usernameTakenError = true; // Activer l'indicateur d'erreur "nom pris"
               this.takenUsername = this.registerForm.get('username')?.value; // Stocker le nom pris
               this.error = 'Ce nom d\'utilisateur est déjà pris.'; // Afficher le message général d'erreur (celui-ci ou celui du backend si vous voulez)
               this.suggestionError = null; // Réinitialiser l'erreur de suggestion
               this.suggestedUsernames = []; // Vider les suggestions précédentes
               console.log("Nom d'utilisateur pris. Affichage du bouton de suggestion.");

           } else {

               this.error = errorMessage; // Afficher l'erreur générique
               this.usernameTakenError = false; // S'assurer que l'indicateur est faux
           }

        }
      });
  }

  // Méthode de navigation existante
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  // Méthode reCAPTCHA existante (si utilisée)
  executeRecaptcha() {
     if (typeof grecaptcha !== 'undefined') {
        grecaptcha.execute(); // Adaptez l'appel si nécessaire
     }
  }

  // --- NOUVEAU: Méthode pour gérer le toggle de la première fonctionnalité IA (générateur libre) si vous la gardez ---
  // Cette méthode est appelée par le bouton "Suggérer un nom avec l'IA" dans le HTML
  toggleAiGenerator(): void {
    // Optionnel: cacher la section de suggestion de noms similaires quand on ouvre le générateur libre
     if (this.usernameTakenError) {
         this.resetSuggestionState();
     }
    this.showAiGenerator = !this.showAiGenerator;
    console.log("Générateur IA affiché:", this.showAiGenerator);
     // Optionnel: réinitialiser le générateur libre quand on le cache
     // if (!this.showAiGenerator) { ... }
  }

  // --- NOUVEAU: Méthode pour gérer la sélection d'un nom depuis le générateur libre (si vous le gardez) ---
  // Appelé par l'événement usernameSelected du composant UsernameGeneratorComponent
  handleUsernameSelectedFromAi(selectedUsername: string): void {
    console.log("Nom sélectionné reçu du composant IA (générateur libre):", selectedUsername);
    // Mettre le nom sélectionné dans le champ 'username' du formulaire principal
    const usernameControl = this.registerForm.get('username');
    if (usernameControl) {
         usernameControl.setValue(selectedUsername);
         usernameControl.markAsDirty();
         usernameControl.markAsTouched();
         // Cacher le générateur libre après la sélection
         this.showAiGenerator = false;
    } else {
        console.error("Contrôle 'username' non trouvé dans le formulaire d'inscription.");
    }
  }

  resetUsernameCheckState(): void {
    this.usernameCheckLoading = false;
    this.usernameAvailability = null;
    this.usernameAvailabilityMessage = null;
    this.takenUsernameForSuggestion = '';
    this.suggestedUsernames = [];
    this.isLoadingSuggestions = false;
    this.suggestionError = null;
    // If you use the first AI feature with toggle, uncomment this line
    // this.showAiGenerator = false;
}

checkUsernameAvailability(): void {
    const username = this.usernameControl?.value;
    if (!username || username.trim().length < 3) {
        this.resetUsernameCheckState();
        this.usernameAvailability = 'error';
        this.usernameAvailabilityMessage = 'Veuillez entrer un nom d\'utilisateur valide (min 3 caractères).';
        return;
    }

    this.resetUsernameCheckState();
    this.usernameCheckLoading = true;

    // Adjust this subscribe based on what your AuthenticationService.checkUsername returns
    // Currently assuming it returns Observable<any> with {available: boolean, message: string}
    this.authenticationService.checkUsername(username)
        .subscribe({
            next: (response: any) => {
                 this.usernameCheckLoading = false;
                 if (response && typeof response.available === 'boolean') {
                     this.usernameAvailability = response.available ? 'available' : 'taken';
                     this.usernameAvailabilityMessage = response.message;
                     if (response.available) {
                         this.takenUsernameForSuggestion = '';
                     } else {
                          this.takenUsernameForSuggestion = username;
                     }
                 } else {
                      console.error("Unexpected response from checkUsername:", response);
                      this.usernameAvailability = 'error';
                      this.usernameAvailabilityMessage = 'Réponse inattendue lors de la vérification.';
                      this.takenUsernameForSuggestion = '';
                 }
            },
            error: (error) => {
                 console.error("Error checking username availability:", error);
                 this.usernameCheckLoading = false;
                 this.usernameAvailability = 'error';
                 this.usernameAvailabilityMessage = error.message || 'Impossible de vérifier la disponibilité. Réessayez.';
                 this.takenUsernameForSuggestion = '';
            }
        });
}


suggestSimilarAlternatives(): void {
  if (!this.takenUsernameForSuggestion) {
       console.error("No taken username to suggest alternatives for.");
       this.suggestionError = 'Username to suggest for not identified.';
       return;
  }

  this.isLoadingSuggestions = true;
  this.suggestionError = null;
  this.suggestedUsernames = [];

  console.log("Requesting similar suggestions for:", this.takenUsernameForSuggestion);

  this.aiService.suggestSimilarUsernames(this.takenUsernameForSuggestion)
      .subscribe({
          next: (suggestions: string[]) => {
               console.log("Similar suggestions received:", suggestions);
               this.isLoadingSuggestions = false;

               if (suggestions && suggestions.length === 1 &&
                  (suggestions[0].startsWith("Erreur") || suggestions[0].startsWith("Une erreur") || suggestions[0].startsWith("Impossible") || suggestions[0].includes("API Google AI") || suggestions[0].includes("Réseau") || suggestions[0].includes("bloquée") || suggestions[0].includes("valide trouvée") || suggestions[0].includes("Format d'erreur inattendu"))) {
                    this.suggestionError = suggestions[0];
                    this.suggestedUsernames = [];
               } else if (!suggestions || suggestions.length === 0) {
                    this.suggestedUsernames = [];
                    this.suggestionError = 'Aucune suggestion similaire disponible trouvée pour ce nom.';
               } else {
                    this.suggestedUsernames = suggestions;
                    this.suggestionError = null;
               }
          },
          error: (error) => {
               console.error("Error calling AI suggestion service:", error);
               this.isLoadingSuggestions = false;
               this.suggestedUsernames = [];
               this.suggestionError = error.message || 'An error occurred while searching for suggestions.';
          }
      });
}
selectSuggestedUsername(suggestedUsername: string): void {
  const usernameControl = this.usernameControl;
  if (usernameControl) {
       usernameControl.setValue(suggestedUsername);
       usernameControl.markAsDirty();
       usernameControl.markAsTouched();
       this.resetUsernameCheckState();
  } else {
      console.error("Username control not found when selecting suggestion.");
  }
}


   resetSuggestionState(): void {
       this.usernameTakenError = false;
       this.takenUsername = '';
       this.suggestedUsernames = [];
       this.isLoadingSuggestions = false;
       this.suggestionError = null;

   }

}
