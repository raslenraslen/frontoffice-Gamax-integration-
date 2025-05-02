import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/login/authentification.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: any;

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.user = this.authenticationService.currentUserValue;
   
    if (this.user) {
      this.user.fullName = `${this.user.firstName} ${this.user.lastName}`;
      this.user.age = this.calculateAge(this.user.birthday);
    }
  }

  calculateAge(birthday: string): number {
    const birthDate = new Date(birthday);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs); // milliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      console.log('Selected file:', file.name);
      
    }
  }
}