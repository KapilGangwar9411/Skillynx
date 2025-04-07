import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';

      const email = this.loginForm.get('usernameOrEmail')?.value;
      const password = this.loginForm.get('password')?.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login successful', response);
          // Navigate to the dashboard or home page after successful login
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error', error);
          this.loginError = this.getFirebaseErrorMessage(error.code);
        }
      });
    }
  }

  signInWithGoogle(): void {
    this.isLoading = true;
    this.loginError = '';

    this.authService.loginWithGoogle().subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Google login successful', response);
        // Navigate to the dashboard or home page after successful login
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Google login error', error);
        this.loginError = this.getFirebaseErrorMessage(error.code);
      }
    });
  }

  private getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-credential':
        return 'Invalid login credentials.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Try again later.';
      case 'auth/operation-not-allowed':
        return 'This login method is not allowed.';
      case 'auth/popup-closed-by-user':
        return 'Login popup was closed before completing the process.';
      default:
        return 'An error occurred during login. Please try again.';
    }
  }
}
