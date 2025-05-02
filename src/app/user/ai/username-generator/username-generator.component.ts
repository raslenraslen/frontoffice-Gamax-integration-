// Dans src/app/components/ai/username-generator/username-generator.component.ts

import { Component, EventEmitter, Output } from '@angular/core';
import { AiService } from '../../services/ai/ai.service';

@Component({
  selector: 'app-username-generator',
  templateUrl: './username-generator.component.html',
  styleUrls: ['./username-generator.component.css']
})
export class UsernameGeneratorComponent {

  @Output() usernameSelected = new EventEmitter<string>();

  aiDescription: string = '';
  suggestedUsernames: string[] = []; // Reste une liste de strings pour l'affichage
  isLoadingSuggestions: boolean = false;
  aiError: string | null = null;

  constructor(
    private aiService: AiService
  ) { }

  generateSuggestions(): void {
    if (!this.aiDescription || this.aiDescription.trim().length < 3) {
      this.aiError = 'Veuillez entrer une description d\'au moins 3 caractères.';
      this.suggestedUsernames = [];
      return;
    }

    this.isLoadingSuggestions = true;
    this.aiError = null;
    this.suggestedUsernames = [];

    this.aiService.generateUsernames(this.aiDescription) // Appelle le service qui retourne Observable<string>
      .subscribe({
        next: (responseString: string) => { // Réceptionne une seule chaîne de texte
          console.log("--- Début du subscribe (next) dans composant ---");
          console.log("Réponse chaîne reçue dans next:", responseString);
          this.isLoadingSuggestions = false;
          this.aiError = null; // Réinitialiser l'erreur en cas de succès

          // Diviser la chaîne en lignes (suggestions)
          // Filtrer les lignes vides ou nulles après trim()
          const lines = responseString.split('\n');
          const suggestions = lines.map(line => line.trim()).filter(line => line.length > 0);

          if (!suggestions || suggestions.length === 0) {
               // Si après division et nettoyage, il n'y a pas de suggestions valides
               this.suggestedUsernames = [];
               this.aiError = 'Aucune suggestion valide trouvée pour cette description.'; // Afficher un message clair
               console.warn('Aucune suggestion valide trouvée après division du texte:', responseString);
          }
          else {
               // Cas normal: suggestions valides reçues et divisées
               this.suggestedUsernames = suggestions;
               console.log('Suggestions valides stockées pour affichage:', this.suggestedUsernames);
          }

           console.log("--- Fin du subscribe (next) dans composant ---");
        },
        error: (error) => { // Ce bloc est appelé en cas d'ERREUR (si AiService.handleError retourne throwError)
            console.error("--- Début du subscribe (error) dans composant ---");
            console.error("Erreur capturée dans le subscribe.error:", error);
            this.isLoadingSuggestions = false;
            this.suggestedUsernames = []; // Vider les suggestions
            // Afficher le message d'erreur provenant du service AiService.handleError
            this.aiError = error.message || 'Une erreur est survenue lors de la génération des noms.';
            console.log("--- Fin du subscribe (error) dans composant ---");
        }
      });
  }

  selectUsername(username: string): void {
    this.usernameSelected.emit(username);
  }
}