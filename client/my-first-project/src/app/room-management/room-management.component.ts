import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/components/header/header/header.component';

@Component({
  selector: 'app-room-management',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './room-management.component.html',
  styleUrl: './room-management.component.scss'
})
export class RoomManagementComponent {

}
