import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isAdmin: boolean = false;
  private subscription!: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get currentRoute(): string {
    return this.router.url;
  }

  ngOnInit() {
    this.subscription = this.authService.userRole$.subscribe(role => {
      this.isAdmin = role === 'admin';
    });
  }

  checkAdminStatus() {
    this.isAdmin = this.authService.isUserAdmin();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: (err) => console.error('Logout failed:', err)
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
