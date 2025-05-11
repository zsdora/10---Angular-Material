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
  editingRoom: Room | null = null;

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

  // Load available hotels for room assignment
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

  // Create new room
  addRoom(form: NgForm) {
    if (form.valid) {
      console.log('Submitting room data:', this.newRoom);
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

  // Get color for room status display
  getRoomStatusColor(status: string): string {
    const statusObj = this.roomStatuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'black';
  }

  // Load all rooms from service
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

  // Room editing
  editRoom(room: Room) {
    this.editingRoom = { ...room }; // Create a copy to avoid direct modification
    console.log('Editing room:', this.editingRoom);
  }

  cancelEdit() {
    this.editingRoom = null;
  }

  // Save room changes
  saveRoomChanges() {
    if (this.editingRoom && this.validateRoom(this.editingRoom)) {
      this.roomService.updateRoom(this.editingRoom._id, this.editingRoom).subscribe({
        next: (updatedRoom) => {
          console.log('Room updated successfully:', updatedRoom);
          this.snackBar.open('Room updated successfully', 'Close', { duration: 3000 });
          this.loadRooms();
          this.editingRoom = null;
        },
        error: (error) => {
          console.error('Error updating room:', error);
          this.snackBar.open('Error updating room', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
    }
  }

  // Validate room data
  validateRoom(room: Room): boolean {
    return !!(room.hotel_id && room.room_type && room.price > 0);
  }

   // Delete room
  deleteRoom(roomId: string) {
    if (window.confirm('Are you sure you want to delete this room?')) {
      this.roomService.deleteRoom(roomId).subscribe({
        next: () => {
          this.snackBar.open('Room deleted successfully', 'Close', { duration: 3000 });
          this.loadRooms();
        },
        error: (error) => {
          console.error('Error deleting room:', error);
          this.snackBar.open('Error deleting room', 'Close', { duration: 3000 });
        }
      });
    }
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
