import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    //{ path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent) },                                    //, canActivate: [authGuard]
    { path: 'signup', loadComponent: () => import('./signup/signup.component').then((c) => c.SignupComponent) },
    { path: 'user-management', loadComponent: () => import('./user-management/user-management.component').then((c) => c.UserManagementComponent) },
    { path: 'dashboard',
      loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
      //canActivate: [authGuard],
    },
    { path: 'hotels', loadComponent: () => import('./hotel-list/hotel-list.component').then(m => m.HotelListComponent) },
    { path: 'bookings', loadComponent: () => import('./booking-list/booking-list.component').then(m => m.BookingListComponent) },
    { path: 'profile', loadComponent: () => import('./user-profile/user-profile.component').then(m => m.UserProfileComponent) },
    { path: '**', redirectTo: 'login' }
];
