import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
         signOut, signInWithPopup, GoogleAuthProvider, User } from '@angular/fire/auth';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();

    // Subscribe to auth state changes
    auth.onAuthStateChanged(user => {
      this.currentUserSubject.next(user);
    });
  }

  // Email and Password login
  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // Google login
  loginWithGoogle(): Observable<any> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider));
  }

  // Register new user
  register(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  // Logout
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  // Check if user is authenticated
  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
