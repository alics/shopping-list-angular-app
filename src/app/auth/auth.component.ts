import { Router } from '@angular/router';
import { AuthResponseData, AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { ViewHostDirective } from '../shared/placeholder/view-host.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  @ViewChild(ViewHostDirective, { static: true })
  private viewHost?: ViewHostDirective;
  private closeSub: Subscription;

  constructor(private authService: AuthService, private router: Router, private container: ViewContainerRef) {}


  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.signIn(email, password);
    } else {
      authObs = this.authService.signUp(email, password);
    }

    authObs.subscribe(
      (responseData) => {
        console.log(responseData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      (errorMsg) => {
        this.error = errorMsg;
        this.isLoading = false;
        this.showErrorAlert(errorMsg);
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = null;

  }

  private showErrorAlert(message: string) {
    const hostViewContainerRef = this.viewHost.container;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(AlertComponent);
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear()
    })

  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe()
    }
  }

}
