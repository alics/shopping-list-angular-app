import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { root } from 'rxjs/internal-compatibility';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: root })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCvHHUKSNd4Phr8TMH9Y51E0CA1UrDCsys',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((rspData) => {
          this.handleAuthentication(
            rspData.email,
            rspData.localId,
            rspData.idToken,
            +rspData.expiresIn
          );
        })
      );
  }

  signIn(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCvHHUKSNd4Phr8TMH9Y51E0CA1UrDCsys',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((rspData) => {
          this.handleAuthentication(
            rspData.email,
            rspData.localId,
            rspData.idToken,
            +rspData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loggedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpDate)
    );

    if (loggedUser.token) {
      this.user.next(loggedUser);

      const expDuration =
        new Date(userData._tokenExpDate).getTime() - new Date().getTime();
      this.autoLogout(expDuration);
    }
  }

  signOut() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpTimer) {
      clearTimeout(this.tokenExpTimer);
    }
    this.tokenExpTimer = null;
  }

  autoLogout(expDuration: number) {
    console.log(expDuration);
    this.tokenExpTimer = setTimeout(() => {
      this.signOut();
    }, expDuration);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errMsg = 'An unknown error accurred';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errMsg);
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errMsg = 'This email already exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errMsg = 'Invalid email address';
        break;
      case 'INVALID_PASSWORD':
        errMsg = 'Invalid password';
        break;
    }
    return throwError(errMsg);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expDate);

    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
