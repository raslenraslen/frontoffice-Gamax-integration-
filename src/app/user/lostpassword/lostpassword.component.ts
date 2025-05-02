import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LostpasswordService } from '../services/lostpassword/lostpassword.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lostpassword',
  templateUrl: './lostpassword.component.html',
  styleUrls: ['./lostpassword.component.css']
})
export class LostpasswordComponent {

  resetForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private lostpasswordService: LostpasswordService
  ) {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.resetForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.resetForm.invalid) {
      return;
    }

    this.lostpasswordService.requestPasswordReset(this.f["email"].value).subscribe({
      next: () => {
        this.successMessage = 'Password reset email sent successfully';
        this.router.navigate(['/resetpassword'], { queryParams: { email: this.f["email"].value } });
      },
      
    });
  }
}