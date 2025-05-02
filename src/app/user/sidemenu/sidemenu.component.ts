import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/login/authentification.service';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {
  currentUser: any;
  selectedFile: File | null = null;
  isFileUploaded: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private http: HttpClient
  ) {
    this.authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x;
      this.isFileUploaded = !!this.currentUser.profilePictureUrl;
    });
  }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.isFileUploaded = !!this.currentUser?.profilePictureUrl;
  }

  handleAuthAction() {
    if (this.currentUser) {
      this.logout();
    } else {
      this.login();
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authenticationService.logout();
    this.currentUser = null;
    this.isFileUploaded = false;
    this.router.navigate(['/login']);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.uploadFile();
    }
  }

  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.selectedFile as Blob, this.selectedFile?.name);

    this.http.post<any>(`${environment.apiUrlImg}/api/userupload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          console.log('Upload Progress: ' + Math.round(event.loaded / event.total! * 100) + '%');
        } else if (event.type === HttpEventType.Response) {
          console.log('File uploaded URL:', event.body.fileUrl);
          this.currentUser.profilePictureUrl = event.body.fileUrl;
          this.updateUserProfilePictureUrl(event.body.fileUrl);
          this.isFileUploaded = true;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Upload failed', error);
      }
    });
  }

  updateUserProfilePictureUrl(url: string) {
    this.http.put<any>('http://localhost:8080/api/updateProfilePicture', { userId: this.currentUser.userId, profilePictureUrl: url })
      .subscribe({
        next: (response) => {
          console.log('Profile picture URL updated', response);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Update failed', error);
        }
      });
  }

  navigateToUserDetails() {
    this.router.navigate(['/user-details']);
  }
}
