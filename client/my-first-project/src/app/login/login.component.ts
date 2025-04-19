import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  login() {
    if (this.email && this.password) {
      this.errorMessage = '';
      this.isLoading = true;

      this.authService.login(this.email, this.password).subscribe({
        next: (data) => {
          if (data) {
            // navigation
            console.log(data);
            this.router.navigateByUrl('/user-management');
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.errorMessage = 'Invalid email or password. Please try again.';
          this.isLoading = false;
        },
      });
    } else {
      this.errorMessage = 'Please enter both email and password.';
    }
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }
}
