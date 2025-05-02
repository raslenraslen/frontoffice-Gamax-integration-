import {Component, OnInit, AfterViewInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../services/login/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const video = document.getElementById('bg-video') as HTMLVideoElement;
    if (video) {
      video.play().catch(error => {
        console.error('Error attempting to play', error);
      });
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f['email'].value, this.f['password'].value)
      .subscribe(
        data => {
          console.log('Login successful', data);
          this.successMessage = 'Login successful';
          this.loading = false;
          setTimeout(() => {
            this.router.navigateByUrl('/').then(() => {
              window.location.reload(); // Recharge la page
            });
          });
        },
        error => {
          console.error('Login failed', error);
          this.error = error;
          this.loading = false;
        });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
