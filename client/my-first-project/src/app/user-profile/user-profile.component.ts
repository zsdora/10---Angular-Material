import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

interface Booking {
  hotelName: string;
  startDate: Date;
  endDate: Date;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatTabsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  // Formok
  personalForm: FormGroup;
  passwordForm: FormGroup;
  notificationForm: FormGroup;

  // Demo adatok
  user = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+36123456789',
    address: 'Budapest, Fő utca 1.'
  };

  bookings: Booking[] = [
    {
      hotelName: 'Deluxe Hotel',
      startDate: new Date(2024, 5, 15),
      endDate: new Date(2024, 5, 20),
      price: 320,
      status: 'confirmed'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.personalForm = this.fb.group({
      name: [this.user.name, Validators.required],
      email: [{value: this.user.email, disabled: true}],
      phone: [this.user.phone],
      address: [this.user.address]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    this.notificationForm = this.fb.group({
      emailConfirmation: [true],
      emailCancellation: [true]
    });
  }

  ngOnInit(): void {
    // Valós adatok betöltése API hívással
    // this.authService.getUserProfile().subscribe(...);
  }

  updatePersonal() {
    if (this.personalForm.valid) {
      // API hívás a frissítéshez
      console.log('Personal data updated:', this.personalForm.value);
    }
  }

  changePassword() {
    if (this.passwordForm.valid && this.passwordForm.value.newPassword === this.passwordForm.value.confirmPassword) {
      // API hívás jelszóváltoztatáshoz
      console.log('Password changed');
    }
  }

  updateNotifications() {
    // API hívás értesítési beállításokhoz
    console.log('Notification settings updated:', this.notificationForm.value);
  }

  // Státusz címkék formázása
  statusLabel(status: string): string {
    return {
      'confirmed': 'Megerősítve',
      'pending': 'Függőben',
      'cancelled': 'Lemondva'
    }[status] || '';
  }
}
