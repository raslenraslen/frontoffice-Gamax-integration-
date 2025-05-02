import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LostpasswordService } from '../services/lostpassword/lostpassword.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm!: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  email!: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private lostpasswordService: LostpasswordService
  ) { }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.resetForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validator: this.mustMatch('newPassword', 'confirmPassword')
    });

    this.lostpasswordService.validateResetEmail(this.email).subscribe({
      next: () => {
        // Email is valid
      },
      error: () => {
        this.errorMessage = 'Invalid or expired email';
        this.router.navigate(['/lostpassword']);
      }
    });
  }

  get f() { return this.resetForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.resetForm.invalid) {
      return;
    }

    this.lostpasswordService.resetPassword(this.email, this.f["newPassword"].value).subscribe({
      next: () => {
        this.successMessage = 'Password has been reset successfully';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // Rediriger après 2 secondes
      },
      error: (error) => {
        this.errorMessage = 'Password has been reset successfully';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // 

      }
    });
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}