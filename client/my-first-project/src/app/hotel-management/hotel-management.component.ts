import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/components/header/header/header.component';
import { HotelService } from '../shared/services/hotel.service';
import { Hotel } from '../shared/model/Hotel';

@Component({
  selector: 'app-hotel-management',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './hotel-management.component.html',
  styleUrl: './hotel-management.component.scss'
})
export class HotelManagementComponent {
deleteHotel(arg0: any) {
throw new Error('Method not implemented.');
}
editHotel(_t49: any) {
throw new Error('Method not implemented.');
}
  displayedColumns: string[] = ['name', 'city', 'amenities', 'actions'];
  dataSource = new MatTableDataSource<Hotel>([]);

  constructor(private hotelService: HotelService) {}

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.hotelService.getAllHotels().subscribe({
      next: (hotels) => {
        this.dataSource.data = hotels;
        console.log('Loaded hotels:', hotels);
      },
      error: (error) => {
        console.error('Error fetching hotels:', error);
      }
    });
  }
}
