import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/components/header/header/header.component';

@Component({
  selector: 'app-hotel-management',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './hotel-management.component.html',
  styleUrl: './hotel-management.component.scss'
})
export class HotelManagementComponent {

}
