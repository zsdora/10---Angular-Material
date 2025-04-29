import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/components/header/header/header.component';
import { RoomService } from '../shared/services/room.service';
import { Room } from '../shared/model/Room';

@Component({
  selector: 'app-room-management',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './room-management.component.html',
  styleUrls: ['./room-management.component.scss']
})
export class RoomManagementComponent implements OnInit {
  displayedColumns: string[] = ['hotelName', 'roomType', 'price', 'status', 'actions'];
  dataSource = new MatTableDataSource<Room>([]);

  constructor(private roomService: RoomService) {}

  ngOnInit() {
    this.loadRooms();
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
}
