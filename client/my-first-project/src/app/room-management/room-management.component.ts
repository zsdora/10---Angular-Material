import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HeaderComponent } from '../shared/components/header/header/header.component';
import { RoomService } from '../shared/services/room.service';
import { Room } from '../shared/model/Room';
import { NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { HotelService } from '../shared/services/hotel.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-room-management',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatExpansionModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './room-management.component.html',
  styleUrls: ['./room-management.component.scss']
})
export class RoomManagementComponent implements OnInit {
  displayedColumns: string[] = ['hotelName', 'roomType', 'price', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  hotels: any[] = [];
  roomStatuses = [
    { value: 'Available', displayName: 'Available', color: 'green' },
    { value: 'Booked', displayName: 'Booked', color: 'red' },
  ];
  newRoom = {
    hotel_id: '',
    room_type: '',
    price: 0,
    status: 'Available'
  };

  constructor(
    private roomService: RoomService,
    private hotelService: HotelService,
    private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadRooms();
    this.loadHotels();
  }

  loadHotels() {
    this.hotelService.getHotels().subscribe({
      next: (hotels) => {
        this.hotels = hotels;
      },
      error: (error) => {
        console.error('Error loading hotels:', error);
        this.snackBar.open('Error loading hotels', 'Close', { duration: 3000 });
      }
    });
  }

  addRoom(form: NgForm) {
    if (form.valid) {
      console.log('Submitting room data:', this.newRoom); // Add debugging
      this.roomService.createRoom(this.newRoom).subscribe({
        next: (room) => {
          console.log('Room created successfully:', room);
          this.snackBar.open('Room added successfully', 'Close', { duration: 3000 });
          this.loadRooms();
          this.resetForm(form);
        },
        error: (error) => {
          console.error('Error details:', error);
          this.snackBar.open(
            error.error?.message || 'Error adding room',
            'Close',
            { duration: 3000 }
          );
        }
      });
    }
  }

  getRoomStatusColor(status: string): string {
    const statusObj = this.roomStatuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'black';
  }

  loadRooms() {
    this.roomService.getAllRooms().subscribe({
      next: (rooms) => {
        this.dataSource.data = rooms;
        console.log('Loaded rooms:', rooms);
      },
      error: (error) => {
        console.error('Error fetching rooms:', error);
      }
    });
  }

  editRoom(room: Room) {
    console.log('Edit room:', room);
    // Implement edit functionality
  }

  deleteRoom(roomId: string) {
    this.roomService.deleteRoom(roomId).subscribe({
      next: () => {
        this.loadRooms();
      },
      error: (error) => {
        console.error('Error deleting room:', error);
      }
    });
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.newRoom = {
      hotel_id: '',
      room_type: '',
      price: 0,
      status: 'Available'
    };
  }
}
