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
    { path: 'hotels/:id', loadComponent: () => import('./hotel-details/hotel-details.component').then(m => m.HotelDetailsComponent)},
    { path: 'bookings', loadComponent: () => import('./booking-list/booking-list.component').then(m => m.BookingListComponent) },
    { path: 'profile', loadComponent: () => import('./user-profile/user-profile.component').then(m => m.UserProfileComponent) },
    { path: 'all-bookings', loadComponent: () => import('./all-bookings/all-bookings.component').then(m => m.AllBookingsComponent)},
    { path: 'hotel-management', loadComponent: () => import('./hotel-management/hotel-management.component').then(m => m.HotelManagementComponent)},
    { path: 'room-management', loadComponent: () => import('./room-management/room-management.component').then(m => m.RoomManagementComponent)},
    { path: '**', redirectTo: 'login' }
];
