import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/components/header/header/header.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/model/User';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatTabsModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  bookings: any[] = [];
  personalForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.personalForm = this.fb.group({
      name: [''],
      email: ['', { disabled: true }],
      phone: [''],
      nickname: [''],
      address: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log('Fetching user data...');
    this.authService.getCurrentUser().subscribe({
        next: (userData: User) => {
            console.log('Received user data:', userData);
            this.user = userData;
            this.personalForm.patchValue({
                email: userData.email,
                name: userData.name || '',
                nickname: userData.nickname || '',
                address: userData.address || ''
            });
        },
        error: (error) => {
            console.error('Error details:', error);
            if (error.status === 401) {
                console.log('User not authenticated');
                // Handle unauthorized access
            } else if (error.status === 404) {
                console.log('User profile not found');
                // Handle missing profile
            }
        }
    });
}

  updatePersonal() {
    if (this.personalForm.valid) {
      const updatedData = {
        name: this.personalForm.get('name')?.value,
        address: this.personalForm.get('address')?.value,
        nickname: this.personalForm.get('nickname')?.value
      };
      console.log('Updating profile with:', updatedData);
      this.authService.updateProfile(updatedData).subscribe({
        next: () => console.log('Profile updated successfully'),
        error: (error) => console.error('Update error:', error)
      });
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      if (this.passwordForm.get('newPassword')?.value !==
          this.passwordForm.get('confirmPassword')?.value) {
        console.error('Passwords do not match');
        return;
      }

      const passwordData = {
        currentPassword: this.passwordForm.get('currentPassword')?.value,
        newPassword: this.passwordForm.get('newPassword')?.value
      };

      this.authService.changePassword(passwordData).subscribe({
        next: () => {
          console.log('Password changed successfully');
          this.passwordForm.reset();
        },
        error: (error) => console.error('Password change error:', error)
      });
    }
  }
}
