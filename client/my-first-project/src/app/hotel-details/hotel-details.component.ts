import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../shared/components/header/header/header.component';
import { HotelService } from '../shared/services/hotel.service';
import { Hotel } from '../shared/model/Hotel';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    HeaderComponent
  ],
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.scss'],
})
export class HotelDetailsComponent implements OnInit {
  hotel: Hotel | null = null;
  showFallbackIcon = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.hotelService.getHotelById(id).subscribe({
        next: (hotel) => this.hotel = hotel,
        error: (error) => console.error('Error fetching hotel:', error)
      });
    }
  }

  goBack() {
    this.router.navigate(['/hotels']);
  }

  bookHotel() {
    // TODO: Implement booking functionality
    console.log('Booking hotel:', this.hotel?._id);
  }

  onImageError(event: Event): void {
    this.showFallbackIcon = true;
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.style.display = 'none';
    }
  }
}
