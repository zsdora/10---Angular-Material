import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/components/header/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="dashboard-content">
      <h1>Welcome to InnBound</h1>
      <!-- Add dashboard content here -->
    </div>
  `,
  styles: [`
    .dashboard-content {
      padding-top: 64px; /* Height of the toolbar */
      margin: 20px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  user: any = null; // Itt töltsd be az aktuális usert (pl. AuthService-ből)
  stats = {
    hotels: 0,
    bookings: 0,
    users: 0,
    myBookings: 0,
    nextBooking: null
  };

  ngOnInit() {
    // Például AuthService-ből töltsd be a felhasználót és a statisztikákat
    // this.user = this.authService.getCurrentUser();
    // this.stats = await this.dashboardService.getStats(this.user.role);
  }
}
