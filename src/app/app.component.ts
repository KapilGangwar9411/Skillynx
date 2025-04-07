import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'skillynx';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authService.currentUser$.subscribe(user => {
      if (user && this.router.url === '/login') {
        // If user is logged in and on the login page, redirect to dashboard
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
