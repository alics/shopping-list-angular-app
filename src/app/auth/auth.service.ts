import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { root } from 'rxjs/internal-compatibility';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({ providedIn: root })
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCvHHUKSNd4Phr8TMH9Y51E0CA1UrDCsys',
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );
  }
}