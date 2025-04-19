import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit, OnDestroy {
  bookings: any[] = [];

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    // Átmenetes háttér beállítása csak ezen az oldalon
    this.renderer.setStyle(document.body, 'background', 'linear-gradient(135deg, #357ae1, #070e43)');
    this.renderer.setStyle(document.body, 'minHeight', '100vh');

    // Demo adatok
    this.bookings = [
      {
        hotelName: 'Ocean View Hotel',
        roomType: 'Deluxe',
        startDate: new Date(2025, 5, 12),
        endDate: new Date(2025, 5, 15),
        price: 320,
        status: 'Confirmed'
      },
      {
        hotelName: 'Mountain Resort',
        roomType: 'Standard',
        startDate: new Date(2025, 6, 2),
        endDate: new Date(2025, 6, 6),
        price: 210,
        status: 'Cancelled'
      }
    ];
  }

  ngOnDestroy(): void {
    // Navigáláskor visszaállítjuk az alap hátteret
    this.renderer.removeStyle(document.body, 'background');
    this.renderer.removeStyle(document.body, 'minHeight');
  }
}
