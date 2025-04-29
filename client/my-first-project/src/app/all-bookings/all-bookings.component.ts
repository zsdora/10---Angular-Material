import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/components/header/header/header.component';

@Component({
  selector: 'app-all-bookings',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './all-bookings.component.html',
  styleUrl: './all-bookings.component.scss'
})
export class AllBookingsComponent {

}
