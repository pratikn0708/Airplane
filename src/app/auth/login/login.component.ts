import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public hide = true;
  public signInForm: FormGroup;
  private allUsers: any[];
  private userSubscription: Subscription = new Subscription();
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  activeLink = '';

  ngOnInit() {
    this.signInForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.userSubscription = this.authService
      .signIn()
      .subscribe((response: any) => {
        this.allUsers = response;
      });

  }

  public onSignIn(): void {
    if (this.signInForm.invalid) {
      return;
    }
    const data = this.signInForm.value;
    const users = this.allUsers.filter(user => {
      return user.email === data.username && user.password === data.password;
    });

    if (users.length > 0) {
      alert('Successfully Logged in');
      this.authService.setAuthStatusListener(users[0].flag);
      this.router.navigate(['/flights']);
      this.activeLink = 'flights';
    } else {
      alert('Invalid Credentials');
    }
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}


