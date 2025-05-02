import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ReclamationService } from '../services/reclamation.service'; // Ensure this path is correct
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/user/services/login/authentification.service'; // Ensure this path is correct
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { catchError, EMPTY } from 'rxjs'; // Import catchError and EMPTY for error handling

// Interface for the prediction response from the backend
interface PredictionResponse {
  predictedType: string;
}

// Interfaces for Reclamation and Attachment (keep as they are)
interface Reclamation {
  id_rec: number;
  clientId: number;
  typeRec: string;
  status: string;
  description: string;
  dateCreation?: string;
  attachments?: Attachment[];
  adminResponse?: string;
}

interface Attachment {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
}

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit {
  submitted = false;
  reclamationForm!: FormGroup; // Use definite assignment or initialize properly
  selectedFile?: File;
  message = '';
  showForm = false;
  actionType: 'add' | 'update' = 'add';
  reclamations: Reclamation[] = [];
  selectedRec?: Reclamation;

  // Preview properties
  previewUrl: SafeResourceUrl | null = null;
  showPreviewModal = false;
  currentFileType = '';

  // Upload preview properties
  showUploadPreviewModal = false;
  uploadPreviewUrl: SafeResourceUrl | null = null;
  currentUploadFileType = '';

  constructor(
    private rs: ReclamationService,
    private authService: AuthenticationService,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef 
  ) {
    // Initialize the form group
    this.reclamationForm = new FormGroup({
      
      typeRec: new FormControl('', Validators.required),
      status: new FormControl('OUVERT'), // Keep this if status is always open initially
      description: new FormControl('', Validators.required),
      removeAttachments: new FormControl(false)
    });
  }

  ngOnInit() {
    this.getReclamations();
  }

  // <<< --- ADD onDescriptionBlur METHOD --- >>>
  onDescriptionBlur(): void {
    const descriptionControl = this.reclamationForm.get('description');
    // Check if the description field has a value and is valid (e.g., meets min/max length if added)
    if (descriptionControl && descriptionControl.value && descriptionControl.valid) {
      // Call the helper function to trigger the backend prediction
      this.triggerTypePrediction(descriptionControl.value);
    }
  }
  
private triggerTypePrediction(description: string): void {
  const typeControl = this.reclamationForm.get('typeRec');

  // Vérifiez juste que le contrôle existe et que la description n'est pas vide
  if (typeControl && description && description.trim() !== '') {
      console.log('Requesting type prediction from backend for:', description.substring(0, 50) + '...');
      this.rs.predictType(description).pipe(
          catchError(err => {
              console.error("Backend prediction API error:", err);
              this.message = "Erreur lors de la suggestion automatique du type.";
              return EMPTY; // Stop the Observable chain on error
          })
      ).subscribe((response: PredictionResponse) => {
          console.log('Frontend: Received prediction response:', response);

          if (response && response.predictedType) {
              console.log('Frontend: Patching form with suggested type:', response.predictedType);
              // Mettez à jour la valeur du contrôle typeRec, écrasant la valeur précédente si elle existait
              typeControl.patchValue(response.predictedType);
          } else {
               console.warn("Prediction response received, but no predictedType found.");
               
          }
      });
  } else if (!description || description.trim() === '') {
       console.log('Frontend: Description is empty, skipping prediction.');
       
  } else {
       console.log('Frontend: Type control is missing.');
  }
}  
 
  isImageFile(fileType: string | undefined): boolean { /* ... */ return fileType ? fileType.startsWith('image/') : false; }
  isPdfFile(fileType: string | undefined): boolean { /* ... */ return fileType === 'application/pdf'; }

  showAddForm() {
    this.actionType = 'add';
    this.selectedRec = undefined;
    this.reclamationForm.reset({
      typeRec: '', // <<< --- RESET typeRec --- >>>
      status: 'OUVERT',
      description: '',
      removeAttachments: false
    });
    this.submitted = false; // Reset submitted flag
    this.showForm = true;
    this.selectedFile = undefined;
  }

  showUpdateForm(reclamation: Reclamation) {
    this.actionType = 'update';
    this.selectedRec = reclamation;
    this.reclamationForm.patchValue({
      typeRec: reclamation.typeRec, // Populate with existing type
      status: reclamation.status,
      description: reclamation.description,
      removeAttachments: false
    });
     this.submitted = false; // Reset submitted flag
    this.showForm = true;
    this.selectedFile = undefined;
  }

  cancelForm() {
    this.showForm = false;
    this.selectedRec = undefined;
    this.reclamationForm.reset({
        typeRec: '', // <<< --- RESET typeRec --- >>>
        status: 'OUVERT',
        description: '',
        removeAttachments: false
    });
    this.selectedFile = undefined;
    this.submitted = false; // Reset submitted flag
    this.message = ''; // Clear message
  }

  onFileSelected(event: any): void {  this.selectedFile = event.target.files[0]; if (this.selectedFile) { this.currentUploadFileType = this.selectedFile.type; } }
  previewUploadedFile(): void {if (!this.selectedFile) return;
    this.closeUploadPreview();
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.uploadPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
      this.currentUploadFileType = this.selectedFile?.type || '';
      this.showUploadPreviewModal = true;
    }; 
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      this.message = "Erreur lors de la lecture du fichier pour l'aperçu.";
      this.closeUploadPreview();
    };
   
   if (this.isImageFile(this.selectedFile.type) || this.isPdfFile(this.selectedFile.type)) {
     reader.readAsDataURL(this.selectedFile);
   } else {
     this.currentUploadFileType = this.selectedFile.type;
     this.showUploadPreviewModal = true;
   }}
  closeUploadPreview(): void { this.showUploadPreviewModal = false;
    if (this.uploadPreviewUrl) {
    const url = (this.uploadPreviewUrl as any).changingThisBreaksApplicationSecurity;
    if (typeof url === 'string' && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
    }
    }
    this.uploadPreviewUrl = null;
    this.currentUploadFileType = ''; }

  save() {
    this.submitted = true; // Mark as submitted attempt
    this.message = ''; // Clear previous messages

    if (this.reclamationForm.invalid) {
      console.warn("Form is invalid. Cannot save.", this.reclamationForm.value);
       // You might want to scroll to the first invalid field or show a general error message
       this.message = "Veuillez corriger les erreurs dans le formulaire.";
      return; // Prevent submission
    }

    const formValues = this.reclamationForm.getRawValue();
    console.log('Form valid, proceeding to save:', formValues);

    if (this.actionType === 'add') {
      this.addReclamation(formValues);
    } else if (this.actionType === 'update' && this.selectedRec) {
      this.updateReclamation(this.selectedRec.id_rec, formValues);
    }
  }

  addReclamation(formValues: any) {
    // Payload includes typeRec selected by user (or suggested by AI if not changed)
    const payload = {
      typeRec: formValues.typeRec,
      description: formValues.description,
      status: formValues.status || 'OUVERT' // Default status if needed
    };
    console.log('Adding reclamation with payload:', payload);
    this.rs.addRec(payload).subscribe({
      next: (res: any) => {
        this.message = 'Réclamation ajoutée avec succès !';
        if (this.selectedFile && res?.id_rec) {
          this.uploadAttachment(res.id_rec, () => {
             this.getReclamations();
             this.cancelForm(); // Use cancelForm to reset state
          });
        } else {
           this.getReclamations();
           this.cancelForm(); // Use cancelForm to reset state
        }
      },
      error: (err) => {
        console.error('Erreur serveur lors de l\'ajout:', err);
        this.message = "Erreur lors de l'ajout de la réclamation.";
        this.submitted = false; // Allow retry maybe?
      }
    });
  }


  updateReclamation(id: number, formValues: any) {
    const payload: any = {
      typeRec: formValues.typeRec, // User's final selected type
      description: formValues.description,
      status: formValues.status
    };
    if (formValues.removeAttachments) {
      payload.attachments = [];
    }
    console.log(`Updating reclamation ${id} with payload:`, payload);
    this.rs.updateRec(id, payload).subscribe({
      next: () => {
        this.message = 'Réclamation mise à jour avec succès !';
        if (this.selectedFile) {
          this.uploadAttachment(id, () => {
            this.getReclamations();
            this.cancelForm();
          });
        } else {
          this.getReclamations();
          this.cancelForm();
        }
      },
      error: (err) => {
        console.error(`Erreur lors de la mise à jour ${id}:`, err);
        this.message = 'Erreur lors de la mise à jour de la réclamation.';
         this.submitted = false; // Allow retry maybe?
      }
    });
  }

  private uploadAttachment(reclamationId: number, onComplete?: () => void) {
    if (!this.selectedFile) {
    onComplete?.();
    return;
    }
    this.rs.uploadAttachment(reclamationId, this.selectedFile).subscribe({
      next: (attachInfo) => {
        console.log('Fichier attaché avec succès:', attachInfo);
        onComplete?.();
      },
      error: (err) => {
        console.error("Erreur lors de l'upload du fichier :", err);
        this.message += " (Attention: Le nouveau fichier n'a pas pu être attaché)";
        onComplete?.();
      }
    });
  }
  getReclamations() {
    this.rs.getRecsByUser().subscribe({
    next: (res: Reclamation[]) => {
    this.reclamations = res;
    },
    error: (err) => {
    console.error('Erreur lors de la récupération des réclamations :', err);
    this.message = 'Erreur lors du chargement des réclamations';
    }
    });
    }
    removeRec(id_rec: number) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) {
      this.rs.removeRec(id_rec).subscribe({
      next: () => {
      this.message = 'Réclamation supprimée avec succès';
      this.getReclamations();
      if (this.showForm && this.selectedRec?.id_rec === id_rec) {
      this.cancelForm();
      }
      },
      error: (err) => {
      console.error('Erreur lors de la suppression de la réclamation :', err);
      this.message = 'Erreur lors de la suppression';
      }
      });
      }
      }
      previewAttachment(attachment: Attachment) {
        this.currentFileType = attachment.fileType;
        this.rs.previewAttachment(attachment.id).subscribe({
        next: (blob) => {
        this.closePreview();
        const fileURL = URL.createObjectURL(blob);
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        this.currentFileType = attachment.fileType;
        this.showPreviewModal = true;
        },
        error: (err) => {
        console.error('Preview error:', err);
        this.message = 'Preview non disponible pour ce fichier';
        this.closePreview();
        }
        });
        }
        closePreview() {
          this.showPreviewModal = false;
          if (this.previewUrl) {
          const url = (this.previewUrl as any).changingThisBreaksApplicationSecurity;
          if (typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
          }
          }
          this.previewUrl = null;
          this.currentFileType = '';
          }
          

} 